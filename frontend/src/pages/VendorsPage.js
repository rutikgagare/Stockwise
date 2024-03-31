import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";

import AddVendor from "../components/AddVendor";
import classes from "./VendorsPage.module.css";
import Layout from "../components/Layout";
import NoItem from "../components/NoItem";
import ReactPaginate from 'react-paginate';

import { FiSearch } from "react-icons/fi";

import "./reactPaginate.css"

const VendorPage = () => {
  const user = useSelector((state) => state.auth.user);
  const org = useSelector((state) => state.org.organization);

  const [showAddItem, setShowAddItem] = useState(false);
  const [updateItem, setUpdateItem] = useState(-1);

  const [vendors, setVendors] = useState([]);
  const [vendorsCopy, setVendorsCopy] = useState([]);

  const [searchText, setSearchText] = useState('');

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
    const c = window.confirm("Are sure want to delete the vendor?");
    if (!c) return;

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
      setVendorsCopy(updatedVendors);
    }

    if (res.ok) {
      alert("Vendor deleted successfully");
    }
  };

  const handleSearch = (e) => {
    setSearchText(e.target.value);
    if (!searchText) {
      console.log('setall')
      setVendors(vendorsCopy);
      return;
    }
    const resultVendors = vendorsCopy.filter((value, index, array) => {
      for (const v of Object.values(value)) {
        if (typeof (v) == "string" && v.includes(searchText)) return true;
      }
      return false;
    })

    // console.log("searchvendors: ", resultVendors);
    setVendors(resultVendors);
  }

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
        setVendorsCopy(resJson);
      }
    };
    fetchVendors();
  }, [org]);

  const [itemOffset, setItemOffset] = useState(0);
  const itemsPerPage = 10;
  const endOffset = itemOffset + itemsPerPage;
  const currentVendors = vendors.slice(itemOffset, endOffset);
  const pageCount = Math.ceil(vendors.length / itemsPerPage);

  const handlePageClick = (event) => {
    const newOffset = (event.selected * itemsPerPage) % vendors.length;
    console.log(
      `User requested page number ${event.selected}, which is offset ${newOffset}`
    );
    setItemOffset(newOffset);
  };

  return (
    <Layout>
      {!showAddItem && (
        <div className={classes.vendor}>
          <div className={classes.header}>
            <h3>Active Vendors</h3>
            <button onClick={() => setShowAddItem(true)} >+ New</button>
          </div>

          <div className={classes.searchBar}>
            <input value={searchText} onChange={(e) => { handleSearch(e) }} />
            <button>
              <FiSearch />
            </button>
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
                  {currentVendors && currentVendors?.map((vendor, idx) => (
                    <tr key={vendor?._id}>
                      <td>
                        <input
                          style={{ outline: "none", border: "none" }}
                          disabled={idx === updateItem ? false : true}
                          value={vendor?.name}
                          onChange={(e) => {
                            const _vendorsCopy = [...vendors];
                            _vendorsCopy[idx].name = e.target.value;
                            setVendors(_vendorsCopy);
                            setVendorsCopy(_vendorsCopy)
                          }}
                        />
                      </td>
                      <td>
                        <input
                          style={{ outline: "none", border: "none" }}
                          disabled={idx === updateItem ? false : true}
                          value={vendor?.address}
                          onChange={(e) => {
                            const _vendorsCopy = [...vendors];
                            _vendorsCopy[idx].address = e.target.value;
                            setVendors(_vendorsCopy);
                            setVendorsCopy(_vendorsCopy)
                          }}
                        />
                      </td>
                      <td>
                        <input
                          style={{ outline: "none", border: "none" }}
                          disabled={idx === updateItem ? false : true}
                          value={vendor?.email}
                          onChange={(e) => {
                            const _vendorsCopy = [...vendors];
                            _vendorsCopy[idx].email = e.target.value;
                            setVendors(_vendorsCopy);
                            setVendorsCopy(_vendorsCopy)
                          }}
                        />
                      </td>
                      <td>
                        <input
                          style={{ outline: "none", border: "none" }}
                          disabled={idx === updateItem ? false : true}
                          value={vendor?.phone}
                          onChange={(e) => {
                            const _vendorsCopy = [...vendors];
                            _vendorsCopy[idx].phone = e.target.value;
                            setVendors(_vendorsCopy);
                            setVendorsCopy(_vendorsCopy);
                          }}
                        />
                      </td>
                      <td>
                        <div className={classes.actions}>
                          {idx === updateItem ? (
                            <button
                              onClick={() => setUpdateItem(-1)}
                              className={classes.cancel}
                            >
                              Cancel
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

          <ReactPaginate
            activeClassName='pagination-active'
            breakClassName='pagination-break'
            containerClassName='pagination-container'
            marginPagesDisplayed={2}
            nextClassName='pagination-next-prev'
            onPageChange={handlePageClick}
            pageCount={pageCount}
            pageRangeDisplayed={3}
            pageClassName='pagination-page'
            previousClassName='pagination-next-prev'
          />

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
