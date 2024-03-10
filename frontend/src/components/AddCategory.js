import React, { useEffect, useState } from "react";
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

  const [vendors, setVendors] = useState([]);
  const [selectedVendors, setSelectedVendors] = useState([]);

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

  const handleAddVendor = (idx) => {
    setSelectedVendors([...selectedVendors, vendors[idx]]);
    const newVendors = vendors.filter((v, i, a) => i != idx);
    setVendors(newVendors);
  }
  
  const handleRemoveVendor = (idx) => {
    setVendors([...vendors, selectedVendors[idx]]);
    const newSelectedVendors = selectedVendors.filter((v, i, a) => i != idx);
    setSelectedVendors(newSelectedVendors);
    
  }

  const [isOpen, setIsOpen] = useState(false);

  const toggleDropdown = () => {
    setIsOpen(!isOpen);
  };

  useEffect(() => {
    console.log('useEffect triggered')
    const fetchVendors = async () => {
      const res = await fetch("http://localhost:9999/vendor/vendors", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          'Authorization': `Bearer ${user?.token}`,
        },
        body: JSON.stringify({
          orgId: org?._id
        }),
      });

      const resJson = await res.json()
      console.log("resJson", resJson);
      if (!res.ok) { }

      if (res.ok) {

        setVendors(resJson);
      }

    }
    fetchVendors();
  }, [])

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
              <label htmlFor="Vendors">Vendors</label>
              <div style={{ border: '1px solid #ccc', marginTop: '5px', padding: '10px' }}>
                  {selectedVendors?.map((vendor, idx) => (
                    <div 
                    disabled={true} 
                    onClick={() => {
                      handleRemoveVendor(idx);
                    }}
                    >
                      {vendor.name}

                  </div>
                  ))}
                </div>
              <div onClick={toggleDropdown} style={{ cursor: 'pointer', padding: '10px', border: '1px solid #ccc' }}>
                Select Vendors
              </div>
              {isOpen && (
                <div
                style={{
                  top: '100%', // Position below the triggering element
                  left: '0',
                  zIndex: '1', // Ensure the dropdown is above other elements
                  border: '1px solid #ccc',
                  padding: '10px',
                }}
                >
                  {vendors?.map((vendor, idx) => (
                    <div 
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
