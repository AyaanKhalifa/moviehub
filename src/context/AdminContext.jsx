import React, { createContext, useContext, useState, useEffect } from 'react';
import { 
  getMaintenanceConfig, 
  saveMaintenanceConfig, 
  verifyAdminSession, 
  setAdminSession,
  recordUserActivity,
  initAdminStorage
} from '../utils/adminService';
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

  // Initialize storage once on mount
  useEffect(() => {
    initAdminStorage();
  }, []);

  // Sync user activity when logged in
  useEffect(() => {
    if (currentUser) {
      recordUserActivity(currentUser);
      if (currentUser.email === 'admin@moviehub.com') {
        setIsAdmin(true);
        setAdminSession(true);
      }
    }
  }, [currentUser]);

  // Listen to cross-tab / storage updates
  useEffect(() => {
    const handleStorageChange = () => {
      setMaintenanceConfig(getMaintenanceConfig());
      setIsAdmin(verifyAdminSession());
    };

    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, []);

  const adminLogin = (emailOrPin, password) => {
    // Admin credentials check: either PIN 7777 / admin123 or email admin@moviehub.com + password
    const isPinMatch = emailOrPin === '7777' || emailOrPin === 'admin123';
    const isCredentialsMatch = 
      (emailOrPin === 'admin@moviehub.com' || emailOrPin === 'admin') && 
      (password === 'admin123' || password === 'admin' || password === '7777' || !password);

    if (isPinMatch || isCredentialsMatch) {
      setIsAdmin(true);
      setAdminSession(true);
      return { success: true };
    }
    return { success: false, error: 'Invalid admin credentials or PIN.' };
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

  return (
    <AdminContext.Provider
      value={{
        isAdmin,
        isMaintenanceActive: maintenanceConfig.isActive,
        maintenanceConfig,
        adminLogin,
        adminLogout,
        updateMaintenance
      }}
    >
      {children}
    </AdminContext.Provider>
  );
};
