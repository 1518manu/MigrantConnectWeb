import React, { useState, useRef, useEffect } from 'react';
import './QRVerificationSystem.css';

// QR Scanner Component
const QRScanner = ({ onScan, onClose }) => {
  const [isScanning, setIsScanning] = useState(false);
  const [error, setError] = useState('');
  const [scanResult, setScanResult] = useState(null);
  const videoRef = useRef(null);
  const streamRef = useRef(null);

  useEffect(() => {
    startCamera();
    return () => {
      stopCamera();
    };
  }, []);

  const startCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: 'environment' }
      });
      streamRef.current = stream;
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        setIsScanning(true);
      }
    } catch (err) {
      setError('Camera access denied. Please allow camera permissions.');
    }
  };

  const stopCamera = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop());
      streamRef.current = null;
    }
    setIsScanning(false);
  };

  const handleScan = (result) => {
    if (result) {
      setScanResult(result);
      stopCamera();
      onScan(result);
    }
  };

  const handleManualInput = (e) => {
    e.preventDefault();
    const qrCode = e.target.qrCode.value.trim();
    if (qrCode) {
      setScanResult(qrCode);
      onScan(qrCode);
    }
  };

  const retryScan = () => {
    setScanResult(null);
    setError('');
    startCamera();
  };

  return (
    <div className="qr-scanner-overlay">
      <div className="qr-scanner-modal">
        <div className="qr-scanner-header">
          <h2>Scan Authority QR Code</h2>
          <button className="close-btn" onClick={onClose}>×</button>
        </div>

        {!scanResult ? (
          <div className="qr-scanner-content">
            {error ? (
              <div className="error-message">
                <p>{error}</p>
                <button onClick={retryScan} className="retry-btn">
                  Retry Camera
                </button>
              </div>
            ) : (
              <div className="camera-container">
                <video
                  ref={videoRef}
                  autoPlay
                  playsInline
                  className="camera-video"
                />
                <div className="scanner-overlay">
                  <div className="scanner-frame"></div>
                  <p className="scanner-instructions">
                    Position the QR code within the frame
                  </p>
                </div>
              </div>
            )}

            <div className="manual-input-section">
              <p className="manual-input-label">Or enter QR code manually:</p>
              <form onSubmit={handleManualInput} className="manual-input-form">
                <input
                  type="text"
                  name="qrCode"
                  placeholder="Enter QR code here..."
                  className="manual-input"
                />
                <button type="submit" className="manual-submit-btn">
                  Verify
                </button>
              </form>
            </div>
          </div>
        ) : (
          <div className="scan-result">
            <div className="success-icon">✓</div>
            <h3>QR Code Scanned Successfully!</h3>
            <p className="qr-code-display">{scanResult}</p>
            <div className="action-buttons">
              <button onClick={retryScan} className="retry-btn">
                Scan Another
              </button>
              <button onClick={onClose} className="close-btn">
                Close
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

// Verification Result Component
const VerificationResult = ({ result, onClose, onRetry }) => {
  const [showDetails, setShowDetails] = useState(false);

  if (!result) return null;

  const { authority, verificationResult } = result;
  const { isEligible, missingDocuments, verifiedDocuments, overallStatus, requiredDocuments, additionalRequirements } = verificationResult;

  const getStatusColor = (status) => {
    switch (status) {
      case 'eligible': return '#00ff88';
      case 'partial': return '#ffaa00';
      case 'ineligible': return '#ff6b6b';
      default: return '#888';
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'eligible': return '✓';
      case 'partial': return '⚠';
      case 'ineligible': return '✗';
      default: return '?';
    }
  };

  const getDocumentIcon = (docType) => {
    const icons = {
      aadhaar: '🆔',
      workPermit: '💼',
      skillCertificate: '🎓',
      medicalCertificate: '🏥',
      addressProof: '🏠',
      incomeProof: '💰'
    };
    return icons[docType] || '📄';
  };

  const getDocumentName = (docType) => {
    const names = {
      aadhaar: 'Aadhaar Card',
      workPermit: 'Work Permit',
      skillCertificate: 'Skill Certificate',
      medicalCertificate: 'Medical Certificate',
      addressProof: 'Address Proof',
      incomeProof: 'Income Proof'
    };
    return names[docType] || docType;
  };

  return (
    <div className="verification-result-overlay">
      <div className="verification-result-modal">
        <div className="verification-header">
          <h2>Verification Result</h2>
          <button className="close-btn" onClick={onClose}>×</button>
        </div>

        <div className="verification-content">
          {/* Authority Info */}
          <div className="authority-info">
            <div className="authority-icon">🏛️</div>
            <div className="authority-details">
              <h3>{authority.name}</h3>
              <p className="organization">{authority.organization}</p>
              <p className="location">📍 {authority.location}</p>
              <span className="authority-type">{authority.authorityType}</span>
            </div>
          </div>

          {/* Overall Status */}
          <div className="overall-status" style={{ borderColor: getStatusColor(overallStatus) }}>
            <div className="status-icon" style={{ color: getStatusColor(overallStatus) }}>
              {getStatusIcon(overallStatus)}
            </div>
            <div className="status-details">
              <h3 className="status-title">
                {isEligible ? 'All Documents Verified!' : 'Document Verification Required'}
              </h3>
              <p className="status-description">
                {isEligible 
                  ? 'You are eligible for this service. All required documents are verified.'
                  : `You need ${missingDocuments.length} more document(s) to be eligible.`
                }
              </p>
            </div>
          </div>

          {/* Document Status */}
          <div className="document-status">
            <h4>Document Status</h4>
            <div className="document-list">
              {requiredDocuments.map((doc, index) => {
                const isVerified = verifiedDocuments.includes(doc.documentType);
                const isMissing = missingDocuments.includes(doc.documentType);
                
                return (
                  <div key={index} className={`document-item ${isVerified ? 'verified' : 'missing'}`}>
                    <div className="document-icon">
                      {getDocumentIcon(doc.documentType)}
                    </div>
                    <div className="document-info">
                      <span className="document-name">{getDocumentName(doc.documentType)}</span>
                      <span className="document-description">{doc.description}</span>
                    </div>
                    <div className="document-status-icon">
                      {isVerified ? '✓' : '✗'}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Additional Requirements */}
          {additionalRequirements && additionalRequirements.length > 0 && (
            <div className="additional-requirements">
              <h4>Additional Requirements</h4>
              <ul className="requirements-list">
                {additionalRequirements.map((req, index) => (
                  <li key={index} className="requirement-item">
                    <span className="requirement-icon">📋</span>
                    {req.requirement}
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Action Buttons */}
          <div className="action-buttons">
            {!isEligible && (
              <button className="upload-missing-btn" onClick={() => setShowDetails(!showDetails)}>
                {showDetails ? 'Hide Details' : 'View Missing Documents'}
              </button>
            )}
            <button className="retry-btn" onClick={onRetry}>
              Scan Another QR
            </button>
            <button className="close-btn" onClick={onClose}>
              Close
            </button>
          </div>

          {/* Missing Documents Details */}
          {showDetails && missingDocuments.length > 0 && (
            <div className="missing-details">
              <h4>Missing Documents</h4>
              <div className="missing-list">
                {missingDocuments.map((docType, index) => (
                  <div key={index} className="missing-item">
                    <div className="missing-icon">{getDocumentIcon(docType)}</div>
                    <div className="missing-info">
                      <span className="missing-name">{getDocumentName(docType)}</span>
                      <span className="missing-action">Please upload this document in your profile</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

// Verification History Component
const VerificationHistory = ({ userId, onClose }) => {
  const [verifications, setVerifications] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchVerificationHistory();
  }, [userId]);

  const fetchVerificationHistory = async () => {
    try {
      const response = await fetch(`http://localhost:5000/api/verifications/${userId}`);
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to fetch verification history');
      }

      setVerifications(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'eligible': return '#00ff88';
      case 'partial': return '#ffaa00';
      case 'ineligible': return '#ff6b6b';
      default: return '#888';
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'eligible': return '✓';
      case 'partial': return '⚠';
      case 'ineligible': return '✗';
      default: return '?';
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-IN', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getAuthorityTypeIcon = (type) => {
    const icons = {
      employer: '💼',
      government: '🏛️',
      healthcare: '🏥',
      housing: '🏠'
    };
    return icons[type] || '🏢';
  };

  if (isLoading) {
    return (
      <div className="verification-history-overlay">
        <div className="verification-history-modal">
          <div className="verification-history-header">
            <h2>Verification History</h2>
            <button className="close-btn" onClick={onClose}>×</button>
          </div>
          <div className="loading-message">
            <div className="loading-spinner"></div>
            <h4>Loading History...</h4>
            <p>Please wait while we fetch your verification records</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="verification-history-overlay">
      <div className="verification-history-modal">
        <div className="verification-history-header">
          <h2>Verification History</h2>
          <button className="close-btn" onClick={onClose}>×</button>
        </div>

        <div className="verification-history-content">
          {error ? (
            <div className="error-message">
              <div className="error-icon">⚠️</div>
              <h4>Error Loading History</h4>
              <p>{error}</p>
              <button onClick={fetchVerificationHistory} className="retry-btn">
                Try Again
              </button>
            </div>
          ) : verifications.length === 0 ? (
            <div className="empty-history">
              <div className="empty-icon">📋</div>
              <h3>No Verification History</h3>
              <p>You haven't scanned any authority QR codes yet. Start by scanning a QR code to verify your documents.</p>
            </div>
          ) : (
            <div className="history-list">
              {verifications.map((verification, index) => (
                <div key={index} className="history-item">
                  <div className="history-header">
                    <div className="authority-info">
                      <div className="authority-icon">
                        {getAuthorityTypeIcon(verification.authorityId?.authorityType)}
                      </div>
                      <div className="authority-details">
                        <h4>{verification.authorityId?.name || 'Unknown Authority'}</h4>
                        <p className="organization">{verification.authorityId?.organization}</p>
                        <p className="verification-date">
                          {formatDate(verification.verificationDate)}
                        </p>
                      </div>
                    </div>
                    <div className="verification-status">
                      <div 
                        className="status-badge"
                        style={{ 
                          backgroundColor: getStatusColor(verification.verificationResult.overallStatus),
                          color: verification.verificationResult.overallStatus === 'eligible' ? '#000' : '#fff'
                        }}
                      >
                        {getStatusIcon(verification.verificationResult.overallStatus)}
                        <span>{verification.verificationResult.overallStatus}</span>
                      </div>
                    </div>
                  </div>

                  <div className="verification-summary">
                    <div className="summary-item">
                      <span className="summary-label">Verified Documents:</span>
                      <span className="summary-value verified">
                        {verification.verificationResult.verifiedDocuments.length}
                      </span>
                    </div>
                    <div className="summary-item">
                      <span className="summary-label">Missing Documents:</span>
                      <span className="summary-value missing">
                        {verification.verificationResult.missingDocuments.length}
                      </span>
                    </div>
                    <div className="summary-item">
                      <span className="summary-label">Eligibility:</span>
                      <span className={`summary-value ${verification.verificationResult.isEligible ? 'eligible' : 'ineligible'}`}>
                        {verification.verificationResult.isEligible ? 'Eligible' : 'Not Eligible'}
                      </span>
                    </div>
                  </div>

                  {verification.verificationResult.missingDocuments.length > 0 && (
                    <div className="missing-documents">
                      <h5>Missing Documents:</h5>
                      <div className="missing-list">
                        {verification.verificationResult.missingDocuments.map((doc, docIndex) => (
                          <span key={docIndex} className="missing-doc">
                            {doc}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}

                  {verification.scannedLocation && (
                    <div className="location-info">
                      <span className="location-icon">📍</span>
                      <span>Scanned at: {verification.scannedLocation.latitude?.toFixed(4)}, {verification.scannedLocation.longitude?.toFixed(4)}</span>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

// Main QR Verification Component
const QRVerification = ({ userId, onClose }) => {
  const [showScanner, setShowScanner] = useState(false);
  const [verificationResult, setVerificationResult] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const handleScan = async (qrCode) => {
    setIsLoading(true);
    setError('');
    
    try {
      // Get device location if available
      let location = null;
      if (navigator.geolocation) {
        try {
          const position = await new Promise((resolve, reject) => {
            navigator.geolocation.getCurrentPosition(resolve, reject, {
              timeout: 5000,
              enableHighAccuracy: false
            });
          });
          
          location = {
            latitude: position.coords.latitude,
            longitude: position.coords.longitude
          };
        } catch (geoError) {
          console.log('Location not available:', geoError);
        }
      }

      // Get device info
      const deviceInfo = {
        userAgent: navigator.userAgent,
        platform: navigator.platform
      };

      const response = await fetch('http://localhost:5000/api/verify-qr', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          qrCode,
          userId,
          scannedLocation: location,
          deviceInfo
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Verification failed');
      }

      setVerificationResult(data);
      setShowScanner(false);
    } catch (err) {
      setError(err.message || 'Failed to verify QR code');
    } finally {
      setIsLoading(false);
    }
  };

  const handleRetry = () => {
    setVerificationResult(null);
    setError('');
    setShowScanner(true);
  };

  const handleClose = () => {
    setShowScanner(false);
    setVerificationResult(null);
    setError('');
    onClose();
  };

  return (
    <div className="qr-verification-overlay">
      <div className="qr-verification-modal">
        <div className="qr-verification-header">
          <h2>QR Code Verification</h2>
          <button className="close-btn" onClick={handleClose}>×</button>
        </div>

        <div className="qr-verification-content">
          {!showScanner && !verificationResult && (
            <div className="verification-intro">
              <div className="intro-icon">📱</div>
              <h3>Scan Authority QR Code</h3>
              <p>
                Scan the QR code displayed by authorities to instantly verify if your documents 
                meet their requirements. This helps you know if you're eligible before approaching them.
              </p>
              
              <div className="verification-steps">
                <div className="step">
                  <div className="step-number">1</div>
                  <div className="step-content">
                    <h4>Find Authority QR</h4>
                    <p>Look for the QR code displayed by the authority (employer, government office, etc.)</p>
                  </div>
                </div>
                
                <div className="step">
                  <div className="step-number">2</div>
                  <div className="step-content">
                    <h4>Scan QR Code</h4>
                    <p>Use your phone camera to scan the QR code through our app</p>
                  </div>
                </div>
                
                <div className="step">
                  <div className="step-number">3</div>
                  <div className="step-content">
                    <h4>Get Instant Results</h4>
                    <p>See which documents are verified and what's missing</p>
                  </div>
                </div>
              </div>

              <button 
                className="start-scan-btn"
                onClick={() => setShowScanner(true)}
              >
                Start Scanning
              </button>
            </div>
          )}

          {error && (
            <div className="error-message">
              <div className="error-icon">⚠️</div>
              <h4>Verification Error</h4>
              <p>{error}</p>
              <button onClick={() => setError('')} className="retry-btn">
                Try Again
              </button>
            </div>
          )}

          {isLoading && (
            <div className="loading-message">
              <div className="loading-spinner"></div>
              <h4>Verifying Documents...</h4>
              <p>Please wait while we check your document status</p>
            </div>
          )}
        </div>

        {showScanner && (
          <QRScanner 
            onScan={handleScan}
            onClose={() => setShowScanner(false)}
          />
        )}

        {verificationResult && (
          <VerificationResult
            result={verificationResult}
            onClose={handleClose}
            onRetry={handleRetry}
          />
        )}
      </div>
    </div>
  );
};

export { QRVerification, VerificationHistory };
export default QRVerification; 