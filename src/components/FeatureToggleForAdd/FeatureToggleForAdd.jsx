// FeatureToggleForAdd.jsx
import React from 'react';
import * as icons from 'react-icons/fa';
import { MdApartment, MdHouse, MdVilla, MdCabin, MdElevator } from 'react-icons/md';
import { RiHotelLine } from 'react-icons/ri';
import './FeatureToggleForAdd.scss';

const iconComponents = {
  ...icons,
  MdApartment, MdHouse, MdVilla, MdCabin, MdElevator,
  RiHotelLine
};

const FeatureToggleForAdd = ({
  name,
  icon,
  label,
  options, // هذه القائمة (من getFeatureConfig) يجب أن تحتوي على أرقام
  labels,
  value, // القيمة الحالية من formData (ستكون الآن رقمًا)
  onChange
}) => {
  const IconComponent = iconComponents[icon];

  return (
    <div className="feature-toggle">
      {IconComponent && <IconComponent className="feature-icon" />}
      <span className="feature-label">{label}</span>
      <div className="toggle-options">
        {options.map((option, index) => (
          <label key={option} className="toggle-option">
            <input
              type="radio"
              name={name}
              value={option} // قيمة هذا الزر (رقم)
              checked={value === option} // الآن يمكننا مقارنة الأرقام مباشرة (بدون parseInt)
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

export default FeatureToggleForAdd;