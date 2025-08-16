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

// استيراد مكونات المقارنة
import ComparisonModal from '../ComparisonModal/ComparisonModal';
import ComparisonPreferencesModal from '../ComparisonPreferencesModal/ComparisonPreferencesModal';
import { getTranslations, getTranslatedOptions } from '../../TRANSLATIONS'; // تأكد من استيراد هذه

// استيراد مكونات المودال الجديدة
import SuccessModal from '../../components/SuccessModal';
import ErrorModal from '../../components/ErrorModal';
import ConfirmationModal from '../../components/ConfirmationModal';

const Profile = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { id } = useParams();
  const { translateMode } = useContext(DarkModeContext);

  const t = getTranslations(translateMode); // الحصول على الترجمات
  const options = getTranslatedOptions(translateMode); // الحصول على الخيارات المترجمة

  const user = useSelector((state) => state.auth.user);
  const profileData = useSelector((state) => state.auth.profile);

  const [properties, setProperties] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [lastPage, setLastPage] = useState(1);
  const [activeTab, setActiveTab] = useState('real_estate');

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState('create'); // 'create' or 'edit'
  const [serviceToEdit, setServiceToEdit] = useState(null);

  // حالات جديدة للمقارنة
  const [idsToCompare, setIdsToCompare] = useState({ id1: null, id2: null });
  const [showPreferencesModal, setShowPreferencesModal] = useState(false);
  const [comparisonResults, setComparisonResults] = useState(null);
  const [showResultsModal, setShowResultsModal] = useState(false);

  // حالات المودال المخصصة
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [showErrorModal, setShowErrorModal] = useState(false);
  const [showConfirmationModal, setShowConfirmationModal] = useState(false);
  const [modalMessage, setModalMessage] = useState('');
  const [actionToConfirm, setActionToConfirm] = useState(null);

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
      setModalMessage(translateMode ? 'Error fetching profile data.' : 'حدث خطأ أثناء جلب بيانات الملف الشخصي.');
      setShowErrorModal(true);
    }
  };

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

    setModalMessage(confirmMessage);
    setShowConfirmationModal(true);
    setActionToConfirm({ itemId, type });
  };

  const confirmDelete = async () => {
    setShowConfirmationModal(false);
    const { itemId, type } = actionToConfirm;

    try {
      if (type === 'real_estate') {
        await dispatch(deleteRealEstate(itemId)).unwrap();
        setProperties((prev) => prev.filter((item) => item.id !== itemId));
        setModalMessage(translateMode ? 'Property deleted successfully!' : 'تم حذف العقار بنجاح!');
      } else if (type === 'service') {
        await dispatch(deleteServiceById(itemId)).unwrap();
        dispatch(profile(id)); // Refetch profile to update services list
        setModalMessage(translateMode ? 'Service deleted successfully!' : 'تم حذف الخدمة بنجاح!');
      }
      setShowSuccessModal(true);
    } catch (error) {
      console.error('Error deleting item:', error);
      setModalMessage(translateMode ? 'Failed to delete item.' : 'فشل حذف العنصر.');
      setShowErrorModal(true);
    } finally {
      setActionToConfirm(null);
    }
  };

  const handleUpdate = (id) => {
    navigate(`/property/update/${id}`);
  };

  const handleEditService = (service) => {
    setServiceToEdit(service);
    setModalMode('edit');
    setIsModalOpen(true);
  };

  const handleServiceAdded = () => {
    dispatch(profile(id));
    setIsModalOpen(false); // Close modal after adding/editing service
    setModalMessage(translateMode ? 'Service saved successfully!' : 'تم حفظ الخدمة بنجاح!');
    setShowSuccessModal(true);
  };

  const handlePageChange = (page) => {
    if (page >= 1 && page <= lastPage) {
      fetchProfile(page);
    }
  };

  const showActions = user?.id === profileData?.user?.id;

  const phoneNumber = profileData?.contact?.phone || '';
  const telegramUsername = profileData?.contact?.telegram || '';

  // وظائف المقارنة الجديدة
  const handlePropertiesSelected = (id1, id2) => {
    setIdsToCompare({ id1, id2 });
    setShowPreferencesModal(true);
  };

  const handleInitiateComparison = async (preferences) => {
    setShowPreferencesModal(false);

    if (!idsToCompare.id1 || !idsToCompare.id2) {
      console.error("Error: Property IDs not set for comparison.");
      setModalMessage(t.common.comparisonError || (translateMode ? 'Failed to compare properties (IDs missing).' : 'فشل مقارنة العقارات (المعرفات مفقودة).'));
      setShowErrorModal(true);
      return;
    }

    try {
      const filteredPreferences = Object.fromEntries(
        Object.entries(preferences).filter(([key, value]) => {
          return value !== null && value !== undefined && (typeof value === 'string' ? value.trim() !== '' : true);
        })
      );

      if (filteredPreferences.max_price) filteredPreferences.max_price = Number(filteredPreferences.max_price);
      if (filteredPreferences.min_price) filteredPreferences.min_price = Number(filteredPreferences.min_price);
      if (filteredPreferences.min_rooms) filteredPreferences.min_rooms = Number(filteredPreferences.min_rooms);
      if (filteredPreferences.min_space_status) filteredPreferences.min_space_status = Number(filteredPreferences.min_space_status);

      const response = await api.post('RealEstate/compare', {
        real_estate_id_1: idsToCompare.id1,
        real_estate_id_2: idsToCompare.id2,
        preferences: filteredPreferences
      }, {
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
      });

      console.log('Comparison API Response:', response.data);
      setComparisonResults(response.data);
      setShowResultsModal(true);

    } catch (error) {
      console.error('Error during property comparison:', error.response ? error.response.data : error.message);
      setModalMessage(t.common.comparisonError || (translateMode ? 'An error occurred during comparison.' : 'حدث خطأ أثناء المقارنة.'));
      setShowErrorModal(true);
    } finally {
      setIdsToCompare({ id1: null, id2: null });
    }
  };

  return (
    <div className='pageprofile'>
      <div className="app-container profile-container">
        <div className="profile-header">
          <h1>{profileData?.user?.name} Profile</h1>
          <div className="user-meta">

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
                  onPropertiesSelectedForCompare={handlePropertiesSelected}
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

        {/* إضافة مودالات المقارنة هنا */}
        <ComparisonPreferencesModal
          isOpen={showPreferencesModal}
          onClose={() => setShowPreferencesModal(false)}
          onCompare={handleInitiateComparison}
          translateMode={translateMode}
          options={options}
        />

        <ComparisonModal
          isOpen={showResultsModal}
          onClose={() => setShowResultsModal(false)}
          comparisonData={comparisonResults}
        />

        {/* مودالات التأكيد والنجاح والخطأ */}
        {showConfirmationModal && (
          <ConfirmationModal
            message={modalMessage}
            onConfirm={confirmDelete}
            onCancel={() => {
              setShowConfirmationModal(false);
              setActionToConfirm(null);
            }}
            confirmText={translateMode ? 'Yes, Delete' : 'نعم، احذف'}
            cancelText={translateMode ? 'Cancel' : 'إلغاء'}
          />
        )}

        {showSuccessModal && (
          <SuccessModal
            message={modalMessage}
            onClose={() => setShowSuccessModal(false)}
          />
        )}

        {showErrorModal && (
          <ErrorModal
            message={modalMessage}
            onClose={() => setShowErrorModal(false)}
          />
        )}
      </div>
    </div>
  );
};

export default Profile;