import React, { useContext } from 'react';
import { FaHome, FaSearch, FaUser } from 'react-icons/fa';
import { HiOutlineOfficeBuilding } from 'react-icons/hi';
import { useNavigate } from 'react-router-dom';
import './Navbar2.scss';
import { DarkModeContext } from '../../context/DarkModeContext';

const Navbar2 = () => {
  const { translateMode, toggleLanguage } = useContext(DarkModeContext);
  const navigate = useNavigate();

  const handleAddPropertyClick = () => navigate('/addhome');

  return (
    <nav className="navbar">
      <div className="navbar-container">
        <div className="navbar-brand">
          <FaHome className="brand-icon" />
          <span className="brand-text">
            Home
            <FaSearch className="search-icon" />
            Finder
          </span>
        </div>

        <div className="navbar-links">
          <a href="/" className="nav-link">{translateMode ? 'Profile' : 'الملف الشخصي'}</a>
          <a href="/" className="nav-link">{translateMode ? 'Home' : 'الرئيسية'}</a>
          <a href="/officelist" className="nav-link">{translateMode ? 'Offices' : 'مكاتب'}</a>
          <a href="/contact" className="nav-link">{translateMode ? 'Contact' : 'اتصل بنا'}</a>
          <a href="/about" className="nav-link">{translateMode ? 'About' : 'من نحن'}</a>
        </div>

        <div className="navbar-actions">
          <button className="add-property-button" onClick={handleAddPropertyClick}>
            <HiOutlineOfficeBuilding size={18} />
            <span>{translateMode ? 'Add Property' : 'إضافة عقار'}</span>
          </button>

          <div className="action-buttons">
            <button className="add-property-button " onClick={toggleLanguage}>
              {translateMode ? 'العربية' : 'English'}
            </button>
            <button className="action-button logout-button">
              {translateMode ? 'Logout' : 'تسجيل الخروج'}
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar2;
