import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { initializeFirestore, enableIndexedDbPersistence, CACHE_SIZE_UNLIMITED } from "firebase/firestore";
import { getFunctions } from "firebase/functions";
import { getMessaging } from "firebase/messaging";

const firebaseConfig = {
  apiKey: "AIzaSyD1R3zgH61tsdsIjREHzfNMsGk3miNS-co",
  authDomain: "farmverse-5665.firebaseapp.com",
  projectId: "farmverse-5665",
  storageBucket: "farmverse-5665.appspot.com",
  messagingSenderId: "320417607086",
  appId: "1:320417607086:web:72064f57a332e611aa2c3f",
  measurementId: "G-NPLPPZZ10Q"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

// ✅ Proper Firestore setup with unlimited cache
const db = initializeFirestore(app, {
  cacheSizeBytes: CACHE_SIZE_UNLIMITED
});

// Enable offline persistence
enableIndexedDbPersistence(db).catch((err) => {
  if (err.code === "failed-precondition") {
    console.warn("Persistence can only be enabled in one tab at a time.");
  } else if (err.code === "unimplemented") {
    console.warn("Persistence is not available in this browser.");
  }
});

const functions = getFunctions(app);
const messaging = getMessaging(app);

export { app, auth, db, functions, messaging };
