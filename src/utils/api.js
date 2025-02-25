import axios from 'axios';

// Load server URL from environment variables
const API_BASE_URL = import.meta.env.VITE_SERVER_URL || 'http://localhost:5003/backend';

// Create Axios instance with base configuration
const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000, // Prevents API calls from hanging indefinitely
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true, // ✅ Enables sending cookies & authentication headers
});

// Axios Response Interceptor for error handling
api.interceptors.response.use(
  (response) => response,
  (error) => {
    console.error('API Error:', error?.response?.data || error.message);

    // Return the error message or a default fallback
    return Promise.reject(error?.response?.data || { message: 'Something went wrong!' });
  }
);

export default api;
