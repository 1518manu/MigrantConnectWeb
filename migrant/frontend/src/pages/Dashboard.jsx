import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getToken } from '../utils/auth';
import { 
  Navbar, 
  DashboardHero, 
  IssuedDocumentsButton, 
  DashboardQuickLinks, 
  DashboardAnnouncements, 
  DashboardSupport, 
  FadeInSection 
} from '../components/DashboardComponents';

function Dashboard() {
  const navigate = useNavigate();

  useEffect(() => {
    // Check if user is authenticated
    const token = getToken();
    if (!token) {
      navigate('/login');
      return;
    }
  }, [navigate]);

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

export default Dashboard; 