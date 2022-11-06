importScripts('https://www.gstatic.com/firebasejs/8.2.0/firebase-app.js');
importScripts('https://www.gstatic.com/firebasejs/8.2.0/firebase-messaging.js');

const firebaseConfig = {
    apiKey: "AIzaSyCUIi0m91uGMH6PHpcUIDyTaytI2lSsCHI",
    authDomain: "todoapp-metrix.firebaseapp.com",
    databaseURL: "https://todoapp-metrix-default-rtdb.europe-west1.firebasedatabase.app",
    projectId: "todoapp-metrix",
    storageBucket: "todoapp-metrix.appspot.com",
    messagingSenderId: "599833567578",
    appId: "1:599833567578:web:1f128fba15adfae2e3d363",
    measurementId: "G-C7W5CCCRY7"
};  

firebase.initializeApp(firebaseConfig);
const messaging = firebase.messaging();

messaging.onBackgroundMessage(function(payload) {
  console.log('[firebase-messaging-sw.js] Received background message ', payload);
  // Customize notification here
  const notificationTitle = payload.notification.title;
  const notificationOptions = {
  body: payload,
  icon: '/firebase-logo.png'
};

self.registration.showNotification(notificationTitle,
      notificationOptions);
});