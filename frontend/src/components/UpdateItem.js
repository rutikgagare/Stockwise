import React, { useState } from "react";
import classes from "./AddCategory.module.css";
import { useDispatch, useSelector } from "react-redux";
import { inventoryActions } from "../store/inventorySlice";
import { BASE_URL } from "../constants";

const UpdateItem = (props) => {
  const dispatch = useDispatch();

  const [name, setName] = useState(props?.item?.name);
  const [identificationType, setIdentificationType] = useState();
  const [quantity, setQuantity] = useState(props?.item?.quantity);
  const [serialNumber, setSerialNumber] = useState(props?.item?.serialNumber);

  const user = useSelector((state) => state.auth.user);
  const categories = useSelector((state) => state.category.data);

  const [customFieldsData, setcustomFieldsData] = useState(
    props.item.customFieldsData
  );
  const [customFields, setCustomFields] = useState();

  const handlerFormFields = () => {
    const category = categories.find(
      (category) => category._id === props?.item?.categoryId
    );
    setCustomFields(category.customFields);
    setIdentificationType(category.identificationType);
  };

  useState(() => {
    handlerFormFields();
  }, [categories]);

  const [error, setError] = useState(null);

  const handleUpdateItem = async (e) => {
    e.preventDefault();

    try {
      if (!name) {
        throw Error("Required fields must be filled");
      }

      if (props.item.identificationType === "unique" && !serialNumber.trim()) {
        throw Error("Serial Number must be filled");
      }

      if (props.item.identificationType === "non-unique" && !quantity) {
        throw Error("Quantity must be filled");
      }

      const itemDetails = {
        itemId: props?.item?._id,
        name,
      };

      if (identificationType === "unique") {
        itemDetails.serialNumber = serialNumber;
      } else if (identificationType === "non-unique") {
        itemDetails.quantity = parseInt(quantity);
      }

      if (customFields) {
        const updatedCustomFieldsData = {};

        customFields.forEach((field) => {
          const fieldValue = document.getElementById(field.label).value;
          updatedCustomFieldsData[field.label] = fieldValue;
        });

        itemDetails.customFieldsData = updatedCustomFieldsData;
      }

      const response = await fetch(`${BASE_URL}/inventory/update`, {
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
        dispatch(inventoryActions.updateItem(json));
        props.onClose();
      }
    } catch (error) {
      setError(error.message);
    }
  };

  const handleCustomFieldChange = (label, value) => {
    setcustomFieldsData((prevData) => ({
      ...prevData,
      [label]: value,
    }));
  };

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
            <div className={classes.inputDiv}>
              <label htmlFor="name" className={classes.required}>
                Name
              </label>
              <input
                id="name"
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
            </div>

            {identificationType && identificationType === "unique" && (
              <div className={classes.inputDiv}>
                <label htmlFor="serialNumber" className={classes.required}>
                  Serial Number
                </label>
                <input
                  id="serialNumber"
                  value={serialNumber}
                  type="text"
                  onChange={(e) => setSerialNumber(e.target.value)}
                />
              </div>
            )}

            {identificationType && identificationType === "non-unique" && (
              <div className={classes.inputDiv}>
                <label htmlFor="qunatity" className={classes.required}>
                  Quantity
                </label>
                <input
                  id="quantity"
                  type="number"
                  value={quantity}
                  onChange={(e) => setQuantity(e.target.value)}
                  min={props.item.checkedOutQuantity}
                />
              </div>
            )}
            {customFields &&
              customFields.map((field) => {
                return (
                  <div className={classes.inputDiv} key={field.label}>
                    <label
                      htmlFor={field.label}
                      className={`${field?.required ? classes.required : ""}`}
                    >
                      {field.label}
                    </label>
                    <input
                      id={field.label}
                      value={customFieldsData && customFieldsData[field?.label]}
                      type={field.type}
                      onChange={(e) =>
                        handleCustomFieldChange(field.label, e.target.value)
                      }
                      required={field.required}
                    />
                  </div>
                );
              })}

            <button type="submit">Save Changes</button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default UpdateItem;
