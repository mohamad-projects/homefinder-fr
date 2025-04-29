import React, { useContext } from 'react';
import { FaHome, FaSearch, FaLanguage } from 'react-icons/fa';
import './Navbar.scss';
import { DarkModeContext } from '../../context/DarkModeContext';
import { useNavigate } from "react-router-dom";

const Navbar = () => {
  const { translateMode, toggleLanguage } = useContext(DarkModeContext);
  const navigate = useNavigate();

  const handleSubmit = () => {
    navigate("/login");
  };

  return (
    <nav className="navbar">
      <div className="navbar-container">
        <div className="navbar-brand">
          <FaHome className="brand-icon" />
          <span className="brand-text">H<FaSearch className="search-icon" />meFinder</span>
        </div>

        <div className="navbar-links">
          <a href="/" className="nav-link">{translateMode ? 'Home' : 'الرئيسية'}</a>
          <a href="/officelist" className="nav-link">{translateMode ? 'Offices' : 'مكاتب'}</a>
          <a href="/contact" className="nav-link">{translateMode ? 'Contact' : 'اتصل بنا'}</a>
          <a href="/about" className="nav-link">{translateMode ? 'About' : 'من نحن'}</a>
        </div>

        <div className="action-buttons">
            <button className="action-button" onClick={toggleLanguage}>
              {translateMode ? 'العربية' : 'English'}
            </button>
            <button className="action-button logout-button" onClick={handleSubmit}>
              {translateMode ? 'Login' : 'تسجيل الدخول'}
            </button>
          </div>
      </div>
    </nav>
  );
};

export default Navbar;
