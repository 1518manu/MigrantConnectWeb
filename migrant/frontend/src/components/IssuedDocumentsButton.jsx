import React from 'react';
import { useNavigate } from 'react-router-dom';
import './IssuedDocumentsButton.css';

export default function IssuedDocumentsButton() {
  const navigate = useNavigate();
  
  return (
    <button
      className="issued-documents-btn"
      onClick={() => navigate('/issued-documents')}
    >
      View Issued Documents
    </button>
  );
} 