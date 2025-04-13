import React from 'react';
import { Link } from 'react-router-dom';

function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-gray-100 border-t border-gray-200 mt-auto"> {/* mt-auto pushes footer down */}
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="flex flex-col md:flex-row justify-between items-center text-center md:text-left">
          {/* Copyright */}
          <p className="text-sm text-gray-600 mb-4 md:mb-0">
            © {currentYear} Personalized Learning Paths. All rights reserved.
          </p>

          {/* Footer Links */}
          <div className="flex flex-wrap justify-center md:justify-end space-x-4 sm:space-x-6">
            <Link to="/about" className="text-sm text-gray-600 hover:text-gray-900 transition-colors duration-150">About</Link>
            <Link to="/contact" className="text-sm text-gray-600 hover:text-gray-900 transition-colors duration-150">Contact</Link>
            <Link to="/privacy" className="text-sm text-gray-600 hover:text-gray-900 transition-colors duration-150">Privacy Policy</Link>
            <Link to="/terms" className="text-sm text-gray-600 hover:text-gray-900 transition-colors duration-150">Terms of Service</Link>
            {/* Add more links as needed */}
          </div>
        </div>
         {/* Optional: Social Links */}
         {/* <div className="flex justify-center space-x-6 mt-4"> ... social icons ... </div> */}
      </div>
    </footer>
  );
}

export default Footer;