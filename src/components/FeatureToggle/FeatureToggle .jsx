// src/components/FeatureToggle/FeatureToggle.jsx
import React from 'react';
import * as icons from 'react-icons/fa';
import { MdApartment, MdHouse, MdVilla, MdCabin } from 'react-icons/md';
import { RiHotelLine } from 'react-icons/ri';

const iconComponents = {
  ...icons,
  MdApartment, MdHouse, MdVilla, MdCabin,
  RiHotelLine
};

const FeatureToggle = ({ 
  name, 
  icon, 
  label, 
  options, 
  labels, 
  value, 
  onChange 
}) => {
  const IconComponent = iconComponents[icon];
  
  return (
    <div className="feature-toggle">
      {IconComponent && <IconComponent />}
      <span>{label}</span>
      <div className="toggle-options">
        {options.map((option, index) => (
          <label key={option}>
            <input
              type="radio"
              name={name}
              value={option}
              checked={value === option}
              onChange={onChange}
            />
            {labels[index]}
          </label>
        ))}
      </div>
    </div>
  );
};

export default FeatureToggle;