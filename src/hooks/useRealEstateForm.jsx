// useRealEstateForm.js
import { useState } from 'react';
// تأكد من صحة هذه المسارات لاستيراد الثوابت
import { propertyCategories, getFeatureConfig } from '../constants'; 

// هذه القائمة تُستخدم لتعيين القيم الافتراضية الأولية في formData.
// يجب أن تعكس بدقة المميزات التي تستخدمها في النموذج.
// تأكد أن قيم "options" هنا هي أرقام.
const ALL_FEATURES_CONFIG_FOR_INITIAL_STATE = [
  { name: 'electricity_status', options: [1, 2, 3] },
  { name: 'water_status', options: [1, 2, 3] },
  { name: 'transportation_status', options: [1, 2, 3] },
  { name: 'water_well', options: [1, 2] },
  { name: 'solar_energy', options: [1, 2] },
  { name: 'garage', options: [1, 2] },
  { name: 'elevator', options: [1, 2] },
  { name: 'garden_status', options: [1, 2] },
  { name: 'attired', options: [1, 2] },
  // أضف أي مميزات أخرى لديك هنا بنفس التنسيق
];

export const useRealEstateForm = (user, translateMode) => {
  // بناء القيم الافتراضية الأولية للمميزات كأرقام
  const initialFeatureState = ALL_FEATURES_CONFIG_FOR_INITIAL_STATE.reduce((acc, feature) => {
    // إذا كانت الميزة تحتوي على خيار '2' (عادةً 'لا')، اجعله القيمة الافتراضية (كرقم).
    // وإلا، اجعل القيمة الافتراضية هي الخيار الأول المتاح (كرقم).
    if (feature.options.includes(2)) {
      acc[feature.name] = 2; // القيمة الافتراضية لـ "لا" (كرقم)
    } else if (feature.options.length > 0) {
      acc[feature.name] = feature.options[0]; // القيمة الافتراضية هي الخيار الأول (كرقم)
    }
    return acc;
  }, {});

  const [formData, setFormData] = useState({
    type: 'sale',
    kind: 'apartment',
    description: '',
    price: 0,
    real_estate_location_id: '',
    user_id: user ? user.id : null,
    latitude: null,
    longitude: null,
    room_no: 0,
    direction: '',
    space_status: 0,
    floor: 0,
    ownership_type: 'green',
    // ****** هنا إضافة القيم الأولية الافتراضية للمميزات كأرقام ******
    ...initialFeatureState,
    // ***************************************************************
  });

  const [previewImages, setPreviewImages] = useState([]);
  const [activeStep, setActiveStep] = useState(1);
  const [formValidationErrors, setFormValidationErrors] = useState({});

  const categories = propertyCategories(translateMode);
  // يتم جلب المميزات هنا، تأكد أن getFeatureConfig تُرجع "options" كأرقام
  const features = getFeatureConfig(translateMode); 

  const getValidationRules = (step) => {
    switch (step) {
      case 1:
        return {
          type: translateMode ? 'Listing type is required.' : 'نوع الإعلان مطلوب.',
          kind: translateMode ? 'Property category is required.' : 'تصنيف العقار مطلوب.',
        };
      case 2:
        return {
          real_estate_location_id: translateMode ? 'Location is required.' : 'الموقع مطلوب.',
          latitude: translateMode ? 'Map location is required.' : 'موقع الخريطة مطلوب.',
          longitude: translateMode ? 'Map location is required.' : 'موقع الخريطة مطلوب.',
        };
      case 3:
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
      case 4:
        return {
          images: translateMode ? 'At least one image is required.' : 'صورة واحدة على الأقل مطلوبة.',
        };
      default:
        return {};
    }
  };

  const validateStep = (step) => {
    const rules = getValidationRules(step);
    const errors = {};
    let isValid = true;

    for (const fieldName in rules) {
      const rule = rules[fieldName];
      const value = formData[fieldName];

      if (rule.required && (value === '' || value === null || value === undefined || (typeof value === 'number' && value === 0 && fieldName !== 'room_no' && fieldName !== 'floor'))) {
        errors[fieldName] = rule.required;
        isValid = false;
        continue;
      }

      if ((fieldName === 'price' || fieldName === 'space_status') && value <= 0) {
        errors[fieldName] = rule.positive;
        isValid = false;
        continue;
      }
      if ((fieldName === 'room_no' || fieldName === 'floor') && value < 0) {
        errors[fieldName] = rule.positive;
        isValid = false;
        continue;
      }

      if (fieldName === 'description' && rule.minLength && value.length < 10) {
        errors.description = rule.minLength;
        isValid = false;
        continue;
      }
    }

    if (step === 4 && previewImages.length === 0) {
      errors.images = getValidationRules(4).images;
      isValid = false;
    }

    setFormValidationErrors(errors);
    return isValid;
  };

  const handleInputChange = (e) => {
    const { name, value, type } = e.target;
    // لمدخلات type="number"، حوّل إلى رقم.
    // لمدخلات type="radio"، ستبقى القيمة التي يتم الحصول عليها من e.target.value هي سلسلة نصية.
    // هذا مقبول لأننا نستخدم parseInt() في FeatureToggleForAdd للمقارنة،
    // وفي handleSubmit في AddHome.jsx للتحويل إلى 0 أو 1.
    const newValue = (type === 'number') ? parseFloat(value) : value;

    setFormData(prev => ({ ...prev, [name]: newValue }));
    setFormValidationErrors(prevErrors => ({ ...prevErrors, [name]: undefined }));
  };

  const handleImageUpload = (e) => {
    const files = Array.from(e.target.files);

    const newImages = files.map(file => ({
      url: URL.createObjectURL(file),
      file
    }));

    setPreviewImages(prev => [...prev, ...newImages]);
    setFormValidationErrors(prevErrors => ({ ...prevErrors, images: undefined }));
    e.target.value = '';
  };

  const removeImage = (index) => {
    const updatedImages = [...previewImages];
    URL.revokeObjectURL(updatedImages[index].url);
    updatedImages.splice(index, 1);
    setPreviewImages(updatedImages);
    if (updatedImages.length === 0 && activeStep === 4) {
      setFormValidationErrors(prevErrors => ({ ...prevErrors, images: getValidationRules(4).images }));
    }
  };

  const handleLocationSelect = (location) => {
    setFormData({
      ...formData,
      latitude: location.lat,
      longitude: location.lng
    });
    setFormValidationErrors(prevErrors => ({ ...prevErrors, latitude: undefined, longitude: undefined }));
  };

  const nextStep = () => {
    if (validateStep(activeStep)) {
      setActiveStep(prev => Math.min(prev + 1, 4));
      setFormValidationErrors({});
    }
  };

  const prevStep = () => {
    setActiveStep(prev => Math.max(prev - 1, 1));
    setFormValidationErrors({});
  };

  return {
    formData,
    setFormData,
    previewImages,
    setPreviewImages,
    activeStep,
    setActiveStep,
    categories,
    features,
    handleInputChange,
    handleLocationSelect,
    handleImageUpload,
    nextStep,
    prevStep,
    removeImage,
    formValidationErrors,
    validateStep,
  };
};