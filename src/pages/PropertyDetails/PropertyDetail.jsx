import React, { useState, useContext, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { DarkModeContext } from '../../context/DarkModeContext';
import {
    FaBed, FaBath, FaRulerCombined, FaArrowLeft, FaArrowRight,
    FaPhone, FaMapMarkerAlt, FaWhatsapp, FaTelegram, FaSpinner, FaExclamationCircle, FaEye, FaPlusCircle, FaTag, FaHome
} from 'react-icons/fa';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import './PropertyDetails.scss';
import iconRetinaUrl from 'leaflet/dist/images/marker-icon-2x.png';
import iconUrl from 'leaflet/dist/images/marker-icon.png';
import shadowUrl from 'leaflet/dist/images/marker-shadow.png';

import houseImage from '../../assets/soc.jpg';
import { useDispatch, useSelector } from 'react-redux';
import { getRealEstateDetails } from '../../features/auth/authSlice';

// Fix for default Leaflet icon paths
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

    const dispatch = useDispatch();
    const { realEstateDetails: property, loading, error, user } = useSelector((state) => state.auth);

    useEffect(() => {
        if (id) {
            dispatch(getRealEstateDetails(id));
        }
    }, [dispatch, id]);

    const normalImages = property?.images?.filter(image => image.type === 'normal') || [];
    const has360Images = property?.images?.some(image => image.type === '360');

    if (loading) return (
        <div className="property-details-page loading-state">
            <div className="status-message loading-message">
                <FaSpinner className="spinner" /> {translateMode ? "Loading property details..." : "جاري تحميل تفاصيل العقار..."}
            </div>
        </div>
    );

    if (error || !property) return (
        <div className="property-details-page error-state">
            <div className="status-message error-message">
                <FaExclamationCircle /> {translateMode ? 'Property not found or an error occurred.' : 'العقار غير موجود أو حدث خطأ.'}
            </div>
        </div>
    );

    const nextImage = () => {
        if (normalImages.length > 0) {
            setCurrentImageIndex((prev) => (prev + 1) % normalImages.length);
        }
    };

    const prevImage = () => {
        if (normalImages.length > 0) {
            setCurrentImageIndex((prev) => (prev - 1 + normalImages.length) % normalImages.length);
        }
    };

    const handleViewPanorama = () => {
        navigate('/pano'); // Assumes '/pano' route exists for 360 viewer
    };

    const contact = property.user?.contact?.[0] || {};
    const phoneNumber = contact.phone_no || '';
    const telegramUsername = contact.username || '';

    const isOwner = user && property.user_id === user.id;

    // --- المميزات (Amenities) ---
    const amenities = [];
    const properties = property.properties || {}; 

    const checkAmenity = (key, textAr, textEn, expectedValue = 1) => {
        const value = parseInt(String(properties[key]));
        if (!isNaN(value) && value === expectedValue) {
            amenities.push(translateMode ? textEn : textAr);
        }
    };

    checkAmenity('electricity_status', "كهرباء", "Electricity", 1);
    checkAmenity('water_status', "مياه", "Water", 1);
    checkAmenity('water_well', "بئر ماء", "Water well", 1);
    checkAmenity('solar_energy', "طاقة شمسية", "Solar energy", 1);
    checkAmenity('garage', "كراج", "Garage", 1);
    checkAmenity('elevator', "مصعد", "Elevator", 1);
    checkAmenity('garden_status', "حديقة", "Garden", 1);
    checkAmenity('transportation_status', "مواصلات ", " Transportation", 1); 
    // --- نهاية المميزات ---

    return (
        <div className="property-details-page">
            <div className="button-group">
                <button className="back-button" onClick={() => navigate(-1)}>
                    <FaArrowLeft /> {translateMode ? 'Back to Listings' : 'العودة إلى القائمة'}
                </button>
                {isOwner && (
                    <Link to={`/Add360/${id}`} className="add-360-button">
                        <FaPlusCircle /> {translateMode ? 'Add 360 Images' : 'أضف صور 360'}
                    </Link>
                )}
            </div>

            <div className="property-content">
                <div className="left-section">
                    <div className="image-gallery">
                        <div className="main-image-container">
                            <img
                                src={
                                    normalImages.length > 0
                                        ? `http://localhost:8000/storage/real-estate/${normalImages[currentImageIndex]?.name}`
                                        : houseImage
                                }
                                alt="Property"
                                className="main-image"
                            />
                            {normalImages.length > 1 && (
                                <>
                                    <div className="image-counter">
                                        {currentImageIndex + 1}/{normalImages.length}
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

                        {normalImages.length > 1 && (
                            <div className="thumbnails">
                                {normalImages.map((img, index) => (
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
                    <div className="description-section">
                        <h2>{translateMode ? 'Description' : 'الوصف'}</h2>
                        <p>{property.description || (translateMode ? 'No description available' : 'لا يوجد وصف')}</p>
                    </div>
                    <div className="location-section">
                        <h2>
                            <FaMapMarkerAlt className="section-icon" style={{ color: "green" }} />
                            {translateMode ? 'Location' : 'الموقع'}
                        </h2>
                        <p>
                            {property.location?.city || 'N/A'} - {property.location?.district || 'N/A'}
                        </p>
                    </div>
                    <div className="details-grid">
                        <div className="detail-item">
                            <FaBed className="icon" />
                            <div className="word-item-inline">
                                <span className="label">{translateMode ? 'Bedrooms: ' : 'عدد الغرف: '}</span>
                                <span className="value">{property.properties?.room_no || 'N/A'}</span>
                            </div>
                        </div>


                        <div className="detail-item">
                            <FaRulerCombined className="icon" />
                            <div className="word-item-inline">
                                <span className="label">{translateMode ? 'Area: ' : 'المساحة: '}</span>
                                <span className="value">{property.properties?.space_status || 'N/A'} m²</span>
                            </div>
                        </div>

                        <div className="detail-item">
                            <FaRulerCombined className="icon" />
                            <div className="word-item-inline">
                                <span className="label">{translateMode ? 'Floor: ' : 'الطابق: '}</span>
                                <span className="value">{property.properties?.floor || 'N/A'}</span>
                            </div>
                        </div>

                        <div className="detail-item">
                            <FaRulerCombined className="icon" />
                            <div className="word-item-inline">
                                <span className="label">{translateMode ? 'Direction: ' : 'الاتجاه: '}</span>
                                <span className="value">
                                    {property.properties?.direction || 'N/A'}
                                </span>
                            </div>
                        </div>

                        <div className="detail-item">
                            <FaRulerCombined className="icon" />
                            <div className="word-item-inline">
                                <span className="label">{translateMode ? 'Ownership Type: ' : 'نوع الملكية: '}</span>
                                <span className="value">
                                    {property.properties?.ownership_type === "green" ? (translateMode ? "Green" : "أخضر") :
                                        property.properties?.ownership_type === "court" ? (translateMode ? "Court" : "محكمة") :
                                            'N/A'}
                                </span>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="right-section">
                    <div className="header-section">
                        <div className="price-section">
                            <span className="price">
                                {translateMode ? 'Price: ' : 'السعر: '}
                                {property.price?.toLocaleString() || '0'} $
                            </span>
                        </div>
                        <div className="type-kind-section">
                            <div className="type-kind-item type-item">
                                <FaTag className="icon" />
                                <span className="value">
                                    {property.type === "sale" ? (translateMode ? "For Sale" : "للبيع") :
                                        property.type === "rental" ? (translateMode ? "For Rent" : "للإيجار") : 'N/A'}
                                </span>
                            </div>
                            <div className="type-kind-item kind-item">
                                <FaHome className="icon" />
                                <span className="value">
                                    {
                                    property.kind === "apartment" ? (translateMode ? "Apartment" : "شقة") :
                                    property.kind === "villa" ? (translateMode ? "Villa" : "فيلا") :
                                    property.kind === "chalet" ? (translateMode ? "Chalet" : "شاليه") : 'N/A'
                                    }
                                </span>
                            </div>
                        </div>
                    </div>

                    {has360Images && (
                        <button className="view-panorama-button" onClick={handleViewPanorama}>
                            <FaEye /> {translateMode ? 'View Panorama' : 'مشاهدة البانوراما'}
                        </button>
                    )}

                    <div className="agency-info-box">
                        <div className="agency-details">
                            <h3>{translateMode ? 'Real Estate name' : 'اسم المكتب العقاري'}</h3>
                            <p className="agency-contact-line">
                                <FaPhone className="agency-phone-icon" />
                                <strong>{property.user?.name || 'N/A'}</strong>
                                <span> {phoneNumber || 'N/A'}</span>
                            </p>
                        </div>
                    </div>

                    {/* المميزات (Amenities) */}
                    {amenities.length > 0 && ( 
                        <div className="amenities-section">
                            <h2>{translateMode ? 'Amenities' : 'المرافق'}</h2>
                            <div className="amenities-grid">
                                {amenities.map((item, idx) => (
                                    <div key={idx} className="amenity-item">{item}</div>
                                ))}
                            </div>
                        </div>
                    )}

                    {property.latitude && property.longitude && (
                        <div className="map-section">
                            <h2>
                                <FaMapMarkerAlt className="section-icon" style={{ color: "green" }} />
                                {translateMode ? 'Location On Map' : 'الموقع على الخريطة'}
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

                    <div className="contact-sections">
                        <div className="contact-links-grid">
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