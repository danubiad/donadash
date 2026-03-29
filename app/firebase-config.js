import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: "AIzaSyDSRV3tp-_MP9mdQNbwPErsJQnQ0ofZx0",
  authDomain: "donadash-594f7.firebaseapp.com",
  projectId: "donadash-594f7",
  storageBucket: "donadash-594f7.firebasestorage.app",
  messagingSenderId: "227540899665",
  appId: "1:227540899665:web:5ea25fa25abd8abc2f570",
  measurementId: "G-K2W46N4H7P"
};

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
