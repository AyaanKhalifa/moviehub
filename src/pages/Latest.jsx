import React, { useState, useEffect } from 'react';
import { Calendar, Play, Film, Tv, Sparkles, Clock, Clapperboard, Star } from 'lucide-react';
import { UPCOMING_TITLES } from '../utils/upcomingData';
import { fetchCuratedCollection } from '../utils/api';
import TrailerModal from '../components/TrailerModal';
import './Upcoming.css';

const Latest = () => {
  const [filter, setFilter] = useState('all'); // 'all', 'movie', 'series'
  const [trailerModal, setTrailerModal] = useState({ isOpen: false, title: '', year: '', trailerId: null });
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;
    const loadData = async () => {
      try {
        const apiData = await fetchCuratedCollection(UPCOMING_TITLES);
        
        const now = new Date();
        const currentMonth = now.getMonth();
        const currentYear = now.getFullYear();

        const formatDate = (dateStr) => {
          if (!dateStr || dateStr === 'N/A') return 'In Theaters';
          const d = new Date(dateStr);
          if (!isNaN(d.getTime())) {
            return d.toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' });
          }
          return dateStr;
        };

        const merged = UPCOMING_TITLES.map(item => {
          const apiItem = apiData.find(d => 
            (d.imdbID && item.imdbID && d.imdbID === item.imdbID) || 
            (d.Title && d.Title.toLowerCase().replace(/[^a-z0-9]/g, '') === item.title.toLowerCase().replace(/[^a-z0-9]/g, ''))
          );
          
          let rawDate = apiItem && apiItem.Released && apiItem.Released !== 'N/A' ? apiItem.Released : item.releaseDate;
          const parsedDate = new Date(rawDate);
          const displayDate = formatDate(rawDate);
          
          return {
            ...item,
            title: apiItem && apiItem.Title ? apiItem.Title : item.title,
            plot: apiItem && apiItem.Plot && apiItem.Plot !== 'N/A' ? apiItem.Plot : item.plot,
            poster: apiItem && apiItem.Poster && apiItem.Poster !== 'N/A' ? apiItem.Poster : item.poster,
            director: apiItem && apiItem.Director && apiItem.Director !== 'N/A' ? apiItem.Director : item.director,
            cast: apiItem && apiItem.Actors && apiItem.Actors !== 'N/A' ? apiItem.Actors : item.cast,
            genre: apiItem && apiItem.Genre && apiItem.Genre !== 'N/A' ? apiItem.Genre : item.genre,
            displayDate,
            releaseDate: displayDate,
            parsedDate: isNaN(parsedDate.getTime()) ? new Date(item.year, 11, 31) : parsedDate
          };
        });
        
        if (mounted) {
          // Filter for CURRENT month movies ONLY
          const latest = merged.filter(m => {
            return m.parsedDate.getFullYear() === currentYear && m.parsedDate.getMonth() === currentMonth;
          });
          setItems(latest);
          setLoading(false);
        }
      } catch (err) {
        if (mounted) setLoading(false);
      }
    };
    loadData();
    return () => { mounted = false; };
  }, []);

  const filteredTitles = items.filter((item) => {
    if (filter === 'all') return true;
    return item.type === filter;
  });

  const openTrailer = (title, year, trailerId) => {
    setTrailerModal({
      isOpen: true,
      title,
      year,
      trailerId
    });
  };

  const closeTrailer = () => {
    setTrailerModal({ isOpen: false, title: '', year: '', trailerId: null });
  };

  return (
    <div className="container upcoming-page animate-fade-in">
      {/* Header */}
      <div className="upcoming-hero-header">
        <div className="upcoming-title-wrap">
          <div className="upcoming-accent-bar"></div>
          <div>
            <h1 className="upcoming-page-title">Latest Releases</h1>
            <p className="upcoming-subtitle">
              Movies and Web Series releasing this month. Watch official teaser trailers and view theatrical posters.
            </p>
          </div>
        </div>

        {/* Filter Pills */}
        <div className="upcoming-filter-pills">
          <button
            className={`upcoming-pill ${filter === 'all' ? 'active' : ''}`}
            onClick={() => setFilter('all')}
          >
            All Latest ({items.length})
          </button>
          <button
            className={`upcoming-pill ${filter === 'movie' ? 'active' : ''}`}
            onClick={() => setFilter('movie')}
          >
            <Film size={14} />
            <span>Movies</span>
          </button>
          <button
            className={`upcoming-pill ${filter === 'series' ? 'active' : ''}`}
            onClick={() => setFilter('series')}
          >
            <Tv size={14} />
            <span>Web Series</span>
          </button>
        </div>
      </div>

      {loading ? (
        <div style={{ textAlign: 'center', padding: '60px', color: '#94a3b8' }}>Loading latest releases...</div>
      ) : (
        <div className="upcoming-cards-grid">
        {filteredTitles.map((item) => (
          <div key={item.id} className="upcoming-card">
            {/* Poster & Media Column */}
            <div className="upcoming-poster-wrap">
              <img
                src={item.poster}
                alt={item.title}
                className="upcoming-poster-img"
                loading="lazy"
                onError={(e) => {
                  e.target.onerror = null;
                  e.target.src = 'https://images.unsplash.com/photo-1536440136628-849c177e76a1?auto=format&fit=crop&w=600&q=80';
                }}
              />
              <div className="upcoming-status-badge">
                <span>{item.status}</span>
              </div>
              <button
                className="upcoming-play-overlay-btn"
                onClick={() => openTrailer(item.title, item.year, item.trailerId)}
                title="Watch Official Trailer"
              >
                <div className="play-icon-circle">
                  <Play size={22} fill="#000000" />
                </div>
                <span className="play-label">Play Trailer</span>
              </button>
            </div>

            {/* Info Column */}
            <div className="upcoming-info-content">
              <div className="upcoming-meta-row">
                <span className="upcoming-type-pill">{item.type.toUpperCase()}</span>
                <span className="upcoming-date-pill">
                  <Calendar size={13} /> {item.displayDate}
                </span>
              </div>

              <h2 className="upcoming-title">{item.title}</h2>

              <p className="upcoming-plot">{item.plot}</p>

              <div className="upcoming-details-list">
                {item.director && (
                  <div className="upcoming-detail-row">
                    <span className="detail-label">Director:</span>
                    <span className="detail-value">{item.director}</span>
                  </div>
                )}
                {item.cast && (
                  <div className="upcoming-detail-row">
                    <span className="detail-label">Cast:</span>
                    <span className="detail-value">{item.cast}</span>
                  </div>
                )}
                {item.genre && (
                  <div className="upcoming-detail-row">
                    <span className="detail-label">Genres:</span>
                    <span className="detail-value">{item.genre}</span>
                  </div>
                )}
              </div>

              {/* Action Buttons */}
              <div className="upcoming-actions">
                <button
                  className="upcoming-trailer-btn"
                  onClick={() => openTrailer(item.title, item.year, item.trailerId)}
                >
                  <Play size={16} fill="#000000" />
                  <span>Watch Trailer</span>
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
      )}

      {/* Trailer Modal */}
      <TrailerModal
        isOpen={trailerModal.isOpen}
        onClose={closeTrailer}
        title={trailerModal.title}
        year={trailerModal.year}
        trailerId={trailerModal.trailerId}
      />
    </div>
  );
};

export default Latest;
