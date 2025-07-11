import Navbar from '../components/Navbar';
import DashboardHero from '../components/DashboardHero';
import IssuedDocumentsButton from '../components/IssuedDocumentsButton';
import DashboardQuickLinks from '../components/DashboardQuickLinks';
import DashboardAnnouncements from '../components/DashboardAnnouncements';
import DashboardSupport from '../components/DashboardSupport';

export default function Dashboard() {
  return (
    <div className="main-container">
      <Navbar />
      <main className="main-content">
        <DashboardHero />
        <IssuedDocumentsButton />
        <DashboardQuickLinks />
        <DashboardAnnouncements />
        <DashboardSupport />
      </main>
    </div>
  );
} 