import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import '../../styles/RegisterForm.css';

interface RegisterFormProps {
  onToggle: () => void;
}

const RegisterForm: React.FC<RegisterFormProps> = ({ onToggle }) => {
  const navigate = useNavigate();
  const { register } = useAuth();
  
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: ''
  });
  const [agreeTerms, setAgreeTerms] = useState(false);
  const [passwordStrength, setPasswordStrength] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { id, value } = e.target;
    const field = id.replace('register-', '');
    setFormData(prev => ({ ...prev, [field]: value }));

    // Check password strength
    if (field === 'password') {
      if (value.length < 6) {
        setPasswordStrength('weak');
      } else if (value.length < 10) {
        setPasswordStrength('fair');
      } else {
        setPasswordStrength('strong');
      }
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    // Validation
    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    if (formData.password.length < 6) {
      setError('Password must be at least 6 characters long');
      return;
    }

    if (!agreeTerms) {
      setError('Please agree to the terms and conditions');
      return;
    }

    setIsLoading(true);

    try {
      await register(formData.name, formData.email, formData.password);
      
      // Redirect to login page after successful registration
      navigate('/auth/login', { state: { message: 'Registration successful! Please login to continue.' } });
    } catch (err: any) {
      console.error('Registration error:', err);
      setError(err.response?.data?.message || 'Failed to register. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form className="register-form" onSubmit={handleSubmit}>
      <div className="form-title">
        <h3>Create Account</h3>
        <p>Sign up to get started with your journey</p>
      </div>

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
          type="text" 
          id="register-name" 
          required 
          placeholder=" " 
          value={formData.name}
          onChange={handleChange}
          disabled={isLoading}
        />
        <label htmlFor="register-name">Full Name</label>
      </div>

      <div className="form-group">
        <input 
          type="email" 
          id="register-email" 
          required 
          placeholder=" " 
          value={formData.email}
          onChange={handleChange}
          disabled={isLoading}
        />
        <label htmlFor="register-email">Email Address</label>
      </div>

      <div className="form-group">
        <input 
          type="password" 
          id="register-password" 
          required 
          placeholder=" " 
          value={formData.password}
          onChange={handleChange}
          disabled={isLoading}
        />
        <label htmlFor="register-password">Password</label>
        {formData.password && (
          <div className="password-strength">
            <div className={`password-strength-bar password-${passwordStrength}`}></div>
          </div>
        )}
      </div>

      <div className="form-group">
        <input 
          type="password" 
          id="register-confirmPassword" 
          required 
          placeholder=" " 
          value={formData.confirmPassword}
          onChange={handleChange}
          disabled={isLoading}
        />
        <label htmlFor="register-confirmPassword">Confirm Password</label>
      </div>

      <div className="terms-agreement">
        <input 
          type="checkbox" 
          id="terms" 
          checked={agreeTerms}
          onChange={(e) => setAgreeTerms(e.target.checked)}
          required
          disabled={isLoading}
        />
        <label htmlFor="terms">
          I agree to the <a href="/terms">Terms of Service</a> and <a href="/privacy">Privacy Policy</a>
        </label>
      </div>

      <button type="submit" className="gradient-btn" disabled={!agreeTerms || isLoading}>
        {isLoading ? 'Creating Account...' : 'Create Account'}
      </button>

      <div className="auth-link-row">
        <span>Already have an account?</span>
        <button type="button" className="auth-link" onClick={onToggle} disabled={isLoading}>
          Sign In
        </button>
      </div>
    </form>
  );
};

export default RegisterForm;
