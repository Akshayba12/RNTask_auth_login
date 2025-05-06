import axios from 'axios';
import {getToken} from '../services/tokenService';
import {refreshAccessToken} from './auth';
import store from '../store/store';
import {authSlice} from '../features/auth/authSlice';

const api = axios.create({baseURL: 'https://your-api.com'});

api.interceptors.request.use(async config => {
  const token = await getToken();
  if (token && config.headers) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

api.interceptors.response.use(
  response => response,
  async error => {
    const originalRequest = error.config;
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      const newToken = await refreshAccessToken();
      if (newToken) {
        originalRequest.headers.Authorization = `Bearer ${newToken}`;
        return api(originalRequest);
      } else {
        store.dispatch(authSlice.actions.clearToken());
      }
    }
    return Promise.reject(error);
  },
);

export default api;
