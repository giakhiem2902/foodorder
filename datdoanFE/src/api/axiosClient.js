import axios from 'axios';

const axiosClient = axios.create({
  baseURL: 'http://localhost:8080/api',
  withCredentials: true, 
});
// Do not set a global Content-Type header here. Let axios/browser decide per-request.
axiosClient.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers = config.headers || {};
    config.headers.Authorization = `Bearer ${token}`;
  }

  // Critical: For FormData, axios must NOT have Content-Type set.
  // The browser's XMLHttpRequest will automatically set the correct multipart/form-data header with boundary.
  try {
    const isForm = config.data instanceof FormData;
    if (isForm) {
      // Remove Content-Type completely so browser sets it with proper boundary
      delete config.headers['Content-Type'];
      console.log(`[FormData Debug] ${config.method?.toUpperCase()} ${config.url} - Content-Type header removed, browser will set multipart/form-data with boundary`);
    } else {
      // For non-FormData requests, ensure Content-Type is application/json
      if (!config.headers['Content-Type']) {
        config.headers['Content-Type'] = 'application/json';
      }
    }
  } catch (e) {
    console.warn('[Axios] request setup error', e);
  }

  return config;
}, (error) => {
  return Promise.reject(error);
});

axiosClient.interceptors.response.use((response) => {
  return response.data;
}, (error) => {
  if (error.response?.status === 401) {
    localStorage.removeItem('token');
    window.location.href = '/login';
  }
  return Promise.reject(error);
});

export default axiosClient;