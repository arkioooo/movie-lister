// src/hooks/useAuth.js
import { useAuth as useAuthContext } from '../context/AuthContext';

/**
 * Provide both a named export and a default export so imports like:
 *   import useAuth from '../hooks/useAuth';
 *   import { useAuth } from '../hooks/useAuth';
 * both work.
 */

export function useAuth() {
  return useAuthContext();
}

export default useAuth;
