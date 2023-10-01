import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import { getAuth, GoogleAuthProvider, GithubAuthProvider } from 'firebase/auth';


const firebaseConfig = {
  apiKey: "AIzaSyCr5dH-Pw73UCKUuZ5-6987y8MTg1zNE_Y",
  authDomain: "aiapply-d1325.firebaseapp.com",
  projectId: "aiapply-d1325",
  storageBucket: "aiapply-d1325.appspot.com",
  messagingSenderId: "492029811167",
  appId: "1:492029811167:web:1980980456bc4dd7bb8c6a",
  measurementId: "G-STX21JNGEL"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const auth = getAuth(app);
const googleProvider = new GoogleAuthProvider();

export { db, auth, googleProvider };