import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Confetti from 'react-confetti'; 

// ✅ FIX: Define the URL here directly (No config file needed)
const API_URL = "http://localhost:3000/api"; 

const RateOrder = () => {
    const { orderId } = useParams();
    const navigate = useNavigate();
    
    const [rating, setRating] = useState(0);
    const [hover, setHover] = useState(0);
    const [comment, setComment] = useState("");
    const [equipmentId, setEquipmentId] = useState(null);
    const [loading, setLoading] = useState(false);
    
    // ✨ NEW: State to show the Thank You card instead of an alert
    const [submitted, setSubmitted] = useState(false);
    
    // Window size for Confetti (Auto-detects screen size)
    const [windowDim, setWindowDim] = useState({ width: window.innerWidth, height: window.innerHeight });

    // 1. Fetch Order Details to know which Equipment we are rating
    useEffect(() => {
        const fetchOrderDetails = async () => {
            try {
                const res = await fetch(`${API_URL}/orders/${orderId}`);
                if (!res.ok) throw new Error("Order not found");
                const data = await res.json();
                setEquipmentId(data.equipment_id); // Vital for DB update
            } catch (err) {
                console.error("Error fetching order details", err);
            }
        };
        fetchOrderDetails();
    }, [orderId]);

    // 2. Handle Resize for Confetti
    useEffect(() => {
        const handleResize = () => setWindowDim({ width: window.innerWidth, height: window.innerHeight });
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        try {
            const response = await fetch(`${API_URL}/submit-review`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    orderId,
                    equipmentId, 
                    rating,
                    comment
                })
            });

            if (response.ok) {
                // ✨ Show the Success Card instead of alert
                setSubmitted(true);
            } else {
                alert("Failed to submit review. Please try again.");
            }
        } catch (err) {
            console.error(err);
            alert("Network error. Please check your connection.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4 font-poppins relative overflow-hidden">
            {/* 🎊 Celebration Confetti */}
            <Confetti width={windowDim.width} height={windowDim.height} recycle={false} numberOfPieces={500} />

            <div className="bg-white max-w-lg w-full rounded-3xl shadow-2xl p-8 text-center z-10 border border-slate-100 transition-all duration-500">
                
                {/* CONDITIONAL RENDERING: Form vs Success Message */}
                {!submitted ? (
                    <>
                        <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6 text-4xl animate-bounce">
                            ✅
                        </div>
                        
                        <h1 className="text-3xl font-bold text-slate-800 mb-2">Delivery Complete!</h1>
                        <p className="text-slate-500 mb-8">How was your experience with the equipment?</p>

                        {/* Star Rating System */}
                        <div className="flex justify-center gap-2 mb-8">
                            {[...Array(5)].map((star, index) => {
                                const ratingValue = index + 1;
                                return (
                                    <button
                                        key={index}
                                        type="button"
                                        className={`text-5xl transition-all duration-200 transform ${ratingValue <= (hover || rating) ? "text-yellow-400 scale-110" : "text-gray-300"}`}
                                        onClick={() => setRating(ratingValue)}
                                        onMouseEnter={() => setHover(ratingValue)}
                                        onMouseLeave={() => setHover(rating)}
                                    >
                                        ★
                                    </button>
                                );
                            })}
                        </div>

                        <form onSubmit={handleSubmit} className="space-y-4">
                            <textarea
                                className="w-full border border-slate-200 rounded-xl p-4 focus:ring-2 focus:ring-green-500 outline-none resize-none bg-slate-50"
                                rows="4"
                                placeholder="Tell us more about the machinery performance..."
                                value={comment}
                                onChange={(e) => setComment(e.target.value)}
                                required
                            ></textarea>

                            <button
                                type="submit"
                                disabled={loading || rating === 0}
                                className={`w-full py-4 rounded-xl font-bold text-white text-lg shadow-lg transition-all ${rating === 0 ? 'bg-gray-300 cursor-not-allowed' : 'bg-slate-900 hover:bg-green-600 hover:scale-[1.02]'}`}
                            >
                                {loading ? "Submitting..." : "Submit Review"}
                            </button>
                        </form>
                    </>
                ) : (
                    /* ✨ THE NICE THANK YOU CARD ✨ */
                    <div className="animate-fade-in-up py-6">
                        <div className="w-24 h-24 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-6 text-5xl">
                            🙏
                        </div>
                        <h1 className="text-3xl font-bold text-slate-800 mb-4">Thank You!</h1>
                        <p className="text-gray-500 mb-8 text-lg">
                            Your feedback helps other farmers choose the best equipment.
                        </p>
                        <button 
                            onClick={() => navigate('/')}
                            className="w-full bg-slate-900 text-white font-bold py-4 rounded-xl shadow-lg hover:bg-slate-800 hover:scale-[1.02] transition-transform"
                        >
                            Return to Home
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
};

export default RateOrder;