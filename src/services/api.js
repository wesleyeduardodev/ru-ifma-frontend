import axios from 'axios';

const API_URL = 'https://ru-ifma-backend-production-6229.up.railway.app';
//const API_URL = 'http://localhost:8080';

const api = axios.create({
  baseURL: API_URL,
});

api.interceptors.request.use((config) => {
  const credentials = localStorage.getItem('ru_credentials');
  if (credentials) {
    config.headers.Authorization = `Basic ${credentials}`;
  }
  return config;
});

export default api;
