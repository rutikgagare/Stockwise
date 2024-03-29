import "firebase/messaging";

import { initializeApp } from "firebase/app";
import { getMessaging } from "firebase/messaging";
import { getToken } from "firebase/messaging";

// Initialize Firebase

const firebaseConfig = {
    apiKey: "AIzaSyDt-umJ9DbyOwpWK7T0osDIgXrN4dm4GP4",
    authDomain: "stockwise-98204.firebaseapp.com",
    projectId: "stockwise-98204",
    storageBucket: "stockwise-98204.appspot.com",
    messagingSenderId: "624841251726",
    appId: "1:624841251726:web:6af61c8941a274d2cc22df",
    measurementId: "G-Z7VXETLSKL",
  };

const app = initializeApp(firebaseConfig);
export const messaging = getMessaging(app);

export const generateToken = async () =>{

  const permission = await Notification.requestPermission();

  if (permission === "granted") {
    const token = await getToken(messaging, {
      vapidKey:
        "BOL9rNHY0MkbP2bXEDLLVTEa-q5pHyLeO3yTqJwWqqi8TeWCqhtjF97S7Ovhe9ge_038qxhU991F3Cn0dqYaMKc",
    });

    console.log("token generated : ", token);

  } else if (permission === "denied") {
    alert("You denied for the notification");
  } 
}




