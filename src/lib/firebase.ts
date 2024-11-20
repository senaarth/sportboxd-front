import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getAuth, getIdToken, onAuthStateChanged } from "firebase/auth";

// https://firebase.google.com/docs/web/setup#available-libraries
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGIN_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
  measurementId: import.meta.env.VITE_FIREBASE_MEASUREMENT_ID,
};

const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
const auth = getAuth();

const getUserToken = async () => {
  return new Promise((resolve, _reject) => {
    const unsub = onAuthStateChanged(getAuth(), async (user) => {
      if (user) {
        const token = await getIdToken(user);
        resolve(token);
      } else {
        console.log("User not logged in");
        resolve(null);
      }
      unsub();
    });
  });
};

export { auth, app, analytics, getUserToken };
