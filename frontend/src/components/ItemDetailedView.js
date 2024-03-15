import React from "react";
import classes from "./ItemDetailedView.module.css"; 

const ItemDetailedView = ({ item }) => {
  return (
    <div className={classes.itemContainer}>
      <div className={classes.imageContainer}>
        <img src={item?.itemImage} alt="" />
      </div>

      <div className={classes.detailsContainer}>
        <h2>{item.name}</h2>

        { item?.identificationType === 'unique' && <p>
          <strong>Serial Number:</strong> {item.serialNumber}
        </p>}

        {item?.customFieldsData && <div className={classes.customFields}>
          {Object.entries(item.customFieldsData).map(([key, value]) => (
            <p key={key}>
              <strong>{key}:</strong>  {value ? value : '-'}
            </p>
          ))}
        </div>}
      </div>
    </div>
  );
};

export default ItemDetailedView;
