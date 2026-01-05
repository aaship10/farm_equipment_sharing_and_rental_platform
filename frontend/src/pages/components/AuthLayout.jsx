import React from 'react';
import { Link } from 'react-router-dom';

const AuthLayout = ({ children, isLogin }) => {
  return (
    <div className="flex min-h-screen w-full flex-row overflow-x-hidden bg-white font-sans">
      {/* Left Panel - Hidden on Mobile */}
      <div 
        className="hidden md:flex flex-1 flex-col items-center justify-center p-12 bg-cover bg-center"
        style={{ backgroundImage: `url('data:image/webp;base64,UklGRtg9AAB...')` }} // Your base64 string here
      >
        <h1 className="text-[33px] font-bold text-black mb-2">
          Save. Educate. Protect.
        </h1>
        <p className="text-center text-black mb-6">
          {isLogin ? "Deep dive into reducing the wastage of water" : "Join the future of reducing water wastage"}
        </p>
        <Link 
          to={isLogin ? "/register" : "/login"}
          className="bg-black text-white px-8 py-3 rounded-full font-medium transition-all duration-200 hover:bg-[#149cc5] hover:shadow-lg active:bg-[#20e4d3] active:scale-95"
        >
          {isLogin ? "Register" : "Login"}
        </Link>
      </div>

      {/* Right Panel / Main Container */}
      <div className="flex-[0.5] w-full md:w-1/2 flex items-center justify-center md:justify-end p-5 md:pr-[5%] bg-gradient-to-br from-[#667eea] to-[#764ba2]">
        <div className="relative w-full max-w-[420px] bg-[#f3f3f3] border border-black rounded-[24px] px-10 py-12 shadow-xl">
          <div className="text-center mb-8">
            <h2 className="text-[2.2rem] font-bold text-black tracking-tight mb-2 leading-tight">
              {isLogin ? "Welcome Back" : "Join the Change"}
            </h2>
            <p className="text-black text-sm opacity-80 leading-relaxed">
              {isLogin ? "Login with your phone number to continue" : "Create an account to manage your water usage"}
            </p>
          </div>

          {children}

          {/* Divider */}
          <div className="relative flex items-center justify-center my-8">
            <div className="absolute w-full h-[3px] bg-white"></div>
            <span className="relative z-10 bg-[#141723e6] px-6 py-1 rounded-2xl text-white text-[0.85rem] font-medium backdrop-blur-md">
              or continue with
            </span>
          </div>

          {/* Google Button */}
          <button className="w-full flex items-center justify-center gap-3 bg-[#4285F4] border-2 border-blue-400/30 text-white font-medium py-[0.9rem] rounded-xl transition-all duration-300 hover:bg-[#3367D6] hover:scale-[1.02] backdrop-blur-md">
            <i className="fab fa-google text-lg"></i>
            {isLogin ? "Sign In with Google" : "Sign up with Google"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default AuthLayout;