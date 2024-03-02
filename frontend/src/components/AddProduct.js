import React, { useState } from "react";
import classes from "./AddProduct.module.css";

const AddProduct = (props) => {
  const [name, setName] = useState();
  const [unit, setUnit] = useState();
  const [costPrice, setCostPrice] = useState();
  const [sellingPrice, setSellingPrice] = useState();

  const handleSubmit = (event) => {
    event.preventDefault();

    if (name && unit && costPrice && sellingPrice) {
      props.onSubmit(name, unit, costPrice, sellingPrice);
    }
  };

  return (
    <div className={classes.main}>
      <div className={classes.addProduct}>
        <div className={classes.header}>
          <h3>New Product</h3>
          <button onClick={() => props.onClose()}>Cancel</button>
        </div>

        <div className={classes.addProductForm} onSubmit={handleSubmit}>
          <form>
            <div className={classes.inputDiv}>
              <label htmlFor="name">Product Name</label>
              <input
                id="name"
                type="text"
                value={name}
                placeholder="Enter product name"
                onChange={(e) => setName(e.target.value)}
                required="true"
              />
            </div>

            <div className={classes.inputDiv}>
              <label htmlFor="unit">Unit</label>
              <select
                name=""
                id="unit"
                value={unit}
                onChange={(e) => setUnit(e.target.value)}
                required="true"
              >
                <option value="">Slect Unit</option>
                <option value="pcs">pcs</option>
                <option value="pcs">Kg</option>
                <option value="pcs">g</option>
                <option value="pcs">box</option>
                <option value="pcs">dz</option>
              </select>
            </div>

            <div className={classes.inputDiv}>
              <label htmlFor="costPrice">Cost Price</label>
              <input
                id="costPrice"
                type="number"
                value={costPrice}
                onChange={(e) => setCostPrice(e.target.value)}
                placeholder="Enter cost price in INR"
                required="true"
              />
            </div>

            <div className={classes.inputDiv}>
              <label htmlFor="sellPrice">Selling Price</label>
              <input
                id="sellPrice"
                type="number"
                value={sellingPrice}
                onChange={(e) => setSellingPrice(e.target.value)}
                placeholder="Enter cost price in INR"
                required="true"
              />
            </div>

            <button type="submit">Add Product</button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default AddProduct;
