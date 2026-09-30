export default function Alert({ type = 'info', message, onClose }) {
  const types = {
    success: {
      backgroundColor: '#d1fae5',
      borderColor: '#10b981',
      color: '#065f46',
    },
    error: {
      backgroundColor: '#fee2e2',
      borderColor: '#dc2626',
      color: '#991b1b',
    },
    warning: {
      backgroundColor: '#fef3c7',
      borderColor: '#f59e0b',
      color: '#92400e',
    },
    info: {
      backgroundColor: '#dbeafe',
      borderColor: '#3b82f6',
      color: '#1e40af',
    },
  };

  const alertStyles = {
    padding: '12px 16px',
    borderRadius: '6px',
    border: `1px solid ${types[type].borderColor}`,
    backgroundColor: types[type].backgroundColor,
    color: types[type].color,
    marginBottom: '16px',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    fontSize: '14px',
  };

  const closeButtonStyles = {
    background: 'none',
    border: 'none',
    fontSize: '20px',
    cursor: 'pointer',
    color: 'inherit',
    padding: '0',
    marginLeft: '12px',
  };

  if (!message) return null;

  return (
    <div style={alertStyles}>
      <span>{message}</span>
      {onClose && (
        <button onClick={onClose} style={closeButtonStyles}>
          ×
        </button>
      )}
    </div>
  );
}
