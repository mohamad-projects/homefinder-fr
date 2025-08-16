import React, { useContext, useState } from 'react';
import {
  FaHome,
  FaSearch,
  FaUser,
  FaPlus,
  FaSignOutAlt,
  FaSignInAlt,
  FaGlobe,
  FaCog,
} from 'react-icons/fa';
import { HiOutlineOfficeBuilding } from 'react-icons/hi';
import { Link, useNavigate } from 'react-router-dom';
import './Navbar.scss';
import { DarkModeContext } from '../../context/DarkModeContext';
import { useDispatch } from 'react-redux';
import { logout } from '../../features/auth/authSlice';
import useAuth from './../../hooks/useAuth';
import VoiceSearch from '../VoiceSearch/VoiceSearch';
import api from '../../services/api';

const Navbar = () => {
  const { translateMode, toggleLanguage } = useContext(DarkModeContext);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { user } = useAuth();
  const [showSettings, setShowSettings] = useState(false);

  const t = {
    profile: translateMode ? 'Profile' : 'الملف الشخصي',
    home: translateMode ? 'Home' : 'الرئيسية',
    offices: translateMode ? 'Offices' : 'مكاتب',
    contact: translateMode ? 'Contact' : 'اتصل بنا',
    services: translateMode ? 'Services' : 'الخدمات',
    mostWatch: translateMode ? 'Most Watched' : 'الأكثر مشاهدة',
    mostSearch: translateMode ? 'Most Searched' : 'الأكثر بحثاً',
    addProperty: translateMode ? 'Add Property' : 'إضافة عقار',
    logout: translateMode ? 'Logout' : 'تسجيل الخروج',
    login: translateMode ? 'Login' : 'تسجيل الدخول',
    language: translateMode ? 'العربية' : 'English',
    searchFailed: translateMode ? 'Voice search failed.' : 'فشل البحث الصوتي.',
    settings: translateMode ? 'Settings' : 'الإعدادات',
  };

  const handleAddPropertyClick = () => {
    navigate('/addhome');
  };

  const handleLogout = () => {
    dispatch(logout());
    navigate('/');
    setShowSettings(false);
  };

  const handleVoiceSearch = async (query) => {
    try {
      const response = await api.get(`/search/voiceSearch?query=${encodeURIComponent(query)}`);
      navigate(`/search-results?query=${encodeURIComponent(query)}`);
    } catch (err) {
      console.error('Voice search failed:', err);
      alert(t.searchFailed);
    }
  };

  const handleSettingsToggle = () => {
    setShowSettings(!showSettings);
  };

  const handleMenuAction = (actionFn) => {
    actionFn();
    setShowSettings(false);
  };

  return (
    <nav className="navbar">
      <div className="navbar-container">
        <Link to="/" className="navbar-brand">
          <FaHome className="brand-icon" />
          <span className="brand-text">
            Home<FaSearch className="search-icon" />Finder
          </span>
        </Link>

        {/* Links section - now horizontally scrollable on small screens */}
        <div className="navbar-links">
          {user && (
            <Link to={`profile/${user.id}`} className="nav-link">
              <FaUser className="nav-icon" /> {t.profile}
            </Link>
          )}
          <Link to="/" className="nav-link">{t.home}</Link>
          <Link to="/officelist" className="nav-link">
            <HiOutlineOfficeBuilding className="nav-icon" /> {t.offices}
          </Link>
          <Link to="/services" className="nav-link">{t.services}</Link>
          <Link to="/contact" className="nav-link">{t.contact}</Link>
          <Link to="/MostWatch" className="nav-link hot-link">{t.mostWatch}</Link>
          <Link to="/MostSearch" className="nav-link hot-link">{t.mostSearch}</Link>
          <div className="nav-voice-search">
            <VoiceSearch onSearch={handleVoiceSearch} />
          </div>
        </div>

        <div className="navbar-actions">
          {user && (
            <button
              className="action-button add-property-button"
              onClick={handleAddPropertyClick}
              aria-label={t.addProperty}
            >
              <FaPlus className="button-icon" />
              <span>{t.addProperty}</span>
            </button>
          )}

          {/* Settings Dropdown */}
          <div className="settings-dropdown">
            <button
              className="action-button settings-button"
              onClick={handleSettingsToggle}
              aria-label={t.settings}
            >
              <FaCog className="button-icon" />
            </button>

            {showSettings && (
              <div className="dropdown-menu">
                <button
                  className="dropdown-item"
                  onClick={() => handleMenuAction(toggleLanguage)}
                >
                  <FaGlobe className="button-icon" /> {t.language}
                </button>
                <button
                  className="dropdown-item"
                  onClick={() =>
                    handleMenuAction(() => {
                      user ? dispatch(logout()) && navigate('/') : navigate('/login');
                    })
                  }
                >
                  {user ? (
                    <>
                      <FaSignOutAlt className="button-icon" /> {t.logout}
                    </>
                  ) : (
                    <>
                      <FaSignInAlt className="button-icon" /> {t.login}
                    </>
                  )}
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;