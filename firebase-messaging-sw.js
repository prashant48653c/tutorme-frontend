importScripts(
  "https://www.gstatic.com/firebasejs/10.10.0/firebase-app-compat.js"
);
importScripts(
  "https://www.gstatic.com/firebasejs/10.10.0/firebase-messaging-compat.js"
);

firebase.initializeApp({
apiKey: "AIzaSyBAIX8vEqJk0oWMiPeSs_dvX6MAJe77QZo",
    authDomain: "movieapp-f8c83.firebaseapp.com",
    projectId: "movieapp-f8c83",
    storageBucket: "movieapp-f8c83.appspot.com",
    messagingSenderId: "298929364643",
    appId: "1:298929364643:web:1de3e5a07ae46d0052e916",
    measurementId: "G-0B0PWCQWF1",
});
const messaging = firebase.messaging();
// Handle background notifications
messaging.onBackgroundMessage((payload) => {
  console.log("Received background message:", payload);
  self.registration.showNotification(payload.notification.title, {
    body: payload.notification.body,
    icon: "/your-custom-icon.png", // Custom notification icon
  });
});
