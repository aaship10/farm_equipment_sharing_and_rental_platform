import { useState, useRef, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../useAuth'; // Check this path matches your folder structure

function Header() {
    const location = useLocation();
    const navigate = useNavigate();
    const { user: loggedIn, logout } = useAuth(); 
    const [dropdownOpen, setDropdownOpen] = useState(false);
    const dropdownRef = useRef(null);

    const isActive = (path) => location.pathname === path;

    // Close dropdown if clicked outside
    useEffect(() => {
        function handleClickOutside(event) {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setDropdownOpen(false);
            }
        }
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, [dropdownRef]);

    const links = [
        { name: 'Home', path: '/' },
        { name: 'About', path: '/about' },
        { name: 'Find Equipment', path: '/book-rental-product' },
        { name: 'FAQ', path: '/faq' },
    ];

    const handleLogout = () => {
        logout(); 
        navigate('/');
    };

    return (
        <header className="flex items-center justify-between bg-gradient-to-r from-green-50 via-green-100 to-white p-4 sticky top-0 z-50 w-full shadow-sm font-poppins">
            
            {/* Logo */}
            <div className="flex items-center gap-3">
                <Link to="/" className="text-xl font-extrabold text-green-900 tracking-tight">
                    Sahayak
                </Link>
            </div>

            {/* Navigation (Desktop) */}
            <nav className="hidden md:flex items-center gap-4">
                {links.map(link => (
                    <Link 
                        key={link.path}
                        to={link.path}
                        className={`mx-2 px-3 py-2 rounded-md transition-colors ${
                            isActive(link.path) 
                            ? 'font-extrabold text-green-900 bg-green-200/50' 
                            : 'font-medium text-green-800 hover:text-green-900 hover:bg-green-100'
                        }`}
                    >
                        {link.name}
                    </Link>
                ))}
            </nav>

            {/* Right Side Actions */}
            <div className="flex items-center gap-3">
                
                {/* Driver Mode Button */}
                <Link 
                    to="/driver-portal" 
                    className="hidden sm:flex items-center gap-2 bg-green-800 text-white px-4 py-2 rounded-full text-sm font-bold shadow-md hover:bg-green-900 transition-all active:scale-95"
                >
                    <span>🚜</span>
                    <span>Driver Mode</span>
                </Link>

                {!loggedIn ? (
                    <Link 
                        to="/login"
                        className="bg-amber-500 text-white px-6 py-2 rounded-full font-bold shadow-sm hover:bg-amber-600 transition-all"
                    >
                        Login
                    </Link>
                ) : (
                    <div className="relative" ref={dropdownRef}>
                        <button 
                            onClick={() => setDropdownOpen(!dropdownOpen)}
                            className="flex items-center gap-2 bg-white text-green-900 px-4 py-2 rounded-full font-bold shadow-sm hover:bg-gray-50 transition-all border border-green-200"
                        >
                            <div className="w-6 h-6 bg-green-100 rounded-full flex items-center justify-center text-xs">
                                👤
                            </div>
                            <span>My Account</span>
                            <span className={`text-xs transition-transform ${dropdownOpen ? 'rotate-180' : ''}`}>▼</span>
                        </button>

                        {/* Dropdown Menu */}
                        {dropdownOpen && (
                            <div className="absolute right-0 mt-2 w-60 bg-white rounded-xl shadow-xl border border-gray-100 overflow-hidden z-50 animate-in fade-in slide-in-from-top-2">
                                <div className="px-4 py-3 border-b border-gray-100 bg-green-50/50">
                                    <p className="text-xs font-bold text-gray-500 uppercase tracking-wider">Signed In</p>
                                    <p className="text-sm font-bold text-green-900 truncate">User ID: {loggedIn.id}</p>
                                </div>

                                <div className="py-1">
                                    {/* --- RENTER LINK --- */}
                                    <Link 
                                        to="/cart" 
                                        onClick={() => setDropdownOpen(false)}
                                        className="block px-4 py-2 text-sm text-gray-700 hover:bg-green-50 hover:text-green-700 font-medium"
                                    >
                                        🛒 My Bookings
                                    </Link>
                                    
                                    <div className="border-t border-gray-100 my-1"></div>

                                    {/* --- OWNER LINKS --- */}
                                    <Link 
                                        to="/my-listings" 
                                        onClick={() => setDropdownOpen(false)}
                                        className="block px-4 py-2 text-sm text-gray-700 hover:bg-green-50 hover:text-green-700"
                                    >
                                        📋 My Listed Items
                                    </Link>
                                    <Link 
                                        to="/register-product" 
                                        onClick={() => setDropdownOpen(false)}
                                        className="block px-4 py-2 text-sm text-gray-700 hover:bg-green-50 hover:text-green-700"
                                    >
                                        ➕ List New Item
                                    </Link>

                                    <div className="border-t border-gray-100 my-1"></div>

                                    {/* --- ADMIN LINK --- */}
                                    <Link 
                                        to="/admin" 
                                        onClick={() => setDropdownOpen(false)}
                                        className="block px-4 py-2 text-sm text-gray-700 hover:bg-green-50 hover:text-green-700"
                                    >
                                        📊 Admin Dashboard
                                    </Link>
                                </div>

                                <div className="border-t border-gray-100 py-1 bg-gray-50">
                                    <button 
                                        onClick={handleLogout}
                                        className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-100 font-medium flex items-center gap-2"
                                    >
                                        🚪 Logout
                                    </button>
                                </div>
                            </div>
                        )}
                    </div>
                )}
            </div>
        </header>
    );
}

export default Header;