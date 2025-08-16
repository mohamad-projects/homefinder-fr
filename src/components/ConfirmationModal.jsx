import React from 'react';
import { FaQuestionCircle } from 'react-icons/fa';
import './Modal.scss'; // We'll create this SCSS file too

const ConfirmationModal = ({ message, onConfirm, onCancel, confirmText, cancelText }) => {
  return (
    <div className="modal-overlay">
      <div className="modal-content confirmation-modal">
        <FaQuestionCircle className="modal-icon" />
        <h2>Confirmation</h2>
        <p>{message}</p>
        <div className="modal-actions">
          <button onClick={onConfirm} className="modal-button confirm">
            {confirmText || 'Yes'}
          </button>
          <button onClick={onCancel} className="modal-button cancel">
            {cancelText || 'No'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ConfirmationModal;