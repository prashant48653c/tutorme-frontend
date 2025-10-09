importScripts("https://www.gstatic.com/firebasejs/10.10.0/firebase-app-compat.js");
importScripts("https://www.gstatic.com/firebasejs/10.10.0/firebase-messaging-compat.js");


firebase.initializeApp({
  apiKey: "AIzaSyC51CmmEpIzXpHBXDRfm9cQAu5ZTI6uhsY",
  authDomain: "stylist-20cfc.firebaseapp.com",
  projectId: "stylist-20cfc",
  storageBucket: "stylist-20cfc.firebasestorage.app",
  messagingSenderId: "949950176019",
  appId: "1:949950176019:web:b45e62739148f9b3d558e6",
  measurementId: "G-BTCD8E5ZWQ"
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