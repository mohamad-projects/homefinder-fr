import { useState } from 'react';
import { propertyCategories, getFeatureConfig } from '../constants'; // Assuming these paths are correct

export const useRealEstateForm = (user, translateMode) => {
  const [formData, setFormData] = useState({
    type: 'sale',
    kind: 'apartment',
    description: '',
    price: 0,
    real_estate_location_id: '',
    user_id: user ? user.id : null, // Ensure user.id is accessed safely
    latitude: null,
    longitude: null,
    electricity_status: '1',
    water_status: '1',
    transportation_status: '1',
    water_well: '2',
    solar_energy: '2',
    garage: '2',
    room_no: 0,
    direction: '',
    space_status: 0,
    elevator: '1',
    floor: 0,
    garden_status: '1',
    attired: '2',
    ownership_type: 'green',
  });

  const [previewImages, setPreviewImages] = useState([]);
  const [activeStep, setActiveStep] = useState(1);
  const [formValidationErrors, setFormValidationErrors] = useState({}); // Managed internally by the hook

  const categories = propertyCategories(translateMode);
  const features = getFeatureConfig(translateMode);

  // Helper for internal validation rules
  const getValidationRules = (step) => {
    switch (step) {
      case 1: // Property Type & Category
        return {
          type: translateMode ? 'Listing type is required.' : 'نوع الإعلان مطلوب.',
          kind: translateMode ? 'Property category is required.' : 'تصنيف العقار مطلوب.',
        };
      case 2: // Location
        return {
          real_estate_location_id: translateMode ? 'Location is required.' : 'الموقع مطلوب.',
          latitude: translateMode ? 'Map location is required.' : 'موقع الخريطة مطلوب.',
          longitude: translateMode ? 'Map location is required.' : 'موقع الخريطة مطلوب.',
        };
      case 3: // Details (description, price, specifications, features)
        return {
          description: {
            required: translateMode ? 'Description is required.' : 'الوصف مطلوب.',
            minLength: translateMode ? 'Description must be at least 10 characters.' : 'يجب أن يكون الوصف 10 أحرف على الأقل.',
          },
          price: {
            required: translateMode ? 'Price is required.' : 'السعر مطلوب.',
            positive: translateMode ? 'Price must be greater than zero.' : 'يجب أن يكون السعر أكبر من صفر.',
          },
          room_no: {
            positive: translateMode ? 'Number of rooms must be 0 or more.' : 'عدد الغرف يجب أن يكون 0 أو أكثر.',
          },
          space_status: {
            positive: translateMode ? 'Space must be greater than zero.' : 'المساحة يجب أن تكون أكبر من صفر.',
          },
          floor: {
            required: translateMode ? 'Floor number is required.' : 'رقم الطابق مطلوب.',
          },
          ownership_type: {
            required: translateMode ? 'Ownership type is required.' : 'نوع الملكية مطلوب.',
          },
          direction: {
            required: translateMode ? 'Direction is required.' : 'الاتجاه مطلوب.',
          },
        };
      case 4: // Media Upload (only for final submission validation)
        return {
          images: translateMode ? 'At least one image is required.' : 'صورة واحدة على الأقل مطلوبة.',
        };
      default:
        return {};
    }
  };

  // The validateStep function to be returned by the hook
  const validateStep = (step) => {
    const rules = getValidationRules(step);
    const errors = {};
    let isValid = true;

    for (const fieldName in rules) {
      const rule = rules[fieldName];
      const value = formData[fieldName];

      // Basic required validation
      if (rule.required && (value === '' || value === null || value === undefined || (typeof value === 'number' && value === 0 && fieldName !== 'room_no' && fieldName !== 'floor'))) {
        errors[fieldName] = rule.required;
        isValid = false;
        continue; // Move to the next field
      }

      // Specific number validations
      if ((fieldName === 'price' || fieldName === 'space_status') && value <= 0) {
        errors[fieldName] = rule.positive;
        isValid = false;
        continue;
      }
      if ((fieldName === 'room_no' || fieldName === 'floor') && value < 0) {
        errors[fieldName] = rule.positive; // Reusing 'positive' rule for non-negative
        isValid = false;
        continue;
      }

      // Textarea minLength validation
      if (fieldName === 'description' && rule.minLength && value.length < 10) {
        errors.description = rule.minLength;
        isValid = false;
        continue;
      }
    }

    // Special validation for images in step 4 (if not handled by `AddHome` directly)
    if (step === 4 && previewImages.length === 0) {
      errors.images = getValidationRules(4).images;
      isValid = false;
    }

    setFormValidationErrors(errors); // Update errors state
    return isValid;
  };

  const handleInputChange = (e) => {
    const { name, value, type } = e.target;
    // Convert number inputs to actual numbers
    const newValue = (type === 'number') ? parseFloat(value) : value;

    setFormData(prev => ({ ...prev, [name]: newValue }));
    setFormValidationErrors(prevErrors => ({ ...prevErrors, [name]: undefined })); // Clear specific field error
  };

 const handleImageUpload = (e) => {
  const files = Array.from(e.target.files);

  const newImages = files.map(file => ({
    url: URL.createObjectURL(file),
    file
  }));

  setPreviewImages(prev => [...prev, ...newImages]);
  setFormValidationErrors(prevErrors => ({ ...prevErrors, images: undefined }));

  // Reset input value to allow same file to be selected again
e.target.value = '';
};


  const removeImage = (index) => {
    const updatedImages = [...previewImages];
    URL.revokeObjectURL(updatedImages[index].url); // Clean up URL object
    updatedImages.splice(index, 1);
    setPreviewImages(updatedImages);
    if (updatedImages.length === 0 && activeStep === 4) { // Re-validate if no images left on media step
      setFormValidationErrors(prevErrors => ({ ...prevErrors, images: getValidationRules(4).images }));
    }
  };

  const handleLocationSelect = (location) => {
    setFormData({
      ...formData,
      latitude: location.lat,
      longitude: location.lng
    });
    setFormValidationErrors(prevErrors => ({ ...prevErrors, latitude: undefined, longitude: undefined })); // Clear location errors
  };

  const nextStep = () => {
    if (validateStep(activeStep)) { // Validate before moving to next step
      setActiveStep(prev => Math.min(prev + 1, 4));
      setFormValidationErrors({}); // Clear errors when moving to next step
    }
  };

  const prevStep = () => {
    setActiveStep(prev => Math.max(prev - 1, 1));
    setFormValidationErrors({}); // Clear errors when going back
  };

  // Return all necessary states and functions
  return {
    formData,
    setFormData,
    previewImages,
    setPreviewImages, // Added to return for external use if needed (e.g., clearing all images)
    activeStep,
    setActiveStep, // Added to return for external use if needed
    categories,
    features,
    handleInputChange,
    handleLocationSelect,
    handleImageUpload,
    nextStep,
    prevStep,
    removeImage,
    formValidationErrors, // Return validation errors
    validateStep,         // Return the validation function
  };
};