import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaEye, FaEyeSlash } from 'react-icons/fa';
import { hashPassword, checkPasswordStrength } from './utils/password';
import PasswordStrengthIndicator from './components/PasswordStrengthIndicator';

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
  const navigate = useNavigate();

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const validateForm = () => {
    // Check if all fields are filled
    if (!form.name.trim() || !form.identifier.trim() || !form.password || !form.confirmPassword) {
      setMessage('Please fill in all fields.');
      return false;
    }

    // Check password strength
    const strength = checkPasswordStrength(form.password);
    if (strength.score < 3) {
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

    try {
      // Hash the password before sending
      const hashedPassword = hashPassword(form.password);
      
      // Prepare registration data
      const registrationData = {
        name: form.name.trim(),
        identifier: form.identifier.trim(),
        password: hashedPassword, // Send hashed password
        language: form.language,
        registrationDate: new Date().toISOString(),
      };

      // For demo purposes, simulate API call
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // Store user data locally (in real app, this would go to backend)
      const users = JSON.parse(localStorage.getItem('users') || '[]');
      const existingUser = users.find(user => user.identifier === form.identifier);
      
      if (existingUser) {
        setMessage('User already exists. Please login.');
        setIsLoading(false);
        return;
      }

      // Add new user
      users.push(registrationData);
      localStorage.setItem('users', JSON.stringify(users));

      setMessage('Registration successful! Redirecting to login...');
      setTimeout(() => navigate('/login'), 2000);
      
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
            <PasswordStrengthIndicator password={form.password} />
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
        
        {message && (
          <p className="message" style={{ 
            color: message.includes('successful') ? '#00C851' : '#ff4444' 
          }}>
            {message}
          </p>
        )}
        
        <p>Already have an account? <a href="/login">Login here</a></p>
      </div>
    </div>
  );
} 