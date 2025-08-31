// Import the functions you need from the SDKs you need
import { initializeApp, getApps, getApp } from "firebase/app";
import { getAuth, connectAuthEmulator } from "firebase/auth";
import { getFirestore, connectFirestoreEmulator, enableIndexedDbPersistence } from "firebase/firestore";
import { getAnalytics } from "firebase/analytics";
import { getStorage, connectStorageEmulator } from "firebase/storage";
import { getFunctions, connectFunctionsEmulator } from "firebase/functions";

// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: process.env.REACT_APP_FIREBASE_API_KEY || "AIzaSyB1fA5yNiuNL_l1DAikiy7XrH1BT_u7rQA",
  authDomain: process.env.REACT_APP_FIREBASE_AUTH_DOMAIN || "dept-csd.firebaseapp.com",
  projectId: process.env.REACT_APP_FIREBASE_PROJECT_ID || "dept-csd",
  storageBucket: process.env.REACT_APP_FIREBASE_STORAGE_BUCKET || "dept-csd.firebasestorage.app",
  messagingSenderId: process.env.REACT_APP_FIREBASE_MESSAGING_SENDER_ID || "552884935197",
  appId: process.env.REACT_APP_FIREBASE_APP_ID || "1:552884935197:web:07ead1a6e85ef434de84f4",
  measurementId: process.env.REACT_APP_FIREBASE_MEASUREMENT_ID || "G-D5DL153RVZ"
};

// Initialize Firebase
let app;
try {
  app = getApps().length ? getApp() : initializeApp(firebaseConfig);
  console.log('Firebase app initialized:', !!app);
} catch (error) {
  console.error('Error initializing Firebase app:', error);
  throw error;
}

// Initialize services
export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);
export const functions = getFunctions(app);

// Enable offline persistence
try {
  if (typeof window !== 'undefined') {
    await enableIndexedDbPersistence(db).catch((err) => {
      if (err.code === 'failed-precondition') {
        console.warn('Multiple tabs open, persistence can only be enabled in one tab at a time.');
      } else if (err.code === 'unimplemented') {
        console.warn('The current browser does not support all of the features required to enable persistence.');
      }
    });
    console.log('Firestore persistence enabled');
  }
} catch (error) {
  console.warn('Failed to enable persistence:', error);
}

// Initialize analytics only in browser environment
let analytics = null;
if (typeof window !== 'undefined') {
  try {
    analytics = getAnalytics(app);
  } catch (error) {
    console.log('Analytics initialization skipped:', error.message);
  }
}
export { analytics };