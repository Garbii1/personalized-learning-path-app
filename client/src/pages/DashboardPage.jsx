import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { getProfile, fetchActivePath } from '../services/api'; // Adjust path

function DashboardPage() {
  const [user, setUser] = useState(null);
  const [activePath, setActivePath] = useState(null);
  const [pathNodes, setPathNodes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      setError('');
      try {
        // Fetch profile and active path in parallel
        const [profileResponse, pathResponse] = await Promise.allSettled([
          getProfile(),
          fetchActivePath()
        ]);

        if (profileResponse.status === 'fulfilled') {
          setUser(profileResponse.value.data);
        } else {
          console.error("Failed to fetch profile:", profileResponse.reason);
          setError('Could not load your profile information.');
          // Decide if you want to proceed without profile info or show blocking error
        }

        if (pathResponse.status === 'fulfilled') {
          setActivePath(pathResponse.value.data.path);
          setPathNodes(pathResponse.value.data.nodes || []);
        } else {
          // Handle expected 404 for no active path gracefully
          if (pathResponse.reason.response?.status === 404) {
            setActivePath(null); // No active path found
            setPathNodes([]);
          } else {
            console.error("Failed to fetch active path:", pathResponse.reason);
            // Don't overwrite profile error if it exists
            if (!error) setError('Could not load your learning path.');
          }
        }

      } catch (err) { // Catch any unexpected errors during Promise.allSettled or setup
        console.error("Dashboard fetch error:", err);
        setError('An unexpected error occurred while loading your dashboard.');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []); // Empty dependency array means run once on mount

  // Calculate Progress
  const completedNodes = pathNodes.filter(node => node.completionStatus === 'Completed').length;
  const totalNodes = pathNodes.length;
  const progressPercentage = totalNodes > 0 ? Math.round((completedNodes / totalNodes) * 100) : 0;

  // Find upcoming nodes (first 3 not completed)
  const upcomingNodes = pathNodes.filter(node => node.completionStatus !== 'Completed').slice(0, 3);

  if (loading) {
    return <div className="text-center mt-10">Loading Dashboard...</div>;
  }

  if (error && !user) { // If profile failed to load, show error prominently
      return <div className="text-center mt-10 text-red-600">Error: {error} Please try refreshing.</div>;
  }


  return (
    <div className="container mx-auto px-4 py-6">
        {error && ( // Show non-blocking errors (e.g., path fetch error) as alerts
             <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-4" role="alert">
                <span className="block sm:inline">{error}</span>
             </div>
         )}

      <h1 className="text-3xl font-bold mb-6 text-gray-800">
        Welcome back, {user?.name || 'Learner'}!
      </h1>

      {/* Learning Path Section */}
      <section className="bg-white p-6 rounded-lg shadow border border-gray-200 mb-8">
        <h2 className="text-2xl font-semibold mb-4 text-gray-700">Your Learning Journey</h2>
        {activePath ? (
          <>
            <h3 className="text-xl font-medium text-indigo-700 mb-2">{activePath.title}</h3>
            <p className="text-gray-600 mb-4">{activePath.description || 'Continue your path!'}</p>

            {/* Progress Bar */}
            {totalNodes > 0 && (
                <div className="mb-4">
                    <div className="flex justify-between mb-1">
                        <span className="text-sm font-medium text-gray-700">Progress</span>
                        <span className="text-sm font-medium text-gray-700">{progressPercentage}% ({completedNodes}/{totalNodes})</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2.5">
                        <div
                        className="bg-blue-600 h-2.5 rounded-full transition-all duration-500 ease-out"
                        style={{ width: `${progressPercentage}%` }}
                        ></div>
                    </div>
                </div>
            )}


            {/* Upcoming Milestones */}
            {upcomingNodes.length > 0 && (
              <div className="mb-4">
                <h4 className="text-lg font-semibold mb-2 text-gray-600">Next Steps:</h4>
                <ul className="list-disc list-inside space-y-1 text-gray-700">
                  {upcomingNodes.map(node => (
                    <li key={node._id}>
                      <span className="font-medium">{node.resourceId?.title || 'Resource Title'}</span> ({node.resourceId?.type || 'Type'}) - <span className={`text-sm font-semibold ${node.completionStatus === 'In Progress' ? 'text-yellow-600' : 'text-gray-500'}`}>{node.completionStatus}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

             {totalNodes > 0 && completedNodes === totalNodes && (
                 <p className="text-green-600 font-semibold mb-4">Congratulations! You've completed this path!</p>
             )}


            <Link
              to="/learning-path"
              className="inline-block bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-2 px-4 rounded transition duration-300"
            >
              View Full Path
            </Link>
          </>
        ) : (
          <div>
            <p className="text-gray-600 mb-4">You don't have an active learning path yet.</p>
            <Link
              to="/profile" // Link to profile to potentially update interests first? Or directly to a generate page/modal?
              className="inline-block bg-green-600 hover:bg-green-700 text-white font-bold py-2 px-4 rounded transition duration-300"
            >
              Generate Your First Path
            </Link>
             <p className="text-sm text-gray-500 mt-2">We'll use your profile interests and goals to create a personalized path.</p>
          </div>
        )}
      </section>

      {/* Other Sections (Optional) */}
      {/* <section className="bg-white p-6 rounded-lg shadow border border-gray-200">
        <h2 className="text-2xl font-semibold mb-4 text-gray-700">Recommended Resources</h2>
        {/* Fetch and display some general recommendations based on interests */}
      {/* </section> */}
    </div>
  );
}

export default DashboardPage;