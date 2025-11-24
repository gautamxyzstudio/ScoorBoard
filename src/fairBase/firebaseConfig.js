// firebaseConfig.js
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyBl-JOMUNsCynvUzhtzkKwiD0sZw0__XPI",  
  authDomain: "sportsynz.firebaseapp.com",  
  projectId: "sportsynz-477905",
  storageBucket: "sportsynz.appspot.com",
  messagingSenderId: "1234567890",
  appId: "1:1234567890:web:abcdefghijklm",
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
