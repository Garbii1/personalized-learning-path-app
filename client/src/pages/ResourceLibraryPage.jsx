import React, { useState, useEffect, useCallback } from 'react';
import { fetchResources } from '../services/api'; // Adjust path

function ResourceLibraryPage() {
  const [resources, setResources] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Filters and Search State
  const [searchTerm, setSearchTerm] = useState('');
  const [filters, setFilters] = useState({
    type: '',
    difficulty: '',
    tag: ''
  });

  // Debounce mechanism for search term
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState(searchTerm);

  useEffect(() => {
    const timerId = setTimeout(() => {
      setDebouncedSearchTerm(searchTerm);
    }, 500); // Wait 500ms after user stops typing

    return () => {
      clearTimeout(timerId); // Cleanup timer on component unmount or if searchTerm changes again
    };
  }, [searchTerm]);


  const fetchData = useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      // Construct query parameters, only include non-empty filters/search
      const params = {};
      if (debouncedSearchTerm) params.search = debouncedSearchTerm;
      if (filters.type) params.type = filters.type;
      if (filters.difficulty) params.difficulty = filters.difficulty;
      if (filters.tag) params.tag = filters.tag; // Assuming backend handles single tag filter param 'tag'

      const { data } = await fetchResources(params);
      setResources(data || []); // Ensure data is an array
    } catch (err) {
      console.error("Failed to fetch resources:", err);
      setError('Could not load resources. Please try again later.');
      setResources([]); // Clear resources on error
    } finally {
      setLoading(false);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [debouncedSearchTerm, filters.type, filters.difficulty, filters.tag]); // Depend on debounced term and filters

  useEffect(() => {
    fetchData();
  }, [fetchData]); // Run fetch data when the debounced term or filters change


  const handleFilterChange = (e) => {
    setFilters(prevFilters => ({
      ...prevFilters,
      [e.target.name]: e.target.value
    }));
  };

   const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
  };

   const clearFilters = () => {
       setSearchTerm('');
       setFilters({ type: '', difficulty: '', tag: '' });
   }

  // Define available options (could be fetched from backend ideally)
  const resourceTypes = ['video', 'article', 'course', 'book', 'tutorial', 'other'];
  const difficulties = ['Beginner', 'Intermediate', 'Advanced', 'All'];

  return (
    <div className="container mx-auto px-4 py-6">
      <h1 className="text-3xl font-bold mb-6 text-gray-800">Resource Library</h1>

      {/* Filters and Search Section */}
      <div className="bg-white p-4 rounded-lg shadow border border-gray-200 mb-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4 items-end">
        {/* Search */}
        <div className="lg:col-span-2">
          <label htmlFor="search" className="block text-sm font-medium text-gray-700 mb-1">Search Title/Description</label>
          <input
            type="text"
            id="search"
            name="search"
            placeholder="e.g., React Hooks, Python Basics"
            value={searchTerm}
            onChange={handleSearchChange}
            className="input-field"
          />
        </div>
        {/* Type Filter */}
        <div>
          <label htmlFor="type" className="block text-sm font-medium text-gray-700 mb-1">Type</label>
          <select id="type" name="type" value={filters.type} onChange={handleFilterChange} className="input-field bg-white">
            <option value="">All Types</option>
            {resourceTypes.map(type => <option key={type} value={type} className="capitalize">{type}</option>)}
          </select>
        </div>
        {/* Difficulty Filter */}
        <div>
          <label htmlFor="difficulty" className="block text-sm font-medium text-gray-700 mb-1">Difficulty</label>
          <select id="difficulty" name="difficulty" value={filters.difficulty} onChange={handleFilterChange} className="input-field bg-white">
            <option value="">All Levels</option>
            {difficulties.map(level => <option key={level} value={level}>{level}</option>)}
          </select>
        </div>
         {/* Tag Filter (Simple Input for now) */}
        {/* <div>
            <label htmlFor="tag" className="block text-sm font-medium text-gray-700 mb-1">Tag</label>
            <input type="text" id="tag" name="tag" placeholder="e.g., javascript" value={filters.tag} onChange={handleFilterChange} className="input-field"/>
        </div> */}
        {/* Clear Button */}
        <div>
            <button onClick={clearFilters} className="w-full bg-gray-500 hover:bg-gray-600 text-white font-bold py-2 px-4 rounded transition duration-300 text-sm">Clear</button>
        </div>

      </div>


      {/* Resources Grid/List */}
      {loading ? (
        <div className="text-center mt-10">Loading Resources...</div>
      ) : error ? (
        <div className="text-center mt-10 text-red-600">Error: {error}</div>
      ) : resources.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {resources.map(resource => (
            <div key={resource._id} className="bg-white p-5 rounded-lg shadow border border-gray-200 flex flex-col justify-between hover:shadow-md transition-shadow duration-300">
              <div>
                <h3 className="text-xl font-semibold mb-2 text-indigo-700">{resource.title}</h3>
                <p className="text-gray-600 text-sm mb-3">{resource.description || 'No description available.'}</p>
                 <div className="text-xs text-gray-500 mb-3 space-x-2">
                     <span className="inline-block bg-blue-100 text-blue-800 px-2 py-0.5 rounded capitalize">{resource.type}</span>
                     <span className={`inline-block px-2 py-0.5 rounded ${
                         resource.difficulty === 'Beginner' ? 'bg-green-100 text-green-800' :
                         resource.difficulty === 'Intermediate' ? 'bg-yellow-100 text-yellow-800' :
                         resource.difficulty === 'Advanced' ? 'bg-red-100 text-red-800' :
                         'bg-gray-100 text-gray-800'
                     }`}>{resource.difficulty}</span>
                      {resource.estimatedTimeToComplete && <span className="inline-block bg-gray-100 text-gray-800 px-2 py-0.5 rounded">~{resource.estimatedTimeToComplete} min</span>}
                 </div>
                 {resource.topicTags && resource.topicTags.length > 0 && (
                    <div className="text-xs mb-4">
                        <span className="font-medium">Tags:</span>
                        {resource.topicTags.map(tag => (
                            <span key={tag} className="inline-block bg-gray-200 rounded-full px-2 py-0.5 text-gray-700 mr-1 mb-1">{tag}</span>
                        ))}
                    </div>
                 )}

              </div>
              <a
                href={resource.url}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-auto inline-block text-center w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded transition duration-300 text-sm"
              >
                Visit Resource
              </a>
            </div>
          ))}
        </div>
      ) : (
        <p className="text-center text-gray-600 mt-10">No resources found matching your criteria.</p>
      )}

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
      `}</style>
    </div>
  );
}

export default ResourceLibraryPage;