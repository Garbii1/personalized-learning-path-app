// client/src/pages/HomePage.jsx
import React from 'react';
import HeroSection from '../components/home/HeroSection'; // Import the component

function HomePage() {
  return (
    <div>
      <HeroSection />

      {/* Add other sections of your homepage below */}
      <section className="py-16 px-4 container mx-auto">
        <h2 className="text-3xl font-bold text-center mb-8">Features</h2>
        {/* Add feature cards or descriptions */}
        <div className="text-center text-gray-700">
          Find your unique path to knowledge.
        </div>
      </section>

      {/* More sections as needed */}

    </div>
  );
}

export default HomePage;