import React, { useDebugValue, useEffect, useState } from "react";
import { UseDispatch, useDispatch } from "react-redux";

import classes from "./Dashboard.module.css";
import Layout from "../components/Layout";
import NoItem from "../components/NoItem.js";

import { useSelector } from "react-redux";
import { BASE_URL } from "../constants";

import { organizationActions } from "../store/organizationSlice.js";
import { categoryActions } from "../store/categorySlice";
import { inventoryActions } from "../store/inventorySlice";

import { generateToken } from "../notification/firebase.js";
import { messaging } from "../notification/firebase.js";
import { getToken } from "firebase/messaging";
import { onMessage } from "firebase/messaging";
import toast from "react-hot-toast";
import Loader from "../components/Loader.js";

const Dashboard = () => {
  const user = useSelector((state) => state.auth.user);
  const org = useSelector((state) => state?.org?.organization);
  const categories = useSelector((state) => state.category.data);

  const dispatch = useDispatch();

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        if (!user) {
          setLoading(false);
          return;
        }

        setLoading(true);

        const orgResponse = await fetch(`${BASE_URL}/org/getOrg`, {
          headers: {
            Authorization: `Bearer ${user.token}`,
          },
        });

        if (!orgResponse.ok) {
          throw new Error("Failed to fetch organization data");
        }

        const orgDetails = await orgResponse.json();
        dispatch(organizationActions.setOrg(orgDetails));

        const categoryResponse = await fetch(
          `${BASE_URL}/Category/${orgDetails._id}`,
          {
            headers: {
              Authorization: `Bearer ${user.token}`,
            },
          }
        );

        if (!categoryResponse.ok) {
          throw new Error("Failed to fetch category data");
        }

        const categoryData = await categoryResponse.json();
        dispatch(categoryActions.setCategory(categoryData));

        const inventoryResponse = await fetch(
          `${BASE_URL}/inventory/${orgDetails._id}`,
          {
            headers: {
              Authorization: `Bearer ${user.token}`,
            },
          }
        );

        if (!inventoryResponse.ok) {
          throw new Error("Failed to fetch inventory data");
        }

        const inventoryData = await inventoryResponse.json();
        dispatch(inventoryActions.setInventory(inventoryData));

        generateToken();
        onMessage(messaging, (payload) => {
          toast(payload.notification.body, { duration: 3000 });
        });
        
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [dispatch, user]);

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
      {loading && <Loader></Loader>}

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
