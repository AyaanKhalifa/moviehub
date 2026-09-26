import React, { useEffect, useState } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { Search as SearchIcon, Film, Tv, Sparkles, Filter } from 'lucide-react';
import { searchMovies, isAnimeItem } from '../utils/api';
import { addRecentSearch, getRecentSearches } from '../utils/recentSearches';
import { Clock } from 'lucide-react';
import MovieCard from '../components/MovieCard';
import './Search.css';

const Search = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const query = searchParams.get('q') || '';
  const filter = searchParams.get('type') || 'all';

  const [movies, setMovies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    let isMounted = true;

    const fetchResults = async () => {
      if (!query.trim()) {
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        setError(null);
        addRecentSearch(query.trim());

        // Fetch up to 2 pages to provide abundant results
        const [page1, page2] = await Promise.all([
          searchMovies(query, 1),
          searchMovies(query, 2).catch(() => ({ Response: 'False' }))
        ]);

        let combined = [];
        if (page1.Response === 'True' && page1.Search) {
          combined = [...page1.Search];
        }
        if (page2.Response === 'True' && page2.Search) {
          combined = [...combined, ...page2.Search];
        }

        // Deduplicate
        const unique = Array.from(new Map(combined.map((m) => [m.imdbID, m])).values());

        if (isMounted) {
          if (unique.length > 0) {
            setMovies(unique);
          } else {
            setError(page1.Error || 'No results found matching your search.');
            setMovies([]);
          }
        }
      } catch (err) {
        if (isMounted) {
          setError('Failed to fetch search results. Please check your connection.');
          setMovies([]);
        }
      } finally {
        if (isMounted) setLoading(false);
      }
    };

    fetchResults();

    return () => {
      isMounted = false;
    };
  }, [query]);

  const handleFilterChange = (newFilter) => {
    setSearchParams({ q: query, type: newFilter });
  };

  const filteredMovies = movies.filter((movie) => {
    const isAnime = isAnimeItem(movie) || movie.Type === 'anime';
    const isSeries = !isAnime && (movie.Type === 'series' || movie.Type === 'tv');

    if (filter === 'movies') return !isAnime && !isSeries;
    if (filter === 'series') return isSeries;
    if (filter === 'anime') return isAnime;
    return true;
  });

  const suggestions = [
    'Oppenheimer',
    'Stranger Things',
    'Attack on Titan',
    'The Dark Knight',
    'Demon Slayer',
    'Breaking Bad',
    'Interstellar'
  ];

  const recentList = getRecentSearches();

  if (!query.trim()) {
    return (
      <div className="container search-empty-container">
        <SearchIcon size={48} className="search-empty-icon" />
        <h2>Search for Movies, Series & Anime</h2>
        <p className="search-empty-sub">Type in a title above or click any popular term below:</p>

        {recentList.length > 0 && (
          <div className="search-recent-section">
            <div className="recent-section-label">
              <Clock size={15} />
              <span>Recent Searches</span>
            </div>
            <div className="suggested-chips recent-chips">
              {recentList.map((term) => (
                <button
                  key={term}
                  className="suggested-chip recent-chip"
                  onClick={() => navigate(`/search?q=${encodeURIComponent(term)}`)}
                >
                  <Clock size={12} />
                  <span>{term}</span>
                </button>
              ))}
            </div>
          </div>
        )}

        <div className="search-popular-label">Popular Searches</div>
        <div className="suggested-chips">
          {suggestions.map((s) => (
            <button
              key={s}
              className="suggested-chip"
              onClick={() => navigate(`/search?q=${encodeURIComponent(s)}`)}
            >
              {s}
            </button>
          ))}
        </div>
      </div>
    );
  }

  const category = searchParams.get('category');

  return (
    <div className="container search-results-page animate-fade-in">
      <div className="search-page-header">
        <div>
          <h1 className="page-title">
            {category ? (
              <>
                <span className="search-cat-pill">{category}</span> Results
              </>
            ) : (
              <>Results for <span className="highlight-query">"{query}"</span></>
            )}
          </h1>
          {!loading && movies.length > 0 && (
            <p className="search-count-label">
              Found {filteredMovies.length} matching titles
            </p>
          )}
        </div>

        {/* Filter Pills */}
        {movies.length > 0 && (
          <div className="search-type-filters">
            <button
              className={`search-filter-btn ${filter === 'all' ? 'active' : ''}`}
              onClick={() => handleFilterChange('all')}
            >
              All Types
            </button>
            <button
              className={`search-filter-btn ${filter === 'movies' ? 'active' : ''}`}
              onClick={() => handleFilterChange('movies')}
            >
              <Film size={14} /> Movies
            </button>
            <button
              className={`search-filter-btn ${filter === 'series' ? 'active' : ''}`}
              onClick={() => handleFilterChange('series')}
            >
              <Tv size={14} /> Web Series
            </button>
            <button
              className={`search-filter-btn ${filter === 'anime' ? 'active' : ''}`}
              onClick={() => handleFilterChange('anime')}
            >
              <Sparkles size={14} /> Anime
            </button>
          </div>
        )}
      </div>

      {loading ? (
        <div className="loader-container">
          <div className="spinner"></div>
          <p className="loading-text">Searching verified database for "{query}"...</p>
        </div>
      ) : error || filteredMovies.length === 0 ? (
        <div className="search-empty-container">
          <h2>No matching titles found</h2>
          <p className="search-empty-sub">
            {error || `We couldn't find any results under "${filter}" for "${query}".`}
          </p>
          <div className="suggested-chips">
            <span className="chips-label">Popular searches:</span>
            {suggestions.map((s) => (
              <button
                key={s}
                className="suggested-chip"
                onClick={() => navigate(`/search?q=${encodeURIComponent(s)}`)}
              >
                {s}
              </button>
            ))}
          </div>
        </div>
      ) : (
        <div className="grid">
          {filteredMovies.map((movie) => (
            <MovieCard key={movie.imdbID} movie={movie} />
          ))}
        </div>
      )}
    </div>
  );
};

export default Search;
