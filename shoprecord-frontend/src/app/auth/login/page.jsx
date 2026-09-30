import LoginForm from '../../../components/auth/LoginForm.component';
import Card from '../../../components/ui/Card.ui';

export const metadata = {
  title: 'Login - ShopRecord',
};

export default function LoginPage() {
  const containerStyles = {
    minHeight: '100vh',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '20px',
  };

  const cardWrapperStyles = {
    width: '100%',
    maxWidth: '450px',
  };

  const headerStyles = {
    textAlign: 'center',
    marginBottom: '32px',
  };

  const titleStyles = {
    fontSize: '26px',
    fontWeight: '700',
    color: '#2563eb',
    marginBottom: '8px',
  };

  const subtitleStyles = {
    fontSize: '14px',
    color: '#6b7280',
  };

  return (
    <div style={containerStyles}>
      <div style={cardWrapperStyles}>
        <div style={headerStyles}>
          <h1 style={titleStyles}>ShopRecord</h1>
          <p style={subtitleStyles}>Login to manage your shop inventory</p>
        </div>
        <Card>
          <LoginForm />
        </Card>
      </div>
    </div>
  );
}
