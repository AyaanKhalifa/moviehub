import React, { useState, useEffect, useRef } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { 
  Search, 
  Film, 
  Bookmark, 
  X, 
  Loader2, 
  Sparkles, 
  Tv, 
  Calendar,
  Clock,
  User,
  LogIn,
  ChevronRight, 
  LayoutGrid,
  Trash2
} from 'lucide-react';
import { useWatchlist } from '../context/WatchlistContext';
import { useAuth } from '../context/AuthContext';
import { searchMovies, isAnimeItem } from '../utils/api';
import { getRecentSearches, addRecentSearch, removeRecentSearch, clearRecentSearches } from '../utils/recentSearches';
import CategoriesModal from './CategoriesModal';
import './Navbar.css';

const Navbar = () => {
  const [query, setQuery] = useState('');
  const [suggestions, setSuggestions] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);
  const [showRecent, setShowRecent] = useState(false);
  const [recentSearches, setRecentSearches] = useState([]);
  const [isCategoriesOpen, setIsCategoriesOpen] = useState(false);

  const { watchlist } = useWatchlist();
  const { currentUser, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const searchContainerRef = useRef(null);

  // Load recent searches on mount and focus
  useEffect(() => {
    setRecentSearches(getRecentSearches());
  }, []);

  // Close dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (searchContainerRef.current && !searchContainerRef.current.contains(e.target)) {
        setShowDropdown(false);
        setShowRecent(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Close dropdown on route change
  useEffect(() => {
    setShowDropdown(false);
    setShowRecent(false);
  }, [location.pathname]);

  // Live search debounce
  useEffect(() => {
    const trimmed = query.trim();
    if (trimmed.length < 2) {
      setSuggestions([]);
      setIsLoading(false);
      return;
    }

    setIsLoading(true);
    const timeoutId = setTimeout(async () => {
      try {
        const data = await searchMovies(trimmed);
        if (data.Response === 'True' && data.Search) {
          setSuggestions(data.Search.slice(0, 6));
          setShowDropdown(true);
          setShowRecent(false);
        } else {
          setSuggestions([]);
        }
      } catch {
        setSuggestions([]);
      } finally {
        setIsLoading(false);
      }
    }, 280);

    return () => clearTimeout(timeoutId);
  }, [query]);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (query.trim()) {
      const trimmed = query.trim();
      addRecentSearch(trimmed);
      setRecentSearches(getRecentSearches());
      setShowDropdown(false);
      setShowRecent(false);
      navigate(`/search?q=${encodeURIComponent(trimmed)}`);
    }
  };

  const handleSelectRecent = (term) => {
    setQuery(term);
    addRecentSearch(term);
    setShowRecent(false);
    navigate(`/search?q=${encodeURIComponent(term)}`);
  };

  const handleRemoveRecent = (e, term) => {
    e.stopPropagation();
    const updated = removeRecentSearch(term);
    setRecentSearches(updated);
  };

  const handleClearAllRecent = (e) => {
    e.stopPropagation();
    clearRecentSearches();
    setRecentSearches([]);
  };

  const handleSelectSuggestion = (id, title) => {
    if (title) addRecentSearch(title);
    setShowDropdown(false);
    setShowRecent(false);
    setQuery('');
    navigate(`/movie/${id}`);
  };

  const clearQuery = () => {
    setQuery('');
    setSuggestions([]);
    setShowDropdown(false);
  };

  const userInitial = (currentUser?.displayName || currentUser?.email || 'U')[0].toUpperCase();

  return (
    <>
      <header className="navbar">
        <div className="container navbar-container">
          {/* Brand */}
          <Link to="/" className="navbar-brand">
            <div className="brand-logo-icon">
              <Film size={22} className="brand-icon" />
            </div>
            <span className="brand-text">
              Movie<span className="brand-highlight">Hub</span>
            </span>
          </Link>

          {/* Navigation Categories & Upcoming */}
          <nav className="navbar-links">
            <Link
              to="/?tab=all"
              className={`nav-link ${location.pathname === '/' && !location.search.includes('tab=') ? 'active' : ''}`}
            >
              Home
            </Link>
            <Link
              to="/?tab=movies"
              className={`nav-link ${location.search.includes('tab=movies') ? 'active' : ''}`}
            >
              Movies
            </Link>
            <Link
              to="/?tab=series"
              className={`nav-link ${location.search.includes('tab=series') ? 'active' : ''}`}
            >
              Web Series
            </Link>
            <Link
              to="/?tab=anime"
              className={`nav-link ${location.search.includes('tab=anime') ? 'active' : ''}`}
            >
              Anime
            </Link>
            <Link
              to="/upcoming"
              className={`nav-link nav-upcoming-link ${location.pathname === '/upcoming' ? 'active' : ''}`}
            >
              <Calendar size={14} />
              <span>Upcoming</span>
            </Link>
            <Link
              to="/latest"
              className={`nav-link nav-upcoming-link ${location.pathname === '/latest' ? 'active' : ''}`}
            >
              <Sparkles size={14} />
              <span>Latest</span>
            </Link>

            {/* Categories Explorer Trigger Button */}
            <button
              type="button"
              className="nav-link cat-explore-trigger"
              onClick={() => setIsCategoriesOpen(true)}
            >
              <LayoutGrid size={15} className="cat-trigger-icon" />
              <span>Categories</span>
            </button>
          </nav>

          {/* Live Search Bar with Instant Autocomplete & Recent Searches */}
          <div className="navbar-search-wrapper" ref={searchContainerRef}>
            <form className="search-form" onSubmit={handleSearchSubmit}>
              <Search size={18} className="search-icon" />
              <input
                type="text"
                placeholder="Search movies, web series, anime..."
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                onFocus={() => {
                  setRecentSearches(getRecentSearches());
                  if (query.trim().length >= 2 && suggestions.length > 0) {
                    setShowDropdown(true);
                    setShowRecent(false);
                  } else {
                    setShowRecent(true);
                    setShowDropdown(false);
                  }
                }}
                className="search-input"
                autoComplete="off"
              />
              {isLoading && <Loader2 size={16} className="search-spinner" />}
              {query && !isLoading && (
                <button type="button" className="search-clear-btn" onClick={clearQuery}>
                  <X size={16} />
                </button>
              )}
            </form>

            {/* Recent Searches Dropdown (when focused and query is empty/short) */}
            {showRecent && recentSearches.length > 0 && query.trim().length < 2 && (
              <div className="search-dropdown recent-search-dropdown animate-fade-in">
                <div className="dropdown-header">
                  <div className="recent-header-left">
                    <Clock size={14} className="recent-clock-icon" />
                    <span>Recent Searches</span>
                  </div>
                  <button
                    type="button"
                    className="clear-recent-btn"
                    onClick={handleClearAllRecent}
                  >
                    Clear All
                  </button>
                </div>
                <ul className="recent-search-list">
                  {recentSearches.map((item, idx) => (
                    <li
                      key={idx}
                      className="recent-search-item"
                      onClick={() => handleSelectRecent(item)}
                    >
                      <div className="recent-item-left">
                        <Clock size={14} className="recent-item-icon" />
                        <span className="recent-item-text">{item}</span>
                      </div>
                      <button
                        type="button"
                        className="remove-recent-btn"
                        onClick={(e) => handleRemoveRecent(e, item)}
                        title="Remove from history"
                      >
                        <X size={14} />
                      </button>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Autocomplete Suggestions Dropdown */}
            {showDropdown && suggestions.length > 0 && (
              <div className="search-dropdown animate-fade-in">
                <div className="dropdown-header">
                  <span>Related Matches</span>
                  <span className="dropdown-count">{suggestions.length} found</span>
                </div>
                <ul className="dropdown-list">
                  {suggestions.map((item) => {
                    const isAnime = isAnimeItem(item);
                    const isSeries = !isAnime && (item.Type === 'series' || item.Type === 'tv');

                    return (
                      <li
                        key={item.imdbID}
                        className="dropdown-item"
                        onClick={() => handleSelectSuggestion(item.imdbID, item.Title)}
                      >
                        <div className="dropdown-thumb">
                          {item.Poster && item.Poster !== 'N/A' ? (
                            <img src={item.Poster} alt={item.Title} />
                          ) : (
                            <Film size={18} />
                          )}
                        </div>
                        <div className="dropdown-info">
                          <div className="dropdown-title-row">
                            <span className="dropdown-item-title">{item.Title}</span>
                          </div>
                          <div className="dropdown-meta">
                            <span className="dropdown-item-year">{item.Year}</span>
                            <span
                              className={`dropdown-type-badge ${
                                isAnime ? 'badge-anime' : isSeries ? 'badge-series' : 'badge-movie'
                              }`}
                            >
                              {isAnime ? 'Anime' : isSeries ? 'Web Series' : 'Movie'}
                            </span>
                          </div>
                        </div>
                        <ChevronRight size={16} className="dropdown-arrow" />
                      </li>
                    );
                  })}
                </ul>
                <div
                  className="dropdown-footer"
                  onClick={handleSearchSubmit}
                >
                  <span>View all results for "<strong>{query}</strong>"</span>
                  <ChevronRight size={16} />
                </div>
              </div>
            )}
          </div>

          {/* Action buttons (Categories on mobile + Watchlist + User Profile / Sign In) */}
          <div className="navbar-actions-group">
            <button
              type="button"
              className="mobile-cat-btn"
              onClick={() => setIsCategoriesOpen(true)}
              title="Explore All Categories"
            >
              <LayoutGrid size={18} />
            </button>

            {/* Watchlist Icon with badge counter */}
            <Link to="/watchlist" className="watchlist-link" title="My Watchlist">
              <Bookmark size={20} className="watchlist-icon" />
              <span className="watchlist-label">Watchlist</span>
              {watchlist.length > 0 && (
                <span className="watchlist-badge">{watchlist.length}</span>
              )}
            </Link>

            {/* User Profile or Sign In Button */}
            {isAuthenticated ? (
              <Link to="/profile" className="navbar-user-btn" title="My Profile">
                {currentUser?.photoURL ? (
                  <img
                    src={currentUser.photoURL}
                    alt={currentUser.displayName || 'Profile'}
                    className="navbar-user-avatar"
                  />
                ) : (
                  <div className="navbar-user-fallback">
                    <span>{userInitial}</span>
                  </div>
                )}
                <span className="navbar-user-name">
                  {currentUser?.displayName?.split(' ')[0] || 'Profile'}
                </span>
              </Link>
            ) : (
              <Link to="/login" className="navbar-signin-btn" title="Sign In">
                <LogIn size={16} />
                <span>Sign In</span>
              </Link>
            )}
          </div>
        </div>
      </header>

      {/* Categories Explorer Modal */}
      <CategoriesModal
        isOpen={isCategoriesOpen}
        onClose={() => setIsCategoriesOpen(false)}
      />
    </>
  );
};

export default Navbar;
