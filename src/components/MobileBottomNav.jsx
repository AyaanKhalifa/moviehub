import React from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { Film, Calendar, Sparkles, Bookmark, User, LogIn } from 'lucide-react';
import { useWatchlist } from '../context/WatchlistContext';
import { useAuth } from '../context/AuthContext';
import './MobileBottomNav.css';

const MobileBottomNav = () => {
  const { watchlist } = useWatchlist();
  const { currentUser, isAuthenticated } = useAuth();
  const location = useLocation();

  // Hide bottom nav on full-screen legal pages or auth pages if desired, or keep it accessible everywhere
  return (
    <nav className="mobile-bottom-nav" aria-label="Mobile Navigation">
      <NavLink
        to="/?tab=all"
        className={({ isActive }) =>
          `mobile-nav-item ${isActive && (location.pathname === '/' && (!location.search || location.search.includes('tab='))) ? 'active' : ''}`
        }
      >
        <Film size={20} className="mobile-nav-icon" />
        <span className="mobile-nav-label">Home</span>
      </NavLink>

      <NavLink
        to="/upcoming"
        className={({ isActive }) =>
          `mobile-nav-item ${isActive ? 'active' : ''}`
        }
      >
        <Calendar size={20} className="mobile-nav-icon" />
        <span className="mobile-nav-label">Upcoming</span>
      </NavLink>

      <NavLink
        to="/latest"
        className={({ isActive }) =>
          `mobile-nav-item ${isActive ? 'active' : ''}`
        }
      >
        <Sparkles size={20} className="mobile-nav-icon" />
        <span className="mobile-nav-label">Latest</span>
      </NavLink>

      <NavLink
        to="/watchlist"
        className={({ isActive }) =>
          `mobile-nav-item ${isActive ? 'active' : ''}`
        }
      >
        <div className="mobile-nav-icon-wrap">
          <Bookmark size={20} className="mobile-nav-icon" />
          {watchlist.length > 0 && (
            <span className="mobile-nav-badge">{watchlist.length}</span>
          )}
        </div>
        <span className="mobile-nav-label">Watchlist</span>
      </NavLink>

      {isAuthenticated ? (
        <NavLink
          to="/profile"
          className={({ isActive }) =>
            `mobile-nav-item ${isActive ? 'active' : ''}`
          }
        >
          {currentUser?.photoURL ? (
            <img
              src={currentUser.photoURL}
              alt="Profile"
              className="mobile-nav-avatar"
            />
          ) : (
            <User size={20} className="mobile-nav-icon" />
          )}
          <span className="mobile-nav-label">Profile</span>
        </NavLink>
      ) : (
        <NavLink
          to="/login"
          className={({ isActive }) =>
            `mobile-nav-item ${isActive ? 'active' : ''}`
          }
        >
          <LogIn size={20} className="mobile-nav-icon" />
          <span className="mobile-nav-label">Sign In</span>
        </NavLink>
      )}
    </nav>
  );
};

export default MobileBottomNav;
