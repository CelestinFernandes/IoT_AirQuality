import { initializeApp } from "https://www.gstatic.com/firebasejs/9.0.0/firebase-app.js";
import { getDatabase } from "https://www.gstatic.com/firebasejs/9.0.0/firebase-database.js";


const firebaseConfig = {
    apiKey: "AIzaSyDfhHnyrQbJv8G0WfVwMloOMr7k-DiKZKs",
    authDomain: "iotairmonitoring.firebaseapp.com",
    databaseURL: "https://iotairmonitoring-default-rtdb.asia-southeast1.firebasedatabase.app",
    projectId: "iotairmonitoring",
    storageBucket: "iotairmonitoring.firebasestorage.app",
    messagingSenderId: "378447073256",
    appId: "1:378447073256:web:ec3ea755eca26996e15e5d",
    measurementId: "G-4XK2XHB2TK"
};

const app = initializeApp(firebaseConfig);
const db = getDatabase(app);

export { db };