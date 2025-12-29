import axios from 'axios';

// 1. API para Autenticación (Dominio 1)
// Documento: https://dev.apinetbo.bekindnetwork.com/api/Authentication/Login
export const authApi = axios.create({
  baseURL: 'https://dev.apinetbo.bekindnetwork.com/api',
  headers: {
    'Content-Type': 'application/json',
  },
});

// 2. API para Acciones/Dashboard (Dominio 2)
// Documento: https://dev.api.bekindnetwork.com/api/v1/actions/admin-list
export const appApi = axios.create({
  baseURL: 'https://dev.api.bekindnetwork.com/api/v1',
  headers: {
    'Content-Type': 'application/json',
  },
});

// Interceptor: Inyectar token automáticamente en las peticiones de appApi
appApi.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Interceptor: Manejo global de errores (ej. Token expirado)
appApi.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      window.location.href = '/login'; // Redirigir forzosamente
    }
    return Promise.reject(error);
  }
);