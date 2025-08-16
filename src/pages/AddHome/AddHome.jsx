import React, { useState, useContext, useEffect, useRef } from 'react';
import { DarkModeContext } from '../../context/DarkModeContext';
import {
  FaUpload, FaMoneyBillWave, FaTrash,
  FaPlug, FaTint, FaBus, FaBuilding, FaSpinner, FaExclamationCircle, FaCheckCircle
} from 'react-icons/fa';
import { MdApartment, MdVilla, MdCabin } from 'react-icons/md';
import MapPicker from '../../MapPicker';
import './AddHome.scss';
import useAuth from './../../hooks/useAuth';
import useLocation from './../../hooks/useLocation';
import { useDispatch, useSelector } from 'react-redux';
import { AddRealEstate } from '../../features/realestate/realEstateSlice';
import { useRealEstateForm } from '../../hooks/useRealEstateForm';
import FeatureToggle from './../../components/FeatureToggle/FeatureToggle ';
import FeatureToggleForAdd from './../../components/FeatureToggleForAdd/FeatureToggleForAdd';
import { useNavigate } from 'react-router-dom'; // Import useNavigate

// New Modal Components (you'll create these files)
import SuccessModal from '../../components/SuccessModal';
import ErrorModal from '../../components/ErrorModal';
import ConfirmationModal from '../../components/ConfirmationModal';


const AddHome = () => {
  const { translateMode } = useContext(DarkModeContext);
  const { user } = useAuth();
  const { loaction: locationsData, loading: locationsLoading, error: locationsError } = useLocation();
  const dispatch = useDispatch();
  const navigate = useNavigate(); // Initialize useNavigate

  const { loading: addRealEstateLoading, error: addRealEstateError } = useSelector((state) => state.realestate);

  const {
    formData,
    setFormData,
    previewImages,
    activeStep,
    handleInputChange,
    handleImageUpload,
    handleLocationSelect,
    removeImage,
    nextStep,
    features,
    prevStep,
    formValidationErrors,
    validateStep,
  } = useRealEstateForm(user, translateMode);

  const fileInputRef = useRef(null);

  const [feedbackMessage, setFeedbackMessage] = useState(null);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [showErrorModal, setShowErrorModal] = useState(false);
  const [showConfirmationModal, setShowConfirmationModal] = useState(false);
  const [modalMessage, setModalMessage] = useState('');

  const propertyCategories = [
    { value: 'apartment', icon: <MdApartment />, label: translateMode ? 'Apartment' : 'شقة' },
    { value: 'villa', icon: <MdVilla />, label: translateMode ? 'Villa' : 'فيلا' },
    { value: 'chalet', icon: <MdCabin />, label: translateMode ? 'Chalet' : 'شاليه' },
  ];

  const t = {
    addPropertyTitle: translateMode ? 'Add New Property' : 'إضافة عقار جديد',
    stepPropertyType: translateMode ? 'Property Type' : 'نوع العقار',
    stepLocation: translateMode ? 'Location' : 'الموقع',
    stepDetails: translateMode ? 'Details' : 'التفاصيل',
    stepMedia: translateMode ? 'Media' : 'الصور',
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
    ownershipType: translateMode ? 'Ownership Type' : 'نوع الملكية',
    floorNumber: translateMode ? 'Floor Number' : 'رقم الطابق',
    space: translateMode ? 'Space (m²)' : 'المساحة (م²)',
    direction: translateMode ? 'Direction' : 'الاتجاه',
    features: translateMode ? 'Features' : 'المميزات',
    propertyMedia: translateMode ? 'Property Media' : 'وسائط العقار',
    uploadImages: translateMode ? 'Upload Property Images' : 'رفع صور العقار',
    dragDrop: translateMode ? 'Drag & drop images or click' : 'اسحب الصور أو انقر للرفع',
    imagesUploaded: translateMode ? 'images uploaded' : 'صورة مرفوعة',
    removeImage: translateMode ? 'Remove image' : 'إزالة الصورة',
    previous: translateMode ? 'Previous' : 'السابق',
    next: translateMode ? 'Next' : 'التالي',
    publishProperty: translateMode ? 'Publish Property' : 'نشر العقار',
    uploadImageRequired: translateMode ? 'Please upload at least one image' : 'الرجاء رفع صورة واحدة على الأقل',
    propertyAddedSuccess: translateMode ? 'Property added successfully!' : 'تمت إضافة العقار بنجاح!',
    propertyAddFailed: translateMode ? 'Failed to add property. Please check inputs and try again.' : 'فشل إضافة العقار. الرجاء التحقق من المدخلات والمحاولة مرة أخرى.',
    fetchingLocations: translateMode ? 'Fetching locations...' : 'جاري جلب المواقع...',
    locationsLoadError: translateMode ? 'Failed to load locations.' : 'فشل تحميل المواقع.',
    noLocationsAvailable: translateMode ? 'No locations available.' : 'لا توجد مواقع متاحة.',
    confirmPublish: translateMode ? 'Are you sure you want to publish this property?' : 'هل أنت متأكد من نشر العقار؟',
    yes: translateMode ? 'Yes' : 'نعم',
    no: translateMode ? 'No' : 'لا',
    greenOption: translateMode ? 'Green' : 'أخضر', // Added translation for Green
    courtOption: translateMode ? 'Court' : 'محكمة',   // Added translation for Court
    directionOne: translateMode ? '1' : '1',
    directionTwo: translateMode ? '2' : '2',
    directionThree: translateMode ? '3' : '3',
    directionFour: translateMode ? '4' : '4',
  };

  useEffect(() => {
    return () => {
      previewImages.forEach(image => {
        URL.revokeObjectURL(image.url);
      });
    };
  }, [previewImages]);

  useEffect(() => {
    if (feedbackMessage) {
      const timer = setTimeout(() => {
        setFeedbackMessage(null);
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [feedbackMessage]);

  const handlePublish = async () => {
    setFeedbackMessage(null);

    const formDataToSend = new FormData();
    Object.keys(formData).forEach(key => {
      if (key !== 'images' && key !== 'amenities') {
        formDataToSend.append(key, formData[key]);
      }
    });
    previewImages.forEach((image) => {
      formDataToSend.append('images[]', image.file);
    });

    features.forEach(feature => {
      formDataToSend.append(feature.name, formData[feature.name]);
    });

    try {
      await dispatch(AddRealEstate(formDataToSend)).unwrap();
      setModalMessage(t.propertyAddedSuccess);
      setShowSuccessModal(true);
      
      // Removed alert, now handled by modal
    } catch (error) {
      console.error('Error adding property:', error);

      let detailedMessage = t.propertyAddFailed;

      if (error.errors && typeof error.errors === 'object') {
        const errorMessages = Object.values(error.errors).flat();
        detailedMessage = errorMessages.join('، ') || detailedMessage;
      } else if (error.message) {
        detailedMessage = error.message;
      }
      setModalMessage(detailedMessage);
      setShowErrorModal(true);
      // Removed alert, now handled by modal
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setFeedbackMessage(null);

    const isStepValid = validateStep(activeStep);
    if (!isStepValid) {
      const firstErrorKey = Object.keys(formValidationErrors)[0];
      if (firstErrorKey) {
        setFeedbackMessage({ type: 'error', text: formValidationErrors[firstErrorKey] });
      } else {
        setFeedbackMessage({ type: 'error', text: t.propertyAddFailed });
      }
      return;
    }

    if (activeStep < 4) {
      nextStep();
      return;
    }

    if (previewImages.length === 0) {
      setFeedbackMessage({ type: 'error', text: t.uploadImageRequired });
      return;
    }

    setShowConfirmationModal(true); // Show confirmation modal instead of window.confirm
  };


  const preventEnterSubmit = (e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
    }
  };

  const locations = locationsData?.data || [];

  return (
    <div className="add-home-page">
      <div className="form-container">
        <h1 className="page-title">{t.addPropertyTitle}</h1>

        <div className="progress-steps">
          {[1, 2, 3, 4].map(step => (
            <div
              key={step}
              className={`step ${step === activeStep ? 'active' : ''} ${step < activeStep ? 'completed' : ''}`}
            >
              <div className="step-number">{step}</div>
              <div className="step-label">
                {translateMode ?
                  [t.stepPropertyType, t.stepLocation, t.stepDetails, t.stepMedia][step - 1] :
                  [t.stepPropertyType, t.stepLocation, t.stepDetails, t.stepMedia][step - 1]
                }
              </div>
            </div>
          ))}
        </div>

        {feedbackMessage && (
          <p className={`status-message ${feedbackMessage.type === 'success' ? 'success-message' : 'error-message'}`}>
            {feedbackMessage.type === 'success' ? <FaCheckCircle /> : <FaExclamationCircle />} {feedbackMessage.text}
          </p>
        )}
        {addRealEstateLoading && !feedbackMessage && (
          <p className="status-message loading-message">
            <FaSpinner className="spinner" /> {t.publishProperty}
          </p>
        )}
        {addRealEstateError && !feedbackMessage && (
          <p className="status-message error-message">
            <FaExclamationCircle /> {addRealEstateError.message || t.propertyAddFailed}
          </p>
        )}

        <form onSubmit={handleSubmit} className="property-form">
          {/* Step 1: Type & Category */}
          {activeStep === 1 && (
            <div className="form-step">
              <div className="form-section card">
                <h2><FaMoneyBillWave className="section-icon" /> {t.listingType}</h2>
                <div className="type-selector">
                  {['sale', 'rental'].map(type => (
                    <label key={type} className={`type-option ${formData.type === type ? 'active' : ''}`}>
                      <input
                        type="radio"
                        name="type"
                        value={type}
                        checked={formData.type === type}
                        onChange={handleInputChange}
                      />
                      {translateMode ? (type === 'sale' ? t.forSale : t.forRent) : (type === 'sale' ? t.forSale : t.forRent)}
                    </label>
                  ))}
                </div>
                {formValidationErrors?.type && <p className="validation-error"><FaExclamationCircle /> {formValidationErrors.type}</p>}
              </div>

              <div className="form-section card">
                <h2><FaBuilding className="section-icon" /> {t.propertyCategory}</h2>
                <div className="category-grid">
                  {propertyCategories.map(category => (
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
                <MapPicker onSelect={handleLocationSelect} />
                {(formData.latitude && formData.longitude) && (
                  <div className="coordinates-display">
                    <p>
                      {t.selectedLocation}
                      <span> {formData.latitude.toFixed(5)}, {formData.longitude.toFixed(5)}</span>
                    </p>
                  </div>
                )}
                {formValidationErrors?.latitude && <p className="validation-error"><FaExclamationCircle /> {formValidationErrors.latitude}</p>}
                {formValidationErrors?.longitude && <p className="validation-error"><FaExclamationCircle /> {formValidationErrors.longitude}</p>}
              </div>
            </div>
          )}

          {/* Step 3: Details */}
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

                  {/* Ownership Type Dropdown */}
                  <div className="input-group floating-label">
                    <select
                      name="ownership_type"
                      value={formData.ownership_type}
                      onChange={handleInputChange}
                      required
                    >
                      <option value="">{t.ownershipType}</option>
                      <option value="green">{t.greenOption}</option>
                      <option value="court">{t.courtOption}</option>
                    </select>
                    {formValidationErrors?.ownership_type && <p className="validation-error"><FaExclamationCircle /> {formValidationErrors.ownership_type}</p>}
                  </div>


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

                  {/* Direction Dropdown */}
                  <div className="input-group floating-label">
                    <select
                      name="direction"
                      value={formData.direction}
                      onChange={handleInputChange}
                      required
                    >
                      <option value="">{t.direction}</option>
                      <option value="1">{t.directionOne}</option>
                      <option value="2">{t.directionTwo}</option>
                      <option value="3">{t.directionThree}</option>
                    </select>
                    {formValidationErrors?.direction && <p className="validation-error"><FaExclamationCircle /> {formValidationErrors.direction}</p>}

                  </div>
                </div>
              </div>

              <div className="form-section card">
                <h2>{t.features}</h2>
                <div className="features-grid">
                  {features.map((feature) => (
                    <FeatureToggleForAdd
                      key={feature.name}
                      {...feature}
                      value={formData[feature.name]}
                      onChange={handleInputChange}
                    />
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Step 4: Media Upload */}
          {activeStep === 4 && (
            <div className="form-step">
              <div className="form-section card">
                <h2><FaUpload className="section-icon" /> {t.propertyMedia}</h2>
                <div className="image-uploader">
                  <label className="upload-zone">
                    <input
                      ref={fileInputRef}
                      type="file"
                      multiple
                      onChange={handleImageUpload}
                      accept="image/*"
                      style={{ display: 'none' }}
                    />
                    <div className="upload-content">
                      <FaUpload className="upload-icon" />
                      <h3>{t.uploadImages}</h3>
                      <p>{t.dragDrop}</p>
                    </div>
                  </label>


                  {previewImages.length > 0 && (
                    <div className="uploaded-count">
                      {previewImages.length} {t.imagesUploaded}
                    </div>
                  )}
                  {formValidationErrors?.images && <p className="validation-error"><FaExclamationCircle /> {formValidationErrors.images}</p>}


                  <div className="image-previews">
                    {previewImages.map((img, index) => (
                      <div key={index} className="image-preview">
                        <img src={img.url} alt={`Preview ${index}`} />
                        <button type="button" className="remove-image" onClick={() => removeImage(index)}>
                          <FaTrash /> {t.removeImage}
                        </button>
                      </div>
                    ))}
                  </div>
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
            <button type="submit" className="submit-button" disabled={addRealEstateLoading}>
              {addRealEstateLoading ? (
                <> <FaSpinner className="spinner" /> {t.publishProperty} </>
              ) : (
                activeStep < 4 ? t.next : t.publishProperty
              )}
            </button>
          </div>
        </form>
      </div>

      {/* Modals */}
      {showSuccessModal && (
        <SuccessModal
          message={modalMessage}
          onClose={() => {
            setShowSuccessModal(false);
            navigate('/'); // Redirect to /home after success
          }}
        />
      )}

      {showErrorModal && (
        <ErrorModal
          message={modalMessage}
          onClose={() => setShowErrorModal(false)}
        />
      )}

      {showConfirmationModal && (
        <ConfirmationModal
          message={t.confirmPublish}
          onConfirm={() => {
            setShowConfirmationModal(false);
            handlePublish(); // Proceed with publishing if confirmed
          }}
          onCancel={() => setShowConfirmationModal(false)}
          confirmText={t.yes}
          cancelText={t.no}
        />
      )}
    </div>
  );
};

export default AddHome;