import React from 'react';
import classes from './Modal.module.css';

const Modal = ({ onClose, children }) => {
  return (
    <div className={classes.modalBackdrop} onClick={onClose}>
      <div className={classes.modalContent} onClick={(e) => e.stopPropagation()}>
        <div className={classes.modalBody}>
          {children}
        </div>
      </div>
    </div>
  );
};

export default Modal;
