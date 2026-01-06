import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
// Updated import path based on your folder structure
import { useAuth } from './useAuth'; 

const ConfirmOrder = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const { user } = useAuth();
    const [address, setAddress] = useState('');
    
    // Retrieve the tanker object passed via navigation state
    const tanker = location.state?.tanker;

    // Redirect if accessed directly without a tanker selection
    useEffect(() => { 
        if (!tanker) {
            alert("No machinery selected. Redirecting to marketplace.");
            navigate('/book-rental-product'); 
        }
    }, [tanker, navigate]);

    if (!tanker) return null;

    const handlePayment = async (e) => {
        e.preventDefault();
        
        try {
            // 1. Create Razorpay Order on the server
            const res = await fetch('http://localhost:3000/api/create-order-razorpay', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ 
                    totalPrice: (tanker.capacity_litres / 1000) * tanker.price_per_1000_litres 
                })
            });
            
            const order = await res.json();

            // 2. Open Razorpay Checkout Modal
            const options = {
                // Ensure VITE_RAZORPAY_KEY_ID is set in your frontend .env file
                key: import.meta.env.VITE_RAZORPAY_KEY_ID, 
                amount: order.amount,
                currency: "INR",
                name: "Farm Equipment Rental",
                description: `Booking for ${tanker.business_name}`,
                order_id: order.id,
                handler: async (response) => {
                    // 3. Verify Payment & Save to Neon DB
                    const verifyRes = await fetch('http://localhost:3000/api/payment-verification', {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({
                            ...response,
                            tankerId: tanker.id,
                            deliveryAddress: address,
                            totalPrice: order.amount / 100,
                            userId: user.id // Passed to your backend for the orders table
                        })
                    });

                    const result = await verifyRes.json();
                    
                    // Navigate to the dynamic tracking route registered in App.jsx
                    if (result.success) {
                        alert("Payment Successful! Redirecting to Live Tracking...");
                        navigate(`/track-order/${result.orderId}`);
                    } else {
                        alert("Payment verification failed. Please contact support.");
                    }
                },
                theme: { color: "#2563eb" } // Blue-600 to match your button
            };

            const rzp = new window.Razorpay(options);
            rzp.open();
            
        } catch (err) { 
            console.error("Payment Process Error:", err);
            alert("An error occurred during the payment process.");
        }
    };

    return (
        <div className="min-h-screen bg-gray-50 p-6 flex items-center justify-center font-poppins">
            <div className="bg-white p-8 rounded-2xl shadow-xl max-w-md w-full border border-gray-100">
                <h2 className="text-2xl font-bold text-gray-800 mb-2 text-center">Confirm Your Order</h2>
                <p className="text-gray-500 text-center mb-8">Supplier: {tanker?.business_name}</p>
                
                <div className="bg-blue-50 p-4 rounded-xl mb-8">
                    <div className="flex justify-between text-sm text-blue-800 mb-1">
                        <span>Total Price:</span>
                        <span className="font-bold">
                            ₹{((tanker.capacity_litres / 1000) * tanker.price_per_1000_litres).toLocaleString('en-IN')}
                        </span>
                    </div>
                </div>

                <form onSubmit={handlePayment} className="space-y-6">
                    <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">
                            Delivery Address
                        </label>
                        <textarea 
                            className="w-full border border-gray-200 p-3 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all" 
                            placeholder="Enter your full farm/delivery address..." 
                            rows="4"
                            value={address}
                            onChange={(e) => setAddress(e.target.value)} 
                            required 
                        />
                    </div>
                    
                    <button 
                        type="submit"
                        className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-4 rounded-xl shadow-lg shadow-blue-100 transition-all active:scale-95"
                    >
                        Confirm & Pay Now
                    </button>
                </form>
            </div>
        </div>
    );
};

export default ConfirmOrder;