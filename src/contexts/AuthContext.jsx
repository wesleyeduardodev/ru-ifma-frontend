import { createContext, useContext, useState, useEffect } from 'react';
import api from '../services/api';

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [admin, setAdmin] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const credentials = sessionStorage.getItem('ru_credentials');
    if (credentials) {
      api.get('/api/auth/me')
        .then(res => setAdmin(res.data))
        .catch(() => {
          sessionStorage.removeItem('ru_credentials');
          setAdmin(null);
        })
        .finally(() => setLoading(false));
    } else {
      setLoading(false);
    }
  }, []);

  const login = async (email, senha) => {
    const res = await api.post('/api/auth/login', { email, senha });
    if (res.data.admin) {
      const credentials = btoa(`${email}:${senha}`);
      sessionStorage.setItem('ru_credentials', credentials);
      setAdmin(res.data.admin);
      return true;
    }
    return false;
  };

  const logout = () => {
    sessionStorage.removeItem('ru_credentials');
    setAdmin(null);
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
