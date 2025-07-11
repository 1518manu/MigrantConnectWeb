import Navbar from '../components/Navbar';
import DashboardHero from '../components/DashboardHero';
import IssuedDocumentsButton from '../components/IssuedDocumentsButton';
import DashboardQuickLinks from '../components/DashboardQuickLinks';
import DashboardAnnouncements from '../components/DashboardAnnouncements';
import DashboardSupport from '../components/DashboardSupport';
import FadeInSection from '../components/FadeInSection';

export default function Dashboard() {
  return (
    <div className="main-container">
      <Navbar />
      <main className="main-content">
        <DashboardHero />
        <FadeInSection>
          <IssuedDocumentsButton />
        </FadeInSection>
        <FadeInSection>
          <DashboardQuickLinks />
        </FadeInSection>
        <FadeInSection>
          <DashboardAnnouncements />
        </FadeInSection>
        <FadeInSection>
          <DashboardSupport />
        </FadeInSection>
      </main>
    </div>
  );
} 