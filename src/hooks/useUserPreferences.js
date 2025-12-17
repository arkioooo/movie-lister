import { useEffect, useState } from 'react';
import useAuth from './useAuth';
import { getUserProfile } from '../api/firestore';

export default function useUserPreferences() {
  const { user } = useAuth();
  const [prefs, setPrefs] = useState({
    allowAdult: false,
    language: 'en-US',
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      if (!user) {
        setLoading(false);
        return;
      }

      try {
        const data = await getUserProfile(user.uid);
        setPrefs({
          allowAdult: data?.allowAdult ?? false,
          language: data?.language || 'en-US',
        });
      } catch (err) {
        console.error('Failed to load preferences', err);
      } finally {
        setLoading(false);
      }
    }

    load();
  }, [user]);

  return { prefs, loading };
}
