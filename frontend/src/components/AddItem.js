import React, { useState } from "react";
import classes from "./AddCategory.module.css";
import { useDispatch, useSelector } from "react-redux";
import { inventoryActions } from "../store/inventorySlice";
import { categoryActions } from "../store/categorySlice";
import { BASE_URL } from "../constants";
import Loader from "./Loader";

const AddItem = (props) => {
  const dispatch = useDispatch();
  const user = useSelector((state) => state.auth.user);
  const org = useSelector((state) => state.org.organization);
  const categories = useSelector((state) => state.category.data);

  const [name, setName] = useState();
  const [file, setFile] = useState();
  const [quantity, setQuantity] = useState(1);
  const [serialNumber, setSerialNumber] = useState("");
  const [serialNumberList, setSerialNumberList] = useState("");

  const [selectedCategory, setSelectedCategory] = useState(null);
  const [customFields, setCustomFields] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(null);

  const [operationType, setOperationType] = useState("");

  const handleCategoryChange = (e) => {
    const categoryId = e.target.value;

    const selectedCategory = categories.find(
      (category) => category._id === categoryId
    );
    setSelectedCategory(selectedCategory);
    setCustomFields(selectedCategory?.customFields);
  };

  const handleAddItem = async (e) => {
    setLoading(true);
    e.preventDefault();

    try {
      if (!name || !selectedCategory) {
        throw Error("All fields must be filled");
      }

      if (!file) {
        throw Error("file must be selected");
      }

      if (selectedCategory.identificationType === "Single") {
        if (operationType) {
          if (operationType === "Single") {
            if (!serialNumber) {
              throw Error("serial number must be filled");
            }
          } else {
            if (!serialNumberList) {
              throw Error("serial number must be filled");
            }
          }
        } else {
          throw Error("Operation Type must be selected");
        }
      }

      if (
        selectedCategory.identificationType === "Mass" &&
        !quantity.trim()
      ) {
        throw Error("Quantity must be filled");
      }

      const formData = new FormData();
      formData.append("file", file);

      const res = await fetch(`${BASE_URL}/service/upload`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${user?.token}`,
        },
        body: formData,
      });

      const { key } = await res.json();
      console.log("key", key);

      const itemDetails = {
        name,
        categoryId: selectedCategory._id,
        assignedTo: null,
        orgId: org._id,
        identificationType: selectedCategory.identificationType,
        assignedTo: [], // Set assignedTo to an empty array
        itemImage: key,
      };

      // Add identification type specific details
      if (selectedCategory.identificationType === "Single") {
        itemDetails.serialNumber = serialNumber;
      } else if (selectedCategory.identificationType === "Mass") {
        itemDetails.quantity = parseInt(quantity);
      }

      if (customFields) {
        const customFieldsData = {};

        customFields.forEach((field) => {
          const fieldValue = document.getElementById(field.label).value;
          customFieldsData[field.label] = fieldValue;
        });

        itemDetails.customFieldsData = customFieldsData;
      }

      if(itemDetails.identificationType === 'Single' && operationType === "multiple"){
        const serialNumbersArray = serialNumberList.split(",");

        const response = await fetch(`${BASE_URL}/inventory/createMultiple`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${user?.token}`,
          },
          body: JSON.stringify({
            itemDetails,
            serialNumbers: serialNumbersArray
          }),
        });
  
        if (!response.ok) {
          const error = await response.json();
          setError(error.message);
          return;
        }
  
        if (response.ok) {
          const json = await response.json();
          console.log("json of adding multiple items", json)
          dispatch(inventoryActions.addMultipleItem(json));
          dispatch(
            categoryActions.incrementItemCount({
              categoryId: json?.categoryId,
              quantity: quantity,
            })
          );
          props.onClose();
        }
        return;
      }

      const response = await fetch(`${BASE_URL}/inventory/create`, {
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
        dispatch(inventoryActions.addItem(json));
        dispatch(
          categoryActions.incrementItemCount({
            categoryId: json?.categoryId,
            quantity,
          })
        );
        props.onClose();
      }
    } catch (error) {
      setError(error.message);
    } 
    setLoading(false);
  };

  return (
    <div className={classes.main}>
      {loading && <Loader></Loader>}
      <div className={classes.addCategory}>
        <div className={classes.header}>
          <h3>New Item</h3>
          <button onClick={() => props.onClose()}>Cancel</button>
        </div>

        <div className={classes.addCategoryForm}>
          {error && <div className={classes.error}>{error}</div>}

          <form onSubmit={handleAddItem}>
            <div className={classes.inputDiv}>
              <label htmlFor="category" className={classes.required}>
                Category Name
              </label>

              <select id="category" onChange={handleCategoryChange}>
                <option value="">Select category</option>
                {categories.map((category) => (
                  <option key={category._id} value={category._id}>
                    {category.name}
                  </option>
                ))}
              </select>
            </div>

            <div className={classes.inputDiv}>
              <label htmlFor="name" className={classes.required}>
                Name
              </label>
              <input
                id="name"
                type="text"
                onChange={(e) => setName(e.target.value)}
              />
            </div>

            <div className={classes.inputDiv}>
              <label htmlFor="image" className={classes.required}>
                Item Image
              </label>
              <input
                id="image"
                type="file"
                onChange={(e) => setFile(e.target.files[0])}
              />
            </div>

            {selectedCategory &&
              selectedCategory.identificationType === "Single" && (
                <div className={classes.inputDiv}>
                  <label htmlFor="operationType" className={classes.required}>
                    Operation Type
                  </label>
                  <select
                    id="operationType"
                    onChange={(e) => setOperationType(e.target.value)}
                  >
                    <option value="">Select Operation type</option>
                    <option value="Single">Add Single Item</option>
                    <option value="multiple">Add multiple Item</option>
                  </select>
                </div>
              )}

            {selectedCategory &&
              selectedCategory.identificationType === "Single" &&
              operationType === "Single" && (
                <div className={classes.inputDiv}>
                  <label htmlFor="serialNumber" className={classes.required}>
                    Serial Number
                  </label>
                  <input
                    id="serialNumber"
                    type="text"
                    onChange={(e) => setSerialNumber(e.target.value)}
                  />
                </div>
              )}

            {selectedCategory &&
              selectedCategory.identificationType === "Single" &&
              operationType === "multiple" && (
                <div className={classes.inputDiv}>
                  <label htmlFor="serialNumber" className={classes.required}>
                    Serial Number (enter , seperated serial Numbers)
                  </label>
                  <input
                    id="serialNumber"
                    type="text"
                    onChange={(e) => setSerialNumberList(e.target.value)}
                  />
                </div>
              )}

            {selectedCategory &&
              selectedCategory.identificationType === "Mass" && (
                <div className={classes.inputDiv}>
                  <label htmlFor="qunatity" className={classes.required}>
                    Quantity
                  </label>
                  <input
                    id="quantity"
                    type="number"
                    onChange={(e) => setQuantity(e.target.value)}
                  />
                </div>
              )}

            {/* Other input fields for item details */}
            {customFields &&
              customFields?.map((field) => {
                return (
                  <div className={classes.inputDiv}>
                    <label
                      htmlFor={field.label}
                      className={`${field?.required ? classes.required : ""}`}
                    >
                      {field.label}
                    </label>
                    <input
                      id={field.label}
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
