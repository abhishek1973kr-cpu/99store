import { initializeApp, getApps, getApp, FirebaseApp } from "firebase/app";
import { getFirestore, Firestore } from "firebase/firestore";

// Firebase Configuration using environment variables (Vercel / Local)
const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY || "AIzaSyDummyKeyForBuildOnly99Store",
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN || "ninety-nine-ornaments.firebaseapp.com",
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID || "ninety-nine-ornaments",
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET || "ninety-nine-ornaments.appspot.com",
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID || "123456789012",
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID || "1:123456789012:web:abcdef99store",
};

export const isFirebaseConfigured = (): boolean => {
  const projectId = process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID;
  const apiKey = process.env.NEXT_PUBLIC_FIREBASE_API_KEY;
  return !!(
    projectId &&
    apiKey &&
    projectId !== "ninety-nine-ornaments" &&
    projectId !== "your-project-id" &&
    !apiKey.includes("Dummy") &&
    !apiKey.includes("ExampleKey")
  );
};

let app: FirebaseApp | undefined;
let db: Firestore | undefined;

try {
  if (isFirebaseConfigured()) {
    if (getApps().length > 0) {
      app = getApp();
    } else {
      app = initializeApp(firebaseConfig);
    }
    db = getFirestore(app);
  }
} catch (error) {
  console.warn("Firebase initialization status:", error);
}

export { app, db };

