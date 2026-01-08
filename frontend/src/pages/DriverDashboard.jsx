import React, { useState, useEffect } from 'react';
import { io } from 'socket.io-client';
import { useAuth } from './useAuth'; 
import { useNavigate } from 'react-router-dom';

// ⚠️ SOCKET CONNECTION
const socket = io("http://localhost:3000"); 

const DriverDashboard = () => {
    const { user } = useAuth();
    const navigate = useNavigate();
    
    const [orders, setOrders] = useState([]);
    const [activeOrderId, setActiveOrderId] = useState(null); 
    const [watchId, setWatchId] = useState(null);
    const [loading, setLoading] = useState(true);
    const [gpsStatus, setGpsStatus] = useState("Off");
    
    // ✨ POPUP STATES
    const [showSuccessModal, setShowSuccessModal] = useState(false);
    const [showConfirmModal, setShowConfirmModal] = useState(false);

    const fetchMyOrders = async () => {
        if (!user || !user.id) return;
        try {
            const res = await fetch(`http://localhost:3000/api/driver/orders/${user.id}`);
            const data = await res.json();
            setOrders(data);
            
            const existingActive = data.find(o => o.order_status === 'En-Route');
            if (existingActive) {
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
                
                socket.emit("join-tracking", orderId);

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
        
        // You could also make a custom modal for this start confirmation if you want!
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

    // 1. TRIGGER THE CONFIRM MODAL
    const requestCompleteDelivery = () => {
        setShowConfirmModal(true);
    };

    // 2. ACTUAL ACTION WHEN "YES" IS CLICKED
    const confirmDeliveryAction = async () => {
        setShowConfirmModal(false); // Close confirm modal

        if (watchId !== null) {
            navigator.geolocation.clearWatch(watchId);
            setWatchId(null);
        }
        setGpsStatus("Off");

        // Use activeOrderId here
        if (activeOrderId) {
            await fetch('http://localhost:3000/api/driver/update-status', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ orderId: activeOrderId, status: 'Delivered' })
            });
            setActiveOrderId(null);
            fetchMyOrders();
            setShowSuccessModal(true); // Show Success Modal
        }
    };

    const activeOrdersList = orders.filter(o => o.order_status !== 'Delivered');

    if (loading) return <div className="p-10 text-center text-gray-500">Loading Dashboard...</div>;

    return (
        <div className="min-h-screen bg-slate-50 p-6 font-poppins relative">
            <div className="max-w-4xl mx-auto">
                <h1 className="text-3xl font-bold text-slate-800 mb-6">🚜 Driver Console</h1>

                {/* ACTIVE JOB CARD */}
                {activeOrderId && (
                    <div className="mb-8 bg-blue-600 text-white rounded-3xl p-6 shadow-xl animate-fade-in-up">
                        <div className="flex justify-between items-start">
                            <div>
                                <h2 className="text-xs font-bold uppercase tracking-widest opacity-80 mb-1">Live Status</h2>
                                <h3 className="text-xl font-bold">{gpsStatus}</h3>
                                <p className="mt-2 text-blue-100">Order #{activeOrderId} is active.</p>
                            </div>
                            <div className="h-4 w-4 bg-green-400 rounded-full animate-pulse"></div>
                        </div>
                        
                        {!watchId && (
                            <button 
                                onClick={() => startGpsTracking(activeOrderId)}
                                className="mt-4 w-full bg-blue-800 text-white py-2 rounded-lg text-sm font-bold"
                            >
                                📡 Resume GPS Signal
                            </button>
                        )}

                        <button 
                            onClick={requestCompleteDelivery}
                            className="mt-4 w-full bg-white text-blue-700 font-bold py-3 rounded-xl hover:bg-blue-50 transition-colors"
                        >
                            Mark as Delivered
                        </button>
                    </div>
                )}

                {/* ORDERS LIST */}
                <div className="grid gap-6">
                    {activeOrdersList.length === 0 ? (
                        <div className="text-center py-20 bg-white rounded-3xl border border-dashed border-gray-300">
                            <div className="text-6xl mb-4">💤</div>
                            <h3 className="text-xl font-bold text-gray-800">No New Orders</h3>
                            <p className="text-gray-500 mt-2">You are all caught up! Relax for now.</p>
                            <button 
                                onClick={fetchMyOrders}
                                className="mt-6 px-6 py-2 bg-gray-100 text-gray-600 rounded-full text-sm font-bold hover:bg-gray-200"
                            >
                                🔄 Refresh List
                            </button>
                        </div>
                    ) : (
                        activeOrdersList.map(order => (
                            <div key={order.id} className="bg-white rounded-2xl p-6 border shadow-sm hover:shadow-md transition-shadow">
                                <div className="flex flex-col md:flex-row justify-between gap-4">
                                    <div>
                                        <span className="bg-purple-100 text-purple-700 text-xs font-bold px-3 py-1 rounded-full">
                                            Order #{order.id}
                                        </span>
                                        <h3 className="font-bold text-lg mt-2">{order.machinery_type}</h3>
                                        <p className="text-slate-500 text-sm mt-1">📍 {order.delivery_address}</p>
                                        
                                        <a 
                                            href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(order.delivery_address)}`}
                                            target="_blank"
                                            rel="noreferrer"
                                            className="inline-flex items-center mt-3 text-blue-600 font-bold text-sm hover:underline"
                                        >
                                            🗺️ Open Navigation
                                        </a>
                                    </div>

                                    {order.order_status === 'Paid' && !activeOrderId && (
                                        <button 
                                            onClick={() => handleStartDelivery(order.id)}
                                            className="bg-slate-900 text-white px-6 py-3 rounded-xl font-bold hover:scale-105 transition-transform shadow-lg"
                                        >
                                            Start Delivery
                                        </button>
                                    )}
                                </div>
                            </div>
                        ))
                    )}
                </div>
            </div>

            {/* 🛑 CONFIRMATION MODAL */}
            {showConfirmModal && (
                <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 animate-fade-in">
                    <div className="bg-white rounded-3xl p-8 max-w-sm w-full text-center shadow-2xl transform transition-all scale-100">
                        <div className="w-16 h-16 bg-yellow-100 rounded-full flex items-center justify-center mx-auto mb-4 text-3xl">
                            ⚠️
                        </div>
                        <h2 className="text-xl font-bold text-gray-800 mb-2">Finish Delivery?</h2>
                        <p className="text-gray-500 mb-6 text-sm">
                            Are you sure you have arrived at the destination? This will stop tracking.
                        </p>
                        <div className="flex gap-3">
                            <button 
                                onClick={() => setShowConfirmModal(false)}
                                className="flex-1 bg-gray-100 text-gray-700 font-bold py-3 rounded-xl hover:bg-gray-200"
                            >
                                Cancel
                            </button>
                            <button 
                                onClick={confirmDeliveryAction}
                                className="flex-1 bg-slate-900 text-white font-bold py-3 rounded-xl hover:bg-slate-800"
                            >
                                Yes, Complete
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* ✅ SUCCESS MODAL */}
            {showSuccessModal && (
                <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 animate-fade-in">
                    <div className="bg-white rounded-3xl p-8 max-w-sm w-full text-center shadow-2xl transform transition-all scale-100">
                        <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6 text-4xl">
                            🎉
                        </div>
                        <h2 className="text-2xl font-bold text-gray-800 mb-2">Great Job!</h2>
                        <p className="text-gray-500 mb-6">
                            You successfully completed the delivery. The customer has been notified.
                        </p>
                        <button 
                            onClick={() => setShowSuccessModal(false)}
                            className="w-full bg-slate-900 text-white font-bold py-3 rounded-xl hover:bg-slate-800"
                        >
                            Close & Continue
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default DriverDashboard;