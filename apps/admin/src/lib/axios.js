// lib/axios.js
import axios from 'axios';
import Router from 'next/router';

// Create an Axios instance
const axiosInstance = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_BASE_URL, // Base URL from environment variable
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to include JWT token in headers
axiosInstance.interceptors.request.use(
  (config) => {
    if (typeof window !== 'undefined') {
      const token = localStorage.getItem('token'); // Or get from cookies if using cookies
      if (token) {
        config.headers.Authorization = `Bearer ${token}`; // Attach the token
      }
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response 
axiosInstance.interceptors.response.use(
  (response) => response.data, // return response data
  (error) => {
    // interceptor to handle 401 errors (Unauthorized)
    if (error.response && error.response.status === 401) {
      // Handle unauthorized error by redirecting to login
      Router.push('/login');
    }
    return Promise.reject(error);
  }
);

export default axiosInstance;
