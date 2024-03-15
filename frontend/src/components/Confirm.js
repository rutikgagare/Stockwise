import React from "react";
import classes from "./Confirm.module.css";

const Confirm = ({ onDelete, onCancel, message }) => {
  return (
    <div className={classes.overlay}>
      <div className={classes.confirmation_modal}>
        <h2>Are you sure you want to delete?</h2>
        <p>{message}</p>
        <div className={classes.confirmation_buttons}>
          <button onClick={onCancel} className={classes.cancel_button}>
            Cancel
          </button>
          <button onClick={onDelete} className={classes.delete_button}>
            Delete
          </button>
        </div>
      </div>
    </div>
  );
};

export default Confirm;
