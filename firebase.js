// Import the functions you need from the SDKs you need
import firebase, { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getStorage } from "firebase/storage";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyCpGCBl7Kci3PNgK-KB2NLcIr7g3Di7OP8",
  authDomain: "callsync-8822e.firebaseapp.com",
  projectId: "callsync-8822e",
  storageBucket: "callsync-8822e.appspot.com",
  messagingSenderId: "559726298280",
  appId: "1:559726298280:web:a15bbaa7a51ca1414dee9d",
  measurementId: "G-JD2WDV12QW",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

export const storage = getStorage(app);
export default storage;


