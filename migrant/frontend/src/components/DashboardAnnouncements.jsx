import './DashboardAnnouncements.css';

export default function DashboardAnnouncements() {
  // Replace with dynamic data as needed
  const announcements = [
    "New health camp on July 20th!",
    "Welfare program applications open.",
    "Education scholarships available.",
  ];
  return (
    <div className="announcements">
      <ul>
        {announcements.map((msg, idx) => (
          <li key={idx}>{msg}</li>
        ))}
      </ul>
    </div>
  );
} 