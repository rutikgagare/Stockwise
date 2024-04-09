import React, { useEffect, useState } from "react";
import classes from "./ItemDetailedView.module.css"; 
import { BASE_URL } from "../constants";
import { useSelector } from "react-redux";
import Loader from './Loader.js';

const ItemDetailedView = ({itemId}) => {

  const user = useSelector((state) => state.auth.user);
  const [item, setItem] = useState(null);
  const [loading, setLoading] = useState();

  const getItemInfo = async () =>{
    const res = await fetch(
      `${BASE_URL}/inventory/getItem/${itemId}`,
      {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      }
    );
    const json = await res.json()
    console.log("item details ",json);
    setItem(json);
  }

  useEffect(()=>{
    setLoading(true);
    getItemInfo();
    setLoading(false);
  }, [itemId])

  return (
    <div className={classes.itemContainer}>
      {loading && <Loader></Loader>}

      <div className={classes.imageContainer}>
        <img src={`https://stockwisebucket.s3.ap-south-1.amazonaws.com/${item?.itemImage}`} alt="" />
      </div>

      <div className={classes.detailsContainer}>
        <h2>{item?.name}</h2>

        { item?.identificationType === 'unique' && <p>
          <strong>Serial Number:</strong> {item?.serialNumber}
        </p>}

        {item?.customFieldsData && <div className={classes.customFields}>
          {Object.entries(item?.customFieldsData).map(([key, value]) => (
            key && value && <p key={key}>
              <strong>{key}:</strong>  {value ? value : '-'}
            </p>
          ))}
        </div>}
      </div>
    </div>
  );
};

export default ItemDetailedView;
