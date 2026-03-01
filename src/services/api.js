import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8080';

let accessToken = null;
let refreshPromise = null;

export function definirAccessToken(token) {
  accessToken = token;
}

export function limparAccessToken() {
  accessToken = null;
}

const api = axios.create({
  baseURL: API_URL,
  withCredentials: true,
});

api.interceptors.request.use((config) => {
  if (accessToken) {
    config.headers.Authorization = `Bearer ${accessToken}`;
  }
  return config;
});

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    if (error.response?.status === 401 && !originalRequest._tentouRefresh) {
      if (originalRequest.url?.includes('/api/auth/refresh') || originalRequest.url?.includes('/api/auth/login')) {
        return Promise.reject(error);
      }

      originalRequest._tentouRefresh = true;

      if (!refreshPromise) {
        refreshPromise = api.post('/api/auth/refresh')
          .then((res) => {
            const novoToken = res.data.accessToken;
            definirAccessToken(novoToken);
            return novoToken;
          })
          .catch((refreshError) => {
            limparAccessToken();
            if (window.location.pathname !== '/login') {
              window.location.href = '/login';
            }
            return Promise.reject(refreshError);
          })
          .finally(() => {
            refreshPromise = null;
          });
      }

      try {
        const novoToken = await refreshPromise;
        originalRequest.headers.Authorization = `Bearer ${novoToken}`;
        return await api(originalRequest);
      } catch (erroRetry) {
        return Promise.reject(erroRetry);
      }
    }

    if (error.response?.status === 429) {
      const mensagem = error.response.data?.erro || 'Muitas requisicoes. Tente novamente em instantes.';
      error.mensagemRateLimit = mensagem;
    }

    return Promise.reject(error);
  }
);

export default api;
