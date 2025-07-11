import React from 'react';
import './DashboardAnnouncements.css';

export default function DashboardAnnouncements() {
  const announcements = [
    "New health camp on July 20th!",
    "Welfare program applications open.",
    "Education scholarships available.",
  ];
  
  return (
    <div className="announcements">
      <h3 className="announcement-title">Announcements</h3>
      <ul>
        {announcements.map((msg, idx) => (
          <li key={idx} className="announcement-content">{msg}</li>
        ))}
      </ul>
    </div>
  );
} 