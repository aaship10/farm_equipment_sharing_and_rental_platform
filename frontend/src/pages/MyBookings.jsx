import React, { useState, useEffect } from 'react';
import { useAuth } from './useAuth'; // Check your path (./ or ../)
import { Link, useNavigate } from 'react-router-dom';

const MyBookings = () => {
  const { user } = useAuth();
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchBookings = async () => {
      if (!user || !user.id) return;
      try {
        const res = await fetch(`http://localhost:3000/api/my-bookings/${user.id}`);
        if (res.ok) {
          const data = await res.json();
          setBookings(data);
        }
      } catch (err) {
        console.error("Failed to load bookings", err);
      } finally {
        setLoading(false);
      }
    };
    fetchBookings();
  }, [user]);

  if (loading) return <div className="p-10 text-center font-poppins text-gray-500">Loading your orders...</div>;

  const handleRebook = (order) => {
    // Reconstruct the equipment object expected by ConfirmOrder page
    const equipmentData = {
        id: order.equipment_id,
        business_name: order.business_name,
        machinery_type: order.machinery_type,
        price_rate: order.current_price, // Use current price!
        capacity_litres: order.capacity_litres,
        image_url: order.image_url
    };

    navigate('/confirm-order', { state: { tanker: equipmentData } });
};

  return (
    <div className="min-h-screen bg-gray-50 p-8 font-poppins">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-800 mb-8">My Bookings</h1>

        {bookings.length === 0 ? (
          <div className="bg-white p-10 rounded-2xl text-center shadow-sm">
            <div className="text-5xl mb-4">🛒</div>
            <h3 className="text-xl font-bold text-gray-700">No bookings yet.</h3>
            <Link to="/book-rental-product" className="text-purple-600 font-bold hover:underline mt-2 inline-block">
              Browse Equipment
            </Link>
          </div>
        ) : (
          <div className="space-y-6">
            {bookings.map((order) => (
              <div key={order.id} className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 flex flex-col md:flex-row gap-6 hover:shadow-md transition-shadow">
                
                {/* Image */}
                <div className="w-full md:w-40 h-32 bg-gray-200 rounded-xl overflow-hidden flex-shrink-0">
                  <img src={order.image_url || '/p1-1.webp'} alt="Equipment" className="w-full h-full object-cover" />
                </div>

                {/* Content */}
                <div className="flex-grow">
                  <div className="flex justify-between items-start">
                    <div>
                      <span className="text-[10px] font-bold bg-gray-100 text-gray-600 px-2 py-1 rounded uppercase">
                        Order #{order.id}
                      </span>
                      <h3 className="text-xl font-bold text-gray-800 mt-1">{order.business_name}</h3>
                      <p className="text-sm text-purple-600 font-semibold">{order.machinery_type}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-2xl font-bold text-gray-900">₹{order.total_price}</p>
                      <p className="text-xs text-gray-400">{new Date(order.created_at).toLocaleDateString()}</p>
                    </div>
                  </div>

                  <div className="mt-4 flex flex-col sm:flex-row justify-between items-end gap-4">
                    <div className="text-sm text-gray-500">
                      <p><span className="font-bold">Owner:</span> {order.owner_name}</p>
                      <p><span className="font-bold">Contact:</span> {order.owner_phone || "N/A"}</p>
                    </div>

                    {/* Status Actions */}
                    <div className="flex items-center gap-3 w-full sm:w-auto">
                      <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase ${
                        order.order_status === 'Delivered' ? 'bg-green-100 text-green-700' : 
                        order.order_status === 'En-Route' ? 'bg-blue-100 text-blue-700 animate-pulse' : 
                        'bg-yellow-100 text-yellow-700'
                      }`}>
                        ● {order.order_status}
                      </span>
                      
                      {/* Show 'Track Order' button ONLY if the order is active (En-Route or Paid) */}
                      {(order.order_status === 'En-Route' || order.order_status === 'Paid') && (
                        <Link 
                          to={`/track-order/${order.id}`}
                          className="flex-1 sm:flex-none bg-blue-600 text-white px-5 py-2 rounded-lg font-bold text-sm hover:bg-blue-700 shadow-md transition-transform active:scale-95 text-center"
                        >
                          📍 Track Live
                        </Link>
                      )}
                      {/* REBOOK BUTTON */}
                        <button 
                            onClick={() => handleRebook(order)}
                            disabled={!order.is_available} 
                            className={`flex-1 sm:flex-none px-5 py-2 rounded-lg font-bold text-sm shadow-md transition-transform active:scale-95 text-center flex items-center justify-center gap-2
                                ${order.is_available 
                                    ? 'bg-purple-600 text-white hover:bg-purple-700' 
                                    : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                                }`}
                        >
                            {order.is_available ? '🔄 Rent Again' : '🚫 Unavailable'}
                        </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default MyBookings;