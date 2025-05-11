

import { 
    FaUpload, FaMoneyBillWave,FaTrash,
    FaPlug, FaTint, FaBus,FaBuilding
  } from 'react-icons/fa';
// src/features/realestate/constants.js

export const propertyCategories = (translateMode) => [
    { 
      value: 'apartment', 
      icon: 'MdApartment', 
      label: translateMode ? 'Apartment' : 'شقة' 
    },
    { 
      value: 'house', 
      icon: 'MdHouse', 
      label: translateMode ? 'House' : 'منزل' 
    },
    { 
      value: 'villa', 
      icon: 'MdVilla', 
      label: translateMode ? 'Villa' : 'فيلا' 
    },
    { 
      value: 'chalet', 
      icon: 'MdCabin', 
      label: translateMode ? 'Chalet' : 'شاليه' 
    },
    { 
      value: 'hotel', 
      icon: 'RiHotelLine', 
      label: translateMode ? 'Hotel' : 'فندق' 
    }
  ];
  
export const getFeatureConfig = (translateMode) => [
{
    name: 'electricity_status',
    icon: 'FaPlug',
    label: translateMode ? 'Electricity' : 'كهرباء',
    options: ['1', '2', '3'],
    labels: [
    translateMode ? 'Available' : 'متوفر',
    translateMode ? 'Limited' : 'محدود', 
    translateMode ? 'None' : 'غير متوفر'
    ]
},
{
    name: 'water_status',
    icon: 'FaTint',
    label: translateMode ? 'Water' : 'مياه',
    options: ['1', '2', '3'],
    labels: [
    translateMode ? 'Available' : 'متوفر',
    translateMode ? 'Limited' : 'محدود',
    translateMode ? 'None' : 'غير متوفر'
    ]
},
{
    name: 'transportation_status',
    icon: 'FaBus',
    label: translateMode ? 'Transportation' : 'مواصلات',
    options: ['1', '2', '3'],
    labels: [
    translateMode ? 'Excellent' : 'ممتاز',
    translateMode ? 'Good' : 'جيد',
    translateMode ? 'Poor' : 'ضعيف'
    ]
},
{
    name: 'water_well',
    icon: 'FaTint',
    label: translateMode ? 'Water Well' : 'بئر ماء',
    options: ['1', '2'],
    labels: [translateMode ? 'Yes' : 'نعم', translateMode ? 'No' : 'لا']
},
{
    name: 'solar_energy',
    icon: 'FaSun',
    label: translateMode ? 'Solar Energy' : 'طاقة شمسية',
    options: ['1', '2'],
    labels: [translateMode ? 'Yes' : 'نعم', translateMode ? 'No' : 'لا']
},
{
    name: 'garage',
    icon: 'FaCar',
    label: translateMode ? 'Garage' : 'موقف سيارات',
    options: ['1', '2'],
    labels: [translateMode ? 'Yes' : 'نعم', translateMode ? 'No' : 'لا']
},
{
    name: 'elevator',
    icon: 'FaBuilding',
    label: translateMode ? 'Elevator' : 'مصعد',
    options: ['1', '2'],
    labels: [translateMode ? 'Yes' : 'نعم', translateMode ? 'No' : 'لا']
},
{
    name: 'garden_status',
    icon: 'FaBuilding',
    label: translateMode ? 'Garden' : 'حديقة',
    options: ['1', '2'],
    labels: [translateMode ? 'Yes' : 'نعم', translateMode ? 'No' : 'لا']
}
];

// export const propertyCategories = [
//   { value: 'apartment', icon: <MdApartment />, label: translateMode ? 'Apartment' : 'شقة' },
//   { value: 'house', icon: <MdHouse />, label: translateMode ? 'House' : 'منزل' },
//   { value: 'villa', icon: <MdVilla />, label: translateMode ? 'Villa' : 'فيلا' },
//   { value: 'chalet', icon: <MdCabin />, label: translateMode ? 'Chalet' : 'شاليه' },
//   { value: 'hotel', icon: <RiHotelLine />, label: translateMode ? 'Hotel' : 'فندق' }
// ];