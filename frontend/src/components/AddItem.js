import React, { useState } from "react";
import classes from "./AddCategory.module.css";
import { useDispatch, useSelector } from "react-redux";
import { inventoryActions } from "../store/inventorySlice";

const AddItem = (props) => {
  const dispatch = useDispatch();
  const user = useSelector((state) => state.auth.user);
  const org = useSelector((state) => state.org.organization);
  const categories = useSelector((state) => state.category.data);

  const [name, setName] = useState();
  const [quantity, setQuantity] = useState(1);
  const [serialNumber, setSerialNumber] = useState("");

  const [selectedCategory, setSelectedCategory] = useState(null);
  const [customFields, setCustomFields] = useState(null);
  const [error, setError] = useState(null);

  const handleCategoryChange = (e) => {
    const categoryId = e.target.value;
    const selectedCategory = categories.find(
      (category) => category._id === categoryId
    );
    setSelectedCategory(selectedCategory);
    setCustomFields(selectedCategory?.customFields);
  };

  const handleAddItem = async (e) => {
    e.preventDefault();

    try {
      if (!name || !selectedCategory) {
        throw Error("All fields must be filled");
      }

      if (
        selectedCategory.identificationType === "unique" &&
        !serialNumber.trim()
      ) {
        throw Error("Serial Number must be filled");
      }

      if (
        selectedCategory.identificationType === "non-unique" &&
        !quantity.trim()
      ) {
        throw Error("Quantity must be filled");
      }

      // Create an object to hold all item details including custom fields
      const itemDetails = {
        name,
        categoryId: selectedCategory._id,
        orgId: org._id,
        identificationType: selectedCategory.identificationType
      };

      // Add identification type specific details
      if (selectedCategory.identificationType === "unique") {
        itemDetails.serialNumber = serialNumber;

      } else if (selectedCategory.identificationType === "non-unique") {
        itemDetails.quantity = parseInt(quantity);
      }

      // Add custom fields to item details
      if (customFields) {
        customFields.forEach((field) => {
          const fieldValue = document.getElementById(field.name).value;
          itemDetails[field.name] = fieldValue;
        });
      }

      console.log(itemDetails);

      const response = await fetch("http://localhost:9999/inventory/create", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${user?.token}`,
        },
        body: JSON.stringify(itemDetails),
      });

      if (!response.ok) {
        const error = await response.json();
        setError(error.message);
        return;
      }

      if (response.ok) {
        const json = await response.json();
        dispatch(inventoryActions.addItem(json))
        props.onClose();
      }
    } catch (error) {
      setError(error.message);
    }
  };

  return (
    <div className={classes.main}>
      <div className={classes.addCategory}>
        <div className={classes.header}>
          <h3>New Item</h3>
          <button onClick={() => props.onClose()}>Cancel</button>
        </div>

        <div className={classes.addCategoryForm}>
          {error && <div className={classes.error}>{error}</div>}

          <form onSubmit={handleAddItem}>
            <div className={classes.inputDiv}>
              <label htmlFor="category">Category Name</label>

              <select id="category" required onChange={handleCategoryChange}>
                <option value="">Select category</option>
                {categories.map((category) => (
                  <option key={category._id} value={category._id}>
                    {category.name}
                  </option>
                ))}
              </select>
            </div>

            <div className={classes.inputDiv}>
              <label htmlFor="name">Name</label>
              <input
                id="name"
                type="text"
                onChange={(e) => setName(e.target.value)}
              />
            </div>

            {selectedCategory &&
              selectedCategory.identificationType === "unique" && (
                <div className={classes.inputDiv}>
                  <label htmlFor="serialNumber">Serial Number</label>
                  <input
                    id="serialNumber"
                    type="text"
                    onChange={(e) => setSerialNumber(e.target.value)}
                  />
                </div>
              )}

            {selectedCategory &&
              selectedCategory.identificationType === "non-unique" && (
                <div className={classes.inputDiv}>
                  <label htmlFor="qunatity">Quantity</label>
                  <input
                    id="quantity"
                    type="number"
                    onChange={(e) => setQuantity(e.target.value)}
                  />
                </div>
              )}

            <div className={classes.inputDiv}></div>

            {/* Other input fields for item details */}
            {customFields &&
              customFields?.map((field) => {
                return (
                  <div className={classes.inputDiv}>
                    <label htmlFor={field.name}>{field.name}</label>
                    <input
                      id={field.name}
                      type={field.type}
                      required={field.required}
                    />
                  </div>
                );
              })}

            <button type="submit">Add Item</button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default AddItem;
