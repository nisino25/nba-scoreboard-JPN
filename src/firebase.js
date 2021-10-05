import firebase from 'firebase/compat/app';
import 'firebase/compat/firestore';
// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyANr8H1Vbj7ndkElhJRkXgVb4yupZXT2wc",
  authDomain: "user-counter-c4a0c.firebaseapp.com",
  databaseURL: "https://user-counter-c4a0c-default-rtdb.firebaseio.com",
  projectId: "user-counter-c4a0c",
  storageBucket: "user-counter-c4a0c.appspot.com",
  messagingSenderId: "631845030744",
  appId: "1:631845030744:web:ab69c39417ccfe246cf32d"
};
 
// Initialize Firebase
firebase.initializeApp(firebaseConfig);
const db = firebase.firestore();
export default db;