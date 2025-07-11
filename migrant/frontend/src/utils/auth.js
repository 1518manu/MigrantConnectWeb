// Authentication utilities for MigrantConnect

// Token management
export const getToken = () => {
  return localStorage.getItem('token');
};

export const setToken = (token) => {
  localStorage.setItem('token', token);
};

export const removeToken = () => {
  localStorage.removeItem('token');
};

export const isAuthenticated = () => {
  const token = getToken();
  return !!token;
};

// User management
export const getUser = () => {
  const userStr = localStorage.getItem('user');
  return userStr ? JSON.parse(userStr) : null;
};

export const setUser = (user) => {
  localStorage.setItem('user', JSON.stringify(user));
};

export const removeUser = () => {
  localStorage.removeItem('user');
};

export const getUserId = () => {
  const user = getUser();
  return user ? user.id : 'default-user-id';
};

// Login function
export const login = async (identifier, password) => {
  try {
    const response = await fetch('http://localhost:5000/api/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ identifier, password }),
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.error || 'Login failed');
    }

    // Store user data
    setUser(data.user);
    setToken('dummy-token'); // In a real app, this would be a JWT token

    return data;
  } catch (error) {
    throw error;
  }
};

// Register function
export const register = async (userData) => {
  try {
    const response = await fetch('http://localhost:5000/api/register', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(userData),
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.error || 'Registration failed');
    }

    return data;
  } catch (error) {
    throw error;
  }
};

// Logout function
export const logout = () => {
  removeToken();
  removeUser();
  window.location.href = '/login';
};

// API request helper with authentication
export const apiRequest = async (url, options = {}) => {
  const token = getToken();
  
  const defaultHeaders = {
    'Content-Type': 'application/json',
    ...(token && { 'Authorization': `Bearer ${token}` }),
  };

  const config = {
    ...options,
    headers: {
      ...defaultHeaders,
      ...options.headers,
    },
  };

  try {
    const response = await fetch(url, config);
    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.error || 'API request failed');
    }

    return data;
  } catch (error) {
    if (error.message === 'Unauthorized') {
      logout();
    }
    throw error;
  }
};

// Password validation
export const validatePassword = (password) => {
  const minLength = 8;
  const hasUpperCase = /[A-Z]/.test(password);
  const hasLowerCase = /[a-z]/.test(password);
  const hasNumbers = /\d/.test(password);
  const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(password);

  return {
    isValid: password.length >= minLength && hasUpperCase && hasLowerCase && hasNumbers && hasSpecialChar,
    minLength: password.length >= minLength,
    hasUpperCase,
    hasLowerCase,
    hasNumbers,
    hasSpecialChar,
  };
};

// Language utilities
export const getLanguage = () => {
  return localStorage.getItem('language') || 'en';
};

export const setLanguage = (language) => {
  localStorage.setItem('language', language);
};

// Theme utilities
export const getTheme = () => {
  return localStorage.getItem('theme') || 'dark';
};

export const setTheme = (theme) => {
  localStorage.setItem('theme', theme);
  document.body.classList.toggle('light-theme', theme === 'light');
};

// Form validation utilities
export const validateEmail = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

export const validatePhone = (phone) => {
  const phoneRegex = /^[\+]?[1-9][\d]{0,15}$/;
  return phoneRegex.test(phone.replace(/\s/g, ''));
};

export const validateAadhaar = (aadhaar) => {
  const aadhaarRegex = /^\d{4}\s\d{4}\s\d{4}$/;
  return aadhaarRegex.test(aadhaar);
};

// File validation
export const validateFile = (file, maxSize = 5 * 1024 * 1024, allowedTypes = ['image/jpeg', 'image/png', 'application/pdf']) => {
  if (!file) {
    return { isValid: false, error: 'No file selected' };
  }

  if (file.size > maxSize) {
    return { isValid: false, error: `File size must be less than ${maxSize / (1024 * 1024)}MB` };
  }

  if (!allowedTypes.includes(file.type)) {
    return { isValid: false, error: 'Invalid file type. Please upload JPEG, PNG, or PDF files.' };
  }

  return { isValid: true };
};

// Date utilities
export const formatDate = (date) => {
  return new Date(date).toLocaleDateString('en-IN', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });
};

export const formatDateTime = (date) => {
  return new Date(date).toLocaleDateString('en-IN', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
};

// Error handling
export const handleError = (error) => {
  console.error('Error:', error);
  
  if (error.message.includes('Network')) {
    return 'Network error. Please check your internet connection.';
  }
  
  if (error.message.includes('Unauthorized')) {
    return 'Session expired. Please login again.';
  }
  
  return error.message || 'An unexpected error occurred.';
};

// Success messages
export const showSuccess = (message) => {
  // In a real app, you might use a toast notification library
  alert(message);
};

export const showError = (message) => {
  // In a real app, you might use a toast notification library
  alert(`Error: ${message}`);
};

// Password hashing (imported from password.js for convenience)
import CryptoJS from 'crypto-js';

export const hashPassword = (password) => {
  return CryptoJS.SHA256(password).toString();
}; 