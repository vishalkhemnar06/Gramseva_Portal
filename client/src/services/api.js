// client/src/services/api.js
import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5001/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json', // Default Content-Type
  },
});

// ==========================================
// === AXIOS REQUEST INTERCEPTOR ENABLED ===
// ==========================================
api.interceptors.request.use(
  (config) => {
    // Retrieve the token from localStorage on each request
    const token = localStorage.getItem('authToken');

    // If a token exists, add it to the Authorization header
    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`;
    }

    // If the request data is FormData, let the browser set the Content-Type
    // Axios usually does this automatically, but deleting ensures no conflicts.
    if (config.data instanceof FormData) {
         delete config.headers['Content-Type'];
    }

    // Return the (potentially modified) request configuration
    return config;
  },
  (error) => {
    // Handle errors that occur before the request is sent
    console.error("Axios Request Interceptor Error:", error);
    return Promise.reject(error);
  }
);
// ==========================================

export default api;