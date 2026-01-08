import React from "react";
import { Link } from 'react-router-dom';
import Footer from "./components/footer";
function About() {
  return (
    <>
      <div className="min-h-screen bg-gradient-to-b from-green-50 to-white p-8">
        <div className="max-w-5xl mx-auto bg-white rounded-xl shadow-lg p-10">

          <header className="mb-6">
            <h1 className="text-4xl font-bold text-green-900 mb-3">About Sahayak</h1>
            <p className="text-gray-700 text-lg">We help farmers and contractors access the right machinery at the right time - making operations efficient, affordable, and sustainable.</p>
          </header>

          <section className="grid grid-cols-1 md:grid-cols-2 gap-6 items-center mb-8">
            <div>
              <h3 className="text-2xl font-bold text-green-800">Our Mission</h3>
              <p className="mt-2 text-slate-600">Make sustainable farm operations simpler by enabling easy access to equipment, smart recommendations, and secure local transactions.</p>
              <div className="mt-4 flex gap-3">
                <Link to="/book-rental-product" className="bg-amber-500 text-white px-4 py-2 rounded-lg font-bold">Find Equipment 🚜</Link>
                <Link to="/register-product" className="border border-green-700 text-green-700 px-4 py-2 rounded-lg font-bold hover:bg-green-700 hover:text-white">List Equipment 🌾</Link>
              </div>
            </div>

            <div className="bg-green-50 p-4 rounded-lg text-center">
              <img src="Tractor.jpeg" alt="tractor" className="mx-auto w-full max-w-sm rounded-md object-cover shadow" />
            </div>
          </section>

          <section className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <div className="bg-white p-6 rounded-xl shadow text-center">
              <h4 className="text-green-800 font-bold text-2xl">1,200+</h4>
              <p className="text-slate-600 mt-1">Successful Rentals</p>
            </div>
            <div className="bg-white p-6 rounded-xl shadow text-center">
              <h4 className="text-green-800 font-bold text-2xl">10,000+</h4>
              <p className="text-slate-600 mt-1">Hours Saved</p>
            </div>
            <div className="bg-white p-6 rounded-xl shadow text-center">
              <h4 className="text-green-800 font-bold text-2xl">850+</h4>
              <p className="text-slate-600 mt-1">Farms Supported</p>
            </div>
          </section>

          <section className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-green-50 p-6 rounded-xl shadow">
              <h3 className="font-bold text-green-800 mb-2">Verified Suppliers</h3>
              <p className="text-slate-600">All equipment owners are verified and reviewed to ensure reliability and fair pricing.</p>
            </div>
            <div className="bg-green-50 p-6 rounded-xl shadow">
              <h3 className="font-bold text-green-800 mb-2">Smart Farming Tools</h3>
              <p className="text-slate-600">From soil sensors to crop recommendations, we integrate data-driven tools to help you choose the right machinery and timings.</p>
            </div>
          </section>

          <section className="mt-8 bg-white p-6 rounded-xl shadow">
            <h3 className="font-bold text-green-800">How we help during harvest</h3>
            <p className="text-slate-600 mt-2">During peak seasons, Sahayak helps farmers quickly rent harvesters and extra tractors, reducing idle time and ensuring timely operations.</p>
          </section>

        </div>
      </div>
      <Footer />
    </>
  );
}

export default About;
