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
import { initVisitorTracker, getVisitorStats } from '../utils/visitorTracker';
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

  // Initialize storage and visitor metrics on mount
  useEffect(() => {
    initAdminStorage();
    const stats = initVisitorTracker();
    setVisitorStats(stats);
    setUsersData(getAllUsersWithWatchlists());
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

  // Listen to cross-tab / storage updates
  useEffect(() => {
    const handleStorageChange = () => {
      setMaintenanceConfig(getMaintenanceConfig());
      setIsAdmin(verifyAdminSession());
      setVisitorStats(getVisitorStats());
      setUsersData(getAllUsersWithWatchlists());
    };

    window.addEventListener('storage', handleStorageChange);
    window.addEventListener('visitor_update', handleStorageChange);
    return () => {
      window.removeEventListener('storage', handleStorageChange);
      window.removeEventListener('visitor_update', handleStorageChange);
    };
  }, []);

  const refreshData = () => {
    setUsersData(getAllUsersWithWatchlists());
    setVisitorStats(getVisitorStats());
    setMaintenanceConfig(getMaintenanceConfig());
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

  const updateMaintenance = (active, poem, eta, title) => {
    const updated = saveMaintenanceConfig({
      isActive: Boolean(active),
      ...(poem !== undefined && { poem }),
      ...(eta !== undefined && { eta }),
      ...(title !== undefined && { title })
    });
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
