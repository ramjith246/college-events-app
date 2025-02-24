import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

// First Firebase Project Configuration
const firebaseConfig1 = {
    apiKey:process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
    authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
    projectId:process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
    storageBucket:process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
    messagingSenderId:process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
    appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
    measurementId: process.env.NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID
};

// Second Firebase Project Configuration
const firebaseConfig2 = {
    apiKey:process.env.NEXT_PUBLIC_FIREBASE_API_KEY1,
    authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN1,
    projectId:process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID1,
    storageBucket:process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET1,
    messagingSenderId:process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID1,
    appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID1,
    measurementId: process.env.NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID
};

// Initialize both Firebase apps
const app1 = initializeApp(firebaseConfig1, "app1");
const app2 = initializeApp(firebaseConfig2, "app2");

// Get Firestore instances
export const db1 = getFirestore(app1);
export const db2 = getFirestore(app2);
