import React, { useState } from 'react';
import '../styles/Navbar.css';
import { useNavigate } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faListCheck } from '@fortawesome/free-solid-svg-icons';
// naavbar component for the application handling navigation and user profile management
const Navbar = ({ isTaskPage = false }) => {
  const [showNotifications, setShowNotifications] = useState(false);
  const [showProfile, setShowProfile] = useState(false);
  const navigate = useNavigate();

  // Get user info from localStorage (set this on login/register)
  const user = JSON.parse(localStorage.getItem('user')) || { name: 'User', email: 'user@email.com' };

  // Logout handler
  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    navigate('/login');
  };

  // Close dropdowns when clicking outside
  React.useEffect(() => {
    const handleClickOutside = (event) => {
      if (!event.target.closest('.notification-container')) {
        setShowNotifications(false);
      }
      if (!event.target.closest('.profile-container')) {
        setShowProfile(false);
      }
    };
    document.addEventListener('click', handleClickOutside);
    return () => document.removeEventListener('click', handleClickOutside);
  }, []);

  return (
    <nav className="navbar">
      <div className="navbar-left">
        <div className="logo">
          <FontAwesomeIcon icon={faListCheck} size="lg" />
        </div>
        <h1 className="brand-name">Listify</h1>
      </div>
      <div className="navbar-links">
        {!isTaskPage ? (
          <>
            <a href="#" className="nav-link">About us</a>
            <a href="#" className="nav-link">Contacts</a>
          </>
        ) : (
          <>
            <div className="notification-container">
              <button
                className="nav-button notification-btn"
                onClick={() => setShowNotifications(!showNotifications)}
              >
                🔔
                <span className="notification-badge">3</span>
              </button>
              {showNotifications && (
                <div className="notification-dropdown">
                  <div className="notification-header">Notifications</div>
                  <div className="notification-item">New task assigned to you</div>
                  <div className="notification-item">Deadline reminder: Project due tomorrow</div>
                  <div className="notification-item">Team meeting in 30 minutes</div>
                </div>
              )}
            </div>
            <div className="profile-container">
              <button
                className="nav-button profile-btn"
                onClick={() => setShowProfile(!showProfile)}
              >
                👤 Profile
              </button>
              {showProfile && (
                <div className="profile-dropdown">
                  <div className="profile-header">
                    <div className="profile-avatar">👤</div>
                    <div className="profile-info">
                      <div className="profile-name">{user.name}</div>
                      <div className="profile-email">{user.email}</div>
                    </div>
                  </div>
                  <div className="profile-menu">
                    <button className="profile-menu-item">Edit Profile</button>
                    <button className="profile-menu-item">Settings</button>
                    <button className="profile-menu-item">Help</button>
                    <button className="profile-menu-item logout-btn" onClick={handleLogout}>
                      Logout
                    </button>
                  </div>
                </div>
              )}
            </div>
          </>
        )}
      </div>
    </nav>
  );
};

export default Navbar;