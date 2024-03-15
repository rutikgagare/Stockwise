// HorizontalDataComponent.jsx

import React from 'react';
import PropTypes from 'prop-types';
import './HorizontalDataComponent.css';

const HorizontalDataComponent = ({ data }) => {
  const { org, admin, cart, status, createdAt } = data;
    console.log("data: ", data);
  return (
    <div className="horizontal-data-container">
      <div className="header">
        <h2>{org?.name} Order</h2>
        <p>Placed on {new Date(createdAt).toLocaleDateString()}</p>
      </div>
      <div className="content">
        <div className="org-details">
          <h3>Organization Details</h3>
          <p>Email: {org?.email}</p>
          <p>Address: {org?.address}</p>
        </div>
        <div className="admin-details">
          <h3>Admin Details</h3>
          <p>Name: {admin?.name}</p>
          <p>Email: {admin?.email}</p>
        </div>
        <div className="cart-details">
          <h3>Cart Items</h3>
          <ul>
            {cart?.map((item, index) => (
              <li key={index}>
                <strong>{item?.quantity}x</strong> {item?.item?.name} <strong>from</strong> {item?.vendor?.name}
              </li>
            ))}
          </ul>
        </div>
        <div className="order-status">
          <h3>Status</h3>
          <p>{status}</p>
        </div>
      </div>
    </div>
  );
};

HorizontalDataComponent.propTypes = {
  data: PropTypes.object.isRequired,
};

export default HorizontalDataComponent;
