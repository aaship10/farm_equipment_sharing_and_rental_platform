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
          // 1. Save token, userId and name to Auth Context
          login(data.token, data.userId, data.name); 
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
    <div className='flex flex-col min-h-screen bg-amber-50'>
      <main className='flex-grow flex items-center justify-center'>

        <div className='rounded-xl overflow-hidden shadow-2xl max-w-5xl w-full m-10 bg-white flex'>

          {/* Left Side: Tractor image with overlay (hidden on small screens) */}
          <div
            className='w-1/2 relative hidden md:block'
            style={{ backgroundImage: "url('/Tractor.jpeg')", backgroundSize: 'cover', backgroundPosition: 'center' }}
          >
            <div className='absolute inset-0 bg-gradient-to-r from-emerald-900/80 to-emerald-600/30 flex items-center justify-center p-10'>
              <div className='text-center text-white'>
                <h2 className='text-4xl font-extrabold mb-2'>Equip for the Field</h2>
                <p className='text-lg'>Rent and share farm equipment with your local community.</p>
              </div>
            </div>
          </div>

          {/* Right Side: Form */}
          <div className='w-full md:w-1/2 p-10 flex flex-col justify-center gap-6'>
            <div className='flex items-center gap-3'>
              <div className='bg-emerald-700 text-white rounded-full p-2 shadow-md'>
                <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M21 15c-3 0-5-2-7-4s-4-4-7-4" />
                  <path d="M3 21s4-2 8-2 8 2 8 2" />
                </svg>
              </div>

              <h1 className='text-3xl font-extrabold text-emerald-900'>
                {isLogin ? 'Welcome Back!' : 'Join the Farm Community'}
              </h1>
            </div>

            <p className='text-slate-600'>
              {isLogin ? 'Sign in to manage your bookings and listings.' : 'Create an account to list or rent farm equipment.'}
            </p>

            <form onSubmit={handleSubmit} className='flex flex-col gap-4 w-full'>

              {!isLogin && (
                <input
                  name='name'
                  value={formData.name}
                  onChange={handleChange}
                  type='text'
                  placeholder='Full Name'
                  className='p-3 border border-emerald-200 rounded-md focus:outline-none focus:ring-2 focus:ring-emerald-500 transition-all'
                  required
                />
              )}

              <input
                name='email'
                value={formData.email}
                onChange={handleChange}
                type='email'
                placeholder='Email'
                className='p-3 border border-emerald-200 rounded-md focus:outline-none focus:ring-2 focus:ring-emerald-500 transition-all'
                required
              />

              <input
                name='password'
                value={formData.password}
                onChange={handleChange}
                type='password'
                placeholder='Password'
                className='p-3 border border-emerald-200 rounded-md focus:outline-none focus:ring-2 focus:ring-emerald-500 transition-all'
                required
              />

              {!isLogin && (
                <input
                  name='confirmPassword'
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  type='password'
                  placeholder='Confirm Password'
                  className='p-3 border border-emerald-200 rounded-md focus:outline-none focus:ring-2 focus:ring-emerald-500 transition-all'
                  required
                />
              )}

              <div className='flex items-center justify-between mt-2'>
                <button
                  type='submit'
                  className='p-3 bg-emerald-700 text-white font-bold rounded-md hover:bg-emerald-800 transition-colors shadow-md'
                >
                  {isLogin ? 'Login' : 'Sign Up'}
                </button>

                <button
                  type='button'
                  onClick={() => setIsLogin(!isLogin)}
                  className='text-sm text-emerald-700 underline hover:text-emerald-900'
                >
                  {isLogin ? "Don't have an account? Register" : 'Already have an account? Login'}
                </button>
              </div>

            </form>

          </div>

        </div>

      </main>
      <Footer />
    </div>
  );
}

export default Login;