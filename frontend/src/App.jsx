import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './pages/home';
import Login from './pages/login';
import BookTanker from './pages/book_rental_products'; 
import ConfirmOrder from './pages/ConfirmOrder'; 
import { AuthProvider } from './pages/AuthProvider';
import Header from './pages/components/Header'; // Make sure capitalization matches file name
import TrackOrder from './pages/TrackOrder'; 
import About from "./pages/About";
import FAQ from "./pages/FAQ";
import DriverDashboard from './pages/DriverDashboard';
import RegisterProduct from './pages/RegisterProduct';
import RateOrder from './pages/RateOrder';
import AdminDashboard from './pages/AdminDashboard';
import MyListings from './pages/MyListings';
import MyBookings from './pages/MyBookings';

function App() {
  // Mock data for Home page
  const mockData = {
    lastOrder: { order_time: new Date().toISOString() },
    totalSpentThisMonth: 4500,
    trustedSuppliersCount: 3,
    userSocietyId: null,
    societies: [{ id: 1, society_name: "Green View Residency" }],
    ordersToRate: []
  };

  return (
    <Router>
      <AuthProvider>
        <Header />
        <Routes>
          {/* 1. Register Product Page */}
          <Route path="/register-product" element={<RegisterProduct />} />
          
          {/* 2. Driver Dashboard */}
          <Route path="/driver-portal" element={<DriverDashboard />} />
          
          {/* 3. Home Page */}
          <Route path="/" element={<Home {...mockData} />} />
          
          {/* 4. Login */}
          <Route path="/login" element={<Login />} />
          
          {/* 5. Product Listing */}
          <Route path="/book-rental-product" element={<BookTanker />} />
          
          {/* 6. Order Confirmation */}
          <Route path="/confirm-order" element={<ConfirmOrder />} />
          
          {/* 7. Tracking */}
          <Route path="/track-order/:orderId" element={<TrackOrder />} />
          
          {/* 8. Static Pages */}
          <Route path="/about" element={<About />} />
          <Route path="/faq" element={<FAQ />} />

          {/* 9. YOUR FEATURES (My Listings & My Bookings) */}
          <Route path="/my-listings" element={<MyListings />} />
          <Route path="/cart" element={<MyBookings />} />

          {/* 10. TEAMMATES FEATURES (Admin & Rating) */}
          <Route path="/admin" element={<AdminDashboard />} />
          <Route path="/rate-order/:orderId" element={<RateOrder />} />

        </Routes>
      </AuthProvider>
    </Router>
  );
}

export default App;