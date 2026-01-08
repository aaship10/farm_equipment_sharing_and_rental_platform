import React, { useState, useEffect } from 'react';

const ServiceModal = ({ equipmentId, onClose }) => {
    const [logs, setLogs] = useState([]);
    const [loading, setLoading] = useState(true);
    
    // Form State
    const [formData, setFormData] = useState({
        serviceDate: '',
        serviceType: 'Routine Maintenance',
        description: '',
        mechanicName: '',
        cost: ''
    });

    // Fetch existing logs
    const fetchLogs = async () => {
        try {
            const res = await fetch(`http://localhost:3000/api/service-history/${equipmentId}`);
            const data = await res.json();
            setLogs(data);
        } catch (err) {
            console.error("Failed to load logs");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchLogs();
    }, [equipmentId]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const res = await fetch('http://localhost:3000/api/service-history', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ ...formData, equipmentId })
            });
            if (res.ok) {
                // Clear form and reload logs
                setFormData({ serviceDate: '', serviceType: 'Routine Maintenance', description: '', mechanicName: '', cost: '' });
                fetchLogs();
            }
        } catch (err) {
            alert("Failed to save log");
        }
    };

    return (
        <div className="fixed inset-0 bg-black/50 flex justify-center items-center z-50 p-4 backdrop-blur-sm animate-in fade-in">
            <div className="bg-white w-full max-w-4xl rounded-2xl shadow-2xl overflow-hidden font-poppins flex flex-col md:flex-row max-h-[80vh]">
                
                {/* LEFT: Add New Log Form */}
                <div className="w-full md:w-1/3 bg-gray-50 p-6 border-r border-gray-100 overflow-y-auto">
                    <h3 className="font-bold text-lg text-purple-900 mb-4">➕ Add Service Record</h3>
                    <form onSubmit={handleSubmit} className="space-y-3">
                        <input 
                            type="date" 
                            required
                            className="w-full p-2 border rounded-lg text-sm"
                            value={formData.serviceDate}
                            onChange={e => setFormData({...formData, serviceDate: e.target.value})}
                        />
                        <select 
                            className="w-full p-2 border rounded-lg text-sm"
                            value={formData.serviceType}
                            onChange={e => setFormData({...formData, serviceType: e.target.value})}
                        >
                            <option>Routine Maintenance</option>
                            <option>Repair</option>
                            <option>Part Replacement</option>
                            <option>Inspection</option>
                        </select>
                        <input 
                            type="text" 
                            placeholder="Mechanic Name"
                            className="w-full p-2 border rounded-lg text-sm"
                            value={formData.mechanicName}
                            onChange={e => setFormData({...formData, mechanicName: e.target.value})}
                        />
                        <input 
                            type="number" 
                            placeholder="Cost (₹)"
                            className="w-full p-2 border rounded-lg text-sm"
                            value={formData.cost}
                            onChange={e => setFormData({...formData, cost: e.target.value})}
                        />
                        <textarea 
                            placeholder="Description of work done..."
                            className="w-full p-2 border rounded-lg text-sm h-20"
                            value={formData.description}
                            onChange={e => setFormData({...formData, description: e.target.value})}
                        ></textarea>
                        <button type="submit" className="w-full bg-purple-600 text-white py-2 rounded-lg font-bold hover:bg-purple-700 transition">
                            Save Record
                        </button>
                    </form>
                </div>

                {/* RIGHT: History List */}
                <div className="w-full md:w-2/3 p-6 overflow-y-auto bg-white">
                    <div className="flex justify-between items-center mb-4">
                        <h3 className="font-bold text-xl text-gray-800">🛠️ Service History</h3>
                        <button onClick={onClose} className="text-gray-400 hover:text-red-500 font-bold text-2xl">×</button>
                    </div>

                    {loading ? <p>Loading...</p> : logs.length === 0 ? (
                        <div className="text-center py-10 text-gray-400">No service records found.</div>
                    ) : (
                        <div className="space-y-4">
                            {logs.map(log => (
                                <div key={log.id} className="border border-gray-100 rounded-xl p-4 hover:shadow-md transition-shadow">
                                    <div className="flex justify-between items-start">
                                        <span className={`px-2 py-1 rounded text-xs font-bold uppercase ${
                                            log.service_type === 'Repair' ? 'bg-red-100 text-red-700' : 'bg-green-100 text-green-700'
                                        }`}>
                                            {log.service_type}
                                        </span>
                                        <span className="text-sm text-gray-500">{new Date(log.service_date).toLocaleDateString()}</span>
                                    </div>
                                    <p className="mt-2 text-gray-700 font-medium">{log.description}</p>
                                    <div className="mt-3 flex justify-between text-sm text-gray-500">
                                        <span>🔧 {log.mechanic_name || 'Unknown'}</span>
                                        <span className="font-bold text-gray-800">₹{log.cost}</span>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>

            </div>
        </div>
    );
};

export default ServiceModal;