import React from 'react';
import { FaExclamationCircle } from 'react-icons/fa';
import './Modal.scss'; // We'll create this SCSS file too

const ErrorModal = ({ message, onClose }) => {
  return (
    <div className="modal-overlay">
      <div className="modal-content error-modal">
        <FaExclamationCircle className="modal-icon" />
        <h2>Error!</h2>
        <p>{message}</p>
        <button onClick={onClose} className="modal-button">
          Close
        </button>
      </div>
    </div>
  );
};

export default ErrorModal;