// Profile.jsx
import React, { useEffect, useState, useContext } from 'react';
import './Profile.scss';
import { useParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { profile } from '../../features/auth/authSlice';
import { deleteRealEstate } from '../../features/realestate/realEstateSlice';
import { deleteServiceById } from '../../features/auth/authService';
import Display from '../Display/Display';
import { DarkModeContext } from '../../context/DarkModeContext';
import api from '../../services/api';
import AddServiceModal from '../../components/AddServiceModal/AddServiceModal';
import { FaWhatsapp, FaTelegram } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';

const Profile = () => {
  const navigate = useNavigate();

  const dispatch = useDispatch();
  const { id } = useParams();
  const { translateMode } = useContext(DarkModeContext);

  const user = useSelector((state) => state.auth.user);
  const profileData = useSelector((state) => state.auth.profile);

  const [properties, setProperties] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [lastPage, setLastPage] = useState(1);
  const [activeTab, setActiveTab] = useState('real_estate');

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState('create'); // 'create' or 'edit'
  const [serviceToEdit, setServiceToEdit] = useState(null);

  const fetchProfile = async (page = 1) => {
    try {
      const response = await api.get(`/profile/${id}?page=${page}`);
      const result = response.data;

      setProperties(result.data.realEstate || []);
      setCurrentPage(result.meta.realEstate.current_page);
      setLastPage(result.meta.realEstate.last_page);
      dispatch(profile(id));
    } catch (err) {
      console.error('Error fetching profile:', err);
    }
  };
console.log()
  useEffect(() => {
    fetchProfile(currentPage);
  }, [dispatch, id]);

const handleDelete = (itemId, type) => {
  const confirmMessage = translateMode
    ? (type === 'real_estate'
        ? 'Are you sure you want to delete this property?'
        : 'Are you sure you want to delete this service?')
    : (type === 'real_estate'
        ? 'هل أنت متأكد من حذف هذا العقار؟'
        : 'هل أنت متأكد من حذف هذه الخدمة؟');

  if (window.confirm(confirmMessage)) {
    if (type === 'real_estate') {
      dispatch(deleteRealEstate(itemId));
      setProperties((prev) => prev.filter((item) => item.id !== itemId));
    } else if (type === 'service') {
      dispatch(deleteServiceById(itemId)).then(() => {
        dispatch(profile(id));
      });
    }
  }
};
 const handleUpdate= (id) => {
    navigate(`/property/update/${id}`);
  };
  const handleEditService = (service) => {
    setServiceToEdit(service);
    setModalMode('edit');
    setIsModalOpen(true);
  };

  const handlePageChange = (page) => {
    if (page >= 1 && page <= lastPage) {
      fetchProfile(page);
    }
  };

  const handleServiceAdded = () => {
    dispatch(profile(id));
  };

  const showActions = user?.id === profileData?.user?.id;

  const phoneNumber = profileData?.contact?.phone || '';
  const telegramUsername = profileData?.contact?.telegram || '';

  return (
    <div className="app-container profile-container">
      <div className="profile-header">
        <h1>{profileData?.user?.name}'s Profile</h1>
        <div className="user-meta">
          <span className={`status-badge ${profileData?.user?.status?.toLowerCase()}`}>
            {profileData?.user?.status}
          </span>
          <span>{translateMode ? `Joined: ${profileData?.user?.join_date}` : `انضم: ${profileData?.user?.join_date}`}</span>
        </div>
      </div>

      <div className="contact-section">
        <h2>{translateMode ? 'Contact Information' : 'معلومات الاتصال'}</h2>
        <div className="contact-details">
          <p><strong>{translateMode ? 'Address:' : 'العنوان:'}</strong> {profileData?.address?.full_address || (translateMode ? 'Not provided' : 'غير متوفر')}</p>
          <p><strong>{translateMode ? 'Phone:' : 'الهاتف:'}</strong> {phoneNumber || (translateMode ? 'Not provided' : 'غير متوفر')}</p>
          <p><strong>{translateMode ? 'Email:' : 'البريد الإلكتروني:'}</strong> {profileData?.user?.email}</p>
        </div>

        {/* أزرار واتساب وتليجرام */}
        <div className="contact-buttons">
          {phoneNumber && (
            <a
              href={`https://wa.me/${phoneNumber}`}
              target="_blank"
              rel="noopener noreferrer"
              className="contact-btn whatsapp-btn"
              aria-label={translateMode ? 'Contact via WhatsApp' : 'الاتصال عبر واتساب'}
            >
              <FaWhatsapp /> {translateMode ? 'WhatsApp' : 'واتساب'}
            </a>
          )}
          {telegramUsername && (
            <a
              href={`https://t.me/${telegramUsername}`}
              target="_blank"
              rel="noopener noreferrer"
              className="contact-btn telegram-btn"
              aria-label={translateMode ? 'Contact via Telegram' : 'الاتصال عبر تيليجرام'}
            >
              <FaTelegram /> {translateMode ? 'Telegram' : 'تيليجرام'}
            </a>
          )}
        </div>
      </div>

      <div className="listings-section">
        <div className="tabs">
          <button
            className={`tab-button ${activeTab === 'real_estate' ? 'active' : ''}`}
            onClick={() => setActiveTab('real_estate')}
          >
            {translateMode ? 'Real Estate' : 'العقارات'}
          </button>
          <button
            className={`tab-button ${activeTab === 'services' ? 'active' : ''}`}
            onClick={() => setActiveTab('services')}
          >
            {translateMode ? 'Services' : 'الخدمات'}
          </button>

          {showActions && activeTab === 'services' && (
            <button
              className="add-service-btn"
              onClick={() => {
                setModalMode('create');
                setServiceToEdit(null);
                setIsModalOpen(true);
              }}
            >
              + {translateMode ? 'Add Service' : 'إضافة خدمة'}
            </button>
          )}
        </div>

        <div className="listings-content">
          {activeTab === 'real_estate' ? (
            properties?.length > 0 ? (
            <Display
           properties={properties}
            translateMode={translateMode}
            isProfile={true}
            currentUserId={user?.id}
           profileUserId={profileData?.user?.id}
  onDelete={(id) => handleDelete(id, 'real_estate')}
  onEdit={handleUpdate}
  currentPage={currentPage}
  lastPage={lastPage}
  handlePageChange={handlePageChange}
  showActions={showActions}
/>

            ) : (
              <p className="no-data">{translateMode ? 'No real estate listings available.' : 'لا توجد قوائم عقارية.'}</p>
            )
          ) : (
            profileData?.service?.length > 0 ? (
              <div className="services-list">
                {profileData.service.map((service) => (
                  <div key={service.id} className="service-item">
                    <div className="item-header">
                      <h3>{translateMode ? `Service #${service.id}` : `خدمة #${service.id}`}</h3>
                      {user?.id === service.user_id && (
                        <div className="item-actions">
                          <button
                            className="action-btn update-btn"
                            onClick={() => handleEditService(service)}
                          >
                            {translateMode ? 'Update' : 'تحديث'}
                          </button>
                          <button
                            className="action-btn delete-btn"
                            onClick={() => handleDelete(service.id, 'service')}
                          >
                            {translateMode ? 'Delete' : 'حذف'}
                          </button>
                        </div>
                      )}
                    </div>
                    <p><strong>{translateMode ? 'Title:' : 'العنوان:'}</strong> {service.title || (translateMode ? 'No title' : 'بدون عنوان')}</p>
                    <p><strong>{translateMode ? 'Description:' : 'الوصف:'}</strong> {service.description || (translateMode ? 'No description' : 'بدون وصف')}</p>
                  </div>
                ))}
              </div>
            ) : (
              <p className="no-data">{translateMode ? 'No services available.' : 'لا توجد خدمات.'}</p>
            )
          )}
        </div>
      </div>

      <AddServiceModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onServiceAdded={handleServiceAdded}
        mode={modalMode}
        serviceToEdit={serviceToEdit}
      />
    </div>
  );
};

export default Profile;
