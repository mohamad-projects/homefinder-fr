import React, { useContext, useEffect } from 'react';
import { DarkModeContext } from '../../context/DarkModeContext';
import OfficeCard from '../OfficeCard/OfficeCard';
import './OfficeList.scss';
import { useDispatch, useSelector } from 'react-redux';
import { getOffice } from '../../features/office/officeSlice';

const OfficeList = () => {
  const { translateMode } = useContext(DarkModeContext);
  const dispatch = useDispatch();
  const data = useSelector((state) => state.office.office);

  useEffect(() => {
    dispatch(getOffice());
  }, [dispatch]);

  return (
    <div className="office-list">
      <header className="office-header">
        <h1>{translateMode ? 'Real Estate Offices' : 'المكاتب العقارية'}</h1>
        <p className="subtext">
          {translateMode
            ? 'Browse our list of trusted real estate offices'
            : 'تصفح قائمة المكاتب العقارية الموثوقة لدينا'}
        </p>
      </header>

      <div className="office-cards-container">
        {data.map((office, idx) => (
          <OfficeCard key={idx} office={office} translateMode={translateMode} />
        ))}
      </div>
    </div>
  );
};

export default OfficeList;
