import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import '../../styles/LoginForm.css';

interface LoginFormProps {
  onToggle: () => void;
}

const LoginForm: React.FC<LoginFormProps> = ({ onToggle }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const { login } = useAuth();
  
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(false);
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    // Check for success message from registration
    if (location.state?.message) {
      setSuccessMessage(location.state.message);
    }
  }, [location]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      await login(email, password);
      
      // Store remember me preference
      if (rememberMe) {
        localStorage.setItem('rememberMe', 'true');
      } else {
        localStorage.removeItem('rememberMe');
      }
      
      // Redirect based on user role
      const user = JSON.parse(localStorage.getItem('user') || '{}');
      if (user.role === 'admin') {
        navigate('/admin/dashboard');
      } else if (user.role === 'kitchen') {
        navigate('/kitchen/orders');
      } else {
        navigate('/customer/menu');
      }
    } catch (err: unknown) {
      console.error('Login error:', err);
      const errorMessage = err instanceof Error && 'response' in err 
        ? (err as { response?: { data?: { message?: string } } }).response?.data?.message 
        : 'Failed to login. Please check your credentials.';
      setError(errorMessage || 'Failed to login. Please check your credentials.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form className="login-form" onSubmit={handleSubmit}>
      <div className="form-title">
        <h3>Sign In</h3>
        <p>Enter your credentials to access your account</p>
      </div>

      {successMessage && (
        <div style={{ 
          padding: '12px', 
          background: 'rgba(16, 185, 129, 0.1)', 
          border: '1px solid #10b981',
          borderRadius: '8px',
          color: '#10b981',
          marginBottom: '16px',
          textAlign: 'center'
        }}>
          {successMessage}
        </div>
      )}

      {error && (
        <div className="form-error" style={{ 
          padding: '12px', 
          background: 'rgba(239, 68, 68, 0.1)', 
          border: '1px solid #ef4444',
          borderRadius: '8px',
          color: '#ef4444',
          marginBottom: '16px',
          textAlign: 'center'
        }}>
          {error}
        </div>
      )}

      <div className="form-group">
        <input 
          type="email" 
          id="login-email" 
          required 
          placeholder=" " 
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          disabled={isLoading}
        />
        <label htmlFor="login-email">Email Address</label>
      </div>

      <div className="form-group">
        <input 
          type="password" 
          id="login-password" 
          required 
          placeholder=" " 
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          disabled={isLoading}
        />
        <label htmlFor="login-password">Password</label>
      </div>

      <div className="remember-forgot">
        <label>
          <input 
            type="checkbox" 
            checked={rememberMe}
            onChange={(e) => setRememberMe(e.target.checked)}
            disabled={isLoading}
          />
          Remember me
        </label>
        <a href="/forgot-password">Forgot Password?</a>
      </div>

      <button type="submit" className="gradient-btn" disabled={isLoading}>
        {isLoading ? 'Signing In...' : 'Sign In'}
      </button>

      <div className="auth-link-row">
        <span>Don&apos;t have an account?</span>
        <button type="button" className="auth-link" onClick={onToggle} disabled={isLoading}>
          Create Account
        </button>
      </div>
    </form>
  );
};

export default LoginForm;
