import React, { useEffect, useState } from 'react';
import { FaSearch, FaCog, FaUser, FaSun, FaMoon, FaQrcode, FaFileAlt, FaGraduationCap, FaHeartbeat, FaHandHoldingHeart, FaBullhorn, FaHeadset, FaArrowRight, FaIdCard, FaShieldAlt, FaCamera, FaHistory } from 'react-icons/fa';
import QRCodeIdentity from './QRCodeIdentity';
import DocumentManager from './DocumentManager';
import AadhaarIntegration from './AadhaarIntegration';
import { QRVerification, VerificationHistory } from './QRVerificationSystem';
import './DashboardComponents.css';

// Navbar Component
export function Navbar() {
  const [isDark, setIsDark] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');

  const toggleTheme = () => {
    setIsDark(!isDark);
    document.body.classList.toggle('light-theme');
  };

  return (
    <nav className="navbar">
      <div className="nav-content">
        <div className="nav-left">
          <div className="logo">
            <span className="logo-text">MigrantConnect</span>
          </div>
        </div>
        
        <div className="nav-center">
          <div className="search-box">
            <FaSearch className="search-icon" />
            <input
              type="text"
              placeholder="Search services, documents..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </div>
        
        <div className="nav-right">
          <button className="nav-btn" onClick={toggleTheme}>
            {isDark ? <FaSun /> : <FaMoon />}
          </button>
          <button className="nav-btn">
            <FaCog />
          </button>
          <button className="nav-btn">
            <FaUser />
          </button>
        </div>
      </div>
    </nav>
  );
}

// Dashboard Hero Component
export function DashboardHero() {
  return (
    <section className="hero-section">
      <div className="hero-content">
        <div className="hero-text">
          <h1 className="hero-title">Welcome to MigrantConnect</h1>
          <p className="hero-subtitle">Your gateway to essential services and support</p>
          <div className="hero-buttons">
            <QRCodeIdentity />
            <button className="hero-btn secondary">
              <FaFileAlt />
              <span>View Documents</span>
            </button>
          </div>
        </div>
        <div className="hero-visual">
          <div className="hero-illustration">
            <div className="illustration-placeholder">
              <FaUser size={80} />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

// Digital Identity Section Component
export function DigitalIdentitySection() {
  const [showQRVerification, setShowQRVerification] = useState(false);
  const [showVerificationHistory, setShowVerificationHistory] = useState(false);
  
  // Get user ID from localStorage or context
  const userId = localStorage.getItem('userId') || 'default-user-id';

  return (
    <section className="digital-identity-section">
      <div className="section-header">
        <h2>Digital Identity & Documents</h2>
        <p>Manage your identity documents and Aadhaar integration</p>
      </div>
      
      <div className="identity-features">
        <div className="identity-feature-card">
          <div className="feature-icon">
            <FaIdCard />
          </div>
          <h3>Aadhaar Integration</h3>
          <p>Link your Aadhaar for seamless government service access</p>
          <AadhaarIntegration />
        </div>
        
        <div className="identity-feature-card">
          <div className="feature-icon">
            <FaFileAlt />
          </div>
          <h3>Document Management</h3>
          <p>Upload, verify, and manage all your identity documents</p>
          <DocumentManager />
        </div>

        <div className="identity-feature-card">
          <div className="feature-icon">
            <FaCamera />
          </div>
          <h3>QR Code Verification</h3>
          <p>Scan authority QR codes to verify your document eligibility</p>
          <div className="feature-actions">
            <button 
              className="feature-btn primary"
              onClick={() => setShowQRVerification(true)}
            >
              <FaCamera />
              <span>Scan QR Code</span>
            </button>
            <button 
              className="feature-btn secondary"
              onClick={() => setShowVerificationHistory(true)}
            >
              <FaHistory />
              <span>View History</span>
            </button>
          </div>
        </div>
      </div>

      {showQRVerification && (
        <QRVerification 
          userId={userId}
          onClose={() => setShowQRVerification(false)}
        />
      )}

      {showVerificationHistory && (
        <VerificationHistory 
          userId={userId}
          onClose={() => setShowVerificationHistory(false)}
        />
      )}
    </section>
  );
}

// Issued Documents Button Component
export function IssuedDocumentsButton() {
  return (
    <section className="documents-section">
      <div className="documents-container">
        <button className="documents-btn">
          <div className="documents-icon">
            <FaFileAlt />
          </div>
          <div className="documents-content">
            <h3>Issued Documents</h3>
            <p>View and download your official documents</p>
          </div>
          <FaArrowRight className="arrow-icon" />
        </button>
      </div>
    </section>
  );
}

// Category Card Component
export function CategoryCard({ icon: Icon, title, description, color, onClick }) {
  return (
    <div className="category-card" onClick={onClick} style={{ '--card-color': color }}>
      <div className="card-icon">
        <Icon />
      </div>
      <div className="card-content">
        <h3>{title}</h3>
        <p>{description}</p>
      </div>
    </div>
  );
}

// Dashboard Quick Links Component
export function DashboardQuickLinks() {
  const quickLinks = [
    {
      icon: FaGraduationCap,
      title: 'Education',
      description: 'Schools, training programs',
      color: '#4CAF50'
    },
    {
      icon: FaHeartbeat,
      title: 'Healthcare',
      description: 'Medical services, clinics',
      color: '#F44336'
    },
    {
      icon: FaHandHoldingHeart,
      title: 'Welfare',
      description: 'Support programs, benefits',
      color: '#2196F3'
    }
  ];

  return (
    <section className="quick-links-section">
      <div className="section-header">
        <h2>Quick Access</h2>
        <p>Find essential services quickly</p>
      </div>
      <div className="quick-links-grid">
        {quickLinks.map((link, index) => (
          <CategoryCard
            key={index}
            icon={link.icon}
            title={link.title}
            description={link.description}
            color={link.color}
            onClick={() => console.log(`Navigate to ${link.title}`)}
          />
        ))}
      </div>
    </section>
  );
}

// Dashboard Announcements Component
export function DashboardAnnouncements() {
  const announcements = [
    {
      id: 1,
      title: 'New Healthcare Program',
      content: 'Free health checkup camps available this month',
      date: '2024-01-15'
    },
    {
      id: 2,
      title: 'Document Update Required',
      content: 'Please update your address proof by end of month',
      date: '2024-01-10'
    },
    {
      id: 3,
      title: 'Education Scholarship',
      content: 'Applications open for children\'s education support',
      date: '2024-01-08'
    }
  ];

  return (
    <section className="announcements-section">
      <div className="section-header">
        <h2>Announcements</h2>
        <p>Stay updated with important information</p>
      </div>
      <div className="announcements-list">
        {announcements.map(announcement => (
          <div key={announcement.id} className="announcement-item">
            <div className="announcement-content">
              <h3>{announcement.title}</h3>
              <p>{announcement.content}</p>
              <span className="announcement-date">{announcement.date}</span>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

// Dashboard Support Component
export function DashboardSupport() {
  return (
    <section className="support-section">
      <div className="section-header">
        <h2>Need Help?</h2>
        <p>Get support when you need it</p>
      </div>
      <div className="support-options">
        <div className="support-card">
          <div className="support-icon">
            <FaHeadset />
          </div>
          <div className="support-content">
            <h3>24/7 Helpline</h3>
            <p>Call us anytime for assistance</p>
            <button className="support-btn">Call Now</button>
          </div>
        </div>
        <div className="support-card">
          <div className="support-icon">
            <FaBullhorn />
          </div>
          <div className="support-content">
            <h3>Report Issue</h3>
            <p>Report problems or concerns</p>
            <button className="support-btn">Report</button>
          </div>
        </div>
      </div>
    </section>
  );
}

// Fade In Section Component
export function FadeInSection({ children }) {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
        }
      },
      { threshold: 0.1 }
    );

    const element = document.querySelector('.fade-in-section');
    if (element) {
      observer.observe(element);
    }

    return () => {
      if (element) {
        observer.unobserve(element);
      }
    };
  }, []);

  return (
    <div className={`fade-in-section ${isVisible ? 'visible' : ''}`}>
      {children}
    </div>
  );
} 