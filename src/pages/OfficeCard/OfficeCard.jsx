import React from 'react';
import './OfficeCard.scss';
import { useNavigate } from 'react-router-dom';
import { FaWhatsapp, FaTelegram } from 'react-icons/fa';

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
      <p><strong>{translateMode ? 'Address' : 'العنوان'}:</strong> {office.address}</p>
      <p><strong>{translateMode ? 'Phone' : 'الهاتف'}:</strong> {office.phone}</p>

      <div className="contact-buttons">
        {office.whatsapp && (
          <a
            href={whatsappLink}
            target="_blank"
            rel="noopener noreferrer"
            className="contact-btn whatsapp"
          >
            <FaWhatsapp /> {translateMode ? 'WhatsApp' : 'واتساب'}
          </a>
        )}
        {office.telegram && (
          <a
            href={telegramLink}
            target="_blank"
            rel="noopener noreferrer"
            className="contact-btn telegram"
          >
            <FaTelegram /> {translateMode ? 'Telegram' : 'تيليغرام'}
          </a>
        )}
      </div>

      <button className="details-btn" onClick={handleDetails}>
        {translateMode ? 'Details' : 'تفاصيل'}
      </button>
    </div>
  );
};

export default OfficeCard;
