import Footer from './components/footer';
import img1 from '/p1-1.webp';
import {Link} from 'react-router-dom';
function Home() {
  return (
    <div className='flex flex-col min-h-screen'>
      <main className='flex-grow'>
        <div className='flex flex-row flex-wrap justify-center items-center p-4'>
          <div className='w-screen bg-indigo-100 flex justify-between items-left rounded-lg shadow-md font-extrabold p-8 flex-row'>
            <div className='flex flex-col justify-left items-left'>
              <h1 className='text-indigo-900 font-extrabold text-7xl'>Shop with Love!</h1>
              <h6 className='text-indigo-600'>Handle with care</h6>
            </div>
            <img src={img1} className='h-40 rounded-md' />
          </div>  

          <div className='w-screen flex justify-center items-center font-extrabold p-8 flex-col'>
            <div className='text-4xl'>
              Top Selling Products
            </div>
            <div className='flex flex-row flex-wrap justify-center items-center gap-24 mt-4 py-3 mb-6'>
              {/* Product Cards */}
              
            </div>
            <div>
              <Link to={'/book-rental-product'} className='bg-fuchsia-300 text-black px-56 py-3 rounded-full hover:bg-fuchsia-500 hover:text-white mt-6'>
                View All Products
              </Link>
            </div>
          </div> 

          <div className='flex flex-col justify-center items-center w-screen p-5 bg-slate-300'>
            <p className='text-3xl font-extrabold mb-6'>
              What Our Customers Say
            </p>
            <div className='flex flex-wrap justify-center items-center p-5 gap-10'>
              <div className='bg-white rounded-lg shadow-md p-6 mb-4 w-1/3 text-wrap'>
                <p className='text-gray-700 italic text-wrap'>"Amazing!"</p>
                <p className='text-gray-900 font-bold mt-2'>- Sarah M.</p>
              </div>
              <div className='bg-white rounded-lg shadow-md p-6 mb-4 w-1/3 text-wrap'>
                <p className='text-gray-700 italic'>"Wonderful!."</p>
                <p className='text-gray-900 font-bold mt-2'>- Emily R.</p>
              </div>
              <div className='bg-white rounded-lg shadow-md p-6 mb-4 w-1/3'>
                <p className='text-gray-700 italic text-wrap'>"Amazing!"</p>
                <p className='text-gray-900 font-bold mt-2'>- Sarah M.</p>
              </div>
              <div className='bg-white rounded-lg shadow-md p-6 mb-4 w-1/3 text-wrap'>
                <p className='text-gray-700 italic'>"Wonderful."</p>
                <p className='text-gray-900 font-bold mt-2'>- Emily R.</p>
              </div>
            </div>
          </div>

        </div>
      </main>
      <Footer />
    </div>
  );
}

export default Home;