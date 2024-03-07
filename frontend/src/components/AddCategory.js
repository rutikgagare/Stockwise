import React, { useState } from "react";
import classes from "./AddCategory.module.css";
import { useDispatch, useSelector } from "react-redux";
import { categoryActions } from "../store/categorySlice";

const AddCategory = (props) => {
  const dispatch = useDispatch();
  const user = useSelector((state) => state.auth.user);
  const org = useSelector((state) => state.org.organization);

  const [name, setName] = useState();
  const [identificationType, setIdentificationType] = useState(null);
  const [customFields, setCustomFields] = useState([]);
  const [error, setError] = useState(null);

  const createCategoryHandler = async (e) => {
    e.preventDefault();
    try {
      if (!name || !identificationType) {
        throw Error("All field must be field");
      }

      const response = await fetch("http://localhost:9999/category/create", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${user?.token}`,
        },
        body: JSON.stringify({
          name,
          identificationType,
          customFields,
          orgId: org?._id,
        }),
      });

      if (!response.ok) {
        const error = await response.json();
        setError(error.message);
        return;
      }

      if (response.ok) {
        const json = await response.json();
        dispatch(categoryActions.addCategory(json));
        props.onClose();
      }
    } catch (error) {
      setError(error.message);
    }
  };

  const handleCustomFieldChange = (index, field, value) => {
    customFields[index][field] = value;
  };

  const handleAddCustomField = () => {
    setCustomFields((prevState) => [...prevState, {}]);
  };

  const handleRemoveCustomField = (index) => {
    const updatedCustomFields = customFields.filter((_, idx) => idx !== index);
    setCustomFields(updatedCustomFields);
  };

  return (
    <div className={classes.main}>
      <div className={classes.addCategory}>
        <div className={classes.header}>
          <h3>New Category</h3>
          <button onClick={() => props.onClose()}>Cancel</button>
        </div>

        <div className={classes.addCategoryForm}>
          {error && <div className={classes.error}>{error}</div>}
          <form onSubmit={createCategoryHandler}>
            <div className={classes.inputDiv}>
              <label htmlFor="name">Category Name</label>
              <input
                id="name"
                type="text"
                value={name}
                placeholder="Enter Category name"
                onChange={(e) => setName(e.target.value)}
              />
            </div>

            <div className={classes.inputDiv}>
              <label htmlFor="identificationType">Identification Type</label>
              <select
                id="identificationType"
                value={identificationType}
                onChange={(e) => {
                  setIdentificationType(e.target.value);
                }}
              >
                <option value="">Select type</option>
                <option value="unique">unique</option>
                <option value="non-unique">non-unique</option>
              </select>
            </div>

            <div className={classes.inputDiv}>
              <label htmlFor="Product Name">Product Name</label>
              <input type="text" disabled placeholder="Fixed field" />
            </div>

            {identificationType && <h4>Fixed fields based on selection</h4>}

            {identificationType === "unique" && (
              <div className={classes.inputDiv}>
                <label htmlFor="identificationType">Serial Number</label>
                <input
                  type="text"
                  disabled
                  placeholder="Fixed field based on selection"
                />
              </div>
            )}

            {identificationType === "non-unique" && (
              <div className={classes.inputDiv}>
                <label htmlFor="identificationType">Quantity</label>
                <input
                  type="number"
                  disabled
                  placeholder="Fixed field based on selection"
                />
              </div>
            )}

            {customFields.length > 0 && <h4>Custom fields</h4>}

            {customFields.map((field, index) => (
              <div className={classes.customField} key={index}>
                <div className={classes.inputDiv}>
                  <label>Custom Field Name</label>
                  <input
                    type="text"
                    value={field.name}
                    onChange={(e) =>
                      handleCustomFieldChange(index, "name", e.target.value)
                    }
                    required
                  />
                </div>

                <div className={classes.inputDiv}>
                  <label>Custom Field Type</label>
                  <select
                    value={field.type}
                    onChange={(e) =>
                      handleCustomFieldChange(index, "type", e.target.value)
                    }
                    required
                  >
                    <option value="">Select type</option>
                    <option value="text">Text</option>
                    <option value="number">Number</option>
                    <option value="date">Date</option>
                  </select>
                </div>

                <div className={classes.inputDiv}>
                  <label>Required</label>
                  <input
                    type="checkbox"
                    checked={field.required}
                    onChange={(e) =>
                      handleCustomFieldChange(
                        index,
                        "required",
                        e.target.checked
                      )
                    }
                  />
                </div>

                <i
                  class="fa-regular fa-circle-xmark"
                  onClick={() => handleRemoveCustomField(index)}
                ></i>
              </div>
            ))}

            <button type="button" onClick={handleAddCustomField} className={classes.custFieldBtn}>
              Add Custom Field
            </button>

            <button type="submit">Create Category</button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default AddCategory;
