import React, { useContext, useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useLocation, useNavigate } from 'react-router-dom';
import { mostSearch, mostWatch } from '../../features/search/searchSlice';
import './MostPages.scss'; // ملف الأنماط المشترك
import { DarkModeContext } from '../../context/DarkModeContext';
import { getTranslations } from '../../TRANSLATIONS';
// استيراد الأيقونات للويب
import { IoLocationOutline, IoSearchOutline } from 'react-icons/io5';
import { FaDollarSign, FaEye } from 'react-icons/fa';
import { MdOutlineCategory, MdOutlineRealEstateAgent } from 'react-icons/md';
import defaultImage from '../../assets/ddd.jpg'; // استيراد الصورة الافتراضية

const MostPages = () => {
  const { translateMode } = useContext(DarkModeContext);
  const location = useLocation();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const t = getTranslations(translateMode);
  const type = location.pathname.includes('MostWatch') ? 'mostWatch' : 'mostSearch';

  const mostSearchData = useSelector((state) => state.search.mostSearch || []);
  const mostWatchResponse = useSelector((state) => state.search.mostWatch || {});
  const mostWatchData = mostWatchResponse.data || [];
  const [currentPage, setCurrentPage] = useState(1);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    setIsLoading(true);
    if (type === "mostWatch") {
      dispatch(mostWatch(currentPage)).then(() => setIsLoading(false));
    } else {
      dispatch(mostSearch(currentPage)).then(() => setIsLoading(false));
    }
  }, [dispatch, type, currentPage]);

  // دالة لتحديد الأيقونة لمصطلحات البحث فقط
  const getIconForSearchTerm = (key) => {
    switch (key) {
      case 'type':
        return <MdOutlineCategory size={20} color="#5e72e4" />; // أصغر وألوان مختلفة
      case 'kind':
        return <MdOutlineRealEstateAgent size={20} color="#5e72e4" />;
      case 'location':
        return <IoLocationOutline size={20} color="#5e72e4" />;
      case 'max_price':
        return <FaDollarSign size={20} color="#5e72e4" />;
      default:
        return <IoSearchOutline size={18} color="#5e72e4" />;
    }
  };

  // دالة لترجمة المفاتيح لمصطلحات البحث
  const translateSearchKey = (key) => {
    switch (key) {
      case 'type':
        return translateMode ? 'Property Type' : 'نوع العقار';
      case 'kind':
        return translateMode ? 'Property Kind' : 'تصنيف العقار';
      case 'location':
        return translateMode ? 'Location' : 'الموقع';
      case 'max_price':
        return translateMode ? 'Max Price' : 'الحد الأقصى للسعر';
      default:
        return key;
    }
  };

  // دالة لترجمة خصائص العقار (تستخدم لـ mostWatch)
  const translatePropertyKey = (key) => {
    switch (key) {
      case 'price': return translateMode ? 'Price' : 'السعر';
      case 'location': return translateMode ? 'Location' : 'الموقع';
      case 'counter_sum': return translateMode ? 'Views' : 'مشاهدة';
      default: return key;
    }
  };


  const getPropertyLocation = (item) => {
    if (item.location) {
      const city = decodeURIComponent(item.location.city || '');
      const district = decodeURIComponent(item.location.district || '');
      return `${city}, ${district}`;
    }
    return 'N/A';
  };

  const handleViewDetails = (propertyId) => {
    navigate(`/property/${propertyId}`);
  };

  const listToRender = type === "mostWatch" ? mostWatchData : mostSearchData;
  const headerText = type === "mostWatch"
    ? (translateMode ? 'Most Watched Properties' : 'العقارات الأكثر مشاهدة')
    : (translateMode ? 'Most Searched Filters' : 'الفلاتر الأكثر بحثًا');

  return (
    <div className="most-pages-container">
      <div className="most-header">
        <h1>{headerText}</h1>
      </div>

      {isLoading ? (
        <div className="loading-indicator">
          <div className="spinner"></div>
        </div>
      ) : listToRender.length > 0 ? (
        <>
          {type === "mostWatch" ? (
            <div className="most-watched-grid">
              {listToRender.map((property) => (
                <div className="property-card-most-watched" key={property.id}>
                  <div className="image-section-most-watched">
                    <img
                      src={
                        property.images && property.images.length > 0
                          ? `http://localhost:8000/storage/real-estate/${property.images[0].name}`
                          : defaultImage
                      }
                      alt="property"
                    />
                  </div>
                  <div className="views-count-centered">
                    <FaEye className="views-icon" />
                    <span>{property.counter_sum ?? 0} {translatePropertyKey('counter_sum')}</span>
                  </div>

                  <div className="content-section-most-watched">
                    <div className="price-location-group">
                      <div className="price-tag">
                        <span>{property.price ? property.price.toLocaleString() : 'N/A'} $</span>
                      </div>
                      <div className="location-info">
                        <IoLocationOutline className="location-icon" />
                        <span>{getPropertyLocation(property)}</span>
                      </div>
                    </div>
                    <button
                      className="more-details-btn-most-watched"
                      onClick={() => handleViewDetails(property.id)}
                    >
                      {translateMode ? 'More Details' : 'المزيد من التفاصيل'}
                    </button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            // هذا الجزء هو لـ "Most Searched Filters" بتصميم جديد
            <div className="most-searched-filters-grid">
              {listToRender.map((item, index) => (
                <div className="search-filter-card" key={index}>
                  <div className="filter-icon">{getIconForSearchTerm(item.key)}</div>
                  <div className="filter-details">
                    <span className="filter-key">{translateSearchKey(item.key)}:</span>
                    <span className="filter-value">"{decodeURIComponent(item.value)}"</span>
                  </div>
                  <div className="filter-count">
                    <span>{item.search_weight}</span>
                    <span className="filter-label">{translateMode ? 'Searches' : 'بحث'}</span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </>
      ) : (
        <p className="no-results-text">
          {translateMode ? 'No data available yet.' : 'لا توجد بيانات حتى الآن.'}
        </p>
      )}

      {/* Pagination controls for Most Watched */}
      {type === "mostWatch" && mostWatchResponse.last_page > 1 && (
        <div className="pagination-controls">
          <button onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))} disabled={currentPage === 1}>
            {translateMode ? 'Previous' : 'السابق'}
          </button>
          <span>
            {translateMode ? 'Page' : 'الصفحة'} {currentPage} / {mostWatchResponse.last_page}
          </span>
          <button onClick={() => setCurrentPage(prev => Math.min(mostWatchResponse.last_page, prev + 1))} disabled={currentPage === mostWatchResponse.last_page}>
            {translateMode ? 'Next' : 'التالي'}
          </button>
        </div>
      )}
    </div>
  );
};

export default MostPages;