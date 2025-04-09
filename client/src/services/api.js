// client/src/services/api.js
import axios from 'axios';

// Get base URL from environment variables
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5001/api';

const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Interceptor to add JWT token to requests
apiClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('authToken'); // Or get from context/state
    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// --- Auth Service Functions ---
export const register = (userData) => apiClient.post('/auth/register', userData);
export const login = (credentials) => apiClient.post('/auth/login', credentials);
export const getProfile = () => apiClient.get('/auth/profile');

// --- User Service Functions ---
export const updateProfile = (profileData) => apiClient.put('/users/profile', profileData);

// --- Resource Service Functions ---
export const fetchResources = (params = {}) => apiClient.get('/resources', { params }); // Pass query params
export const fetchResourceById = (id) => apiClient.get(`/resources/${id}`);

// --- Learning Path Service Functions ---
export const generatePath = (pathData = {}) => apiClient.post('/paths/generate', pathData);
export const fetchActivePath = () => apiClient.get('/paths/active');
export const updateNode = (nodeId, nodeData) => apiClient.put(`/paths/nodes/${nodeId}`, nodeData);


export default apiClient; // Can also export individual functions