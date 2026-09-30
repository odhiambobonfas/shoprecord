'use client';

import { useState } from 'react';
import DashboardLayout from '../../components/layout/DashboardLayout.component';
import Card from '../../components/ui/Card.ui';
import { useAuth } from '../../hooks/useAuth.hook';

export default function SettingsPage() {
  const { user } = useAuth();
  const [settings, setSettings] = useState({
    storeName: 'My Shop',
    currency: 'KSH',
    taxRate: 0,
    receiptFooter: 'Thank you for your business!',
    lowStockThreshold: 10,
    enableNotifications: true,
    enableEmailAlerts: false,
  });

  const [saved, setSaved] = useState(false);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setSettings(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleSave = () => {
    // TODO: Save to backend
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  const headerStyles = {
    marginBottom: '24px',
  };

  const titleStyles = {
    fontSize: '24px',
    fontWeight: '700',
    color: '#111827',
    marginBottom: '8px',
  };

  const subtitleStyles = {
    fontSize: '13px',
    color: '#6b7280',
  };

  const sectionTitleStyles = {
    fontSize: '16px',
    fontWeight: '700',
    color: '#111827',
    marginBottom: '16px',
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
  };

  const formGroupStyles = {
    marginBottom: '20px',
  };

  const labelStyles = {
    display: 'block',
    fontSize: '13px',
    fontWeight: '600',
    color: '#374151',
    marginBottom: '8px',
  };

  const inputStyles = {
    width: '100%',
    padding: '12px',
    border: '1px solid #d1d5db',
    borderRadius: '8px',
    fontSize: '14px',
    fontFamily: 'inherit',
    transition: 'border-color 0.2s',
  };

  const checkboxContainerStyles = {
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
    padding: '12px',
    background: '#f9fafb',
    borderRadius: '8px',
    marginBottom: '12px',
  };

  const checkboxStyles = {
    width: '20px',
    height: '20px',
    cursor: 'pointer',
  };

  const buttonStyles = {
    padding: '12px 24px',
    background: 'linear-gradient(135deg, #3b82f6 0%, #2563eb 100%)',
    color: '#fff',
    border: 'none',
    borderRadius: '8px',
    fontSize: '14px',
    fontWeight: '700',
    cursor: 'pointer',
    boxShadow: '0 4px 12px rgba(59, 130, 246, 0.3)',
  };

  const successStyles = {
    padding: '12px 20px',
    background: '#d1fae5',
    color: '#065f46',
    borderRadius: '8px',
    fontSize: '13px',
    fontWeight: '600',
    marginBottom: '20px',
    display: saved ? 'block' : 'none',
  };

  return (
    <DashboardLayout>
      <div style={headerStyles}>
        <h1 style={titleStyles}>⚙️ Settings</h1>
        <p style={subtitleStyles}>Manage your shop preferences</p>
      </div>

      <div style={successStyles}>
        ✅ Settings saved successfully!
      </div>

      <div style={{ display: 'grid', gap: '20px' }}>
        <Card>
          <h2 style={sectionTitleStyles}>
            <span>🏪</span> Store Information
          </h2>
          
          <div style={formGroupStyles}>
            <label style={labelStyles}>Store Name</label>
            <input
              type="text"
              name="storeName"
              value={settings.storeName}
              onChange={handleChange}
              style={inputStyles}
            />
          </div>

          <div style={formGroupStyles}>
            <label style={labelStyles}>Receipt Footer Message</label>
            <textarea
              name="receiptFooter"
              value={settings.receiptFooter}
              onChange={handleChange}
              style={{ ...inputStyles, minHeight: '80px', resize: 'vertical' }}
            />
          </div>
        </Card>

        <Card>
          <h2 style={sectionTitleStyles}>
            <span>💰</span> Financial Settings
          </h2>
          
          <div style={formGroupStyles}>
            <label style={labelStyles}>Default Tax Rate (%)</label>
            <input
              type="number"
              name="taxRate"
              value={settings.taxRate}
              onChange={handleChange}
              style={inputStyles}
              min="0"
              max="100"
              step="0.1"
            />
          </div>

          <div style={formGroupStyles}>
            <label style={labelStyles}>Default Currency</label>
            <select
              name="currency"
              value={settings.currency}
              onChange={handleChange}
              style={inputStyles}
            >
              <option value="KSH">KSH - Kenyan Shilling</option>
              <option value="USD">USD - US Dollar</option>
              <option value="EUR">EUR - Euro</option>
              <option value="GBP">GBP - British Pound</option>
            </select>
          </div>
        </Card>

        <Card>
          <h2 style={sectionTitleStyles}>
            <span>📦</span> Inventory Settings
          </h2>
          
          <div style={formGroupStyles}>
            <label style={labelStyles}>Low Stock Alert Threshold</label>
            <input
              type="number"
              name="lowStockThreshold"
              value={settings.lowStockThreshold}
              onChange={handleChange}
              style={inputStyles}
              min="1"
            />
            <p style={{ fontSize: '12px', color: '#6b7280', marginTop: '4px' }}>
              Get notified when product quantity falls below this number
            </p>
          </div>
        </Card>

        <Card>
          <h2 style={sectionTitleStyles}>
            <span>🔔</span> Notifications
          </h2>
          
          <div style={checkboxContainerStyles}>
            <input
              type="checkbox"
              name="enableNotifications"
              checked={settings.enableNotifications}
              onChange={handleChange}
              style={checkboxStyles}
              id="enableNotifications"
            />
            <label htmlFor="enableNotifications" style={{ fontSize: '14px', fontWeight: '500', cursor: 'pointer' }}>
              Enable browser notifications
            </label>
          </div>

          <div style={checkboxContainerStyles}>
            <input
              type="checkbox"
              name="enableEmailAlerts"
              checked={settings.enableEmailAlerts}
              onChange={handleChange}
              style={checkboxStyles}
              id="enableEmailAlerts"
            />
            <label htmlFor="enableEmailAlerts" style={{ fontSize: '14px', fontWeight: '500', cursor: 'pointer' }}>
              Enable email alerts for low stock
            </label>
          </div>
        </Card>

        <Card>
          <h2 style={sectionTitleStyles}>
            <span>👤</span> Account Information
          </h2>
          
          <div style={{ fontSize: '13px', color: '#6b7280', lineHeight: '2' }}>
            <div><strong>Name:</strong> {user?.name || 'N/A'}</div>
            <div><strong>Email:</strong> {user?.email || 'N/A'}</div>
            <div><strong>Account Type:</strong> Shop Owner</div>
          </div>
        </Card>

        <div style={{ display: 'flex', gap: '12px' }}>
          <button style={buttonStyles} onClick={handleSave}>
            💾 Save Settings
          </button>
          <button 
            style={{ 
              ...buttonStyles, 
              background: '#fff',
              color: '#374151',
              border: '1px solid #d1d5db',
              boxShadow: 'none'
            }}
            onClick={() => window.location.reload()}
          >
            ↺ Reset
          </button>
        </div>
      </div>
    </DashboardLayout>
  );
}
