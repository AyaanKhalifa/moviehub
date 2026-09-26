// Cloud Firestore Database Integration Service
import {
  db,
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
} from '../firebase';

// Collection Names
export const COLLECTIONS = {
  USERS: 'users',
  WATCHLISTS: 'watchlists',
  RECENT_SEARCHES: 'recentSearches',
  SITE_METRICS: 'siteMetrics',
  SYSTEM_CONFIG: 'systemConfig'
};

// ==========================================
// 1. USERS COLLECTION (Firestore)
// ==========================================

export const syncUserToFirestore = async (user) => {
  if (!user || !user.uid) return;
  try {
    const userRef = doc(db, COLLECTIONS.USERS, user.uid);
    const snap = await getDoc(userRef);
    const now = new Date().toISOString();

    const userData = {
      uid: user.uid,
      email: user.email || '',
      displayName: user.displayName || 'MovieHub Member',
      role: (user.email === 'ayaan@habibi.com' || user.role === 'admin') ? 'admin' : 'user',
      lastLogin: now,
      status: 'active',
      updatedAt: serverTimestamp()
    };

    if (!snap.exists()) {
      userData.createdAt = now;
      await setDoc(userRef, userData);
    } else {
      await updateDoc(userRef, {
        displayName: user.displayName || snap.data().displayName,
        email: user.email || snap.data().email,
        lastLogin: now,
        updatedAt: serverTimestamp()
      });
    }
  } catch (err) {
    console.warn('Firestore syncUser warning (local cache active):', err.message);
  }
};

export const fetchUsersFromFirestore = async () => {
  try {
    const usersCol = collection(db, COLLECTIONS.USERS);
    const snap = await getDocs(usersCol);
    if (!snap.empty) {
      return snap.docs.map((d) => d.data());
    }
  } catch (err) {
    console.warn('Firestore fetchUsers fallback:', err.message);
  }
  return null;
};

export const updateUserInFirestore = async (uid, updates) => {
  try {
    const userRef = doc(db, COLLECTIONS.USERS, uid);
    await setDoc(userRef, { ...updates, updatedAt: serverTimestamp() }, { merge: true });
    return { success: true };
  } catch (err) {
    console.warn('Firestore updateUser error:', err);
    return { success: false, error: err.message };
  }
};

export const deleteUserFromFirestore = async (uid) => {
  try {
    await deleteDoc(doc(db, COLLECTIONS.USERS, uid));
    await deleteDoc(doc(db, COLLECTIONS.WATCHLISTS, uid));
    await deleteDoc(doc(db, COLLECTIONS.RECENT_SEARCHES, uid));
    return { success: true };
  } catch (err) {
    console.warn('Firestore deleteUser error:', err);
    return { success: false, error: err.message };
  }
};

// ==========================================
// 2. WATCHLISTS COLLECTION (Firestore)
// ==========================================

export const syncWatchlistToFirestore = async (uid, watchlist) => {
  if (!uid) return;
  try {
    const wlRef = doc(db, COLLECTIONS.WATCHLISTS, uid);
    await setDoc(wlRef, {
      uid,
      items: watchlist || [],
      totalCount: (watchlist || []).length,
      watchedCount: (watchlist || []).filter((m) => m.status === 'watched').length,
      undoneCount: (watchlist || []).filter((m) => m.status !== 'watched').length,
      updatedAt: serverTimestamp()
    }, { merge: true });
  } catch (err) {
    console.warn('Firestore syncWatchlist warning:', err.message);
  }
};

export const fetchWatchlistFromFirestore = async (uid) => {
  if (!uid) return null;
  try {
    const wlRef = doc(db, COLLECTIONS.WATCHLISTS, uid);
    const snap = await getDoc(wlRef);
    if (snap.exists()) {
      return snap.data().items || [];
    }
  } catch (err) {
    console.warn('Firestore fetchWatchlist warning:', err.message);
  }
  return null;
};

// ==========================================
// 3. RECENT SEARCHES COLLECTION (Firestore)
// ==========================================

export const syncRecentSearchesToFirestore = async (uid, searches) => {
  if (!uid) return;
  try {
    const searchRef = doc(db, COLLECTIONS.RECENT_SEARCHES, uid);
    await setDoc(searchRef, {
      uid,
      searches: searches || [],
      updatedAt: serverTimestamp()
    }, { merge: true });
  } catch (err) {
    console.warn('Firestore syncRecentSearches warning:', err.message);
  }
};

export const fetchRecentSearchesFromFirestore = async (uid) => {
  if (!uid) return null;
  try {
    const searchRef = doc(db, COLLECTIONS.RECENT_SEARCHES, uid);
    const snap = await getDoc(searchRef);
    if (snap.exists()) {
      return snap.data().searches || [];
    }
  } catch (err) {
    console.warn('Firestore fetchRecentSearches warning:', err.message);
  }
  return null;
};

// ==========================================
// 4. SITE METRICS / REAL VISITOR COUNT (Firestore)
//    - Globally shared across all users/devices
//    - todayVisits resets automatically by date key
// ==========================================

const getTodayKey = () => new Date().toISOString().split('T')[0]; // e.g. "2026-09-26"

export const recordVisitorToFirestore = async (isNewSession = false) => {
  try {
    const metricsRef = doc(db, COLLECTIONS.SITE_METRICS, 'traffic');
    const today = getTodayKey();
    const snap = await getDoc(metricsRef);

    if (!snap.exists()) {
      // First ever visitor — create the document
      await setDoc(metricsRef, {
        totalVisits: 1,
        uniqueVisitors: 1,
        todayVisits: 1,
        todayKey: today,
        totalPageViews: 1,
        lastUpdated: serverTimestamp()
      });
    } else {
      const data = snap.data();
      const updates = {
        totalPageViews: increment(1),
        lastUpdated: serverTimestamp()
      };

      // Reset todayVisits if date has changed
      if (data.todayKey !== today) {
        updates.todayVisits = 1;
        updates.todayKey = today;
      } else if (isNewSession) {
        updates.todayVisits = increment(1);
      }

      // New session = new unique visit
      if (isNewSession) {
        updates.totalVisits = increment(1);
        updates.uniqueVisitors = increment(1);
      }

      await updateDoc(metricsRef, updates);
    }
  } catch (err) {
    console.warn('Firestore recordVisitor warning:', err.message);
  }
};

export const subscribeToVisitorStatsFromFirestore = (callback) => {
  try {
    const metricsRef = doc(db, COLLECTIONS.SITE_METRICS, 'traffic');
    const unsubscribe = onSnapshot(
      metricsRef,
      (docSnap) => {
        if (docSnap.exists()) {
          const data = docSnap.data();
          callback({
            totalVisits: data.totalVisits || 0,
            uniqueVisitors: data.uniqueVisitors || 0,
            todayVisits: data.todayVisits || 0,
            totalPageViews: data.totalPageViews || 0
          });
        }
      },
      (err) => {
        console.warn('Firestore visitor subscription fallback:', err.message);
      }
    );
    return unsubscribe;
  } catch {
    return () => {};
  }
};

// ==========================================
// 5. SYSTEM CONFIG / MAINTENANCE MODE (Firestore)
//    - Fully connected: changes broadcast to all visitors in real-time
// ==========================================

export const saveMaintenanceToFirestore = async (config) => {
  try {
    const configRef = doc(db, COLLECTIONS.SYSTEM_CONFIG, 'maintenance');
    // Strip serverTimestamp-incompatible fields, build clean object
    const toSave = {
      isActive: Boolean(config.isActive),
      title: config.title || '',
      message: config.message || '',
      poem: config.poem || '',
      eta: config.eta || '',
      pastConditions: config.pastConditions || '',
      updatedAt: serverTimestamp()
    };
    // setDoc with merge:false so we replace the whole doc cleanly
    await setDoc(configRef, toSave);
    return { success: true };
  } catch (err) {
    console.warn('Firestore saveMaintenance warning:', err.message);
    return { success: false, error: err.message };
  }
};

export const fetchMaintenanceFromFirestore = async () => {
  try {
    const configRef = doc(db, COLLECTIONS.SYSTEM_CONFIG, 'maintenance');
    const snap = await getDoc(configRef);
    if (snap.exists()) {
      return snap.data();
    }
  } catch (err) {
    console.warn('Firestore fetchMaintenance warning:', err.message);
  }
  return null;
};

export const subscribeToMaintenanceFromFirestore = (callback) => {
  try {
    const configRef = doc(db, COLLECTIONS.SYSTEM_CONFIG, 'maintenance');
    const unsubscribe = onSnapshot(
      configRef,
      (docSnap) => {
        if (docSnap.exists()) {
          const data = docSnap.data();
          // Normalize: strip Firestore Timestamp objects before passing to React state
          callback({
            isActive: Boolean(data.isActive),
            title: data.title || '',
            message: data.message || '',
            poem: data.poem || '',
            eta: data.eta || '',
            pastConditions: data.pastConditions || '',
            updatedAt: data.updatedAt?.toDate?.()?.toISOString?.() || new Date().toISOString()
          });
        }
      },
      (err) => {
        console.warn('Firestore maintenance subscription fallback:', err.message);
      }
    );
    return unsubscribe;
  } catch {
    return () => {};
  }
};
