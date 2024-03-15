import React, { useState } from "react";
import classes from "./CheckoutForm.module.css";
import { useSelector } from "react-redux";
import { inventoryActions } from "../store/inventorySlice";
import { useDispatch } from "react-redux";

const CheckinForm = ({ checkinItem, closeCheckin }) => {
  const dispatch = useDispatch();

  const user = useSelector((state) => state?.auth?.user);
  const [quantity, setQuantity] = useState(1);
  const [assignment, setAssignment] = useState();

  const submitHandler = async (e) => {
    e.preventDefault();

    try {
      const res = await fetch("http://localhost:9999/inventory/checkin", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${user?.token}`,
        },
        body: JSON.stringify({
          itemId: checkinItem?._id,
          quantity,
          userId: assignment ? assignment?.userId : "",
        }),
      });

      if (!res.ok) {
        const error = await res.json();
        console.log(error);
        return;
      }

      if (res.ok) {
        const json = await res.json();
        dispatch(inventoryActions.updateItem(json));
      }
    } catch (error) {
      console.log(error);
    }
    closeCheckin();
  };

  return (
    <div>
      <form onSubmit={submitHandler} className={classes.checkoutForm}>
        <div className={classes.inputDiv}>
          <label htmlFor="">Asset Name</label>
          <input type="text" value={checkinItem?.name} disabled />
        </div>

        {checkinItem?.identificationType === "unique" && (
          <div className={classes.inputDiv}>
            <label htmlFor="">User Name</label>
            <input type="text" value={checkinItem?.assignedTo[0].userName} disabled />
          </div>
        )}
        
        {checkinItem?.identificationType === "unique" && (
          <div className={classes.inputDiv}>
            <label htmlFor="">Serial Number</label>
            <input type="text" value={checkinItem?.serialNumber} disabled />
          </div>
        )}


        {checkinItem?.identificationType === "non-unique" &&
          checkinItem?.assignedTo && (
            <div className={classes.inputDiv}>
              <select
                onChange={(e) => setAssignment(JSON.parse(e.target.value))}
                required
              >
                <option value="">Select a user</option>
                {checkinItem.assignedTo.map((assignment) => (
                  <option
                    key={assignment.userId}
                    value={JSON.stringify(assignment)}
                  >
                    {assignment.userName}
                  </option>
                ))}
              </select>
            </div>
          )}

        {assignment && (
          <div className={classes.inputDiv}>
            <label htmlFor="">CheckIn Quantity</label>
            <input
              type="number"
              max={assignment.quantity}
              onChange={(e) => setQuantity(e.target.value)}
              required
            />
          </div>
        )}

        <button type="submit">Confirm CheckIn</button>
      </form>
    </div>
  );
};

export default CheckinForm;
