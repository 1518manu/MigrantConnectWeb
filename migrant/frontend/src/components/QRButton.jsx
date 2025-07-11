import './QRButton.css';
import { useState } from 'react';
import {QRCodeSVG} from 'qrcode.react';

export default function QRButton() {
  const [showQR, setShowQR] = useState(false);
  const userId = "user-123"; // Replace with actual user ID

  return (
    <div className="qr-btn-container">
      <button
        className="qr-btn"
        onClick={() => setShowQR(!showQR)}
      >
        {showQR ? "Hide QR" : "Generate QR"}
      </button>
      {showQR && (
        <div className="qr-preview">
          <QRCodeSVG value={userId} size={160} />
        </div>
      )}
    </div>
  );
} 