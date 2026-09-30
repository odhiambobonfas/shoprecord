'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuth } from '../../hooks/useAuth.hook';
import { getProfilePictureUrl, getUserInitials } from '../../utils/helpers.utils';
import CurrencySelector from '../ui/CurrencySelector.ui';

export default function Navbar() {
  const { user, logout } = useAuth();
  const router = useRouter();
  const [showDropdown, setShowDropdown] = useState(false);

  const navStyles = {
    background: 'linear-gradient(135deg, #1e293b 0%, #334155 100%)',
    borderBottom: '3px solid #3b82f6',
    padding: '16px 32px',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
    position: 'sticky',
    top: 0,
    zIndex: 1000,
  };

  const logoStyles = {
    fontSize: '20px',
    fontWeight: '900',
    background: 'linear-gradient(135deg, #3b82f6 0%, #8b5cf6 100%)',
    WebkitBackgroundClip: 'text',
    WebkitTextFillColor: 'transparent',
    backgroundClip: 'text',
    display: 'flex',
    alignItems: 'center',
    gap: '10px',
    cursor: 'pointer',
  };

  const rightSectionStyles = {
    display: 'flex',
    alignItems: 'center',
    gap: '24px',
  };

  const userInfoStyles = {
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
    padding: '8px 16px',
    borderRadius: '20px',
    background: 'rgba(255, 255, 255, 0.1)',
    backdropFilter: 'blur(10px)',
    border: '1px solid rgba(255, 255, 255, 0.2)',
  };

  const avatarStyles = {
    width: '32px',
    height: '32px',
    borderRadius: '50%',
    background: 'linear-gradient(135deg, #3b82f6 0%, #8b5cf6 100%)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    color: '#fff',
    fontWeight: '700',
    fontSize: '14px',
  };

  const userNameStyles = {
    fontSize: '13px',
    color: '#fff',
    fontWeight: '600',
  };

  const logoutButtonStyles = {
    padding: '10px 20px',
    background: 'linear-gradient(135deg, #3b82f6 0%, #2563eb 100%)',
    color: '#fff',
    border: 'none',
    borderRadius: '8px',
    fontSize: '14px',
    cursor: 'pointer',
    fontWeight: '700',
    boxShadow: '0 4px 12px rgba(59, 130, 246, 0.3)',
    transition: 'all 0.2s ease',
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
  };

  const dropdownStyles = {
    position: 'absolute',
    top: '100%',
    right: 0,
    marginTop: '8px',
    backgroundColor: '#fff',
    borderRadius: '12px',
    boxShadow: '0 10px 25px rgba(0, 0, 0, 0.15)',
    minWidth: '180px',
    padding: '8px',
    zIndex: 1100,
    border: '1px solid #e5e7eb',
  };

  const dropdownItemStyles = {
    width: '100%',
    padding: '12px 16px',
    border: 'none',
    background: 'transparent',
    textAlign: 'left',
    cursor: 'pointer',
    fontSize: '14px',
    fontWeight: '500',
    color: '#374151',
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
    borderRadius: '8px',
    transition: 'background 0.2s',
  };

  const dropdownDividerStyles = {
    height: '1px',
    background: '#e5e7eb',
    margin: '8px 0',
  };

  const profileImageUrl = user?.profilePicture ? getProfilePictureUrl(user.profilePicture) : null;
  const initials = getUserInitials(user?.name || user?.email);

  return (
    <nav style={navStyles}>
      <Link href="/dashboard">
        <div style={logoStyles}>
          <span style={{ fontSize: '24px' }}>🏪</span>
          <span>ShopRecord</span>
        </div>
      </Link>
      
      <div style={rightSectionStyles}>
        {user && (
          <>
            <CurrencySelector />
            <div style={userInfoStyles}>
              <div style={avatarStyles}>
                {profileImageUrl ? (
                  <img 
                    src={profileImageUrl} 
                    alt="Profile" 
                    style={{ width: '100%', height: '100%', borderRadius: '50%', objectFit: 'cover' }}
                  />
                ) : (
                  initials
                )}
              </div>
              <div style={userNameStyles}>
                {user.name || user.email}
              </div>
            </div>
            <div 
              style={{ position: 'relative' }}
              onMouseEnter={() => setShowDropdown(true)}
              onMouseLeave={() => setShowDropdown(false)}
            >
              <button style={logoutButtonStyles}>
                <span>👤</span>
                <span>Account</span>
                <span style={{ fontSize: '10px' }}>▼</span>
              </button>
              {showDropdown && (
                <div style={dropdownStyles}>
                  <button 
                    onClick={() => router.push('/profile')} 
                    style={dropdownItemStyles}
                    onMouseEnter={(e) => e.currentTarget.style.background = '#f3f4f6'}
                    onMouseLeave={(e) => e.currentTarget.style.background = 'transparent'}
                  >
                    <span>👤</span>
                    <span>Profile</span>
                  </button>
                  <div style={dropdownDividerStyles} />
                  <button 
                    onClick={logout} 
                    style={dropdownItemStyles}
                    onMouseEnter={(e) => e.currentTarget.style.background = '#fee2e2'}
                    onMouseLeave={(e) => e.currentTarget.style.background = 'transparent'}
                  >
                    <span>🚪</span>
                    <span>Logout</span>
                  </button>
                </div>
              )}
            </div>
          </>
        )}
      </div>
    </nav>
  );
}
