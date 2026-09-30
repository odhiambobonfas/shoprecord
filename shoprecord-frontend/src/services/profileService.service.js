import { api } from './api.service';

// Get user profile
export const getProfile = async () => {
  const data = await api.get('/profile');
  return data;
};

// Update user profile
export const updateProfile = async (profileData) => {
  // If there's a profile picture file, use FormData
  if (profileData.profilePictureFile) {
    const formData = new FormData();
    formData.append('profilePicture', profileData.profilePictureFile);
    formData.append('name', profileData.name);
    formData.append('phone', profileData.phone || '');
    formData.append('address', profileData.address || '');
    formData.append('bio', profileData.bio || '');
    if (profileData.preferredCurrency) {
      formData.append('preferredCurrency', profileData.preferredCurrency);
    }

    const data = await api.putFormData('/profile', formData);
    return data;
  } else {
    // Regular JSON update
    const data = await api.put('/profile', profileData);
    return data;
  }
};

// Delete profile picture
export const deleteProfilePicture = async () => {
  const data = await api.delete('/profile/picture');
  return data;
};

const profileService = {
  getProfile,
  updateProfile,
  deleteProfilePicture,
};

export default profileService;
