import React from 'react';
import { checkPasswordStrength } from '../utils/password';
import './PasswordStrengthIndicator.css';

export default function PasswordStrengthIndicator({ password }) {
  if (!password) return null;

  const strength = checkPasswordStrength(password);
  
  return (
    <div className="password-strength">
      <div className="strength-bar">
        <div 
          className="strength-fill" 
          style={{ 
            width: `${(strength.score / 5) * 100}%`,
            backgroundColor: strength.color 
          }}
        />
      </div>
      <div className="strength-text" style={{ color: strength.color }}>
        {strength.strength.toUpperCase()}
      </div>
      <div className="strength-message">
        {strength.message}
      </div>
      <div className="strength-requirements">
        <div className={`requirement ${strength.checks.length ? 'met' : 'unmet'}`}>
          ✓ At least 8 characters
        </div>
        <div className={`requirement ${strength.checks.lowercase ? 'met' : 'unmet'}`}>
          ✓ Lowercase letter
        </div>
        <div className={`requirement ${strength.checks.uppercase ? 'met' : 'unmet'}`}>
          ✓ Uppercase letter
        </div>
        <div className={`requirement ${strength.checks.numbers ? 'met' : 'unmet'}`}>
          ✓ Number
        </div>
        <div className={`requirement ${strength.checks.special ? 'met' : 'unmet'}`}>
          ✓ Special character
        </div>
      </div>
    </div>
  );
} 