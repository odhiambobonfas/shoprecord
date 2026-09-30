'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useAuth } from '../../hooks/useAuth.hook';
import Input from '../ui/Input.ui';
import Button from '../ui/Button.ui';
import Alert from '../ui/Alert.ui';

export default function LoginForm() {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
    setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const result = await login(formData.email, formData.password);
      if (!result.success) {
        setError(result.error || 'Login failed. Please try again.');
      }
    } catch (err) {
      setError('An unexpected error occurred.');
    } finally {
      setLoading(false);
    }
  };

  const formStyles = {
    maxWidth: '400px',
    margin: '0 auto',
  };

  const linkStyles = {
    color: '#2563eb',
    textDecoration: 'none',
    fontSize: '14px',
  };

  const textCenterStyles = {
    textAlign: 'center',
    marginTop: '16px',
  };

  return (
    <form onSubmit={handleSubmit} style={formStyles}>
      {error && <Alert type="error" message={error} onClose={() => setError('')} />}
      
      <Input
        label="Email"
        type="email"
        name="email"
        value={formData.email}
        onChange={handleChange}
        placeholder="Enter your email"
        required
      />

      <Input
        label="Password"
        type="password"
        name="password"
        value={formData.password}
        onChange={handleChange}
        placeholder="Enter your password"
        required
      />

      <Button
        type="submit"
        fullWidth
        disabled={loading}
      >
        {loading ? 'Logging in...' : 'Login'}
      </Button>

      <div style={textCenterStyles}>
        Don't have an account?{' '}
        <Link href="/auth/register" style={linkStyles}>
          Register here
        </Link>
      </div>
    </form>
  );
}
