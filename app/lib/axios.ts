import axios from 'axios';
import Cookies from 'js-cookie';
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
    if (typeof window !== 'undefined') {
      const token = Cookies.get('token')
      const noid = Cookies.get('noid')
      const appid = Cookies.get('appid')
      const username = Cookies.get('username')

      if (token && noid && appid && username) {
        if (config.method === 'post' || config.method === 'put' || config.method === 'patch') {
          config.data = {
            ...config.data,
            noid,
            appid,
            username,
            token,
            versi: 'V2'
          };
        }
      }
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