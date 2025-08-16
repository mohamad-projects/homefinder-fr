import React, { useState, useContext, useEffect } from 'react';
import { DarkModeContext } from '../../context/DarkModeContext';
import {
  FaMoneyBillWave, FaBuilding, FaSpinner, FaExclamationCircle, FaCheckCircle,
  FaTree, FaCar, FaSolarPanel, FaWater, FaDirections, FaBolt, FaShower, FaHome
} from 'react-icons/fa';
import { MdApartment, MdVilla, MdCabin, MdElevator } from 'react-icons/md';
import MapPicker from '../../MapPicker';
import './EditHome.scss';
import useAuth from './../../hooks/useAuth';
import useLocation from './../../hooks/useLocation';
import { useDispatch, useSelector } from 'react-redux';
import { useRealEstateForm } from '../../hooks/useRealEstateForm';
import FeatureToggle from './../../components/FeatureToggle/FeatureToggle ';
import { useParams, useNavigate } from 'react-router-dom';
import { getRealEstateDetails } from '../../features/auth/authSlice';
import api from './../../services/api';

// استيراد مكونات المودال الجديدة
import SuccessModal from '../../components/SuccessModal';
import ErrorModal from '../../components/ErrorModal';
import ConfirmationModal from '../../components/ConfirmationModal';

const EditHome = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { translateMode } = useContext(DarkModeContext);
  const { user } = useAuth();
  const { loaction: locationsData, loading: locationsLoading, error: locationsError } = useLocation();
  const dispatch = useDispatch();

  const [initialDataLoaded, setInitialDataLoaded] = useState(false);

  const featuresConfig = [
    {
      name: 'garden_status',
      icon: 'FaTree',
      label: translateMode ? 'Garden' : 'حديقة',
      options: [1, 2],
      labels: translateMode ? ['Yes', 'No'] : ['نعم', 'لا'],
    },
    {
      name: 'elevator',
      icon: 'MdElevator',
      label: translateMode ? 'Elevator' : 'مصعد',
      options: [1, 2], // 1: Yes, 2: No
      labels: translateMode ? ['Yes', 'No'] : ['نعم', 'لا'],
    },
    {
      name: 'garage',
      icon: 'FaCar',
      label: translateMode ? 'Garage' : 'كراج',
      options: [1, 2], // 1: Yes, 2: No
      labels: translateMode ? ['Yes', 'No'] : ['نعم', 'لا'],
    },
    {
      name: 'water_well',
      icon: 'FaWater',
      label: translateMode ? 'Water Well' : 'بئر ماء',
      options: [1, 2], // 1: Yes, 2: No
      labels: translateMode ? ['Yes', 'No'] : ['نعم', 'لا'],
    },
    {
      name: 'solar_energy',
      icon: 'FaSolarPanel',
      label: translateMode ? 'Solar Energy' : 'طاقة شمسية',
      options: [1, 2], // 1: Yes, 2: No
      labels: translateMode ? ['Yes', 'No'] : ['نعم', 'لا'],
    },
    {
      name: 'transportation_status',
      icon: 'FaDirections',
      label: translateMode ? 'Transportation' : 'مواصلات',
      options: [1, 2, 3], // 1: Excellent, 2: Good, 3: None
      labels: translateMode ? ['Excellent', 'Good', 'None'] : ['ممتاز', 'جيد', 'لا يوجد'],
    },
    {
      name: 'electricity_status',
      icon: 'FaBolt',
      label: translateMode ? 'Electricity' : 'كهرباء',
      options: [1, 2, 3], // 1: Available, 2: Poor, 3: None
      labels: translateMode ? ['Available', 'Poor', 'None'] : ['متاحة', 'ضعيفة', 'لا يوجد'],
    },
    {
      name: 'water_status',
      icon: 'FaShower',
      label: translateMode ? 'Water' : 'ماء',
      options: [1, 2, 3],
      labels: translateMode ? ['Available', 'Poor', 'None'] : ['متاح', 'ضعيف', 'لا يوجد'],
    },
  ];

  const {
    formData,
    setFormData,
    activeStep,
    handleInputChange,
    handleLocationSelect,
    nextStep,
    prevStep,
    formValidationErrors,
    validateStep,
  } = useRealEstateForm(user, translateMode);

  // حالات المودال المخصصة
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [showErrorModal, setShowErrorModal] = useState(false);
  const [showConfirmationModal, setShowConfirmationModal] = useState(false);
  const [modalMessage, setModalMessage] = useState('');
  const [localLoading, setLocalLoading] = useState(false);

  // تحميل بيانات العقار عند التحميل الأولي
  useEffect(() => {
    const fetchRealEstateData = async () => {
      try {
        const response = await dispatch(getRealEstateDetails(id)).unwrap();

        setFormData({
          ...formData,
          type: response.type ? response.type.charAt(0).toUpperCase() + response.type.slice(1).toLowerCase() : '',
          kind: response.kind ? response.kind.charAt(0).toUpperCase() + response.kind.slice(1).toLowerCase() : '',
          real_estate_location_id: response.real_estate_location_id,
          latitude: response.latitude,
          longitude: response.longitude,
          description: response.description,
          price: response.price,
          room_no: response.properties?.room_no,
          bathroom_no: response.properties?.bathroom_no || 0,
          ownership_type: response.properties?.ownership_type ? response.properties.ownership_type.charAt(0).toUpperCase() + response.properties.ownership_type.slice(1).toLowerCase() : '',
          floor: response.properties?.floor,
          space_status: response.properties?.space_status,
          direction: parseInt(response.properties?.direction), // التأكد من أن الاتجاه يتم تحويله إلى عدد صحيح
          electricity_status: parseInt(response.properties?.electricity_status),
          water_status: parseInt(response.properties?.water_status),
          transportation_status: parseInt(response.properties?.transportation_status),
          water_well: parseInt(response.properties?.water_well),
          solar_energy: parseInt(response.properties?.solar_energy),
          garage: parseInt(response.properties?.garage),
          elevator: parseInt(response.properties?.elevator),
          garden_status: parseInt(response.properties?.garden_status),
        });

        setInitialDataLoaded(true);
      } catch (error) {
        console.error('Error fetching real estate details:', error);
        setModalMessage(translateMode ? 'Failed to load property data.' : 'فشل تحميل بيانات العقار.');
        setShowErrorModal(true);
      }
    };

    if (id && !initialDataLoaded) {
      fetchRealEstateData();
    }
  }, [id, dispatch, initialDataLoaded, setFormData, formData, translateMode]);

  const t = {
    editPropertyTitle: translateMode ? 'Edit Property' : 'تعديل العقار',
    stepPropertyType: translateMode ? 'Property Type' : 'نوع العقار',
    stepLocation: translateMode ? 'Location' : 'الموقع',
    stepDetails: translateMode ? 'Details' : 'التفاصيل',
    listingType: translateMode ? 'Listing Type' : 'نوع الإعلان',
    forSale: translateMode ? 'For Sale' : 'للبيع',
    forRent: translateMode ? 'For Rent' : 'للإيجار',
    propertyCategory: translateMode ? 'Property Category' : 'تصنيف العقار',
    selectLocation: translateMode ? 'Select Location' : 'اختر موقع',
    selectLocationOnMap: translateMode ? 'Select Property Location on Map' : 'حدد موقع العقار على الخريطة',
    selectedLocation: translateMode ? 'Selected Location:' : 'الموقع المحدد:',
    propertyInformation: translateMode ? 'Property Information' : 'معلومات العقار',
    detailedDescription: translateMode ? 'Detailed Description' : 'الوصف التفصيلي',
    specifications: translateMode ? 'Specifications' : 'مواصفات العقار',
    price: translateMode ? 'Price' : 'السعر',
    numRooms: translateMode ? 'Number of Rooms' : 'عدد الغرف',
    bathroomNo: translateMode ? 'Number of Bathrooms' : 'عدد الحمامات',
    ownershipType: translateMode ? 'Ownership Type' : 'نوع الملكية',
    ownershipGreen: translateMode ? 'Green' : 'أخضر',
    ownershipCourt: translateMode ? 'Court' : 'محكمة',
    floorNumber: translateMode ? 'Floor Number' : 'رقم الطابق',
    space: translateMode ? 'Space (m²)' : 'المساحة (m²)',
    direction: translateMode ? 'Direction' : 'الاتجاه',
    features: translateMode ? 'Features' : 'المميزات',
    updateProperty: translateMode ? 'Update Property' : 'تحديث العقار',
    propertyUpdatedSuccess: translateMode ? 'Property updated successfully!' : 'تم تعديل العقار بنجاح!',
    propertyUpdateFailed: translateMode ? 'Failed to update property. Please check inputs and try again.' : 'فشل تعديل العقار. الرجاء التحقق من المدخلات والمحاولة مرة أخرى.',
    fetchingLocations: translateMode ? 'Fetching locations...' : 'جاري جلب المواقع...',
    locationsLoadError: translateMode ? 'Failed to load locations.' : 'فشل تحميل المواقع.',
    noLocationsAvailable: translateMode ? 'No locations available.' : 'لا توجد مواقع متاحة.',
    next: translateMode ? 'Next' : 'التالي',
    previous: translateMode ? 'Previous' : 'السابق',
    confirmUpdate: translateMode ? "Are you sure you want to update this property?" : "هل أنت متأكد من تعديل العقار؟",
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLocalLoading(true);
    setModalMessage(''); // مسح الرسالة السابقة
    setShowErrorModal(false); // إخفاء مودال الخطأ السابق
    setShowSuccessModal(false); // إخفاء مودال النجاح السابق (لضمان حالة نظيفة)

    const isStepValid = validateStep(activeStep);
    if (!isStepValid) {
      const firstErrorKey = Object.keys(formValidationErrors)[0];
      if (firstErrorKey) {
        setModalMessage(formValidationErrors[firstErrorKey]);
        setShowErrorModal(true);
      } else {
        setModalMessage(t.propertyUpdateFailed);
        setShowErrorModal(true);
      }
      setLocalLoading(false);
      return;
    }

    if (activeStep < 3) {
      nextStep();
      setLocalLoading(false);
      return;
    }

    // Show confirmation modal before final submission
    setModalMessage(t.confirmUpdate);
    setShowConfirmationModal(true);
  };

  const confirmSubmit = async () => {
    setShowConfirmationModal(false);
    setLocalLoading(true); // إعادة تمكين حالة التحميل عند بدء الإرسال الفعلي
    setModalMessage(''); // مسح الرسالة السابقة قبل محاولة الإرسال

    const dataToSend = { ...formData };

    Object.keys(dataToSend).forEach(key => {
      if (dataToSend[key] === null || dataToSend[key] === undefined || dataToSend[key] === '') {
        delete dataToSend[key];
        return;
      }

      let value = dataToSend[key];

      if (key === 'type' || key === 'kind' || key === 'ownership_type') {
        value = String(value);
      }
      else if (['price', 'room_no', 'bathroom_no', 'floor', 'space_status'].includes(key)) {
        value = Number(value);
        if (isNaN(value)) {
          value = 0;
        }
      }
      // Keep direction and other statuses as strings for API
      else if (['electricity_status', 'water_status', 'transportation_status', 'water_well',
        'solar_energy', 'garage', 'elevator', 'garden_status', 'attired', 'direction'].includes(key)) {
        value = String(value);
      }
      else {
        value = String(value);
      }
      dataToSend[key] = value;
    });

    if (user && user.id) {
      dataToSend.user_id = String(user.id);
    } else {
      console.warn("User ID is missing, API might reject the request.");
      setModalMessage(translateMode ? "User not authenticated." : "المستخدم غير موثق.");
      setShowErrorModal(true);
      setLocalLoading(false);
      return;
    }

    if (dataToSend.status === null || dataToSend.status === undefined) {
      dataToSend.status = "open";
    } else {
      dataToSend.status = String(dataToSend.status).toLowerCase();
    }

    try {
      const response = await api.post(`/RealEstate/update/${id}`, dataToSend, {
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
      });

      if (response.data && response.data.message &&
        response.data.message === "Real estate updated successfully") {
        setModalMessage(t.propertyUpdatedSuccess);
        setShowSuccessModal(true);
      } else {
        setModalMessage(response.data?.message || t.propertyUpdateFailed);
        setShowErrorModal(true);
      }

    } catch (error) {
      console.error('Error updating property (direct axios):', error);
      let detailedMessage = translateMode
        ? 'Failed to update property. Please check inputs and try again.'
        : 'فشل تعديل العقار. الرجاء مراجعة البيانات المدخلة والمحاولة مرة أخرى.';

      if (error.response && error.response.data) {
        if (error.response.data.errors && typeof error.response.data.errors === 'object') {
          const allErrors = Object.values(error.response.data.errors).flat();
          detailedMessage = allErrors.join(', ') || detailedMessage;
        } else if (error.response.data.message) {
          detailedMessage = error.response.data.message;
        }
      } else if (error.message) {
        detailedMessage = error.message;
      }

      setModalMessage(detailedMessage);
      setShowErrorModal(true);
    } finally {
      setLocalLoading(false); // تأكد من إيقاف التحميل دائمًا
    }
  };

  const handleSuccessModalClose = () => {
    setShowSuccessModal(false);
    navigate(-1); // الانتقال إلى صفحة الملف الشخصي بعد إغلاق مودال النجاح
  };

  const preventEnterSubmit = (e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
    }
  };

  const locations = locationsData?.data || [];

  if (!initialDataLoaded) {
    return (
      <div className="loading-container">
        <FaSpinner className="spinner" />
        <p>{translateMode ? 'Loading property...' : 'جاري تحميل بيانات العقار...'}</p>
      </div>
    );
  }

  return (
    <div className="add-home-page">
      <div className="form-container">
        <h1 className="page-title">{t.editPropertyTitle}</h1>

        <div className="progress-steps">
          {[1, 2, 3].map(step => (
            <div
              key={step}
              className={`step ${step === activeStep ? 'active' : ''} ${step < activeStep ? 'completed' : ''}`}
            >
              <div className="step-number">{step}</div>
              <div className="step-label">
                {translateMode ?
                  [t.stepPropertyType, t.stepLocation, t.stepDetails][step - 1] :
                  [t.stepPropertyType, t.stepLocation, t.stepDetails][step - 1]
                }
              </div>
            </div>
          ))}
        </div>

        {/* مؤشر التحميل يمكن أن يبقى هنا */}
        {localLoading && (
          <p className="status-message loading-message">
            <FaSpinner className="spinner" /> {t.updateProperty}
          </p>
        )}

        <form onSubmit={handleSubmit} className="property-form">
          {/* Step 1: Type & Category */}
          {activeStep === 1 && (
            <div className="form-step">
              <div className="form-section card">
                <h2>{t.listingType}</h2>
                <div className="type-selector">
                  {['Sale', 'Rental'].map(typeOption => (
                    <label key={typeOption} className={`type-option ${formData.type === typeOption ? 'active' : ''}`}>
                      <input
                        type="radio"
                        name="type"
                        value={typeOption}
                        checked={formData.type === typeOption}
                        onChange={handleInputChange}
                      />
                      {translateMode ? (typeOption === 'Sale' ? t.forSale : t.forRent) : (typeOption === 'Sale' ? t.forSale : t.forRent)}
                    </label>
                  ))}
                </div>
                {formValidationErrors?.type && <p className="validation-error"><FaExclamationCircle /> {formValidationErrors.type}</p>}
              </div>

              <div className="form-section card">
                <h2>{t.propertyCategory}</h2>
                <div className="category-grid">
                  {[
                    { value: 'Apartment', icon: <MdApartment />, label: translateMode ? 'Apartment' : 'شقة' },
                    { value: 'Villa', icon: <MdVilla />, label: translateMode ? 'Villa' : 'فيلا' },
                    { value: 'Chalet', icon: <MdCabin />, label: translateMode ? 'Chalet' : 'شاليه' },
                  ].map(category => (
                    <label
                      key={category.value}
                      className={`category-option ${formData.kind === category.value ? 'active' : ''}`}
                    >
                      <input
                        type="radio"
                        name="kind"
                        value={category.value}
                        checked={formData.kind === category.value}
                        onChange={handleInputChange}
                      />
                      <div className="category-icon">{category.icon}</div>
                      <span>{category.label}</span>
                    </label>
                  ))}
                </div>
                {formValidationErrors?.kind && <p className="validation-error"><FaExclamationCircle /> {formValidationErrors.kind}</p>}
              </div>
            </div>
          )}

          {/* Step 2: Location */}
          {activeStep === 2 && (
            <div className="form-step">
              <div className="form-section card">
                <h2>{t.selectLocation}</h2>
                <div className="filter-dropdown">
                  <select
                    value={formData.real_estate_location_id}
                    onChange={(e) => setFormData({ ...formData, real_estate_location_id: e.target.value })}
                  >
                    <option value="">{t.selectLocation}</option>
                    {locationsLoading && <option disabled>{t.fetchingLocations}</option>}
                    {locationsError && <option disabled>{t.locationsLoadError}</option>}
                    {!locationsLoading && !locationsError && locations.length === 0 && (
                      <option disabled>{t.noLocationsAvailable}</option>
                    )}
                    {locations.map((loc) => (
                      <option key={loc.id} value={loc.id}>
                        {loc.city} - {loc.district}
                      </option>
                    ))}
                  </select>
                </div>
                {formValidationErrors?.real_estate_location_id && <p className="validation-error"><FaExclamationCircle /> {formValidationErrors.real_estate_location_id}</p>}
              </div>

              <div className="form-section card">
                <h2>{t.selectLocationOnMap}</h2>
                <MapPicker
                  onSelect={handleLocationSelect}
                  initialLocation={
                    formData.latitude && formData.longitude ?
                      { lat: parseFloat(formData.latitude), lng: parseFloat(formData.longitude) } :
                      null
                  }
                />
                {(formData.latitude && formData.longitude) && (
                  <div className="coordinates-display">
                    <p>
                      {t.selectedLocation}
                      <span> {parseFloat(formData.latitude).toFixed(5)}, {parseFloat(formData.longitude).toFixed(5)}</span>
                    </p>
                  </div>
                )}
                {formValidationErrors?.latitude && <p className="validation-error"><FaExclamationCircle /> {formValidationErrors.latitude}</p>}
                {formValidationErrors?.longitude && <p className="validation-error"><FaExclamationCircle /> {formValidationErrors.longitude}</p>}
              </div>
            </div>
          )}

          {/* Step 3: Details and Features (Final Step) */}
          {activeStep === 3 && (
            <div className="form-step">
              <div className="form-section card">
                <h2>{t.propertyInformation}</h2>
                <div className="input-group floating-label full-width">
                  <textarea
                    name="description"
                    value={formData.description}
                    onChange={handleInputChange}
                    onKeyDown={preventEnterSubmit}
                    rows="5"
                    placeholder={t.detailedDescription}
                    required
                  />
                </div>
                {formValidationErrors?.description && <p className="validation-error"><FaExclamationCircle /> {formValidationErrors.description}</p>}
              </div>

              <div className="form-section card">
                <h2>{t.specifications}</h2>
                <div className="specs-grid">
                  <div className="input-group floating-label icon-input">
                    <FaMoneyBillWave className="input-icon" />
                    <input
                      type="number"
                      name="price"
                      value={formData.price === 0 ? '' : formData.price}
                      onChange={handleInputChange}
                      placeholder={t.price}
                      onKeyDown={preventEnterSubmit}
                      required
                    />
                  </div>
                  {formValidationErrors?.price && <p className="validation-error"><FaExclamationCircle /> {formValidationErrors.price}</p>}

                  <div className="input-group floating-label">
                    <input
                      type="number"
                      name="room_no"
                      value={formData.room_no === 0 ? '' : formData.room_no}
                      onChange={handleInputChange}
                      placeholder={t.numRooms}
                      onKeyDown={preventEnterSubmit}
                    />
                  </div>
                  {formValidationErrors?.room_no && <p className="validation-error"><FaExclamationCircle /> {formValidationErrors.room_no}</p>}

                  {/* قائمة منسدلة لنوع الملكية */}
                  <div className="input-group floating-label">
                    <select
                      name="ownership_type"
                      value={formData.ownership_type}
                      onChange={handleInputChange}
                    >
                      <option value="">{t.ownershipType}</option>
                      <option value="Green">{t.ownershipGreen}</option>
                      <option value="Court">{t.ownershipCourt}</option>
                    </select>
                  </div>
                  {formValidationErrors?.ownership_type && <p className="validation-error"><FaExclamationCircle /> {formValidationErrors.ownership_type}</p>}

                  <div className="input-group floating-label">
                    <input
                      type="number"
                      name="floor"
                      value={formData.floor === 0 ? '' : formData.floor}
                      onChange={handleInputChange}
                      placeholder={t.floorNumber}
                      onKeyDown={preventEnterSubmit}
                    />
                  </div>
                  {formValidationErrors?.floor && <p className="validation-error"><FaExclamationCircle /> {formValidationErrors.floor}</p>}

                  <div className="input-group floating-label">
                    <input
                      type="number"
                      name="space_status"
                      value={formData.space_status === 0 ? '' : formData.space_status}
                      onChange={handleInputChange}
                      placeholder={t.space}
                      onKeyDown={preventEnterSubmit}
                    />
                  </div>
                  {formValidationErrors?.space_status && <p className="validation-error"><FaExclamationCircle /> {formValidationErrors.space_status}</p>}

                  {/* قائمة منسدلة للاتجاهات 1، 2، 3 بدون كلمة "Direction" */}
                  <div className="input-group floating-label">
                    <select
                      name="direction"
                      value={formData.direction}
                      onChange={handleInputChange}
                    >
                      <option value="">{t.direction}</option>
                      <option value="1">1</option>
                      <option value="2">2</option>
                      <option value="3">3</option>
                    </select>
                  </div>
                  {formValidationErrors?.direction && <p className="validation-error"><FaExclamationCircle /> {formValidationErrors.direction}</p>}

                </div>
              </div>

              <div className="form-section card">
                <h2>{t.features}</h2>
                <div className="features-grid">
                  {featuresConfig.map((feature) => (
                    <FeatureToggle
                      key={feature.name}
                      name={feature.name}
                      icon={feature.icon}
                      label={feature.label}
                      options={feature.options}
                      labels={feature.labels}
                      value={formData[feature.name]}
                      onChange={handleInputChange}
                    />
                  ))}
                </div>
              </div>
            </div>
          )}

          <div className="form-navigation">
            {activeStep > 1 && (
              <button type="button" className="nav-button prev-button" onClick={prevStep}>
                {t.previous}
              </button>
            )}
            <button type="submit" className="submit-button" disabled={localLoading}>
              {localLoading ? (
                <> <FaSpinner className="spinner" /> {t.updateProperty} </>
              ) : (
                activeStep < 3 ? t.next : t.updateProperty
              )}
            </button>
          </div>
        </form>
      </div>

      {/* مودالات التأكيد والنجاح والخطأ */}
      {showConfirmationModal && (
        <ConfirmationModal
          message={modalMessage}
          onConfirm={confirmSubmit}
          onCancel={() => {
            setShowConfirmationModal(false);
            setLocalLoading(false); // إيقاف التحميل إذا تم الإلغاء
          }}
          confirmText={translateMode ? 'Yes, Update' : 'نعم، تحديث'}
          cancelText={translateMode ? 'Cancel' : 'إلغاء'}
        />
      )}

      {showSuccessModal && (
        <SuccessModal
          message={modalMessage}
          onClose={handleSuccessModalClose} // نمرر الدالة الجديدة هنا
        />
      )}

      {showErrorModal && (
        <ErrorModal
          message={modalMessage}
          onClose={() => setShowErrorModal(false)}
        />
      )}
    </div>
  );
};

export default EditHome;