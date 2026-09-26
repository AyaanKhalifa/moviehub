// Real Visitor Tracking — Firestore is primary source of truth
// localStorage is used only to avoid double-counting the same browser session
import { recordVisitorToFirestore } from './firestoreService';

const SESSION_KEY = 'moviehub_session_counted';  // sessionStorage: cleared on tab close
const LOCAL_STATS_KEY = 'moviehub_last_known_stats'; // localStorage: last Firestore snapshot

/**
 * Called once on app mount.
 * Records a real visit to Firestore (increments global counters).
 * Uses sessionStorage to ensure each browser tab-session is counted only once.
 */
export const initVisitorTracker = () => {
  try {
    const isNewSession = !sessionStorage.getItem(SESSION_KEY);

    if (isNewSession) {
      sessionStorage.setItem(SESSION_KEY, '1');
    }

    // Fire to Firestore (async — non-blocking)
    recordVisitorToFirestore(isNewSession);

    // Return last known stats from localStorage as immediate placeholder
    return getVisitorStats();
  } catch (err) {
    console.warn('Visitor tracker init error:', err);
    return getVisitorStats();
  }
};

/**
 * Record a page view (non-session increment).
 * Fires a +1 to totalPageViews in Firestore.
 */
export const recordPageView = () => {
  try {
    recordVisitorToFirestore(false); // page view only — not a new session
  } catch (err) {
    console.warn('recordPageView error:', err);
  }
};

/**
 * Returns last-known visitor stats saved from the Firestore subscription.
 * AdminContext updates this whenever Firestore fires a new snapshot.
 */
export const getVisitorStats = () => {
  try {
    const raw = localStorage.getItem(LOCAL_STATS_KEY);
    if (raw) return JSON.parse(raw);
  } catch {}
  // Placeholder before Firestore data arrives
  return {
    totalVisits: '—',
    uniqueVisitors: '—',
    todayVisits: '—',
    totalPageViews: '—'
  };
};

/**
 * Called by AdminContext when Firestore sends a new snapshot.
 * Persists the real stats locally so they survive page refreshes.
 */
export const cacheVisitorStats = (stats) => {
  try {
    localStorage.setItem(LOCAL_STATS_KEY, JSON.stringify(stats));
  } catch {}
};
