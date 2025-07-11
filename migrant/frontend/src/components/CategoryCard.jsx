import React from 'react';
import { useNavigate } from 'react-router-dom';
import './CategoryCard.css';

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
      <span className="material-icons category-card-icon">{icon}</span>
      <span>{name}</span>
    </div>
  );
} 