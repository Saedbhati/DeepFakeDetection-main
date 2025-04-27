import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';


const HomeHeader = () => {
  const [showUserDetails, setShowUserDetails] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [currentUser] = useState({
    name: 'user1',
    email: 'user1@example.com',
    avatar: '/profile-icon.svg'
  });

  const toggleUserDetails = () => {
    setShowUserDetails(!showUserDetails);
  };

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth > 768) {
        setIsMobileMenuOpen(false);
      }
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return (
    <header className="sticky-header">
      <nav className="navbar">
        <div className="nav-left">
          <Link to="/" className="logo">
            <img src="/Moon.svg" alt="Moon" className="moon-icon" />
            DeepSheild
          </Link>
        </div>
        <div className={`nav-menu ${isMobileMenuOpen ? 'active' : ''}`}>
          <Link to="/" className="nav-link">Home</Link>
          <Link to="/detect" className="nav-link">Detect</Link>
          <Link to="/features" className="nav-link">Features</Link>
        </div>
        <div className="nav-right">
          <Link to="/login" className="login-button">Login</Link>
          <div className="profile-icon" onClick={toggleUserDetails}>
            <span className="user-icon">👤</span>
          </div>
        </div>
      </nav>
      {showUserDetails && (
        <div className="user-details">
          <img src={currentUser.avatar} alt="User Avatar" className="user-avatar" />
          <p className="user-name">{currentUser.name}</p>
          <p className="user-email">{currentUser.email}</p>
        </div>
      )}
    </header>
  );
};

export default HomeHeader;