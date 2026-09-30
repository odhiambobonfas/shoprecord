'use client';

export default function Card({ 
  children, 
  title, 
  className = '',
  padding = '24px',
  hover = false,
  style = {},
}) {
  const cardStyles = {
    backgroundColor: '#fff',
    borderRadius: '12px',
    boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)',
    padding: padding,
    marginBottom: '20px',
    border: '1px solid rgba(226, 232, 240, 0.8)',
    transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
    ...style,
  };

  const titleStyles = {
    fontSize: '16px',
    fontWeight: '700',
    marginBottom: '20px',
    color: '#111827',
    paddingBottom: '12px',
    borderBottom: '2px solid #f1f5f9',
  };

  const handleMouseEnter = (e) => {
    if (hover) {
      e.currentTarget.style.transform = 'translateY(-4px)';
      e.currentTarget.style.boxShadow = '0 12px 24px rgba(0, 0, 0, 0.12)';
    }
  };

  const handleMouseLeave = (e) => {
    if (hover) {
      e.currentTarget.style.transform = 'translateY(0)';
      e.currentTarget.style.boxShadow = '0 1px 3px rgba(0, 0, 0, 0.1)';
    }
  };

  return (
    <div
      style={cardStyles}
      className={`${className} fade-in`}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      {title && <h3 style={titleStyles}>{title}</h3>}
      {children}
    </div>
  );
}
