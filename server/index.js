import express from 'express';
import { Pool } from 'pg';
import Razorpay from 'razorpay';
import crypto from 'crypto';
import { Server } from 'socket.io';
import http from 'http';
import cors from 'cors';
import dotenv from 'dotenv';

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

server.listen(3000, () => console.log('Backend running on port 3000'));