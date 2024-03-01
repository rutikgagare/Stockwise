import React, { useState } from 'react';
import './ProductCard.css';

const ProductCard = ({ product }) => {
  const [quantity, setQuantity] = useState(product.quantity || 0);

  const handleIncrement = () => {
    setQuantity(quantity + 1);
  };

  const handleDecrement = () => {
    if (quantity > 0) {
      setQuantity(quantity - 1);
    }
  };

  return (
    <div className="card-container">
      <div className="product-image">
        <img src={product.img} />
    </div>
      <h3>{product.name}</h3>
      <p>Quantity: {quantity}</p>
      <div className="quantity-container">
        <button className="quantity-button" onClick={handleDecrement}>-</button>
        <button className="quantity-button" onClick={handleIncrement}>+</button>
      </div>
    </div>
  );
};

export default ProductCard;
