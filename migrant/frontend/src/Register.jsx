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

const languageAlphabets = ['अ', 'आ', 'అ', 'அ', 'اردو', 'ക', 'क', 'ਮ', 'ಕ', 'ଅ', 'গ', 'ত', 'প', 'മ', 'हिंदी', 'বাংলা', 'తెలుగు', 'मराठी', 'தமிழ்', 'اردو', 'ગુજરાતી', 'ಕನ್ನಡ', 'ଓଡ଼ିଆ', 'ਪੰਜਾਬੀ', 'മലയാളം', 'অসমীয়া'];

export default function Register() {
  const [form, setForm] = useState({
    name: '',
    identifier: '',
    password: '',
    confirmPassword: '',
    language: languages[0].value,
  });
  const [message, setMessage] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [passwordStrength, setPasswordStrength] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const navigate = useNavigate();

  // Password strength checker
  function checkPasswordStrengthLocal(pw) {
    let strength = '';
    let error = '';
    const strongRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?]).{8,}$/;
    if (!pw) {
      strength = '';
      error = '';
    } else if (pw.length < 8) {
      strength = 'weak';
      error = 'Password must be at least 8 characters.';
    } else if (!strongRegex.test(pw)) {
      strength = 'weak';
      error = 'Password must include uppercase, lowercase, number, and special character.';
    } else {
      strength = 'strong';
      error = '';
    }
    setPasswordStrength(strength);
    setPasswordError(error);
    return strength;
  }

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    if (e.target.name === 'password') {
      checkPasswordStrengthLocal(e.target.value);
    }
  };

  const validateForm = () => {
    // Check if all fields are filled
    if (!form.name.trim() || !form.identifier.trim() || !form.password || !form.confirmPassword) {
      setMessage('Please fill in all fields.');
      return false;
    }

    // Check password strength using local checker
    const strength = checkPasswordStrengthLocal(form.password);
    if (strength !== 'strong') {
      setMessage('Please choose a stronger password. Your password should be at least moderate strength.');
      return false;
    }

    // Check if passwords match
    if (form.password !== form.confirmPassword) {
      setMessage('Passwords do not match.');
      return false;
    }

    // Validate email/phone format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const phoneRegex = /^[0-9]{10,15}$/;
    
    if (!emailRegex.test(form.identifier) && !phoneRegex.test(form.identifier)) {
      setMessage('Please enter a valid email address or phone number.');
      return false;
    }

    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage('');
    setIsLoading(true);

    if (!validateForm()) {
      setIsLoading(false);
      return;
    }

    if (checkPasswordStrengthLocal(form.password) !== 'strong') {
      setMessage('Please enter a stronger password.');
      setIsLoading(false);
      return;
    }

    try {
      // Prepare registration data (send plain password, backend will hash it)
      const registrationData = {
        name: form.name.trim(),
        identifier: form.identifier.trim(),
        password: form.password, // Send plain password, backend will hash
        language: form.language,
        registrationDate: new Date().toISOString(),
      };

      // Send to backend API
      const res = await fetch('http://localhost:5000/api/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(registrationData),
      });
      
      const data = await res.json();
      
      if (res.ok) {
        setMessage('Registration successful! Redirecting to login...');
        setTimeout(() => navigate('/login'), 2000);
      } else if (res.status === 409) {
        setMessage('User already exists. Please login.');
      } else {
        setMessage(data.error || 'Registration failed.');
      }
    } catch (err) {
      setMessage('Registration failed. Please try again.');
    } finally {
      setIsLoading(false);
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
            Full Name:
            <input 
              type="text" 
              name="name" 
              value={form.name} 
              onChange={handleChange} 
              required 
              placeholder="Enter your full name"
            />
          </label>
          
          <label>
            Email/Phone:
            <input 
              type="text" 
              name="identifier" 
              value={form.identifier} 
              onChange={handleChange} 
              required 
              placeholder="Enter email or phone number"
            />
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
                placeholder="Create a strong password"
              />
              <span className="eye-icon" onClick={() => setShowPassword(s => !s)}>
                {showPassword ? <FaEyeSlash /> : <FaEye />}
              </span>
            </div>
            {passwordError && <div style={{ color: 'red', fontSize: '0.95rem', marginTop: '0.25rem' }}>{passwordError}</div>}
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
                placeholder="Confirm your password"
              />
              <span className="eye-icon" onClick={() => setShowConfirmPassword(s => !s)}>
                {showConfirmPassword ? <FaEyeSlash /> : <FaEye />}
              </span>
            </div>
          </label>
          
          <label>
            Preferred Language:
            <select name="language" value={form.language} onChange={handleChange}>
              {languages.map(lang => <option key={lang.value} value={lang.value}>{lang.label}</option>)}
            </select>
          </label>
          
          <button type="submit" disabled={isLoading}>
            {isLoading ? 'Creating Account...' : 'Register'}
          </button>
        </form>
        {message && <p style={{ color: message.includes('successful') ? 'green' : 'red' }}>{message}</p>}
        <p>Already have an account? <a href="/login">Login here</a></p>
      </div>
    </div>
  );
} 