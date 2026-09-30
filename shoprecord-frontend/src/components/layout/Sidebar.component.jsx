'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useAuth } from '../../hooks/useAuth.hook';

export default function Sidebar() {
  const pathname = usePathname();
  const { user } = useAuth();
  const [expandedSections, setExpandedSections] = useState({
    main: true,
    sales: true,
    inventory: true,
    reports: false,
    settings: false,
  });

  const toggleSection = (section) => {
    setExpandedSections(prev => ({
      ...prev,
      [section]: !prev[section]
    }));
  };

  const sidebarStyles = {
    width: '280px',
    background: 'linear-gradient(180deg, #f8fafc 0%, #f1f5f9 100%)',
    borderRight: '1px solid #e2e8f0',
    padding: '24px 0',
    minHeight: 'calc(100vh - 57px)',
    boxShadow: '2px 0 8px rgba(0, 0, 0, 0.05)',
    overflowY: 'auto',
    overflowX: 'hidden',
  };

  const menuItemStyles = (isActive) => ({
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
    padding: '14px 24px',
    margin: '4px 12px',
    color: isActive ? '#fff' : '#475569',
    background: isActive 
      ? 'linear-gradient(135deg, #3b82f6 0%, #2563eb 100%)' 
      : 'transparent',
    borderRadius: '12px',
    fontSize: '14px',
    fontWeight: isActive ? '700' : '600',
    transition: 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)',
    cursor: 'pointer',
    boxShadow: isActive ? '0 4px 12px rgba(59, 130, 246, 0.3)' : 'none',
    textDecoration: 'none',
  });

  const menuSectionStyles = {
    marginBottom: '16px',
  };

  const sectionHeaderStyles = (isExpanded) => ({
    padding: '12px 24px',
    fontSize: '11px',
    fontWeight: '800',
    color: '#94a3b8',
    textTransform: 'uppercase',
    letterSpacing: '0.1em',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    cursor: 'pointer',
    userSelect: 'none',
    transition: 'all 0.2s',
  });

  const chevronStyles = (isExpanded) => ({
    fontSize: '10px',
    transform: isExpanded ? 'rotate(180deg)' : 'rotate(0deg)',
    transition: 'transform 0.2s',
  });

  const iconStyles = (isActive) => ({
    fontSize: '20px',
    filter: isActive ? 'none' : 'grayscale(20%)',
  });

  const badgeStyles = {
    backgroundColor: '#ef4444',
    color: '#fff',
    fontSize: '10px',
    fontWeight: '700',
    padding: '2px 6px',
    borderRadius: '10px',
    marginLeft: 'auto',
  };

  const userInfoStyles = {
    padding: '16px 24px',
    margin: '0 12px 20px',
    background: 'linear-gradient(135deg, #3b82f6 0%, #8b5cf6 100%)',
    borderRadius: '12px',
    color: '#fff',
  };

  const userNameStyles = {
    fontSize: '14px',
    fontWeight: '700',
    marginBottom: '4px',
  };

  const userRoleStyles = {
    fontSize: '11px',
    opacity: '0.9',
  };

  const dividerStyles = {
    height: '1px',
    background: '#e2e8f0',
    margin: '16px 24px',
  };

  const menuItems = [
    { href: '/dashboard', label: 'Dashboard', icon: '📊', section: 'main' },
    { href: '/sales', label: 'Sales History', icon: '💰', section: 'sales' },
    { href: '/sales/new', label: 'New Sale (POS)', icon: '🛒', section: 'sales' },
    { href: '/products', label: 'All Products', icon: '📦', section: 'inventory' },
    { href: '/products/new', label: 'Add Product', icon: '➕', section: 'inventory' },
    { href: '/reports/sales', label: 'Sales Report', icon: '📈', section: 'reports' },
    { href: '/reports/inventory', label: 'Inventory Report', icon: '📋', section: 'reports' },
    { href: '/reports/profit', label: 'Profit Analysis', icon: '💵', section: 'reports' },
    { href: '/profile', label: 'My Profile', icon: '👤', section: 'settings' },
    { href: '/settings', label: 'Settings', icon: '⚙️', section: 'settings' },
  ];

  const sections = {
    main: { label: 'Overview', icon: '🏠' },
    sales: { label: 'Sales', icon: '💳' },
    inventory: { label: 'Inventory', icon: '📦' },
    reports: { label: 'Reports', icon: '📊' },
    settings: { label: 'Settings', icon: '⚙️' },
  };

  return (
    <aside style={sidebarStyles}>
      {/* User Info Card */}
      {user && (
        <div style={userInfoStyles}>
          <div style={userNameStyles}>{user.name || 'User'}</div>
          <div style={userRoleStyles}>Shop Owner</div>
        </div>
      )}

      {/* Menu Sections */}
      {Object.entries(sections).map(([sectionKey, sectionData]) => {
        const sectionItems = menuItems.filter(item => item.section === sectionKey);
        const isExpanded = expandedSections[sectionKey];
        
        return (
          <div key={sectionKey} style={menuSectionStyles}>
            <div 
              style={sectionHeaderStyles(isExpanded)}
              onClick={() => toggleSection(sectionKey)}
              onMouseOver={(e) => {
                e.currentTarget.style.color = '#3b82f6';
              }}
              onMouseOut={(e) => {
                e.currentTarget.style.color = '#94a3b8';
              }}
            >
              <span>
                <span style={{ marginRight: '8px' }}>{sectionData.icon}</span>
                {sectionData.label}
              </span>
              <span style={chevronStyles(isExpanded)}>▼</span>
            </div>
            
            {isExpanded && sectionItems.map((item) => {
              const isActive = pathname === item.href;
              return (
                <Link key={item.href} href={item.href} style={{ textDecoration: 'none' }}>
                  <div 
                    style={menuItemStyles(isActive)}
                    onMouseOver={(e) => {
                      if (!isActive) {
                        e.currentTarget.style.backgroundColor = '#e0f2fe';
                        e.currentTarget.style.transform = 'translateX(4px)';
                      }
                    }}
                    onMouseOut={(e) => {
                      if (!isActive) {
                        e.currentTarget.style.backgroundColor = 'transparent';
                        e.currentTarget.style.transform = 'translateX(0)';
                      }
                    }}
                  >
                    <span style={iconStyles(isActive)}>{item.icon}</span>
                    <span>{item.label}</span>
                    {item.badge && <span style={badgeStyles}>{item.badge}</span>}
                  </div>
                </Link>
              );
            })}
          </div>
        );
      })}

      <div style={dividerStyles}></div>

      {/* Quick Stats */}
      <div style={{ padding: '12px 24px' }}>
        <div style={{ fontSize: '11px', fontWeight: '800', color: '#94a3b8', marginBottom: '12px', textTransform: 'uppercase', letterSpacing: '0.1em' }}>
          Quick Stats
        </div>
        <div style={{ fontSize: '12px', color: '#64748b', lineHeight: '1.8' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '6px' }}>
            <span>Today's Sales:</span>
            <span style={{ fontWeight: '700', color: '#3b82f6' }}>--</span>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '6px' }}>
            <span>Low Stock:</span>
            <span style={{ fontWeight: '700', color: '#ef4444' }}>--</span>
          </div>
        </div>
      </div>
    </aside>
  );
}
