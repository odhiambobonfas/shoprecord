export default function Loading({ message = 'Loading...', fullScreen = false }) {
  const containerStyles = {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '40px',
    ...(fullScreen && {
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      backgroundColor: 'rgba(255, 255, 255, 0.9)',
      zIndex: 9999,
    }),
  };

  const spinnerStyles = {
    width: '40px',
    height: '40px',
    border: '4px solid #e5e7eb',
    borderTop: '4px solid #2563eb',
    borderRadius: '50%',
    animation: 'spin 1s linear infinite',
  };

  const textStyles = {
    marginTop: '16px',
    color: '#6b7280',
    fontSize: '14px',
  };

  return (
    <>
      <style>
        {`
          @keyframes spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
          }
        `}
      </style>
      <div style={containerStyles}>
        <div style={spinnerStyles}></div>
        <p style={textStyles}>{message}</p>
      </div>
    </>
  );
}
