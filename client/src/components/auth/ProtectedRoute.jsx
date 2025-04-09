// client/src/components/auth/ProtectedRoute.jsx
import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
// import { useAuth } from '../../contexts/AuthContext'; // Optional: if using context

const ProtectedRoute = ({ children }) => {
  // Replace this with your actual authentication check logic
  // (e.g., checking context state, validating token expiry)
  const isAuthenticated = !!localStorage.getItem('authToken'); // Simple example
  // const { isAuthenticated } = useAuth(); // Example using context
  let location = useLocation();

  if (!isAuthenticated) {
    // Redirect them to the /login page, but save the current location they were
    // trying to go to when they were redirected. This allows us to send them
    // along to that page after they login, which is a nicer user experience
    // than dropping them off on the home page.
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return children; // Render the children components (the protected page)
};

export default ProtectedRoute;