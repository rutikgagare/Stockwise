import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
// import Select from "react-select";
import CheckoutForm from "../components/CheckoutForm";

import Modal from "../components/Modal";
import AddItem from "../components/AddItem";
import UpdateItem from "../components/UpdateItem";
import { inventoryActions } from "../store/inventorySlice";
import noItem from "../Images/noItem.jpg";
import Layout from "../components/Layout";
import Confirm from "../components/Confirm";
import classes from "./InventoryPage.module.css";

const InventoryPage = () => {
  const dispatch = useDispatch();

  const user = useSelector((state) => state.auth.user);
  const inventory = useSelector((state) => state.inventory.data);
  const categories = useSelector((state) => state.category.data);

  const [showAddItem, setShowAddItem] = useState(false);
  const [showUdateItem, setShowUPdateItem] = useState(false);
  const [updateItem, setUpdateItem] = useState();
  const [selectedCategory, setSelectedCategory] = useState();
  const [filteredInventory, setFilteredInventory] = useState();
  const [showCheckout, setShowCheckout] = useState(false);
  const [checkoutItem, setCheckoutItem] = useState();

  const [showConfirm, setShowConfirm] = useState(false);
  const [deleteItemId, setDeleteItemId] = useState();

  const deleteItemHandler = async () => {
    setShowConfirm(false);
    try {
      const resposnse = await fetch("http://localhost:9999/inventory/delete", {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${user?.token}`,
        },
        body: JSON.stringify({
          itemId: deleteItemId,
        }),
      });

      if (resposnse.ok) {
        const json = await resposnse.json();
        dispatch(inventoryActions.deleteItem({ id: json?._id }));
      }
    } catch (err) {
      console.log(err);
    }
    setDeleteItemId("");
  };

  const toggleShowAddItem = () => {
    setShowAddItem((prevState) => !prevState);
  };

  const toggleShowUdateItem = () => {
    setShowUPdateItem((prevState) => !prevState);
  };

  // default category selection and filter logic
  useEffect(() => {
    if (!selectedCategory && categories && categories.length > 0) {
      setSelectedCategory(categories[0]);
    }

    setFilteredInventory(() =>
      inventory?.filter((item) => item?.categoryId === selectedCategory?._id)
    );
  }, [categories, selectedCategory, inventory]);

  return (
    <Layout>
      {!showAddItem && !showUdateItem && (
        <div className={classes.inventory}>
          <div className={classes.header}>
            <h3>Inventory Items</h3>
            <button onClick={() => setShowAddItem(true)}>+ Add Item</button>
          </div>

          <div className={classes.filter}>
            <select
              onChange={(e) => {
                const selectedValue = JSON.parse(e.target.value);
                setSelectedCategory(selectedValue);
              }}
              value={selectedCategory ? JSON.stringify(selectedCategory) : ""}
            >
              {categories?.map((category) => {
                return (
                  <option value={JSON.stringify(category)} key={category?._id}>
                    {category?.name}
                  </option>
                );
              })}
            </select>
          </div>

          <div className={classes.inventory_table_container}>
            {filteredInventory &&
              filteredInventory.length > 0 &&
              selectedCategory?.identificationType === "unique" && (
                <table className={classes.inventory_table}>
                  <thead>
                    <tr>
                      <th>Name</th>
                      <th>Serial Number</th>
                      <th>Status</th>
                      <th>Assigned To</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredInventory?.map((item) => (
                      <tr key={item?._id}>
                        <td>{item?.name}</td>
                        <td>{item?.serialNumber}</td>
                        <td>{item?.status}</td>
                        <td>
                          {item?.assignedTo.length > 0
                            ? item?.assignedTo[0]?.userName
                            : "Not Assigned"}
                        </td>

                        <td className={classes.actions}>
                          <button
                            className={classes.checkout}
                            onClick={() => {
                              setCheckoutItem(item);
                              setShowCheckout(true);
                            }}
                            disabled={item?.assignedTo?.length > 0}
                          >
                            CheckOut
                          </button>

                          <button
                            className={classes.update}
                            onClick={() => {
                              setUpdateItem(item);
                              toggleShowUdateItem();
                            }}
                          >
                            Update
                          </button>

                          <button
                            className={classes.delete}
                            onClick={() => {
                              setDeleteItemId(item?._id);
                              setShowConfirm(true);
                            }}
                            disabled={item?.assignedTo?.length > 0}
                          >
                            Delete
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}

            {filteredInventory &&
              filteredInventory.length > 0 &&
              selectedCategory?.identificationType === "non-unique" && (
                <table className={classes.inventory_table}>
                  <thead>
                    <tr>
                      <th>Name</th>
                      <th>Total Quantity</th>
                      <th>CheckedOut qty</th>
                      <th>Assigned To</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredInventory?.map((item) => (
                      <tr key={item?._id}>
                        <td>{item?.name}</td>
                        <td>{item?.quantity}</td>
                        <td>{item?.checkedOutQuantity}</td>
                        <td>
                          {item?.assignedTo?.map((item) => {
                            return (
                              <li>{`${item?.userName} quantity: ${item?.quantity}`}</li>
                            );
                          })}
                        </td>

                        <td>
                          <div className={classes.actions}>
                            <button
                              className={classes.checkout}
                              onClick={() => {
                                setCheckoutItem(item);
                                setShowCheckout(true);
                              }}
                              disabled={item?.checkedOutQuantity === item.quantity}

                            >
                              CheckOut
                            </button>

                            <button
                              className={classes.update}
                              onClick={() => {
                                setUpdateItem(item);
                                toggleShowUdateItem();
                              }}
                            >
                              Update
                            </button>

                            <button
                              className={classes.delete}
                              onClick={() => {
                                setDeleteItemId(item?._id);
                                setShowConfirm(true);
                              }}
                              disabled={item?.assignedTo?.length > 0}
                            >
                              Delete
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
          </div>

          {filteredInventory && filteredInventory.length === 0 && (
            <div className={classes.noItem}>
              <img src={noItem} alt="image not found" />
            </div>
          )}

          {showCheckout && (
            <Modal onClose={() => setShowCheckout(false)}>
              <CheckoutForm
                checkoutItem={checkoutItem}
                closeCheckout={() => setShowCheckout(false)}
              />
            </Modal>
          )}
        </div>
      )}

      {showAddItem && !showUdateItem && (
        <div className={classes.inventory}>
          <AddItem
            // resetCategory={() => setCategoryId("")}
            onClose={toggleShowAddItem}
          />
        </div>
      )}

      {!showAddItem && showUdateItem && (
        <div className={classes.inventory}>
          <UpdateItem
            // resetCategory={() => setCategoryId("")}
            item={updateItem}
            onClose={toggleShowUdateItem}
          />
        </div>
      )}

      {showConfirm && (
        <Confirm
          onCancel={() => setShowConfirm(false)}
          onDelete={deleteItemHandler}
        ></Confirm>
      )}
    </Layout>
  );
};

export default InventoryPage;
