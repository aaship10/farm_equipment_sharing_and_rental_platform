import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './pages/home';
import Login from './pages/login';
import BookTanker from './pages/book_rental_products';
import ConfirmOrder from './pages/ConfirmOrder'; 
import { AuthProvider } from './pages/AuthProvider';
import Header from './pages/components/Header';
import TrackOrder from './pages/TrackOrder'; // Ensure this import is present
import About from "./pages/About";
import FAQ from "./pages/FAQ";


function App() {
  const mockData = {
    lastOrder: { order_time: new Date().toISOString() },
    totalSpentThisMonth: 4500,
    trustedSuppliersCount: 3,
    userSocietyId: null,
    societies: [{ id: 1, society_name: "Green View Residency" }],
    ordersToRate: []
  };

  const mockTankers = [
    {
      id: 1,
      business_name: "AquaSwift Deliveries",
      average_rating: 4.8,
      rating_count: 124,
      capacity_litres: 5000,
      price_per_1000_litres: 650
    },
    {
      id: 2,
      business_name: "Blue Whale Water Co.",
      average_rating: 4.2,
      rating_count: 89,
      capacity_litres: 10000,
      price_per_1000_litres: 550
    },
    {
      id: 3,
      business_name: "Pristine Pumping Services",
      average_rating: 4.5,
      rating_count: 56,
      capacity_litres: 6000,
      price_per_1000_litres: 600
    },
    {
      id: 4,
      business_name: "City Hydration Solutions",
      average_rating: 3.9,
      rating_count: 210,
      capacity_litres: 8000,
      price_per_1000_litres: 500
    },
    {
      id: 5,
      business_name: "Everest Fresh Water",
      average_rating: 4.7,
      rating_count: 45,
      capacity_litres: 4000,
      price_per_1000_litres: 700
    },
    {
      id: 6,
      business_name: "Oceanic Bulk Water",
      average_rating: 4.1,
      rating_count: 12,
      capacity_litres: 12000,
      price_per_1000_litres: 520
    }
  ];

  return (
    <Router>
      <AuthProvider>
        <Header />
        <Routes>
          <Route path="/" element={<Home {...mockData} />} />
          <Route path="/login" element={<Login />} />
          <Route path="/book-rental-product" element={<BookTanker tankers={mockTankers} />} />
          <Route path="/confirm-order" element={<ConfirmOrder />} />
          {/* REGISTER THE TRACKING ROUTE HERE */}
          <Route path="/track-order/:orderId" element={<TrackOrder />} />
          <Route path="/about" element={<About />} />
<Route path="/faq" element={<FAQ />} />

        </Routes>
      </AuthProvider>
    </Router>
  );
}

export default App;