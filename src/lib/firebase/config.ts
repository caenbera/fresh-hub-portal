import { initializeApp, getApps, getApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { getFunctions } from 'firebase/functions';

const firebaseConfig = {
  projectId: "fresh-hub-portal",
  appId: "1:313694782184:web:3052d3a83bdbb30be47f5d",
  storageBucket: "fresh-hub-portal.firebasestorage.app",
  apiKey: "AIzaSyA8fBBeVEYQByO3HuU3xECXTyda5g82iuQ",
  authDomain: "fresh-hub-portal.firebaseapp.com",
  messagingSenderId: "313694782184"
};

const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();

const auth = getAuth(app);
const db = getFirestore(app);
const functions = getFunctions(app);

export { app, auth, db, functions };
