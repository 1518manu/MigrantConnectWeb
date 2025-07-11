import React, { useState, useEffect } from 'react';
import { FaIdCard, FaCheckCircle, FaTimesCircle, FaEye, FaEyeSlash, FaQrcode, FaShieldAlt, FaUserCheck } from 'react-icons/fa';
import { QRCodeSVG } from 'qrcode.react';
import './AadhaarIntegration.css';

export default function AadhaarIntegration() {
  const [aadhaarData, setAadhaarData] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    aadhaarNumber: '',
    name: '',
    dateOfBirth: '',
    gender: '',
    address: '',
    phone: ''
  });
  const [showAadhaar, setShowAadhaar] = useState(false);
  const [verificationStatus, setVerificationStatus] = useState('not_verified');
  const [showQR, setShowQR] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    // Load Aadhaar data from localStorage
    const savedAadhaar = JSON.parse(localStorage.getItem('aadhaarData') || 'null');
    if (savedAadhaar) {
      setAadhaarData(savedAadhaar);
      setVerificationStatus(savedAadhaar.verified ? 'verified' : 'pending');
    }
  }, []);

  const saveAadhaarData = (data) => {
    setAadhaarData(data);
    localStorage.setItem('aadhaarData', JSON.stringify(data));
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    
    // Format Aadhaar number with spaces
    if (name === 'aadhaarNumber') {
      const formatted = value.replace(/\s/g, '').replace(/(\d{4})(?=\d)/g, '$1 ');
      setFormData(prev => ({
        ...prev,
        [name]: formatted.substring(0, 14) // Limit to 12 digits + 2 spaces
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: value
      }));
    }
  };

  const validateAadhaar = (aadhaarNumber) => {
    const cleanNumber = aadhaarNumber.replace(/\s/g, '');
    return cleanNumber.length === 12 && /^\d{12}$/.test(cleanNumber);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateAadhaar(formData.aadhaarNumber)) {
      alert('Please enter a valid 12-digit Aadhaar number');
      return;
    }

    if (!formData.name || !formData.dateOfBirth || !formData.gender) {
      alert('Please fill in all required fields');
      return;
    }

    setLoading(true);
    setVerificationStatus('verifying');

    // Simulate Aadhaar verification API call
    await new Promise(resolve => setTimeout(resolve, 3000));

    // Create Aadhaar data object
    const aadhaarInfo = {
      id: Date.now().toString(),
      aadhaarNumber: formData.aadhaarNumber.replace(/\s/g, ''),
      maskedAadhaar: formData.aadhaarNumber.replace(/(\d{4})\d{4}(\d{4})/, '$1****$2'),
      name: formData.name,
      dateOfBirth: formData.dateOfBirth,
      gender: formData.gender,
      address: formData.address,
      phone: formData.phone,
      linkedDate: new Date().toISOString(),
      verified: true,
      qrData: JSON.stringify({
        type: 'Aadhaar',
        aadhaarNumber: formData.aadhaarNumber.replace(/\s/g, ''),
        name: formData.name,
        dateOfBirth: formData.dateOfBirth,
        gender: formData.gender,
        verified: true,
        linkedDate: new Date().toISOString(),
        userId: 'user_' + Date.now().toString().slice(-6)
      })
    };

    saveAadhaarData(aadhaarInfo);
    setVerificationStatus('verified');
    setShowForm(false);
    setLoading(false);
    setFormData({
      aadhaarNumber: '',
      name: '',
      dateOfBirth: '',
      gender: '',
      address: '',
      phone: ''
    });
  };

  const handleUnlink = () => {
    if (window.confirm('Are you sure you want to unlink your Aadhaar? This will remove all Aadhaar-related data.')) {
      setAadhaarData(null);
      setVerificationStatus('not_verified');
      localStorage.removeItem('aadhaarData');
    }
  };

  const getStatusIcon = () => {
    switch (verificationStatus) {
      case 'verified':
        return <FaCheckCircle className="verified" />;
      case 'verifying':
        return <div className="verifying">Verifying...</div>;
      case 'pending':
        return <FaTimesCircle className="pending" />;
      default:
        return <FaTimesCircle className="unverified" />;
    }
  };

  const getStatusText = () => {
    switch (verificationStatus) {
      case 'verified':
        return 'Aadhaar Verified';
      case 'verifying':
        return 'Verifying Aadhaar...';
      case 'pending':
        return 'Verification Pending';
      default:
        return 'Not Linked';
    }
  };

  const getStatusColor = () => {
    switch (verificationStatus) {
      case 'verified':
        return '#28a745';
      case 'verifying':
        return '#ffc107';
      case 'pending':
        return '#dc3545';
      default:
        return '#6c757d';
    }
  };

  return (
    <div className="aadhaar-integration">
      <div className="aadhaar-header">
        <h2>Aadhaar Integration</h2>
        <p>Link your Aadhaar for seamless service access</p>
      </div>

      {!aadhaarData ? (
        <div className="aadhaar-not-linked">
          <div className="aadhaar-card">
            <div className="aadhaar-icon">
              <FaIdCard />
            </div>
            <h3>Link Your Aadhaar</h3>
            <p>Connect your Aadhaar number to access government services and benefits seamlessly.</p>
            <div className="benefits">
              <div className="benefit-item">
                <FaShieldAlt />
                <span>Secure Verification</span>
              </div>
              <div className="benefit-item">
                <FaUserCheck />
                <span>Government Services</span>
              </div>
              <div className="benefit-item">
                <FaQrcode />
                <span>Digital Identity</span>
              </div>
            </div>
            <button 
              className="link-aadhaar-btn"
              onClick={() => setShowForm(true)}
            >
              Link Aadhaar Now
            </button>
          </div>
        </div>
      ) : (
        <div className="aadhaar-linked">
          <div className="aadhaar-card">
            <div className="aadhaar-header-info">
              <div className="aadhaar-icon verified">
                <FaIdCard />
              </div>
              <div className="aadhaar-status">
                <h3>Aadhaar Linked</h3>
                <div className="status-indicator">
                  {getStatusIcon()}
                  <span style={{ color: getStatusColor() }}>{getStatusText()}</span>
                </div>
              </div>
            </div>

            <div className="aadhaar-details">
              <div className="detail-row">
                <span className="label">Aadhaar Number:</span>
                <span className="value">{aadhaarData.maskedAadhaar}</span>
                <button 
                  className="toggle-btn"
                  onClick={() => setShowAadhaar(!showAadhaar)}
                >
                  {showAadhaar ? <FaEyeSlash /> : <FaEye />}
                </button>
              </div>
              {showAadhaar && (
                <div className="full-aadhaar">
                  {aadhaarData.aadhaarNumber}
                </div>
              )}
              
              <div className="detail-row">
                <span className="label">Name:</span>
                <span className="value">{aadhaarData.name}</span>
              </div>
              
              <div className="detail-row">
                <span className="label">Date of Birth:</span>
                <span className="value">{new Date(aadhaarData.dateOfBirth).toLocaleDateString()}</span>
              </div>
              
              <div className="detail-row">
                <span className="label">Gender:</span>
                <span className="value">{aadhaarData.gender}</span>
              </div>
              
              {aadhaarData.address && (
                <div className="detail-row">
                  <span className="label">Address:</span>
                  <span className="value">{aadhaarData.address}</span>
                </div>
              )}
              
              {aadhaarData.phone && (
                <div className="detail-row">
                  <span className="label">Phone:</span>
                  <span className="value">{aadhaarData.phone}</span>
                </div>
              )}
              
              <div className="detail-row">
                <span className="label">Linked Date:</span>
                <span className="value">{new Date(aadhaarData.linkedDate).toLocaleDateString()}</span>
              </div>
            </div>

            <div className="aadhaar-actions">
              <button 
                className="action-btn qr"
                onClick={() => setShowQR(true)}
              >
                <FaQrcode />
                View QR Code
              </button>
              <button 
                className="action-btn unlink"
                onClick={handleUnlink}
              >
                Unlink Aadhaar
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Aadhaar Link Form Modal */}
      {showForm && (
        <div className="aadhaar-modal-overlay" onClick={() => setShowForm(false)}>
          <div className="aadhaar-modal" onClick={(e) => e.stopPropagation()}>
            <div className="aadhaar-modal-header">
              <h3>Link Your Aadhaar</h3>
              <button onClick={() => setShowForm(false)}>×</button>
            </div>
            
            <form onSubmit={handleSubmit} className="aadhaar-form">
              <div className="form-group">
                <label>Aadhaar Number *</label>
                <input
                  type="text"
                  name="aadhaarNumber"
                  value={formData.aadhaarNumber}
                  onChange={handleInputChange}
                  placeholder="XXXX XXXX XXXX"
                  maxLength="14"
                  required
                />
                <small>Enter 12-digit Aadhaar number</small>
              </div>

              <div className="form-group">
                <label>Full Name (as per Aadhaar) *</label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  placeholder="Enter your full name"
                  required
                />
              </div>

              <div className="form-group">
                <label>Date of Birth *</label>
                <input
                  type="date"
                  name="dateOfBirth"
                  value={formData.dateOfBirth}
                  onChange={handleInputChange}
                  required
                />
              </div>

              <div className="form-group">
                <label>Gender *</label>
                <select
                  name="gender"
                  value={formData.gender}
                  onChange={handleInputChange}
                  required
                >
                  <option value="">Select gender</option>
                  <option value="Male">Male</option>
                  <option value="Female">Female</option>
                  <option value="Other">Other</option>
                </select>
              </div>

              <div className="form-group">
                <label>Address</label>
                <textarea
                  name="address"
                  value={formData.address}
                  onChange={handleInputChange}
                  placeholder="Enter your address"
                  rows="3"
                />
              </div>

              <div className="form-group">
                <label>Phone Number</label>
                <input
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleInputChange}
                  placeholder="Enter phone number"
                />
              </div>

              <div className="form-actions">
                <button 
                  type="button" 
                  className="cancel-btn"
                  onClick={() => setShowForm(false)}
                >
                  Cancel
                </button>
                <button 
                  type="submit" 
                  className="submit-btn"
                  disabled={loading}
                >
                  {loading ? 'Verifying...' : 'Link Aadhaar'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Aadhaar QR Code Modal */}
      {showQR && aadhaarData && (
        <div className="qr-modal-overlay" onClick={() => setShowQR(false)}>
          <div className="qr-modal" onClick={(e) => e.stopPropagation()}>
            <div className="qr-modal-header">
              <h3>Aadhaar QR Code</h3>
              <button onClick={() => setShowQR(false)}>×</button>
            </div>
            
            <div className="qr-modal-content">
              <div className="aadhaar-qr-info">
                <h4>{aadhaarData.name}</h4>
                <p>Aadhaar: {aadhaarData.maskedAadhaar}</p>
              </div>
              
              <div className="qr-code-container">
                <QRCodeSVG
                  value={aadhaarData.qrData}
                  size={200}
                  level="M"
                  includeMargin={true}
                />
              </div>
              
              <p className="qr-instructions">
                Scan this QR code to verify Aadhaar identity
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
} 