import { createContext, useContext, useState, useEffect } from 'react';
import api, { definirAccessToken, limparAccessToken } from '../services/api';

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [admin, setAdmin] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.post('/api/auth/refresh')
      .then((res) => {
        definirAccessToken(res.data.accessToken);
        setAdmin(res.data.admin);
      })
      .catch(() => {
        limparAccessToken();
        setAdmin(null);
      })
      .finally(() => setLoading(false));
  }, []);

  const login = async (email, senha) => {
    try {
      const res = await api.post('/api/auth/login', { email, senha });
      if (res.data.accessToken && res.data.admin) {
        definirAccessToken(res.data.accessToken);
        setAdmin(res.data.admin);
        return true;
      }
      return false;
    } catch (err) {
      if (err.response?.status === 401) {
        return false;
      }
      throw err;
    }
  };

  const logout = async () => {
    try {
      await api.post('/api/auth/logout');
    } catch {
    } finally {
      limparAccessToken();
      setAdmin(null);
    }
  };

  return (
    <AuthContext.Provider value={{ admin, login, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
