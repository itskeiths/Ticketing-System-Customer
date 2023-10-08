// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
const firebaseConfig = {
    apiKey: "AIzaSyBaWcPJTZXm6MdV5e0jFWWF7om5Afvg-WY",
    authDomain: "ticketing-system-a9789.firebaseapp.com",
    projectId: "ticketing-system-a9789",
    storageBucket: "ticketing-system-a9789.appspot.com",
    messagingSenderId: "25034052176",
    appId: "1:25034052176:web:b9ca1eb214fb57d9053755",
    measurementId: "G-9H5PQCSMRB"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

export { db };