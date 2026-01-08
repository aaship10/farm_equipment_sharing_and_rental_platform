import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from './useAuth'; // Ensure this path is correct

const RegisterProduct = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const [formData, setFormData] = useState({
    businessName: '',
    machineryType: 'Tractor', // Default value
    priceRate: '',
    capacity: '',
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!user || !user.id) {
      alert("You must be logged in to list a product!");
      navigate('/login');
      return;
    }

    setLoading(true);

    try {
      const response = await fetch('http://localhost:3000/api/add-equipment', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...formData,
          userId: user.id
        }),
      });

      const data = await response.json();

      if (response.ok) {
        alert("Success! Your equipment is now live in the marketplace.");
        navigate('/book-rental-product'); // Redirect to their dashboard to see the listing
      } else {
        alert(data.error || "Failed to list product.");
      }
    } catch (err) {
      console.error(err);
      alert("Server error. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-purple-50 flex items-center justify-center p-6 font-poppins">
      <div className="bg-white max-w-lg w-full rounded-2xl shadow-xl p-8 border border-purple-100">
        <h2 className="text-3xl font-bold text-purple-900 mb-2">List Your Equipment</h2>
        <p className="text-gray-500 mb-8">Start earning by renting out your farm machinery.</p>

        <form onSubmit={handleSubmit} className="space-y-5">
          
          {/* Business / Display Name */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">Display Name / Title</label>
            <input 
              name="businessName"
              type="text" 
              placeholder="e.g. John's Super Tractor"
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 outline-none"
              onChange={handleChange}
              required
            />
          </div>

          {/* Machinery Type Dropdown */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">Equipment Type</label>
            <select 
              name="machineryType"
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 outline-none bg-white"
              onChange={handleChange}
              value={formData.machineryType}
            >
              <option value="Tractor">Tractor</option>
              <option value="Harvester">Harvester</option>
              <option value="Drone">Drone</option>
              <option value="Seeder">Seeder</option>
              <option value="Irrigation Pump">Irrigation Pump</option>
              <option value="Water Tanker">Water Tanker</option>
            </select>
          </div>

          {/* Price */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">Hourly Rate (₹)</label>
            <input 
              name="priceRate"
              type="number" 
              placeholder="e.g. 500"
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 outline-none"
              onChange={handleChange}
              required
            />
          </div>

          {/* Capacity / Details (Mapped to capacity_litres for DB compatibility) */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">Capacity / Power (HP/Litres)</label>
            <input 
              name="capacity"
              type="number" 
              placeholder="e.g. 50 (for HP) or 5000 (for Litres)"
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 outline-none"
              onChange={handleChange}
            />
            <p className="text-xs text-gray-400 mt-1">Leave blank if not applicable.</p>
          </div>

          <button 
            type="submit"
            disabled={loading}
            className="w-full bg-purple-700 text-white font-bold py-4 rounded-xl shadow-lg hover:bg-purple-800 transition-all active:scale-95 disabled:opacity-50"
          >
            {loading ? "Listing..." : "List Equipment Now"}
          </button>

        </form>
      </div>
    </div>
  );
};

export default RegisterProduct;