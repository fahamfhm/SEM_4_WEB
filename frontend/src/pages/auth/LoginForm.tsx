import React from 'react';
import '../../styles/LoginForm.css';

interface LoginFormProps {
  onToggle: () => void;
}

const LoginForm: React.FC<LoginFormProps> = ({ onToggle }) => (
  <form className="login-form">
    <div className="form-group">
      <input type="email" id="login-email" required placeholder=" " />
      <label htmlFor="login-email">Email</label>
    </div>
    <div className="form-group">
      <input type="password" id="login-password" required placeholder=" " />
      <label htmlFor="login-password">Password</label>
    </div>
    <button type="submit" className="gradient-btn">Login</button>
    <div className="auth-link-row">
      <span>Don&apos;t have an account?</span>
      <button type="button" className="auth-link" onClick={onToggle}>Register</button>
    </div>
  </form>
);

export default LoginForm;
