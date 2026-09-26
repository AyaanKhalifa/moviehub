import React, { useRef, useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight, SlidersHorizontal, LayoutGrid } from 'lucide-react';
import MovieCard from './MovieCard';
import './MovieSectionRow.css';

const MovieSectionRow = ({
  title,
  icon: Icon,
  iconClass = '',
  actionText = null,
  onAction = null,
  items = [],
  defaultMode = 'horizontal' // 'horizontal' or 'grid'
}) => {
  const scrollRef = useRef(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(false);
  const [mode, setMode] = useState(defaultMode);

  const checkScrollBounds = () => {
    if (!scrollRef.current) return;
    const { scrollLeft, scrollWidth, clientWidth } = scrollRef.current;
    setCanScrollLeft(scrollLeft > 10);
    setCanScrollRight(scrollLeft < scrollWidth - clientWidth - 10);
  };

  useEffect(() => {
    checkScrollBounds();
    const el = scrollRef.current;
    if (el) {
      el.addEventListener('scroll', checkScrollBounds, { passive: true });
      window.addEventListener('resize', checkScrollBounds);
      return () => {
        el.removeEventListener('scroll', checkScrollBounds);
        window.removeEventListener('resize', checkScrollBounds);
      };
    }
  }, [items, mode]);

  const handleScroll = (direction) => {
    if (!scrollRef.current) return;
    const container = scrollRef.current;
    const scrollAmount = container.clientWidth * 0.8;
    container.scrollBy({
      left: direction === 'left' ? -scrollAmount : scrollAmount,
      behavior: 'smooth'
    });
  };

  if (!items || items.length === 0) return null;

  return (
    <section className="movie-section-row-wrapper">
      {/* Section Header */}
      <div className="section-header">
        <div className="section-title-wrap">
          {Icon && <Icon size={22} className={`section-icon ${iconClass}`} />}
          <h2 className="section-title">{title}</h2>
          <span className="section-items-badge">{items.length} titles</span>
        </div>

        <div className="section-header-actions">
          {/* View Mode Switcher: Horizontal Carousel vs Vertical Grid */}
          <div className="section-view-toggle">
            <button
              className={`view-toggle-btn ${mode === 'horizontal' ? 'active' : ''}`}
              onClick={() => setMode('horizontal')}
              title="Horizontal Row Scrolling"
              aria-label="Horizontal scroll view"
            >
              <SlidersHorizontal size={15} />
              <span className="toggle-label">Horizontal</span>
            </button>
            <button
              className={`view-toggle-btn ${mode === 'grid' ? 'active' : ''}`}
              onClick={() => setMode('grid')}
              title="Vertical Grid Scrolling"
              aria-label="Vertical grid view"
            >
              <LayoutGrid size={15} />
              <span className="toggle-label">Vertical</span>
            </button>
          </div>

          {/* Horizontal Carousel Controls */}
          {mode === 'horizontal' && (
            <div className="section-carousel-nav">
              <button
                className={`section-nav-btn ${!canScrollLeft ? 'disabled' : ''}`}
                onClick={() => handleScroll('left')}
                disabled={!canScrollLeft}
                aria-label="Scroll row left"
              >
                <ChevronLeft size={18} />
              </button>
              <button
                className={`section-nav-btn ${!canScrollRight ? 'disabled' : ''}`}
                onClick={() => handleScroll('right')}
                disabled={!canScrollRight}
                aria-label="Scroll row right"
              >
                <ChevronRight size={18} />
              </button>
            </div>
          )}

          {/* Optional Action Button (e.g. View All) */}
          {actionText && onAction && (
            <button className="section-link-btn" onClick={onAction}>
              {actionText}
            </button>
          )}
        </div>
      </div>

      {/* Content Rendering: Horizontal Slider Row vs Vertical Grid */}
      {mode === 'horizontal' ? (
        <div className="horizontal-slider-wrapper">
          <div className="horizontal-scroll-track" ref={scrollRef}>
            {items.map((movie) => (
              <div key={movie.imdbID} className="horizontal-card-item">
                <MovieCard movie={movie} />
              </div>
            ))}
          </div>
        </div>
      ) : (
        <div className="vertical-grid-container grid">
          {items.map((movie) => (
            <MovieCard key={movie.imdbID} movie={movie} />
          ))}
        </div>
      )}
    </section>
  );
};

export default MovieSectionRow;
