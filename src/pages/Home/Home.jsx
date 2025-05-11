import React, { useState, useContext, useEffect } from 'react';
import { getTranslations, getTranslatedOptions } from '../../TRANSLATIONS';
import houseImage from '../../assets/ddd.jpg';
import './Home.scss';
import { FaSearch } from 'react-icons/fa';
import { DarkModeContext } from '../../context/DarkModeContext';
import Display from '../Display/Display';
import { useDispatch, useSelector } from 'react-redux';
import { getStatus } from '../../features/realestate/realEstateSlice';
import api from '../../services/api';
import useLocation from '../../hooks/useLocation';

const Home = () => {
  const { translateMode } = useContext(DarkModeContext);
  const [selectedNeighborhood, setSelectedNeighborhood] = useState('');
  const [selectedType, setSelectedType] = useState('');
  const [price, setPrice] = useState(0);
  const [activeButton, setActiveButton] = useState('buy');
  const dispatch = useDispatch();
  const t = getTranslations(translateMode);
  const options = getTranslatedOptions(translateMode);
  const {data} = useSelector((state) => state.realestate.realEstateCount);
  const location = useLocation();
  const [filters, setFilters] = useState({
    kind: 'sale',
    type: '',
    max_price: '',
    location: ''
  });


  console.log(filters)

  const DATA = useSelector((state)=>state.realestate.realEstate)
  const [properties, setProperties] = useState(DATA?.data?.data);
  const [currentPage, setCurrentPage] = useState(1);
  const [lastPage, setLastPage] = useState(1);



  const fetchProperties = async (page = 1) => {
    try {
      const response = await api.post(`RealEstate/index?page=${page}`,filters);
      setProperties(response.data.data.data);
      setCurrentPage(response.data.data.current_page);
      setLastPage(response.data.data.last_page);
    } catch (error) {
      console.error('Error fetching properties:', error);
    }
  };

  useEffect(() => {
    fetchProperties(currentPage);
    dispatch(getStatus());
  }, [currentPage,filters]);

  const handlePageChange = (page) => {
    if (page >= 1 && page <= lastPage) {
      setCurrentPage(page);
      
    }
  };
  const handleSearch = () => {
    setCurrentPage(1);
    setFilters({
      kind: activeButton,
      type: selectedType,
      max_price: price,
      location: selectedNeighborhood
    });
  };

  
  return (
    <div className="home">
      <div className="main-content">
      <div className="left-section">
  <h1>{t.common.title}</h1>
  <p className="subtitle">{t.common.subtitle}</p>
  
  <div className="action-buttons">
    <button 
      className={`action-btn ${activeButton === 'buy' ? 'active' : ''}`}
      onClick={() => {
        setActiveButton('buy');
        setFilters(prev => ({...prev, kind: 'sale'})); 
      }}
    >
      {t.buttons.buy}
    </button>
    <div className="divider"></div>
    <button 
      className={`action-btn ${activeButton === 'rent' ? 'active' : ''}`}
      onClick={() => {
        setActiveButton('rent');
        setFilters(prev => ({...prev, kind: 'rental'}));
      }}
    >
      {t.buttons.rent}
    </button>
  </div>
  
  <div className="search-filters">
    <div className='filter-dropdown'>
      <input 
        type="text" 
        placeholder={t.filters.price}
        value={price}
        onChange={(e) => setPrice(e.target.value)}
      />
    </div>
    <div className="filter-dropdown">
      
      <select 
          value={filters.location} 
          onChange={(e) => setFilters({...filters, location: e.target.value})}
        >
          <option value="">{translateMode ? 'Select Location' : 'اختر موقع'}</option>
          {location.loaction.data.map((loc) => ( 
            <option key={loc.id} value={loc.city + ' ' + loc.district}>
              {loc.city} - {loc.district}
            </option>
          ))}
        </select>
    </div>
    
    <div className="filter-dropdown">
      <select 
        value={selectedType} 
        onChange={(e) => setSelectedType(e.target.value)}
      >
        <option value="">{t.filters.type}</option>
        {options.types.map((type, index) => (
          <option key={index} value={type}>{type}</option>
        ))}
      </select>
    </div>
    
    <button 
      className="search-btn"
      onClick={handleSearch} // Add the handleSearch function here
    >
      <FaSearch /> {t.common.search}
    </button>
  </div>
</div>
        <div className="right-section">
          <img src={houseImage} alt={t.common.title} />
        </div>
      </div>
      
      <div className=''>
                <Display
                    properties = {properties}
                    lastPage = {lastPage}
                    currentPage = {currentPage}
                    handlePageChange = {handlePageChange}
                    translateMode = {translateMode}
                />
                
      </div>

      <div className="stats-section">
        <div className="stats-container">
          <div className="stat-card">
            <div className="stat-number">{data.sale_count}</div>
            <div className="stat-title">{t.stats.purchase}</div>
            <div className="stat-icon">🏠</div>
          </div>
          
          <div className="stat-card">
            <div className="stat-number">{data.rental_count}</div>
            <div className="stat-title">{t.stats.rent}</div>
            <div className="stat-icon">🔑</div>
          </div>
          
          <div className="stat-card">
            <div className="stat-number">24/7</div>
            <div className="stat-title">{t.stats.support}</div>
            <div className="stat-icon">📞</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;