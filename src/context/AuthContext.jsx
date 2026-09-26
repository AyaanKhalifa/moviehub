import React, { createContext, useContext, useEffect, useState } from 'react';
import { 
  auth, 
  loginWithEmail, 
  registerWithEmail, 
  loginWithGoogle, 
  logoutUser, 
  resetUserPassword,
  updateUserDisplayName,
  onAuthStateChanged 
} from '../firebase';

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const [userLoading, setUserLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setCurrentUser(user);
      setUserLoading(false);
    });

    return unsubscribe;
  }, []);

  const login = (email, password) => {
    return loginWithEmail(email, password);
  };

  const register = (email, password, displayName) => {
    return registerWithEmail(email, password, displayName);
  };

  const signInWithGoogle = () => {
    return loginWithGoogle();
  };

  const logout = () => {
    return logoutUser();
  };

  const resetPassword = (email) => {
    return resetUserPassword(email);
  };

  const updateProfileName = async (name) => {
    await updateUserDisplayName(name);
    setCurrentUser({ ...auth.currentUser });
  };

  const value = {
    currentUser,
    userLoading,
    isAuthenticated: Boolean(currentUser),
    login,
    register,
    signInWithGoogle,
    logout,
    resetPassword,
    updateProfileName
  };

  return (
    <AuthContext.Provider value={value}>
      {!userLoading && children}
    </AuthContext.Provider>
  );
};
