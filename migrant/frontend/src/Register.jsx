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

const languageAlphabets = ['अ', 'আ', 'అ', 'அ', 'اردو', 'ക', 'क', 'ਮ', 'ಕ', 'ଅ', 'গ', 'ত', 'प', 'മ', 'हिंदी', 'বাংলা', 'తెలుగు', 'मराठी', 'தமிழ்', 'اردو', 'ગુજરાતી', 'ಕನ್ನಡ', 'ଓଡ଼ିଆ', 'ਪੰਜਾਬੀ', 'മലയാളം', 'অসমীয়া'];

export default function Register() {
  const [form, setForm] = useState({
    name: '',
    identifier: '',
    password: '',
    confirmPassword: '',
    otp: '',
    language: languages[0].value,
  });
  const [message, setMessage] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage('');
    if (form.password !== form.confirmPassword) {
      setMessage('Passwords do not match.');
      return;
    }
    try {
      const res = await fetch('http://localhost:5000/api/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      if (res.ok) {
        setMessage('Registration successful! Redirecting to login...');
        setTimeout(() => navigate('/login'), 1500);
      } else if (res.status === 409) {
        setMessage('User already exists. Please login.');
      } else {
        setMessage(data.error || 'Registration failed.');
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
        <h2>Register</h2>
        <form onSubmit={handleSubmit} className="auth-form">
          <label>
            Name:
            <input type="text" name="name" value={form.name} onChange={handleChange} required />
          </label>
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
          <label className="password-label">
            Confirm Password:
            <div className="password-input-wrapper">
              <input
                type={showConfirmPassword ? 'text' : 'password'}
                name="confirmPassword"
                value={form.confirmPassword}
                onChange={handleChange}
                required
              />
              <span className="eye-icon" onClick={() => setShowConfirmPassword(s => !s)}>
                {showConfirmPassword ? <FaEyeSlash /> : <FaEye />}
              </span>
            </div>
          </label>
          <label>
            Language:
            <select name="language" value={form.language} onChange={handleChange}>
              {languages.map(lang => <option key={lang.value} value={lang.value}>{lang.label}</option>)}
            </select>
          </label>
          <button type="submit">Register</button>
        </form>
        {message && <p>{message}</p>}
        <p>Already have an account? <a href="/login">Login here</a></p>
      </div>
    </div>
  );
} 