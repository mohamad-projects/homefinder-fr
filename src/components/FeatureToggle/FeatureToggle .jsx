import React from 'react';
import * as faIcons from 'react-icons/fa'; 
import {
  MdApartment, MdHouse, MdVilla, MdCabin, MdElevator 
} from 'react-icons/md'; 
import { RiHotelLine } from 'react-icons/ri'; 
import './FeatureToggle.scss';

const iconComponents = {
  ...faIcons, 
  MdApartment, MdHouse, MdVilla, MdCabin, MdElevator, 
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
      {IconComponent && <IconComponent className="feature-icon" />} 
      <span className="feature-label">{label}</span>
      <div className="toggle-options">
        {options.map((optionValue, index) => (
          <label key={optionValue} className="toggle-option">
            <input
              type="radio"
              name={name}
              value={optionValue}
              checked={parseInt(value) === optionValue}
              onChange={onChange}
            />
            <span className="custom-radio" />
            <span className="option-label">{labels[index]}</span>
          </label>
        ))}
      </div>
    </div>
  );
};

export default FeatureToggle;