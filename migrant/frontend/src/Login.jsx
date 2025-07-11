import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaEye, FaEyeSlash } from 'react-icons/fa';

const languages = [
  { value: 'Hindi', label: 'हिंदी' },
  { value: 'Bengali', label: 'বাংলা' },
  { value: 'Telugu', label: 'తెలుగు' },
  { value: 'Marathi', label: 'मराठी' },
  { value: 'Tamil', label: 'தமிழ்' },
  { value: 'Urdu', label: 'اردو' },
  { value: 'Gujarati', label: 'ગુજરાતી' },
  { value: 'Kannada', label: 'ಕನ್ನಡ' },
  { value: 'Odia', label: 'ଓଡ଼ିଆ' },
  { value: 'Punjabi', label: 'ਪੰਜਾਬੀ' },
  { value: 'Malayalam', label: 'മലയാളം' },
  { value: 'Assamese', label: 'অসমীয়া' },
  { value: 'Other', label: 'Other' },
];

const languageAlphabets = ['अ', 'আ', 'అ', 'அ', 'اردو', 'ക', 'क', 'ਮ', 'ಕ', 'ଅ', 'গ', 'ত', 'প', 'മ', 'हिंदी', 'বাংলা', 'తెలుగు', 'मराठी', 'தமிழ்', 'اردو', 'ગુજરાતી', 'ಕನ್ನಡ', 'ଓଡ଼ିଆ', 'ਪੰਜਾਬੀ', 'മലയാളം', 'অসমীয়া'];

export default function Login() {
  const [form, setForm] = useState({
    identifier: '',
    password: '',
    otp: '',
    language: languages[0],
  });
  const [message, setMessage] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage('');
    try {
      const res = await fetch('http://localhost:5000/api/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      if (res.ok) {
        setMessage('Login successful!');
        // Redirect or do something after login
      } else if (res.status === 401) {
        setMessage('Invalid credentials.');
      } else if (res.status === 404) {
        setMessage('User not found. Redirecting to register...');
        setTimeout(() => navigate('/register'), 1500);
      } else {
        setMessage(data.error || 'Login failed.');
      }
    } catch (err) {
      setMessage('Server error.');
    }
  };

  // Generate random positions for background letters
  const bgLetters = Array.from({ length: 24 }, (_, i) => {
    const char = languageAlphabets[Math.floor(Math.random() * languageAlphabets.length)];
    const style = {
      left: `${Math.random() * 95}%`,
      top: `${Math.random() * 90}%`,
      fontSize: `${2 + Math.random() * 2.5}rem`,
      animationDelay: `${Math.random() * 10}s`,
    };
    return <span key={i} style={style}>{char}</span>;
  });
  return (
    <div style={{ position: 'relative', zIndex: 1 }}>
      <div className="auth-bg-letters">{bgLetters}</div>
      <div className="auth-container">
        <h2>Login</h2>
        <form onSubmit={handleSubmit} className="auth-form">
          <label>
            Phone/Email:
            <input type="text" name="identifier" value={form.identifier} onChange={handleChange} required />
          </label>
          <label className="password-label">
            Password:
            <div className="password-input-wrapper">
              <input
                type={showPassword ? 'text' : 'password'}
                name="password"
                value={form.password}
                onChange={handleChange}
                required
              />
              <span className="eye-icon" onClick={() => setShowPassword(s => !s)}>
                {showPassword ? <FaEyeSlash /> : <FaEye />}
              </span>
            </div>
          </label>
          <button type="submit">Login</button>
        </form>
        {message && <p>{message}</p>}
        <p>New user? <a href="/register">Register here</a></p>
      </div>
    </div>
  );
} 