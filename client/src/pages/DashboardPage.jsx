// client/src/pages/DashboardPage.jsx (Conceptual Example)
import React, { useEffect, useState } from 'react';
import { fetchActivePath, getProfile } from '../services/api'; // Assuming you have these
import { Link } from 'react-router-dom';

function DashboardPage() {
  const [profile, setProfile] = useState(null);
  const [activePath, setActivePath] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        setError('');
        const profileRes = await getProfile();
        setProfile(profileRes.data);

        try {
            const pathRes = await fetchActivePath();
            setActivePath(pathRes.data);
        } catch (pathError) {
             if (pathError.response && pathError.response.status === 404) {
                setActivePath(null); // Explicitly set to null if no active path found
             } else {
                console.error("Error fetching active path:", pathError);
                setError('Could not load learning path details.');
             }
        }

      } catch (err) {
        console.error("Error fetching dashboard data:", err);
        setError('Failed to load dashboard data. Please try again.');
        // Handle token expiry / redirect to login if 401?
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  if (loading) {
    return <div className="text-center py-10">Loading dashboard...</div>; // Add a spinner later
  }

  if (error) {
     return <div className="text-center py-10 text-red-600 bg-red-100 p-4 rounded-md">{error}</div>;
  }

  // Calculate progress (example)
  const totalNodes = activePath?.nodes?.length || 0;
  const completedNodes = activePath?.nodes?.filter(node => node.completionStatus === 'Completed').length || 0;
  const progressPercent = totalNodes > 0 ? Math.round((completedNodes / totalNodes) * 100) : 0;

  return (
    <div className="space-y-6 md:space-y-8">
      <h1 className="text-2xl sm:text-3xl font-bold text-gray-800">
        Welcome back, {profile?.name || 'Learner'}!
      </h1>

      {/* Path Overview Card */}
      <section className="bg-white p-4 sm:p-6 shadow rounded-lg border border-gray-200">
        <h2 className="text-xl font-semibold text-gray-700 mb-4">Your Learning Path</h2>
        {activePath?.path ? (
          <div className="space-y-4">
            <h3 className="text-lg font-medium text-gray-900">{activePath.path.title}</h3>
            <p className="text-sm text-gray-600">{activePath.path.description || 'Continue your learning journey.'}</p>

             {/* Progress Bar */}
             {totalNodes > 0 && (
                <div>
                    <div className="flex justify-between mb-1 text-sm font-medium text-gray-600">
                        <span>Progress</span>
                        <span>{completedNodes} / {totalNodes} Steps ({progressPercent}%)</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2.5">
                        <div className="bg-blue-600 h-2.5 rounded-full" style={{ width: `${progressPercent}%` }}></div>
                    </div>
                </div>
             )}


            <Link
              to="/learning-path"
              className="inline-block mt-4 text-sm font-medium text-blue-600 hover:text-blue-800"
            >
              View Full Path →
            </Link>
          </div>
        ) : (
          <div className="text-center py-6 px-4 bg-gray-50 rounded-md">
            <p className="text-gray-600 mb-4">You don't have an active learning path yet.</p>
            <Link
              to="/generate-path" // Assuming you have a route/page for this
              className="bg-green-600 hover:bg-green-700 text-white font-semibold py-2 px-5 rounded-md text-sm transition duration-300 ease-in-out"
            >
              Generate Your First Path
            </Link>
          </div>
        )}
      </section>

      {/* Other Dashboard Sections (e.g., Recommended Resources, Stats) */}
      {/* Use responsive grids for multiple cards */}
      <section>
         <h2 className="text-xl font-semibold text-gray-700 mb-4">Quick Actions</h2>
         <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {/* Example Action Card */}
            <div className="bg-white p-4 shadow rounded-lg border border-gray-200 hover:shadow-md transition-shadow">
               <h3 className="font-medium text-gray-800 mb-2">Explore Resources</h3>
               <p className="text-sm text-gray-600 mb-3">Find new articles, videos, and courses.</p>
               <Link to="/resources" className="text-sm font-medium text-blue-600 hover:text-blue-800">Browse Library →</Link>
            </div>
             {/* Add more cards */}
             <div className="bg-white p-4 shadow rounded-lg border border-gray-200 hover:shadow-md transition-shadow">
               <h3 className="font-medium text-gray-800 mb-2">Update Profile</h3>
               <p className="text-sm text-gray-600 mb-3">Adjust your goals and preferences.</p>
               <Link to="/profile" className="text-sm font-medium text-blue-600 hover:text-blue-800">Edit Profile →</Link>
            </div>
         </div>
      </section>

    </div>
  );
}

export default DashboardPage;