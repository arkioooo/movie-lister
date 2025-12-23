// src/api/firestore.js
import {
  doc,
  setDoc,
  getDoc,
  collection,
  addDoc,
  deleteDoc,
  updateDoc,
  query,
  where,
  getDocs,
  serverTimestamp,
  orderBy,
} from 'firebase/firestore';
import { db } from './firebase';
import { limit } from 'firebase/firestore';
import tmdb from './tmdb';

export async function getUserList(uid, listId) {
  if (!uid) throw new Error('uid required');
  const ref = doc(db, 'users', uid, 'lists', listId);
  const snap = await getDoc(ref);
  if (!snap.exists()) return null;
  return { id: snap.id, ...snap.data() };
}

export async function getListPreviewItems(uid, listId, limitCount = 2) {
  if (!uid) throw new Error('uid required');

  const itemsRef = collection(
    db,
    'users',
    uid,
    'lists',
    listId,
    'items'
  );

  const q = query(itemsRef, orderBy('position'), limit(limitCount));
  const snap = await getDocs(q);

  const items = [];

  for (const docSnap of snap.docs) {
    const data = docSnap.data();

    if (!data.title) {
      // resolve title from TMDB
      let details;
      try {
        if (data.type === 'movie' || data.type === 'tv') {
          details = await tmdb.getDetails(data.type, data.tmdbId);
        } else {
          try {
            details = await tmdb.getDetails('movie', data.tmdbId);
          } catch {
            details = await tmdb.getDetails('tv', data.tmdbId);
          }
        }

        data.title = details.title || details.name || 'Untitled';

        // 🔒 cache back into Firestore
        await updateDoc(
          doc(db, 'users', uid, 'lists', listId, 'items', docSnap.id),
          { title: data.title }
        );
      } catch {
        data.title = 'Untitled';
      }
    }

    items.push(data);
  }

  return items;
}


/**
 * Ensure a minimal user document exists for a signed in user.
 * Creates users/{uid} if not present.
 */
export async function createUserDocIfNotExists(user) {
  if (!user || !user.uid) return;

  const userRef = doc(db, 'users', user.uid);
  const snap = await getDoc(userRef);

  if (!snap.exists()) {
    await setDoc(userRef, {
      username: user.displayName || user.email?.split('@')[0] || '',
      email: user.email || null,
      photoURL: user.photoURL || null,

      // Preferences (defaults)
      allowAdult: false,
      language: 'en-US',

      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    });
  }
}

/* ------------------------
   Favourites helpers
   ------------------------ */

export async function addFavourite(uid, fav) {
  // fav: { tmdbId, type: 'movie'|'tv', title?, posterPath? }
  if (!uid) throw new Error('uid required');
  const favRef = doc(db, 'users', uid, 'favourites', String(fav.tmdbId));
  await setDoc(favRef, {
    tmdbId: fav.tmdbId,
    type: fav.type,
    title: fav.title || null,
    posterPath: fav.posterPath || null,
    addedAt: serverTimestamp(),
  });
}

export async function removeItemFromList(uid, listId, itemId) {
  if (!uid) throw new Error('uid required');
  const ref = doc(db, 'users', uid, 'lists', listId, 'items', String(itemId));
  await deleteDoc(ref);
}

export async function removeFavourite(uid, tmdbId) {
  if (!uid) throw new Error('uid required');
  const favRef = doc(db, 'users', uid, 'favourites', String(tmdbId));
  await deleteDoc(favRef);
}

export async function getFavourites(uid) {
  if (!uid) return [];
  const favsCol = collection(db, 'users', uid, 'favourites');
  const snap = await getDocs(favsCol);
  return snap.docs.map(d => ({ id: d.id, ...d.data() }));
}

/* ------------------------
   Lists helpers
   ------------------------ */

export async function createList(uid, { name, description = '', isPublic = false }) {
  if (!uid) throw new Error('uid required');
  const listsCol = collection(db, 'users', uid, 'lists');
  const docRef = await addDoc(listsCol, {
    name,
    description,
    public: !!isPublic,
    createdAt: serverTimestamp(),
  });
  return docRef.id;
}

export async function deleteList(uid, listId) {
  if (!uid) throw new Error('uid required');
  const listRef = doc(db, 'users', uid, 'lists', listId);
  await deleteDoc(listRef);
}

export async function addItemToList(uid, listId, item, position = 0) {
  const ref = doc(db, 'users', uid, 'lists', listId, 'items', String(item.tmdbId));

  await setDoc(ref, {
    tmdbId: item.tmdbId,
    title: item.title || null,
    type: item.type || null,
    posterPath: item.posterPath || null,
    position,
    addedAt: serverTimestamp(),
  }, { merge: true });
}

export async function getListItems(uid, listId) {
  if (!uid) return [];
  const itemsCol = collection(db, 'users', uid, 'lists', listId, 'items');
  // orderBy only if position field exists; otherwise will return unsorted
  try {
    const q = query(itemsCol, orderBy('position'));
    const snap = await getDocs(q);
    return snap.docs.map(d => ({ id: d.id, ...d.data() }));
  } catch (err) {
    // fallback to simple getDocs if orderBy fails (no position field)
    const snap = await getDocs(itemsCol);
    return snap.docs.map(d => ({ id: d.id, ...d.data() }));
  }
}

export async function getUserLists(uid) {
  if (!uid) return [];
  const listsCol = collection(db, 'users', uid, 'lists');
  const snap = await getDocs(listsCol);
  return snap.docs.map(d => ({ id: d.id, ...d.data() }));
}

// Get a user profile document from Firestore
export async function getUserProfile(uid) {
  if (!uid) throw new Error('uid required');
  const userRef = doc(db, 'users', uid);
  const snap = await getDoc(userRef);
  if (!snap.exists()) return null;
  return { id: snap.id, ...snap.data() };
}

// Update user profile fields (partial update)
export async function updateUserProfile(uid, data) {
  if (!uid) throw new Error('uid required');
  const userRef = doc(db, 'users', uid);
  await updateDoc(userRef, {
    ...data,
    // do not touch createdAt here
  });
}
