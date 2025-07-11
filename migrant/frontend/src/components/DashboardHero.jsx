import './DashboardHero.css';
import QRButton from './QRButton';

export default function DashboardHero() {
  return (
    <section className="hero-section hero-full">
      <div>
        <h1 className="hero-title">
          Empowering Migrants, Connecting Services
        </h1>
        <p className="hero-description">
          MigrantConnect helps you access essential documents and services, wherever you are.
        </p>
        <QRButton />
      </div>
    </section>
  );
} 