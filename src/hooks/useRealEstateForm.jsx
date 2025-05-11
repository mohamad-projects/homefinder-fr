// src/features/realestate/hooks/useRealEstateForm.js
import { useState } from 'react';
import { propertyCategories, getFeatureConfig } from '../constants';

export const useRealEstateForm = (user, translateMode) => {
  

  const [formData, setFormData] = useState({
      type: 'sale', 
      kind: 'apartment', 
      description: '',
      price: 0, 
      // images: [],
      real_estate_location_id: '',
      user_id: user.id,
      latitude: null,
      longitude: null,
      electricity_status: '1',
      water_status: '1',
      transportation_status: '1',
      water_well: '2',
      solar_energy: '2',
      garage: '2',
      room_no: 0, 
      direction: '3',
      space_status: 0, 
      elevator: '1',
      floor: 0, 
      garden_status: '1',
      attired: '2',
      ownership_type: 'Green'
  });
  

  const [previewImages, setPreviewImages] = useState([]);
  const [activeStep, setActiveStep] = useState(1);

  const categories = propertyCategories(translateMode);
  const features = getFeatureConfig(translateMode);
  const nextStep = () => setActiveStep(prev => Math.min(prev + 1, 4));
  const prevStep = () => setActiveStep(prev => Math.max(prev - 1, 1));
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };
  const removeImage = (index) => {
    const updatedImages = [...previewImages];
    updatedImages.splice(index, 1);
    setPreviewImages(updatedImages);
  };
  const handleImageUpload = (e) => {
    const files = Array.from(e.target.files);
    const newImages = files.map(file => ({
      url: URL.createObjectURL(file),
      file
      
    }));
    setPreviewImages(prev => [...prev, ...newImages]);
  };
  const handleLocationSelect = (location) => {
    setFormData({ 
      ...formData, 
      latitude: location.lat,
      longitude: location.lng
    });
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
    // ... other handlers
  };
};