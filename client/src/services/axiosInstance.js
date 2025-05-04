// client/src/services/axiosInstance.js
import axios from 'axios';

const SERVER_URL = import.meta.env.VITE_SERVER_BASE_URL || 'http://localhost:5001';

// Create axios instance with base URL and default settings
const axiosInstance = axios.create({
  baseURL: SERVER_URL,
  headers: {
    'Accept': 'application/json'
  }
});

// Request interceptor to add auth token
axiosInstance.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export default axiosInstance;