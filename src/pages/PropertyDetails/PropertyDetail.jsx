import React, { useState, useContext } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { DarkModeContext } from '../../context/DarkModeContext';
import {
  FaBed, FaBath, FaRulerCombined, FaArrowLeft, FaArrowRight,
  FaPhone, FaMapMarkerAlt, FaWhatsapp, FaTelegram
} from 'react-icons/fa';  // إضافة أيقونات الواتساب والتلغرام من react-icons
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import './PropertyDetails.scss';
import iconRetinaUrl from 'leaflet/dist/images/marker-icon-2x.png';
import iconUrl from 'leaflet/dist/images/marker-icon.png';
import shadowUrl from 'leaflet/dist/images/marker-shadow.png';

import houseImage from '../../assets/soc.jpg';
import houseImag2 from '../../assets/ddd.jpg';
import Navbar from '../../components/NavBar/NavBar';
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

  const properties = [
    {
      id: 1,
      office: 'Al-Hayat Real Estate',
      phone: '+963 944 123 456',
      whatsapp: '963949221604',
      telegram: 'tofick_babbily',
      beds: 3,
      price: 250000,
      baths: 2,
      size: 120,
      latitude: 33.51068,
      longitude: 36.28217,
      location: 'Q damas malki near ajahez park',
      images: [houseImage, houseImag2, houseImage],
      description: translateMode ?
        'This stunning modern villa features spacious rooms with high ceilings...' :
        'تتميز هذه الفيلا الحديثة بغرف واسعة ذات أسقف عالية...',
      amenities: [
        translateMode ? 'Swimming Pool' : 'مسبح',
        translateMode ? 'Parking' : 'موقف سيارات'
      ]
    }
  ];

  const property = properties.find(p => p.id === parseInt(id));

  if (!property) {
    return <div className="not-found">{translateMode ? 'Property not found' : 'العقار غير موجود'}</div>;
  }

  const nextImage = () => setCurrentImageIndex((prev) => (prev + 1) % property.images.length);
  const prevImage = () => setCurrentImageIndex((prev) => (prev - 1 + property.images.length) % property.images.length);

  return (
    <div className="property-details-page">
      <button className="back-button" onClick={() => navigate(-1)}>
        {translateMode ? 'Back to Listings' : 'العودة إلى القائمة'}
      </button>

      <div className="property-content">
        {/* القسم الأيسر */}
        <div className="left-section">
          <div className="image-gallery">
            <div className="main-image-container">
              <img src={property.images[currentImageIndex]} alt="Property" className="main-image" />
              <div className="image-counter">
                {currentImageIndex + 1}/{property.images.length}
              </div>
              <button className="nav-button prev" onClick={prevImage}><FaArrowLeft /></button>
              <button className="nav-button next" onClick={nextImage}><FaArrowRight /></button>
            </div>

            <div className="thumbnails">
              {property.images.map((img, index) => (
                <div key={index}
                     className={`thumbnail-item ${index === currentImageIndex ? 'active' : ''}`}
                     onClick={() => setCurrentImageIndex(index)}>
                  <img src={img} alt={`Thumbnail ${index + 1}`} />
                </div>
              ))}
            </div>
          </div>

          <div className="details-grid">
            <div className="detail-item"><FaBed className="icon" />
              <div><span className="label">{translateMode ? 'Bedrooms' : 'غرف نوم'}</span>
                <span className="value">{property.beds}</span>
              </div>
            </div>

            <div className="detail-item"><FaBath className="icon" />
              <div><span className="label">{translateMode ? 'Bathrooms' : 'حمامات'}</span>
                <span className="value">{property.baths}</span>
              </div>
            </div>

            <div className="detail-item"><FaRulerCombined className="icon" />
              <div><span className="label">{translateMode ? 'Area' : 'المساحة'}</span>
                <span className="value">{property.size} m²</span>
              </div>
            </div>
          </div>

          <div className="location-section">
            <h2><FaMapMarkerAlt className="section-icon" />{translateMode ? 'Location' : 'الموقع'}</h2>
            <p>{property.location}</p>
          </div>

          <div className="description-section">
            <h2>{translateMode ? 'Description' : 'الوصف'}</h2>
            <p>{property.description}</p>
          </div>
        </div>

        {/* القسم الأيمن */}
        <div className="right-section">
          <div className="header-section">
            <h1>{translateMode ? 'Property Details' : 'تفاصيل العقار'}</h1>
            <div className="price-section">
              <span className="price">{property.price.toLocaleString()} $</span>
              <span className="price-label">{translateMode ? 'Price' : 'السعر'}</span>
            </div>
          </div>

          <div className="agency-info-box">
            <div className="agency-icon"><FaMapMarkerAlt /></div>
            <div className="agency-details">
              <h3>{translateMode ? 'Real Estate Office' : 'المكتب العقاري'}</h3>
              <p><strong>{property.office}</strong></p>
              <p><FaPhone /> {property.phone}</p>
            </div>
          </div>

          {property.amenities && (
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
              <h2><FaMapMarkerAlt className="section-icon" />{translateMode ? 'Map Location' : 'الموقع على الخريطة'}</h2>
              <MapContainer
                center={[property.latitude, property.longitude]}
                zoom={16}
                scrollWheelZoom={false}
                style={{ height: '350px', width: '100%', borderRadius: '10px' }}
              >
                <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
                <Marker position={[property.latitude, property.longitude]}>
                  <Popup>{property.location}</Popup>
                </Marker>
              </MapContainer>
            </div>
          )}

          <div className="contact-section">
            <h2>{translateMode ? 'Contact Seller' : 'اتصل بالبائع'}</h2>
            <div className="contact-links">
              <a
                href={`https://wa.me/${property.whatsapp}`}
                target="_blank"
                rel="noopener noreferrer"
                className="whatsapp-link"
              >
                <FaWhatsapp className="contact-icon" />
                {translateMode ? 'WhatsApp' : 'واتساب'}
              </a>

              <a
                href={`https://t.me/${property.telegram}`}
                target="_blank"
                rel="noopener noreferrer"
                className="telegram-link"
              >
                <FaTelegram className="contact-icon" />
                {translateMode ? 'Telegram' : 'تيليغرام'}
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PropertyDetails;
