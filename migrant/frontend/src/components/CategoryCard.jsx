import './CategoryCard.css';
import { useNavigate } from 'react-router-dom';

export default function CategoryCard({ name, icon, path }) {
  const navigate = useNavigate();
  return (
    <div
      className="category-card"
      onClick={() => navigate(path)}
      tabIndex={0}
      role="button"
      aria-label={name}
    >
      <span className="material-icons category-icon">{icon}</span>
      <span className="category-name">{name}</span>
    </div>
  );
} 