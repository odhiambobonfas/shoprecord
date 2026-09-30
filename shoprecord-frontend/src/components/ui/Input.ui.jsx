export default function Input({
  label,
  type = 'text',
  name,
  value,
  onChange,
  onBlur,
  placeholder,
  required = false,
  error,
  disabled = false,
  className = '',
  icon,
  style = {},
}) {
  const inputStyles = {
    width: '100%',
    padding: icon ? '12px 12px 12px 42px' : '12px 14px',
    fontSize: '14px',
    border: `2px solid ${error ? '#ef4444' : '#e5e7eb'}`,
    borderRadius: '8px',
    outline: 'none',
    transition: 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)',
    backgroundColor: disabled ? '#f9fafb' : '#fff',
    fontWeight: '500',
    color: '#1f2937',
    ...style,
  };

  const labelStyles = {
    display: 'block',
    marginBottom: '8px',
    fontSize: '14px',
    fontWeight: '600',
    color: '#374151',
    letterSpacing: '0.01em',
  };

  const errorStyles = {
    marginTop: '6px',
    fontSize: '12px',
    color: '#ef4444',
    fontWeight: '500',
    display: 'flex',
    alignItems: 'center',
    gap: '4px',
  };

  const containerStyles = {
    marginBottom: '16px',
    position: 'relative',
  };

  const iconContainerStyles = {
    position: 'absolute',
    left: '12px',
    top: label ? '38px' : '12px',
    color: '#9ca3af',
    fontSize: '18px',
    pointerEvents: 'none',
  };

  return (
    <div style={containerStyles} className={className}>
      {label && (
        <label htmlFor={name} style={labelStyles}>
          {label}
          {required && <span style={{ color: '#ef4444', marginLeft: '2px' }}> *</span>}
        </label>
      )}
      {icon && <div style={iconContainerStyles}>{icon}</div>}
      <input
        id={name}
        name={name}
        type={type}
        value={value}
        onChange={onChange}
        onBlur={onBlur}
        placeholder={placeholder}
        required={required}
        disabled={disabled}
        style={inputStyles}
        onFocus={(e) => {
          e.target.style.borderColor = error ? '#ef4444' : '#3b82f6';
          e.target.style.boxShadow = error 
            ? '0 0 0 3px rgba(239, 68, 68, 0.1)' 
            : '0 0 0 3px rgba(59, 130, 246, 0.1)';
        }}
        onBlur={(e) => {
          e.target.style.borderColor = error ? '#ef4444' : '#e5e7eb';
          e.target.style.boxShadow = 'none';
          if (onBlur) onBlur(e);
        }}
      />
      {error && (
        <div style={errorStyles}>
          <span>⚠️</span>
          <span>{error}</span>
        </div>
      )}
    </div>
  );
}
