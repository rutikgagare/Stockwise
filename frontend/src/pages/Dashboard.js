import React, { useDebugValue, useEffect, useState } from "react";
import { UseDispatch, useDispatch } from "react-redux";

import classes from "./Dashboard.module.css";
import Layout from "../components/Layout";
import NoItem from "../components/NoItem.js";

import { useSelector } from "react-redux";
import { BASE_URL } from "../constants";


import { messaging } from "../notification/firebase.js";
import { getToken } from "firebase/messaging";

import Loader from "../components/Loader.js";

const Dashboard = () => {
  const user = useSelector((state) => state.auth.user);
  const org = useSelector((state) => state?.org?.organization);
  const categories = useSelector((state) => state.category.data);

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
  }, []);

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

        {(!categories || (categories && categories.length === 0)) && (
          <NoItem></NoItem>
        )}
      </div>
    </Layout>
  );
};

export default Dashboard;
