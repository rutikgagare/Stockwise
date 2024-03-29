import React, { useState } from "react";
import classes from "./CreateTicket.module.css";
import { useSelector, useDispatch } from "react-redux";
import { ticketAdminActions } from "../store/ticketAdminSlice";

const UpdateTicketStatus = ({ ticket, onClose }) => {
  const user = useSelector((state) => state?.auth?.user);
  const dispatch = useDispatch();

  const [error, setError] = useState();
  const [status, setStatus] = useState();
  const [remark, setRemark] = useState();

  const updateStatusHandler = async (e) => {
    e.preventDefault();
    try {
      if (!status) {
        throw Error("All required field must be field");
      }

      let updatedTicket = { status, ticketId: ticket._id };

      if (remark) {
        updatedTicket.remark = remark;
      }

      const response = await fetch("http://localhost:9999/ticket/update", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${user?.token}`,
        },
        body: JSON.stringify(updatedTicket),
      });

      if (!response.ok) {
        const error = await response.json();
        setError(error.message);
        return;
      }

      if (response.ok) {
        const json = await response.json();
        dispatch(ticketAdminActions.updateTicket(json));
      }

      onClose();
    } catch (error) {
      setError(error.message);
    }
  };

  return (
    <div className={classes.createTicketForm}>
      <div className={classes.error}>{error}</div>
      <form onSubmit={updateStatusHandler}>
        <div className={classes.inputDiv}>
          <label htmlFor="status" className={classes.required}>
            Ticket Status
          </label>
          <select onChange={(e) => setStatus(e.target.value)}>
            <option value="">Select status</option>
            <option value="processing">Processing</option>
            <option value="resolved">Resolved</option>
          </select>
        </div>

        <div className={classes.inputDiv}>
          <label htmlFor="remark">Remark</label>
          <textarea
            id="remark"
            cols="10"
            rows="5"
            onChange={(e) => setRemark(e.target.value)}
          ></textarea>
        </div>

        <button className={classes.update}>Update Status</button>
      </form>
    </div>
  );
};

export default UpdateTicketStatus;
