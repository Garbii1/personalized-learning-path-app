import React, { useState, useEffect, useCallback } from 'react';
import { getProfile, updateProfile } from '../services/api'; // Adjust path

function ProfilePage() {
  const initialFormData = {
    name: '',
    email: '',
    goals: '',
    interests: [], // Keep as array internally
    currentLevel: 'Beginner',
    timeCommitment: 5,
    learningPreferences: {
      visual: false,
      audio: false,
      reading: false,
      practical: false,
    },
     // Add password field if you allow updates, handle carefully
     // password: '',
     // confirmPassword: '',
  };

  const [formData, setFormData] = useState(initialFormData);
  const [loading, setLoading] = useState(true);
  const [updateLoading, setUpdateLoading] = useState(false);
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  const fetchProfile = useCallback(async () => {
    setLoading(true);
    setError('');
    setSuccessMessage('');
    try {
      const { data } = await getProfile();
      // Prepare data for form state
      setFormData({
          name: data.name || '',
          email: data.email || '', // Consider disabling email field later
          goals: data.goals || '',
          interests: data.interests || [], // Should be an array from backend
          currentLevel: data.currentLevel || 'Beginner',
          timeCommitment: data.timeCommitment || 5,
          learningPreferences: data.learningPreferences || initialFormData.learningPreferences,
      });
    } catch (err) {
      console.error("Failed to fetch profile:", err);
      setError('Could not load your profile. Please try refreshing.');
    } finally {
      setLoading(false);
    }
  }, []); // useCallback ensures fetchProfile is stable

  useEffect(() => {
    fetchProfile();
  }, [fetchProfile]); // Run fetchProfile on mount

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prevData => ({
      ...prevData,
      [name]: value
    }));
  };

  const handlePreferenceChange = (e) => {
    const { name, checked } = e.target;
    setFormData(prevData => ({
      ...prevData,
      learningPreferences: {
        ...prevData.learningPreferences,
        [name]: checked
      }
    }));
  };

   const handleInterestsChange = (e) => {
       // Store interests as comma-separated string in the text input
       // but keep the array in formData state for submission
       const interestsString = e.target.value;
       const interestsArray = interestsString.split(',').map(interest => interest.trim()).filter(Boolean);
       setFormData(prevData => ({
           ...prevData,
           interests: interestsArray // Update the array in state
           // Optionally add another state variable if you need the string value directly for the input
       }));
   }

  const handleSubmit = async (e) => {
    e.preventDefault();
    setUpdateLoading(true);
    setError('');
    setSuccessMessage('');

    // Prepare data for API (remove password fields if not updating)
    const profileData = { ...formData };
    // delete profileData.password; // Example if password wasn't part of update
    // delete profileData.confirmPassword;

    try {
      await updateProfile(profileData);
      setSuccessMessage('Profile updated successfully!');
      // Optionally refetch profile to confirm changes, or rely on success message
      // await fetchProfile();
    } catch (err) {
       const errorMessage = err.response?.data?.message || err.response?.data?.errors?.[0]?.msg || 'Profile update failed. Please try again.';
       setError(errorMessage);
       console.error('Profile update error:', err.response || err);
    } finally {
      setUpdateLoading(false);
    }
  };

  if (loading) {
    return <div className="text-center mt-10">Loading Profile...</div>;
  }

  return (
    <div className="max-w-2xl mx-auto mt-8 mb-8 bg-white p-8 rounded-lg shadow-lg border border-gray-200">
      <h1 className="text-3xl font-bold text-center text-gray-800 mb-6">Your Profile</h1>

      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-4" role="alert">
          <span className="block sm:inline">{error}</span>
        </div>
      )}
      {successMessage && (
        <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded relative mb-4" role="alert">
          <span className="block sm:inline">{successMessage}</span>
        </div>
      )}

      <form onSubmit={handleSubmit} noValidate>
        {/* Personal Info */}
        <fieldset className="mb-6 border p-4 rounded">
          <legend className="text-lg font-semibold mb-2 text-gray-700 px-2">Personal Information</legend>
          <div className="mb-4">
            <label htmlFor="name" className="block text-gray-700 text-sm font-bold mb-2">Full Name <span className="text-red-500">*</span></label>
            <input type="text" name="name" id="name" value={formData.name} onChange={handleChange} required aria-required="true" className="input-field" />
          </div>
          <div className="mb-4">
            <label htmlFor="email" className="block text-gray-700 text-sm font-bold mb-2">Email Address</label>
            <input type="email" name="email" id="email" value={formData.email} readOnly className="input-field bg-gray-100 cursor-not-allowed" title="Email cannot be changed" />
             <p className="text-xs text-gray-500 mt-1">Email address cannot be changed.</p>
          </div>
            {/* Optional: Password Update Section - Requires backend logic */}
            {/* <div className="mb-4">
                <label htmlFor="password">New Password (leave blank to keep current)</label>
                <input type="password" name="password" id="password" value={formData.password} onChange={handleChange} />
            </div> */}
        </fieldset>

        {/* Learning Profile */}
        <fieldset className="mb-6 border p-4 rounded">
            <legend className="text-lg font-semibold mb-2 text-gray-700 px-2">Learning Profile</legend>
             <div className="mb-4">
                <label htmlFor="goals" className="block text-gray-700 text-sm font-bold mb-2">Main Learning Goals</label>
                <textarea name="goals" id="goals" value={formData.goals} onChange={handleChange} className="input-field h-20"></textarea>
            </div>
             <div className="mb-4">
                <label htmlFor="interests" className="block text-gray-700 text-sm font-bold mb-2">Topics of Interest (comma-separated)</label>
                {/* Display array as comma-separated string in input */}
                <input type="text" name="interests" id="interests" value={formData.interests.join(', ')} onChange={handleInterestsChange} className="input-field" />
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
                    {Object.keys(formData.learningPreferences).map((pref) => (
                        <label key={pref} className="flex items-center space-x-2 cursor-pointer">
                        <input
                            type="checkbox"
                            name={pref}
                            checked={formData.learningPreferences[pref]}
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
            disabled={updateLoading}
            className={`w-full ${
              updateLoading ? 'bg-blue-300 cursor-not-allowed' : 'bg-blue-600 hover:bg-blue-700'
            } text-white font-bold py-3 px-4 rounded focus:outline-none focus:shadow-outline transition duration-300`}
          >
            {updateLoading ? 'Saving Changes...' : 'Update Profile'}
          </button>
        </div>
      </form>

        {/* Utility class for inputs - add to index.css or keep here */}
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
        .input-field.bg-gray-100 { background-color: #f3f4f6; }
        .input-field.cursor-not-allowed { cursor: not-allowed; }
      `}</style>
    </div>
  );
}

export default ProfilePage;