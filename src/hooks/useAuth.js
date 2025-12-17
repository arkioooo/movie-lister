// src/hooks/useAuth.js
import {
  EmailAuthProvider,
  reauthenticateWithCredential,
  updatePassword,
} from 'firebase/auth';
import { auth } from '../api/firebase';
import { useAuth as useAuthContext } from '../context/AuthContext';

/**
 * Named export
 *   import { useAuth } from '../hooks/useAuth';
 */
export function useAuth() {
  return useAuthContext();
}

/**
 * Default export
 *   import useAuth from '../hooks/useAuth';
 */
export default function useAuthDefault() {
  const {
    user,
    loading,
    login,
    signup,
    logout,
    signInWithGoogle,
  } = useAuthContext();

  async function changePassword(currentPassword, newPassword) {
    if (!auth.currentUser || !auth.currentUser.email) {
      throw new Error('No authenticated user');
    }

    const credential = EmailAuthProvider.credential(
      auth.currentUser.email,
      currentPassword
    );

    await reauthenticateWithCredential(auth.currentUser, credential);
    await updatePassword(auth.currentUser, newPassword);
  }

  return {
    user,
    loading,
    login,
    signup,
    logout,
    signInWithGoogle,
    changePassword,
  };
}
