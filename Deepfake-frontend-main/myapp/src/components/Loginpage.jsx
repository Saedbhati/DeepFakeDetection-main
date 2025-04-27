import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import '../Styles/Login.css';

function LoginPage() {
  const [showSignup, setShowSignup] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const toggleForm = (e) => {
    e.preventDefault();
    setShowSignup(!showSignup);
  };

  return (
    <section className="container">
      <div className="bg-icon"></div>
      <nav className="login-nav">
        <div className="nav-left">
          <Link to="/" className="logo">
            <img src="/Moon.svg" alt="Moon" className="moon-icon" />
            DeepSheild
          </Link>
        </div>
        <div className="brain-icon">
          <img src="/Brain.svg" alt="Brain Icon" />
        </div>
      </nav>

      <div className="back-button">
        <Link to="/">←Back</Link>
      </div>

      <div className="login-card">
        <div className="user-icon">
          <img src="/profile-icon.svg" alt="User Icon" />
        </div>
        <div className={`form ${showSignup ? 'signup show' : 'login'}`}>
          <div className="form-content">
            <header>{showSignup ? 'Signup' : 'Login'}</header>
            <form action="#">
              <div className="field input-field">
                <input type="email" placeholder="Email" className="input" />
              </div>

              <div className="field input-field">
                <input
                  type={showPassword ? "text" : "password"}
                  placeholder={showSignup ? "Create password" : "Password"}
                  className="password"
                />
                <button
                  type="button"
                  className="eye-icon"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? 'Hide' : 'Show'}
                </button>
              </div>

              {showSignup && (
                <div className="field input-field">
                  <input
                    type={showConfirmPassword ? "text" : "password"}
                    placeholder="Confirm password"
                    className="password"
                  />
                  <button
                    type="button"
                    className="eye-icon"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  >
                    {showConfirmPassword ? 'Hide' : 'Show'}
                  </button>
                </div>
              )}

              {!showSignup && (
                <div className="form-link">
                  <a href="#" className="forgot-pass">Forgot password?</a>
                </div>
              )}

              <div className="field button-field">
                <button type="submit">{showSignup ? 'Signup' : 'Login'}</button>
              </div>
            </form>
            <div className="form-link">
              <span>
                {showSignup ? 'Already have an account? ' : "Don't have an account? "}
                <a href="#" className="link" onClick={toggleForm}>
                  {showSignup ? 'Login' : 'Signup'}
                </a>
              </span>
            </div>

            <div className="line"></div>

            <div className="media-options">
              <a href="#" className="field facebook">
                <img src="/social/facebook.svg" alt="Facebook" className="facebook-icon" />
                <span>Login with Facebook</span>
              </a>
            </div>
            <div className="media-options">
              <a href="#" className="field google">
                <img src="/google.svg" alt="Google" className="google-img" />
                <span>Login with Google</span>
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default LoginPage;

