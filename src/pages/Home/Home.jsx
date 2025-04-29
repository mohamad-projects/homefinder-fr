import React, { useState, useContext } from 'react';
import houseImage from '../../assets/ddd.jpg';
import './Home.scss';
import { FaSearch } from 'react-icons/fa';
import { DarkModeContext } from '../../context/DarkModeContext';
import Navbar from '../../components/NavBar/NavBar';
const Home = () => {
  const { translateMode } = useContext(DarkModeContext);
  const [selectedCountry, setSelectedCountry] = useState('');
  const [selectedNeighborhood, setSelectedNeighborhood] = useState('');
  const [selectedType, setSelectedType] = useState('');
  const [activeButton, setActiveButton] = useState('buy');

  const countries = translateMode 
    ? ['USA', 'Canada', 'UK', 'Germany', 'France']
    : ['أمريكا', 'كندا', 'بريطانيا', 'ألمانيا', 'فرنسا'];

  const neighborhoods = translateMode
    ? ['Downtown', 'Suburb', 'Rural', 'Beachfront', 'Mountain']
    : ['وسط المدينة', 'ضاحية', 'ريف', 'شاطئ', 'جبل'];

  const types = translateMode
    ? ['Apartment', 'Villa', 'Office', 'Studio', 'House']
    : ['شقة', 'فيلا', 'مكتب', 'استوديو', 'منزل'];

  return (
    <div className="home">
      <div className="main-content">
        <div className="left-section">
          <h1>
            {translateMode 
              ? 'Easiest Way To Find Your Dream House' 
              : 'أسهل طريقة للعثور على منزل أحلامك'}
          </h1>
          <p className="subtitle">
            {translateMode
              ? 'This is where you can find a dream place for you of various types, all over the world at affordable prices.'
              : 'هنا يمكنك العثور على مكان أحلامك من أنواع مختلفة، في جميع أنحاء العالم بأسعار معقولة.'}
          </p>
          
          <div className="action-buttons">
            <button 
              className={`action-btn ${activeButton === 'buy' ? 'active' : ''}`}
              onClick={() => setActiveButton('buy')}
            >
              {translateMode ? 'Buy' : 'شراء'}
            </button>
            <div className="divider"></div>
            <button 
              className={`action-btn ${activeButton === 'rent' ? 'active' : ''}`}
              onClick={() => setActiveButton('rent')}
            >
              {translateMode ? 'Rent' : 'إيجار'}
            </button>
          </div>
          
          <div className="search-filters">
            <div className="filter-dropdown">
              <select 
                value={selectedCountry} 
                onChange={(e) => setSelectedCountry(e.target.value)}
              >
                <option value="">{translateMode ? 'Country' : 'البلد'}</option>
                {countries.map((country, index) => (
                  <option key={index} value={country}>{country}</option>
                ))}
              </select>
            </div>
            
            <div className="filter-dropdown">
              <select 
                value={selectedNeighborhood} 
                onChange={(e) => setSelectedNeighborhood(e.target.value)}
              >
                <option value="">{translateMode ? 'Neighborhood' : 'الحي'}</option>
                {neighborhoods.map((neighborhood, index) => (
                  <option key={index} value={neighborhood}>{neighborhood}</option>
                ))}
              </select>
            </div>
            
            <div className="filter-dropdown">
              <select 
                value={selectedType} 
                onChange={(e) => setSelectedType(e.target.value)}
              >
                <option value="">{translateMode ? 'Type' : 'النوع'}</option>
                {types.map((type, index) => (
                  <option key={index} value={type}>{type}</option>
                ))}
              </select>
            </div>
            
            <button className="search-btn">
              <FaSearch /> {translateMode ? 'Search' : 'بحث'}
            </button>
          </div>
        </div>
        
        <div className="right-section">
          <img src={houseImage} alt={translateMode ? 'Dream House' : 'منزل أحلام'} />
        </div>
      </div>

      <div className="stats-section">
        <div className="stats-container">
          <div className="stat-card">
            <div className="stat-number">1,258+</div>
            <div className="stat-title">
              {translateMode 
                ? 'Properties For Purchase' 
                : 'عقارات للبيع'}
            </div>
            <div className="stat-icon">🏠</div>
          </div>
          
          <div className="stat-card">
            <div className="stat-number">892+</div>
            <div className="stat-title">
              {translateMode 
                ? 'Properties For Rent' 
                : 'عقارات للإيجار'}
            </div>
            <div className="stat-icon">🔑</div>
          </div>
          
     
          
          <div className="stat-card">
            <div className="stat-number">24/7</div>
            <div className="stat-title">
              {translateMode 
                ? 'Customer Support' 
                : 'دعم عملاء'}
            </div>
            <div className="stat-icon">📞</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;