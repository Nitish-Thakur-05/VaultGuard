// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyCRayoHIe8i_Fkq0pmaucP9ZvfwIUN7Pog",
  authDomain: "password-manager-login-ccb97.firebaseapp.com",
  projectId: "password-manager-login-ccb97",
  storageBucket: "password-manager-login-ccb97.firebasestorage.app",
  messagingSenderId: "965964105900",
  appId: "1:965964105900:web:7f1a24f87f5ab537aff709",
  measurementId: "G-TCKR59GPQP",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

export { auth, db };
