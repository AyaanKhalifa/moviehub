import React, { useRef, useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight, LayoutGrid, SlidersHorizontal, User, Clapperboard, Sparkles, Info } from 'lucide-react';
import ActorDetailModal from './ActorDetailModal';
import './CastSection.css';

const CastSection = ({
  cast = [],
  isLoading = false,
  currentMovieTitle = '',
  currentMovieYear = ''
}) => {
  const scrollContainerRef = useRef(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(false);
  const [viewMode, setViewMode] = useState('horizontal'); // 'horizontal' or 'grid'
  const [selectedActor, setSelectedActor] = useState(null);

  const checkScroll = () => {
    if (!scrollContainerRef.current) return;
    const { scrollLeft, scrollWidth, clientWidth } = scrollContainerRef.current;
    setCanScrollLeft(scrollLeft > 10);
    setCanScrollRight(scrollLeft < scrollWidth - clientWidth - 10);
  };

  useEffect(() => {
    checkScroll();
    const el = scrollContainerRef.current;
    if (el) {
      el.addEventListener('scroll', checkScroll, { passive: true });
      window.addEventListener('resize', checkScroll);
      return () => {
        el.removeEventListener('scroll', checkScroll);
        window.removeEventListener('resize', checkScroll);
      };
    }
  }, [cast, viewMode]);

  const scroll = (direction) => {
    if (!scrollContainerRef.current) return;
    const container = scrollContainerRef.current;
    const scrollAmount = container.clientWidth * 0.75;
    container.scrollBy({
      left: direction === 'left' ? -scrollAmount : scrollAmount,
      behavior: 'smooth'
    });
  };

  if (!isLoading && (!cast || cast.length === 0)) {
    return null;
  }

  // Generate initials for avatar fallback
  const getInitials = (name) => {
    if (!name) return 'A';
    const parts = name.trim().split(' ');
    if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
    return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
  };

  return (
    <section className="cast-section-container">
      {/* IMDb-Inspired Section Header */}
      <div className="cast-header-row">
        <div className="cast-title-group">
          <div className="imdb-accent-bar"></div>
          <h2 className="cast-section-title">Top Cast</h2>
          {cast.length > 0 && (
            <span className="cast-count-badge">
              {cast.length} {cast.length === 1 ? 'Person' : 'People'}
            </span>
          )}
          <span className="cast-click-hint">
            <Info size={13} /> Click any actor to view details & filmography
          </span>
        </div>

        <div className="cast-header-controls">
          {/* Toggle between Horizontal Carousel and Vertical Grid */}
          <div className="cast-mode-toggle">
            <button
              className={`cast-toggle-btn ${viewMode === 'horizontal' ? 'active' : ''}`}
              onClick={() => setViewMode('horizontal')}
              title="Horizontal Carousel View"
            >
              <SlidersHorizontal size={15} />
              <span className="toggle-text">Carousel</span>
            </button>
            <button
              className={`cast-toggle-btn ${viewMode === 'grid' ? 'active' : ''}`}
              onClick={() => setViewMode('grid')}
              title="Vertical Grid View"
            >
              <LayoutGrid size={15} />
              <span className="toggle-text">Grid</span>
            </button>
          </div>

          {/* Left / Right Carousel Controls (shown in horizontal mode) */}
          {viewMode === 'horizontal' && (
            <div className="cast-carousel-arrows">
              <button
                className={`cast-arrow-btn ${!canScrollLeft ? 'disabled' : ''}`}
                onClick={() => scroll('left')}
                disabled={!canScrollLeft}
                aria-label="Scroll cast left"
              >
                <ChevronLeft size={18} />
              </button>
              <button
                className={`cast-arrow-btn ${!canScrollRight ? 'disabled' : ''}`}
                onClick={() => scroll('right')}
                disabled={!canScrollRight}
                aria-label="Scroll cast right"
              >
                <ChevronRight size={18} />
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Cast Cards Display */}
      {viewMode === 'horizontal' ? (
        <div className="cast-scroll-wrapper">
          <div className="cast-scroll-track" ref={scrollContainerRef}>
            {cast.map((person, index) => (
              <div
                key={person.id || index}
                className="cast-card interactive-cast-card"
                onClick={() => setSelectedActor(person)}
                title={`Click to view all details & films for ${person.name}`}
              >
                <div className="cast-avatar-wrap">
                  {person.image ? (
                    <img
                      src={person.image}
                      alt={person.name}
                      className="cast-avatar-img"
                      loading="lazy"
                    />
                  ) : (
                    <div className="cast-avatar-fallback">
                      <span className="cast-avatar-initials">{getInitials(person.name)}</span>
                    </div>
                  )}
                  <div className="cast-avatar-glow"></div>
                  <div className="cast-hover-overlay">
                    <span className="cast-hover-text">View Details</span>
                  </div>
                </div>

                <div className="cast-info">
                  <h4 className="cast-name" title={person.name}>
                    {person.name}
                  </h4>
                  <p className="cast-character" title={person.character}>
                    {person.character || 'Cast Member'}
                  </p>
                  {/* Film Name displayed on every cast card */}
                  {currentMovieTitle && (
                    <div className="cast-film-pill" title={`Film: ${currentMovieTitle}`}>
                      <Clapperboard size={11} className="film-pill-icon" />
                      <span className="film-pill-text">{currentMovieTitle}</span>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      ) : (
        /* Vertical Grid Mode */
        <div className="cast-vertical-grid">
          {cast.map((person, index) => (
            <div
              key={person.id || index}
              className="cast-card grid-card interactive-cast-card"
              onClick={() => setSelectedActor(person)}
              title={`Click to view all details & films for ${person.name}`}
            >
              <div className="cast-avatar-wrap">
                {person.image ? (
                  <img
                    src={person.image}
                    alt={person.name}
                    className="cast-avatar-img"
                    loading="lazy"
                  />
                ) : (
                  <div className="cast-avatar-fallback">
                    <span className="cast-avatar-initials">{getInitials(person.name)}</span>
                  </div>
                )}
                <div className="cast-avatar-glow"></div>
                <div className="cast-hover-overlay">
                  <span className="cast-hover-text">View Details</span>
                </div>
              </div>

              <div className="cast-info">
                <h4 className="cast-name" title={person.name}>
                  {person.name}
                </h4>
                <p className="cast-character" title={person.character}>
                  {person.character || 'Cast Member'}
                </p>
                {/* Film Name displayed on every cast card */}
                {currentMovieTitle && (
                  <div className="cast-film-pill" title={`Film: ${currentMovieTitle}`}>
                    <Clapperboard size={11} className="film-pill-icon" />
                    <span className="film-pill-text">{currentMovieTitle}</span>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Actor Detail & Filmography Modal */}
      <ActorDetailModal
        isOpen={Boolean(selectedActor)}
        onClose={() => setSelectedActor(null)}
        actor={selectedActor}
        currentMovieTitle={currentMovieTitle}
        currentMovieYear={currentMovieYear}
      />
    </section>
  );
};

export default CastSection;
