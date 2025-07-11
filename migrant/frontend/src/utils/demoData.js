import { hashPassword } from './auth';

// Initialize demo users for testing
export function initializeDemoUsers() {
  const existingUsers = localStorage.getItem('users');
  
  if (!existingUsers) {
    const demoUsers = [
      {
        name: 'Demo User',
        identifier: 'demo@example.com',
        password: hashPassword('Demo@123'),
        language: 'English',
        registrationDate: new Date().toISOString(),
      },
      {
        name: 'Test User',
        identifier: 'test@example.com',
        password: hashPassword('Test@456'),
        language: 'Hindi',
        registrationDate: new Date().toISOString(),
      }
    ];
    
    localStorage.setItem('users', JSON.stringify(demoUsers));
    console.log('Demo users initialized');
  }
}

// Get demo login credentials
export function getDemoCredentials() {
  return [
    { email: 'demo@example.com', password: 'Demo@123' },
    { email: 'test@example.com', password: 'Test@456' }
  ];
} 