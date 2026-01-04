import React from 'react';
import '../../styles/RegisterForm.css';

interface RegisterFormProps {
  onToggle: () => void;
}

const RegisterForm: React.FC<RegisterFormProps> = ({ onToggle }) => (
  <form className="register-form">
    <div className="form-group">
      <input type="text" id="register-name" required placeholder=" " />
      <label htmlFor="register-name">Name</label>
    </div>
    <div className="form-group">
      <input type="email" id="register-email" required placeholder=" " />
      <label htmlFor="register-email">Email</label>
    </div>
    <div className="form-group">
      <input type="password" id="register-password" required placeholder=" " />
      <label htmlFor="register-password">Password</label>
    </div>
    <button type="submit" className="gradient-btn">Register</button>
    <div className="auth-link-row">
      <span>Already have an account?</span>
      <button type="button" className="auth-link" onClick={onToggle}>Login</button>
    </div>
  </form>
);

export default RegisterForm;
