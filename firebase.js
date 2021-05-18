import firebase from 'firebase/app';
import 'firebase/firestore';
import 'firebase/auth';

// Firebase firebase configurations
const firebaseConfig = {
  apiKey: process.env.API_KEY,
  authDomain: process.env.API_AUTH_DOMAIN,
  projectId: process.env.API_PROJECT_ID,
  storageBucket: process.env.API_STORAGE_BUCKET,
  messagingSenderId: process.env.API_MESSAGING_SENDER_ID,
  firebaseId: process.env.API_APP_ID,
} 

// Initialize firebase app
if (!firebase.apps.length) {
  firebase.initializeApp(firebaseConfig);
} else {
  firebase.app();
}


// Firestore
const database = firebase.firestore();

// Auth
const auth = firebase.auth();

// Export Firebase Products/Services
export { database, auth };

// Firebase firebase
export default firebase;