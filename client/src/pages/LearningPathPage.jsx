import React, { useState, useEffect, useCallback } from 'react';
import { fetchActivePath, updateNode, generatePath } from '../services/api'; // Adjust path
import { Link } from 'react-router-dom'; // For linking resource titles

function LearningPathPage() {
  const [path, setPath] = useState(null);
  const [nodes, setNodes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [nodeUpdateLoading, setNodeUpdateLoading] = useState({}); // Track loading per node ID
  const [generateLoading, setGenerateLoading] = useState(false);


  const fetchData = useCallback(async () => { // useCallback to prevent re-creation on every render
    setLoading(true);
    setError('');
    try {
      const { data } = await fetchActivePath();
      setPath(data.path);
      // Sort nodes by sequence before setting state
      const sortedNodes = data.nodes?.sort((a, b) => a.sequence - b.sequence) || [];
      setNodes(sortedNodes);
    } catch (err) {
       if (err.response?.status === 404) {
            setPath(null); // No active path found
            setNodes([]);
            setError('No active learning path found. You can generate a new one.');
          } else {
            console.error("Failed to fetch active path:", err);
            setError('Could not load your learning path. Please try again.');
          }
    } finally {
      setLoading(false);
    }
  }, []); // Empty dependency array: function is created once

  useEffect(() => {
    fetchData();
  }, [fetchData]); // Run fetchData on mount and if fetchData itself changes (it won't due to useCallback)

  const handleStatusUpdate = async (nodeId, newStatus) => {
     setNodeUpdateLoading(prev => ({ ...prev, [nodeId]: true })); // Set loading for this specific node
     setError(''); // Clear previous errors

    try {
        const { data: updatedNodeData } = await updateNode(nodeId, { completionStatus: newStatus });
        // Update the node in the local state for immediate UI feedback
        setNodes(prevNodes =>
            prevNodes.map(node =>
                node._id === nodeId ? { ...node, ...updatedNodeData } : node // Merge updated data
            )
        );
    } catch (err) {
        console.error("Failed to update node status:", err);
        setError(`Failed to update status for node ${nodeId}. Please try again.`);
    } finally {
       setNodeUpdateLoading(prev => ({ ...prev, [nodeId]: false })); // Clear loading for this node
    }
  };

  const handleGenerateNewPath = async () => {
      if (!window.confirm('Are you sure you want to generate a new path? This might replace your current active path.')) {
          return;
      }
      setGenerateLoading(true);
      setError('');
      try {
          await generatePath(); // Assumes generatePath sets the new path as active on backend
          await fetchData(); // Refetch the new active path data
      } catch (err) {
           console.error("Failed to generate new path:", err);
           setError('Could not generate a new path. Ensure your profile has interests set.');
      } finally {
          setGenerateLoading(false);
      }
  };

  if (loading) {
    return <div className="text-center mt-10">Loading Learning Path...</div>;
  }


  return (
    <div className="container mx-auto px-4 py-6">
      <div className="flex justify-between items-center mb-6 flex-wrap gap-4">
          <h1 className="text-3xl font-bold text-gray-800">
             {path ? path.title : 'Learning Path'}
          </h1>
           <button
              onClick={handleGenerateNewPath}
              disabled={generateLoading || loading}
              className={`bg-green-600 hover:bg-green-700 text-white font-bold py-2 px-4 rounded transition duration-300 ${generateLoading || loading ? 'opacity-50 cursor-not-allowed' : ''}`}
            >
              {generateLoading ? 'Generating...' : 'Generate New Path'}
            </button>
      </div>

       {error && (
         <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-6" role="alert">
           <span className="block sm:inline">{error}</span>
         </div>
       )}

      {path ? (
        <>
            <p className="text-gray-600 mb-2">Goal: {path.goal || 'Achieve your learning objectives.'}</p>
            <p className="text-gray-600 mb-6">{path.description || 'Follow these steps to reach your goal.'}</p>

            {nodes.length > 0 ? (
                <ul className="space-y-4">
                {nodes.map((node, index) => (
                    <li key={node._id} className="bg-white p-4 rounded-lg shadow border border-gray-200 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                    <div className="flex-grow">
                        <span className="font-semibold text-indigo-600 mr-2">Step {node.sequence}:</span>
                        {node.resourceId ? (
                             <a
                                href={node.resourceId.url}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-lg font-medium text-blue-700 hover:underline"
                                title={`Open resource: ${node.resourceId.title}`}
                             >
                                {node.resourceId.title}
                             </a>
                        ) : (
                            <span className="text-lg font-medium text-gray-500 italic">Resource details missing</span>
                        )}

                        <p className="text-sm text-gray-500 mt-1">
                            Type: <span className="font-medium capitalize">{node.resourceId?.type || 'N/A'}</span> |
                            Difficulty: <span className="font-medium">{node.resourceId?.difficulty || 'N/A'}</span>
                            {node.resourceId?.estimatedTimeToComplete && ` | Est. Time: ${node.resourceId.estimatedTimeToComplete} min`}
                        </p>
                         {node.notes && <p className="text-sm text-gray-600 mt-1 italic">Notes: {node.notes}</p>}
                    </div>

                    <div className="flex items-center space-x-2 flex-shrink-0 mt-2 md:mt-0">
                        <span className={`text-sm font-semibold px-2 py-0.5 rounded ${
                             node.completionStatus === 'Completed' ? 'bg-green-100 text-green-700' :
                             node.completionStatus === 'In Progress' ? 'bg-yellow-100 text-yellow-700' :
                             'bg-gray-100 text-gray-700'
                         }`}>
                             {node.completionStatus}
                         </span>
                         <select
                            value={node.completionStatus}
                            onChange={(e) => handleStatusUpdate(node._id, e.target.value)}
                            disabled={nodeUpdateLoading[node._id]}
                            className={`text-sm p-1 border rounded bg-white ${nodeUpdateLoading[node._id] ? 'opacity-50 cursor-not-allowed' : ''}`}
                            aria-label={`Update status for step ${node.sequence}`}
                         >
                             <option value="Not Started">Not Started</option>
                             <option value="In Progress">In Progress</option>
                             <option value="Completed">Completed</option>
                         </select>
                         {nodeUpdateLoading[node._id] && <span className="text-xs text-gray-500">Updating...</span>}
                    </div>
                    </li>
                ))}
                </ul>
            ) : (
                 <p className="text-gray-600">This learning path currently has no steps. Try generating a new one based on your profile.</p>
            )}

        </>
      ) : (
         !loading && <p className="text-center text-gray-600">No active learning path to display.</p>
      )}
    </div>
  );
}

export default LearningPathPage;