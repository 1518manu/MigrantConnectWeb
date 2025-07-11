import { ThemeToggle } from './ThemeToggle';
import LanguageSelector from './LanguageSelector';

export default function Navbar({ onSearch }) {
  return (
    <nav className="navbar">
      {/* Left: Logo */}
      <div className="navbar-logo">
        <img src="/src/assets/react.svg" alt="MigrantConnect Logo" />
      </div>
      {/* Center: Search */}
      <div className="navbar-search">
        <input
          type="text"
          placeholder="Search services, documents..."
          onChange={e => onSearch && onSearch(e.target.value)}
        />
      </div>
      {/* Right: Settings, Profile, Theme, Language */}
      <div className="navbar-actions">
        <LanguageSelector />
        <ThemeToggle />
        <button className="navbar-button" title="Settings">
          <span className="material-icons">settings</span>
        </button>
        <button className="navbar-button" title="Profile">
          <span className="material-icons">account_circle</span>
        </button>
      </div>
    </nav>
  );
} 