import React, { useState, useEffect } from 'react';
import { io } from 'socket.io-client';
import { useAuth } from './useAuth'; 
import { useNavigate } from 'react-router-dom';

// ⚠️ IMPORTANT: If testing on mobile, replace 'localhost' with your Laptop's IP (e.g., 192.168.1.5)
const socket = io("http://localhost:3000"); 

const DriverDashboard = () => {
    const { user } = useAuth();
    const navigate = useNavigate();
    
    const [orders, setOrders] = useState([]);
    const [activeOrderId, setActiveOrderId] = useState(null); 
    const [watchId, setWatchId] = useState(null);
    const [loading, setLoading] = useState(true);
    const [gpsStatus, setGpsStatus] = useState("Off"); 

    const fetchMyOrders = async () => {
        if (!user || !user.id) return;
        try {
            const res = await fetch(`http://localhost:3000/api/driver/orders/${user.id}`);
            const data = await res.json();
            setOrders(data);
            
            // Resume active delivery if page was refreshed
            const existingActive = data.find(o => o.order_status === 'En-Route');
            if (existingActive) {
                // Don't auto-start GPS to save battery, but show UI
                setActiveOrderId(existingActive.id); 
                setGpsStatus("Ready to Resume");
            }
        } catch (err) {
            console.error("Failed to load orders", err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (!user) {
            navigate('/login');
        } else {
            fetchMyOrders();
        }
        return () => {
            if (watchId !== null) navigator.geolocation.clearWatch(watchId);
        };
    }, [user, navigate]);

    // --- GPS LOGIC ---
    const startGpsTracking = (orderId) => {
        setActiveOrderId(orderId);
        setGpsStatus("Initializing GPS...");

        if (!navigator.geolocation) {
            alert("Geolocation is not supported by your browser");
            return;
        }

        const id = navigator.geolocation.watchPosition(
            async (pos) => {
                const { latitude, longitude } = pos.coords;
                setGpsStatus(`Broadcasting: ${latitude.toFixed(4)}, ${longitude.toFixed(4)}`);
                
                // 1. Force Join Room (Ensures connection)
                socket.emit("join-tracking", orderId);

                // 2. Send Data to Server
                try {
                    await fetch('http://localhost:3000/api/update-location', {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({
                            orderId: orderId,
                            latitude: latitude,
                            longitude: longitude
                        })
                    });
                } catch (err) {
                    console.error("Failed to send location:", err);
                }
            },
            (err) => {
                console.error("GPS Error:", err);
                setGpsStatus("GPS Error: " + err.message);
            },
            { enableHighAccuracy: true, maximumAge: 0, timeout: 5000 }
        );
        setWatchId(id);
    };

    const handleStartDelivery = async (orderId) => {
        if (activeOrderId) return alert("Finish your current delivery first!");
        
        const confirmStart = window.confirm("Start delivery? GPS tracking will begin.");
        if (!confirmStart) return;

        await fetch('http://localhost:3000/api/driver/update-status', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ orderId, status: 'En-Route' })
        });

        fetchMyOrders(); 
        startGpsTracking(orderId); 
    };

    const handleCompleteDelivery = async (orderId) => {
        if (!window.confirm("Mark as Delivered?")) return;

        if (watchId !== null) {
            navigator.geolocation.clearWatch(watchId);
            setWatchId(null);
        }
        setGpsStatus("Off");

        await fetch('http://localhost:3000/api/driver/update-status', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ orderId, status: 'Delivered' })
        });

        setActiveOrderId(null);
        fetchMyOrders();
        alert("Job Done!");
    };

    if (loading) return <div className="p-10 text-center">Loading Dashboard...</div>;

    return (
        <div className="min-h-screen bg-slate-50 p-6 font-poppins">
            <div className="max-w-4xl mx-auto">
                <h1 className="text-3xl font-bold text-slate-800 mb-6">🚜 Driver Console</h1>

                {/* ACTIVE JOB CARD */}
                {activeOrderId && (
                    <div className="mb-8 bg-blue-600 text-white rounded-3xl p-6 shadow-xl">
                        <div className="flex justify-between items-start">
                            <div>
                                <h2 className="text-xs font-bold uppercase tracking-widest opacity-80 mb-1">Live Status</h2>
                                <h3 className="text-xl font-bold">{gpsStatus}</h3>
                                <p className="mt-2 text-blue-100">Order #{activeOrderId} is active.</p>
                            </div>
                            <div className="h-4 w-4 bg-green-400 rounded-full animate-pulse"></div>
                        </div>
                        
                        {/* Resume Button if GPS isn't running but order is active */}
                        {!watchId && (
                            <button 
                                onClick={() => startGpsTracking(activeOrderId)}
                                className="mt-4 w-full bg-blue-800 text-white py-2 rounded-lg text-sm font-bold"
                            >
                                📡 Resume GPS Signal
                            </button>
                        )}

                        <button 
                            onClick={() => handleCompleteDelivery(activeOrderId)}
                            className="mt-4 w-full bg-white text-blue-700 font-bold py-3 rounded-xl hover:bg-blue-50"
                        >
                            Mark as Delivered
                        </button>
                    </div>
                )}

                {/* ORDERS LIST */}
                <div className="grid gap-6">
                    {orders.filter(o => o.order_status !== 'Delivered').map(order => (
                        <div key={order.id} className="bg-white rounded-2xl p-6 border shadow-sm">
                            <div className="flex flex-col md:flex-row justify-between gap-4">
                                <div>
                                    <span className="bg-purple-100 text-purple-700 text-xs font-bold px-3 py-1 rounded-full">
                                        Order #{order.id}
                                    </span>
                                    <h3 className="font-bold text-lg mt-2">{order.machinery_type}</h3>
                                    <p className="text-slate-500">{order.delivery_address}</p>
                                    
                                    {/* The Open Map Button - Kept for utility */}
                                    <a 
                                        href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(order.delivery_address)}`}
                                        target="_blank"
                                        rel="noreferrer"
                                        className="inline-block mt-3 text-blue-600 font-bold text-sm hover:underline"
                                    >
                                        📍 Open Navigation
                                    </a>
                                </div>

                                {order.order_status === 'Paid' && !activeOrderId && (
                                    <button 
                                        onClick={() => handleStartDelivery(order.id)}
                                        className="bg-slate-900 text-white px-6 py-3 rounded-xl font-bold hover:scale-105 transition-transform"
                                    >
                                        Start Delivery
                                    </button>
                                )}
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default DriverDashboard;