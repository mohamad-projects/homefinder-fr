import React from 'react';
import * as icons from 'react-icons/fa';
import { MdApartment, MdHouse, MdVilla, MdCabin, MdElevator } from 'react-icons/md'; // Make sure MdElevator is imported
import { RiHotelLine } from 'react-icons/ri';
import './FeatureToggleForAdd.scss'; // Correct path to your SCSS file

const iconComponents = {
  ...icons,
  MdApartment, MdHouse, MdVilla, MdCabin, MdElevator, // Include MdElevator here
  RiHotelLine
};

const FeatureToggleForAdd = ({
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
      {IconComponent && <IconComponent className="feature-icon" />} {/* Added class "feature-icon" */}
      <span className="feature-label">{label}</span> {/* Added class "feature-label" */}
      <div className="toggle-options">
        {options.map((option, index) => (
          <label key={option} className="toggle-option"> {/* Added class "toggle-option" */}
            <input
              type="radio"
              name={name}
              value={option}
              checked={value === option}
              onChange={onChange}
            />
            {/* Added custom-radio for styling the radio button */}
            <span className="custom-radio" />
            {/* Added option-label for styling the text next to the radio */}
            <span className="option-label">{labels[index]}</span>
          </label>
        ))}
      </div>
    </div>
  );
};

export default FeatureToggleForAdd;