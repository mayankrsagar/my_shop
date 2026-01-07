"use client";
import {
  createContext,
  useContext,
  useEffect,
  useState,
} from 'react';

import axios from 'axios';

const AuthContext = createContext();

axios.defaults.withCredentials = true;

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    checkAuth();
  }, []);

  const checkAuth = async () => {
    try {
      const res = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/api/auth/me`);
      setUser(res.data.user);
    } catch (err) {
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  const login = async (email, password) => {
    const res = await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/api/auth/login`, {
      email,
      password,
    });
    setUser(res.data.user);
    return res.data;
  };

  const signup = async (name, email, password, role) => {
    const res = await axios.post(
      `${process.env.NEXT_PUBLIC_API_URL}/api/auth/signup`,
      {
        name,
        email,
        password,
        role,
      }
    );
    setUser(res.data.user);
    return res.data;
  };

  const logout = async () => {
    await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/api/auth/logout`);
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, login, signup, logout, loading, checkAuth }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
