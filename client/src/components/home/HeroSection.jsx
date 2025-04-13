// client/src/components/home/HeroSection.jsx
import React, { useState, useEffect, useRef } from 'react';

// Import your videos (make sure paths are correct)
import video1 from '../../assets/videos/girlreading.mp4';

const videoSources = [video1]; // Add more as needed

function HeroSection() {
  const [currentVideoIndex, setCurrentVideoIndex] = useState(0);
  const videoRef = useRef(null);

  const playNextVideo = () => {
    setCurrentVideoIndex((prevIndex) => (prevIndex + 1) % videoSources.length);
  };

  useEffect(() => {
    if (videoRef.current) {
      videoRef.current.load();
      videoRef.current.play().catch(error => {
        console.error("Video autoplay failed:", error);
      });
    }
  }, [currentVideoIndex]);

  return (
    // Using min-h-[...] ensures it takes at least this height, can grow if content needs it
    <div className="relative w-full min-h-[70vh] md:min-h-[85vh] lg:min-h-screen overflow-hidden flex"> {/* Use flex here for inner container */}
      {/* Video Element */}
      <video
        ref={videoRef}
        key={currentVideoIndex}
        className="absolute top-0 left-0 w-full h-full object-cover z-0"
        muted
        loop={false}
        playsInline
        onEnded={playNextVideo}
        preload="auto"
      >
        <source src={videoSources[currentVideoIndex]} type="video/mp4" />
        Your browser does not support the video tag.
      </video>

      {/* Overlay */}
      <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-b from-black/60 to-black/40 z-10"></div>

      {/* Hero Content - Use flex utilities for centering */}
      <div className="relative z-20 flex flex-col items-center justify-center w-full text-center text-white px-4 sm:px-6 lg:px-8 py-10"> {/* Added py-10 */}
        <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold mb-4 animate-fade-in-down">
          Welcome to the Personalized Learning Path Generator {/* Updated Title */}
        </h1>
        <p className="text-lg sm:text-xl lg:text-2xl mb-8 max-w-xl lg:max-w-3xl animate-fade-in-up">
          Unlock your potential faster. Get tailored learning paths and curated resources designed for your success. {/* Updated Text */}
        </p>

        {/* === BUTTON CONTAINER - RESPONSIVE FIX === */}
        <div className="flex flex-col sm:flex-row items-center space-y-4 sm:space-y-0 sm:space-x-4 w-full max-w-xs sm:max-w-md animate-fade-in-up animation-delay-300">
          {/* Apply w-full for mobile, sm:w-auto for larger screens */}
          <a
            href="/signup" // Link to signup page
            className="w-full sm:w-auto text-center bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-8 rounded-full text-base md:text-lg transition duration-300 ease-in-out transform hover:scale-105"
          >
            Get Started
          </a>
          <a
            href="/resources" // Link to resources or other page
            className="w-full sm:w-auto text-center bg-transparent border-2 border-white hover:bg-white hover:text-gray-900 text-white font-semibold py-3 px-8 rounded-full text-base md:text-lg transition duration-300 ease-in-out transform hover:scale-105"
          >
            Explore Resources
          </a>
        </div>
        {/* === END BUTTON CONTAINER FIX === */}
      </div>
    </div>
  );
}

export default HeroSection;

// Make sure animations are in your CSS file (e.g., src/index.css)
/*
@keyframes fade-in-down { ... }
@keyframes fade-in-up { ... }
.animate-fade-in-down { ... }
.animate-fade-in-up { ... }
.animation-delay-300 { animation-delay: 0.3s; }
*/