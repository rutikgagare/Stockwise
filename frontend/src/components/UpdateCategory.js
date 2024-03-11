import React, { useEffect, useState } from "react";
import classes from "./AddCategory.module.css";
import { useDispatch, useSelector } from "react-redux";
import { categoryActions } from "../store/categorySlice";

const UpdateCategory = (props) => {
  const dispatch = useDispatch();
  const user = useSelector((state) => state.auth.user);
  const org = useSelector((state) => state.org.organization);

  const category = props.Category;

  const [name, setName] = useState(category.name);
  const [identificationType, setIdentificationType] = useState(
    category.identificationType
  );
  const [customFields, setCustomFields] = useState(category.customFields);

  const [vendors, setVendors] = useState([]);
  const [selectedVendors, setSelectedVendors] = useState([]);

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

  const updateCategoryHandler = async (e) => {
    e.preventDefault();
    try {
      const selectedVendorsIds = [];
      for (const sv of selectedVendors) selectedVendorsIds.push(sv._id);
      
      const response = await fetch("http://localhost:9999/Category/update", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${user?.token}`,
        },
        body: JSON.stringify({
          categoryId: category?._id,
          name,
          identificationType,
          vendors: selectedVendorsIds,
          customFields,
        }),
      });

      if (response.ok) {
        const json = await response.json();
        dispatch(categoryActions.updateCategory(json));
      }
    } catch (err) {
      console.log(err);
    }
    props.onClose();
  };

  useEffect(() => {
    const fetchVendors = async () => {
      try {
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
  
        const resJson = await res.json();
  
        if (res.ok) {
          setVendors(resJson);
  
          // set selected vendors
          const sv = [];
          const rm_idx = [];
          for (const v_id of category.vendors) {
            for (let i = 0; i < resJson.length; i++) {
              if (v_id === resJson[i]._id) {
                sv.push(resJson[i]);
                rm_idx.push(i);
              }
            }
          }
  
          setSelectedVendors(sv);
          let filteredVendors = resJson.filter((vendor, idx) => rm_idx.indexOf(idx) === -1);
          setVendors(filteredVendors);
        }
  
      } catch (error) {
        console.log(error);
      }
    };
  
    fetchVendors();
  }, []); // Empty dependency array to run the effect only once on component mount  

  return (
    <div className={classes.main}>
      <div className={classes.addCategory}>
        <div className={classes.header}>
          <h3>New Category</h3>
          <button onClick={() => props.onClose()}>Cancel</button>
        </div>

        <div className={classes.addCategoryForm}>
          {/* {error && <div className={classes.error}>{error}</div>} */}
          <form onSubmit={updateCategoryHandler}>
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
              <div className={classes.vendors_div}>
                {selectedVendors?.map((vendor, idx) => (
                  <div className={classes.vendorDiv}
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
                <div className={`${classes.vendors_div}`}>
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
                <label htmlFor="identificationType">Qunatity</label>
                <input
                  type="number"
                  disabled
                  placeholder="Fixed field based on selection"
                />
              </div>
            )}

            {customFields.length > 0 && <h4>Custom fields for this category</h4>}

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
                  />
                </div>

                <div className={classes.inputDiv}>
                  <label>Custom Field Type</label>
                  <select
                    value={field.type}
                    onChange={(e) =>
                      handleCustomFieldChange(index, "type", e.target.value)
                    }
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

            <button type="submit">Save changes</button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default UpdateCategory;
