import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { 
  ArrowLeft, 
  Star, 
  Clock, 
  Calendar, 
  Play, 
  Bookmark, 
  BookmarkCheck, 
  Share2, 
  Award, 
  Check, 
  Film, 
  Tv, 
  Sparkles, 
  DollarSign, 
  Globe 
} from 'lucide-react';
import { getMovieDetails, getRelatedTitles, isAnimeItem, getSeriesSeasonPosters, getMovieCast } from '../utils/api';
import { getSeasonData } from '../utils/seriesData';
import { useWatchlist } from '../context/WatchlistContext';
import MovieCard from '../components/MovieCard';
import MovieSectionRow from '../components/MovieSectionRow';
import TrailerModal from '../components/TrailerModal';
import EpisodeGuide from '../components/EpisodeGuide';
import PosterGallery from '../components/PosterGallery';
import CastSection from '../components/CastSection';
import './MovieDetails.css';

import { SkeletonDetails } from '../components/SkeletonLoader';

const MovieDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { isInWatchlist, toggleWatchlist } = useWatchlist();

  const [movie, setMovie] = useState(null);
  const [related, setRelated] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [copied, setCopied] = useState(false);
  const [trailerOpen, setTrailerOpen] = useState(false);
  const [activeTrailerTitle, setActiveTrailerTitle] = useState('');
  const [activeTrailerId, setActiveTrailerId] = useState(null);
  const [selectedSeason, setSelectedSeason] = useState(1);
  const [seasonPostersMap, setSeasonPostersMap] = useState({});
  const [cast, setCast] = useState([]);
  const [castLoading, setCastLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;

    const fetchDetails = async () => {
      try {
        setLoading(true);
        setError(null);
        setSelectedSeason(1);
        setActiveTrailerId(null);
        setSeasonPostersMap({});
        setCast([]);
        setCastLoading(true);
        window.scrollTo({ top: 0, behavior: 'smooth' });

        const data = await getMovieDetails(id);
        
        if (data.Response === 'True') {
          if (isMounted) {
            setMovie(data);

            // Fetch rich IMDb-style cast (headshots + character names)
            getMovieCast(data.imdbID, data).then((castData) => {
              if (isMounted) {
                setCast(castData);
                setCastLoading(false);
              }
            });

            // If series, fetch official season posters dynamically from TVMaze
            const isSeriesCheck = data.Type === 'series' || data.Type === 'tv' || Boolean(data.totalSeasons);
            if (isSeriesCheck) {
              getSeriesSeasonPosters(data.imdbID, data.Title).then((posters) => {
                if (isMounted && posters && Object.keys(posters).length > 0) {
                  setSeasonPostersMap(posters);
                }
              });
            }
            // Fetch real related titles based on title and genre
            const relatedData = await getRelatedTitles(data.Title, data.Genre);
            if (isMounted) setRelated(relatedData);
          }
        } else {
          if (isMounted) setError(data.Error || 'Title not found');
        }
      } catch (err) {
        if (isMounted) setError('Failed to fetch title details. Please try again.');
      } finally {
        if (isMounted) setLoading(false);
      }
    };

    fetchDetails();

    return () => {
      isMounted = false;
    };
  }, [id]);

  const handleShare = () => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(window.location.href);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  if (loading) {
    return <SkeletonDetails />;
  }

  if (error || !movie) {
    return (
      <div className="container error-page-wrapper">
        <div className="error-message">{error || 'Movie not found'}</div>
        <button onClick={() => navigate(-1)} className="back-btn">
          <ArrowLeft size={20} /> Back
        </button>
      </div>
    );
  }

  const isAnime = isAnimeItem(movie) || movie.Type === 'anime';
  const isSeries = !isAnime && (movie.Type === 'series' || movie.Type === 'tv');
  const hasSeasons = Boolean(isSeries || movie.Type === 'series' || movie.totalSeasons);
  const totalSeasons = Math.max(1, parseInt(movie.totalSeasons, 10) || 1);

  // Retrieve official season data (dynamic season poster from TVMaze, or curated data)
  const seasonData = hasSeasons ? getSeasonData(movie.Title, selectedSeason, movie.Poster) : null;
  const dynamicSeasonPoster = seasonPostersMap[selectedSeason];
  const currentPoster = dynamicSeasonPoster || seasonData?.poster || movie.Poster;
  const currentSeasonTrailerId = seasonData?.trailerId || null;

  const bookmarked = isInWatchlist(movie.imdbID);

  // Extract Rotten Tomatoes rating if present
  const rottenTomatoes = movie.Ratings?.find((r) => r.Source === 'Rotten Tomatoes')?.Value;

  const openTrailerFor = (customTitle, directTrailerId = null) => {
    setActiveTrailerTitle(customTitle || movie.Title);
    setActiveTrailerId(directTrailerId);
    setTrailerOpen(true);
  };

  return (
    <div className="movie-details-container animate-fade-in">
      {/* Background Backdrop with Gradient Overlay */}
      <div className="movie-backdrop">
        <div className="backdrop-overlay"></div>
        {currentPoster !== 'N/A' && (
          <img src={currentPoster} alt="Backdrop" className="backdrop-img" />
        )}
      </div>

      <div className="container movie-content">
        {/* Top Navigation Row */}
        <div className="details-top-bar">
          <button onClick={() => navigate(-1)} className="back-btn">
            <ArrowLeft size={18} /> Back
          </button>

          <div className="details-quick-actions">
            <button
              className={`action-pill-btn ${bookmarked ? 'active' : ''}`}
              onClick={() => {
                const res = toggleWatchlist(movie);
                if (res?.requireLogin) {
                  navigate(`/login?redirect=${encodeURIComponent(window.location.pathname)}`);
                }
              }}
            >
              {bookmarked ? (
                <>
                  <BookmarkCheck size={18} className="star-icon" />
                  <span>In Watchlist</span>
                </>
              ) : (
                <>
                  <Bookmark size={18} />
                  <span>Add to Watchlist</span>
                </>
              )}
            </button>

            <button className="action-pill-btn" onClick={handleShare}>
              {copied ? <Check size={18} className="check-icon" /> : <Share2 size={18} />}
              <span>{copied ? 'Link Copied!' : 'Share'}</span>
            </button>
          </div>
        </div>

        {/* Hero Details Grid */}
        <div className="details-grid">
          {/* Poster Section with Strictly Official Poster Display / Gallery */}
          <div className="poster-section">
            <PosterGallery
              movie={movie}
              seasonPoster={currentPoster}
              seasonLabel={hasSeasons && totalSeasons > 1 ? `Season ${selectedSeason} Official Poster` : null}
              allSeasonPosters={seasonPostersMap}
              selectedSeason={selectedSeason}
              onSelectSeason={(s) => setSelectedSeason(s)}
            />

            {/* Trailer Action Buttons */}
            <div className="trailer-action-group">
              <button
                className="trailer-trigger-btn primary-season-btn"
                onClick={() =>
                  openTrailerFor(
                    hasSeasons && totalSeasons > 1
                      ? `${movie.Title} Season ${selectedSeason}`
                      : movie.Title,
                    currentSeasonTrailerId
                  )
                }
              >
                <Play size={18} fill="#000" />
                <span>
                  {hasSeasons && totalSeasons > 1
                    ? `Watch Season ${selectedSeason} Trailer`
                    : 'Watch Official Trailer'}
                </span>
              </button>

              {hasSeasons && totalSeasons > 1 && (
                <button
                  className="trailer-trigger-btn secondary-series-btn"
                  onClick={() => openTrailerFor(movie.Title, null)}
                >
                  <Film size={16} />
                  <span>Series Main Trailer</span>
                </button>
              )}
            </div>
          </div>

          {/* Info Section */}
          <div className="info-section">
            <div className="title-header-row">
              <h1 className="movie-title">{movie.Title}</h1>
            </div>

            {/* Web Series Season Selector at the top */}
            {hasSeasons && totalSeasons > 1 && (
              <div className="series-season-card">
                <div className="season-card-header">
                  <div className="season-card-label-wrap">
                    <Tv size={18} className="season-card-tv-icon" />
                    <span className="season-card-title">Choose Season</span>
                  </div>
                  <span className="season-indicator-pill">
                    Viewing Season {selectedSeason} of {totalSeasons}
                  </span>
                </div>

                <div className="season-pills-selector">
                  {Array.from({ length: totalSeasons }, (_, i) => i + 1).map((s) => (
                    <button
                      key={s}
                      type="button"
                      className={`season-select-pill ${selectedSeason === s ? 'active' : ''}`}
                      onClick={() => setSelectedSeason(s)}
                    >
                      <span>Season {s}</span>
                      {selectedSeason === s && <span className="active-dot"></span>}
                    </button>
                  ))}
                </div>

                {seasonData?.tagline && (
                  <div className="season-tagline-quote">
                    "{seasonData.tagline}"
                  </div>
                )}
              </div>
            )}

            {/* Meta Stats Badges (IMDb, Rotten Tomatoes, Runtime, Year, Age Rating) */}
            <div className="movie-meta-stats">
              {movie.imdbRating && movie.imdbRating !== 'N/A' && (
                <div className="stat-card imdb-card">
                  <Star className="stat-icon imdb-star" fill="currentColor" />
                  <div className="stat-text-wrap">
                    <span className="stat-main">{movie.imdbRating}<span>/10</span></span>
                    <span className="stat-sub">{movie.imdbVotes ? `${movie.imdbVotes} votes` : 'IMDb'}</span>
                  </div>
                </div>
              )}

              {rottenTomatoes && (
                <div className="stat-card rt-card">
                  <span className="rt-badge">🍅</span>
                  <div className="stat-text-wrap">
                    <span className="stat-main">{rottenTomatoes}</span>
                    <span className="stat-sub">Rotten Tomatoes</span>
                  </div>
                </div>
              )}

              {movie.Runtime && movie.Runtime !== 'N/A' && (
                <div className="stat-card">
                  <Clock className="stat-icon" />
                  <div className="stat-text-wrap">
                    <span className="stat-main">{movie.Runtime}</span>
                    <span className="stat-sub">Duration</span>
                  </div>
                </div>
              )}

              {movie.Released && movie.Released !== 'N/A' && (
                <div className="stat-card">
                  <Calendar className="stat-icon" />
                  <div className="stat-text-wrap">
                    <span className="stat-main">{movie.Released}</span>
                    <span className="stat-sub">Release Date</span>
                  </div>
                </div>
              )}

              {movie.Rated && movie.Rated !== 'N/A' && (
                <div className="stat-card rating-badge-card">
                  <span className="rating-badge-large">{movie.Rated}</span>
                </div>
              )}
            </div>

            {/* Genres */}
            {movie.Genre && movie.Genre !== 'N/A' && (
              <div className="movie-genres">
                {movie.Genre.split(',').map((genre) => (
                  <span key={genre} className="genre-tag">
                    {genre.trim()}
                  </span>
                ))}
              </div>
            )}

            {/* Plot */}
            <div className="plot-section">
              <h3 className="section-subtitle">Storyline</h3>
              <p className="plot-text">{movie.Plot && movie.Plot !== 'N/A' ? movie.Plot : 'No detailed plot synopsis provided.'}</p>
            </div>

            {/* Awards & Recognition */}
            {movie.Awards && movie.Awards !== 'N/A' && (
              <div className="awards-banner">
                <Award size={24} className="award-icon" />
                <div className="award-content">
                  <span className="award-title">Awards & Honors</span>
                  <span className="award-desc">{movie.Awards}</span>
                </div>
              </div>
            )}

            {/* Cast & Crew Detailed Cards */}
            <div className="cast-crew-container">
              {movie.Director && movie.Director !== 'N/A' && (
                <div className="crew-row">
                  <span className="crew-label">Director</span>
                  <span className="crew-value">{movie.Director}</span>
                </div>
              )}
              {movie.Writer && movie.Writer !== 'N/A' && (
                <div className="crew-row">
                  <span className="crew-label">Writers</span>
                  <span className="crew-value">{movie.Writer}</span>
                </div>
              )}
              {movie.Actors && movie.Actors !== 'N/A' && (
                <div className="crew-row">
                  <span className="crew-label">Top Cast</span>
                  <div className="cast-pill-list">
                    {movie.Actors.split(',').map((actor) => (
                      <span key={actor} className="cast-pill">{actor.trim()}</span>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Additional Production Metadata */}
            <div className="metadata-grid">
              {movie.BoxOffice && movie.BoxOffice !== 'N/A' && (
                <div className="meta-info-box">
                  <span className="info-box-label">Box Office</span>
                  <span className="info-box-val">{movie.BoxOffice}</span>
                </div>
              )}
              {movie.Country && movie.Country !== 'N/A' && (
                <div className="meta-info-box">
                  <span className="info-box-label">Country</span>
                  <span className="info-box-val">{movie.Country}</span>
                </div>
              )}
              {movie.Language && movie.Language !== 'N/A' && (
                <div className="meta-info-box">
                  <span className="info-box-label">Language</span>
                  <span className="info-box-val">{movie.Language}</span>
                </div>
              )}
              {movie.Production && movie.Production !== 'N/A' && (
                <div className="meta-info-box">
                  <span className="info-box-label">Production</span>
                  <span className="info-box-val">{movie.Production}</span>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* IMDb-Style Top Cast Section (Portraits, Real Names, Character Roles, Film Name & Modal) */}
        <CastSection
          cast={cast}
          isLoading={castLoading}
          currentMovieTitle={movie.Title}
          currentMovieYear={movie.Year}
        />

        {/* Episode Guide for Web Series & TV Shows */}
        {hasSeasons && (
          <EpisodeGuide
            imdbID={movie.imdbID}
            seriesTitle={movie.Title}
            totalSeasons={totalSeasons}
            selectedSeason={selectedSeason}
            onSeasonChange={(s) => setSelectedSeason(s)}
            onPlayTrailer={(trailerQuery, directId = null) => openTrailerFor(trailerQuery, directId)}
          />
        )}

        {/* More Like This (Related Titles) with Horizontal & Vertical Scrolling */}
        {related.length > 0 && (
          <div className="related-section-wrapper">
            <MovieSectionRow
              title="More Like This"
              icon={Film}
              iconClass="movie-color"
              items={related}
              defaultMode="horizontal"
            />
          </div>
        )}
      </div>

      {/* Trailer Modal */}
      <TrailerModal
        isOpen={trailerOpen}
        onClose={() => setTrailerOpen(false)}
        title={activeTrailerTitle || movie.Title}
        year={movie.Year}
        trailerId={activeTrailerId}
      />
    </div>
  );
};

export default MovieDetails;
