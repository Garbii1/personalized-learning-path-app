import React from 'react';
import { Link, useNavigate } from 'react-router-dom';

function Navbar() {
  const navigate = useNavigate();
  // Check if user is authenticated (simple check, enhance with context/state management)
  const isAuthenticated = !!localStorage.getItem('authToken');

  const handleLogout = () => {
    localStorage.removeItem('authToken'); // Remove token
    // Optionally clear other user data from state/storage
    navigate('/login'); // Redirect to login
    // Consider window.location.reload() if state isn't clearing properly, but navigate is usually better
  };

  return (
    <nav className="bg-gradient-to-r from-blue-600 to-indigo-700 text-white shadow-md">
      <div className="container mx-auto px-4 py-3 flex justify-between items-center">
        {/* Logo/Brand Name */}
        <Link to={isAuthenticated ? "/dashboard" : "/"} className="text-xl font-bold hover:text-blue-200 transition duration-300">
          LearnPath
        </Link>

        {/* Navigation Links */}
        <ul className="flex space-x-6 items-center">
          <li>
            <Link to="/" className="hover:text-blue-200 transition duration-300">Home</Link>
          </li>
          <li>
            <Link to="/resources" className="hover:text-blue-200 transition duration-300">Resources</Link>
          </li>

          {isAuthenticated ? (
            <>
              <li>
                <Link to="/dashboard" className="hover:text-blue-200 transition duration-300">Dashboard</Link>
              </li>
              <li>
                <Link to="/learning-path" className="hover:text-blue-200 transition duration-300">My Path</Link>
              </li>
              <li>
                <Link to="/profile" className="hover:text-blue-200 transition duration-300">Profile</Link>
              </li>
              <li>
                <button
                  onClick={handleLogout}
                  className="bg-red-500 hover:bg-red-600 px-4 py-1 rounded text-white transition duration-300 text-sm"
                  aria-label="Logout"
                >
                  Logout
                </button>
              </li>
            </>
          ) : (
            <>
              <li>
                <Link to="/login" className="hover:text-blue-200 transition duration-300">Login</Link>
              </li>
              <li>
                <Link
                    to="/signup"
                    className="bg-green-500 hover:bg-green-600 px-4 py-1 rounded text-white transition duration-300 text-sm"
                >
                    Sign Up
                </Link>
              </li>
            </>
          )}
        </ul>
      </div>
    </nav>
  );
}

export default Navbar;