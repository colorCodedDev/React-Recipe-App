// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import {getFirestore} from "firebase/firestore";

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
export const firebaseConfig = {
  apiKey: "AIzaSyBPrk34gfZ50brbVw0aUPj2iPV5hIGHEoc",
  authDomain: "react-recipe-app-e9979.firebaseapp.com",
  projectId: "react-recipe-app-e9979",
  storageBucket: "react-recipe-app-e9979.appspot.com",
  messagingSenderId: "590124183846",
  appId: "1:590124183846:web:98e3701dfbd8d4adf311e7",
  measurementId: "G-2JD0X6MDH9"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

export {db};