import React, { useState, useContext, useRef } from 'react';
import { DarkModeContext } from '../../context/DarkModeContext';
import { 
  FaUpload, FaMoneyBillWave, FaMapMarkerAlt, 
  FaBed, FaBath, FaRulerCombined, FaTrash, FaPlus,
  FaPlug, FaTint, FaBus, FaCar, FaSun, FaBuilding
} from 'react-icons/fa';
import { MdApartment, MdHouse, MdVilla, MdCabin } from 'react-icons/md';
import { RiHotelLine } from 'react-icons/ri';
import MapPicker from '../../MapPicker';
import './AddHome.scss';

const AddHome = () => {
  const { translateMode } = useContext(DarkModeContext);
  const [formData, setFormData] = useState({
    propertyType: 'sale',
    propertyCategory: 'apartment',
    governorate: '',
    neighborhood: '',
    address: '',
    title: '',
    description: '',
    price: '',
    beds: '',
    baths: '',
    size: '',
    amenities: [],
    images: [],
    latitude: null,
    longitude: null,
    electricity_status: '1',
    water_status: '1',
    transportation_status: '1',
    water_well: '2',
    solar_energy: '2',
    garage: '2',
    room_no: '',
    direction: '3',
    space_status: '',
    elevator: '1',
    floor: '',
    garden_status: '1',
    attired: '2',
    ownership_type: 'Green'
  });

  const [previewImages, setPreviewImages] = useState([]);
  const [activeStep, setActiveStep] = useState(1);
  const [amenityInput, setAmenityInput] = useState('');
  const fileInputRef = useRef(null);

  const propertyCategories = [
    { value: 'apartment', icon: <MdApartment />, label: translateMode ? 'Apartment' : 'شقة' },
    { value: 'house', icon: <MdHouse />, label: translateMode ? 'House' : 'منزل' },
    { value: 'villa', icon: <MdVilla />, label: translateMode ? 'Villa' : 'فيلا' },
    { value: 'chalet', icon: <MdCabin />, label: translateMode ? 'Chalet' : 'شاليه' },
    { value: 'hotel', icon: <RiHotelLine />, label: translateMode ? 'Hotel' : 'فندق' }
  ];

  const directions = [
    { value: '1', label: translateMode ? 'North' : 'شمال' },
    { value: '2', label: translateMode ? 'South' : 'جنوب' },
    { value: '3', label: translateMode ? 'East' : 'شرق' },
    { value: '4', label: translateMode ? 'West' : 'غرب' },
    { value: '5', label: translateMode ? 'North East' : 'شمال شرق' },
    { value: '6', label: translateMode ? 'North West' : 'شمال غرب' },
    { value: '7', label: translateMode ? 'South East' : 'جنوب شرق' },
    { value: '8', label: translateMode ? 'South West' : 'جنوب غرب' }
  ];

  const yesNoOptions = [
    { value: '1', label: translateMode ? 'Yes' : 'نعم' },
    { value: '2', label: translateMode ? 'No' : 'لا' }
  ];

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleLocationSelect = (location) => {
    setFormData({ 
      ...formData, 
      latitude: location.lat,
      longitude: location.lng
    });
  };

  const handleImageUpload = (e) => {
    const files = Array.from(e.target.files);
    const newImages = files.map(file => ({
      url: URL.createObjectURL(file),
      file
    }));
    setPreviewImages([...previewImages, ...newImages]);
  };

  const removeImage = (index) => {
    const updatedImages = [...previewImages];
    updatedImages.splice(index, 1);
    setPreviewImages(updatedImages);
  };

  const addAmenity = () => {
    if (amenityInput.trim() && !formData.amenities.includes(amenityInput)) {
      setFormData({
        ...formData,
        amenities: [...formData.amenities, amenityInput]
      });
      setAmenityInput('');
    }
  };

  const removeAmenity = (index) => {
    const updatedAmenities = [...formData.amenities];
    updatedAmenities.splice(index, 1);
    setFormData({ ...formData, amenities: updatedAmenities });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    const formDataToSend = new FormData();
    
    // Append all form data
    Object.keys(formData).forEach(key => {
      if (key !== 'images' && key !== 'amenities') {
        formDataToSend.append(key, formData[key]);
      }
    });
    
    // Append amenities as array
    formData.amenities.forEach(amenity => {
      formDataToSend.append('amenities[]', amenity);
    });
    
    // Append images
    previewImages.forEach(image => {
      formDataToSend.append('images[]', image.file);
    });
    
    try {
      const response = await fetch('YOUR_API_ENDPOINT', {
        method: 'POST',
        body: formDataToSend
      });
      
      const data = await response.json();
      console.log('Success:', data);
      // Handle success (show message, redirect, etc.)
    } catch (error) {
      console.error('Error:', error);
      // Handle error
    }
  };

  const nextStep = () => setActiveStep(prev => Math.min(prev + 1, 4));
  const prevStep = () => setActiveStep(prev => Math.max(prev - 1, 1));

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
                  <label className={`type-option ${formData.propertyType === 'sale' ? 'active' : ''}`}>
                    <input 
                      type="radio" 
                      name="propertyType" 
                      value="sale" 
                      checked={formData.propertyType === 'sale'}
                      onChange={handleInputChange}
                    />
                    {translateMode ? 'For Sale' : 'للبيع'}
                  </label>
                  <label className={`type-option ${formData.propertyType === 'rent' ? 'active' : ''}`}>
                    <input 
                      type="radio" 
                      name="propertyType" 
                      value="rent" 
                      checked={formData.propertyType === 'rent'}
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
                      className={`category-option ${formData.propertyCategory === category.value ? 'active' : ''}`}
                    >
                      <input 
                        type="radio" 
                        name="propertyCategory" 
                        value={category.value}
                        checked={formData.propertyCategory === category.value}
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
              <div className="form-section card">
                <h2><FaMapMarkerAlt className="section-icon"/> {translateMode ? 'Location Details' : 'تفاصيل الموقع'}</h2>
                <div className="location-grid">
                  <div className="input-group floating-label">
                    <input 
                      type="text" 
                      name="governorate" 
                      value={formData.governorate} 
                      onChange={handleInputChange} 
                      required 
                    />
                    <label>{translateMode ? 'Governorate' : 'المحافظة'}</label>
                  </div>
                  <div className="input-group floating-label">
                    <input 
                      type="text" 
                      name="neighborhood" 
                      value={formData.neighborhood} 
                      onChange={handleInputChange} 
                      required 
                    />
                    <label>{translateMode ? 'Neighborhood' : 'الحي'}</label>
                  </div>
                  <div className="input-group floating-label full-width">
                    <textarea 
                      name="address" 
                      value={formData.address} 
                      onChange={handleInputChange} 
                      required 
                    />
                    <label>{translateMode ? 'Full Address' : 'العنوان التفصيلي'}</label>
                  </div>
                </div>
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
                  <input 
                    type="text" 
                    name="title" 
                    value={formData.title} 
                    onChange={handleInputChange} 
                    required 
                  />
                  <label>{translateMode ? 'Property Title' : 'عنوان العقار'}</label>
                </div>
                <div className="input-group floating-label full-width">
                  <textarea 
                    name="description" 
                    value={formData.description}
                    onChange={handleInputChange}
                    rows="5"
                    required
                  />
                  <label>{translateMode ? 'Detailed Description' : 'الوصف التفصيلي'}</label>
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
                      required
                    />
                    <label>{translateMode ? 'Price' : 'السعر'}</label>
                  </div>
                  <div className="input-group floating-label icon-input">
                    <FaBed className="input-icon" />
                    <input 
                      type="number" 
                      name="beds" 
                      value={formData.beds}
                      onChange={handleInputChange}
                      required
                    />
                    <label>{translateMode ? 'Bedrooms' : 'غرف نوم'}</label>
                  </div>
                  <div className="input-group floating-label icon-input">
                    <FaBath className="input-icon" />
                    <input 
                      type="number" 
                      name="baths" 
                      value={formData.baths}
                      onChange={handleInputChange}
                      required
                    />
                    <label>{translateMode ? 'Bathrooms' : 'حمامات'}</label>
                  </div>
                  <div className="input-group floating-label icon-input">
                    <FaRulerCombined className="input-icon" />
                    <input 
                      type="number" 
                      name="size" 
                      value={formData.size}
                      onChange={handleInputChange}
                      required
                    />
                    <label>{translateMode ? 'Area (m²)' : 'المساحة (م²)'}</label>
                  </div>
                  <div className="input-group floating-label">
                    <input 
                      type="number" 
                      name="room_no" 
                      value={formData.room_no}
                      onChange={handleInputChange}
                    />
                    <label>{translateMode ? 'Number of Rooms' : 'عدد الغرف'}</label>
                  </div>
                  <div className="input-group floating-label">
                    <input 
                      type="number" 
                      name="floor" 
                      value={formData.floor}
                      onChange={handleInputChange}
                    />
                    <label>{translateMode ? 'Floor Number' : 'رقم الطابق'}</label>
                  </div>
                  <div className="input-group floating-label">
                    <input 
                      type="number" 
                      name="space_status" 
                      value={formData.space_status}
                      onChange={handleInputChange}
                    />
                    <label>{translateMode ? 'Space (m²)' : 'المساحة (م²)'}</label>
                  </div>
                  <div className="input-group floating-label">
                    <input 
                      type="text" 
                      name="direction" 
                      value={formData.direction}
                      onChange={handleInputChange}
                    />
                    <label>{translateMode ? 'direction' : 'الاتجاه'}</label>
                  </div>
                 
                </div>
              </div>

              <div className="form-section card">
                <h2>{translateMode ? 'Features' : 'المميزات'}</h2>
                <div className="features-grid">
                  <div className="feature-toggle">
                    <FaPlug className="feature-icon" />
                    <span>{translateMode ? 'Electricity' : 'كهرباء'}</span>
                    <div className="toggle-options">
                      {yesNoOptions.map(option => (
                        <label key={option.value}>
                          <input
                            type="radio"
                            name="electricity_status"
                            value={option.value}
                            checked={formData.electricity_status === option.value}
                            onChange={handleInputChange}
                          />
                          {option.label}
                        </label>
                      ))}
                    </div>
                  </div>
                  <div className="feature-toggle">
                    <FaTint className="feature-icon" />
                    <span>{translateMode ? 'Water' : 'مياه'}</span>
                    <div className="toggle-options">
                      {yesNoOptions.map(option => (
                        <label key={option.value}>
                          <input
                            type="radio"
                            name="water_status"
                            value={option.value}
                            checked={formData.water_status === option.value}
                            onChange={handleInputChange}
                          />
                          {option.label}
                        </label>
                      ))}
                    </div>
                  </div>
                  <div className="feature-toggle">
                    <FaBus className="feature-icon" />
                    <span>{translateMode ? 'Transportation' : 'مواصلات'}</span>
                    <div className="toggle-options">
                      {yesNoOptions.map(option => (
                        <label key={option.value}>
                          <input
                            type="radio"
                            name="transportation_status"
                            value={option.value}
                            checked={formData.transportation_status === option.value}
                            onChange={handleInputChange}
                          />
                          {option.label}
                        </label>
                      ))}
                    </div>
                  </div>
                  <div className="feature-toggle">
                    <FaTint className="feature-icon" />
                    <span>{translateMode ? 'Water Well' : 'بئر ماء'}</span>
                    <div className="toggle-options">
                      {yesNoOptions.map(option => (
                        <label key={option.value}>
                          <input
                            type="radio"
                            name="water_well"
                            value={option.value}
                            checked={formData.water_well === option.value}
                            onChange={handleInputChange}
                          />
                          {option.label}
                        </label>
                      ))}
                    </div>
                  </div>
                  <div className="feature-toggle">
                    <FaSun className="feature-icon" />
                    <span>{translateMode ? 'Solar Energy' : 'طاقة شمسية'}</span>
                    <div className="toggle-options">
                      {yesNoOptions.map(option => (
                        <label key={option.value}>
                          <input
                            type="radio"
                            name="solar_energy"
                            value={option.value}
                            checked={formData.solar_energy === option.value}
                            onChange={handleInputChange}
                          />
                          {option.label}
                        </label>
                      ))}
                    </div>
                  </div>
                  <div className="feature-toggle">
                    <FaCar className="feature-icon" />
                    <span>{translateMode ? 'Garage' : 'موقف سيارات'}</span>
                    <div className="toggle-options">
                      {yesNoOptions.map(option => (
                        <label key={option.value}>
                          <input
                            type="radio"
                            name="garage"
                            value={option.value}
                            checked={formData.garage === option.value}
                            onChange={handleInputChange}
                          />
                          {option.label}
                        </label>
                      ))}
                    </div>
                  </div>
                  <div className="feature-toggle">
                    <FaBuilding className="feature-icon" />
                    <span>{translateMode ? 'Elevator' : 'مصعد'}</span>
                    <div className="toggle-options">
                      {yesNoOptions.map(option => (
                        <label key={option.value}>
                          <input
                            type="radio"
                            name="elevator"
                            value={option.value}
                            checked={formData.elevator === option.value}
                            onChange={handleInputChange}
                          />
                          {option.label}
                        </label>
                      ))}
                    </div>
                  </div>
                  <div className="feature-toggle">
                    <FaBuilding className="feature-icon" />
                    <span>{translateMode ? 'Garden' : 'حديقة'}</span>
                    <div className="toggle-options">
                      {yesNoOptions.map(option => (
                        <label key={option.value}>
                          <input
                            type="radio"
                            name="garden_status"
                            value={option.value}
                            checked={formData.garden_status === option.value}
                            onChange={handleInputChange}
                          />
                          {option.label}
                        </label>
                      ))}
                    </div>
                  </div>
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