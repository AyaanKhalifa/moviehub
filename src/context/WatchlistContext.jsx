import React, { createContext, useContext, useState, useEffect } from 'react';
import { useAuth } from './AuthContext';
import { syncWatchlistToFirestore, fetchWatchlistFromFirestore } from '../utils/firestoreService';

const WatchlistContext = createContext();

export const WatchlistProvider = ({ children }) => {
  const { currentUser, isAuthenticated } = useAuth();
  const storageKey = currentUser ? `moviehub_watchlist_${currentUser.uid}` : 'moviehub_watchlist_guest';

  const [watchlist, setWatchlist] = useState(() => {
    try {
      const saved = localStorage.getItem(storageKey);
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  // Reload watchlist when user logs in & fetch from Firestore
  useEffect(() => {
    let isMounted = true;
    const loadWatchlist = async () => {
      if (currentUser) {
        // First load from local storage for instant response
        try {
          const userSaved = localStorage.getItem(`moviehub_watchlist_${currentUser.uid}`);
          if (userSaved && isMounted) {
            setWatchlist(JSON.parse(userSaved));
          }
        } catch {}

        // Then fetch remote from Firestore
        const remoteList = await fetchWatchlistFromFirestore(currentUser.uid);
        if (remoteList && remoteList.length > 0 && isMounted) {
          setWatchlist(remoteList);
          try {
            localStorage.setItem(`moviehub_watchlist_${currentUser.uid}`, JSON.stringify(remoteList));
          } catch {}
        }
      } else {
        if (isMounted) setWatchlist([]);
      }
    };

    loadWatchlist();
    return () => { isMounted = false; };
  }, [currentUser]);

  // Persist watchlist whenever it changes to both localStorage and Firestore
  useEffect(() => {
    if (currentUser) {
      try {
        localStorage.setItem(`moviehub_watchlist_${currentUser.uid}`, JSON.stringify(watchlist));
      } catch (e) {
        console.error('Failed to save watchlist to localStorage', e);
      }
      // Sync to Cloud Firestore
      syncWatchlistToFirestore(currentUser.uid, watchlist);
    }
  }, [watchlist, currentUser]);

  const addToWatchlist = (movie) => {
    if (!isAuthenticated) {
      return { requireLogin: true };
    }

    setWatchlist((prev) => {
      if (prev.some((m) => m.imdbID === movie.imdbID)) return prev;
      return [
        {
          imdbID: movie.imdbID,
          Title: movie.Title,
          Year: movie.Year,
          Poster: movie.Poster,
          Type: movie.Type || 'movie',
          imdbRating: movie.imdbRating || movie.rating || null,
          Genre: movie.Genre || null,
          status: 'undone', // 'undone' (Plan to Watch) or 'watched' (Done)
          addedAt: new Date().toISOString()
        },
        ...prev,
      ];
    });
    return { requireLogin: false, added: true };
  };

  const removeFromWatchlist = (imdbID) => {
    if (!isAuthenticated) return { requireLogin: true };
    setWatchlist((prev) => prev.filter((m) => m.imdbID !== imdbID));
    return { requireLogin: false };
  };

  const toggleWatchlist = (movie) => {
    if (!isAuthenticated) {
      return { requireLogin: true };
    }
    if (watchlist.some((m) => m.imdbID === movie.imdbID)) {
      removeFromWatchlist(movie.imdbID);
      return { requireLogin: false, inWatchlist: false };
    } else {
      addToWatchlist(movie);
      return { requireLogin: false, inWatchlist: true };
    }
  };

  // Toggle movie between 'watched' (Done) and 'undone' (To Watch)
  const toggleWatchedStatus = (imdbID) => {
    if (!isAuthenticated) return { requireLogin: true };
    setWatchlist((prev) =>
      prev.map((item) => {
        if (item.imdbID === imdbID) {
          const newStatus = item.status === 'watched' ? 'undone' : 'watched';
          return { ...item, status: newStatus, completedAt: newStatus === 'watched' ? new Date().toISOString() : null };
        }
        return item;
      })
    );
    return { requireLogin: false };
  };

  const isInWatchlist = (imdbID) => {
    if (!isAuthenticated) return false;
    return watchlist.some((m) => m.imdbID === imdbID);
  };

  const isWatched = (imdbID) => {
    if (!isAuthenticated) return false;
    const item = watchlist.find((m) => m.imdbID === imdbID);
    return item?.status === 'watched';
  };

  const clearWatchlist = () => {
    setWatchlist([]);
  };

  // Calculated Metrics
  const watchedItems = watchlist.filter((m) => m.status === 'watched');
  const undoneItems = watchlist.filter((m) => m.status !== 'watched');
  const watchedCount = watchedItems.length;
  const undoneCount = undoneItems.length;
  const totalCount = watchlist.length;
  const progressPercentage = totalCount > 0 ? Math.round((watchedCount / totalCount) * 100) : 0;

  return (
    <WatchlistContext.Provider
      value={{
        watchlist,
        addToWatchlist,
        removeFromWatchlist,
        toggleWatchlist,
        toggleWatchedStatus,
        isInWatchlist,
        isWatched,
        clearWatchlist,
        watchedItems,
        undoneItems,
        watchedCount,
        undoneCount,
        totalCount,
        progressPercentage,
        isAuthenticated
      }}
    >
      {children}
    </WatchlistContext.Provider>
  );
};

export const useWatchlist = () => {
  const context = useContext(WatchlistContext);
  if (!context) {
    throw new Error('useWatchlist must be used within a WatchlistProvider');
  }
  return context;
};
