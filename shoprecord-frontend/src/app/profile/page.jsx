'use client';

import { useState } from 'react';
import DashboardLayout from '../../components/layout/DashboardLayout.component';
import ProfileForm from '../../components/profile/ProfileForm.component';
import Card from '../../components/ui/Card.ui';
import Loading from '../../components/ui/Loading.ui';
import Alert from '../../components/ui/Alert.ui';
import { useAuth } from '../../hooks/useAuth.hook';
import profileService from '../../services/profileService.service';

export default function ProfilePage() {
  const { user, updateUser } = useAuth();
  const [loading, setLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  const handleUpdateProfile = async (profileData) => {
    try {
      setLoading(true);
      setErrorMessage('');
      const response = await profileService.updateProfile(profileData);
      updateUser(response.user);
      setSuccessMessage('Profile updated successfully!');
      setTimeout(() => setSuccessMessage(''), 3000);
    } catch (error) {
      setErrorMessage(error.message || 'Failed to update profile');
    } finally {
      setLoading(false);
    }
  };

  const headerStyles = {
    marginBottom: '24px',
  };

  const titleStyles = {
    fontSize: '22px',
    fontWeight: '700',
    color: '#111827',
    marginBottom: '8px',
  };

  const subtitleStyles = {
    fontSize: '13px',
    color: '#6b7280',
  };

  if (!user) {
    return (
      <DashboardLayout>
        <Loading message="Loading profile..." />
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div style={headerStyles}>
        <h1 style={titleStyles}>My Profile</h1>
        <p style={subtitleStyles}>Manage your account information and preferences</p>
      </div>

      {successMessage && (
        <Alert type="success" message={successMessage} onClose={() => setSuccessMessage('')} />
      )}

      {errorMessage && (
        <Alert type="error" message={errorMessage} onClose={() => setErrorMessage('')} />
      )}

      <Card>
        <ProfileForm 
          user={user} 
          onSubmit={handleUpdateProfile} 
          loading={loading}
        />
      </Card>
    </DashboardLayout>
  );
}
