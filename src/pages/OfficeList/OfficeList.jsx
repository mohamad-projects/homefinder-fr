import React, { useContext, useEffect } from 'react';
import { DarkModeContext } from '../../context/DarkModeContext';
import OfficeCard from '../OfficeCard/OfficeCard';
import './OfficeList.scss';
import { useDispatch, useSelector } from 'react-redux';
import { getOffice } from '../../features/office/officeSlice';

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
  {
    name: 'مكتب المستقبل العقاري',
    nameEn: 'Future Real Estate',
    address: 'حلب - سيف الدولة',
    addressEn: 'Aleppo - Saif Al-Dawla',
    phone: '+963 933 321 999',
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
  const dispatch = useDispatch();
  const data = useSelector((state) => state.office.office);
  // console.log(data)
  useEffect(()=>{
    dispatch(getOffice())
  },[])
  return (
    <div className="office-list">
      <h1>{translateMode ? 'Real Estate Offices' : 'المكاتب العقارية'}</h1>
      <div className="office-cards-container">
        {data.map((office, idx) => (
          <OfficeCard key={idx} office={office} translateMode={translateMode} />
        ))}
      </div>
    </div>
  );
};

export default OfficeList;
