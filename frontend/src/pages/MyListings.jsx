import React, { useState, useEffect } from 'react';
import { useAuth } from './useAuth'; // Ensure this path is correct based on your folder structure
import { Link } from 'react-router-dom';
import ServiceModal from './components/ServiceModal';
import RentalHistoryModal from './components/RentalHistoryModal';

const MyListings = () => {
  const { user } = useAuth();
  const [myItems, setMyItems] = useState([]);
  const [loading, setLoading] = useState(true);

  // State for Modals
  const [selectedItemForService, setSelectedItemForService] = useState(null);
  const [viewingRentalsFor, setViewingRentalsFor] = useState(null);

  useEffect(() => {
    const fetchMyItems = async () => {
      // Security check: Don't fetch if user isn't logged in
      if (!user || !user.id) return;

      try {
        const response = await fetch(`http://localhost:3000/api/equipment/user/${user.id}`);
        
        if (response.ok) {
          const data = await response.json();
          setMyItems(data);
        } else {
          console.error("Failed to fetch user items");
        }
      } catch (err) {
        console.error("Network error:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchMyItems();
  }, [user]);

  if (loading) return <div className="p-10 text-center font-poppins text-gray-500">Loading your inventory...</div>;

  return (
    <div className="min-h-screen bg-purple-50 p-8 font-poppins">
      <div className="max-w-6xl mx-auto">
        
        {/* Page Header */}
        <div className="flex flex-col md:flex-row justify-between items-center mb-8 gap-4">
          <div>
            <h1 className="text-3xl font-bold text-purple-900">My Listings</h1>
            <p className="text-gray-500 mt-1">Manage your equipment, track rentals, and log maintenance.</p>
          </div>
          <Link 
            to="/register-product" 
            className="bg-green-600 text-white px-6 py-3 rounded-xl font-bold hover:bg-green-700 transition-all shadow-md active:scale-95 flex items-center gap-2"
          >
            <span>+</span> Add New Equipment
          </Link>
        </div>

        {/* Listings Grid */}
        {myItems.length === 0 ? (
          <div className="text-center py-20 bg-white rounded-3xl shadow-sm border border-purple-100">
            <div className="text-6xl mb-4">🚜</div>
            <h3 className="text-xl font-bold text-gray-700">You haven't listed any equipment yet.</h3>
            <p className="text-gray-500 mt-2">Start earning by renting out your idle machinery.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {myItems.map((item) => (
              <div key={item.id} className="bg-white rounded-2xl shadow-sm hover:shadow-xl transition-all duration-300 border border-gray-100 flex flex-col overflow-hidden">
                
                {/* Image Section */}
                <div className="h-48 bg-gray-200 relative group">
                   <img 
                    src={item.image_url || '/p1-1.webp'} 
                    alt="Equipment" 
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                   />
                   <div className={`absolute top-3 right-3 px-3 py-1 rounded-full text-xs font-bold shadow-sm backdrop-blur-md ${item.is_available ? 'bg-green-100/90 text-green-700' : 'bg-red-100/90 text-red-700'}`}>
                     {item.is_available ? "● Active" : "● Rented Out"}
                   </div>
                </div>
                
                {/* Details Section */}
                <div className="p-5 flex-grow">
                  <div className="flex justify-between items-start mb-2">
                    <span className="text-[10px] font-bold bg-purple-100 text-purple-700 px-2 py-1 rounded uppercase tracking-wider">
                        {item.machinery_type}
                    </span>
                    <span className="text-xs font-bold text-gray-400">
                        ID: #{item.id}
                    </span>
                  </div>
                  
                  <h3 className="font-bold text-lg text-gray-800 leading-tight mb-1">{item.business_name}</h3>
                  <p className="text-sm text-gray-500 mb-4">
                    {item.capacity_litres ? `Capacity: ${item.capacity_litres}` : 'Standard Model'}
                  </p>
                  
                  <div className="flex items-end gap-1">
                    <p className="text-2xl font-bold text-slate-800">₹{item.price_rate}</p>
                    <p className="text-sm font-medium text-gray-400 mb-1">/ hour</p>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="p-4 bg-gray-50 border-t border-gray-100 grid grid-cols-2 gap-3">
                  {/* Service Log */}
                  <button 
                    onClick={() => setSelectedItemForService(item.id)}
                    className="flex items-center justify-center gap-2 bg-purple-100 text-purple-700 py-2.5 rounded-lg font-bold text-sm hover:bg-purple-200 transition-colors"
                  >
                    🛠️ Service Log
                  </button>

                  {/* View Rentals */}
                  <button 
                    onClick={() => setViewingRentalsFor(item)}
                    className="flex items-center justify-center gap-2 bg-slate-800 text-white py-2.5 rounded-lg font-bold text-sm hover:bg-slate-900 shadow-md transition-colors"
                  >
                    📊 History
                  </button>
                  
                  {/* Edit (Full Width) */}
                  <button className="col-span-2 border border-gray-300 text-gray-600 py-2 rounded-lg font-bold text-xs hover:bg-gray-100 transition-colors uppercase tracking-wide">
                    Edit Details
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* --- MODALS --- */}
        
        {/* 1. Service History Modal */}
        {selectedItemForService && (
            <ServiceModal 
                equipmentId={selectedItemForService} 
                onClose={() => setSelectedItemForService(null)} 
            />
        )}

        {/* 2. Rental History Modal */}
        {viewingRentalsFor && (
            <RentalHistoryModal 
                equipment={viewingRentalsFor} 
                onClose={() => setViewingRentalsFor(null)} 
            />
        )}

      </div>
    </div>
  );
};

export default MyListings;