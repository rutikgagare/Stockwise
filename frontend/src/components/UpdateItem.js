import React, { useState } from "react";
import classes from "./AddCategory.module.css";
import { useDispatch, useSelector } from "react-redux";
import { inventoryActions } from "../store/inventorySlice";

const UpdateItem = (props) => {
  const dispatch = useDispatch();
  const user = useSelector((state) => state.auth.user);
  const org = useSelector((state) => state.org.organization);
  const item = props?.item;
  const {
    _id,
    orgId,
    categoryId,
    identificationType,
    createdAt,
    updatedAt,
    __v,
    assignedTo,
    ...itemFields
  } = item;

  const [error, setError] = useState(null);

  const handleUpdateItem = async (e) => {
    e.preventDefault();

    try {
      const itemDetails = {
        _id,
        categoryId,
        orgId,
      };

      // Loop through the keys of itemFields to create input fields dynamically
      for (let key in itemFields) {
        if (
          (key === "quantity" && identificationType === "unique") ||
          (key === "serialNumber" && identificationType === "non-unique")
        ) {
          continue;
        }
        const fieldValue = document.getElementById(key).value;
        itemDetails[key] = fieldValue;
      }

      const response = await fetch("http://localhost:9999/inventory/update", {
        method: "PUT",
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
        dispatch(inventoryActions.addItem(json));
        props.onClose();
      }
    } catch (error) {
      setError(error.message);
    }
  };

  // Create an array of JSX elements for input fields
  const inputFields = Object.keys(itemFields).map((key) => {
    console.log(key);
    if (
      (key === "quantity" && identificationType === "unique") ||
      (key === "serialNumber" && identificationType === "non-unique")
    ) {
      return null; // Skip rendering this input field
    }

    let inputType = "text"; // Default input type

    // Determine input type based on value type
    if (typeof itemFields[key] === "number") {
      inputType = "number";
    } else if (itemFields[key] instanceof Date) {
      inputType = "date";
    } // Add more conditions for other value types if needed

    return (
      <div className={classes.inputDiv} key={key}>
        <label htmlFor={key}>{key}</label>
        <input id={key} defaultValue={itemFields[key]} type={inputType} />
      </div>
    );
  });

  return (
    <div className={classes.main}>
      <div className={classes.addCategory}>
        <div className={classes.header}>
          <h3>Update Item</h3>
          <button onClick={() => props.onClose()}>Cancel</button>
        </div>

        <div className={classes.addCategoryForm}>
          {error && <div className={classes.error}>{error}</div>}

          <form onSubmit={handleUpdateItem}>
            {inputFields}
            <button type="submit">Save Changes</button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default UpdateItem;
