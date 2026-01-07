import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../useAuth'; 

function Header() {
    const location = useLocation();
    const navigate = useNavigate();
    const { user: loggedIn, logout } = useAuth(); 

    const isActive = (path) => location.pathname === path;

    const links = [
        { name: 'Home', path: '/' },
        { name: 'About', path: '/about' },
        { name: 'Product', path: '/book-rental-product' },
        { name: 'FAQ', path: '/faq' },
    ];

    const authLinks = loggedIn ? [
        { name: 'Cart', path: '/cart' },
    ] : [
        { name: 'Login / Register', path: '/login' }, 
    ];

    const handleLogout = () => {
        logout(); 
        navigate('/');
    };

    return (
        <header className="flex flex-row justify-between items-center bg-purple-200/80 backdrop-blur-sm p-4 sticky top-0 z-50 w-full shadow-sm">
            
            {/* Main Navigation Links */}
            <div className="flex flex-row justify-center items-center">
                {links.map(link => (
                    <Link 
                        key={link.path}
                        to={link.path}
                        className={`mx-2 px-4 transition-colors ${
                            isActive(link.path) 
                            ? 'font-extrabold text-purple-900' 
                            : 'font-medium text-purple-700 hover:text-purple-900'
                        }`}
                    >
                        {link.name}
                    </Link>
                ))}
            </div>

            {/* Role Switch & Auth Links */}
            <div className="flex flex-row justify-center items-center gap-4">
                
                {/* Driver Mode Button */}
                <Link 
                    to="/driver-portal" 
                    className="flex items-center gap-2 bg-purple-900 text-white px-4 py-2 rounded-full text-sm font-bold shadow-md hover:bg-purple-800 transition-all active:scale-95"
                >
                    <span className="text-lg">🚜</span>
                    <span>Driver Mode</span>
                </Link>

                {/* NEW: List Item Button (Only visible when logged in) */}
                {loggedIn && (
                    <Link 
                        to="/register-product" 
                        className="mx-2 bg-green-600 text-white px-4 py-2 rounded-lg text-sm font-bold hover:bg-green-700 transition-colors shadow-sm active:scale-95"
                    >
                        + List Item
                    </Link>
                )}

                {authLinks.map(link => (
                    <Link
                        key={link.path}
                        to={link.path}
                        className={`mx-2 px-4 transition-colors ${
                            isActive(link.path) 
                            ? 'font-bold text-purple-900' 
                            : 'font-medium text-purple-700 hover:text-purple-900'
                        }`}
                    >
                        {link.name}
                    </Link>
                ))}

                {/* Conditional Logout Button */}
                {loggedIn && (
                    <button
                        onClick={handleLogout}
                        className="mx-2 px-4 font-medium text-purple-700 hover:text-red-600 transition-colors"
                    >
                        Logout
                    </button>
                )}
            </div>
        </header>
    );
}

export default Header;