const NotApprovedEmptyMessage = () => {
  return (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      textAlign: 'center',
      padding: '2rem',
      backgroundColor: '#fff8f8',
      borderRadius: '8px',
      boxShadow: '0 2px 10px rgba(0, 0, 0, 0.1)',
      maxWidth: '500px',
      margin: '2rem auto',
      borderLeft: '4px solid #ff6b6b'
    }}>
      <div style={{ fontSize: '3rem', color: '#ff6b6b', marginBottom: '1rem' }}>⏳</div>
      <h2 style={{ color: '#ff6b6b', marginBottom: '1rem', fontSize: '1.5rem' }}>
        Approval Pending
      </h2>
      <p style={{ color: '#555', lineHeight: '1.6', marginBottom: '1.5rem' }}>
        You are not approved yet by the chief editor. We apologize for the inconvenience 
        and appreciate your patience. Our team will review your account shortly.
      </p>
    </div>
  );
};

export default NotApprovedEmptyMessage;