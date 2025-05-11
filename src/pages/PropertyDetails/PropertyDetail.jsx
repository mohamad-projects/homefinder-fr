import React, { useState, useContext } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { DarkModeContext } from '../../context/DarkModeContext';
import {
  FaBed, FaBath, FaRulerCombined, FaArrowLeft, FaArrowRight,
  FaPhone, FaMapMarkerAlt, FaWhatsapp, FaTelegram
} from 'react-icons/fa';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import './PropertyDetails.scss';
import iconRetinaUrl from 'leaflet/dist/images/marker-icon-2x.png';
import iconUrl from 'leaflet/dist/images/marker-icon.png';
import shadowUrl from 'leaflet/dist/images/marker-shadow.png';

import houseImage from '../../assets/soc.jpg';
import { useSelector } from 'react-redux';

delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl,
  iconUrl,
  shadowUrl,
});

const PropertyDetails = () => {
  const { id } = useParams();
  const { translateMode } = useContext(DarkModeContext);
  const navigate = useNavigate();
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const { data } = useSelector((state) => state.realestate.realEstate);
  const properties = data?.data || [];

  const property = properties.find(p => p.id === parseInt(id));

  if (!property) {
    return <div className="not-found">{translateMode ? 'Property not found' : 'العقار غير موجود'}</div>;
  }

  const nextImage = () => {
    if (property.images.length > 0) {
      setCurrentImageIndex((prev) => (prev + 1) % property.images.length);
    }
  };

  const prevImage = () => {
    if (property.images.length > 0) {
      setCurrentImageIndex((prev) => (prev - 1 + property.images.length) % property.images.length);
    }
  };

  const contact = property.user?.contact?.[0] || {};
  const phoneNumber = contact.phone_no || '';
  const telegramUsername = contact.username || '';

  return (
    <div className="property-details-page">
      <button className="back-button" onClick={() => navigate(-1)}>
        {translateMode ? 'Back to Listings' : 'العودة إلى القائمة'}
      </button>

      <div className="property-content">
        <div className="left-section">
          <div className="image-gallery">
            <div className="main-image-container">
              <img 
                src={
                  property.images?.length > 0
                    ? `http://localhost:8000/storage/real-estate/${property.images[currentImageIndex]?.name}`
                    : houseImage
                }
                alt="Property"
              />
              {property.images?.length > 1 && (
                <>
                  <div className="image-counter">
                    {currentImageIndex + 1}/{property.images.length}
                  </div>
                  <button className="nav-button prev" onClick={prevImage}>
                    <FaArrowLeft />
                  </button>
                  <button className="nav-button next" onClick={nextImage}>
                    <FaArrowRight />
                  </button>
                </>
              )}
            </div>

            {property.images?.length > 1 && (
              <div className="thumbnails">
                {property.images.map((img, index) => (
                  <div 
                    key={index}
                    className={`thumbnail-item ${index === currentImageIndex ? 'active' : ''}`}
                    onClick={() => setCurrentImageIndex(index)}
                  >
                    <img 
                      src={`http://localhost:8000/storage/real-estate/${img.name}`} 
                      alt={`Thumbnail ${index + 1}`}
                    />
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="details-grid">
            <div className="detail-item">
              <FaBed className="icon" />
              <div>
                <span className="label">{translateMode ? 'Bedrooms' : 'غرف نوم'}</span>
                <span className="value">{property.properties?.room_no || 'N/A'}</span>
              </div>
            </div>

            <div className="detail-item">
              <FaRulerCombined className="icon" />
              <div>
                <span className="label">{translateMode ? 'Area' : 'المساحة'}</span>
                <span className="value">{property.properties?.space_status || 'N/A'} m²</span>
              </div>
            </div>
          </div>

          <div className="location-section">
            <h2>
              <FaMapMarkerAlt className="section-icon" />
              {translateMode ? 'Location' : 'الموقع'}
            </h2>
            <p>
              {property.location?.city || 'N/A'} - {property.location?.district || 'N/A'}
            </p>
          </div>

          <div className="description-section">
            <h2>{translateMode ? 'Description' : 'الوصف'}</h2>
            <p>{property.description || translateMode ? 'No description available' : 'لا يوجد وصف'}</p>
          </div>
        </div>

        <div className="right-section">
          <div className="header-section">
            <h1>{translateMode ? 'Property Details' : 'تفاصيل العقار'}</h1>
            <div className="price-section">
              <span className="price">
                {property.price?.toLocaleString() || '0'} $
              </span>
              <span className="price-label">{translateMode ? 'Price' : 'السعر'}</span>
            </div>
          </div>

          <div className="agency-info-box">
            <div className="agency-icon"><FaMapMarkerAlt /></div>
            <div className="agency-details">
              <h3>{translateMode ? 'Real Estate Office' : 'المكتب العقاري'}</h3>
              <p><strong>{property.user?.name || 'N/A'}</strong></p>
              <p><FaPhone /> {phoneNumber || 'N/A'}</p>
            </div>
          </div>

          {property.amenities?.length > 0 && (
            <div className="amenities-section">
              <h2>{translateMode ? 'Amenities' : 'المرافق'}</h2>
              <div className="amenities-grid">
                {property.amenities.map((item, idx) => (
                  <div key={idx} className="amenity-item">{item}</div>
                ))}
              </div>
            </div>
          )}

          {property.latitude && property.longitude && (
            <div className="map-section">
              <h2>
                <FaMapMarkerAlt className="section-icon" />
                {translateMode ? 'Map Location' : 'الموقع على الخريطة'}
              </h2>
              <MapContainer
                center={[property.latitude, property.longitude]}
                zoom={16}
                scrollWheelZoom={false}
                style={{ height: '350px', width: '100%', borderRadius: '10px' }}
              >
                <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
                <Marker position={[property.latitude, property.longitude]}>
                  <Popup>
                    {property.location?.city || 'N/A'} - {property.location?.district || 'N/A'}
                  </Popup>
                </Marker>
              </MapContainer>
            </div>
          )}

          <div className="contact-section">
            <h2>{translateMode ? 'Contact Seller' : 'اتصل بالبائع'}</h2>
            <div className="contact-links">
              {phoneNumber && (
                <a
                  href={`https://wa.me/${phoneNumber}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="whatsapp-link"
                >
                  <FaWhatsapp className="contact-icon" />
                  {translateMode ? 'WhatsApp' : 'واتساب'}
                </a>
              )}
              
              {telegramUsername && (
                <a
                  href={`https://t.me/${telegramUsername}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="telegram-link"
                >
                  <FaTelegram className="contact-icon" />
                  {translateMode ? 'Telegram' : 'تيليغرام'}
                </a>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PropertyDetails;