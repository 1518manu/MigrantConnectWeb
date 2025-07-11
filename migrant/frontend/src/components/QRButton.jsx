import { useState } from 'react';
import { QRCodeSVG } from 'qrcode.react';

export default function QRButton() {
  const [showQR, setShowQR] = useState(false);
  const userId = "user-123"; // Replace with actual user ID

  return (
    <div className="flex flex-col items-center">
      <button
        className="bg-white dark:bg-gray-700 border-2 border-blue-500 text-blue-700 font-bold py-4 px-6 rounded-lg text-lg shadow-lg"
        onClick={() => setShowQR(!showQR)}
      >
        {showQR ? "Hide QR" : "Generate QR"}
      </button>
      {showQR && (
        <div className="mt-2 p-2 bg-white dark:bg-gray-900 rounded-lg">
          <QRCode value={userId} size={128} />
        </div>
      )}
    </div>
  );
} 