import { initializeApp } from 'firebase/app';
import { 
  getAuth, 
  GoogleAuthProvider,
  signInWithPopup,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
  sendPasswordResetEmail,
  updateProfile,
  onAuthStateChanged
} from 'firebase/auth';
import {
  getFirestore,
  doc,
  setDoc,
  getDoc,
  getDocs,
  updateDoc,
  deleteDoc,
  collection,
  onSnapshot,
  increment,
  serverTimestamp
} from 'firebase/firestore';

// User's Firebase Configuration
const firebaseConfig = {
  apiKey: "AIzaSyCgcbmpHgabOF6-PkCuUmADt4aVuVpGxjI",
  authDomain: "movie-0-hub.firebaseapp.com",
  projectId: "movie-0-hub",
  storageBucket: "movie-0-hub.firebasestorage.app",
  messagingSenderId: "716541651624",
  appId: "1:716541651624:web:bd249885fe141bf3c6b09d",
  measurementId: "G-8JVBQSTM3V"
};

// Initialize Firebase App
const app = initializeApp(firebaseConfig);

// Initialize Firebase Authentication & Cloud Firestore Database
export const auth = getAuth(app);
export const db = getFirestore(app);

export const googleProvider = new GoogleAuthProvider();
googleProvider.setCustomParameters({ prompt: 'select_account' });

// Auth Helper Functions
export const loginWithEmail = (email, password) => {
  return signInWithEmailAndPassword(auth, email, password);
};

export const registerWithEmail = async (email, password, displayName = '') => {
  const userCredential = await createUserWithEmailAndPassword(auth, email, password);
  if (displayName) {
    await updateProfile(userCredential.user, { displayName });
  }
  return userCredential;
};

export const loginWithGoogle = () => {
  return signInWithPopup(auth, googleProvider);
};

export const logoutUser = () => {
  return signOut(auth);
};

export const resetUserPassword = (email) => {
  return sendPasswordResetEmail(auth, email);
};

export const updateUserDisplayName = (displayName) => {
  if (!auth.currentUser) return Promise.reject(new Error('No user logged in'));
  return updateProfile(auth.currentUser, { displayName });
};

export { 
  onAuthStateChanged,
  doc,
  setDoc,
  getDoc,
  getDocs,
  updateDoc,
  deleteDoc,
  collection,
  onSnapshot,
  increment,
  serverTimestamp
};
export default app;
