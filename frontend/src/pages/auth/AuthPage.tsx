import React from "react";
import { useNavigate, useLocation } from "react-router-dom";
import LoginForm from "./LoginForm";
import RegisterForm from "./RegisterForm";
import "../../styles/AuthPage.css";

interface AuthPageProps {
  mode?: "login" | "register";
}

const AuthPage: React.FC<AuthPageProps> = ({ mode }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const isLogin = mode === "login" || (!mode && location.pathname.endsWith("/login"));

  return (
    <div className="auth-page-center">
      <div className="auth-container">
        <div className="auth-container-header">
          <h2>{isLogin ? "Welcome Back!" : "Create Account"}</h2>
        </div>
        <div className="auth-forms-wrapper">
          {isLogin ? (
            <div className="auth-form-panel active fade-in">
              <LoginForm onToggle={() => navigate("/auth/register")} />
            </div>
          ) : (
            <div className="auth-form-panel active fade-in">
              <RegisterForm onToggle={() => navigate("/auth/login")} />
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AuthPage;
