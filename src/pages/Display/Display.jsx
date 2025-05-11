import React, { useEffect, useState, useContext } from 'react';
import { FaBed, FaBath, FaRulerCombined } from 'react-icons/fa';
import './Display.scss';
import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';

const Display = ({
  properties,
  lastPage,
  currentPage,
  handlePageChange,
  translateMode,
}) => {

  const navigate = useNavigate();
  return (
    <div className="display-page">
      <div className="properties-container">
        {properties.map((property) => (
          <div className="property-card" key={property.id}>
            <div className="image-section">
              <img
                src={
                  property.images.length > 0
                    ? `http://localhost:8000/storage/real-estate/${property.images[0].name}`
                    : 'fallback-image.jpg'
                }
                alt="property"
              />
            </div>

            <div className="details-section">
              <div className="details-row">
                <div className="detail-item bg-light">
                  <FaBed className="icon" />
                  <div>
                    <span className="value">{property.properties?.room_no ?? 'N/A'}</span>
                    <span className="label">{translateMode ? 'Beds' : 'غرف'}</span>
                  </div>
                </div>

               

                <div className="detail-item bg-light">
                  <FaRulerCombined className="icon" />
                    <span className="value">{property.properties?.space_status}m²</span>
                    <span className="label">{translateMode ? 'Area' : 'المساحة'}</span>
                </div>
              </div>

              <div className="info-section bg-light">
                <div className="price">{property.price ?? 0} $</div>
                <div className="location">
                  <span>{translateMode ? 'Location:' : 'الموقع:'} </span>
                  {property.location?.city}, {property.location?.district}
                </div>
              </div>
            </div>

            <button 
              className="more-details-btn"
              onClick={() => navigate(`/property/${property.id}`)}
            >
              {translateMode ? 'More Details' : 'المزيد من التفاصيل'}
            </button>
          </div>
        ))}
      </div>

      <div className="pagination-controls">
        <button onClick={() => handlePageChange(currentPage - 1)} disabled={currentPage === 1}>
          {translateMode ? 'Previous' : 'السابق'}
        </button>

        <span>{translateMode ? 'Page' : 'الصفحة'} {currentPage} / {lastPage}</span>

        <button onClick={() => handlePageChange(currentPage + 1)} disabled={currentPage === lastPage}>
          {translateMode ? 'Next' : 'التالي'}
        </button>
      </div>
    </div>
  );
};


export default Display;