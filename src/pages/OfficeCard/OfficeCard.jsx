import React from 'react';
import './OfficeCard.scss';
import { useNavigate } from 'react-router-dom';
// تم إضافة FaMapMarkerAlt و FaPhone
import { FaWhatsapp, FaTelegram, FaMapMarkerAlt, FaPhone } from 'react-icons/fa';

const OfficeCard = ({ office, translateMode }) => {
  const navigate = useNavigate();

  const handleDetails = () => {
    navigate(`/profile/${office.id}`);
  };

  const whatsappLink = `https://wa.me/${office.whatsapp}`;
  const telegramLink = `https://t.me/${office.telegram}`;

  return (
    <div className="office-card">
      <h2>
        <strong>{translateMode ? 'Office Name:' : 'اسم المكتب:'}</strong> {office.name}
      </h2>
      {/* تم إضافة أيقونة العنوان هنا */}
      <p className="office-info-line">
        <FaMapMarkerAlt className="info-icon" />
        <strong>{translateMode ? 'Address' : 'العنوان'}:</strong> {office.address}
      </p>
      {/* تم إضافة أيقونة الهاتف هنا بكلاس جديد للتدوير */}
      <p className="office-info-line">
        <FaPhone className="info-icon phone-icon-rotate" /> {/* <--- الكلاس الجديد هنا */}
        <strong>{translateMode ? 'Phone' : 'الهاتف'}:</strong> {office.phone}
      </p>

      <div className="action-buttons">
        {office.whatsapp && (
          <a
            href={whatsappLink}
            target="_blank"
            rel="noopener noreferrer"
            className="action-btn whatsapp"
          >
            <FaWhatsapp /> {translateMode ? 'WhatsApp' : 'واتساب'}
          </a>
        )}
        {office.telegram && (
          <a
            href={telegramLink}
            target="_blank"
            rel="noopener noreferrer"
            className="action-btn telegram"
          >
            <FaTelegram /> {translateMode ? 'Telegram' : 'تيليغرام'}
          </a>
        )}
        <button className="action-btn details" onClick={handleDetails}>
          {translateMode ? 'Details' : 'تفاصيل'}
        </button>
      </div>
    </div>
  );
};

export default OfficeCard;