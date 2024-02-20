// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyA9lbZpjbSQXR1ZGGoeot0NWdXVF9MBjiU",
  authDomain: "podstream-4635a.firebaseapp.com",
  projectId: "podstream-4635a",
  storageBucket: "podstream-4635a.appspot.com",
  messagingSenderId: "131983753286",
  appId: "1:131983753286:web:43d14a5cb9c1faa907ca47",
  measurementId: "G-WREJWGN3MN",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
