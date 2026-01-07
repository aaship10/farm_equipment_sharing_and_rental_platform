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

// Registration Route
app.post('/auth/register', async (req, res) => {
    const { name, email, password } = req.body;
    try {
        const userCheck = await pool.query('SELECT * FROM users WHERE email = $1', [email]);
        if (userCheck.rows.length > 0) {
            return res.status(400).json({ message: "User already exists" });
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        // Using your column names: full_name, password_hash
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

// --- API ROUTES ---

// Fetch available equipment from the database
app.get('/api/equipment', async (req, res) => {
    try {
        const result = await pool.query('SELECT * FROM equipment WHERE is_available = true');
        res.json(result.rows);
    } catch (err) {
        res.status(500).json({ error: "Failed to fetch equipment" });
    }
});

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

// Verify Payment and Create Order in Database
app.post('/api/payment-verification', async (req, res) => {
    const { 
        razorpay_order_id, 
        razorpay_payment_id, 
        razorpay_signature, 
        tankerId, 
        deliveryAddress, 
        totalPrice, 
        userId 
    } = req.body;

    const body = razorpay_order_id + "|" + razorpay_payment_id;
    const expectedSignature = crypto
        .createHmac('sha256', process.env.RAZORPAY_KEY_SECRET)
        .update(body.toString())
        .digest('hex');

    if (expectedSignature === razorpay_signature) {
        try {
            // Save order to the 'orders' table
            // Note: Ensure your database uses 'equipment_id' for foreign key constraints.
            const result = await pool.query(
                `INSERT INTO orders (user_id, equipment_id, delivery_address, total_price, order_status, payment_id) 
                 VALUES ($1, $2, $3, $4, 'En-Route', $5) RETURNING id`,
                [userId, tankerId, deliveryAddress, totalPrice, razorpay_payment_id]
            );
            
            // Return the new orderId for the frontend to navigate to TrackOrder
            res.json({ success: true, orderId: result.rows[0].id });
        } catch (dbErr) {
            console.error("Database Error:", dbErr);
            res.status(500).json({ success: false, message: "Database Error" });
        }
    } else {
        res.status(400).json({ success: false, message: "Invalid Payment Signature" });
    }
});

// --- LIVE GPS TRACKING ---

// Socket.io room management for specific orders
io.on('connection', (socket) => {
    socket.on('join-tracking', (orderId) => {
        socket.join(`order_${orderId}`);
        console.log(`User joined tracking for order: ${orderId}`);
    });
});

// Endpoint to broadcast driver location updates
app.post('/api/update-location', async (req, res) => {
    const { orderId, latitude, longitude } = req.body;
    
    // Broadcast location to the specific room matching the orderId
    io.to(`order_${orderId}`).emit('location-update', { latitude, longitude });
    res.sendStatus(200);
});

// ... existing imports and setup

// --- DRIVER / OWNER PORTAL API ---

// 1. Get Orders SPECIFIC to the logged-in Owner (Driver)
app.get('/api/driver/orders/:userId', async (req, res) => {
    const { userId } = req.params;
    try {
        // SQL Logic: Join orders with equipment, then filter where equipment.owner_id matches the requested User ID
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

// 2. Update Order Status (e.g., Start Delivery / Finish Delivery)
app.post('/api/driver/update-status', async (req, res) => {
    const { orderId, status } = req.body; // status can be 'En-Route' or 'Delivered'
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

// ... existing socket.io logic (keep this as is) ...

// ... existing imports

// --- ADD PRODUCT API ---
app.post('/api/add-equipment', async (req, res) => {
    const { userId, businessName, machineryType, priceRate, capacity } = req.body;

    if (!userId || !businessName || !machineryType || !priceRate) {
        return res.status(400).json({ error: "Missing required fields" });
    }

    try {
        await pool.query(
            `INSERT INTO equipment 
            (owner_id, business_name, machinery_type, price_rate, capacity_litres, is_available, image_url) 
            VALUES ($1, $2, $3, $4, $5, true, '/p1-1.webp')`,
            [userId, businessName, machineryType, priceRate, capacity || 0]
        );
        res.status(201).json({ message: "Equipment listed successfully!" });
    } catch (err) {
        console.error("Error adding equipment:", err);
        res.status(500).json({ error: "Database error while adding product." });
    }
});

// ... rest of your code

server.listen(3000, () => console.log('Backend running on port 3000'));