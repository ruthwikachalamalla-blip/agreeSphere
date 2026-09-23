import axios from 'axios';
const apiBaseUrl = import.meta.env.VITE_API_URL?.trim();

if (!apiBaseUrl) {
  throw new Error('VITE_API_URL is not configured. Set it in the frontend environment before building.');
}

const api = axios.create({ baseURL: apiBaseUrl.replace(/\/+$/, '') });
api.interceptors.request.use(config => { const token = localStorage.getItem('agrisphere_token'); if (token) config.headers.Authorization = `Bearer ${token}`; return config; });
export default api;
