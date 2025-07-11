import { useState } from 'react';
import { saveToken } from '../utils/auth';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');
    try {
      // Replace with your actual login API endpoint
      const res = await fetch('/api/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });
      const data = await res.json();
      if (data.token) {
        // Save JWT token to localStorage (or cookies)
        saveToken(data.token);
        // Redirect to dashboard or reload
        window.location.href = '/dashboard';
      } else {
        setError('Invalid credentials');
      }
    } catch (err) {
      setError('Login failed');
    }
  };

  return (
    <form onSubmit={handleLogin} className="login-form">
      <h2 className="login-title">Admin Login</h2>
      <input
        type="email"
        placeholder="Email"
        className="login-input"
        value={email}
        onChange={e => setEmail(e.target.value)}
        required
      />
      <input
        type="password"
        placeholder="Password"
        className="login-input"
        value={password}
        onChange={e => setPassword(e.target.value)}
        required
      />
      {error && <div className="login-error">{error}</div>}
      <button type="submit" className="login-button">Login</button>
    </form>
  );
} 