// src/pages/Home/Home.jsx
import React, { useState, useContext, useEffect } from 'react';
import { getTranslations, getTranslatedOptions } from '../../TRANSLATIONS';
import houseImage from '../../assets/ddd.jpg';
import './Home.scss';
import { FaSearch } from 'react-icons/fa';
import { DarkModeContext } from '../../context/DarkModeContext';
import { useDispatch, useSelector } from 'react-redux';
import { getStatus } from '../../features/realestate/realEstateSlice';
import api from '../../services/api';
import Display from '../Display/Display';
import ComparisonModal from '../ComparisonModal/ComparisonModal';
import ComparisonPreferencesModal from '../ComparisonPreferencesModal/ComparisonPreferencesModal';

const Home = () => {
    const { translateMode } = useContext(DarkModeContext);
    const dispatch = useDispatch();

    const t = getTranslations(translateMode);
    const options = getTranslatedOptions(translateMode);

    const { data: statsData } = useSelector((state) => state.realestate.realEstateCount || {});
    const locations = useSelector((state) => state.realestate.locations?.data || []);
    const DATA = useSelector((state) => state.realestate.realEstate);

    const [properties, setProperties] = useState(DATA?.data?.data || []);
    const [currentPage, setCurrentPage] = useState(1);
    const [lastPage, setLastPage] = useState(1);
    const [activeButton, setActiveButton] = useState('buy');

    const [isFiltering, setIsFiltering] = useState(false);
    const [filters, setFilters] = useState({
        type: 'sale',
        kind: '',
        max_price: '',
        location: ''
    });

    const [idsToCompare, setIdsToCompare] = useState({ id1: null, id2: null });
    const [showPreferencesModal, setShowPreferencesModal] = useState(false);
    const [comparisonResults, setComparisonResults] = useState(null);
    const [showResultsModal, setShowResultsModal] = useState(false);

    const fetchProperties = async (page = 1) => {
        try {
            const response = await api.post(`RealEstate/index?page=${page}`);
            const result = response.data?.data;

            setProperties(result?.data || []);
            setCurrentPage(result?.current_page || 1);
            setLastPage(result?.last_page || 1);
        } catch (error) {
            console.error('Error fetching properties:', error);
        }
    };

    const handleFilteredFetch = async (page = 1) => {
        try {
            const formData = new FormData();
            formData.append('type', filters.type);
            formData.append('kind', filters.kind);
            formData.append('max_price', filters.max_price);
            formData.append('location', filters.location);

            const response = await api.post(`RealEstate/index?page=${page}`, formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });

            const result = response.data?.data;
            setProperties(result?.data || []);
            setCurrentPage(result?.current_page || 1);
            setLastPage(result?.last_page || 1);
        } catch (error) {
            console.error('Error filtering properties:', error);
        }
    };

    const handlePageChange = (page) => {
        if (page >= 1 && page <= lastPage) {
            if (isFiltering) {
                handleFilteredFetch(page);
            } else {
                fetchProperties(page);
            }
        }
    };

    const handleSearch = () => {
        setIsFiltering(true);
        handleFilteredFetch(1);
    };

    const handlePropertiesSelected = (id1, id2) => {
        setIdsToCompare({ id1, id2 });
        setShowPreferencesModal(true);
    };

    const handleInitiateComparison = async (preferences) => {
        setShowPreferencesModal(false);

        if (!idsToCompare.id1 || !idsToCompare.id2) {
            console.error("Error: Property IDs not set for comparison.");
            alert(t.common.comparisonError || (translateMode ? 'Failed to compare properties (IDs missing).' : 'فشل مقارنة العقارات (المعرفات مفقودة).'));
            return;
        }

        try {
            const filteredPreferences = Object.fromEntries(
                Object.entries(preferences).filter(([key, value]) => {
                    return value !== null && value !== undefined && (typeof value === 'string' ? value.trim() !== '' : true);
                })
            );

            if (filteredPreferences.max_price) filteredPreferences.max_price = Number(filteredPreferences.max_price);
            if (filteredPreferences.min_price) filteredPreferences.min_price = Number(filteredPreferences.min_price);
            if (filteredPreferences.min_rooms) filteredPreferences.min_rooms = Number(filteredPreferences.min_rooms);
            if (filteredPreferences.min_space_status) filteredPreferences.min_space_status = Number(filteredPreferences.min_space_status);

            const response = await api.post('RealEstate/compare', {
                real_estate_id_1: idsToCompare.id1,
                real_estate_id_2: idsToCompare.id2,
                preferences: filteredPreferences
            }, {
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json',
                },
            });

            console.log('Comparison API Response:', response.data);
            setComparisonResults(response.data); 
            setShowResultsModal(true);

        } catch (error) {
            console.error('Error during property comparison:', error.response ? error.response.data : error.message);
            alert(t.common.comparisonError);
        } finally {
            setIdsToCompare({ id1: null, id2: null });
        }
    };

    useEffect(() => {
        fetchProperties(1);
        dispatch(getStatus());
    }, [dispatch]);

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
                                setFilters(prev => ({ ...prev, type: 'sale' }));
                            }}
                        >
                            {t.buttons.buy}
                        </button>
                        <div className="divider"></div>
                        <button
                            className={`action-btn ${activeButton === 'rent' ? 'active' : ''}`}
                            onClick={() => {
                                setActiveButton('rent');
                                setFilters(prev => ({ ...prev, type: 'rental' }));
                            }}
                        >
                            {t.buttons.rent}
                        </button>
                    </div>

                    <div className="search-filters">
                        <div className="filter-dropdown">
                            <input
                                type="number"
                                placeholder={t.filters.price}
                                value={filters.max_price}
                                onChange={(e) =>
                                    setFilters((prev) => ({ ...prev, max_price: e.target.value }))
                                }
                            />
                        </div>

                        <div className="filter-dropdown">
                            <select
                                value={filters.location}
                                onChange={(e) =>
                                    setFilters((prev) => ({ ...prev, location: e.target.value }))
                                }
                            >
                                <option value="">{translateMode ? 'Select Location' : 'اختر موقع'}</option>
                                {locations.map((loc) => (
                                    <option key={loc.id} value={loc.district}>
                                        {loc.district}
                                    </option>
                                ))}
                            </select>
                        </div>

                        <div className="filter-dropdown">
                            <select
                                value={filters.kind}
                                onChange={(e) =>
                                    setFilters((prev) => ({ ...prev, kind: e.target.value }))
                                }
                            >
                                <option value="">{t.filters.type}</option>
                                {options.types.map((type, index) => (
                                    <option key={index} value={type}>{type}</option>
                                ))}
                            </select>
                        </div>

                        <button className="search-btn" onClick={handleSearch}>
                            <FaSearch /> {t.common.search}
                        </button>
                    </div>
                </div>

                <div className="right-section">
                    <img src={houseImage} alt={t.common.title} />
                </div>
            </div>

            <div>
                <Display
                    properties={properties}
                    lastPage={lastPage}
                    currentPage={currentPage}
                    handlePageChange={handlePageChange}
                    translateMode={translateMode}
                    onPropertiesSelectedForCompare={handlePropertiesSelected}
                />
            </div>

            <div className="stats-section">
                <div className="stats-container">
                    <div className="stat-card">
                        <div className="stat-number">{statsData?.sale_count ?? '...'}</div>
                        <div className="stat-title">{t.stats.purchase}</div>
                        <div className="stat-icon">🏠</div>
                    </div>

                    <div className="stat-card">
                        <div className="stat-number">{statsData?.rental_count ?? '...'}</div>
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

            <ComparisonPreferencesModal
                isOpen={showPreferencesModal}
                onClose={() => setShowPreferencesModal(false)}
                onCompare={handleInitiateComparison}
                translateMode={translateMode}
                options={options}
            />

            <ComparisonModal
                isOpen={showResultsModal}
                onClose={() => setShowResultsModal(false)}
                comparisonData={comparisonResults}
            />
        </div>
    );
};

export default Home;