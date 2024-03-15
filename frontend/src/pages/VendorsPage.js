import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";

import AddVendor from "../components/AddVendor";
import classes from "./VendorsPage.module.css";
import Layout from "../components/Layout";
import NoItem from "../components/NoItem";

const VendorPage = () => {
  const user = useSelector((state) => state.auth.user);
  const org = useSelector((state) => state.org.organization);

  const [showAddItem, setShowAddItem] = useState(false);
  const [updateItem, setUpdateItem] = useState(-1);

  const [vendors, setVendors] = useState([]);

  const toggleShowAddItem = () => {
    setShowAddItem((prevState) => !prevState);
  };

  const updateVendor = async (vendorIdx) => {
    console.log("vendorIdx", vendorIdx);
    console.log("vendors", vendors);
    console.log("updating vendor: ", vendors[vendorIdx]);

    if (!vendors[vendorIdx]) {
      alert(vendorIdx, "vendor not found?!");
      return;
    }

    const res = await fetch("http://localhost:9999/vendor/update", {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${user?.token}`,
      },
      body: JSON.stringify({
        ...vendors[vendorIdx],
      }),
    });

    const resJson = await res.json();

    console.log("updateVendor resJson: ", resJson);
    if (!res.ok) {
      alert("Could not update the vendor");
    }

    if (res.ok) {
      alert("Vendor udpated successfully!");
    }
  };

  const deleteVendor = async (idx) => {
    const res = await fetch("http://localhost:9999/vendor/delete", {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${user?.token}`,
      },
      body: JSON.stringify({ vendorId: vendors[idx]._id }),
    });

    const resJson = await res.json();

    console.log("res:", res);
    console.log("resJson:", resJson);

    if (!res.ok) {
      alert("Could not delete the vendor");
    }

    if (res.ok) {
      const updatedVendors = vendors.filter((v, i) => i !== idx);
      console.log("updatedVendors", updatedVendors);
      setVendors(updatedVendors);
    }

    if (res.ok) {
      alert("Vendor deleted successfully");
    }
  };
  useEffect(() => {
    console.log("useEffect triggered");
    const fetchVendors = async () => {
      const res = await fetch("http://localhost:9999/vendor/vendors", {
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
      console.log("resJson", resJson);
      if (!res.ok) {
      }

      if (res.ok) {
        setVendors(resJson);
      }
    };
    fetchVendors();
  }, [org]);

  return (
    <Layout>
      {!showAddItem && (
        <div className={classes.vendor}>
          <div className={classes.header}>
            <h3>Active Vendors</h3>
            <button onClick={() => setShowAddItem(true)}>+ New</button>
          </div>

          <div className={classes.employee_table_container}>
            {vendors && vendors?.length > 0 && (
              <table className={classes.employee_table}>
                <thead>
                  <tr>
                    <th>Name</th>
                    <th>Address</th>
                    <th>Email</th>
                    <th>Phone</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {vendors?.map((vendor, idx) => (
                    <tr key={vendor?._id}>
                      <td>
                        <input
                          style={{ outline: "none", border: "none" }}
                          disabled={idx === updateItem ? false : true}
                          value={vendor?.name}
                          onChange={(e) => {
                            const vendorsCopy = [...vendors];
                            vendorsCopy[idx].name = e.target.value;
                            setVendors(vendorsCopy);
                          }}
                        />
                      </td>
                      <td>
                        <input
                          style={{ outline: "none", border: "none" }}
                          disabled={idx === updateItem ? false : true}
                          value={vendor?.address}
                          onChange={(e) => {
                            const vendorsCopy = [...vendors];
                            vendorsCopy[idx].address = e.target.value;
                            setVendors(vendorsCopy);
                          }}
                        />
                      </td>
                      <td>
                        <input
                          style={{ outline: "none", border: "none" }}
                          disabled={idx === updateItem ? false : true}
                          value={vendor?.email}
                          onChange={(e) => {
                            const vendorsCopy = [...vendors];
                            vendorsCopy[idx].email = e.target.value;
                            setVendors(vendorsCopy);
                          }}
                        />
                      </td>
                      <td>
                        <input
                          style={{ outline: "none", border: "none" }}
                          disabled={idx === updateItem ? false : true}
                          value={vendor?.phone}
                          onChange={(e) => {
                            const vendorsCopy = [...vendors];
                            vendorsCopy[idx].phone = e.target.value;
                            setVendors(vendorsCopy);
                          }}
                        />
                      </td>
                      <td>
                        <div className={classes.actions}>
                          {idx === updateItem ? (
                            <button
                              className={classes.done}
                              onClick={() => {
                                updateVendor(updateItem);
                                setUpdateItem(-1);
                              }}
                            >
                              Done
                            </button>
                          ) : (
                            <button
                              onClick={() => {
                                if (updateItem !== -1) {
                                  alert("Hit the done button to continue");
                                  return;
                                }
                                setUpdateItem(idx);
                              }}
                              className={classes.update}
                            >
                              Update
                            </button>
                          )}

                          {updateItem === idx ? (
                            <button
                              onClick={() => setUpdateItem(-1)}
                              className={classes.cancel}
                            >
                              Cancel
                            </button>
                          ) : (
                            <button
                              onClick={() => {
                                deleteVendor(idx);
                              }}
                              className={classes.delete}
                            >
                              Delete
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}

            {vendors && vendors.length === 0 && (
             <NoItem></NoItem>
            )}
          </div>
        </div>
      )}

      {showAddItem && (
        <div className={classes.right}>
          <AddVendor
            onClose={toggleShowAddItem}
            updateVendors={setVendors}
            vendors={vendors}
          />
        </div>
      )}
    </Layout>
  );
};

export default VendorPage;
