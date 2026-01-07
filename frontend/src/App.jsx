import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './pages/home';
import Login from './pages/login';
import BookTanker from './pages/book_rental_products'; // Ensure this matches your filename
import ConfirmOrder from './pages/ConfirmOrder'; 
import { AuthProvider } from './pages/AuthProvider';
import Header from './pages/components/Header';
import TrackOrder from './pages/TrackOrder'; 
import About from "./pages/About";
import FAQ from "./pages/FAQ";
import DriverDashboard from './pages/DriverDashboard';
import RegisterProduct from './pages/RegisterProduct';

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
          
          {/* 5. Product Listing (Fetching from DB now) */}
          <Route path="/book-rental-product" element={<BookTanker />} />
          
          {/* 6. Order Confirmation */}
          <Route path="/confirm-order" element={<ConfirmOrder />} />
          
          {/* 7. Tracking */}
          <Route path="/track-order/:orderId" element={<TrackOrder />} />
          
          {/* 8. Static Pages */}
          <Route path="/about" element={<About />} />
          <Route path="/faq" element={<FAQ />} />

        </Routes>
      </AuthProvider>
    </Router>
  );
}

export default App;