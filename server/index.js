import express from 'express';
import { Pool } from 'pg';
import Razorpay from 'razorpay';
import crypto from 'crypto';
import { Server } from 'socket.io';
import http from 'http';
import cors from 'cors';
import dotenv from 'dotenv';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

dotenv.config();

const app = express();
const server = http.createServer(app);

// Initialize Socket.io with CORS for your React Vite frontend
const io = new Server(server, {
    cors: { origin: "http://localhost:5173", methods: ["GET", "POST"] }
});

app.use(cors());
app.use(express.json());

// 1. Neon DB Connection
const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: { rejectUnauthorized: false }
});

// 2. Razorpay Configuration
const razorpay = new Razorpay({
    key_id: process.env.RAZORPAY_KEY_ID,
    key_secret: process.env.RAZORPAY_KEY_SECRET,
});

// ==========================================
// 🔐 AUTHENTICATION
// ==========================================

// Registration Route
app.post('/auth/register', async (req, res) => {
    const { name, email, password } = req.body;
    try {
        const userCheck = await pool.query('SELECT * FROM users WHERE email = $1', [email]);
        if (userCheck.rows.length > 0) {
            return res.status(400).json({ message: "User already exists" });
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        await pool.query(
            'INSERT INTO users (full_name, email, password_hash) VALUES ($1, $2, $3)',
            [name, email, hashedPassword]
        );

        res.status(201).json({ message: "User created" });
    } catch (err) {
        res.status(500).json({ message: "Registration failed" });
    }
});

app.post('/auth/login', async (req, res) => {
    const { email, password } = req.body;
    try {
        const result = await pool.query('SELECT * FROM users WHERE email = $1', [email]);
        if (result.rows.length === 0) {
            return res.status(401).json({ message: "Invalid Credentials" });
        }

        const user = result.rows[0];
        const isMatch = await bcrypt.compare(password, user.password_hash);
        
        if (!isMatch) return res.status(401).json({ message: "Invalid Credentials" });

        const token = jwt.sign({ userId: user.id }, process.env.JWT_SECRET || 'secret', { expiresIn: '24h' });

        res.json({ token, userId: user.id, message: "Login success" });
    } catch (err) {
        res.status(500).json({ message: "Login failed" });
    }
});

// ==========================================
// 🚜 EQUIPMENT ROUTES
// ==========================================

// 1. Fetch ALL available equipment (Public)
app.get('/api/equipment', async (req, res) => {
    try {
        const result = await pool.query('SELECT * FROM equipment WHERE is_available = true');
        res.json(result.rows);
    } catch (err) {
        res.status(500).json({ error: "Failed to fetch equipment" });
    }
});

// 2. Fetch USER SPECIFIC equipment (For "My Listings" Page) - [YOUR FEATURE]
app.get('/api/equipment/user/:userId', async (req, res) => {
    const { userId } = req.params;
    try {
        const result = await pool.query(
            'SELECT * FROM equipment WHERE owner_id = $1', 
            [userId]
        );
        res.json(result.rows);
    } catch (err) {
        console.error("Error fetching user items:", err);
        res.status(500).json({ error: "Failed to fetch user items" });
    }
});

// 3. Add Equipment (For Owners)
app.post('/api/add-equipment', async (req, res) => {
    const { userId, businessName, machineryType, priceRate, capacity } = req.body;

    if (!userId || !businessName || !machineryType || !priceRate) {
        return res.status(400).json({ error: "Missing required fields" });
    }

    try {
        const image_url = `/${machineryType}.jpeg`; 
        await pool.query(
            `INSERT INTO equipment 
            (owner_id, business_name, machinery_type, price_rate, capacity_litres, is_available, image_url) 
            VALUES ($1, $2, $3, $4, $5, true, $6)`,
            [userId, businessName, machineryType, priceRate, capacity || 0, image_url]
        );
        res.status(201).json({ message: "Equipment listed successfully!" });
    } catch (err) {
        console.error("Error adding equipment:", err);
        res.status(500).json({ error: "Database error while adding product." });
    }
});

// ==========================================
// 💳 PAYMENTS & ORDERS
// ==========================================

// Create Razorpay Order
app.post('/api/create-order-razorpay', async (req, res) => {
    try {
        const { totalPrice } = req.body;
        const options = {
            amount: Math.round(totalPrice * 100), // Convert INR to paise
            currency: "INR",
            receipt: `rcpt_${Date.now()}`,
        };
        const order = await razorpay.orders.create(options);
        res.json(order);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Verify Payment and Create Order
app.post('/api/payment-verification', async (req, res) => {
    const { 
        razorpay_order_id, 
        razorpay_payment_id, 
        razorpay_signature, 
        tankerId, 
        deliveryAddress, 
        totalPrice, 
        userId,
        rentalHours
    } = req.body;

    const body = razorpay_order_id + "|" + razorpay_payment_id;
    const expectedSignature = crypto
        .createHmac('sha256', process.env.RAZORPAY_KEY_SECRET)
        .update(body.toString())
        .digest('hex');

    if (expectedSignature === razorpay_signature) {
        try {
            const result = await pool.query(
                `INSERT INTO orders (user_id, equipment_id, delivery_address, total_price, rental_hours, order_status, payment_id) 
                 VALUES ($1, $2, $3, $4, $5, 'En-Route', $6) RETURNING id`,
                [userId, tankerId, deliveryAddress, totalPrice, rentalHours || 1, razorpay_payment_id]
            );
            
            res.json({ success: true, orderId: result.rows[0].id });
        } catch (dbErr) {
            console.error("Database Error:", dbErr);
            res.status(500).json({ success: false, message: "Database Error" });
        }
    } else {
        res.status(400).json({ success: false, message: "Invalid Payment Signature" });
    }
});

// Get Order by ID
app.get('/api/orders/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const result = await pool.query('SELECT * FROM orders WHERE id = $1', [id]);
        if (result.rows.length === 0) return res.status(404).send('Order not found');
        res.json(result.rows[0]);
    } catch (err) {
        res.status(500).send('Server Error');
    }
});

// ==========================================
// 👤 USER FEATURES (YOURS)
// ==========================================

// 1. My Bookings (For Renters)
app.get('/api/my-bookings/:userId', async (req, res) => {
    const { userId } = req.params;
    try {
        const result = await pool.query(
            `SELECT 
                o.id, 
                o.created_at, 
                o.total_price, 
                o.order_status,
                e.id as equipment_id,      
                e.business_name, 
                e.machinery_type, 
                e.image_url,
                e.is_available,            
                e.price_rate as current_price, 
                e.capacity_litres,
                u.full_name as owner_name,
                u.phone_number as owner_phone
             FROM orders o
             JOIN equipment e ON o.equipment_id = e.id
             JOIN users u ON e.owner_id = u.id 
             WHERE o.user_id = $1
             ORDER BY o.created_at DESC`,
            [userId]
        );
        res.json(result.rows);
    } catch (err) {
        console.error("Error fetching bookings:", err);
        res.status(500).json({ error: "Failed to fetch bookings" });
    }
});

// 2. Rental History (For Owners)
app.get('/api/rentals/:equipmentId', async (req, res) => {
    const { equipmentId } = req.params;
    try {
        const result = await pool.query(
            `SELECT 
                o.id, 
                o.created_at, 
                o.total_price, 
                o.order_status,
                u.full_name as renter_name, 
                u.email as renter_contact
             FROM orders o
             JOIN users u ON o.user_id = u.id
             WHERE o.equipment_id = $1
             ORDER BY o.created_at DESC`,
            [equipmentId]
        );
        res.json(result.rows);
    } catch (err) {
        console.error("Error fetching rentals:", err);
        res.status(500).json({ error: "Failed to fetch rentals" });
    }
});

// ==========================================
// 🛠️ SERVICE HISTORY (YOURS)
// ==========================================

// 1. Add Service Record
app.post('/api/service-history', async (req, res) => {
    const { equipmentId, serviceDate, serviceType, description, mechanicName, cost } = req.body;

    try {
        const result = await pool.query(
            `INSERT INTO service_logs 
            (equipment_id, service_date, service_type, description, mechanic_name, cost) 
            VALUES ($1, $2, $3, $4, $5, $6) RETURNING *`,
            [equipmentId, serviceDate, serviceType, description, mechanicName, cost || 0]
        );
        res.status(201).json({ message: "Service record added!", log: result.rows[0] });
    } catch (err) {
        console.error("Error adding service log:", err);
        res.status(500).json({ error: "Failed to add service record" });
    }
});

// 2. Get Service History
app.get('/api/service-history/:equipmentId', async (req, res) => {
    const { equipmentId } = req.params;
    try {
        const result = await pool.query(
            `SELECT * FROM service_logs 
             WHERE equipment_id = $1 
             ORDER BY service_date DESC`, 
            [equipmentId]
        );
        res.json(result.rows);
    } catch (err) {
        console.error("Error fetching service history:", err);
        res.status(500).json({ error: "Failed to fetch history" });
    }
});

// ==========================================
// 🚚 DRIVER PORTAL (TEAMMATES)
// ==========================================

// 1. Get Driver Orders
app.get('/api/driver/orders/:userId', async (req, res) => {
    const { userId } = req.params;
    try {
        const result = await pool.query(
            `SELECT 
                o.id, 
                o.total_price, 
                o.delivery_address, 
                o.order_status, 
                e.machinery_type, 
                e.business_name,
                u.full_name as customer_name,
                u.phone_number as customer_phone
             FROM orders o
             JOIN equipment e ON o.equipment_id = e.id
             JOIN users u ON o.user_id = u.id
             WHERE e.owner_id = $1 
             AND o.order_status IN ('Paid', 'En-Route')
             ORDER BY o.created_at DESC`,
            [userId]
        );
        res.json(result.rows);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Failed to fetch driver orders" });
    }
});

// 2. Update Order Status
app.post('/api/driver/update-status', async (req, res) => {
    const { orderId, status } = req.body; 
    try {
        await pool.query(
            'UPDATE orders SET order_status = $1 WHERE id = $2',
            [status, orderId]
        );
        res.json({ success: true, message: `Order updated to ${status}` });
    } catch (err) {
        res.status(500).json({ error: "Failed to update status" });
    }
});

// ==========================================
// ⭐ REVIEWS & ADMIN (TEAMMATES)
// ==========================================

// Submit Review
app.post('/api/submit-review', async (req, res) => {
    const { orderId, equipmentId, rating, comment } = req.body;
    
    try {
        // 1. Save review
        await pool.query(
            'INSERT INTO reviews (order_id, equipment_id, rating, comment) VALUES ($1, $2, $3, $4)',
            [orderId, equipmentId, rating, comment]
        );

        // 2. Update stats
        const eqResult = await pool.query('SELECT average_rating, rating_count FROM equipment WHERE id = $1', [equipmentId]);
        const { average_rating, rating_count } = eqResult.rows[0];

        const currentAvg = parseFloat(average_rating) || 0;
        const currentCount = parseInt(rating_count) || 0;
        
        const newCount = currentCount + 1;
        const newAvg = ((currentAvg * currentCount) + parseInt(rating)) / newCount;

        await pool.query(
            'UPDATE equipment SET average_rating = $1, rating_count = $2 WHERE id = $3',
            [newAvg, newCount, equipmentId]
        );

        res.json({ success: true, newAvg });
    } catch (err) {
        console.error("Rating Error:", err);
        res.status(500).json({ error: "Failed to submit review" });
    }
});

// Admin Dashboard Analytics
app.get('/api/admin/stats', async (req, res) => {
    try {
        // 1. Revenue
        const revenueQuery = await pool.query(
            "SELECT COALESCE(SUM(total_price), 0) as sum FROM orders WHERE order_status = 'Paid' OR order_status = 'Delivered' OR order_status = 'En-Route'"
        );
        const totalRevenue = revenueQuery.rows[0].sum;

        // 2. Orders Count
        const ordersQuery = await pool.query("SELECT COUNT(*) FROM orders");
        const totalOrders = ordersQuery.rows[0].count;

        // 3. Popularity
        const popularityQuery = await pool.query(`
            SELECT e.machinery_type as name, COUNT(o.id) as value 
            FROM orders o 
            JOIN equipment e ON o.equipment_id = e.id 
            GROUP BY e.machinery_type
        `);

        // 4. Recent Transactions
        const recentQuery = await pool.query(`
            SELECT o.id, e.machinery_type as name, o.total_price as total_amount, o.order_status, u.full_name as user_name
            FROM orders o
            JOIN equipment e ON o.equipment_id = e.id
            JOIN users u ON o.user_id = u.id
            ORDER BY o.created_at DESC LIMIT 5
        `);

        res.json({
            revenue: totalRevenue,
            total_orders: totalOrders,
            popularity: popularityQuery.rows,
            recent_activity: recentQuery.rows
        });

    } catch (err) {
        console.error("ADMIN STATS SQL ERROR:", err.message);
        res.status(500).json({ error: err.message });
    }
});

// ==========================================
// 📍 LIVE GPS TRACKING
// ==========================================

io.on('connection', (socket) => {
    socket.on('join-tracking', (orderId) => {
        socket.join(`order_${orderId}`);
        console.log(`User joined tracking for order: ${orderId}`);
    });
});

app.post('/api/update-location', async (req, res) => {
    const { orderId, latitude, longitude } = req.body;
    io.to(`order_${orderId}`).emit('location-update', { latitude, longitude });
    res.sendStatus(200);
});

server.listen(3000, () => console.log('Backend running on port 3000'));