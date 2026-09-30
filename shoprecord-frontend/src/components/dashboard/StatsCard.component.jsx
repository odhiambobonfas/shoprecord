export default function StatsCard({ title, value, icon, color = '#2563eb', trend }) {
  const cardStyles = {
    backgroundColor: '#fff',
    borderRadius: '12px',
    padding: '20px',
    boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)',
    border: '1px solid #f3f4f6',
    display: 'flex',
    flexDirection: 'column',
    gap: '12px',
    transition: 'all 0.3s ease',
    cursor: 'pointer',
    position: 'relative',
    overflow: 'hidden',
  };

  const headerStyles = {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  };

  const titleStyles = {
    fontSize: '13px',
    color: '#6b7280',
    fontWeight: '500',
    textTransform: 'uppercase',
    letterSpacing: '0.5px',
  };

  const iconContainerStyles = {
    width: '40px',
    height: '40px',
    borderRadius: '8px',
    backgroundColor: `${color}15`,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: '20px',
  };

  const valueStyles = {
    fontSize: '24px',
    fontWeight: '700',
    color: '#111827',
    lineHeight: '1',
  };

  const trendStyles = {
    fontSize: '12px',
    fontWeight: '600',
    marginTop: '8px',
  };

  const accentBarStyles = {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: '4px',
    backgroundColor: color,
    opacity: 0,
    transition: 'opacity 0.3s ease',
  };

  const handleMouseEnter = (e) => {
    e.currentTarget.style.boxShadow = '0 4px 12px rgba(0, 0, 0, 0.15)';
    e.currentTarget.style.transform = 'translateY(-2px)';
    const accentBar = e.currentTarget.querySelector('.accent-bar');
    if (accentBar) accentBar.style.opacity = '1';
  };

  const handleMouseLeave = (e) => {
    e.currentTarget.style.boxShadow = '0 1px 3px rgba(0, 0, 0, 0.1)';
    e.currentTarget.style.transform = 'translateY(0)';
    const accentBar = e.currentTarget.querySelector('.accent-bar');
    if (accentBar) accentBar.style.opacity = '0';
  };

  return (
    <div
      style={cardStyles}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      <div style={headerStyles}>
        <div style={titleStyles}>{title}</div>
        <div style={iconContainerStyles}>{icon}</div>
      </div>
      <div>
        <div style={valueStyles}>{value}</div>
        {trend && (
          <div style={{ ...trendStyles, color: trend.positive ? '#16a34a' : '#dc2626' }}>
            {trend.positive ? '↑' : '↓'} {trend.value}
          </div>
        )}
      </div>
      <div className="accent-bar" style={accentBarStyles} />
    </div>
  );
}
