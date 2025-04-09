// client/src/App.jsx
import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import HomePage from './pages/HomePage'; // Create these pages
import LoginPage from './pages/LoginPage';
import SignupPage from './pages/SignupPage';
import DashboardPage from './pages/DashboardPage';
import LearningPathPage from './pages/LearningPathPage';
import ResourceLibraryPage from './pages/ResourceLibraryPage';
import ProfilePage from './pages/ProfilePage';
import NotFoundPage from './pages/NotFoundPage';
import Navbar from './components/common/Navbar'; // Create Navbar
import Footer from './components/common/Footer'; // Create Footer
import ProtectedRoute from './components/auth/ProtectedRoute'; // Create ProtectedRoute HOC/component
// import { AuthProvider } from './contexts/AuthContext'; // Optional: Use context for auth state

function App() {
  // Basic check for token (improve with context/state management)
  const isAuthenticated = !!localStorage.getItem('authToken'); // Example check

  return (
    // <AuthProvider> {/* Optional: Wrap with AuthProvider if using context */}
      <div className="flex flex-col min-h-screen">
        <Navbar />
        <main className="flex-grow container mx-auto px-4 py-8"> {/* Main content area */}
          <Routes>
            {/* Public Routes */}
            <Route path="/" element={<HomePage />} />
            <Route path="/login" element={isAuthenticated ? <Navigate to="/dashboard" /> : <LoginPage />} />
            <Route path="/signup" element={isAuthenticated ? <Navigate to="/dashboard" /> : <SignupPage />} />
            <Route path="/resources" element={<ResourceLibraryPage />} />

            {/* Private Routes */}
            <Route path="/dashboard" element={
              <ProtectedRoute>
                <DashboardPage />
              </ProtectedRoute>
            } />
             <Route path="/learning-path" element={
              <ProtectedRoute>
                <LearningPathPage />
              </ProtectedRoute>
            } />
             <Route path="/profile" element={
              <ProtectedRoute>
                <ProfilePage />
              </ProtectedRoute>
            } />
             {/* Add other protected routes here */}


            {/* Not Found Route */}
            <Route path="*" element={<NotFoundPage />} />
          </Routes>
        </main>
        <Footer />
      </div>
    // </AuthProvider>
  );
}

export default App;