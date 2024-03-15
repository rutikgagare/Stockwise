import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
// import Select from "react-select";

import CheckoutForm from "../components/CheckoutForm";
import CheckinForm from "../components/CheckinForm";
import Modal from "../components/Modal";
import AddItem from "../components/AddItem";
import UpdateItem from "../components/UpdateItem";
import { inventoryActions } from "../store/inventorySlice";
import { categoryActions } from "../store/categorySlice";
import Layout from "../components/Layout";
import Confirm from "../components/Confirm";
import ItemDetailedView from "../components/ItemDetailedView";
import classes from "./InventoryPage.module.css";
import NoItem from "../components/NoItem";
import Lifecycle from "../components/Lifecycle";

import { MdDelete } from "react-icons/md";
import { MdEdit } from "react-icons/md";
import { BsInfoLg } from "react-icons/bs";
import { GrPowerCycle } from "react-icons/gr";

const InventoryPage = () => {
  const dispatch = useDispatch();

  const user = useSelector((state) => state.auth.user);
  const inventory = useSelector((state) => state.inventory.data);
  const categories = useSelector((state) => state.category.data);

  const [showAddItem, setShowAddItem] = useState(false);
  const [showUdateItem, setShowUPdateItem] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState();
  const [filteredInventory, setFilteredInventory] = useState();
  const [showCheckout, setShowCheckout] = useState(false);
  const [showCheckin, setShowCheckin] = useState(false);
  const [showDetailedView, setShowDetailedView] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [showLifecycle, setShowLifecycle] = useState(false);
  const [selectedItem, setSelectedItem] = useState();

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
          itemId: selectedItem?._id,
        }),
      });

      if (resposnse.ok) {
        const json = await resposnse.json();
        dispatch(inventoryActions.deleteItem({ id: json?._id }));
        dispatch(categoryActions.decrementItemCount(json?.categoryId));
      }
    } catch (err) {
      console.log(err);
    }
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

          {categories && categories.length > 0 &&<div className={classes.filter}>
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
          </div>}

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
                          {item?.assignedTo && item?.assignedTo.length > 0
                            ? item?.assignedTo[0]?.userName
                            : "Not Assigned"}
                        </td>

                        <td>
                          <div className={classes.actions}>
                            {item?.assignedTo &&
                              item?.assignedTo?.length === 0 && (
                                <button
                                  className={classes.checkout}
                                  onClick={() => {
                                    setSelectedItem(item);
                                    setShowCheckout(true);
                                  }}
                                >
                                  CheckOut
                                </button>
                              )}

                            {item?.assignedTo &&
                              item?.assignedTo?.length > 0 && (
                                <button
                                  className={classes.checkin}
                                  onClick={() => {
                                    setSelectedItem(item);
                                    setShowCheckin(true);
                                  }}
                                  disabled={
                                    !item?.assignedTo ||
                                    (item?.assignedTo &&
                                      item?.assignedTo.length === 0)
                                  }
                                >
                                  CheckIn
                                </button>
                              )}

                            <button
                              onClick={() => {
                                setSelectedItem(item);
                                setShowDetailedView(true);
                              }}
                            >
                              <BsInfoLg className={classes.icon} />
                            </button>

                            {item?.lifecycle && item?.lifecycle.length > 0 && (
                              <button
                                onClick={() => {
                                  setSelectedItem(item);
                                  setShowLifecycle(true);
                                }}
                              >
                                <GrPowerCycle className={classes.icon} />
                              </button>
                            )}

                            <button
                              className={classes.update}
                              onClick={() => {
                                setSelectedItem(item);
                                toggleShowUdateItem();
                              }}
                            >
                              <MdEdit className={classes.icon} />
                            </button>

                            <button
                              className={classes.delete}
                              onClick={() => {
                                setSelectedItem(item);
                                setShowConfirm(true);
                              }}
                              disabled={item?.assignedTo?.length > 0}
                            >
                              <MdDelete className={classes.icon} />
                            </button>
                          </div>
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
                          <div className={classes.userList}>
                            {item?.assignedTo &&
                              item?.assignedTo?.map((item) => {
                                if (!item) {
                                  return;
                                }
                                return (
                                  <div>
                                    {" "}
                                    {`${item.userName} | `}
                                    <span className={classes.quantity}>
                                      Quantity:
                                    </span>{" "}
                                    {item.quantity}
                                  </div>
                                );
                              })}
                          </div>
                        </td>

                        <td>
                          <div className={classes.actions}>
                            <button
                              className={classes.checkout}
                              onClick={() => {
                                setSelectedItem(item);
                                setShowCheckout(true);
                              }}
                              disabled={
                                item?.checkedOutQuantity === item.quantity
                              }
                            >
                              CheckOut
                            </button>

                            <button
                              className={classes.checkin}
                              onClick={() => {
                                setSelectedItem(item);
                                setShowCheckin(true);
                              }}
                              disabled={item?.checkedOutQuantity === 0}
                            >
                              CheckIn
                            </button>

                            <button
                              onClick={() => {
                                setSelectedItem(item);
                                setShowDetailedView(true);
                              }}
                            >
                              <BsInfoLg className={classes.icon} />
                            </button>

                            <button
                              className={classes.update}
                              onClick={() => {
                                setSelectedItem(item);
                                toggleShowUdateItem();
                              }}
                            >
                              <MdEdit className={classes.icon} />
                            </button>

                            <button
                              className={classes.delete}
                              onClick={() => {
                                setSelectedItem(item);
                                setShowConfirm(true);
                              }}
                              disabled={item?.assignedTo?.length > 0}
                            >
                              <MdDelete className={classes.icon} />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
          </div>

          {filteredInventory && filteredInventory.length === 0 && <NoItem />}

          {showCheckout && (
            <Modal onClose={() => setShowCheckout(false)}>
              <CheckoutForm
                checkoutItem={selectedItem}
                closeCheckout={() => setShowCheckout(false)}
              />
            </Modal>
          )}

          {showCheckin && (
            <Modal onClose={() => setShowCheckin(false)}>
              <CheckinForm
                checkinItem={selectedItem}
                closeCheckin={() => setShowCheckin(false)}
              />
            </Modal>
          )}

          {showDetailedView && (
            <Modal onClose={() => setShowDetailedView(false)} width="50%">
              <ItemDetailedView item={selectedItem}></ItemDetailedView>
            </Modal>
          )}

          {showLifecycle && (
            <Modal onClose={() => setShowLifecycle(false)} width="50%">
              <Lifecycle
                lifecycle={selectedItem?.lifecycle}
                itemName={selectedItem?.name}
              ></Lifecycle>
            </Modal>
          )}
        </div>
      )}

      {showAddItem && !showUdateItem && (
        <div className={classes.inventory}>
          <AddItem onClose={toggleShowAddItem} />
        </div>
      )}

      {!showAddItem && showUdateItem && (
        <div className={classes.inventory}>
          <UpdateItem item={selectedItem} onClose={toggleShowUdateItem} />
        </div>
      )}

      {showConfirm && (
        <Confirm
          onCancel={() => setShowConfirm(false)}
          onDelete={deleteItemHandler}
          message="Deleting this item will also permanently remove its associated lifecycle data. This action cannot be undone."
        ></Confirm>
      )}
    </Layout>
  );
};

export default InventoryPage;
