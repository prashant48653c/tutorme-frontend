
import { initializeApp } from "firebase/app";
import { getMessaging, getToken, onMessage, isSupported } from "firebase/messaging";


const firebaseConfig={
     apiKey: "AIzaSyC51CmmEpIzXpHBXDRfm9cQAu5ZTI6uhsY",
  authDomain: "stylist-20cfc.firebaseapp.com",
  projectId: "stylist-20cfc",
  storageBucket: "stylist-20cfc.firebasestorage.app",
  messagingSenderId: "949950176019",
  appId: "1:949950176019:web:b45e62739148f9b3d558e6",
  measurementId: "G-BTCD8E5ZWQ"
}
const app = initializeApp(firebaseConfig);
let messaging;



isSupported().then((supported) => {
  if (supported) {
    messaging = getMessaging(app);
    console.log("Firebase Messaging is supported!");
  } else {
    console.warn("Firebase Messaging is NOT supported in this browser.");
  }
});
// Function to request notification permission and get FCM token
export const requestNotificationToken = async () => {
  if (!messaging) {
    console.warn("Cannot get token, Messaging is not supported.");
    return null;
  }
  try {
    const vapidKey ='BLvXwxqXkqdt4PCKExDQxPFfAiKJ_ptaIBWU48RaKfyVuXhs9h4o5jkqJ_kGpnwDqU4XWxD4shi0ojrpWrugzm8';
    console.log("Requesting FCM token...");
    const token = await getToken(messaging, { vapidKey: vapidKey });
    if (token) {
      console.log("FCM Token:", token);
      return token;
    } else {
      console.warn("No registration token available.");
      return null;
    }
  } catch (error) {
    console.error("Error retrieving FCM token:", error);
    return null;
  }
};
// Handle foreground notifications
if (messaging) {
  onMessage(messaging, (payload) => {
    console.log("Push Notification Received:", payload);
  });
}
export default messaging;