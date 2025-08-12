// src/lib/firebase.ts
import { initializeApp, getApps, getApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
    apiKey: "AIzaSyCAlEUW3KxQbXHVWEZ_W57d4OqgYS6KCJw",
    authDomain: "class-scheduler-82c49.firebaseapp.com",
    projectId: "class-scheduler-82c49",
    storageBucket: "class-scheduler-82c49.firebasestorage.app",
    messagingSenderId: "356761532861",
    appId: "1:356761532861:web:db98eab6106d2d5b5ffad4",
    measurementId: "G-XN40PXGKPW"
};

const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();

const auth = getAuth(app);
const db = getFirestore(app);

export { auth, db };
