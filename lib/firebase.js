import { initializeApp, getApps, getApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

// Your Firebase config
const firebaseConfig = {
    apiKey:NEXT_PUBLIC_FIREBASE_API_KEY,
    authDomain: NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
    projectId:NEXT_PUBLIC_FIREBASE_PROJECT_ID,
    storageBucket:NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
    messagingSenderId:NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
    appId: NEXT_PUBLIC_FIREBASE_APP_ID,
    measurementId: NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID
};

// Ensure Firebase is only initialized once
const app = getApps().length ? getApp() : initializeApp(firebaseConfig);
export const db = getFirestore(app);
