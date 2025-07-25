import React from 'react';
import CategoryCard from './CategoryCard';
import './DashboardQuickLinks.css';

export default function DashboardQuickLinks() {
  const categories = [
    { name: "Education", icon: "school", path: "/education" },
    { name: "Health", icon: "local_hospital", path: "/health" },
    { name: "Welfare Programs", icon: "volunteer_activism", path: "/welfare" },
  ];
  
  return (
    <div className="quick-links">
      {categories.map(cat => (
        <CategoryCard key={cat.name} {...cat} />
      ))}
    </div>
  );
} 