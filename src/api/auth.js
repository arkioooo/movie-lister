import { auth, googleProvider } from './firebase';
import {
createUserWithEmailAndPassword,
signInWithEmailAndPassword,
signOut,
sendPasswordResetEmail,
signInWithPopup,
} from 'firebase/auth';


export async function signup(email, password) {
const userCredential = await createUserWithEmailAndPassword(auth, email, password);
return userCredential.user;
}


export async function login(email, password) {
const userCredential = await signInWithEmailAndPassword(auth, email, password);
return userCredential.user;
}


export async function logout() {
await signOut(auth);
}


export async function resetPassword(email) {
await sendPasswordResetEmail(auth, email);
}


export async function signInWithGoogle() {
const result = await signInWithPopup(auth, googleProvider);
return result.user;
}