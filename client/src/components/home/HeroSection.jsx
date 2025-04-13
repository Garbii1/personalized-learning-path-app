// client/src/components/home/HeroSection.jsx
import React, { useState, useEffect, useRef } from 'react';

// Import your videos (make sure paths are correct)
import video1 from '../../assets/videos/girlreading.mp4';
import video2 from '../../assets/videos/photo.mp4';
import video3 from '../../assets/videos/letterfont.mp4'; // Add more as needed
import video4 from '../../assets/videos/openingbook.mp4';
import video5 from '../../assets/videos/sketch.mp4';
import video6 from '../../assets/videos/studentclass.mp4';
import video7 from '../../assets/videos/inclass.mp4';
import video8 from '../../assets/videos/laptop.mp4';
import video9 from '../../assets/videos/diversity.mp4';
 // Add more as needed
const videoSources = [video1, video2, video3, video4, video5, video6, video7, video8, video9]; // Array of video imports

function HeroSection() {
  const [currentVideoIndex, setCurrentVideoIndex] = useState(0);
  const videoRef = useRef(null);

  // Function to go to the next video
  const playNextVideo = () => {
    setCurrentVideoIndex((prevIndex) => (prevIndex + 1) % videoSources.length);
  };

  // Effect to play video when the source changes
  useEffect(() => {
    if (videoRef.current) {
      videoRef.current.play().catch(error => {
        // Autoplay might be blocked, handle error or inform user
        console.error("Video autoplay failed:", error);
      });
    }
  }, [currentVideoIndex]); // Re-run when currentVideoIndex changes


  return (
    // Hero container: Relative positioning context, full width, aspect ratio or height
    <div className="relative w-full h-[60vh] md:h-[80vh] lg:h-screen overflow-hidden">

      {/* Video Element */}
      <video
        ref={videoRef}
        key={currentVideoIndex} // Important: Force re-render when index changes
        className="absolute top-0 left-0 w-full h-full object-cover z-0" // Cover area, behind content
        // src={videoSources[currentVideoIndex]} // Set the source dynamically - handled by key change now
        muted // Autoplay usually requires muted
        playsInline // Important for iOS devices
        onEnded={playNextVideo} // Play next video when current one finishes
        preload="auto" // Start loading video data
      >
        <source src={videoSources[currentVideoIndex]} type="video/mp4" />
        Your browser does not support the video tag.
      </video>

      {/* Overlay (Optional but recommended for text readability) */}
      <div className="absolute top-0 left-0 w-full h-full bg-black bg-opacity-50 z-10"></div>

      {/* Hero Content */}
      <div className="relative z-20 flex flex-col items-center justify-center h-full text-center text-white px-4">
        <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold mb-4 animate-fade-in-down">
          Welcome to the Personalized Learning Path Generator
        </h1>
        <p className="text-lg sm:text-xl md:text-2xl mb-8 max-w-2xl animate-fade-in-up">
          Unlock your potential faster. Get tailored learning paths and curated resources designed for your success.
        </p>
        <div>
          {/* Add Call-to-Action Buttons */}
          <a
            href="/signup" // Link to signup page
            className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-8 rounded-full text-lg transition duration-300 ease-in-out mr-4"
          >
            Get Started
          </a>
          <a
            href="/resources" // Link to resources or other page
            className="bg-transparent border-2 border-white hover:bg-white hover:text-black text-white font-bold py-3 px-8 rounded-full text-lg transition duration-300 ease-in-out"
          >
            Explore Resources
          </a>
        </div>
      </div>

      {/* Basic CSS for animations (add this to your main CSS file like src/index.css) */}
      {/*
      @keyframes fade-in-down {
        0% { opacity: 0; transform: translateY(-20px); }
        100% { opacity: 1; transform: translateY(0); }
      }
      @keyframes fade-in-up {
        0% { opacity: 0; transform: translateY(20px); }
        100% { opacity: 1; transform: translateY(0); }
      }
      .animate-fade-in-down { animation: fade-in-down 1s ease-out forwards; }
      .animate-fade-in-up { animation: fade-in-up 1s ease-out 0.5s forwards; opacity: 0; } // Add delay
      */}
    </div>
  );
}

export default HeroSection;