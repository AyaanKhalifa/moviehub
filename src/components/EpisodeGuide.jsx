import React, { useState, useEffect } from 'react';
import { Star, Calendar, Tv, Loader2, Play, ChevronDown } from 'lucide-react';
import { getSeasonEpisodes, getSeriesEpisodeStills } from '../utils/api';
import { getSeasonData } from '../utils/seriesData';
import './EpisodeGuide.css';

const EpisodeGuide = ({
  imdbID,
  seriesTitle,
  totalSeasons = 1,
  selectedSeason: propSelectedSeason,
  onSeasonChange,
  onPlayTrailer
}) => {
  const seasonsCount = Math.max(1, parseInt(totalSeasons, 10) || 1);
  const [internalSeason, setInternalSeason] = useState(1);

  // Controlled or uncontrolled season state
  const currentSeason = propSelectedSeason !== undefined ? propSelectedSeason : internalSeason;

  const handleSeasonSelect = (newSeason) => {
    const s = Number(newSeason);
    if (onSeasonChange) {
      onSeasonChange(s);
    } else {
      setInternalSeason(s);
    }
  };

  const [episodes, setEpisodes] = useState([]);
  const [stillsMap, setStillsMap] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let isMounted = true;

    const fetchEpisodes = async () => {
      try {
        setLoading(true);
        setError(null);
        setStillsMap({});

        // Concurrently fetch episodes from OMDb and HD scene stills from TVMaze (using Premium API key)
        const [omdbData, tvmazeStills] = await Promise.all([
          getSeasonEpisodes(imdbID, currentSeason).catch(() => ({ Response: 'False' })),
          getSeriesEpisodeStills(imdbID, currentSeason).catch(() => ({}))
        ]);

        if (isMounted) {
          if (tvmazeStills && Object.keys(tvmazeStills).length > 0) {
            setStillsMap(tvmazeStills);
          }

          if (omdbData.Response === 'True' && Array.isArray(omdbData.Episodes)) {
            setEpisodes(omdbData.Episodes);
          } else if (tvmazeStills && Object.keys(tvmazeStills).length > 0) {
            // TVMaze fallback if OMDb has no episode data
            const tvmazeEps = Object.entries(tvmazeStills).map(([num, ep]) => ({
              Episode: num,
              Title: ep.name || `Episode ${num}`,
              imdbRating: ep.rating ? String(ep.rating) : 'N/A',
              Plot: ep.summary || ''
            }));
            setEpisodes(tvmazeEps);
          } else {
            setError(omdbData.Error || 'No episode details found for this season.');
            setEpisodes([]);
          }
        }
      } catch {
        if (isMounted) {
          setError('Failed to fetch season episodes.');
          setEpisodes([]);
        }
      } finally {
        if (isMounted) setLoading(false);
      }
    };

    fetchEpisodes();

    return () => {
      isMounted = false;
    };
  }, [imdbID, currentSeason]);

  const seasonsList = Array.from({ length: seasonsCount }, (_, i) => i + 1);

  return (
    <div className="episode-guide-container animate-fade-in">
      <div className="episode-guide-header">
        <div className="episode-guide-title-wrap">
          <Tv size={22} className="guide-tv-icon" />
          <h2 className="episode-guide-title">Episodes Guide</h2>
        </div>

        {/* Season Selector Dropdown & Quick Season Trailer Button */}
        <div className="season-selector-actions">
          {onPlayTrailer && (
            <button
              type="button"
              className="season-trailer-quick-btn"
              onClick={() => {
                const seasonInfo = getSeasonData(seriesTitle, currentSeason);
                onPlayTrailer(`${seriesTitle} Season ${currentSeason}`, seasonInfo?.trailerId || null);
              }}
              title={`Watch Official Season ${currentSeason} Trailer`}
            >
              <Play size={13} fill="currentColor" />
              <span>Season {currentSeason} Trailer</span>
            </button>
          )}

          <div className="season-selector-wrap">
            <label className="season-select-label" htmlFor="season-select">Season:</label>
            <div className="season-select-custom">
              <select
                id="season-select"
                value={currentSeason}
                onChange={(e) => handleSeasonSelect(e.target.value)}
                className="season-dropdown"
              >
                {seasonsList.map((s) => (
                  <option key={s} value={s}>
                    Season {s}
                  </option>
                ))}
              </select>
              <ChevronDown size={16} className="select-arrow" />
            </div>
          </div>
        </div>
      </div>

      {/* Season Fast Pills - Touch swipeable on mobile */}
      {seasonsCount > 1 && (
        <div className="season-pills-bar">
          {seasonsList.map((s) => (
            <button
              key={s}
              type="button"
              className={`season-pill-btn ${currentSeason === s ? 'active' : ''}`}
              onClick={() => handleSeasonSelect(s)}
            >
              Season {s}
            </button>
          ))}
        </div>
      )}

      {/* Episodes List */}
      {loading ? (
        <div className="episode-loader">
          <Loader2 size={28} className="spinner" />
          <span>Loading Season {currentSeason} Episodes & HD Stills...</span>
        </div>
      ) : error || episodes.length === 0 ? (
        <div className="episode-empty-state">
          <p>{error || 'No episodes found for this season.'}</p>
        </div>
      ) : (
        <div className="episodes-list">
          {episodes.map((ep) => {
            const still = stillsMap[ep.Episode];
            const epRating = ep.imdbRating && ep.imdbRating !== 'N/A' ? ep.imdbRating : still?.rating;
            const epPlot = still?.summary || (ep.Plot && ep.Plot !== 'N/A' ? ep.Plot : null);
            const epTitle = ep.Title || still?.name || `Episode ${ep.Episode}`;

            return (
              <div key={ep.imdbID || ep.Episode} className="episode-card">
                {/* 16:9 Scene Still / Screenshot from TVMaze */}
                <div className="episode-still-wrap">
                  {still?.image ? (
                    <img
                      src={still.image}
                      alt={epTitle}
                      className="episode-still-img"
                      loading="lazy"
                    />
                  ) : (
                    <div className="episode-still-fallback">
                      <Tv size={26} className="still-fallback-icon" />
                    </div>
                  )}
                  <div className="episode-still-badge">
                    <span className="ep-prefix">EP</span>
                    <span className="ep-num">{String(ep.Episode).padStart(2, '0')}</span>
                  </div>
                </div>

                <div className="episode-details">
                  <div className="episode-header-row">
                    <h3 className="episode-title">{epTitle}</h3>
                    {epRating && (
                      <div className="episode-rating-badge">
                        <Star size={13} fill="currentColor" className="star-icon" />
                        <span>{epRating}</span>
                      </div>
                    )}
                  </div>

                  <div className="episode-meta-row">
                    {ep.Released && ep.Released !== 'N/A' && (
                      <div className="episode-meta-item">
                        <Calendar size={13} />
                        <span>Aired: {ep.Released}</span>
                      </div>
                    )}
                  </div>

                  {epPlot && <p className="episode-plot">{epPlot}</p>}
                </div>

                <div className="episode-action">
                  <button
                    className="episode-trailer-btn"
                    onClick={() =>
                      onPlayTrailer &&
                      onPlayTrailer(`${seriesTitle} Season ${currentSeason} Episode ${ep.Episode}`, null)
                    }
                    title="Watch Episode Teaser / Preview"
                  >
                    <Play size={15} fill="currentColor" />
                    <span>Preview</span>
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default EpisodeGuide;
