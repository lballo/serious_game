// src/firebase.js
import { initializeApp } from "firebase/app";
import { getDatabase } from "firebase/database";

const firebaseConfig = {
    apiKey: "AIzaSyCiMvEHJYFqvjwywANxmFxeM5a4-Dulpx0",
    authDomain: "serious-game-platform.firebaseapp.com",
    databaseURL: "https://serious-game-platform-default-rtdb.europe-west1.firebasedatabase.app",
    projectId: "serious-game-platform",
    storageBucket: "serious-game-platform.firebasestorage.app",
    messagingSenderId: "453388655806",
    appId: "1:453388655806:web:94d836fb0438aa39cd92ef"
  };

const app = initializeApp(firebaseConfig);
export const database = getDatabase(app);