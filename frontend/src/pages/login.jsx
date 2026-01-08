import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Footer from './components/footer'; // Ensure this path is correct
import { useAuth } from './useAuth'; // Ensure this path is correct

function Login() {
  const [isLogin, setIsLogin] = useState(true); // Default to Login view
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: ''
  });
  
  const navigate = useNavigate();
  const { login } = useAuth();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validate passwords match during Registration
    if (!isLogin && formData.password !== formData.confirmPassword) {
      alert("Passwords do not match!");
      return;
    }

    const endpoint = isLogin ? '/auth/login' : '/auth/register';

    try {
      const payload = isLogin 
        ? { 
            email: formData.email, 
            password: formData.password 
          } 
        : { 
            name: formData.name, 
            email: formData.email, 
            password: formData.password 
          };

      const response = await fetch(`http://localhost:3000${endpoint}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      });

      const data = await response.json();

      if (response.ok) {
        if (isLogin) {
          // ACTION: User tapped "Login" button
          // 1. Save token and userId to Auth Context
          login(data.token, data.userId); 
          // 2. Redirect to home page
          navigate('/'); 
        } else {
          // ACTION: User tapped "Sign Up" button
          // alert('Registration Successful! Please login.');
          // 1. Switch UI to Login form
          setIsLogin(true);
          // 2. Clear sensitive fields
          setFormData({ ...formData, password: '', confirmPassword: '' });
        }
      } else {
        alert(data.error || data.message || 'Something went wrong');
      }
    } catch (err) {
      console.error('Error:', err);
      alert("Cannot connect to server. Check if backend is running on port 3000.");
    }
  };

  return (
    <div className='flex flex-col min-h-screen'>
      <main className='flex-grow flex flex-col justify-center items-center'>
        
        <div className='bg-fuchsia-200 flex flex-row rounded-xl overflow-hidden shadow-2xl max-w-5xl w-full m-10'>
          
          {/* Left Side: Info & Toggle */}
          <div className='p-10 w-1/2 flex justify-center items-center flex-col gap-6 text-center'>
            <p className='text-6xl font-extrabold text-white drop-shadow-md'>
              {isLogin ? 'Welcome Back!' : 'Join Us Today!'}
            </p>
            <span className='text-purple-900 text-lg font-medium'>
              {isLogin 
                ? 'Login to continue your booking journey.' 
                : 'Start your journey with us by creating an account.'}
            </span>
            <span className='text-indigo-600 font-semibold'>
              {isLogin ? "Don't have an account?" : "Already have an account?"} 
              <button 
                onClick={() => setIsLogin(!isLogin)} 
                className='ml-2 underline hover:text-indigo-800 transition-colors cursor-pointer'
              >
                {isLogin ? 'Register here' : 'Login here'}
              </button>
            </span>
          </div>

          {/* Right Side: Form */}
          <div className='bg-indigo-300 w-1/2 flex flex-col justify-center items-center gap-6 p-10'>
            <h1 className='text-4xl font-extrabold text-white'>
              {isLogin ? 'Login to Account' : 'Create Account'}
            </h1>
            
            <form onSubmit={handleSubmit} className='flex flex-col gap-4 w-full px-8'>
              
              {!isLogin && (
                <input 
                  name='name'
                  value={formData.name}
                  onChange={handleChange}
                  type='text' 
                  placeholder='Full Name'
                  className='p-3 border border-purple-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500 transition-all'
                  required
                />
              )}

              <input 
                name='email'
                value={formData.email}
                onChange={handleChange}
                type='email' 
                placeholder='Email'
                className='p-3 border border-purple-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500 transition-all'
                required
              />
              
              <input
                name='password'
                value={formData.password}
                onChange={handleChange}
                type='password'
                placeholder='Password'
                className='p-3 border border-purple-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500 transition-all'
                required
              />

              {!isLogin && (
                 <input
                   name='confirmPassword'
                   value={formData.confirmPassword}
                   onChange={handleChange}
                   type='password'
                   placeholder='Confirm Password'
                   className='p-3 border border-purple-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500 transition-all'
                   required
                 />
              )}

              <button
                type='submit'
                className='mt-4 p-3 bg-purple-600 text-white font-bold rounded-md hover:bg-purple-700 transition-colors shadow-md'
              >
                {isLogin ? 'Login' : 'Sign Up'}
              </button>
            </form>
          </div>

        </div>
      </main>
      <Footer />
    </div>
  );
}

export default Login;