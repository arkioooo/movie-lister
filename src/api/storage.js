import { getDownloadURL, ref, uploadBytes } from 'firebase/storage';
import { storage } from './firebase';

export async function uploadUserAvatar(uid, file) {
  if (!uid || !file) throw new Error('uid and file required');

  const avatarRef = ref(storage, `avatars/${uid}.jpg`);
  await uploadBytes(avatarRef, file);
  return await getDownloadURL(avatarRef);
}
