import React from 'react';
import { FaPhone, FaMapMarkerAlt, FaWhatsapp, FaTelegram } from 'react-icons/fa';
import './OfficeCard.scss';

const OfficeCard = ({ office, translateMode }) => {
  return (
    <div className="office-card">
      <div className="office-info">
        <h2>{translateMode ? office.nameEn : office.name}</h2>
        <p><FaMapMarkerAlt /> {translateMode ? office.addressEn : office.address}</p>
        <p><FaPhone /> {office.phone}</p>
      </div>

      <p className="cta">
        {translateMode ? 'Submit a service or sale request' : 'تقديم طلب بيع أو خدمة'}
      </p>

      <div className="buttons">
        <a
          href={`https://wa.me/${office.whatsapp}`}
          target="_blank"
          rel="noopener noreferrer"
          className="whatsapp"
        >
          <FaWhatsapp />
          {translateMode ? 'WhatsApp' : 'واتساب'}
        </a>

        <a
          href={`https://t.me/${office.telegram}`}
          target="_blank"
          rel="noopener noreferrer"
          className="telegram"
        >
          <FaTelegram />
          {translateMode ? 'Telegram' : 'تيليغرام'}
        </a>
      </div>
    </div>
  );
};

export default OfficeCard;
