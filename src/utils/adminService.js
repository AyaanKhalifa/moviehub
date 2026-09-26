// Admin & Maintenance Data Service with full CRUD operations for Users & Watchlists
import { getVisitorStats } from './visitorTracker';
import { 
  syncUserToFirestore, 
  updateUserInFirestore, 
  deleteUserFromFirestore, 
  syncWatchlistToFirestore, 
  saveMaintenanceToFirestore 
} from './firestoreService';

export const DEFAULT_MAINTENANCE_POEM = `The reels are resting, the screen is dark,
We're polishing magic, igniting the spark.
Like a classic scene in a director's sight,
We're tuning the sound and crafting the light.

Grab your popcorn, let the story wait,
MovieHub will return with something truly great.`;

const ADMIN_STORAGE_KEY = 'moviehub_admin_session';
const MAINTENANCE_STORAGE_KEY = 'moviehub_maintenance_config';
const USERS_STORAGE_KEY = 'moviehub_registered_users';

// Seed Initial Users
const INITIAL_USERS = [
  {
    uid: 'admin-001',
    email: 'ayaan@habibi.com',
    displayName: 'Ayaan Khalifa (Admin)',
    role: 'admin',
    createdAt: '2026-01-15T10:00:00.000Z',
    lastLogin: new Date().toISOString(),
    status: 'active'
  },
  {
    uid: 'user-002',
    email: 'sarah.connor@cinema.io',
    displayName: 'Sarah Connor',
    role: 'user',
    createdAt: '2026-03-12T14:30:00.000Z',
    lastLogin: '2026-09-25T19:15:00.000Z',
    status: 'active'
  },
  {
    uid: 'user-003',
    email: 'bruce.wayne@gotham.com',
    displayName: 'Bruce Wayne',
    role: 'user',
    createdAt: '2026-04-05T09:20:00.000Z',
    lastLogin: '2026-09-26T12:40:00.000Z',
    status: 'active'
  },
  {
    uid: 'user-004',
    email: 'tony.stark@avengers.org',
    displayName: 'Tony Stark',
    role: 'user',
    createdAt: '2026-05-18T16:45:00.000Z',
    lastLogin: '2026-09-24T08:10:00.000Z',
    status: 'active'
  }
];

// Seed initial watchlists
const INITIAL_WATCHLISTS = {
  'user-002': [
    {
      imdbID: 'tt0088247',
      Title: 'The Terminator',
      Year: '1984',
      Poster: 'https://m.media-amazon.com/images/M/MV5BMGU2NzRmZjUtOGUxYS00ZjdjLWEwZWItY2NlM2JhNjkxNTFmXkEyXkFqcGdeQXVyNjU0OTQ0OTY@._V1_SX300.jpg',
      Type: 'movie',
      imdbRating: '8.1',
      status: 'watched',
      addedAt: '2026-03-15T10:00:00.000Z'
    },
    {
      imdbID: 'tt0103064',
      Title: 'Terminator 2: Judgment Day',
      Year: '1991',
      Poster: 'https://m.media-amazon.com/images/M/MV5BMGU2NzRmZjUtOGUxYS00ZjdjLWEwZWItY2NlM2JhNjkxNTFmXkEyXkFqcGdeQXVyNjU0OTQ0OTY@._V1_SX300.jpg',
      Type: 'movie',
      imdbRating: '8.6',
      status: 'watched',
      addedAt: '2026-03-16T11:00:00.000Z'
    },
    {
      imdbID: 'tt1877832',
      Title: 'X-Men: Days of Future Past',
      Year: '2014',
      Poster: 'https://m.media-amazon.com/images/M/MV5BMTg0NjEwNjUxM15BMl5BanBnXkFtZTgwMzk3ODgyMTE@._V1_SX300.jpg',
      Type: 'movie',
      imdbRating: '7.9',
      status: 'undone',
      addedAt: '2026-04-01T12:00:00.000Z'
    }
  ],
  'user-003': [
    {
      imdbID: 'tt0468569',
      Title: 'The Dark Knight',
      Year: '2008',
      Poster: 'https://m.media-amazon.com/images/M/MV5BMTMxNTMwODM0NF5BMl5BanBnXkFtZTcwODAyMTk2Mw@@._V1_SX300.jpg',
      Type: 'movie',
      imdbRating: '9.0',
      status: 'watched',
      addedAt: '2026-04-10T14:00:00.000Z'
    },
    {
      imdbID: 'tt1877830',
      Title: 'The Batman',
      Year: '2022',
      Poster: 'https://m.media-amazon.com/images/M/MV5BMDdmMTBiNTYtMDIzNi00NGVlLWIzODEtMDA3OF5BMl5BanBnXkFtZTgwMzQ2MzU4MzE@._V1_SX300.jpg',
      Type: 'movie',
      imdbRating: '7.8',
      status: 'undone',
      addedAt: '2026-05-02T16:00:00.000Z'
    },
    {
      imdbID: 'tt0903747',
      Title: 'Breaking Bad',
      Year: '2008–2013',
      Poster: 'https://m.media-amazon.com/images/M/MV5BYmQ4YWMxYjUtNjZmYi00MDQ1LWFjMjAtNjA5N2YxNjc3ZGRlXkEyXkFqcGdeQXVyMTMzNDExODE5._V1_SX300.jpg',
      Type: 'series',
      imdbRating: '9.5',
      status: 'watched',
      addedAt: '2026-06-10T18:00:00.000Z'
    }
  ],
  'user-004': [
    {
      imdbID: 'tt0848228',
      Title: 'The Avengers',
      Year: '2012',
      Poster: 'https://m.media-amazon.com/images/M/MV5BNDYxNjQyMjAtNTdiOS00NGYwLWFmNTAtNThmYjU5ZGI2YTI1XkEyXkFqcGdeQXVyMTMxODk2OTU@._V1_SX300.jpg',
      Type: 'movie',
      imdbRating: '8.0',
      status: 'watched',
      addedAt: '2026-05-20T20:00:00.000Z'
    },
    {
      imdbID: 'tt4154796',
      Title: 'Avengers: Endgame',
      Year: '2019',
      Poster: 'https://m.media-amazon.com/images/M/MV5BMTc5MDE2ODcwNV5BMl5BanBnXkFtZTgwMzI2NzQ2NzM@._V1_SX300.jpg',
      Type: 'movie',
      imdbRating: '8.4',
      status: 'watched',
      addedAt: '2026-05-21T21:00:00.000Z'
    }
  ]
};

// Initialize Storage
export const initAdminStorage = () => {
  try {
    if (!localStorage.getItem(USERS_STORAGE_KEY)) {
      localStorage.setItem(USERS_STORAGE_KEY, JSON.stringify(INITIAL_USERS));
    }
    Object.keys(INITIAL_WATCHLISTS).forEach((uid) => {
      const key = `moviehub_watchlist_${uid}`;
      if (!localStorage.getItem(key)) {
        localStorage.setItem(key, JSON.stringify(INITIAL_WATCHLISTS[uid]));
      }
    });
  } catch (err) {
    console.warn('Storage init failed:', err);
  }
};

// Record or sync user activity
export const recordUserActivity = (user) => {
  if (!user || !user.uid) return;
  try {
    initAdminStorage();
    const raw = localStorage.getItem(USERS_STORAGE_KEY);
    const users = raw ? JSON.parse(raw) : [...INITIAL_USERS];

    const existingIndex = users.findIndex((u) => u.uid === user.uid || u.email === user.email);
    const now = new Date().toISOString();

    if (existingIndex >= 0) {
      users[existingIndex] = {
        ...users[existingIndex],
        displayName: user.displayName || users[existingIndex].displayName || 'MovieHub Member',
        email: user.email || users[existingIndex].email,
        role: (user.email === 'ayaan@habibi.com' || users[existingIndex].role === 'admin') ? 'admin' : 'user',
        lastLogin: now
      };
    } else {
      users.push({
        uid: user.uid,
        email: user.email || 'guest@moviehub.com',
        displayName: user.displayName || 'MovieHub Member',
        role: user.email === 'ayaan@habibi.com' ? 'admin' : 'user',
        createdAt: now,
        lastLogin: now,
        status: 'active'
      });
    }

    localStorage.setItem(USERS_STORAGE_KEY, JSON.stringify(users));
  } catch (err) {
    console.error('Error recording user activity:', err);
  }
};

// ==========================================
// USER CRUD OPERATIONS
// ==========================================

// READ ALL USERS
export const getAllUsers = () => {
  try {
    initAdminStorage();
    const raw = localStorage.getItem(USERS_STORAGE_KEY);
    return raw ? JSON.parse(raw) : INITIAL_USERS;
  } catch {
    return INITIAL_USERS;
  }
};

// CREATE USER
export const createNewUser = ({ displayName, email, role = 'user', status = 'active' }) => {
  try {
    initAdminStorage();
    const users = getAllUsers();
    const newUser = {
      uid: `user-${Date.now()}`,
      email: email.trim(),
      displayName: displayName.trim() || 'New User',
      role: role.toLowerCase(),
      createdAt: new Date().toISOString(),
      lastLogin: new Date().toISOString(),
      status
    };
    users.unshift(newUser);
    localStorage.setItem(USERS_STORAGE_KEY, JSON.stringify(users));

    // Sync to Cloud Firestore
    syncUserToFirestore(newUser);

    return { success: true, user: newUser };
  } catch (err) {
    return { success: false, error: err.message };
  }
};

// UPDATE USER
export const updateUser = (uid, updates) => {
  try {
    initAdminStorage();
    const users = getAllUsers();
    const index = users.findIndex((u) => u.uid === uid);
    if (index === -1) return { success: false, error: 'User not found' };

    users[index] = { ...users[index], ...updates };
    localStorage.setItem(USERS_STORAGE_KEY, JSON.stringify(users));

    // Sync to Cloud Firestore
    updateUserInFirestore(uid, updates);

    return { success: true, user: users[index] };
  } catch (err) {
    return { success: false, error: err.message };
  }
};

// DELETE USER
export const deleteUser = (uid) => {
  try {
    initAdminStorage();
    let users = getAllUsers();
    users = users.filter((u) => u.uid !== uid);
    localStorage.setItem(USERS_STORAGE_KEY, JSON.stringify(users));
    // Also remove their watchlist
    localStorage.removeItem(`moviehub_watchlist_${uid}`);

    // Sync to Cloud Firestore
    deleteUserFromFirestore(uid);

    return { success: true };
  } catch (err) {
    return { success: false, error: err.message };
  }
};

// ==========================================
// WATCHLIST CRUD OPERATIONS
// ==========================================

// READ USER WATCHLIST
export const getUserWatchlist = (uid) => {
  try {
    const raw = localStorage.getItem(`moviehub_watchlist_${uid}`);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
};

// ADD MOVIE TO USER WATCHLIST
export const addMovieToUserWatchlist = (uid, movie) => {
  try {
    const list = getUserWatchlist(uid);
    if (list.some((m) => m.imdbID === movie.imdbID)) {
      return { success: false, error: 'Movie already in watchlist' };
    }
    const newItem = {
      imdbID: movie.imdbID || `custom-${Date.now()}`,
      Title: movie.Title || 'Untitled Movie',
      Year: movie.Year || '2026',
      Poster: movie.Poster || '',
      Type: movie.Type || 'movie',
      imdbRating: movie.imdbRating || '7.5',
      status: movie.status || 'undone',
      addedAt: new Date().toISOString()
    };
    list.unshift(newItem);
    localStorage.setItem(`moviehub_watchlist_${uid}`, JSON.stringify(list));
    syncWatchlistToFirestore(uid, list);
    return { success: true, item: newItem };
  } catch (err) {
    return { success: false, error: err.message };
  }
};

// UPDATE WATCHLIST ITEM (Toggle Watched/Undone)
export const updateUserWatchlistItem = (uid, imdbID, updates) => {
  try {
    const list = getUserWatchlist(uid);
    const index = list.findIndex((m) => m.imdbID === imdbID);
    if (index === -1) return { success: false, error: 'Item not found' };

    list[index] = { ...list[index], ...updates };
    localStorage.setItem(`moviehub_watchlist_${uid}`, JSON.stringify(list));
    syncWatchlistToFirestore(uid, list);
    return { success: true, item: list[index] };
  } catch (err) {
    return { success: false, error: err.message };
  }
};

// DELETE MOVIE FROM USER WATCHLIST
export const removeMovieFromUserWatchlist = (uid, imdbID) => {
  try {
    let list = getUserWatchlist(uid);
    list = list.filter((m) => m.imdbID !== imdbID);
    localStorage.setItem(`moviehub_watchlist_${uid}`, JSON.stringify(list));
    syncWatchlistToFirestore(uid, list);
    return { success: true };
  } catch (err) {
    return { success: false, error: err.message };
  }
};

// CLEAR ALL ITEMS FROM USER WATCHLIST
export const clearUserWatchlist = (uid) => {
  try {
    localStorage.removeItem(`moviehub_watchlist_${uid}`);
    syncWatchlistToFirestore(uid, []);
    return { success: true };
  } catch (err) {
    return { success: false, error: err.message };
  }
};

// GET ALL USERS WITH WATCHLIST METRICS
export const getAllUsersWithWatchlists = () => {
  try {
    const users = getAllUsers();
    return users.map((user) => {
      const watchlist = getUserWatchlist(user.uid);
      const watched = watchlist.filter((m) => m.status === 'watched').length;
      const undone = watchlist.filter((m) => m.status !== 'watched').length;

      return {
        ...user,
        watchlist,
        totalItems: watchlist.length,
        watchedCount: watched,
        undoneCount: undone,
        progressPct: watchlist.length > 0 ? Math.round((watched / watchlist.length) * 100) : 0
      };
    });
  } catch {
    return [];
  }
};

// ==========================================
// MAINTENANCE MODE OPERATIONS
// ==========================================
export const getMaintenanceConfig = () => {
  try {
    const raw = localStorage.getItem(MAINTENANCE_STORAGE_KEY);
    if (raw) return JSON.parse(raw);
  } catch {}
  return {
    isActive: false,
    title: 'Upgrading the Cinema Experience',
    message: 'System upgrade in progress. Optimizing stream speeds and refreshing the movie library.',
    poem: DEFAULT_MAINTENANCE_POEM,
    pastConditions: 'Real-time database sync, live visitor analytics, and enhanced high-speed movie discovery engine.',
    eta: 'Back shortly with exciting new features',
    updatedAt: new Date().toISOString()
  };
};

export const saveMaintenanceConfig = (config) => {
  try {
    const current = getMaintenanceConfig();
    const updated = {
      ...current,
      ...config,
      updatedAt: new Date().toISOString()
    };
    localStorage.setItem(MAINTENANCE_STORAGE_KEY, JSON.stringify(updated));
    window.dispatchEvent(new Event('storage'));

    // Sync to Cloud Firestore
    saveMaintenanceToFirestore(updated);

    return updated;
  } catch (err) {
    console.error('Failed to save maintenance config:', err);
    return config;
  }
};

// Admin Session
export const verifyAdminSession = () => {
  try {
    const session = sessionStorage.getItem(ADMIN_STORAGE_KEY) || localStorage.getItem(ADMIN_STORAGE_KEY);
    return Boolean(session);
  } catch {
    return false;
  }
};

export const setAdminSession = (isAdmin) => {
  try {
    if (isAdmin) {
      sessionStorage.setItem(ADMIN_STORAGE_KEY, 'true');
      localStorage.setItem(ADMIN_STORAGE_KEY, 'true');
    } else {
      sessionStorage.removeItem(ADMIN_STORAGE_KEY);
      localStorage.removeItem(ADMIN_STORAGE_KEY);
    }
  } catch {}
};
