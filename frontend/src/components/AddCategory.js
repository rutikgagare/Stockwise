import React, { useEffect, useState } from "react";
import classes from "./AddCategory.module.css";
import { useDispatch, useSelector } from "react-redux";
import { categoryActions } from "../store/categorySlice";
import { BASE_URL } from "../constants";

const AddCategory = (props) => {
  const dispatch = useDispatch();
  const user = useSelector((state) => state.auth.user);
  const org = useSelector((state) => state.org.organization);

  const [name, setName] = useState();
  const [identificationType, setIdentificationType] = useState(null);
  const [customFields, setCustomFields] = useState([]);
  const [error, setError] = useState(null);

  const [vendors, setVendors] = useState([]);
  const [selectedVendors, setSelectedVendors] = useState([]);

  const createCategoryHandler = async (e) => {
    e.preventDefault();
    try {
      if (!name || !identificationType) {
        throw Error("All field must be field");
      }
      console.log(customFields);

      const selectedVendorsIds = [];
      for (const sv of selectedVendors) selectedVendorsIds.push(sv._id);

      const response = await fetch(`${BASE_URL}/category/create`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${user?.token}`,
        },
        body: JSON.stringify({
          name,
          identificationType,
          customFields,
          vendors: selectedVendorsIds,
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
    setCustomFields((prevCustomFields) => {
      const updatedCustomFields = [...prevCustomFields];

      updatedCustomFields[index] = {
        ...updatedCustomFields[index],
        [field]: value,
      };

      return updatedCustomFields;
    });
  };

  const handleAddCustomField = () => {
    setCustomFields((prevState) => [...prevState, {}]);
  };

  const handleRemoveCustomField = (index) => {
    const updatedCustomFields = customFields.filter((_, idx) => idx !== index);
    setCustomFields(updatedCustomFields);
  };

  const handleAddVendor = (idx) => {
    setSelectedVendors([...selectedVendors, vendors[idx]]);
    const newVendors = vendors.filter((v, i, a) => i != idx);
    setVendors(newVendors);
  };

  const handleRemoveVendor = (idx) => {
    setVendors([...vendors, selectedVendors[idx]]);
    const newSelectedVendors = selectedVendors.filter((v, i, a) => i != idx);
    setSelectedVendors(newSelectedVendors);
  };

  const [isOpen, setIsOpen] = useState(false);

  const toggleDropdown = () => {
    setIsOpen(!isOpen);
  };

  useEffect(() => {
    const fetchVendors = async () => {
      const res = await fetch(`${BASE_URL}/vendor/vendors`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${user?.token}`,
        },
        body: JSON.stringify({
          orgId: org?._id,
        }),
      });

      const resJson = await res.json();

      if (!res.ok) {
      }

      if (res.ok) {
        setVendors(resJson);
      }
    };
    fetchVendors();
  }, []);

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

            <h4>Fixed fields</h4>

            <div className={classes.inputDiv}>
              <label htmlFor="">Item Name</label>
              <input type="text" disabled placeholder="Fixed field" />
            </div>

            <div className={classes.inputDiv}>
              <label htmlFor="">Item Image</label>
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

            <h4>Select vendors for category</h4>
            <div className={classes.inputDiv}>
              {selectedVendors && selectedVendors.length > 0 && <div className={classes.vendors_div}>
                {selectedVendors?.map((vendor, idx) => (
                  <div
                    className={classes.vendorDivSelected}
                    disabled={true}
                    onClick={() => {
                      handleRemoveVendor(idx);
                    }}
                  >
                    {vendor.name}
                  </div>
                ))}
              </div>}

              <div
                onClick={toggleDropdown}
                style={{
                  cursor: "pointer",
                  padding: "10px",
                  border: "1px solid #ccc",
                }}
              >
                <span>Select Vendors {vendors.length === 0 ? " - No vendors/ All Selected" : "" } </span>
              </div>
              {isOpen && (
                vendors && vendors.length > 0 && <div className={`${classes.vendors_div}`}>
                  {vendors?.map((vendor, idx) => (
                    <div
                      className={classes.vendorDiv}
                      disabled={true}
                      onClick={() => {
                        handleAddVendor(idx);
                      }}
                    >
                      {vendor.name}
                    </div>
                  ))}
                </div>
              )}
            </div>

            {customFields.length > 0 && (
              <h4>Custom fields for this category</h4>
            )}

            {customFields.map((field, index) => (
              <div className={classes.customField} key={index}>
                <div className={classes.inputDiv}>
                  <label>Custom Field Name</label>
                  <input
                    type="text"
                    value={field.label}
                    onChange={(e) =>
                      handleCustomFieldChange(index, "label", e.target.value)
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

            <button
              type="button"
              onClick={handleAddCustomField}
              className={classes.custFieldBtn}
            >
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
