import React, { useState, useEffect } from 'react';
import { Link, NavLink, useLocation, useNavigate } from 'react-router-dom';
import { Bars3Icon, XMarkIcon } from '@heroicons/react/24/outline'; // Import icons

// IMPORT YOUR LOGO - Adjust the path if necessary
import logo from '../../assets/images/logo.png';

function Navbar() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const location = useLocation(); // Get location to close menu on navigation
  const navigate = useNavigate(); // To redirect on logout

  // Close mobile menu when location changes
  useEffect(() => {
    setIsMobileMenuOpen(false);
  }, [location]);

  // Basic check for authentication token (replace with context/state management later)
  const isAuthenticated = !!localStorage.getItem('authToken');

  const handleLogout = () => {
    localStorage.removeItem('authToken');
    setIsMobileMenuOpen(false); // Close menu on logout
    navigate('/login'); // Redirect to login page
  };

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  // Helper function for NavLink classes
  const getNavLinkClass = ({ isActive }) =>
    `px-3 py-2 rounded-md text-sm font-medium transition-colors duration-150 ${
      isActive
        ? 'bg-blue-100 text-blue-700' // Active link style
        : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100' // Inactive link style
    }`;

  // Helper function for Mobile NavLink classes
  const getMobileNavLinkClass = ({ isActive }) =>
    `block px-3 py-2 rounded-md text-base font-medium ${
      isActive
        ? 'bg-blue-100 text-blue-700' // Active link style
        : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100' // Inactive link style
    }`;

  return (
    <nav className="bg-white shadow-md sticky top-0 z-50">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo and App Name */}
          <div className="flex-shrink-0 flex items-center">
            <Link to="/" onClick={() => setIsMobileMenuOpen(false)}>
              <img
                className="h-8 w-auto sm:h-10" // Responsive logo size
                src={logo}                 // Use the imported logo
                alt="Learning Paths Logo"  // Descriptive alt text
              />
            </Link>
            <Link to="/" className="text-xl font-bold text-gray-800 ml-3 hidden sm:block" onClick={() => setIsMobileMenuOpen(false)}>
              Learning Paths
            </Link>
          </div>

          {/* Desktop Navigation Links */}
          <div className="hidden md:flex items-center space-x-2 lg:space-x-4">
            <NavLink to="/" className={getNavLinkClass}> Home </NavLink>
            <NavLink to="/resources" className={getNavLinkClass}> Resources </NavLink>
            {isAuthenticated ? (
              <>
                <NavLink to="/dashboard" className={getNavLinkClass}> Dashboard </NavLink>
                <NavLink to="/learning-path" className={getNavLinkClass}> My Path </NavLink>
                <NavLink to="/profile" className={getNavLinkClass}> Profile </NavLink>
                <button onClick={handleLogout} className={`${getNavLinkClass({ isActive: false })} cursor-pointer`}> Logout </button>
              </>
            ) : (
              <>
                <NavLink to="/login" className={getNavLinkClass}> Login </NavLink>
                <NavLink
                  to="/signup"
                  className="ml-2 inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors duration-150"
                >
                  Sign Up
                </NavLink>
              </>
            )}
          </div>

          {/* Mobile Menu Button */}
          <div className="-mr-2 flex md:hidden">
            <button
              onClick={toggleMobileMenu}
              type="button"
              className="bg-gray-100 inline-flex items-center justify-center p-2 rounded-md text-gray-500 hover:text-gray-900 hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-blue-500"
              aria-controls="mobile-menu"
              aria-expanded={isMobileMenuOpen}
            >
              <span className="sr-only">Open main menu</span>
              {isMobileMenuOpen ? (
                <XMarkIcon className="block h-6 w-6" aria-hidden="true" />
              ) : (
                <Bars3Icon className="block h-6 w-6" aria-hidden="true" />
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu, show/hide based on menu state */}
      {isMobileMenuOpen && (
        <div className="md:hidden border-t border-gray-200" id="mobile-menu">
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
            <NavLink to="/" className={getMobileNavLinkClass}> Home </NavLink>
            <NavLink to="/resources" className={getMobileNavLinkClass}> Resources </NavLink>
            {isAuthenticated ? (
              <>
                <NavLink to="/dashboard" className={getMobileNavLinkClass}> Dashboard </NavLink>
                <NavLink to="/learning-path" className={getMobileNavLinkClass}> My Path </NavLink>
                <NavLink to="/profile" className={getMobileNavLinkClass}> Profile </NavLink>
                <button onClick={handleLogout} className={`${getMobileNavLinkClass({ isActive: false })} w-full text-left cursor-pointer`}> Logout </button>
              </>
            ) : (
              <>
                <NavLink to="/login" className={getMobileNavLinkClass}> Login </NavLink>
                <NavLink to="/signup" className={getMobileNavLinkClass}> Sign Up </NavLink>
              </>
            )}
          </div>
        </div>
      )}
    </nav>
  );
}

export default Navbar;
