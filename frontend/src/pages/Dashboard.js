import React, { useEffect, useState } from "react";
import classes from "./Dashboard.module.css";
import Layout from "../components/Layout";
import { getToken } from "firebase/messaging";
import { messaging } from "../notification/firebase.js";
import { useSelector } from "react-redux";
import { BASE_URL } from "../constants";

import NoItem from "../components/NoItem.js";

const Dashboard = () => {
  const categories = useSelector((state) => state.category.data);
  const org = useSelector((state) => state?.org?.organization);
  const user = useSelector((state) => state.auth.user);

  const [itemDetails, setItemDetails] = useState(null);

  const getItemCounts = async () => {
    try {
      const res = await fetch(`${BASE_URL}/inventory/itemCount/${org?._id}`, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${user?.token}`,
        },
      });
      const json = await res.json();
      setItemDetails(json);
    } catch (error) {}
  };

  useEffect(() => {
    if (org) {
      getItemCounts();
    }
  }, [user, org]);

  const sendPushNotification = async () => {
    try {
      const token = await getToken(messaging, {
        vapidKey:
          "BOL9rNHY0MkbP2bXEDLLVTEa-q5pHyLeO3yTqJwWqqi8TeWCqhtjF97S7Ovhe9ge_038qxhU991F3Cn0dqYaMKc",
      });

      const response = await fetch(
        `${BASE_URL}/service/send-push-notification`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${user?.token}`,
          },
          body: JSON.stringify({
            pushToken: token,
          }),
        }
      );

      if (!response.ok) {
        throw new Error("Error sending push notification");
      }

      const json = await response.json();
    } catch (error) {
      console.error("Error sending push notification:", error);
    }
  };

  useEffect(() => {
    sendPushNotification();
  }, [user]);

  return (
    <Layout>
      <div className={classes.dashboard}>
        {/* <h1>Welcome to Dashboard</h1> */}
        {/* <button onClick={sendPushNotification}>Send Notification</button> */}

        <div className={classes.header}>
          <h3>Dashboard</h3>
        </div>

        {categories && (
          <div className={classes.categories}>
            {categories?.map((category) => {
              return (
                <div className={classes.category}>
                  <h2>{category?.name}</h2>
                  <h3>{category?.numberOfAssets || 0}</h3>
                </div>
              );
            })}
          </div>
        )}

        {/* <div className={classes.items}>
          {itemDetails?.map((item) => {
            return (
              <div className={classes.item}>
                <h3>{item?.name}</h3>
                <h4>{item?.count || 0}</h4>
              </div>
            );
          })}
        </div> */}

        {(!categories || (categories && categories.length === 0)) && (
          <NoItem></NoItem>
        )}
      </div>
    </Layout>
  );
};

export default Dashboard;
