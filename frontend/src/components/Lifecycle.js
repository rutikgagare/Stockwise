import React from "react";
import classes from "./Lifecycle.module.css";

const Lifecycle = ({ lifecycle, itemName }) => {
  function formatTimestamp(timestamp) {
    const date = new Date(timestamp);
    const options = {
      year: "numeric",
      month: "short",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
    };
    return date.toLocaleString("en-US", options);
  }

  return (
    <div className={classes.lifecycle}>
      <h3>{itemName} - Lifecycle</h3>
      <table className={classes.category_table}>
        <thead>
          <tr>
            <th>User Name</th>
            <th>Checkout Details</th>
            <th>Checkin Details</th>
          </tr>
        </thead>
        <tbody>
          {lifecycle &&
            lifecycle?.map((record) => (
              <tr key={record?._id}>
                <td>{record?.userName}</td>
                <td>{formatTimestamp(record?.checkoutDate)}</td>
                <td>{record?.checkinDate ? formatTimestamp(record?.checkinDate) : "No checkin yet"}</td>
              </tr>
            ))}
        </tbody>
      </table>
    </div>
  );
};

export default Lifecycle;
