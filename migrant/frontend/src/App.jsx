import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Login from './components/Login';
import Register from './Register';
import Dashboard from './pages/Dashboard';
import { initializeDemoUsers } from './utils/demoData';
import { ThemeProvider } from './contexts/ThemeContext';
import './App.css';

export default function App() {
  useEffect(() => {
    // Initialize demo users for testing
    initializeDemoUsers();
  }, []);

  return (
    <ThemeProvider>
      <Router>
        <Routes>
          <Route path="/" element={<Navigate to="/login" replace />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="*" element={<Navigate to="/login" replace />} />
        </Routes>
      </Router>
    </ThemeProvider>
  );
}
