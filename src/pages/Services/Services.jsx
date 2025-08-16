import React, { useEffect, useContext } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import {
  getAllServiceTypes,
  getServiceInfoById,
  setSelectedServiceId,
} from '../../features/auth/authService';
import './Services.scss';
import { DarkModeContext } from '../../context/DarkModeContext'; // استيراد context الترجمة

const Services = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const {
    services,
    loading,
    error,
    selectedServiceId,
    selectedServiceInfo,
  } = useSelector((state) => state.services);

  const { translateMode } = useContext(DarkModeContext);

  useEffect(() => {
    dispatch(getAllServiceTypes());
  }, [dispatch]);

  const handleSelectService = (id) => {
    dispatch(setSelectedServiceId(id));
    dispatch(getServiceInfoById(id));
  };

  const handleNavigateToPublisher = (userId) => {
    navigate(`/profile/${userId}`);
  };

  return (
    <div className='page'>
    <div className="services-container">
      <h2 className="title">{translateMode ? 'Our Services' : 'خدماتنا'}</h2>

      {loading && <p>{translateMode ? 'Loading services...' : 'جاري تحميل الخدمات...'}</p>}
      {error && <p className="error">{translateMode ? 'Error occurred:' : 'حدث خطأ:'} {error}</p>}

      <div className="services-grid">
        {services.map((service) => (
          <div
            key={service.id}
            className={`service-card ${selectedServiceId === service.id ? 'selected' : ''}`}
            onClick={() => handleSelectService(service.id)}
          >
            <h3>{service.type}</h3>
          </div>
        ))}
      </div>

      {Array.isArray(selectedServiceInfo) && selectedServiceInfo.length > 0 && (
        <div className="service-info">
          <h3>{translateMode ? 'Service Categories:' : 'الأصناف الخاصة بالخدمة:'}</h3>
          <div className="subservices-grid">
            {selectedServiceInfo.map((info) => (
              <div key={info.id} className="subservice-card">
                <h4>{info.title}</h4>
                <p>{info.description}</p>
                <small>
                  {translateMode ? 'Service Publisher:' : 'ناشر الخدمة:'}{' '}
                  <span
                    className="publisher-link"
                    onClick={() => handleNavigateToPublisher(info.users_info?.id)}
                    style={{ cursor: 'pointer', textDecoration: 'underline' }}
                  >
                    {info.users_info?.name || (translateMode ? 'Unknown' : 'غير معروف')}
                  </span>
                </small>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
    </div>
  );
};

export default Services;
