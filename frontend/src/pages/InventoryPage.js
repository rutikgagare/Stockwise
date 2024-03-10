import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";

import Sidebar from "../components/Sidebar";
import AddItem from "../components/AddItem";
import UpdateItem from "../components/UpdateItem";
import { inventoryActions } from "../store/inventorySlice";
import noItem from "../Images/noItem.jpg";

import classes from "./CategoryPage.module.css";

const InventoryPage = () => {
  const dispatch = useDispatch();

  const user = useSelector((state) => state.auth.user);
  const org = useSelector((state) => state?.org?.organization);
  const inventory = useSelector((state) => state.inventory.data);

  const [showAddItem, setShowAddItem] = useState(false);
  const [showUdateItem, setShowUPdateItem] = useState(false);
  const [updateItem, setUpdateItem] = useState();

  useEffect(() => {
    const fetchInventory = async () => {
      try {
        if (org) {
          const res = await fetch(
            `http://localhost:9999/inventory/${org?._id}`,
            {
              headers: {
                Authorization: `Bearer ${user?.token}`,
              },
            }
          );

          if (!res.ok) {
            throw new Error("Network response was not ok");
          }

          const json = await res.json();

          if (!Array.isArray(json)) {
            throw new Error("Response is not an array");
          }

          dispatch(inventoryActions.setInventory(json));
        }
      } catch (error) {
        console.error("Error fetching Inventory:", error);
      }
    };

    fetchInventory();
  }, [org]);

  const deleteItemHandler = async (id) => {
    try {
      const resposnse = await fetch("http://localhost:9999/inventory/delete", {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${user?.token}`,
        },
        body: JSON.stringify({
          itemId: id,
        }),
      });

      if (resposnse.ok) {
        const json = await resposnse.json();
        dispatch(inventoryActions.deleteItem({ id: json?._id }));
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

  return (
    <div className={classes.main}>
      <div className={classes.left}>
        <Sidebar />
      </div>

      {!showAddItem && !showUdateItem && (
        <div className={classes.right}>
          <div className={classes.header}>
            <h3>Inventory Items</h3>
            <button onClick={() => setShowAddItem(true)}>+ Add Item</button>
          </div>

          <div className={classes.category_table_container}>
            {inventory && inventory.length > 0 && (
              <table className={classes.category_table}>
                <thead>
                  <tr>
                    <th>Name</th>
                    <th>quantity</th>
                    <th>Serial Number</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {inventory?.map((item) => (
                    <tr key={item?._id}>
                      <td>{item?.name}</td>
                      <td>{item?.quantity}</td>
                      <td>{item?.serialNumber}</td>
                      <td className={classes.actions}>

                        <button className={classes.checkout}>CheckOut</button>

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
                          onClick={() => deleteItemHandler(item?._id)}
                        >
                          Delete
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>

          {inventory && inventory.length === 0 && (
              <div className={classes.noItem}>
                <img src={noItem} alt="" />
              </div>
            )}
        </div>
      )}

      {showAddItem && !showUdateItem && (
        <div className={classes.right}>
          <AddItem onClose={toggleShowAddItem} />
        </div>
      )}

      {!showAddItem && showUdateItem && (
        <div className={classes.right}>
          <UpdateItem item={updateItem} onClose={toggleShowUdateItem} />
        </div>
      )}
    </div>
  );
};

export default InventoryPage;
