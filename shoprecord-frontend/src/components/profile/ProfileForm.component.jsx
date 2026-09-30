'use client';

import { useState, useRef } from 'react';
import { getProfilePictureUrl, getUserInitials } from '../../utils/helpers.utils';
import Input from '../ui/Input.ui';
import Button from '../ui/Button.ui';

export default function ProfileForm({ user, onSubmit, loading }) {
  const [formData, setFormData] = useState({
    name: user.name || '',
    email: user.email || '',
    phone: user.phone || '',
    address: user.address || '',
    bio: user.bio || '',
    profilePicture: user.profilePicture || '',
  });
  const [previewImage, setPreviewImage] = useState(
    user.profilePicture ? getProfilePictureUrl(user.profilePicture) : ''
  );
  const [imageFile, setImageFile] = useState(null);
  const fileInputRef = useRef(null);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleImageClick = () => {
    fileInputRef.current.click();
  };

  const handleImageChange = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      // Validate file type
      if (!file.type.startsWith('image/')) {
        alert('Please select a valid image file');
        return;
      }
      
      // Validate file size (max 2MB)
      if (file.size > 2 * 1024 * 1024) {
        alert('Image size should be less than 2MB');
        return;
      }

      setImageFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewImage(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    const updatedData = { ...formData };
    if (imageFile) {
      updatedData.profilePictureFile = imageFile;
    }
    
    onSubmit(updatedData);
  };

  const initials = getUserInitials(user.name || user.email);

  const profileSectionStyles = {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    marginBottom: '32px',
    paddingBottom: '32px',
    borderBottom: '2px solid #f1f5f9',
  };

  const avatarContainerStyles = {
    position: 'relative',
    marginBottom: '16px',
  };

  const avatarStyles = {
    width: '120px',
    height: '120px',
    borderRadius: '50%',
    background: previewImage ? 'transparent' : 'linear-gradient(135deg, #3b82f6 0%, #8b5cf6 100%)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: '40px',
    fontWeight: '700',
    color: '#fff',
    cursor: 'pointer',
    border: '4px solid #fff',
    boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
    overflow: 'hidden',
    transition: 'transform 0.2s',
  };

  const avatarImageStyles = {
    width: '100%',
    height: '100%',
    objectFit: 'cover',
  };

  const uploadButtonStyles = {
    position: 'absolute',
    bottom: 0,
    right: 0,
    backgroundColor: '#3b82f6',
    color: '#fff',
    border: 'none',
    borderRadius: '50%',
    width: '36px',
    height: '36px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    cursor: 'pointer',
    boxShadow: '0 2px 8px rgba(59, 130, 246, 0.4)',
    fontSize: '18px',
  };

  const formGridStyles = {
    display: 'grid',
    gridTemplateColumns: 'repeat(2, 1fr)',
    gap: '20px',
    marginBottom: '24px',
  };

  const fullWidthStyles = {
    gridColumn: '1 / -1',
  };

  const textareaStyles = {
    width: '100%',
    padding: '12px',
    fontSize: '14px',
    border: '1px solid #e5e7eb',
    borderRadius: '8px',
    fontFamily: 'inherit',
    resize: 'vertical',
    minHeight: '100px',
  };

  const labelStyles = {
    display: 'block',
    fontSize: '13px',
    fontWeight: '600',
    color: '#374151',
    marginBottom: '8px',
  };

  return (
    <form onSubmit={handleSubmit}>
      <div style={profileSectionStyles}>
        <div style={avatarContainerStyles}>
          <div 
            style={avatarStyles}
            onClick={handleImageClick}
            onMouseEnter={(e) => e.currentTarget.style.transform = 'scale(1.05)'}
            onMouseLeave={(e) => e.currentTarget.style.transform = 'scale(1)'}
          >
            {previewImage ? (
              <img src={previewImage} alt="Profile" style={avatarImageStyles} />
            ) : (
              initials
            )}
          </div>
          <button
            type="button"
            style={uploadButtonStyles}
            onClick={handleImageClick}
            title="Upload photo"
          >
            📷
          </button>
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            onChange={handleImageChange}
            style={{ display: 'none' }}
          />
        </div>
        <p style={{ fontSize: '12px', color: '#6b7280', textAlign: 'center' }}>
          Click on the avatar to upload a profile picture
        </p>
      </div>

      <div style={formGridStyles}>
        <div>
          <Input
            label="Full Name"
            name="name"
            value={formData.name}
            onChange={handleChange}
            placeholder="Enter your full name"
            required
          />
        </div>
        <div>
          <Input
            label="Email"
            name="email"
            type="email"
            value={formData.email}
            onChange={handleChange}
            placeholder="your.email@example.com"
            disabled
          />
        </div>
        <div>
          <Input
            label="Phone Number"
            name="phone"
            value={formData.phone}
            onChange={handleChange}
            placeholder="+254 700 000 000"
          />
        </div>
        <div>
          <Input
            label="Address"
            name="address"
            value={formData.address}
            onChange={handleChange}
            placeholder="City, Country"
          />
        </div>
        <div style={fullWidthStyles}>
          <label style={labelStyles}>Bio</label>
          <textarea
            name="bio"
            value={formData.bio}
            onChange={handleChange}
            placeholder="Tell us about yourself..."
            maxLength={200}
            style={textareaStyles}
          />
          <p style={{ fontSize: '11px', color: '#9ca3af', marginTop: '4px', textAlign: 'right' }}>
            {formData.bio.length}/200 characters
          </p>
        </div>
      </div>

      <Button type="submit" disabled={loading} fullWidth>
        {loading ? 'Updating...' : 'Update Profile'}
      </Button>
    </form>
  );
}
