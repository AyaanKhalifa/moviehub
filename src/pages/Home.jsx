import React, { useEffect, useState } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { 
  Play, 
  Bookmark, 
  BookmarkCheck, 
  Info, 
  Film, 
  Tv, 
  Sparkles, 
  Flame, 
  Star, 
  Clock, 
  Calendar,
  ChevronLeft,
  ChevronRight
} from 'lucide-react';
import { fetchCuratedCollection, CURATED_LISTS } from '../utils/api';
import MovieCard from '../components/MovieCard';
import MovieSectionRow from '../components/MovieSectionRow';
import TrailerModal from '../components/TrailerModal';
import { SkeletonHero, SkeletonGrid } from '../components/SkeletonLoader';
import { useWatchlist } from '../context/WatchlistContext';
import './Home.css';

const DEFAULT_SPOTLIGHT = [
  {
    Title: 'Dune: Part Two',
    Year: '2024',
    imdbID: 'tt15239678',
    Type: 'movie',
    Poster: 'https://m.media-amazon.com/images/M/MV5BNTc0YmQxMjEtODI5MC00NjFiLTlkMWUtOGQ5NjFmYWUyZGJhXkEyXkFqcGc@._V1_SX300.jpg',
    imdbRating: '8.5',
    Rated: 'PG-13',
    Runtime: '166 min',
    Genre: 'Action, Adventure, Drama',
    Plot: 'Paul Atreides unites with Chani and the Fremen while seeking revenge against the conspirators who destroyed his family.'
  },
  {
    Title: 'Oppenheimer',
    Year: '2023',
    imdbID: 'tt15398776',
    Type: 'movie',
    Poster: 'https://m.media-amazon.com/images/M/MV5BN2JkMDc5MGQtZjg3YS00NmFiLWIyZmQtZTJmNTM5MjVmYTQ4XkEyXkFqcGc@._V1_SX300.jpg',
    imdbRating: '8.9',
    Rated: 'R',
    Runtime: '180 min',
    Genre: 'Biography, Drama, History',
    Plot: 'The story of American scientist J. Robert Oppenheimer and his role in the development of the atomic bomb.'
  },
  {
    Title: 'Interstellar',
    Year: '2014',
    imdbID: 'tt0816692',
    Type: 'movie',
    Poster: 'https://m.media-amazon.com/images/M/MV5BYzdjMDAxZGItMjI2My00ODA1LTlkNzItOWFjMDU5ZDJlYWY3XkEyXkFqcGc@._V1_SX300.jpg',
    imdbRating: '8.7',
    Rated: 'PG-13',
    Runtime: '169 min',
    Genre: 'Adventure, Drama, Sci-Fi',
    Plot: 'When Earth becomes uninhabitable in the future, a farmer and ex-NASA pilot, Joseph Cooper, is tasked to pilot a spacecraft, along with a team of researchers, to find a new planet for humans.'
  },
  {
    Title: 'Spider-Man: Across the Spider-Verse',
    Year: '2023',
    imdbID: 'tt9362722',
    Type: 'movie',
    Poster: 'https://m.media-amazon.com/images/M/MV5BNThiZjA3MjItZGY5Ni00ZmJhLWEwN2EtOTBlYTA4Y2E0M2ZmXkEyXkFqcGc@._V1_SX300.jpg',
    imdbRating: '8.6',
    Rated: 'PG',
    Runtime: '140 min',
    Genre: 'Animation, Action, Adventure',
    Plot: 'Miles Morales catapults across the Multiverse, where he encounters a team of Spider-People charged with protecting its very existence.'
  },
  {
    Title: 'Attack on Titan',
    Year: '2013–2023',
    imdbID: 'tt2560140',
    Type: 'series',
    Poster: 'https://m.media-amazon.com/images/M/MV5BNzc5MTczNDQtNDFjNi00ZDU5LWFkNzItOTE1NzQzMzdhNzMxXkEyXkFqcGc@._V1_SX300.jpg',
    imdbRating: '9.1',
    Rated: 'TV-MA',
    Runtime: '24 min',
    Genre: 'Animation, Action, Adventure',
    Plot: 'After his hometown is destroyed and his mother is killed, young Eren Jaeger vows to cleanse the earth of the giant humanoid Titans that have brought humanity to the brink of extinction.'
  },
  {
    Title: 'Breaking Bad',
    Year: '2008–2013',
    imdbID: 'tt0903747',
    Type: 'series',
    Poster: 'https://m.media-amazon.com/images/M/MV5BMzU5ZGYzNmQtMTdhNw00NzgzLTliYTUtNWJhM2VlM2RkOTY1XkEyXkFqcGc@._V1_SX300.jpg',
    imdbRating: '9.5',
    Rated: 'TV-MA',
    Runtime: '49 min',
    Genre: 'Crime, Drama, Thriller',
    Plot: 'A chemistry teacher diagnosed with inoperable lung cancer turns to manufacturing and selling methamphetamine with a former student in order to secure his family future.'
  }
];

const Home = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const currentTab = searchParams.get('tab') || 'all';

  const [trendingMovies, setTrendingMovies] = useState([]);
  const [moviesList, setMoviesList] = useState([]);
  const [seriesList, setSeriesList] = useState([]);
  const [animeList, setAnimeList] = useState([]);
  const [spotlightList, setSpotlightList] = useState(DEFAULT_SPOTLIGHT);
  const [slideIndex, setSlideIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const [loading, setLoading] = useState(true);
  const [trailerModal, setTrailerModal] = useState({ isOpen: false, title: '', year: '' });

  const { isInWatchlist, toggleWatchlist } = useWatchlist();
  const navigate = useNavigate();

  // Load curated collections
  useEffect(() => {
    let isMounted = true;

    const loadData = async () => {
      try {
        setLoading(true);

        const [trendingData, moviesData, seriesData, animeData] = await Promise.all([
          fetchCuratedCollection(CURATED_LISTS.trending, null, true),
          fetchCuratedCollection(CURATED_LISTS.movies, 'movie', true),
          fetchCuratedCollection(CURATED_LISTS.series, 'series', true),
          fetchCuratedCollection(CURATED_LISTS.anime, null, true)
        ]);

        if (isMounted) {
          setTrendingMovies(trendingData);
          setMoviesList(moviesData);
          setSeriesList(seriesData);
          setAnimeList(animeData);

          if (trendingData.length > 0) {
            // Combine trending into spotlight list
            setSpotlightList(trendingData.slice(0, 6));
          }
        }
      } catch (err) {
        console.error('Failed to load collections:', err);
      } finally {
        if (isMounted) setLoading(false);
      }
    };

    loadData();

    return () => {
      isMounted = false;
    };
  }, []);

  // 3-Second Auto-Rotate Hero Banner with Pause on Hover
  useEffect(() => {
    if (spotlightList.length <= 1 || isPaused) return;

    const interval = setInterval(() => {
      setSlideIndex((prev) => (prev + 1) % spotlightList.length);
    }, 3000);

    return () => clearInterval(interval);
  }, [spotlightList.length, isPaused]);

  const activeHero = spotlightList[slideIndex] || DEFAULT_SPOTLIGHT[0];

  const handlePrevSlide = (e) => {
    e.stopPropagation();
    setSlideIndex((prev) => (prev - 1 + spotlightList.length) % spotlightList.length);
  };

  const handleNextSlide = (e) => {
    e.stopPropagation();
    setSlideIndex((prev) => (prev + 1) % spotlightList.length);
  };

  const handleTabChange = (tab) => {
    setSearchParams({ tab });
  };

  const openTrailer = (title, year) => {
    setTrailerModal({ isOpen: true, title, year });
  };

  const closeTrailer = () => {
    setTrailerModal({ isOpen: false, title: '', year: '' });
  };

  return (
    <div className="home-container">
      {/* Cinematic Hero Spotlight Banner with 3-Second Auto-Change & Movie Poster */}
      {loading ? (
        <SkeletonHero />
      ) : (
        <section
          className="hero-banner"
          onMouseEnter={() => setIsPaused(true)}
          onMouseLeave={() => setIsPaused(false)}
        >
          {/* Subtle Ambient Background Backdrop */}
          <div className="hero-backdrop-container">
            <img
              src={activeHero.Poster}
              alt={activeHero.Title}
              className="hero-backdrop-img"
              key={activeHero.imdbID}
            />
            <div className="hero-gradient-overlay"></div>
          </div>

          <div className="container hero-content-wrapper">
            {/* Left Column: Details & Actions */}
            <div className="hero-content animate-fade-in" key={activeHero.imdbID}>
              <div className="hero-badge-row">
                <span className="hero-spotlight-pill">
                  <Flame size={14} className="hero-flame-icon" /> Spotlight #{slideIndex + 1}
                </span>
                <span className="hero-type-pill">{activeHero.Type?.toUpperCase() || 'MOVIE'}</span>
                {activeHero.Rated && activeHero.Rated !== 'N/A' && (
                  <span className="hero-age-pill">{activeHero.Rated}</span>
                )}
              </div>

              <h1 className="hero-title">{activeHero.Title}</h1>

              <div className="hero-meta">
                {activeHero.imdbRating && activeHero.imdbRating !== 'N/A' && (
                  <div className="hero-rating">
                    <Star size={16} fill="currentColor" className="star-icon" />
                    <span>{activeHero.imdbRating}</span>
                    <span className="rating-max">/10</span>
                  </div>
                )}
                {activeHero.Runtime && activeHero.Runtime !== 'N/A' && (
                  <div className="hero-meta-item">
                    <Clock size={15} />
                    <span>{activeHero.Runtime}</span>
                  </div>
                )}
                {activeHero.Year && (
                  <div className="hero-meta-item">
                    <Calendar size={15} />
                    <span>{activeHero.Year}</span>
                  </div>
                )}
                {activeHero.Genre && (
                  <div className="hero-genres">
                    {activeHero.Genre.split(',').slice(0, 3).map((g) => (
                      <span key={g} className="hero-genre-tag">{g.trim()}</span>
                    ))}
                  </div>
                )}
              </div>

              <p className="hero-plot">{activeHero.Plot || 'Experience this critically acclaimed masterpiece.'}</p>

              <div className="hero-actions">
                <button
                  className="hero-btn hero-btn-primary"
                  onClick={() => openTrailer(activeHero.Title, activeHero.Year)}
                >
                  <Play size={18} fill="#000" />
                  <span>Watch Trailer</span>
                </button>

                <button
                  className={`hero-btn hero-btn-secondary ${isInWatchlist(activeHero.imdbID) ? 'in-watchlist' : ''}`}
                  onClick={() => {
                    const res = toggleWatchlist(activeHero);
                    if (res?.requireLogin) {
                      navigate('/login?redirect=/');
                    }
                  }}
                >
                  {isInWatchlist(activeHero.imdbID) ? (
                    <>
                      <BookmarkCheck size={18} className="btn-icon active" />
                      <span>In Watchlist</span>
                    </>
                  ) : (
                    <>
                      <Bookmark size={18} className="btn-icon" />
                      <span>Add to Watchlist</span>
                    </>
                  )}
                </button>

                <button
                  className="hero-btn hero-btn-tertiary"
                  onClick={() => navigate(`/movie/${activeHero.imdbID}`)}
                >
                  <Info size={18} />
                  <span>Details</span>
                </button>
              </div>
            </div>

            {/* Right Column: Prominent Movie Poster */}
            <div className="hero-poster-container animate-fade-in" key={`poster-${activeHero.imdbID}`}>
              <div className="hero-poster-card" onClick={() => navigate(`/movie/${activeHero.imdbID}`)}>
                <img
                  src={activeHero.Poster}
                  alt={activeHero.Title}
                  className="hero-poster-img"
                />
                <div className="hero-poster-glow"></div>
                <div className="hero-poster-overlay">
                  <span className="hero-poster-view-btn">
                    <Info size={16} /> View Details
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Navigation Controls: Previous / Next & Indicator Dots */}
          <div className="hero-carousel-controls">
            <button
              className="carousel-arrow prev"
              onClick={handlePrevSlide}
              aria-label="Previous Spotlight"
            >
              <ChevronLeft size={20} />
            </button>

            <div className="carousel-dots">
              {spotlightList.map((item, idx) => (
                <button
                  key={item.imdbID || idx}
                  className={`carousel-dot ${idx === slideIndex ? 'active' : ''}`}
                  onClick={() => setSlideIndex(idx)}
                  aria-label={`Go to slide ${idx + 1}`}
                >
                  {idx === slideIndex && <span className="carousel-dot-fill"></span>}
                </button>
              ))}
            </div>

            <button
              className="carousel-arrow next"
              onClick={handleNextSlide}
              aria-label="Next Spotlight"
            >
              <ChevronRight size={20} />
            </button>
          </div>
        </section>
      )}

      {/* Main Content Area */}
      <div className="container home-content-section">
        {/* Category Filter Tabs */}
        <div className="category-tabs-container">
          <div className="category-tabs">
            <button
              className={`category-tab ${currentTab === 'all' ? 'active' : ''}`}
              onClick={() => handleTabChange('all')}
            >
              <Flame size={18} />
              <span>All Featured</span>
            </button>
            <button
              className={`category-tab ${currentTab === 'movies' ? 'active' : ''}`}
              onClick={() => handleTabChange('movies')}
            >
              <Film size={18} />
              <span>Blockbuster Movies</span>
            </button>
            <button
              className={`category-tab ${currentTab === 'series' ? 'active' : ''}`}
              onClick={() => handleTabChange('series')}
            >
              <Tv size={18} />
              <span>Web Series</span>
            </button>
            <button
              className={`category-tab ${currentTab === 'anime' ? 'active' : ''}`}
              onClick={() => handleTabChange('anime')}
            >
              <Sparkles size={18} />
              <span>Legendary Anime</span>
            </button>
          </div>
        </div>

        {/* Shimmer Skeleton or Real Content */}
        {loading ? (
          <div className="sections-wrapper">
            <SkeletonGrid count={8} />
          </div>
        ) : (
          <div className="sections-wrapper">
            {/* TAB: ALL */}
            {currentTab === 'all' && (
              <>
                <MovieSectionRow
                  title="Trending Blockbusters"
                  icon={Flame}
                  iconClass="flame-color"
                  actionText="View All Movies"
                  onAction={() => handleTabChange('movies')}
                  items={trendingMovies}
                  defaultMode="horizontal"
                />

                <MovieSectionRow
                  title="Top-Rated Web Series"
                  icon={Tv}
                  iconClass="series-color"
                  actionText="View All Series"
                  onAction={() => handleTabChange('series')}
                  items={seriesList}
                  defaultMode="horizontal"
                />

                <MovieSectionRow
                  title="Acclaimed Anime Masterpieces"
                  icon={Sparkles}
                  iconClass="anime-color"
                  actionText="View All Anime"
                  onAction={() => handleTabChange('anime')}
                  items={animeList}
                  defaultMode="horizontal"
                />
              </>
            )}

            {/* TAB: MOVIES */}
            {currentTab === 'movies' && (
              <MovieSectionRow
                title="All-Time Greatest Movies"
                icon={Film}
                iconClass="movie-color"
                items={moviesList}
                defaultMode="grid"
              />
            )}

            {/* TAB: WEB SERIES */}
            {currentTab === 'series' && (
              <MovieSectionRow
                title="Binge-Worthy TV & Web Series"
                icon={Tv}
                iconClass="series-color"
                items={seriesList}
                defaultMode="grid"
              />
            )}

            {/* TAB: ANIME */}
            {currentTab === 'anime' && (
              <MovieSectionRow
                title="Highest-Rated Anime Series & Films"
                icon={Sparkles}
                iconClass="anime-color"
                items={animeList}
                defaultMode="grid"
              />
            )}
          </div>
        )}
      </div>

      {/* Trailer Modal */}
      <TrailerModal
        isOpen={trailerModal.isOpen}
        onClose={closeTrailer}
        title={trailerModal.title}
        year={trailerModal.year}
      />
    </div>
  );
};

export default Home;
