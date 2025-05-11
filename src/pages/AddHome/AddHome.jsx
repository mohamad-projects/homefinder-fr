import React, { useContext, useEffect, useRef, useState } from 'react';
import { DarkModeContext } from '../../context/DarkModeContext';
import { 
  FaUpload, FaMoneyBillWave, FaTrash,
  FaPlug, FaTint, FaBus, FaBuilding
} from 'react-icons/fa';
import { MdApartment, MdHouse, MdVilla, MdCabin } from 'react-icons/md';
import { RiHotelLine } from 'react-icons/ri';
import MapPicker from '../../MapPicker';
import './AddHome.scss';
import useAuth from './../../hooks/useAuth';
import useLocation from './../../hooks/useLocation';
import { useDispatch } from 'react-redux';
import { AddRealEstate } from '../../features/realestate/realEstateSlice';
import { useRealEstateForm } from '../../hooks/useRealEstateForm';
import FeatureToggle from './../../components/FeatureToggle/FeatureToggle ';
import { propertyCategories } from './../../constants';

const AddHome = () => {
  const { translateMode } = useContext(DarkModeContext);
  const { user } = useAuth();
  const location = useLocation();
  const dispatch = useDispatch();
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
  } = useRealEstateForm(user, translateMode);

  const fileInputRef = useRef(null);
  useEffect(() => {
    return () => {
      previewImages.forEach(image => {
        URL.revokeObjectURL(image.url);
      });
    };
  }, [previewImages]);
  const propertyCategories = [
    { value: 'apartment', icon: <MdApartment />, label: translateMode ? 'Apartment' : 'شقة' },
    { value: 'house', icon: <MdHouse />, label: translateMode ? 'House' : 'منزل' },
    { value: 'villa', icon: <MdVilla />, label: translateMode ? 'Villa' : 'فيلا' },
    { value: 'chalet', icon: <MdCabin />, label: translateMode ? 'Chalet' : 'شاليه' },
    { value: 'hotel', icon: <RiHotelLine />, label: translateMode ? 'Hotel' : 'فندق' }
  ];

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formDataToSend = new FormData();
    
    Object.keys(formData).forEach(key => {
      if (key !== 'images' && key !== 'amenities') {
        formDataToSend.append(key, formData[key]);
      }
    });
    
    previewImages.forEach((image) => {
      formDataToSend.append('images[]', image.file); 
    });
  
  
    dispatch(AddRealEstate(formDataToSend));
  };

  const preventEnterSubmit = (e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      nextStep();
    }
  };

  return (
    <div className="add-home-page">
      <div className="form-container">
        <h1 className="page-title">
          {translateMode ? 'Add New Property' : 'إضافة عقار جديد'}
        </h1>
        
        <div className="progress-steps">
          {[1, 2, 3, 4].map(step => (
            <div 
              key={step} 
              className={`step ${step === activeStep ? 'active' : ''} ${step < activeStep ? 'completed' : ''}`}
            >
              <div className="step-number">{step}</div>
              <div className="step-label">
                {translateMode ? 
                  ['Property Type', 'Location', 'Details', 'Media'][step-1] :
                  ['نوع العقار', 'الموقع', 'التفاصيل', 'الصور'][step-1]
                }
              </div>
            </div>
          ))}
        </div>

        <form onSubmit={handleSubmit} className="property-form">
          {activeStep === 1 && (
            <div className="form-step">
              <div className="form-section card">
                <h2><FaMoneyBillWave className="section-icon"/> {translateMode ? 'Listing Type' : 'نوع الإعلان'}</h2>
                <div className="type-selector">
                  <label className={`type-option ${formData.type === 'sale' ? 'active' : ''}`}>
                    <input 
                      type="radio" 
                      name="type" 
                      value="sale" 
                      checked={formData.type === 'sale'}
                      onChange={handleInputChange}
                    />
                    {translateMode ? 'For Sale' : 'للبيع'}
                  </label>
                  <label className={`type-option ${formData.type === 'rent' ? 'active' : ''}`}>
                    <input 
                      type="radio" 
                      name="type" 
                      value="rent" 
                      checked={formData.type === 'rent'}
                      onChange={handleInputChange}
                    />
                    {translateMode ? 'For Rent' : 'للإيجار'}
                  </label>
                </div>
              </div>

              <div className="form-section card">
                <h2><FaBuilding className="section-icon"/> {translateMode ? 'Property Category' : 'تصنيف العقار'}</h2>
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
              </div>
            </div>
          )}

          {activeStep === 2 && (
            <div className="form-step">
              <div className="filter-dropdown">
                <select 
                  value={formData.real_estate_location_id} 
                  onChange={(e) => setFormData({...formData, real_estate_location_id: e.target.value})}
                >
                  <option value="">{translateMode ? 'Select Location' : 'اختر موقع'}</option>
                  {location.loaction.data.map((loc) => ( 
                    <option key={loc.id} value={loc.id}>
                      {loc.city} - {loc.district}
                    </option>
                  ))}
                </select>
              </div>
            
              <div className="form-section card">
                <h2>{translateMode ? 'Select Property Location on Map' : 'حدد موقع العقار على الخريطة'}</h2>
                <div className="map-container">
                  <MapPicker onSelect={handleLocationSelect} />
                </div>
                {(formData.latitude && formData.longitude) && (
                  <div className="coordinates-display">
                    <p>
                      {translateMode ? 'Selected Location:' : 'الموقع المحدد:'}
                      <span> {formData.latitude.toFixed(5)}, {formData.longitude.toFixed(5)}</span>
                    </p>
                  </div>
                )}
              </div>
            </div>
          )}

          {activeStep === 3 && (
            <div className="form-step">
              <div className="form-section card">
                <h2>{translateMode ? 'Property Information' : 'معلومات العقار'}</h2>
                
                <div className="input-group floating-label full-width">
                  <textarea 
                    name="description" 
                    value={formData.description}
                    onChange={handleInputChange}
                    onKeyDown={preventEnterSubmit}
                    rows="5"
                    placeholder={translateMode ? 'Detailed Description' : 'الوصف التفصيلي'}
                    required
                  />
                </div>
              </div>

              <div className="form-section card">
                <h2>{translateMode ? 'Specifications' : 'مواصفات العقار'}</h2>
                <div className="specs-grid">
                  <div className="input-group floating-label icon-input">
                    <FaMoneyBillWave className="input-icon" />
                    <input 
                      type="number" 
                      name="price" 
                      value={formData.price}
                      onChange={handleInputChange}
                      onKeyDown={preventEnterSubmit}
                      required
                      placeholder={translateMode ? 'Price' : 'السعر'}
                    />
                  </div>
                 
                  <div className="input-group floating-label">
                    <input 
                      type="number" 
                      name="room_no" 
                      value={formData.room_no}
                      onChange={handleInputChange}
                      onKeyDown={preventEnterSubmit}
                    />
                    <label>{translateMode ? 'Number of Rooms' : 'عدد الغرف'}</label>
                  </div>
                  <div className="input-group floating-label">
                    <input 
                      type="number" 
                      name="floor" 
                      value={formData.floor}
                      onChange={handleInputChange}
                      onKeyDown={preventEnterSubmit}
                      placeholder={translateMode ? 'Floor Number' : 'رقم الطابق'}
                    />
                  </div>
                  <div className="input-group floating-label">
                    <input 
                      type="number" 
                      name="space_status" 
                      value={formData.space_status}
                      onChange={handleInputChange}
                      onKeyDown={preventEnterSubmit}
                      placeholder={translateMode ? 'Space (m²)' : 'المساحة (م²)'}
                    />
                  </div>
                  <div className="input-group floating-label">
                    <input 
                      type="text" 
                      name="direction" 
                      value={formData.direction}
                      onChange={handleInputChange}
                      onKeyDown={preventEnterSubmit}
                    />
                    <label>{translateMode ? 'direction' : 'الاتجاه'}</label>
                  </div>
                </div>
              </div>

              <div className="form-section card">
                <h2>{translateMode ? 'Features' : 'المميزات'}</h2>
                <div className="features-grid">
                  {features.map((feature) => (
                    <FeatureToggle
                      key={feature.name}
                      {...feature}
                      icon={feature.icon}
                      value={formData[feature.name]}
                      onChange={handleInputChange}
                    />
                  ))}
                </div>
              </div>
            </div>
          )}
           {activeStep === 4 && (
            <div className="form-step">
              <div className="form-section card">
                <h2><FaUpload className="section-icon"/> {translateMode ? 'Property Media' : 'وسائط العقار'}</h2>
                <div className="image-uploader">
                  <label 
                    className="upload-zone"
                    onClick={() => fileInputRef.current.click()}
                  >
                    <input 
                      ref={fileInputRef}
                      type="file" 
                      multiple 
                      onChange={handleImageUpload}
                      accept="image/*"
                    />
                    <div className="upload-content">
                      <FaUpload className="upload-icon" />
                      <h3>{translateMode ? 'Upload Property Images' : 'رفع صور العقار'}</h3>
                      <p>
                        {translateMode ? 
                          'Drag & drop images here or click to browse' : 
                          'اسحب الصور هنا أو انقر للتصفح'
                        }
                      </p>
                    </div>
                  </label>
                  {previewImages.length > 0 && (
                    <div className="uploaded-count">
                      {translateMode ? 
                        `${previewImages.length} images uploaded` : 
                        `${previewImages.length} صورة مرفوعة`
                      }
                    </div>
                  )}
                  <div className="image-previews">
                    {previewImages.map((img, index) => (
                      <div key={index} className="image-preview">
                        <img src={img.url} alt={`Preview ${index}`} />
                        <button 
                          type="button" 
                          className="remove-image"
                          onClick={() => removeImage(index)}
                        >
                          <FaTrash />
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
              <button 
                type="button" 
                className="nav-button prev-button"
                onClick={prevStep}
              >
                {translateMode ? 'Previous' : 'السابق'}
              </button>
            )}
            {activeStep < 4 ? (
              <button 
                type="button" 
                className="nav-button next-button"
                onClick={nextStep}
              >
                {translateMode ? 'Next' : 'التالي'}
              </button>
            ) : (
              <button 
                type="submit" 
                className="submit-button"
              >
                {translateMode ? 'Publish Property' : 'نشر العقار'}
              </button>
            )}
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddHome;