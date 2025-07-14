import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: "AIzaSyDjn9zGYt_4mj4O6N1FXcVbe9dqaiVFFEM",
  authDomain: "benediction-73f23.firebaseapp.com",
  projectId: "benediction-73f23",
  storageBucket: "benediction-73f23.firebasestorage.app",
  messagingSenderId: "144699322561",
  appId: "1:144699322561:web:e6d7affeae0cb29f592440",
  measurementId: "G-EFX8DQTJBX"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);