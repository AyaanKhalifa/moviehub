// Utility to manage recent searches in localStorage and sync with Firestore
import { syncRecentSearchesToFirestore, fetchRecentSearchesFromFirestore } from './firestoreService';
import { auth } from '../firebase';

const STORAGE_KEY = 'moviehub_recent_searches';
const MAX_SEARCHES = 8;

export const getRecentSearches = () => {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
};

export const addRecentSearch = (query) => {
  if (!query || !query.trim()) return [];
  const clean = query.trim();

  try {
    const current = getRecentSearches();
    // Filter out duplicate and add to start
    const updated = [clean, ...current.filter((item) => item.toLowerCase() !== clean.toLowerCase())].slice(
      0,
      MAX_SEARCHES
    );
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));

    // Sync to Firestore if user logged in
    if (auth.currentUser?.uid) {
      syncRecentSearchesToFirestore(auth.currentUser.uid, updated);
    }
    return updated;
  } catch {
    return [];
  }
};

export const removeRecentSearch = (query) => {
  try {
    const current = getRecentSearches();
    const updated = current.filter((item) => item.toLowerCase() !== query.toLowerCase());
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
    if (auth.currentUser?.uid) {
      syncRecentSearchesToFirestore(auth.currentUser.uid, updated);
    }
    return updated;
  } catch {
    return [];
  }
};

export const clearRecentSearches = () => {
  try {
    localStorage.removeItem(STORAGE_KEY);
    if (auth.currentUser?.uid) {
      syncRecentSearchesToFirestore(auth.currentUser.uid, []);
    }
  } catch {
    // Ignore
  }
  return [];
};

