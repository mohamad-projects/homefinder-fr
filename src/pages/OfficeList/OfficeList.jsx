import React, { useContext } from 'react';
import { DarkModeContext } from '../../context/DarkModeContext';
import OfficeCard from '../OfficeCard/OfficeCard';
import './OfficeList.scss';

const offices = [
  {
    name: 'مكتب الحياة العقاري',
    nameEn: 'Al-Hayat Real Estate',
    address: 'دمشق - المالكي - قرب حديقة الأجهزة',
    addressEn: 'Damascus - Malki - Near Ajahez Park',
    phone: '+963 944 123 456',
    whatsapp: '963949221604',
      telegram: 'tofick_babbily',
  },
  {
    name: 'مكتب النخبة العقاري',
    nameEn: 'Elite Real Estate',
    address: 'حمص - شارع الحضارة',
    addressEn: 'Homs - Civilization Street',
    phone: '+963 944 987 654',
    whatsapp: '963949221604',
    telegram: 'tofick_babbily',
  },
  {
    name: 'مكتب المستقبل العقاري',
    nameEn: 'Future Real Estate',
    address: 'حلب - سيف الدولة',
    addressEn: 'Aleppo - Saif Al-Dawla',
    phone: '+963 933 321 999',
    whatsapp: '963949221604',
    telegram: 'tofick_babbily',
  },
];

const OfficeList = () => {
  const { translateMode } = useContext(DarkModeContext);

  return (
    <div className="office-list">
      <h1>{translateMode ? 'Real Estate Offices' : 'المكاتب العقارية'}</h1>
      <div className="office-cards-container">
        {offices.map((office, idx) => (
          <OfficeCard key={idx} office={office} translateMode={translateMode} />
        ))}
      </div>
    </div>
  );
};

export default OfficeList;
