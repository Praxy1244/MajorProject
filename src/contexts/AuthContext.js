import React, { createContext, useContext, useState, useEffect } from 'react';
import { mockUsers } from '../mock';
import { mockNotifications } from '../mock'; // Import notifications data
import { api } from '../lib/api';


const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check if user is logged in from localStorage
    const savedUser = localStorage.getItem('rewearify_user');
    if (savedUser) {
      const parsedUser = JSON.parse(savedUser);
      setUser(parsedUser);
      // Initialize notifications for the logged-in user
      const userNotifications = mockNotifications
        .filter(n => n.userId === parsedUser.id)
        .map(n => ({ ...n })); // Create a new array to avoid mutating the original
      setNotifications(userNotifications);
    }
    setLoading(false);
  }, []);

const login = async (email, password) => {
  try {
    const { data } = await api.post('/api/auth/login', { email, password });
    if (data.success) {
      localStorage.setItem('rewearify_user', JSON.stringify(data.user));
      localStorage.setItem('rewearify_token', data.token);
      setUser(data.user);
      // you can still hydrate notifications from mock for now
      const userNotifications = mockNotifications
        .filter(n => n.userId === data.user.id)
        .map(n => ({ ...n }));
      setNotifications(userNotifications);

      return data; // { success:true, user, token }
    }
    return data;
  } catch (err) {
    return { success: false, error: err.response?.data?.error || 'Server error' };
  }
};

const signup = async (userData) => {
  try {
    const { data } = await api.post('/api/auth/signup', userData);
    if (data.success) {
      localStorage.setItem('rewearify_user', JSON.stringify(data.user));
      localStorage.setItem('rewearify_token', data.token);
      setUser(data.user);
      setNotifications([]);
      return data;
    }
    return data;
  } catch (err) {
    return { success: false, error: err.response?.data?.error || 'Server error' };
  }
};

const logout = () => {
  setUser(null);
  setNotifications([]);
  localStorage.removeItem('rewearify_user');
  localStorage.removeItem('rewearify_token');
};


  const updateProfile = (updatedData) => {
    const updatedUser = { ...user, ...updatedData };
    setUser(updatedUser);
    localStorage.setItem('rewearify_user', JSON.stringify(updatedUser));
  };

  const updateNotificationRead = (id) => {
    setNotifications(notifications.map(n =>
      n.id === id ? { ...n, read: true } : n
    ));
  };

  const value = {
    user,
    notifications,
    login,
    signup,
    logout,
    updateProfile,
    updateNotificationRead,
    loading
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};