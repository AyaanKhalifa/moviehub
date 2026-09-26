import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Star, Bookmark, BookmarkCheck, Film, Play, Tv, Sparkles } from 'lucide-react';
import { useWatchlist } from '../context/WatchlistContext';
import { isAnimeItem } from '../utils/api';
import './MovieCard.css';

const MovieCard = ({ movie, onWatchlistChange }) => {
  const { isInWatchlist, toggleWatchlist } = useWatchlist();
  const navigate = useNavigate();
  const bookmarked = isInWatchlist(movie.imdbID);

  const isAnime = isAnimeItem(movie) || movie.Type === 'anime';
  const isSeries = !isAnime && (movie.Type === 'series' || movie.Type === 'tv');

  const handleWatchlistClick = (e) => {
    e.preventDefault();
    e.stopPropagation();
    const result = toggleWatchlist(movie);
    if (result?.requireLogin) {
      navigate(`/login?redirect=${encodeURIComponent(window.location.pathname + window.location.search)}`);
      return;
    }
    if (onWatchlistChange) onWatchlistChange();
  };

  const getBadgeInfo = () => {
    if (isAnime) return { label: 'Anime', className: 'badge-anime', icon: Sparkles };
    if (isSeries) return { label: 'Web Series', className: 'badge-series', icon: Tv };
    return { label: 'Movie', className: 'badge-movie', icon: Film };
  };

  const badge = getBadgeInfo();
  const BadgeIcon = badge.icon;

  return (
    <div className="movie-card-wrapper animate-fade-in">
      <Link to={`/movie/${movie.imdbID}`} className="movie-card">
        <div className="card-image-container">
          {movie.Poster && movie.Poster !== 'N/A' ? (
            <img
              src={movie.Poster}
              alt={movie.Title}
              className="card-image"
              loading="lazy"
              onError={(e) => {
                e.currentTarget.style.display = 'none';
                e.currentTarget.nextElementSibling?.classList.remove('hidden');
              }}
            />
          ) : null}

          <div className={`card-image-placeholder ${movie.Poster && movie.Poster !== 'N/A' ? 'hidden' : ''}`}>
            <Film size={36} className="placeholder-icon" />
            <span>No Poster</span>
          </div>

          <div className="card-overlay">
            <span className="card-play-btn">
              <Play size={20} fill="#000" color="#000" />
            </span>
          </div>

          {/* Type Badge */}
          <div className={`card-type-badge ${badge.className}`}>
            <BadgeIcon size={12} />
            <span>{badge.label}</span>
          </div>

          {/* Rating Badge */}
          {movie.imdbRating && movie.imdbRating !== 'N/A' && (
            <div className="card-rating-badge">
              <Star size={12} className="star-icon" fill="currentColor" />
              <span>{movie.imdbRating}</span>
            </div>
          )}

          {/* Watchlist Bookmark Button */}
          <button
            type="button"
            className={`card-watchlist-btn ${bookmarked ? 'active' : ''}`}
            onClick={handleWatchlistClick}
            title={bookmarked ? 'Remove from Watchlist' : 'Add to Watchlist'}
            aria-label={bookmarked ? 'Remove from Watchlist' : 'Add to Watchlist'}
          >
            {bookmarked ? (
              <BookmarkCheck size={18} className="bookmark-icon active" />
            ) : (
              <Bookmark size={18} className="bookmark-icon" />
            )}
          </button>
        </div>

        <div className="card-content">
          <h3 className="card-title" title={movie.Title}>
            {movie.Title}
          </h3>
          <div className="card-meta">
            <span className="card-year">{movie.Year || 'N/A'}</span>
            {movie.Genre && (
              <span className="card-genre" title={movie.Genre}>
                {movie.Genre.split(',')[0]}
              </span>
            )}
          </div>
        </div>
      </Link>
    </div>
  );
};

export default MovieCard;
