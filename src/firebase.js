// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getDatabase } from 'firebase/database';
import { getFirestore } from "firebase/firestore";
import {getStorage} from 'firebase/storage'
import {getAuth} from 'firebase/auth'

const firebaseConfig = {
  apiKey: "AIzaSyCGmeVM6OPnRbVGaW6O7DVqafArIGEm5Ys",
  authDomain: "silwalk-inc.firebaseapp.com",
  projectId: "silwalk-inc",
  storageBucket: "silwalk-inc.appspot.com",
  messagingSenderId: "665210785578",
  appId: "1:665210785578:web:6279247f0704ec73be5853",
  measurementId: "G-EW5W77X7X7"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
const auth = getAuth()
const database= getFirestore(app)
const rt_db = getDatabase();
const storage = getStorage(app);


export {app,auth,analytics,database,rt_db,storage}