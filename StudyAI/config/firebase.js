// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries
import {getAuth} from 'firebase/auth'
// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyBfRGfe8pzXWtWngoh2-M_otdBN-f3i5kI",
  authDomain: "planit-afc74.firebaseapp.com",
  projectId: "planit-afc74",
  storageBucket: "planit-afc74.firebasestorage.app",
  messagingSenderId: "924919525257",
  appId: "1:924919525257:web:927d2ceb6e3c62ab9ffb58",
  measurementId: "G-3XQ3FM3K2C"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);

export const auth = getAuth(app);