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
        { name: 'Find Equipment', path: '/book-rental-product' },
        { name: 'FAQ', path: '/faq' },
    ];

    const authLinks = loggedIn ? [ ] : [
        { name: 'Login / Register', path: '/login' }, 
    ];

    const handleLogout = () => {
        logout(); 
        navigate('/');
    };

    return (
        <header className="flex items-center justify-between bg-gradient-to-r from-green-50 via-green-100 to-white p-4 sticky top-0 z-50 w-full shadow-sm">
            {/* Logo / Brand */}
            <div className="flex items-center gap-3">
                {/* <div className="bg-amber-500 text-white rounded-full p-2 shadow-md">
                    <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                        <path d="M3 12c0-4.418 4.03-8 9-8 0 0-2 2-2 4 0 2 2 4 2 4s1-1 3-1c0 0-3 6-10 6" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                </div> */}
                <Link to="/" className="text-xl font-extrabold text-green-900">Sahayak</Link>
            </div>

            {/* Navigation (desktop) */}
            <nav className="hidden md:flex items-center gap-4">
                {links.map(link => (
                    <Link
                        key={link.path}
                        to={link.path}
                        className={`mx-2 px-3 py-2 rounded-md transition-colors ${
                            isActive(link.path) ? 'font-extrabold text-green-900 bg-green-100' : 'font-medium text-green-700 hover:text-green-900'
                        }`}
                    >
                        {link.name}
                    </Link>
                ))}
            </nav>

            {/* Actions */}
            <div className="flex items-center gap-3">
                {loggedIn && (
                    <Link
                        to="/driver-portal"
                        className="flex items-center gap-2 bg-green-700 text-white px-4 py-2 rounded-full text-sm font-bold shadow-md hover:bg-green-800 transition-all active:scale-95"
                    >
                        <span className="text-lg">🚜</span>
                        <span>Driver Mode</span>
                    </Link>
                )}

                {loggedIn && (
                    <Link
                        to="/admin"
                        className="bg-slate-800 text-white px-3 py-2 rounded-lg text-xs font-bold uppercase tracking-wider hover:bg-slate-700 transition-all shadow-sm"
                    >
                        Admin
                    </Link>
                )}

                {loggedIn && (
                    <Link
                        to="/register-product"
                        className="mx-2 bg-amber-500 text-white px-4 py-2 rounded-lg text-sm font-bold hover:bg-amber-600 transition-colors shadow-sm active:scale-95"
                    >
                        List Equipment 🌾
                    </Link>
                )}

                {authLinks.map(link => (
                    <Link
                        key={link.path}
                        to={link.path}
                        className={`mx-2 px-3 py-2 rounded-md transition-colors ${
                            isActive(link.path) ? 'font-bold text-green-900' : 'font-medium text-green-700 hover:text-green-900'
                        }`}
                    >
                        {link.name}
                    </Link>
                ))}

                {loggedIn && (
                    <button
                        onClick={handleLogout}
                        className="mx-2 px-4 py-2 border border-red-200 text-red-600 rounded-lg hover:bg-red-50 transition"
                    >
                        Logout
                    </button>
                )}
            </div>
        </header>
    );
}

export default Header;