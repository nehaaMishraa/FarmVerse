import axios from 'axios';

// Create a new instance of axios
const apiClient = axios.create({
  baseURL: 'http://localhost:5001/api', // Your backend API base URL
});

// Add a request interceptor
// This function will run before every request is sent
apiClient.interceptors.request.use(
  (config) => {
    // Get the token from localStorage
    const token = localStorage.getItem('token');
    
    // If a token exists, add it to the Authorization header
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    
    return config; // Return the modified configuration
  },
  (error) => {
    // Handle request errors
    return Promise.reject(error);
  }
);

export default apiClient;
