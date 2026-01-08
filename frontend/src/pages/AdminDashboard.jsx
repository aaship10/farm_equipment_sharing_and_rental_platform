import React, { useEffect, useState } from 'react';
import { 
    BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
    PieChart, Pie, Cell 
} from 'recharts';
import { useNavigate } from 'react-router-dom';
// import { useAuth } from './useAuth'; 

const AdminDashboard = () => {
    const [stats, setStats] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null); // ✅ NEW: Error handling state
    const navigate = useNavigate();

    useEffect(() => {
        const fetchStats = async () => {
            try {
                const res = await fetch('http://localhost:3000/api/admin/stats');
                
                // Check if response is okay before parsing JSON
                if (!res.ok) {
                    throw new Error(`Server Error: ${res.status}`);
                }

                const data = await res.json();
                setStats(data);
            } catch (err) {
                console.error("Error fetching admin stats:", err);
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };
        fetchStats();
    }, []);

    // 1. Loading State
    if (loading) return (
        <div className="min-h-screen flex items-center justify-center bg-slate-50">
            <div className="text-xl font-bold text-slate-500 animate-pulse">Loading Analytics...</div>
        </div>
    );

    // 2. ✅ NEW: Error State (Prevents Crash)
    if (error) return (
        <div className="min-h-screen flex flex-col items-center justify-center bg-slate-50 p-6 text-center">
            <div className="bg-white p-8 rounded-2xl shadow-xl max-w-md w-full">
                <div className="text-5xl mb-4">⚠️</div>
                <h2 className="text-2xl font-bold text-red-600 mb-2">Dashboard Error</h2>
                <p className="text-gray-500 mb-6">{error}</p>
                <p className="text-sm text-gray-400 mb-6">Check your backend terminal for SQL errors.</p>
                <button 
                    onClick={() => window.location.reload()} 
                    className="bg-slate-900 text-white px-6 py-3 rounded-xl font-bold hover:bg-slate-700 w-full"
                >
                    Retry Connection
                </button>
            </div>
        </div>
    );

    // 3. ✅ NEW: Safety Check (If stats is still null)
    if (!stats) return null;

    // Colors for the Pie Chart
    const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8'];

    return (
        <div className="min-h-screen bg-slate-50 p-6 font-poppins">
            <div className="max-w-7xl mx-auto">
                
                {/* Header */}
                <div className="flex justify-between items-center mb-8">
                    <div>
                        <h1 className="text-3xl font-bold text-slate-900">Admin Overview</h1>
                        <p className="text-slate-500">Welcome back, Administrator.</p>
                    </div>
                    <button onClick={() => navigate('/')} className="px-4 py-2 bg-white border border-gray-300 rounded-lg text-sm font-bold hover:bg-gray-50">
                        Exit to Home
                    </button>
                </div>

                {/* 1. KEY METRICS CARDS */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                    
                    {/* Revenue Card */}
                    <div className="bg-gradient-to-r from-green-500 to-emerald-600 rounded-2xl p-6 text-white shadow-lg transform hover:scale-105 transition-transform">
                        <div className="flex justify-between items-center">
                            <div>
                                <p className="text-green-100 text-sm font-bold uppercase tracking-wider">Total Revenue</p>
                                <h2 className="text-4xl font-bold mt-2">₹{stats.revenue || 0}</h2>
                            </div>
                            <div className="text-5xl opacity-20">💰</div>
                        </div>
                    </div>

                    {/* Orders Card */}
                    <div className="bg-gradient-to-r from-blue-500 to-indigo-600 rounded-2xl p-6 text-white shadow-lg transform hover:scale-105 transition-transform">
                        <div className="flex justify-between items-center">
                            <div>
                                <p className="text-blue-100 text-sm font-bold uppercase tracking-wider">Total Bookings</p>
                                <h2 className="text-4xl font-bold mt-2">{stats.total_orders || 0}</h2>
                            </div>
                            <div className="text-5xl opacity-20">🚜</div>
                        </div>
                    </div>

                    {/* Active Fleet */}
                    <div className="bg-gradient-to-r from-purple-500 to-pink-600 rounded-2xl p-6 text-white shadow-lg transform hover:scale-105 transition-transform">
                        <div className="flex justify-between items-center">
                            <div>
                                <p className="text-purple-100 text-sm font-bold uppercase tracking-wider">System Health</p>
                                <h2 className="text-4xl font-bold mt-2">98%</h2>
                            </div>
                            <div className="text-5xl opacity-20">⚡</div>
                        </div>
                    </div>
                </div>

                {/* 2. CHARTS SECTION */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
                    
                    {/* Bar Chart: Revenue Simulation */}
                    <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
                        <h3 className="text-lg font-bold text-slate-700 mb-4">Monthly Revenue Trend</h3>
                        <div className="h-64">
                            <ResponsiveContainer width="100%" height="100%">
                                <BarChart data={[
                                    { name: 'Jan', amt: 4000 },
                                    { name: 'Feb', amt: 3000 },
                                    { name: 'Mar', amt: 2000 },
                                    { name: 'Apr', amt: 2780 },
                                    { name: 'May', amt: 1890 },
                                    { name: 'Jun', amt: 2390 },
                                    { name: 'Jul', amt: 3490 }, 
                                ]}>
                                    <CartesianGrid strokeDasharray="3 3" />
                                    <XAxis dataKey="name" />
                                    <YAxis />
                                    <Tooltip />
                                    <Bar dataKey="amt" fill="#4F46E5" radius={[4, 4, 0, 0]} />
                                </BarChart>
                            </ResponsiveContainer>
                        </div>
                    </div>

                    {/* Pie Chart: Equipment Popularity */}
                    <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
                        <h3 className="text-lg font-bold text-slate-700 mb-4">Most Rented Equipment</h3>
                        <div className="h-64">
                            {stats.popularity && stats.popularity.length > 0 ? (
                                <ResponsiveContainer width="100%" height="100%">
                                    <PieChart>
                                        <Pie
                                            data={stats.popularity}
                                            cx="50%"
                                            cy="50%"
                                            innerRadius={60}
                                            outerRadius={80}
                                            fill="#8884d8"
                                            paddingAngle={5}
                                            dataKey="value"
                                            label
                                        >
                                            {stats.popularity.map((entry, index) => (
                                                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                            ))}
                                        </Pie>
                                        <Tooltip />
                                    </PieChart>
                                </ResponsiveContainer>
                            ) : (
                                <div className="h-full flex items-center justify-center text-gray-400">
                                    No data available yet
                                </div>
                            )}
                        </div>
                    </div>
                </div>

                {/* 3. RECENT ACTIVITY TABLE */}
                <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
                    <div className="p-6 border-b border-gray-100">
                        <h3 className="text-lg font-bold text-slate-700">Recent Transactions</h3>
                    </div>
                    <div className="overflow-x-auto">
                        <table className="w-full text-left">
                            <thead className="bg-gray-50 text-gray-500 uppercase text-xs">
                                <tr>
                                    <th className="px-6 py-4">User</th>
                                    <th className="px-6 py-4">Equipment</th>
                                    <th className="px-6 py-4">Amount</th>
                                    <th className="px-6 py-4">Status</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-100">
                                {stats.recent_activity && stats.recent_activity.length > 0 ? (
                                    stats.recent_activity.map((order) => (
                                        <tr key={order.id} className="hover:bg-gray-50 transition-colors">
                                            <td className="px-6 py-4 font-medium text-slate-700">{order.user_name}</td>
                                            <td className="px-6 py-4 text-slate-500">{order.name}</td>
                                            <td className="px-6 py-4 font-bold text-slate-900">₹{order.total_amount}</td>
                                            <td className="px-6 py-4">
                                                <span className={`px-3 py-1 rounded-full text-xs font-bold 
                                                    ${order.order_status === 'Paid' ? 'bg-green-100 text-green-700' : 
                                                      order.order_status === 'Delivered' ? 'bg-blue-100 text-blue-700' : 
                                                      'bg-gray-100 text-gray-600'}`}>
                                                    {order.order_status}
                                                </span>
                                            </td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td colSpan="4" className="px-6 py-8 text-center text-gray-400">
                                            No recent transactions found.
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>

            </div>
        </div>
    );
};

export default AdminDashboard;