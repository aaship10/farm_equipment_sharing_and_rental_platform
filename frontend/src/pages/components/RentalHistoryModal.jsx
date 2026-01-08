import React, { useState, useEffect } from 'react';

const RentalHistoryModal = ({ equipment, onClose }) => {
    const [rentals, setRentals] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchRentals = async () => {
            try {
                const res = await fetch(`http://localhost:3000/api/rentals/${equipment.id}`);
                const data = await res.json();
                setRentals(data);
            } catch (err) {
                console.error("Failed to load rentals");
            } finally {
                setLoading(false);
            }
        };
        fetchRentals();
    }, [equipment]);

    // Helper to estimate hours/usage based on price
    const calculateUsage = (totalPrice) => {
        // Avoid division by zero if rate is missing
        if (!equipment.price_rate || equipment.price_rate == 0) return "N/A";
        
        const hours = (totalPrice / equipment.price_rate).toFixed(1);
        return `${hours} hrs`;
    };

    return (
        <div className="fixed inset-0 bg-black/50 flex justify-center items-center z-50 p-4 backdrop-blur-sm animate-in fade-in">
            <div className="bg-white w-full max-w-2xl rounded-2xl shadow-2xl overflow-hidden font-poppins">
                
                {/* Header */}
                <div className="bg-slate-900 p-5 flex justify-between items-center text-white">
                    <div>
                        <h3 className="font-bold text-xl">📊 Rental History</h3>
                        <p className="text-slate-400 text-sm">{equipment.business_name}</p>
                    </div>
                    <button onClick={onClose} className="text-white hover:text-red-400 font-bold text-2xl">&times;</button>
                </div>

                {/* Body */}
                <div className="p-6 max-h-[70vh] overflow-y-auto">
                    {loading ? (
                        <div className="text-center py-10">Loading records...</div>
                    ) : rentals.length === 0 ? (
                        <div className="text-center py-10 text-gray-400">
                            <div className="text-4xl mb-2">📉</div>
                            <p>No rentals yet for this item.</p>
                        </div>
                    ) : (
                        <div className="overflow-x-auto">
                            <table className="w-full text-left border-collapse">
                                <thead>
                                    <tr className="border-b border-gray-200 text-xs font-bold text-gray-500 uppercase tracking-wider">
                                        <th className="p-3">Date</th>
                                        <th className="p-3">Renter</th>
                                        <th className="p-3">Status</th>
                                        <th className="p-3">Est. Usage</th>
                                        <th className="p-3 text-right">Earned</th>
                                    </tr>
                                </thead>
                                <tbody className="text-sm">
                                    {rentals.map((rental) => (
                                        <tr key={rental.id} className="border-b border-gray-100 hover:bg-slate-50 transition-colors">
                                            <td className="p-3 text-gray-600">
                                                {new Date(rental.created_at).toLocaleDateString()}
                                            </td>
                                            <td className="p-3">
                                                <div className="font-bold text-slate-800">{rental.renter_name}</div>
                                                <div className="text-xs text-slate-400">{rental.renter_contact}</div>
                                            </td>
                                            <td className="p-3">
                                                <span className={`px-2 py-1 rounded text-xs font-bold ${
                                                    rental.order_status === 'Paid' || rental.order_status === 'Delivered' 
                                                    ? 'bg-green-100 text-green-700' 
                                                    : 'bg-yellow-100 text-yellow-700'
                                                }`}>
                                                    {rental.order_status}
                                                </span>
                                            </td>
                                            <td className="p-3 text-gray-600">
                                                {calculateUsage(rental.total_price)}
                                            </td>
                                            <td className="p-3 text-right font-bold text-green-700">
                                                ₹{rental.total_price}
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default RentalHistoryModal;