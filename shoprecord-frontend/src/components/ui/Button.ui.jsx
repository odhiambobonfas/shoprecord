export default function Button({ 
  children, 
  onClick, 
  type = 'button', 
  variant = 'primary',
  disabled = false,
  fullWidth = false,
  className = '',
  size = 'medium',
  style = {},
}) {
  const sizeStyles = {
    small: {
      padding: '6px 12px',
      fontSize: '13px',
    },
    medium: {
      padding: '10px 20px',
      fontSize: '14px',
    },
    large: {
      padding: '14px 28px',
      fontSize: '16px',
    },
  };

  const baseStyles = {
    ...sizeStyles[size],
    borderRadius: '8px',
    border: 'none',
    fontWeight: '600',
    cursor: disabled ? 'not-allowed' : 'pointer',
    opacity: disabled ? 0.5 : 1,
    transition: 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)',
    width: fullWidth ? '100%' : 'auto',
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '8px',
    boxShadow: '0 1px 2px rgba(0, 0, 0, 0.05)',
    position: 'relative',
    overflow: 'hidden',
  };

  const variants = {
    primary: {
      background: 'linear-gradient(135deg, #3b82f6 0%, #2563eb 100%)',
      color: '#fff',
      border: 'none',
    },
    secondary: {
      background: 'linear-gradient(135deg, #8b5cf6 0%, #7c3aed 100%)',
      color: '#fff',
      border: 'none',
    },
    danger: {
      background: 'linear-gradient(135deg, #ef4444 0%, #dc2626 100%)',
      color: '#fff',
      border: 'none',
    },
    success: {
      background: 'linear-gradient(135deg, #22c55e 0%, #16a34a 100%)',
      color: '#fff',
      border: 'none',
    },
    warning: {
      background: 'linear-gradient(135deg, #f59e0b 0%, #d97706 100%)',
      color: '#fff',
      border: 'none',
    },
    outline: {
      backgroundColor: '#fff',
      color: '#2563eb',
      border: '2px solid #2563eb',
      boxShadow: 'none',
    },
    ghost: {
      backgroundColor: 'transparent',
      color: '#6b7280',
      border: 'none',
      boxShadow: 'none',
    },
  };

  const combinedStyles = {
    ...baseStyles,
    ...variants[variant],
    ...style,
  };

  const handleMouseEnter = (e) => {
    if (!disabled) {
      if (variant === 'outline') {
        e.currentTarget.style.backgroundColor = '#eff6ff';
      } else if (variant === 'ghost') {
        e.currentTarget.style.backgroundColor = '#f3f4f6';
      } else {
        e.currentTarget.style.transform = 'translateY(-1px)';
        e.currentTarget.style.boxShadow = '0 4px 12px rgba(0, 0, 0, 0.15)';
      }
    }
  };

  const handleMouseLeave = (e) => {
    if (!disabled) {
      if (variant === 'outline') {
        e.currentTarget.style.backgroundColor = '#fff';
      } else if (variant === 'ghost') {
        e.currentTarget.style.backgroundColor = 'transparent';
      } else {
        e.currentTarget.style.transform = 'translateY(0)';
        e.currentTarget.style.boxShadow = '0 1px 2px rgba(0, 0, 0, 0.05)';
      }
    }
  };

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      style={combinedStyles}
      className={className}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      {children}
    </button>
  );
}
