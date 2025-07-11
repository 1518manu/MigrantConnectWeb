import { useNavigate } from 'react-router-dom';

export default function IssuedDocumentsButton() {
  const navigate = useNavigate();
  return (
    <button
      className="btn btn-primary"
      onClick={() => navigate('/issued-documents')}
    >
      Issued Documents
    </button>
  );
} 