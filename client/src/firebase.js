// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyBUAcSHTFTvnB-EcMp-f1kmIxs3ptT5CAA",
  authDomain: "mern-auth-f544a.firebaseapp.com",
  projectId: "mern-auth-f544a",
  storageBucket: "mern-auth-f544a.appspot.com",
  messagingSenderId: "956932986430",
  appId: "1:956932986430:web:7fd127da877de1c8ffa36f"
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);