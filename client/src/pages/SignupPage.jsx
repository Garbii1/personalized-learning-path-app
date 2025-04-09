import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { register } from '../services/api'; // Adjust path

function SignupPage() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    goals: '',
    interests: '', // Comma-separated string initially
    currentLevel: 'Beginner',
    timeCommitment: 5, // Default hours/week
  });
  const [learningPreferences, setLearningPreferences] = useState({
      visual: false,
      audio: false,
      reading: true, // Default reading to true? Adjust as needed
      practical: false,
  });
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

   const handlePreferenceChange = (e) => {
    setLearningPreferences({
      ...learningPreferences,
      [e.target.name]: e.target.checked,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    // Basic password validation (add more complex rules if needed)
    if (formData.password.length < 6) {
        setError('Password must be at least 6 characters long.');
        setIsLoading(false);
        return;
    }

    // Format data for API
    const interestsArray = formData.interests.split(',').map(interest => interest.trim()).filter(Boolean); // Split string, trim whitespace, remove empty strings
    const userData = {
        ...formData,
        interests: interestsArray,
        learningPreferences,
    };

    try {
      const { data } = await register(userData);
      localStorage.setItem('authToken', data.token); // Store token
      navigate('/dashboard'); // Redirect to dashboard
    } catch (err) {
      const errorMessage = err.response?.data?.message || err.response?.data?.errors?.[0]?.msg || 'Signup failed. Please try again.';
      setError(errorMessage);
      console.error('Signup error:', err.response || err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-lg mx-auto mt-8 mb-8 bg-white p-8 rounded-lg shadow-lg border border-gray-200">
      <h2 className="text-3xl font-bold text-center text-gray-800 mb-6">Create Your Account</h2>
      <p className="text-center text-gray-600 mb-6 text-sm">Tell us a bit about yourself to get started!</p>
      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-4" role="alert">
          <span className="block sm:inline">{error}</span>
        </div>
      )}
      <form onSubmit={handleSubmit} noValidate>
        {/* Personal Info */}
        <fieldset className="mb-6 border p-4 rounded">
          <legend className="text-lg font-semibold mb-2 text-gray-700 px-2">Personal Information</legend>
          <div className="mb-4">
            <label htmlFor="name" className="block text-gray-700 text-sm font-bold mb-2">Full Name <span className="text-red-500">*</span></label>
            <input type="text" name="name" id="name" value={formData.name} onChange={handleChange} required aria-required="true" className="input-field" placeholder="John Doe" />
          </div>
          <div className="mb-4">
            <label htmlFor="email" className="block text-gray-700 text-sm font-bold mb-2">Email Address <span className="text-red-500">*</span></label>
            <input type="email" name="email" id="email" value={formData.email} onChange={handleChange} required aria-required="true" className="input-field" placeholder="you@example.com" />
          </div>
          <div className="mb-4">
            <label htmlFor="password" className="block text-gray-700 text-sm font-bold mb-2">Password <span className="text-red-500">*</span></label>
            <input type="password" name="password" id="password" value={formData.password} onChange={handleChange} required aria-required="true" className="input-field" placeholder="Minimum 6 characters" />
            <p className="text-xs text-gray-500 mt-1">Must be at least 6 characters long.</p>
          </div>
        </fieldset>

        {/* Learning Profile */}
        <fieldset className="mb-6 border p-4 rounded">
            <legend className="text-lg font-semibold mb-2 text-gray-700 px-2">Learning Profile</legend>
             <div className="mb-4">
                <label htmlFor="goals" className="block text-gray-700 text-sm font-bold mb-2">What are your main learning goals?</label>
                <textarea name="goals" id="goals" value={formData.goals} onChange={handleChange} className="input-field h-20" placeholder="e.g., Become a web developer, Learn Python for data science, Master React..."></textarea>
            </div>
             <div className="mb-4">
                <label htmlFor="interests" className="block text-gray-700 text-sm font-bold mb-2">Topics of Interest (comma-separated)</label>
                <input type="text" name="interests" id="interests" value={formData.interests} onChange={handleChange} className="input-field" placeholder="e.g., JavaScript, React, Node.js, CSS, AI, Machine Learning" />
            </div>
             <div className="mb-4">
                <label htmlFor="currentLevel" className="block text-gray-700 text-sm font-bold mb-2">Current Knowledge Level</label>
                <select name="currentLevel" id="currentLevel" value={formData.currentLevel} onChange={handleChange} className="input-field bg-white">
                    <option value="Beginner">Beginner</option>
                    <option value="Intermediate">Intermediate</option>
                    <option value="Advanced">Advanced</option>
                </select>
            </div>
             <div className="mb-4">
                <label htmlFor="timeCommitment" className="block text-gray-700 text-sm font-bold mb-2">Weekly Time Commitment (Hours)</label>
                <input type="number" name="timeCommitment" id="timeCommitment" value={formData.timeCommitment} onChange={handleChange} min="1" className="input-field" />
            </div>
            <div className="mb-4">
                <span className="block text-gray-700 text-sm font-bold mb-2">Preferred Learning Styles</span>
                <div className="grid grid-cols-2 gap-2">
                    {Object.keys(learningPreferences).map((pref) => (
                        <label key={pref} className="flex items-center space-x-2 cursor-pointer">
                        <input
                            type="checkbox"
                            name={pref}
                            checked={learningPreferences[pref]}
                            onChange={handlePreferenceChange}
                            className="form-checkbox h-4 w-4 text-blue-600"
                        />
                        <span className="text-gray-700 capitalize">{pref}</span>
                        </label>
                    ))}
                </div>
            </div>
        </fieldset>


        <div className="flex items-center justify-center">
          <button
            type="submit"
            disabled={isLoading}
            className={`w-full ${
              isLoading ? 'bg-green-300 cursor-not-allowed' : 'bg-green-600 hover:bg-green-700'
            } text-white font-bold py-3 px-4 rounded focus:outline-none focus:shadow-outline transition duration-300`}
          >
            {isLoading ? 'Creating Account...' : 'Sign Up'}
          </button>
        </div>
         <p className="text-center text-gray-600 text-sm mt-6">
            Already have an account?{' '}
            <Link to="/login" className="font-bold text-blue-600 hover:text-blue-800">
                Login
            </Link>
        </p>
      </form>
      {/* Simple utility class for inputs - add to index.css or keep here */}
      <style jsx>{`
        .input-field {
          display: block;
          width: 100%;
          padding: 0.5rem 0.75rem;
          font-size: 0.875rem;
          line-height: 1.25rem;
          color: #374151;
          background-color: #fff;
          background-clip: padding-box;
          border: 1px solid #d1d5db;
          appearance: none;
          border-radius: 0.375rem;
          box-shadow: 0 1px 2px 0 rgb(0 0 0 / 0.05);
          transition: border-color 0.15s ease-in-out, box-shadow 0.15s ease-in-out;
        }
        .input-field:focus {
          outline: 2px solid transparent;
          outline-offset: 2px;
          border-color: #3b82f6;
          box-shadow: 0 0 0 2px #bfdbfe;
        }
      `}</style>
    </div>
  );
}

export default SignupPage;