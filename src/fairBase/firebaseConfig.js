// firebaseConfig.js
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyCjxxxxxxxxxxxxxxxxxxx",  
  authDomain: "sportsynz.firebaseapp.com", // <-- Firebase Auth domain
  projectId: "sportsynz",
  storageBucket: "sportsynz.appspot.com",
  messagingSenderId: "1234567890",
  appId: "1:1234567890:web:abcdefghijklm",
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
