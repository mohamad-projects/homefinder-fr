import React from 'react';
import { FaCheckCircle } from 'react-icons/fa';
import './Modal.scss'; // We'll create this SCSS file too

const SuccessModal = ({ message, onClose }) => {
  return (
    <div className="modal-overlay">
      <div className="modal-content success-modal">
        <FaCheckCircle className="modal-icon" />
        <h2>Success!</h2>
        <p>{message}</p>
        <button onClick={onClose} className="modal-button">
          Close
        </button>
      </div>
    </div>
  );
};

export default SuccessModal;