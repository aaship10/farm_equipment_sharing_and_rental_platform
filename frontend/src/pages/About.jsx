import React from "react";

function About() {
  return (
    <div className="min-h-screen bg-purple-50 p-8">
      <div className="max-w-5xl mx-auto bg-white rounded-xl shadow-lg p-10">

        <h1 className="text-4xl font-bold text-purple-800 mb-6">
          About Our Platform
        </h1>

        <p className="text-gray-700 text-lg mb-6">
          Our platform is designed to simplify the process of renting farm and
          utility equipment while ensuring transparency, affordability, and
          reliability for users.
        </p>

        {/* EXISTING BOXES */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">

          <div className="bg-purple-100 p-6 rounded-lg text-center">
            <h3 className="font-bold text-xl text-purple-700 mb-2">
              Trusted Suppliers
            </h3>
            <p className="text-gray-700">
              All suppliers are verified to ensure quality service and reliable
              equipment delivery.
            </p>
          </div>

          <div className="bg-purple-100 p-6 rounded-lg text-center">
            <h3 className="font-bold text-xl text-purple-700 mb-2">
              Easy Equipment Booking
            </h3>
            <p className="text-gray-700">
              Users can easily book required equipment with transparent pricing
              and real-time availability.
            </p>
          </div>

          <div className="bg-purple-100 p-6 rounded-lg text-center">
            <h3 className="font-bold text-xl text-purple-700 mb-2">
              Secure Payments
            </h3>
            <p className="text-gray-700">
              The platform supports secure and reliable payment processing.
            </p>
          </div>

          {/* 🔥 NEW SINGLE HARDWARE BOX */}
          <div className="bg-indigo-100 p-6 rounded-lg text-center md:col-span-3">
            <h3 className="font-bold text-xl text-indigo-800 mb-2">
              Smart Soil Sensors & Crop Recommendation
            </h3>
            <p className="text-gray-700">
          The platform integrates hardware-based soil sensors that monitor parameters such as moisture, temperature, and pH, etc. Based on the analyzed soil data, the system recommends suitable crops and automatically suggests the required farming equipment, showing nearby availability so farmers can book everything from a single platform to improve yield and efficiency.
            </p>
          </div>

        </div>

      </div>
    </div>
  );
}

export default About;
