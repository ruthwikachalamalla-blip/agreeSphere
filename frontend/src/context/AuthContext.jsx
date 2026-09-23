import React, { createContext, useContext, useEffect, useState } from 'react';
import api from '../api';
const AuthContext = createContext(null);
export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => { try { return JSON.parse(localStorage.getItem('agrisphere_user')); } catch { return null; } });
  const [loading, setLoading] = useState(Boolean(localStorage.getItem('agrisphere_token')));
  useEffect(() => { if (!localStorage.getItem('agrisphere_token')) return; api.get('/auth/me').then(r => { setUser(r.data.user); localStorage.setItem('agrisphere_user', JSON.stringify(r.data.user)); }).catch(() => { localStorage.removeItem('agrisphere_token'); localStorage.removeItem('agrisphere_user'); setUser(null); }).finally(() => setLoading(false)); }, []);
  const saveSession = data => { localStorage.setItem('agrisphere_token', data.token); localStorage.setItem('agrisphere_user', JSON.stringify(data.user)); setUser(data.user); };
  const logout = () => { localStorage.removeItem('agrisphere_token'); localStorage.removeItem('agrisphere_user'); setUser(null); };
  const refresh = async () => { const { data } = await api.get('/auth/me'); setUser(data.user); localStorage.setItem('agrisphere_user', JSON.stringify(data.user)); };
  return <AuthContext.Provider value={{ user, loading, login: async form => saveSession((await api.post('/auth/login', form)).data), register: async form => saveSession((await api.post('/auth/register', form)).data), logout, refresh }}>{children}</AuthContext.Provider>;
}
export const useAuth = () => useContext(AuthContext);
