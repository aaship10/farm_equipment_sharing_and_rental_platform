import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom'; 

const BookTanker = () => {
  const navigate = useNavigate();
  const [tankers, setTankers] = useState([]); 
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchEquipment = async () => {
      try {
        const response = await fetch('http://localhost:3000/api/equipment');
        const data = await response.json();
        setTankers(data);
      } catch (err) {
        console.error("Failed to fetch equipment:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchEquipment();
  }, []);

  const [hoursMap, setHoursMap] = useState({}); // { [tankerId]: hours }

  const setHoursForTanker = (id, hours) => {
    setHoursMap(prev => ({ ...prev, [id]: hours }));
  };

  const updateHours = (id, hours) => {
    setHoursForTanker(id, hours);
  };

  const getBaseRate = (t) => {
    if (t.price_rate) return parseFloat(t.price_rate);
    return (t.capacity_litres / 1000) * t.price_per_1000_litres;
  };

  const computeTotal = (t, hours) => {
    const base = getBaseRate(t) || 0;
    return Math.round(base * hours);
  };

  const handleBookNow = (tanker, hours = 1) => {
    navigate('/confirm-order', { state: { tanker, hours } });
  };

  // Helper to format capacity based on type
  const getCapacityLabel = (type, capacity) => {
    if (!capacity) return "Standard Model";
    const lowerType = type.toLowerCase();
    if (lowerType.includes('tractor')) return `${capacity} HP Power`;
    if (lowerType.includes('tanker')) return `${capacity} Litres`;
    if (lowerType.includes('drone')) return `${capacity}m Range`;
    return `${capacity} Units Capacity`;
  };

  if (loading) return <div className="p-10 text-center font-poppins">Loading Equipment...</div>;

  return (
    <main className="container mx-auto my-8 px-4 font-poppins min-h-screen">
      <div className="text-center py-8">
        <h1 className="text-4xl font-bold text-slate-800">
          Find Farm Equipment
        </h1>
        <p className="text-slate-500 text-lg mt-2">
          Rent tractors, drones, and harvesters from trusted local peers.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {tankers.length > 0 ? (
          tankers.map((tanker) => (
            <div key={tanker.id} className="bg-white rounded-2xl border border-slate-200 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 overflow-hidden flex flex-col">
              
              {/* Image Section */}
              <div className="relative h-48 bg-gray-100">
                <img 
                  src={tanker.image_url} 
                  alt={tanker.machinery_type} 
                  className="w-full h-full object-cover" 
                />
                <div className="absolute top-3 right-3 bg-white/90 backdrop-blur-sm px-2 py-1 rounded-lg text-xs font-bold shadow-sm">
                  {tanker.is_available ? (
                    <span className="text-green-600 flex items-center gap-1">● Available Now</span>
                  ) : (
                    <span className="text-red-500">● Booked</span>
                  )}
                </div>
              </div>

              {/* Card Content */}
              <div className="p-5 flex flex-col flex-grow">
                {/* Header */}
                <div className="mb-4">
                  <div className="flex justify-between items-start">
                    <span className="bg-purple-100 text-purple-700 text-xs font-bold px-2 py-1 rounded uppercase tracking-wide">
                      {tanker.machinery_type}
                    </span>
                    <div className="flex items-center gap-1 text-sm text-amber-500">
                      <i className="fas fa-star"></i>
                      <span className="font-bold text-slate-700">{tanker.average_rating || "New"}</span>
                      <span className="text-slate-400 text-xs">({tanker.rating_count || 0})</span>
                    </div>
                  </div>
                  <h3 className="text-xl font-bold text-slate-800 mt-2 leading-tight line-clamp-1">
                    {tanker.business_name}
                  </h3>
                </div>

                {/* Specs Grid */}
                <div className="grid grid-cols-2 gap-3 mb-6 bg-slate-50 p-3 rounded-xl border border-slate-100">
                  <div className="text-center">
                    <p className="text-xs text-slate-400 uppercase font-semibold">Power/Cap</p>
                    <p className="font-semibold text-slate-700 text-sm">
                      {getCapacityLabel(tanker.machinery_type, tanker.capacity_litres)}
                    </p>
                  </div>
                  <div className="text-center border-l border-slate-200">
                    <p className="text-xs text-slate-400 uppercase font-semibold">Condition</p>
                    <p className="font-semibold text-green-600 text-sm">Excellent</p>
                  </div>
                </div>

                {/* Price & Action */}
                <div className="mt-auto flex items-center justify-between gap-4">
                  <div>
                    <p className="text-xs text-slate-400">Rental Rate</p>
                    <p className="text-2xl font-bold text-slate-800">
                      ₹{tanker.price_rate || tanker.price_per_1000_litres}
                      <span className="text-sm font-medium text-slate-400">/hr</span>
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => updateHours(tanker.id, Math.max(1, (hoursMap[tanker.id] || 1) - 1))}
                      className="px-3 py-1 border rounded-lg"
                    >-</button>
                    <div className="mx-2 text-center w-20 flex flex-row items-end">
                      <input
                        min="1"
                        className="w-full text-center border rounded-md px-2 py-1"
                        value={hoursMap[tanker.id] || 1}
                        onChange={(e) => setHoursForTanker(tanker.id, Math.max(1, Number(e.target.value) || 1))}
                      />
                      <div className="text-xs text-slate-400">hrs</div>
                    </div>
                    <button
                      onClick={() => updateHours(tanker.id, (hoursMap[tanker.id] || 1) + 1)}
                      className="px-3 py-1 border rounded-lg"
                    >+</button>
                  </div>
                </div>
                <button 
                    onClick={() => handleBookNow(tanker, hoursMap[tanker.id] || 1)}
                    className="flex-1 bg-slate-900 text-white font-bold py-3 px-4 rounded-xl shadow-lg shadow-slate-200 hover:bg-purple-700 transition-colors"
                  >
                    Rent Now {`(₹${computeTotal(tanker, hoursMap[tanker.id] || 1)})`}
                  </button>
              </div>
            </div>
          ))
        ) : (
          <div className="col-span-full py-20 text-center">
            <div className="inline-block p-4 rounded-full bg-slate-100 mb-4">
              <span className="text-4xl">🚜</span>
            </div>
            <h3 className="text-xl font-bold text-slate-600">No Equipment Found</h3>
            <p className="text-slate-400">Be the first to list your machinery!</p>
          </div>
        )}
      </div>
    </main>
  );
};

export default BookTanker;