import React, { useEffect } from "react";
import classes from "./Dashboard.module.css";
// import Sidebar from '../components/Sidebar';
import Layout from "../components/Layout";
import { getToken } from "firebase/messaging";
import { messaging } from "../notification/firebase.js";

const Dashboard = () => {
  const sendPushNotification = async () => {
    try {

      const token = await getToken(messaging, {
        vapidKey:
          "BOL9rNHY0MkbP2bXEDLLVTEa-q5pHyLeO3yTqJwWqqi8TeWCqhtjF97S7Ovhe9ge_038qxhU991F3Cn0dqYaMKc",
      });
      
      const response = await fetch(
        "http://localhost:9999/service/send-push-notification",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
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
      console.log("Notification recieved : ", json);
    } catch (error) {
      console.error("Error sending push notification:", error);
    }
  };

  useEffect(()=>{
    sendPushNotification();
  }, [])

  return (
    <Layout>
      <div className={classes.dashboard}>
        <h1>Welcome to Dashboard</h1>
        <button onClick={sendPushNotification}>Send Notification</button>
      </div>
    </Layout>
  );
};

export default Dashboard;
