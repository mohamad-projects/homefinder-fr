import React, { useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { DarkModeContext } from '../../context/DarkModeContext';
import { FaBed, FaBath, FaRulerCombined } from 'react-icons/fa';
import houseImage from '../../assets/ddd.jpg';
import './Display.scss';
import Navbar from '../../components/NavBar/NavBar';
const Display = () => {
  const { translateMode } = useContext(DarkModeContext);
  const navigate = useNavigate();

  const properties = [
    {
      id: 1,
      beds: 3,
      price: 250000,
      baths: 2,
      size: 120,
      location: 'Q damas malki near ajahez park',
      images: [houseImage, houseImage, houseImage],
      description: 'وصف العقار الأول'
    },
    {
      id: 2,
      beds: 4,
      price: 320000,
      baths: 3,
      size: 180,
      location: 'Al-Mazzeh, Villa Street',
      images: [houseImage, houseImage, houseImage],
      description: 'وصف العقار الثاني'
    }
  ];

  return (
    <div className="display-page">
      <div className="properties-container">
        {properties.map((property) => (
          <div className="property-card" key={property.id}>
            <div className="image-section">
              <img src={houseImage} alt="property" />
            </div>

            <div className="details-section">
              <div className="details-row">
                <div className="detail-item bg-light">
                  <FaBed className="icon" />
                  <div>
                    <span className="value">{property.beds}</span>
                    <span className="label">{translateMode ? 'Beds' : 'غرف'}</span>
                  </div>
                </div>

                <div className="detail-item bg-light">
                  <FaBath className="icon" />
                  <div>
                    <span className="value">{property.baths}</span>
                    <span className="label">{translateMode ? 'Baths' : 'حمامات'}</span>
                  </div>
                </div>

                <div className="detail-item bg-light">
                  <FaRulerCombined className="icon" />
                  <div>
                    <span className="value">{property.size}m²</span>
                    <span className="label">{translateMode ? 'Area' : 'المساحة'}</span>
                  </div>
                </div>
              </div>

              <div className="info-section bg-light">
                <div className="price">{property.price.toLocaleString()} $</div>
                <div className="location">
                  <span>{translateMode ? 'Location:' : 'الموقع:'} </span>
                  {property.location}
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
    </div>
  );
};

export default Display;