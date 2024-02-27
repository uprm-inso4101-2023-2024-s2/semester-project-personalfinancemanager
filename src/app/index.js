// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth"
import { getFirebase, getFirestore } from "firebase/firestore";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
    apiKey: "AIzaSyDPSsJg__Tmih14RZukyozM-vz29O2XYP0",
    authDomain: "personal-finance-manager-c068f.firebaseapp.com",
    projectId: "personal-finance-manager-c068f",
    storageBucket: "personal-finance-manager-c068f.appspot.com",
    messagingSenderId: "330533282775",
    appId: "1:330533282775:web:2a4a53160cd7b12964e192"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const auth = getAuth(app);


export { app, db, auth }
