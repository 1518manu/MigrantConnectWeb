import React, { useState, useEffect } from 'react';
import { FaUpload, FaEye, FaDownload, FaTrash, FaQrcode, FaCheckCircle, FaTimesCircle, FaFileAlt, FaIdCard, FaGraduationCap, FaHeartbeat, FaHome, FaPassport } from 'react-icons/fa';
import { QRCodeSVG } from 'qrcode.react';
import './DocumentManager.css';

const documentTypes = [
  { id: 'aadhaar', name: 'Aadhaar Card', icon: FaIdCard, required: true, color: '#007bff' },
  { id: 'pan', name: 'PAN Card', icon: FaIdCard, required: true, color: '#28a745' },
  { id: 'passport', name: 'Passport', icon: FaPassport, required: false, color: '#ffc107' },
  { id: 'driving_license', name: 'Driving License', icon: FaIdCard, required: false, color: '#17a2b8' },
  { id: 'ration_card', name: 'Ration Card', icon: FaHome, required: false, color: '#6f42c1' },
  { id: 'education_certificate', name: 'Education Certificate', icon: FaGraduationCap, required: false, color: '#20c997' },
  { id: 'medical_certificate', name: 'Medical Certificate', icon: FaHeartbeat, required: false, color: '#dc3545' },
  { id: 'employment_certificate', name: 'Employment Certificate', icon: FaFileAlt, required: false, color: '#fd7e14' },
  { id: 'bank_passbook', name: 'Bank Passbook', icon: FaFileAlt, required: false, color: '#6c757d' },
  { id: 'other', name: 'Other Document', icon: FaFileAlt, required: false, color: '#6c757d' }
];

export default function DocumentManager() {
  const [documents, setDocuments] = useState([]);
  const [showUpload, setShowUpload] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);
  const [selectedDocType, setSelectedDocType] = useState('');
  const [uploadProgress, setUploadProgress] = useState(0);
  const [showQR, setShowQR] = useState(false);
  const [selectedDocument, setSelectedDocument] = useState(null);
  const [verificationStatus, setVerificationStatus] = useState({});

  useEffect(() => {
    // Load documents from localStorage
    const savedDocuments = JSON.parse(localStorage.getItem('userDocuments') || '[]');
    setDocuments(savedDocuments);
    
    // Initialize verification status
    const status = {};
    savedDocuments.forEach(doc => {
      status[doc.id] = doc.verified || false;
    });
    setVerificationStatus(status);
  }, []);

  const saveDocuments = (newDocuments) => {
    setDocuments(newDocuments);
    localStorage.setItem('userDocuments', JSON.stringify(newDocuments));
  };

  const handleFileSelect = (event) => {
    const file = event.target.files[0];
    if (file) {
      // Validate file type
      const allowedTypes = ['image/jpeg', 'image/png', 'image/jpg', 'application/pdf'];
      if (!allowedTypes.includes(file.type)) {
        alert('Please select a valid file type (JPEG, PNG, PDF)');
        return;
      }
      
      // Validate file size (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        alert('File size should be less than 5MB');
        return;
      }
      
      setSelectedFile(file);
    }
  };

  const handleUpload = async () => {
    if (!selectedFile || !selectedDocType) {
      alert('Please select a file and document type');
      return;
    }

    setUploadProgress(0);
    
    // Simulate upload progress
    const interval = setInterval(() => {
      setUploadProgress(prev => {
        if (prev >= 100) {
          clearInterval(interval);
          return 100;
        }
        return prev + 10;
      });
    }, 200);

    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 2000));

    // Create document object
    const newDocument = {
      id: Date.now().toString(),
      type: selectedDocType,
      name: selectedFile.name,
      size: selectedFile.size,
      uploadDate: new Date().toISOString(),
      verified: false,
      qrData: JSON.stringify({
        documentId: Date.now().toString(),
        type: selectedDocType,
        name: selectedFile.name,
        uploadDate: new Date().toISOString(),
        verified: false,
        userId: 'user_' + Date.now().toString().slice(-6)
      })
    };

    // Add to documents
    const updatedDocuments = [...documents, newDocument];
    saveDocuments(updatedDocuments);
    
    // Update verification status
    setVerificationStatus(prev => ({
      ...prev,
      [newDocument.id]: false
    }));

    // Reset form
    setSelectedFile(null);
    setSelectedDocType('');
    setShowUpload(false);
    setUploadProgress(0);
  };

  const handleDelete = (documentId) => {
    if (window.confirm('Are you sure you want to delete this document?')) {
      const updatedDocuments = documents.filter(doc => doc.id !== documentId);
      saveDocuments(updatedDocuments);
      
      // Remove from verification status
      const newStatus = { ...verificationStatus };
      delete newStatus[documentId];
      setVerificationStatus(newStatus);
    }
  };

  const handleVerify = async (documentId) => {
    // Simulate verification process
    setVerificationStatus(prev => ({
      ...prev,
      [documentId]: 'verifying'
    }));

    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 3000));

    // Update verification status
    setVerificationStatus(prev => ({
      ...prev,
      [documentId]: true
    }));

    // Update document
    const updatedDocuments = documents.map(doc => 
      doc.id === documentId ? { ...doc, verified: true } : doc
    );
    saveDocuments(updatedDocuments);
  };

  const showDocumentQR = (document) => {
    setSelectedDocument(document);
    setShowQR(true);
  };

  const downloadDocument = (document) => {
    // Create a download link for the document
    const link = document.createElement('a');
    link.href = URL.createObjectURL(selectedFile);
    link.download = document.name;
    link.click();
  };

  const getDocumentIcon = (type) => {
    const docType = documentTypes.find(dt => dt.id === type);
    return docType ? docType.icon : FaFileAlt;
  };

  const getDocumentColor = (type) => {
    const docType = documentTypes.find(dt => dt.id === type);
    return docType ? docType.color : '#6c757d';
  };

  const getVerificationStatusIcon = (status) => {
    if (status === true) return <FaCheckCircle className="verified" />;
    if (status === 'verifying') return <div className="verifying">Verifying...</div>;
    return <FaTimesCircle className="unverified" />;
  };

  return (
    <div className="document-manager">
      <div className="document-manager-header">
        <h2>Document Management</h2>
        <p>Upload and manage your identity documents</p>
        <button 
          className="upload-btn"
          onClick={() => setShowUpload(true)}
        >
          <FaUpload />
          Upload Document
        </button>
      </div>

      {/* Document Upload Modal */}
      {showUpload && (
        <div className="upload-modal-overlay" onClick={() => setShowUpload(false)}>
          <div className="upload-modal" onClick={(e) => e.stopPropagation()}>
            <div className="upload-modal-header">
              <h3>Upload Document</h3>
              <button onClick={() => setShowUpload(false)}>×</button>
            </div>
            
            <div className="upload-modal-content">
              <div className="upload-form">
                <div className="form-group">
                  <label>Document Type</label>
                  <select 
                    value={selectedDocType} 
                    onChange={(e) => setSelectedDocType(e.target.value)}
                  >
                    <option value="">Select document type</option>
                    {documentTypes.map(type => (
                      <option key={type.id} value={type.id}>
                        {type.name} {type.required && '(Required)'}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="form-group">
                  <label>Select File</label>
                  <input 
                    type="file" 
                    onChange={handleFileSelect}
                    accept=".jpg,.jpeg,.png,.pdf"
                  />
                  {selectedFile && (
                    <p className="file-info">
                      Selected: {selectedFile.name} ({(selectedFile.size / 1024 / 1024).toFixed(2)} MB)
                    </p>
                  )}
                </div>

                {uploadProgress > 0 && (
                  <div className="upload-progress">
                    <div className="progress-bar">
                      <div 
                        className="progress-fill" 
                        style={{ width: `${uploadProgress}%` }}
                      ></div>
                    </div>
                    <span>{uploadProgress}%</span>
                  </div>
                )}

                <div className="upload-actions">
                  <button 
                    className="upload-submit-btn"
                    onClick={handleUpload}
                    disabled={!selectedFile || !selectedDocType || uploadProgress > 0}
                  >
                    {uploadProgress > 0 ? 'Uploading...' : 'Upload Document'}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Documents Grid */}
      <div className="documents-grid">
        {documents.length === 0 ? (
          <div className="no-documents">
            <FaFileAlt size={48} />
            <h3>No documents uploaded</h3>
            <p>Upload your first document to get started</p>
          </div>
        ) : (
          documents.map(document => {
            const Icon = getDocumentIcon(document.type);
            const color = getDocumentColor(document.type);
            
            return (
              <div key={document.id} className="document-card">
                <div className="document-header">
                  <div className="document-icon" style={{ backgroundColor: color }}>
                    <Icon />
                  </div>
                  <div className="document-info">
                    <h4>{document.name}</h4>
                    <p>{documentTypes.find(dt => dt.id === document.type)?.name}</p>
                    <span className="upload-date">
                      {new Date(document.uploadDate).toLocaleDateString()}
                    </span>
                  </div>
                  <div className="verification-status">
                    {getVerificationStatusIcon(verificationStatus[document.id])}
                  </div>
                </div>

                <div className="document-actions">
                  <button 
                    className="action-btn view"
                    onClick={() => downloadDocument(document)}
                  >
                    <FaEye />
                    View
                  </button>
                  <button 
                    className="action-btn qr"
                    onClick={() => showDocumentQR(document)}
                  >
                    <FaQrcode />
                    QR
                  </button>
                  <button 
                    className="action-btn download"
                    onClick={() => downloadDocument(document)}
                  >
                    <FaDownload />
                    Download
                  </button>
                  {!verificationStatus[document.id] && (
                    <button 
                      className="action-btn verify"
                      onClick={() => handleVerify(document.id)}
                      disabled={verificationStatus[document.id] === 'verifying'}
                    >
                      {verificationStatus[document.id] === 'verifying' ? 'Verifying...' : 'Verify'}
                    </button>
                  )}
                  <button 
                    className="action-btn delete"
                    onClick={() => handleDelete(document.id)}
                  >
                    <FaTrash />
                    Delete
                  </button>
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* QR Code Modal */}
      {showQR && selectedDocument && (
        <div className="qr-modal-overlay" onClick={() => setShowQR(false)}>
          <div className="qr-modal" onClick={(e) => e.stopPropagation()}>
            <div className="qr-modal-header">
              <h3>Document QR Code</h3>
              <button onClick={() => setShowQR(false)}>×</button>
            </div>
            
            <div className="qr-modal-content">
              <div className="document-qr-info">
                <h4>{selectedDocument.name}</h4>
                <p>{documentTypes.find(dt => dt.id === selectedDocument.type)?.name}</p>
              </div>
              
              <div className="qr-code-container">
                <QRCodeSVG
                  value={selectedDocument.qrData}
                  size={200}
                  level="M"
                  includeMargin={true}
                />
              </div>
              
              <p className="qr-instructions">
                Scan this QR code to verify document authenticity
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
} 