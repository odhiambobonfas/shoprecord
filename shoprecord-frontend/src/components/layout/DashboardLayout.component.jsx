'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '../../hooks/useAuth.hook';
import Navbar from './Navbar.component';
import Sidebar from './Sidebar.component';
import Loading from '../ui/Loading.ui';

export default function DashboardLayout({ children }) {
  const { isAuthenticated, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && !isAuthenticated) {
      router.push('/auth/login');
    }
  }, [isAuthenticated, loading, router]);

  if (loading) {
    return <Loading fullScreen message="Loading..." />;
  }

  if (!isAuthenticated) {
    return null;
  }

  const layoutStyles = {
    display: 'flex',
    flexDirection: 'column',
    minHeight: '100vh',
  };

  const contentWrapperStyles = {
    display: 'flex',
    flex: 1,
  };

  const mainContentStyles = {
    flex: 1,
    padding: '24px',
    backgroundColor: '#f9fafb',
    minHeight: 'calc(100vh - 57px)',
  };

  return (
    <div style={layoutStyles}>
      <Navbar />
      <div style={contentWrapperStyles}>
        <Sidebar />
        <main style={mainContentStyles}>
          {children}
        </main>
      </div>
    </div>
  );
}
