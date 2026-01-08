import { Link } from 'react-router-dom';

function Footer() {

  const year = new Date().getFullYear();

  return (
    <footer className="bg-gradient-to-r from-green-50 to-white border-t border-green-100 mt-8">
      <div className="max-w-6xl mx-auto px-6 py-8 grid md:grid-cols-3 gap-6 items-start">
        {/* Brand / Contact */}
        <div>
          <div className="flex items-center gap-3 mb-3">
            <div className="bg-amber-500 text-white rounded-full p-2 shadow-md">
              <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                <path d="M3 12c0-4.418 4.03-8 9-8 0 0-2 2-2 4 0 2 2 4 2 4s1-1 3-1c0 0-3 6-10 6" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </div>
            <div>
              <h3 className="font-bold text-green-800">Sahayak</h3>
              <p className="text-sm text-slate-600">Share equipment. Grow together.</p>
            </div>
          </div>

          <p className="text-sm text-slate-500">Need help? <a href="mailto:support@agrishare.local" className="text-green-700 font-semibold">support@agrishare.local</a></p>
        </div>

        {/* Quick Links */}
        <div>
          <h4 className="font-semibold text-green-800 mb-2">Quick links</h4>
          <ul className="text-sm text-slate-600 space-y-1">
            <li><Link to="/" className="hover:text-green-900">Home</Link></li>
            <li><Link to="/book-rental-product" className="hover:text-green-900">Find Equipment</Link></li>
            <li><Link to="/register-product" className="hover:text-green-900">List Equipment</Link></li>
            <li><Link to="/faq" className="hover:text-green-900">FAQ</Link></li>
          </ul>
        </div>

        {/* Social / Copyright */}
        <div>
          <h4 className="font-semibold text-green-800 mb-2">Follow us</h4>
          <div className="flex items-center gap-3">
            <a href="#" aria-label="Twitter" className="text-green-700 hover:text-green-900">🐦</a>
            <a href="#" aria-label="Facebook" className="text-green-700 hover:text-green-900">📘</a>
            <a href="#" aria-label="Instagram" className="text-green-700 hover:text-green-900">📸</a>
          </div>
          <p className="mt-4 text-sm text-slate-500">© {year} AgriShare. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}

export default Footer;