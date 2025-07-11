import CryptoJS from 'crypto-js';

// Password strength checker
export function checkPasswordStrength(password) {
  const checks = {
    length: password.length >= 8,
    lowercase: /[a-z]/.test(password),
    uppercase: /[A-Z]/.test(password),
    numbers: /\d/.test(password),
    special: /[!@#$%^&*(),.?":{}|<>]/.test(password),
  };

  const score = Object.values(checks).filter(Boolean).length;
  
  let strength = 'weak';
  let color = '#ff4444';
  let message = '';

  if (score === 5) {
    strength = 'very strong';
    color = '#00C851';
    message = 'Excellent! Your password is very secure.';
  } else if (score === 4) {
    strength = 'strong';
    color = '#00C851';
    message = 'Good! Your password is secure.';
  } else if (score === 3) {
    strength = 'moderate';
    color = '#ffbb33';
    message = 'Fair. Consider adding more complexity.';
  } else if (score === 2) {
    strength = 'weak';
    color = '#ff4444';
    message = 'Weak. Please improve your password.';
  } else {
    strength = 'very weak';
    color = '#ff4444';
    message = 'Very weak. Please choose a stronger password.';
  }

  return {
    strength,
    color,
    message,
    checks,
    score
  };
}

// Hash password using SHA-256
export function hashPassword(password) {
  return CryptoJS.SHA256(password).toString();
}

// Encrypt sensitive data
export function encryptData(data, key = 'migrant-connect-key') {
  return CryptoJS.AES.encrypt(JSON.stringify(data), key).toString();
}

// Decrypt sensitive data
export function decryptData(encryptedData, key = 'migrant-connect-key') {
  try {
    const bytes = CryptoJS.AES.decrypt(encryptedData, key);
    return JSON.parse(bytes.toString(CryptoJS.enc.Utf8));
  } catch (error) {
    console.error('Decryption failed:', error);
    return null;
  }
}

// Generate a secure random salt
export function generateSalt() {
  return CryptoJS.lib.WordArray.random(128/8).toString();
}

// Hash password with salt
export function hashPasswordWithSalt(password, salt) {
  return CryptoJS.SHA256(password + salt).toString();
} 