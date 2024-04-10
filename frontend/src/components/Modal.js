import React from 'react';

const Modal = ({ onClose, children, width }) => {
  const modalBackdropStyle = {
    position: 'fixed',
    top: 0,
    left: 0,
    width: '100%',
    height: '100%',
    backgroundColor: 'rgba(0, 0, 0, 0.5)', // Semi-transparent black
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 100, // Added z-index
  };

  const modalContentStyle = {
    backgroundColor: 'white',
    borderRadius: '8px',
    padding: '1.5rem',
    boxShadow: '0px 0px 10px rgba(0, 0, 0, 0.5)', 
    width: width || '40%',
    maxHeight: "80%",
    overflowY: 'scroll',
    zIndex: 100, // Added z-index
  };

  const modalBodyStyle = {
    height: "100%",
  };

  return (
    <div style={modalBackdropStyle} onClick={onClose}>
      <div style={modalContentStyle} onClick={(e) => e.stopPropagation()}>
        <div style={modalBodyStyle}>
          {children}
        </div>
      </div>
    </div>
  );
};

export default Modal;
