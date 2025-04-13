import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import HomePage from './pages/HomePage';
import LoginPage from './pages/LoginPage';
import SignupPage from './pages/SignupPage';
import DashboardPage from './pages/DashboardPage';
import LearningPathPage from './pages/LearningPathPage';
import ResourceLibraryPage from './pages/ResourceLibraryPage';
import ProfilePage from './pages/ProfilePage';
import NotFoundPage from './pages/NotFoundPage';
import Navbar from './components/common/Navbar';
import Footer from './components/common/Footer'; // Import Footer
import ProtectedRoute from './components/auth/ProtectedRoute';

function App() {
  // Basic check for token (improve with context/state management)
  const isAuthenticated = !!localStorage.getItem('authToken'); // Example check

  return (
    // Use flex flex-col min-h-screen to make footer sticky
    <div className="flex flex-col min-h-screen bg-gray-50">
      <Navbar />
      {/* Main content area grows to fill space, includes padding */}
      <main className="flex-grow container mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<HomePage />} />
          <Route path="/login" element={isAuthenticated ? <Navigate to="/dashboard" /> : <LoginPage />} />
          <Route path="/signup" element={isAuthenticated ? <Navigate to="/dashboard" /> : <SignupPage />} />
          <Route path="/resources" element={<ResourceLibraryPage />} />
          {/* Add routes for About, Contact, Privacy, Terms if you created pages for them */}
          {/* <Route path="/about" element={<AboutPage />} /> */}
          {/* <Route path="/contact" element={<ContactPage />} /> */}
          {/* <Route path="/privacy" element={<PrivacyPage />} /> */}
          {/* <Route path="/terms" element={<TermsPage />} /> */}


          {/* Private Routes */}
          <Route path="/dashboard" element={<ProtectedRoute><DashboardPage /></ProtectedRoute>} />
          <Route path="/learning-path" element={<ProtectedRoute><LearningPathPage /></ProtectedRoute>} />
          <Route path="/profile" element={<ProtectedRoute><ProfilePage /></ProtectedRoute>} />

          {/* Not Found Route */}
          <Route path="*" element={<NotFoundPage />} />
        </Routes>
      </main>
      <Footer /> {/* Add Footer */}
    </div>
  );
}

export default App;