import React from 'react';
import image1 from './../assets/news.png';
import image2 from './../assets/dashboard.png';
import image3 from './../assets/timeline.png';
import { useNavigate } from 'react-router-dom';

export const Landing = () => {
  const navigate = useNavigate();
  return (
    <>
      <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 py-12">
        <div className="flex flex-wrap justify-center items-center mb-10 relative -mt-12 space-x-4 sm:space-x-0">
          <img
            src={image1}
            alt="Image 1"
            className="w-full sm:w-1/3 max-w-xs sm:max-w-sm h-auto object-cover rounded-lg shadow-lg transform sm:-translate-x-4 mb-4 sm:mb-0"
          />
          <img
            src={image2}
            alt="Image 2"
            className="w-full sm:w-1/2 max-w-xs sm:max-w-md h-auto object-cover rounded-lg shadow-lg z-10 mb-4 sm:mb-0"
          />
          <img
            src={image3}
            alt="Image 3"
            className="w-full sm:w-1/4 max-w-xs sm:max-w-sm h-auto object-cover rounded-lg shadow-lg transform sm:translate-x-4"
          />
        </div>
        <div className="text-center mb-7 mt-4">
          <h1 className="text-2xl sm:text-3xl text-gray-700 font-bold mb-4">
            Master Your Portfolio with Real-Time Insights
          </h1>
          <p className="text-base sm:text-lg text-gray-600">
            Track profits, stay updated with the latest news, and create a timeline of your investment journey.
          </p>
        </div>
        <button
          className="bg-blue-600 text-white text-base font-bold py-3 px-7 rounded hover:bg-blue-700"
          onClick={() => {
            navigate('/signup');
          }}
        >
          Sign Up Now
        </button>
      </div>
    </>
  );
};
