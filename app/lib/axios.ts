import axios from 'axios';
import Cookies from 'js-cookie';
import { redirect } from 'next/navigation';
import toast from 'react-hot-toast';
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
        const isMultipart = typeof config.headers?.['Content-Type'] === 'string' && config.headers['Content-Type'].includes('multipart/form-data')
        if (!isMultipart && config.method && ['post', 'put', 'patch'].includes(config.method)) {
          config.data = {
            ...config.data,
            noid,
            appid,
            username,
            token,
          }

          if (config.data?.versi !== 'V1') {
            config.data = {
              ...config.data,
              versi: 'V2'
            }
          } else {
            delete config.data.versi
          }
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
  (response) => {
    if(response.data.response_code === '0111'){
      Cookies.remove('token')
      Cookies.remove('appid')
      Cookies.remove('noid')
      Cookies.remove('username')
      toast(response.data.response_message)
      redirect('/login')
    }
    return response
  },
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