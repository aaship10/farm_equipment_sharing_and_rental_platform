import React from 'react';
import { useNavigate } from 'react-router-dom'; 
import Header from './components/header.jsx';

const BookTanker = ({ tankers = [] }) => {

  const navigate = useNavigate(); // Initialize hook

  const handleBookNow = (tanker) => {
    // Navigate to confirm-order and pass the tanker object in state
    navigate('/confirm-order', { state: { tanker } });
  };

  return (
    <>
      <Header />
      <main className="container mx-auto my-8 px-4 font-poppins">
        {/* Page Header */}
        <div className="text-center py-8">
          <h1 className="text-4xl font-bold text-primary-blue-dark">
            Available Water Tankers
          </h1>
          <p className="text-text-muted text-lg mt-2">
            Compare suppliers and book the one that's right for you.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {tankers && tankers.length > 0 ? (
            tankers.map((tanker) => (
              <div key={tanker.id} className="col-span-1">
                <div className="bg-white-bg rounded-[15px] border border-border-color shadow-sm transition-all duration-300 hover:-translate-y-2 hover:shadow-xl flex flex-col h-full overflow-hidden">
                  
                  {/* Card Header */}
                  <div className="bg-light-blue-bg p-4 border-b border-border-color">
                    <h5 className="text-xl font-semibold text-primary-blue-dark leading-tight">
                      {tanker.business_name}
                    </h5>
                    <div className="flex items-center gap-1 mt-1 text-sm">
                      <i className="fas fa-star text-yellow-500"></i>
                      <strong className="text-text-dark">
                        {parseFloat(tanker.average_rating).toFixed(1)}
                      </strong>
                      <span className="text-text-muted">
                        ({tanker.rating_count} reviews)
                      </span>
                    </div>
                  </div>

                  {/* Card Body */}
                  <div className="p-6 flex flex-col grow">
                    <div className="space-y-3 mb-6">
                      <div className="flex justify-between items-center text-text-muted">
                        <span>Capacity</span>
                        <strong className="text-text-dark font-medium">
                          {tanker.capacity_litres.toLocaleString('en-IN')} Litres
                        </strong>
                      </div>
                      <div className="flex justify-between items-center text-text-muted">
                        <span>Price / 1000L</span>
                        <strong className="text-text-dark font-medium">
                          ₹{tanker.price_per_1000_litres.toLocaleString('en-IN')}
                        </strong>
                      </div>
                    </div>

                    {/* Total Price Box */}
                    <div className="bg-light-blue-bg rounded-xl p-4 text-center mb-6 mt-auto">
                      <p className="text-text-muted text-sm mb-1">Total Estimated Price</p>
                      <h4 className="text-2xl font-bold text-primary-blue-dark">
                        ₹{((tanker.capacity_litres / 1000) * tanker.price_per_1000_litres).toLocaleString('en-IN')}
                      </h4>
                    </div>

                    <div className="mt-auto"> {/* ensuring alignment */}
                      <button 
                        onClick={() => handleBookNow(tanker)}
                        className="w-full bg-gradient-to-r from-primary-blue to-primary-blue-dark text-white font-bold py-3 rounded-lg shadow-md hover:scale-[1.03]"
                      >
                        Book Now
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))
          ) : (
            /* No Tankers State */
            <div className="col-span-full">
              <div className="bg-white-bg rounded-[15px] p-12 text-center border border-border-color flex flex-col items-center justify-center">
                <div className="bg-light-blue-bg p-6 rounded-full mb-4">
                  <i className="fas fa-info-circle text-5xl text-primary-blue"></i>
                </div>
                <h2 className="text-2xl font-bold text-primary-blue-dark">No Tankers Available</h2>
                <p className="text-text-muted max-w-md mx-auto mt-2">
                  Sorry, no tankers are currently available in your area. Please check back later.
                </p>
              </div>
            </div>
          )}
        </div>
      </main>
    </>
  );
};

export default BookTanker;