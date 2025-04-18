// client/src/components/home/HeroSection.jsx
import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom'; // <--- Import Link from react-router-dom

// Import the poster image
import heroPoster from '../../assets/images/hero-poster.png'; // Adjust filename/extension if needed

// Import video files (adjust based on your actual video setup)
import video1_mp4 from '../../assets/videos/girlreading.mp4';
import video1_webm from '../../assets/videos/girlreading.webm'; // Assuming you have webm

const videoSources = [
  // Add more video objects if you want the sequence back
  { mp4: video1_mp4, webm: video1_webm },
];

function HeroSection() {
  const [currentVideoIndex, setCurrentVideoIndex] = useState(0);
  const videoRef = useRef(null);

  const playNextVideo = () => {
    // If you only have one video, this will just replay it.
    // If you add more videos back to videoSources, this will cycle through them.
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

  const currentVideo = videoSources[currentVideoIndex];

  return (
    <div className="relative w-full min-h-[70vh] md:min-h-[85vh] lg:min-h-screen overflow-hidden flex">
      <video
        ref={videoRef}
        key={currentVideoIndex}
        className="absolute top-0 left-0 w-full h-full object-cover z-0"
        muted
        loop={false} // Set to true if you only have one video and want it to loop continuously
        playsInline
        onEnded={playNextVideo}
        preload="auto"
        poster={heroPoster}
      >
        {/* MP4 source first */}
        <source src={currentVideo.mp4} type="video/mp4" />
        {/* Fallback to WebM */}
        <source src={currentVideo.webm} type="video/webm" />
        Your browser does not support the video tag or the provided formats.
      </video>

      <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-b from-black/60 to-black/40 z-10"></div>

      <div className="relative z-20 flex flex-col items-center justify-center w-full text-center text-white px-4 sm:px-6 lg:px-8 py-10">
        <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold mb-4 animate-fade-in-down">
          Welcome to the Personalized Learning Path Generator
        </h1>
        <p className="text-lg sm:text-xl lg:text-2xl mb-8 max-w-xl lg:max-w-3xl animate-fade-in-up">
          Unlock your potential faster. Get tailored learning paths and curated resources designed for your success.
        </p>

        {/* Button Container - Using React Router <Link> */}
        <div className="flex flex-col sm:flex-row items-center space-y-4 sm:space-y-0 sm:space-x-4 w-full max-w-xs sm:max-w-md animate-fade-in-up animation-delay-300">
          {/* --- USE Link component, replace <a> tag --- */}
          <Link
            to="/signup" // <-- Use 'to' prop for the destination path
            className="w-full sm:w-auto text-center bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-8 rounded-full text-base md:text-lg transition duration-300 ease-in-out transform hover:scale-105"
          >
            Get Started
          </Link>
          {/* --- USE Link component, replace <a> tag --- */}
          <Link
            to="/resources" // <-- Use 'to' prop for the destination path
            className="w-full sm:w-auto text-center bg-transparent border-2 border-white hover:bg-white hover:text-gray-900 text-white font-semibold py-3 px-8 rounded-full text-base md:text-lg transition duration-300 ease-in-out transform hover:scale-105"
          >
            Explore Resources
          </Link>
        </div>
      </div>
    </div>
  );
}

export default HeroSection;

// Remember animations in CSS
/*
@keyframes fade-in-down { ... }
@keyframes fade-in-up { ... }
.animate-fade-in-down { ... }
.animate-fade-in-up { ... }
.animation-delay-300 { animation-delay: 0.3s; }
*/