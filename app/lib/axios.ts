import axios from 'axios';

const baseURL = process.env.API_URL || 'http://localhost:3000';

const api = axios.create({
  baseURL: baseURL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json'
  }
});

// Interceptor for request
api.interceptors.request.use(
  (config) => {
    // Example: Add authorization token if needed
    const token = localStorage.getItem('token'); // Or retrieve token from cookies, etc.
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Interceptor for response
api.interceptors.response.use(
  (response) => response,
  (error) => {
    // Handle errors globally (e.g., unauthorized, server errors)
    if (error.response) {
      console.error(`API error: ${error.response.status} - ${error.response.data.message}`);
    } else {
      console.error('Network error or timeout:', error.message);
    }
    return Promise.reject(error);
  }
);


export default api;