import React from "react";
import noItem from "../Images/noItem.jpg";
import classes from "./NoItem.module.css"

const NoItem = () => {
  return (
    <div className={classes.noItem}>
      <img src={noItem} alt="image not found" />
    </div>
  );
};

export default NoItem;
