import Footer from './components/footer';
import {Link} from 'react-router-dom';
function Home() {
  return (
    <div className='flex flex-col min-h-screen'>
      <main className='flex-grow'>
        {/* HERO */}
        <header className='max-w-6xl mx-auto px-6 py-12'>
          <div className='bg-green-50 rounded-2xl shadow-lg overflow-hidden grid md:grid-cols-2 gap-6 items-center p-8'>
            <div>
              <h1 className='text-5xl md:text-6xl font-extrabold text-green-900 leading-tight'>Farm equipment, shared locally</h1>
              <p className='mt-4 text-lg text-green-700 max-w-xl'>Rent tractors, harvesters and more from trusted local suppliers — fast, affordable, and sustainable.</p>
              <div className='mt-6 flex gap-4'>
                <Link to='/book-rental-product' className='inline-block bg-amber-500 hover:bg-amber-600 text-white font-bold py-3 px-6 rounded-lg shadow'>Find Equipment 🚜</Link>
                <Link to='/register-product' className='inline-block border border-green-700 text-green-700 font-bold py-3 px-6 rounded-lg hover:bg-green-700 hover:text-white transition'>List Equipment 🌾</Link>
              </div>
              <div className='mt-6 text-sm text-green-600 flex items-center gap-3'>
                <span className='inline-flex items-center gap-2 bg-white/60 px-3 py-1 rounded-full shadow-sm'>✅ Trusted suppliers</span>
                <span className='inline-flex items-center gap-2 bg-white/60 px-3 py-1 rounded-full shadow-sm'>💸 Secure payments</span>
              </div>
            </div>
            <div className='flex justify-center'>
              <img src="Tractor.jpeg" alt='farm equipment' className='w-full max-w-md rounded-lg object-cover shadow-xl' />
            </div>
          </div>
        </header>

        {/* HOW IT WORKS */}
        <section className='max-w-6xl mx-auto px-6 py-12'>
          <h2 className='text-3xl font-bold text-green-900 mb-6 text-center'>How it works</h2>
          <div className='grid grid-cols-1 md:grid-cols-3 gap-6'>
            <div className='bg-white p-6 rounded-xl shadow hover:shadow-lg transition'>
              <div className='text-4xl'>🔍</div>
              <h3 className='mt-4 font-bold text-green-800'>Search</h3>
              <p className='mt-2 text-sm text-slate-600'>Browse nearby machinery and compare hourly rates.</p>
            </div>
            <div className='bg-white p-6 rounded-xl shadow hover:shadow-lg transition'>
              <div className='text-4xl'>🤝</div>
              <h3 className='mt-4 font-bold text-green-800'>Book</h3>
              <p className='mt-2 text-sm text-slate-600'>Choose rental hours, pay securely, and confirm your booking.</p>
            </div>
            <div className='bg-white p-6 rounded-xl shadow hover:shadow-lg transition'>
              <div className='text-4xl'>🚜</div>
              <h3 className='mt-4 font-bold text-green-800'>Use</h3>
              <p className='mt-2 text-sm text-slate-600'>Equipment delivered to your farm or pick-up from the owner.</p>
            </div>
          </div>
        </section>

        {/* FEATURES */}
        <section className='bg-green-50 py-12'>
          <div className='max-w-6xl mx-auto px-6'>
            <h2 className='text-3xl font-bold text-green-900 mb-6 text-center'>Why farmers love us</h2>
            <div className='grid grid-cols-1 md:grid-cols-3 gap-6'>
              <div className='bg-white p-6 rounded-xl shadow'>
                <h4 className='font-bold text-green-800'>Affordable</h4>
                <p className='text-sm text-slate-600 mt-2'>Pay hourly rates only when you need equipment.</p>
              </div>
              <div className='bg-white p-6 rounded-xl shadow'>
                <h4 className='font-bold text-green-800'>Local & Trusted</h4>
                <p className='text-sm text-slate-600 mt-2'>Verified owners and review-based trust.</p>
              </div>
              <div className='bg-white p-6 rounded-xl shadow'>
                <h4 className='font-bold text-green-800'>Sustainable</h4>
                <p className='text-sm text-slate-600 mt-2'>Share resources, reduce waste.</p>
              </div>
            </div>
          </div>
        </section>

        {/* TESTIMONIALS */}
        <section className='max-w-6xl mx-auto px-6 py-12'>
          <h2 className='text-3xl font-bold text-green-900 mb-6 text-center'>What our customers say</h2>
          <div className='grid grid-cols-1 md:grid-cols-3 gap-6'>
            <div className='bg-white p-6 rounded-xl shadow'>
              <p className='text-slate-700 italic'>"Saved me days of work during harvest season!"</p>
              <p className='text-slate-900 font-bold mt-4'>— Ramesh (Farmer)</p>
            </div>
            <div className='bg-white p-6 rounded-xl shadow'>
              <p className='text-slate-700 italic'>"Excellent equipment, on-time delivery."</p>
              <p className='text-slate-900 font-bold mt-4'>— Anita (Farmer)</p>
            </div>
            <div className='bg-white p-6 rounded-xl shadow'>
              <p className='text-slate-700 italic'>"Affordable and straightforward booking."</p>
              <p className='text-slate-900 font-bold mt-4'>— Deepak (Contractor)</p>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}

export default Home;