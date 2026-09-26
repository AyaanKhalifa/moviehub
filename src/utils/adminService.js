// Admin & Maintenance Data Service

export const DEFAULT_MAINTENANCE_POEM = `The reels are resting, the screen is dark,
We're polishing magic, igniting the spark.
Like a classic scene in a director's sight,
We're tuning the sound and crafting the light.

Grab your popcorn, let the story wait,
MovieHub will return with something truly great.`;

const ADMIN_STORAGE_KEY = 'moviehub_admin_session';
const MAINTENANCE_STORAGE_KEY = 'moviehub_maintenance_config';
const USERS_STORAGE_KEY = 'moviehub_registered_users';

// Initial Seed Users for demonstration if none exist
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

// Seed initial watchlists for demo users if empty
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

// Initialize Users and Watchlists in localStorage if needed
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

// Register or update user in central admin list
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
        displayName: user.displayName || users[existingIndex].displayName || 'MovieHub Fan',
        email: user.email || users[existingIndex].email,
        role: (user.email === 'ayaan@habibi.com' || users[existingIndex].role === 'admin') ? 'admin' : 'user',
        lastLogin: now
      };
    } else {
      users.push({
        uid: user.uid,
        email: user.email || 'guest@moviehub.com',
        displayName: user.displayName || 'MovieHub Fan',
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

// Get all users
export const getAllUsers = () => {
  try {
    initAdminStorage();
    const raw = localStorage.getItem(USERS_STORAGE_KEY);
    return raw ? JSON.parse(raw) : INITIAL_USERS;
  } catch {
    return INITIAL_USERS;
  }
};

// Get all users with their full watchlist data
export const getAllUsersWithWatchlists = () => {
  try {
    const users = getAllUsers();
    return users.map((user) => {
      let watchlist = [];
      try {
        const raw = localStorage.getItem(`moviehub_watchlist_${user.uid}`);
        if (raw) watchlist = JSON.parse(raw);
      } catch {}

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

// Maintenance Configuration
export const getMaintenanceConfig = () => {
  try {
    const raw = localStorage.getItem(MAINTENANCE_STORAGE_KEY);
    if (raw) return JSON.parse(raw);
  } catch {}
  return {
    isActive: false,
    title: 'Upgrading the Cinema Experience',
    poem: DEFAULT_MAINTENANCE_POEM,
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
    // Dispatch storage event so other tabs/components react immediately
    window.dispatchEvent(new Event('storage'));
    return updated;
  } catch (err) {
    console.error('Failed to save maintenance config:', err);
    return config;
  }
};

// Admin Session verification
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
