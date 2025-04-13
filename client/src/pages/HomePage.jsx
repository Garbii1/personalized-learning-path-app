// client/src/pages/HomePage.jsx
import React from 'react';
import HeroSection from '../components/home/HeroSection'; // Import the component

function HomePage() {
  return (
    // No extra div needed usually, App.jsx handles main layout
    <>
      <HeroSection />

      {/* --- FEATURES SECTION - RESPONSIVE FIX --- */}
      {/* Increased vertical padding (py), adjusted text sizes */}
      <section className="py-16 sm:py-20 px-4 container mx-auto text-center">
        <h2 className="text-3xl sm:text-4xl font-bold text-gray-800 mb-4">
          Features
        </h2>
        <p className="text-base sm:text-lg text-gray-600 max-w-xl mx-auto">
          Find your unique path to knowledge. {/* Keep it concise or add more descriptive text */}
        </p>
        {/* Add feature cards or descriptions below if needed */}
        {/* Example Grid for Feature Cards (Add if you have features) */}
        {/* <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-12"> */}
        {/*   <div className="bg-white p-6 rounded-lg shadow">Feature 1...</div> */}
        {/*   <div className="bg-white p-6 rounded-lg shadow">Feature 2...</div> */}
        {/*   <div className="bg-white p-6 rounded-lg shadow">Feature 3...</div> */}
        {/* </div> */}
      </section>
      {/* --- END FEATURES SECTION FIX --- */}

      {/* More sections as needed */}

    </>
  );
}

export default HomePage;