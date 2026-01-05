import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import Header from './components/header.jsx'; // Ensure this path matches your folder structure
import { MapPin, Receipt } from 'lucide-react';
import { useAuth } from './useAuth'; // Ensure this path points to your useAuth hook

const ConfirmOrder = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [deliveryAddress, setDeliveryAddress] = useState('');

  // 1. Retrieve the tanker object passed via navigation state
  const tanker = location.state?.tanker;

  // 2. Redirect if accessed directly without a tanker selection
  useEffect(() => {
    if (!tanker) {
      alert("No tanker selected. Redirecting to booking page.");
      navigate('/book-tanker');
    }
  }, [tanker, navigate]);

  // Prevent rendering if tanker is missing (while redirecting)
  if (!tanker) return null;

  const totalPrice = (tanker.capacity_litres / 1000) * tanker.price_per_1000_litres;

  const handlePayment = async (e) => {
    e.preventDefault();

    if (!deliveryAddress) {
      alert('Please enter a delivery address.');
      return;
    }

    try {
      // Create Razorpay order on the server
      const response = await fetch('http://localhost:5000/create-order-razorpay', {
        method: 'POST',
        headers: { 
            'Content-Type': 'application/json',
            // Add Authorization header if your backend requires it
            // 'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify({ totalPrice })
      });

      const order = await response.json();

      if (!response.ok) {
        throw new Error(order.message || 'Server error creating order');
      }

      // Open Razorpay Checkout
      const options = {
        key: import.meta.env.VITE_RAZORPAY_KEY_ID, 
        amount: order.amount,
        currency: "INR",
        name: "H2OConnect",
        description: "Water Tanker Booking",
        image: "/logo.jpeg",
        order_id: order.id,
        handler: async function (response) {
          // Verify payment on the server
          const verificationResponse = await fetch('http://localhost:5000/payment-verification', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_order_id: response.razorpay_order_id,
              razorpay_signature: response.razorpay_signature,
              tankerId: tanker.id,
              deliveryAddress,
              totalPrice
            })
          });

          const result = await verificationResponse.json();
          if (result.success) {
            alert("Payment Successful!");
            navigate('/'); // Navigate to home or an order success page
          } else {
            alert('Payment verification failed.');
          }
        },
        prefill: {
          // Note: Your current AuthProvider only stores boolean for user. 
          // You might need to fetch real user details or store them in context.
          name: user?.name || "Valued Customer", 
          contact: user?.phone || ""
        },
        theme: {
          color: "#3b82f6" 
        }
      };

      const rzp1 = new window.Razorpay(options);
      rzp1.on('payment.failed', (response) => {
        alert('Payment Failed: ' + response.error.description);
      });
      rzp1.open();

    } catch (error) {
      console.error("Payment error:", error);
      alert("Something went wrong with the payment process: " + error.message);
    }
  };

  return (
    <div className="min-h-screen bg-blue-50 font-poppins">
      <Header />
      
      <main className="container mx-auto my-12 px-4">
        <div className="flex justify-center">
          <div className="w-full max-w-2xl bg-white rounded-2xl shadow-xl overflow-hidden border border-gray-100">
            
            {/* Header */}
            <div className="bg-blue-50 text-center py-10 border-b border-gray-200">
              <h2 className="text-3xl font-bold text-blue-900">Almost There!</h2>
              <p className="text-gray-500 mt-2">Confirm your details to place the order.</p>
            </div>

            <div className="p-8 md:p-12">
              {/* Order Summary */}
              <section className="mb-10">
                <div className="flex items-center gap-2 mb-6 text-blue-900 font-semibold text-lg">
                  <Receipt size={20} />
                  <h3>Order Summary</h3>
                </div>
                
                <div className="space-y-4 text-gray-700">
                  <div className="flex justify-between py-2 border-b border-gray-100">
                    <span className="text-gray-500">Supplier:</span>
                    <span className="font-semibold text-gray-900">{tanker.business_name}</span>
                  </div>
                  <div className="flex justify-between py-2 border-b border-gray-100">
                    <span className="text-gray-500">Capacity:</span>
                    <span className="font-semibold text-gray-900">{tanker.capacity_litres.toLocaleString('en-IN')} Litres</span>
                  </div>
                  <div className="flex justify-between py-2 border-b border-gray-100">
                    <span className="text-gray-500">Price Rate:</span>
                    <span className="font-semibold text-gray-900">₹{tanker.price_per_1000_litres.toLocaleString('en-IN')} / 1000L</span>
                  </div>
                  
                  {/* Total Row */}
                  <div className="flex justify-between pt-6 border-t-2 border-gray-900 text-xl font-bold mt-4">
                    <span>Total Price:</span>
                    <span className="text-blue-600">₹{totalPrice.toLocaleString('en-IN')}</span>
                  </div>
                </div>
              </section>

              {/* Delivery Form */}
              <form onSubmit={handlePayment}>
                <div className="mb-8">
                  <label htmlFor="deliveryAddress" className="flex items-center gap-2 font-semibold text-blue-900 mb-3">
                    <MapPin size={18} />
                    Enter Your Full Delivery Address
                  </label>
                  <textarea
                    id="deliveryAddress"
                    rows="3"
                    className="w-full p-4 rounded-xl border border-gray-200 focus:ring-4 focus:ring-blue-100 focus:border-blue-500 outline-none transition-all placeholder:text-gray-300"
                    placeholder="e.g., House No. 123, Sunshine Apartments, ABC Road, Pune, Maharashtra - 411001"
                    value={deliveryAddress}
                    onChange={(e) => setDeliveryAddress(e.target.value)}
                    required
                  />
                </div>

                <div className="text-center mb-6">
                  <p className="text-gray-400 text-sm leading-relaxed">
                    By clicking "Confirm & Pay", you agree to our terms and will be redirected to our secure payment gateway.
                  </p>
                </div>

                <button
                  type="submit"
                  className="w-full bg-gradient-to-r from-blue-600 to-blue-800 text-white font-bold py-4 rounded-xl text-lg shadow-lg hover:shadow-blue-200 transition-all hover:-translate-y-0.5"
                >
                  Confirm & Pay
                </button>
              </form>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default ConfirmOrder;