import React, { useState, useEffect } from 'react';
import QRCodeSVG from 'qrcode';
import { FaQrcode, FaDownload, FaPrint, FaEye } from 'react-icons/fa';
import './QRCodeIdentity.css';

const QRCodeIdentity = () => {
  const [qrCodeUrl, setQrCodeUrl] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    generateQRCode();
  }, []);

  const generateQRCode = async () => {
    try {
      setIsLoading(true);
      
      // Get user data from localStorage or session
      const user = JSON.parse(localStorage.getItem('user') || sessionStorage.getItem('currentUser') || '{}');
      
      // Create identity data object
      const identityData = {
        userId: user.id || user.identifier || 'default-user',
        name: user.name || 'User',
        type: 'migrant-worker',
        timestamp: new Date().toISOString(),
        version: '1.0'
      };

      // Generate QR code
      const qrDataUrl = await QRCodeSVG.toDataURL(JSON.stringify(identityData), {
        width: 300,
        margin: 2,
        color: {
          dark: '#000000',
          light: '#FFFFFF'
        }
      });

      setQrCodeUrl(qrDataUrl);
    } catch (error) {
      console.error('Error generating QR code:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const downloadQRCode = () => {
    if (!qrCodeUrl) return;
    
    const link = document.createElement('a');
    link.href = qrCodeUrl;
    link.download = 'migrant-identity-qr.png';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const printQRCode = () => {
    if (!qrCodeUrl) return;
    
    const printWindow = window.open('', '_blank');
    printWindow.document.write(`
      <html>
        <head>
          <title>Migrant Identity QR Code</title>
          <style>
            body { 
              font-family: Arial, sans-serif; 
              text-align: center; 
              padding: 20px;
              margin: 0;
            }
            .qr-container {
              display: flex;
              flex-direction: column;
              align-items: center;
              gap: 20px;
            }
            .qr-code {
              border: 2px solid #333;
              padding: 20px;
              background: white;
            }
            .qr-code img {
              max-width: 300px;
              height: auto;
            }
            .title {
              font-size: 24px;
              font-weight: bold;
              margin-bottom: 10px;
            }
            .subtitle {
              font-size: 16px;
              color: #666;
              margin-bottom: 20px;
            }
            .info {
              font-size: 14px;
              color: #888;
            }
            @media print {
              body { margin: 0; }
              .qr-container { page-break-inside: avoid; }
            }
          </style>
        </head>
        <body>
          <div class="qr-container">
            <div class="title">MigrantConnect Identity QR Code</div>
            <div class="subtitle">Digital Identity Verification</div>
            <div class="qr-code">
              <img src="${qrCodeUrl}" alt="Identity QR Code" />
            </div>
            <div class="info">
              Generated on: ${new Date().toLocaleDateString()}<br>
              Scan this QR code to verify identity
            </div>
          </div>
        </body>
      </html>
    `);
    printWindow.document.close();
    printWindow.print();
  };

  const openModal = () => {
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
  };

  return (
    <>
      <button className="qr-identity-btn" onClick={openModal}>
        <FaQrcode />
        <span>My QR Identity</span>
      </button>

      {showModal && (
        <div className="qr-modal-overlay" onClick={closeModal}>
          <div className="qr-modal" onClick={(e) => e.stopPropagation()}>
            <div className="qr-modal-header">
              <h2>Digital Identity QR Code</h2>
              <button className="close-btn" onClick={closeModal}>×</button>
            </div>
            
            <div className="qr-modal-content">
              {isLoading ? (
                <div className="loading">
                  <div className="spinner"></div>
                  <p>Generating QR Code...</p>
                </div>
              ) : (
                <>
                  <div className="qr-code-display">
                    <img src={qrCodeUrl} alt="Identity QR Code" />
                  </div>
                  
                  <div className="qr-info">
                    <h3>Identity QR Code</h3>
                    <p>This QR code contains your digital identity information and can be used for verification purposes.</p>
                    
                    <div className="qr-actions">
                      <button className="action-btn download" onClick={downloadQRCode}>
                        <FaDownload />
                        <span>Download</span>
                      </button>
                      <button className="action-btn print" onClick={printQRCode}>
                        <FaPrint />
                        <span>Print</span>
                      </button>
                    </div>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default QRCodeIdentity; 