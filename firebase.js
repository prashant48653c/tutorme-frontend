import { initializeApp } from "firebase/app";
import {
  getMessaging,
  getToken,
  onMessage,
  isSupported,
} from "firebase/messaging";

const firebaseConfig = {
 apiKey: "AIzaSyBAIX8vEqJk0oWMiPeSs_dvX6MAJe77QZo",
    authDomain: "movieapp-f8c83.firebaseapp.com",
    projectId: "movieapp-f8c83",
    storageBucket: "movieapp-f8c83.appspot.com",
    messagingSenderId: "298929364643",
    appId: "1:298929364643:web:1de3e5a07ae46d0052e916",
    measurementId: "G-0B0PWCQWF1",
};
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
   const vapidKey = "BI3OEeEep0zSSOzvjaUALV-H_p5PmlSur8Qy0bkJ7-aOg0cM6z9oo6KpRwv3Rb8qzkoLlU-dP96nMbI2W3rHkxU";
      
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
