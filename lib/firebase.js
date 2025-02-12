import { initializeApp, getApps, getApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

// Your Firebase config
const firebaseConfig = {
    apiKey: NEXT_PUBLIC_FIREBASE_API_KEY,
    authDomain: "college-events-app-e16ae.firebaseapp.com",
    projectId: "college-events-app-e16ae",
    storageBucket: "college-events-app-e16ae.firebasestorage.app",
    messagingSenderId: "646191357674",
    appId: "1:646191357674:web:081ece155f927d5691c193",
    measurementId: "G-14ENTPJTV3"
};

// Ensure Firebase is only initialized once
const app = getApps().length ? getApp() : initializeApp(firebaseConfig);
export const db = getFirestore(app);
