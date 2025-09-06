import React from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useTranslation } from '../hooks/useTranslation';
import LanguageSwitcher from './LanguageSwitcher';

const Header = () => {
  const navigate = useNavigate();
  const { t } = useTranslation();

  const handleLogout = () => {
    // Clear the token from local storage to log the user out
    localStorage.removeItem('token');
    // Navigate the user back to the login page
    navigate('/');
  };

  return (
    <header className="navbar navbar-expand-lg navbar-light bg-white shadow-sm">
      <div className="container">
        {/* Link to the main dashboard */}
        <Link className="navbar-brand fw-bold" to="/dashboard">
          FarmVerse {t('dashboard')}
        </Link>
        
        {/* Navigation items */}
        <div className="d-flex align-items-center">
          <ul className="navbar-nav me-auto mb-2 mb-lg-0">
            <li className="nav-item">
              {/* Link to the new Leaderboard page */}
              <Link className="nav-link" to="/leaderboard">{t('leaderboard')}</Link>
            </li>
            <li className="nav-item">
              {/* Link to Rewards page */}
              <Link className="nav-link" to="/rewards">{t('rewards')}</Link>
            </li>
            <li className="nav-item">
              {/* Link to My Coupons page */}
              <Link className="nav-link" to="/my-coupons">{t('myCoupons')}</Link>
            </li>
            <li className="nav-item">
              {/* Link to Forum page */}
              <Link className="nav-link" to="/forum">{t('forum')}</Link>
            </li>
          </ul>
          
          {/* Language Switcher */}
          <LanguageSwitcher />
          
          {/* Logout button */}
          <button className="btn btn-outline-danger ms-3" onClick={handleLogout}>
            {t('logout')}
          </button>
        </div>
      </div>
    </header>
  );
};

export default Header;

