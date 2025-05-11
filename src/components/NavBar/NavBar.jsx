import React, { useContext } from 'react';
import { FaHome, FaSearch, FaUser } from 'react-icons/fa';
import { HiOutlineOfficeBuilding } from 'react-icons/hi';
import { Link, useNavigate } from 'react-router-dom';
import './Navbar.scss';
import { DarkModeContext } from '../../context/DarkModeContext';
import { useSelector } from 'react-redux';
import useAuth from './../../hooks/useAuth';
import VoiceSearch from '../VoiceSearch/VoiceSearch';
import api from '../../services/api';

const Navbar = () => {
  const { translateMode, toggleLanguage } = useContext(DarkModeContext);
  const navigate = useNavigate();

  const handleAddPropertyClick = () => navigate('/addhome');
  const {user} = useAuth();
  

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
          {
            user ?
            <Link to={`profile/${user.id}`} >
              <div className="nav-link">
{translateMode ? 'Profile' : 'الملف الشخصي'}
              </div>
            </Link> :''
            // <a href={`profile/${user.id}`} className="nav-link">{translateMode ? 'Profile' : 'الملف الشخصي'}</a> 
            // : ''
          }
          <a href="/" className="nav-link">{translateMode ? 'Home' : 'الرئيسية'}</a>
          <a href="/officelist" className="nav-link">{translateMode ? 'Offices' : 'مكاتب'}</a>
          <a href="/contact" className="nav-link">{translateMode ? 'Contact' : 'اتصل بنا'}</a>
          <a href="/MostWatch" className="nav-link-hot nav-link">
              {translateMode ? 'Most Watch' : 'الاكثر مشاهدة'}
          </a>
          <a href="/MostSearch" className="nav-link-hot nav-link">
              {translateMode ? 'Most Search' : 'الاكثر بحثا'}
          </a>
          <div>
              <VoiceSearch
                onSearch={(text) => {
                  api.get(`/search/voiceSearch?query=${encodeURIComponent(text)}`)
                    .then(res => res.json())
                    .then(data => console.log('Search Results:', data))
                    .catch(err => console.error('Search failed:', err));
                  }}
              />
          </div>
        </div>

        <div className="navbar-actions">
            {
              user ?
              <>
               <button className="add-property-button" onClick={handleAddPropertyClick}>
              <HiOutlineOfficeBuilding size={18} />
              <span>{translateMode ? 'Add Property' : 'إضافة عقار'}</span>
              </button>
              </>
              :
               ''
            }
          <div className="action-buttons">
            <button className="add-property-button " onClick={toggleLanguage}>
              {translateMode ? 'العربية' : 'English'}
            </button>
            <button className="action-button logout-button">
            {
              user ? (
                translateMode ? 'Logout' : 'تسجيل الخروج'
              ) : 
              (translateMode ? 'Login' : 'تسجيل الدخول')
            }
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
