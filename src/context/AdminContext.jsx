import React, { createContext, useContext, useState, useEffect } from 'react';
import { 
  getMaintenanceConfig, 
  saveMaintenanceConfig, 
  verifyAdminSession, 
  setAdminSession,
  recordUserActivity,
  initAdminStorage,
  getAllUsersWithWatchlists,
  createNewUser,
  updateUser,
  deleteUser,
  addMovieToUserWatchlist,
  updateUserWatchlistItem,
  removeMovieFromUserWatchlist,
  clearUserWatchlist
} from '../utils/adminService';
import { initVisitorTracker, getVisitorStats, cacheVisitorStats } from '../utils/visitorTracker';
import { 
  subscribeToVisitorStatsFromFirestore,
  subscribeToMaintenanceFromFirestore,
  fetchMaintenanceFromFirestore
} from '../utils/firestoreService';
import { useAuth } from './AuthContext';

const AdminContext = createContext();

export const useAdmin = () => {
  const context = useContext(AdminContext);
  if (!context) {
    throw new Error('useAdmin must be used within an AdminProvider');
  }
  return context;
};

export const AdminProvider = ({ children }) => {
  const { currentUser } = useAuth();
  const [isAdmin, setIsAdmin] = useState(() => verifyAdminSession());
  const [maintenanceConfig, setMaintenanceConfig] = useState(() => getMaintenanceConfig());
  const [visitorStats, setVisitorStats] = useState(() => getVisitorStats());
  const [usersData, setUsersData] = useState(() => getAllUsersWithWatchlists());

  // Initialize on mount: track visitor + subscribe to Firestore real-time streams
  useEffect(() => {
    initAdminStorage();
    initVisitorTracker(); // Record this visit to Firestore (non-blocking)
    setUsersData(getAllUsersWithWatchlists());

    // --- Fetch maintenance config from Firestore immediately on first load ---
    fetchMaintenanceFromFirestore().then((firestoreConfig) => {
      if (firestoreConfig) {
        setMaintenanceConfig((prev) => ({ ...prev, ...firestoreConfig }));
        // Also update localStorage so offline works
        saveMaintenanceConfig(firestoreConfig);
      }
    });

    // --- Real-time Firestore subscription: visitor stats ---
    const unsubscribeVisitors = subscribeToVisitorStatsFromFirestore((firestoreStats) => {
      setVisitorStats(firestoreStats);       // Update React state (admin dashboard)
      cacheVisitorStats(firestoreStats);     // Persist for offline/reload
    });

    // --- Real-time Firestore subscription: maintenance mode ---
    // This ensures ALL browsers/devices see maintenance toggle instantly
    const unsubscribeMaintenance = subscribeToMaintenanceFromFirestore((firestoreConfig) => {
      setMaintenanceConfig(firestoreConfig);
      // Sync to localStorage as fallback
      try {
        localStorage.setItem('moviehub_maintenance_config', JSON.stringify(firestoreConfig));
      } catch {}
    });

    return () => {
      unsubscribeVisitors();
      unsubscribeMaintenance();
    };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Sync user activity when logged in
  useEffect(() => {
    if (currentUser) {
      recordUserActivity(currentUser);
      if (currentUser.email === 'ayaan@habibi.com') {
        setIsAdmin(true);
        setAdminSession(true);
      }
      setUsersData(getAllUsersWithWatchlists());
    }
  }, [currentUser]);

  // Listen to cross-tab localStorage changes (admin toggle on another tab, etc.)
  useEffect(() => {
    const handleStorageChange = () => {
      setIsAdmin(verifyAdminSession());
      setUsersData(getAllUsersWithWatchlists());
    };

    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, []);

  const refreshData = () => {
    setUsersData(getAllUsersWithWatchlists());
  };

  const adminLogin = (emailOrPin, password) => {
    const isPinMatch = emailOrPin === '443244';
    const isCredentialsMatch = 
      (emailOrPin === 'ayaan@habibi.com' || emailOrPin === 'ayaan' || emailOrPin === 'admin') && 
      (password === '443244' || !password);

    if (isPinMatch || isCredentialsMatch) {
      setIsAdmin(true);
      setAdminSession(true);
      return { success: true };
    }
    return { success: false, error: 'Invalid admin credentials or PIN. Use PIN: 443244' };
  };

  const adminLogout = () => {
    setIsAdmin(false);
    setAdminSession(false);
  };

  const updateMaintenance = (activeOrConfig, poem, eta, title, message, pastConditions) => {
    let configToSave = {};
    if (typeof activeOrConfig === 'object' && activeOrConfig !== null) {
      configToSave = activeOrConfig;
    } else {
      configToSave = {
        isActive: Boolean(activeOrConfig),
        ...(poem !== undefined && { poem }),
        ...(eta !== undefined && { eta }),
        ...(title !== undefined && { title }),
        ...(message !== undefined && { message }),
        ...(pastConditions !== undefined && { pastConditions })
      };
    }
    const updated = saveMaintenanceConfig(configToSave);
    setMaintenanceConfig(updated);
    return updated;
  };

  // User CRUD
  const addUser = (userData) => {
    const res = createNewUser(userData);
    refreshData();
    return res;
  };

  const editUser = (uid, updates) => {
    const res = updateUser(uid, updates);
    refreshData();
    return res;
  };

  const removeUser = (uid) => {
    const res = deleteUser(uid);
    refreshData();
    return res;
  };

  // Watchlist CRUD
  const addWatchlistMovie = (uid, movie) => {
    const res = addMovieToUserWatchlist(uid, movie);
    refreshData();
    return res;
  };

  const toggleWatchlistMovieStatus = (uid, imdbID, currentStatus) => {
    const newStatus = currentStatus === 'watched' ? 'undone' : 'watched';
    const res = updateUserWatchlistItem(uid, imdbID, { 
      status: newStatus,
      completedAt: newStatus === 'watched' ? new Date().toISOString() : null 
    });
    refreshData();
    return res;
  };

  const removeWatchlistMovie = (uid, imdbID) => {
    const res = removeMovieFromUserWatchlist(uid, imdbID);
    refreshData();
    return res;
  };

  const clearUserAllWatchlist = (uid) => {
    const res = clearUserWatchlist(uid);
    refreshData();
    return res;
  };

  return (
    <AdminContext.Provider
      value={{
        isAdmin,
        isMaintenanceActive: maintenanceConfig.isActive,
        maintenanceConfig,
        visitorStats,
        usersData,
        adminLogin,
        adminLogout,
        updateMaintenance,
        refreshData,
        addUser,
        editUser,
        removeUser,
        addWatchlistMovie,
        toggleWatchlistMovieStatus,
        removeWatchlistMovie,
        clearUserAllWatchlist
      }}
    >
      {children}
    </AdminContext.Provider>
  );
};
