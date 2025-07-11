<<<<<<< HEAD
import CryptoJS from 'crypto-js';

=======
>>>>>>> joelbranch
// Utility to save JWT token
export function saveToken(token) {
  localStorage.setItem('jwt_token', token);
}

// Utility to get JWT token
export function getToken() {
  return localStorage.getItem('jwt_token');
}

// Utility to remove JWT token
export function removeToken() {
  localStorage.removeItem('jwt_token');
<<<<<<< HEAD
}

// Hash password using SHA-256
export function hashPassword(password) {
  return CryptoJS.SHA256(password).toString();
=======
>>>>>>> joelbranch
} 