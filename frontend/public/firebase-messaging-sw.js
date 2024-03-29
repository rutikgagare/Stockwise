importScripts("https://www.gstatic.com/firebasejs/8.10.0/firebase-app.js");
importScripts(
  "https://www.gstatic.com/firebasejs/8.10.0/firebase-messaging.js"
);

const firebaseConfig = {
  apiKey: "AIzaSyDt-umJ9DbyOwpWK7T0osDIgXrN4dm4GP4",
  authDomain: "stockwise-98204.firebaseapp.com",
  projectId: "stockwise-98204",
  storageBucket: "stockwise-98204.appspot.com",
  messagingSenderId: "624841251726",
  appId: "1:624841251726:web:6af61c8941a274d2cc22df",
  measurementId: "G-Z7VXETLSKL",
};

firebase.initializeApp(firebaseConfig);
const messaging = firebase.messaging();

messaging.onBackgroundMessage((payload) => {
  console.log(
    "[firebase-messaging-sw.js] Received background message ",
    payload
  );
  const notificationTitle = payload.notification.title;

  const notificationOptions = {
    body: payload.notification.body,
    icon: payload.notification.image ,
  };

  self.registration.showNotification(notificationTitle, notificationOptions);
});
