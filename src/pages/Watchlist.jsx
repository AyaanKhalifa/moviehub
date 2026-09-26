import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { 
  Bookmark, 
  Film, 
  Tv, 
  Sparkles, 
  Trash2, 
  ArrowRight, 
  CheckCircle2, 
  Clock, 
  Lock, 
  LogIn, 
  UserPlus, 
  Check, 
  RotateCcw 
} from 'lucide-react';
import { useWatchlist } from '../context/WatchlistContext';
import { useAuth } from '../context/AuthContext';
import { isAnimeItem } from '../utils/api';
import MovieCard from '../components/MovieCard';
import './Watchlist.css';

const Watchlist = () => {
  const { 
    watchlist, 
    clearWatchlist, 
    removeFromWatchlist,
    toggleWatchedStatus, 
    watchedCount, 
    undoneCount, 
    totalCount, 
    progressPercentage 
  } = useWatchlist();

  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();

  const [statusFilter, setStatusFilter] = useState('all'); // 'all', 'undone', 'watched'
  const [typeFilter, setTypeFilter] = useState('all'); // 'all', 'movies', 'series', 'anime'

  // If user is not logged in: Show Login Required Wall
  if (!isAuthenticated) {
    return (
      <div className="container watchlist-auth-required animate-fade-in">
        <div className="auth-wall-card">
          <div className="auth-wall-icon-wrap">
            <Lock size={44} className="auth-wall-lock-icon" />
          </div>
          <h2 className="auth-wall-title">Sign In to Access Your Watchlist</h2>
          <p className="auth-wall-desc">
            Your Watchlist is securely saved to your account. Sign in to track watched movies, manage your to-watch queue, and sync across all your devices.
          </p>
          <div className="auth-wall-actions">
            <Link to="/login?redirect=/watchlist" className="auth-wall-btn primary-btn">
              <LogIn size={18} />
              <span>Sign In</span>
            </Link>
            <Link to="/register?redirect=/watchlist" className="auth-wall-btn secondary-btn">
              <UserPlus size={18} />
              <span>Create Free Account</span>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  // Filter items by status and media type
  const filteredItems = watchlist.filter((item) => {
    // 1. Status Filter
    if (statusFilter === 'watched' && item.status !== 'watched') return false;
    if (statusFilter === 'undone' && item.status === 'watched') return false;

    // 2. Type Filter
    const isAnime = isAnimeItem(item) || item.Type === 'anime';
    const isSeries = !isAnime && (item.Type === 'series' || item.Type === 'tv');

    if (typeFilter === 'movies') return !isAnime && !isSeries;
    if (typeFilter === 'series') return isSeries;
    if (typeFilter === 'anime') return isAnime;
    return true;
  });

  const handleClear = () => {
    if (window.confirm('Are you sure you want to clear your entire watchlist?')) {
      clearWatchlist();
    }
  };

  return (
    <div className="container watchlist-page animate-fade-in">
      {/* Header */}
      <div className="watchlist-header">
        <div className="watchlist-title-wrap">
          <Bookmark size={28} className="watchlist-title-icon" />
          <h1 className="page-title">My Watchlist</h1>
          <span className="watchlist-total-count">{totalCount} saved</span>
        </div>

        {totalCount > 0 && (
          <button className="clear-watchlist-btn" onClick={handleClear}>
            <Trash2 size={16} />
            <span>Clear All</span>
          </button>
        )}
      </div>

      {totalCount === 0 ? (
        <div className="watchlist-empty-state">
          <div className="empty-icon-wrap">
            <Bookmark size={48} className="empty-bookmark-icon" />
          </div>
          <h2 className="empty-heading">Your Watchlist is Empty</h2>
          <p className="empty-subtext">
            Explore blockbusters, web series, and anime. Click "Add to Watchlist" on any title to save it here and track what you've watched!
          </p>
          <Link to="/" className="explore-btn">
            <span>Explore Trending Titles</span>
            <ArrowRight size={18} />
          </Link>
        </div>
      ) : (
        <>
          {/* Watched vs Undone Status Metrics Bar */}
          <div className="watchlist-metrics-panel">
            <div className="metrics-summary-row">
              <div className="metric-box total">
                <span className="metric-num">{totalCount}</span>
                <span className="metric-label">Total in Queue</span>
              </div>
              <div className="metric-box undone">
                <span className="metric-num">{undoneCount}</span>
                <span className="metric-label">To Watch (Undone)</span>
              </div>
              <div className="metric-box watched">
                <span className="metric-num">{watchedCount}</span>
                <span className="metric-label">Watched (Done)</span>
              </div>
              <div className="metric-box progress">
                <span className="metric-num">{progressPercentage}%</span>
                <span className="metric-label">Progress</span>
              </div>
            </div>

            {/* Visual Progress Bar */}
            <div className="watchlist-progress-track">
              <div
                className="watchlist-progress-fill"
                style={{ width: `${progressPercentage}%` }}
              ></div>
            </div>
          </div>

          {/* Dual Filtering: Status Tabs & Media Type Pills */}
          <div className="watchlist-controls-bar">
            {/* Status Filter Tabs (All / Undone / Watched) */}
            <div className="status-filter-tabs">
              <button
                className={`status-tab ${statusFilter === 'all' ? 'active' : ''}`}
                onClick={() => setStatusFilter('all')}
              >
                All Titles ({totalCount})
              </button>
              <button
                className={`status-tab undone-tab ${statusFilter === 'undone' ? 'active' : ''}`}
                onClick={() => setStatusFilter('undone')}
              >
                <Clock size={15} />
                <span>To Watch ({undoneCount})</span>
              </button>
              <button
                className={`status-tab watched-tab ${statusFilter === 'watched' ? 'active' : ''}`}
                onClick={() => setStatusFilter('watched')}
              >
                <CheckCircle2 size={15} />
                <span>Watched ({watchedCount})</span>
              </button>
            </div>

            {/* Media Type Filter Pills */}
            <div className="media-filter-pills">
              <button
                className={`media-pill ${typeFilter === 'all' ? 'active' : ''}`}
                onClick={() => setTypeFilter('all')}
              >
                All
              </button>
              <button
                className={`media-pill ${typeFilter === 'movies' ? 'active' : ''}`}
                onClick={() => setTypeFilter('movies')}
              >
                <Film size={13} />
                <span>Movies</span>
              </button>
              <button
                className={`media-pill ${typeFilter === 'series' ? 'active' : ''}`}
                onClick={() => setTypeFilter('series')}
              >
                <Tv size={13} />
                <span>Series</span>
              </button>
              <button
                className={`media-pill ${typeFilter === 'anime' ? 'active' : ''}`}
                onClick={() => setTypeFilter('anime')}
              >
                <Sparkles size={13} />
                <span>Anime</span>
              </button>
            </div>
          </div>

          {/* Watchlist Movie Grid with Watch Status Controls */}
          {filteredItems.length === 0 ? (
            <div className="watchlist-filter-empty">
              <p>No titles found matching the selected filter criteria.</p>
              <button
                className="reset-filter-btn"
                onClick={() => {
                  setStatusFilter('all');
                  setTypeFilter('all');
                }}
              >
                Reset Filters
              </button>
            </div>
          ) : (
            <div className="watchlist-custom-grid">
              {filteredItems.map((movie) => {
                const isItemWatched = movie.status === 'watched';
                return (
                  <div
                    key={movie.imdbID}
                    className={`watchlist-item-card ${isItemWatched ? 'is-watched' : ''}`}
                  >
                    <div className="watchlist-card-preview">
                      <MovieCard movie={movie} />
                      {isItemWatched && (
                        <div className="watched-stamp-badge">
                          <CheckCircle2 size={16} />
                          <span>WATCHED</span>
                        </div>
                      )}
                    </div>

                    {/* Interactive Watchlist Controls */}
                    <div className="watchlist-item-actions">
                      <button
                        className={`status-toggle-btn ${isItemWatched ? 'watched' : 'undone'}`}
                        onClick={() => toggleWatchedStatus(movie.imdbID)}
                        title={isItemWatched ? 'Mark as Not Watched' : 'Mark as Watched'}
                      >
                        {isItemWatched ? (
                          <>
                            <RotateCcw size={14} />
                            <span>Mark Undone</span>
                          </>
                        ) : (
                          <>
                            <Check size={14} />
                            <span>Mark Done</span>
                          </>
                        )}
                      </button>

                      <button
                        className="remove-item-btn"
                        onClick={() => removeFromWatchlist(movie.imdbID)}
                        title="Remove from Watchlist"
                      >
                        <Trash2 size={15} />
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default Watchlist;
