import React, { useState, useEffect, useRef } from 'react';
import { ChevronLeft, ChevronRight, Pause, Film, Image } from 'lucide-react';
import { getMoviePosters } from '../utils/posters';
import './PosterGallery.css';

const PosterGallery = ({
  movie,
  seasonPoster,
  seasonLabel,
  allSeasonPosters = {},
  selectedSeason = 1,
  onSelectSeason
}) => {
  const [posters, setPosters] = useState([]);
  const [activeIndex, setActiveIndex] = useState(0);
  const [isAutoScroll, setIsAutoScroll] = useState(true);
  const [isHovered, setIsHovered] = useState(false);
  const [imageErrors, setImageErrors] = useState({});
  const stripRef = useRef(null);

  // Strictly show ONLY official posters for the current movie or chosen season
  useEffect(() => {
    if (!movie) return;

    // Reset any image errors when movie/season changes
    setImageErrors({});

    // If a specific season poster is selected (for web series / TV shows)
    if (seasonPoster && seasonPoster !== 'N/A') {
      const list = [];
      const seenUrls = new Set();

      // Current season poster first
      list.push({
        url: seasonPoster,
        label: seasonLabel || `Season ${selectedSeason} Official Poster`,
        season: selectedSeason
      });
      seenUrls.add(seasonPoster);

      // Other seasons posters if available
      if (allSeasonPosters && Object.keys(allSeasonPosters).length > 0) {
        Object.entries(allSeasonPosters)
          .sort(([a], [b]) => Number(a) - Number(b))
          .forEach(([sNum, sUrl]) => {
            if (sUrl && !seenUrls.has(sUrl)) {
              list.push({
                url: sUrl,
                label: `Season ${sNum} Official Poster`,
                season: Number(sNum)
              });
              seenUrls.add(sUrl);
            }
          });
      }

      // If series has a main key art poster different from season posters, include it
      if (movie.Poster && movie.Poster !== 'N/A' && !seenUrls.has(movie.Poster)) {
        list.push({
          url: movie.Poster,
          label: 'Series Key Artwork'
        });
      }

      setPosters(list);
      setActiveIndex(0);
      return;
    }

    // Otherwise, retrieve strictly official curated posters for this title
    const curated = getMoviePosters(movie);
    let list = [...curated];

    // If no curated alternate posters exist, use only the movie's own official poster
    if (list.length === 0 && movie.Poster && movie.Poster !== 'N/A') {
      list = [{ url: movie.Poster, label: 'Official Theatrical Poster' }];
    }

    // Filter out invalid or N/A posters
    list = list.filter((p) => p && p.url && p.url !== 'N/A');

    setPosters(list);
    setActiveIndex(0);
  }, [movie, seasonPoster, seasonLabel, allSeasonPosters, selectedSeason]);

  // Auto-scroll every 3 seconds only if multiple official posters exist
  useEffect(() => {
    if (!isAutoScroll || isHovered || posters.length <= 1) return;

    const interval = setInterval(() => {
      setActiveIndex((prev) => (prev + 1) % posters.length);
    }, 3000);

    return () => clearInterval(interval);
  }, [isAutoScroll, isHovered, posters.length]);

  // Smooth scroll thumbnail strip when active index changes (scrolls inner container ONLY, never the window)
  useEffect(() => {
    if (!stripRef.current) return;
    const container = stripRef.current;
    const activeThumb = container.children[activeIndex];
    if (activeThumb) {
      const scrollLeft =
        activeThumb.offsetLeft - container.offsetWidth / 2 + activeThumb.offsetWidth / 2;
      container.scrollTo({
        left: Math.max(0, scrollLeft),
        behavior: 'smooth'
      });
    }
  }, [activeIndex]);

  if (posters.length === 0) {
    return (
      <div className="poster-gallery-placeholder">
        <Film size={48} />
        <span>No Official Poster Available</span>
      </div>
    );
  }

  const currentPoster = posters[activeIndex] || posters[0];
  const isBroken = imageErrors[currentPoster.url];

  const handlePrev = (e) => {
    e.stopPropagation();
    const nextIdx = (activeIndex - 1 + posters.length) % posters.length;
    handleSelectPoster(nextIdx);
  };

  const handleNext = (e) => {
    e.stopPropagation();
    const nextIdx = (activeIndex + 1) % posters.length;
    handleSelectPoster(nextIdx);
  };

  const handleSelectPoster = (idx) => {
    setActiveIndex(idx);
    const target = posters[idx];
    if (target?.season && target.season !== selectedSeason && onSelectSeason) {
      onSelectSeason(target.season);
    }
  };

  const handleImageError = (url) => {
    setImageErrors((prev) => ({ ...prev, [url]: true }));
  };

  return (
    <div
      className="poster-gallery-wrapper"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Main Active Official Poster Display */}
      <div className="poster-gallery-main">
        {isBroken ? (
          <div className="poster-gallery-placeholder">
            <Film size={48} />
            <span>{currentPoster.label || 'Official Artwork'}</span>
          </div>
        ) : (
          <img
            src={currentPoster.url}
            alt={currentPoster.label || movie.Title}
            className="poster-main-image animate-fade-in"
            key={currentPoster.url + activeIndex}
            onError={() => handleImageError(currentPoster.url)}
            loading="eager"
          />
        )}

        {/* Auto-Scroll Status Badge (Only shown if more than 1 official poster) */}
        {posters.length > 1 && (
          <button
            type="button"
            className={`poster-autoscroll-badge ${isAutoScroll && !isHovered ? 'active' : ''}`}
            onClick={() => setIsAutoScroll(!isAutoScroll)}
            title={isAutoScroll ? 'Auto-scrolling every 3s (Click to pause)' : 'Paused (Click to auto-scroll)'}
          >
            {isAutoScroll && !isHovered ? (
              <>
                <span className="pulse-dot"></span>
                <span>Auto-Scroll (3s)</span>
              </>
            ) : (
              <>
                <Pause size={11} />
                <span>Paused</span>
              </>
            )}
          </button>
        )}

        {/* Official Poster Label Tag */}
        {currentPoster.label && (
          <div className="poster-label-tag">
            <Image size={12} />
            <span>{currentPoster.label}</span>
          </div>
        )}

        {/* Arrow Controls */}
        {posters.length > 1 && (
          <>
            <button
              className="gallery-nav-arrow left"
              onClick={handlePrev}
              aria-label="Previous official poster"
            >
              <ChevronLeft size={18} />
            </button>
            <button
              className="gallery-nav-arrow right"
              onClick={handleNext}
              aria-label="Next official poster"
            >
              <ChevronRight size={18} />
            </button>
          </>
        )}
      </div>

      {/* Auto-Scrolling Horizontal Thumbnail Strip (Only shown when multiple official posters exist) */}
      {posters.length > 1 && (
        <div className="poster-thumbnails-container">
          <div className="poster-thumbnails-strip" ref={stripRef}>
            {posters.map((item, idx) => (
              <button
                key={item.url + idx}
                type="button"
                className={`poster-thumb-item ${idx === activeIndex ? 'active' : ''}`}
                onClick={() => handleSelectPoster(idx)}
                aria-label={`View poster ${idx + 1}`}
              >
                <img
                  src={item.url}
                  alt={item.label}
                  onError={() => handleImageError(item.url)}
                />
                {idx === activeIndex && <div className="thumb-active-glow"></div>}
              </button>
            ))}
          </div>
          <div className="gallery-counter">
            <span>{activeIndex + 1}</span> / <span>{posters.length} Official Posters</span>
          </div>
        </div>
      )}
    </div>
  );
};

export default PosterGallery;
