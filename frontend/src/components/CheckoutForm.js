import React, { useState, useEffect } from "react";
import classes from "./CheckoutForm.module.css";
import { useSelector } from "react-redux";
import { inventoryActions } from "../store/inventorySlice";
import { useDispatch } from "react-redux";
import axios from "axios";

const CheckoutForm = ({ checkoutItem, closeCheckout }) => {
  const dispatch = useDispatch();

  const org = useSelector((state) => state?.org?.organization);
  const user = useSelector((state) => state?.auth?.user);

  const [employees, setEmployees] = useState(null);
  const [selectedUser, setSelectedUser] = useState();
  const [quantity, setQuantity] = useState(1);
  const [error, setError] = useState();

  const fetchEmployees = async () => {
    try {
      if (org) {
        const res = await axios.get(
          `http://localhost:9999/org/employees/${org?._id}`,
          {
            headers: {
              Authorization: `Bearer ${user?.token}`,
            },
          }
        );

        const employees = await res.data;
        setEmployees(employees);
      }
    } catch (error) {}
  };

  useEffect(() => {
    fetchEmployees();
  }, [org]);

  const submitHandler = async (e) => {
    e.preventDefault();

    try {
      setError(null); // Reset error state at the beginning of the submitHandler

      if (!selectedUser) {
        throw new Error("Please select the user");
      }

      if (quantity > checkoutItem?.quantity) {
        throw new Error("Selected quantity exceeds available quantity");
      }

      const res = await fetch("http://localhost:9999/inventory/checkout", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${user?.token}`,
        },
        body: JSON.stringify({
          itemId: checkoutItem?._id,
          assignedTo: {
            userId: selectedUser?._id,
            userName: selectedUser?.name,
            quantity,
          },
        }),
      });

      if (!res.ok) {
        throw new Error("Failed to checkout item");
      }

      const json = await res.json();
      
      const messageContent = `You've been assigned a new asset: ${checkoutItem?.name}. Please visit your profile to view the details of the new asset.`;

      dispatch(inventoryActions.updateItem(json));
      closeCheckout();

      // sending mail to user regarding device is assigned to you
      await fetch("http://localhost:9999/service/sendMail", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${user?.token}`,
        },

        body: JSON.stringify({
          userEmail: selectedUser?.email,
          messageContent,
          itemImage: checkoutItem?.itemImage,
          subject: "Asset Checkout Completed",
        }),
      });


    } catch (error) {
      setError(error.message);
    }
  };

  return (
    <div>
      <div className={classes.error}>{error}</div>

      <form onSubmit={submitHandler} className={classes.checkoutForm}>
        <div className={classes.inputDiv}>
          <label htmlFor="">Asset Name</label>
          <input type="text" value={checkoutItem?.name} disabled />
        </div>

        <div className={classes.inputDiv}>
          <label htmlFor="">Employee Name</label>
          <select
            onChange={(e) => {
              const selectedValue = JSON.parse(e.target.value);
              setSelectedUser(selectedValue);
            }}
            value={selectedUser ? JSON.stringify(selectedUser) : ""}
          >
            <option value="">Select User</option>
            {employees?.map((employee) => {
              return (
                <option value={JSON.stringify(employee)} key={employee?._id}>
                  {`${employee?.name} - ${employee?.email}`}
                </option>
              );
            })}
          </select>
        </div>

        {checkoutItem?.identificationType === "unique" && (
          <div className={classes.inputDiv}>
            <label htmlFor="">Serial Number</label>
            <input type="text" value={checkoutItem?.serialNumber} disabled />
          </div>
        )}

        {checkoutItem?.identificationType === "non-unique" && (
          <div className={classes.inputDiv}>
            <label htmlFor="">
              Quantity Available:{" "}
              {checkoutItem.quantity - checkoutItem.checkedOutQuantity}
            </label>
            <input
              max={checkoutItem.quantity - checkoutItem.checkedOutQuantity}
              type="number"
              placeholder="Enter number of quantity you want to assign"
              value={quantity}
              onChange={(e) => setQuantity(e.target.value)}
            />
          </div>
        )}

        <button type="submit">Assign</button>
      </form>
    </div>
  );
};

export default CheckoutForm;
