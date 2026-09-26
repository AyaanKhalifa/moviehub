import React, { useEffect, useState } from 'react';
import { createPortal } from 'react-dom';
import { X, Calendar, MapPin, Film, Sparkles, ExternalLink, User, Clapperboard, Award } from 'lucide-react';
import { getActorDetails } from '../utils/api';
import { useNavigate } from 'react-router-dom';
import './ActorDetailModal.css';

const ActorDetailModal = ({
  isOpen,
  onClose,
  actor,
  currentMovieTitle = '',
  currentMovieYear = ''
}) => {
  const [details, setDetails] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    if (!isOpen || !actor) return;

    let isMounted = true;
    setLoading(true);

    getActorDetails(actor.name, actor.personId || actor.id)
      .then((data) => {
        if (isMounted) {
          setDetails(data);
          setLoading(false);
        }
      })
      .catch(() => {
        if (isMounted) {
          setLoading(false);
        }
      });

    return () => {
      isMounted = false;
    };
  }, [isOpen, actor]);

  // Handle ESC key to close modal
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') onClose();
    };
    if (isOpen) {
      window.addEventListener('keydown', handleKeyDown);
      document.body.style.overflow = 'hidden';
    }
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = 'unset';
    };
  }, [isOpen, onClose]);

  if (!isOpen || !actor) return null;

  const displayImage = details?.image || actor.image;
  const films = details?.films || [];

  const handleFilmClick = (filmTitle) => {
    onClose();
    navigate(`/search?q=${encodeURIComponent(filmTitle)}`);
  };

  return createPortal(
    <div className="actor-modal-backdrop" onClick={onClose}>
      <div
        className="actor-modal-container animate-fade-in"
        onClick={(e) => e.stopPropagation()}
        role="dialog"
        aria-modal="true"
      >
        {/* Close Button */}
        <button
          className="actor-modal-close"
          onClick={onClose}
          aria-label="Close details"
        >
          <X size={20} />
        </button>

        {/* Modal Content */}
        <div className="actor-modal-body">
          {/* Top Profile Card */}
          <div className="actor-profile-header">
            {/* Actor Portrait */}
            <div className="actor-modal-avatar-wrap">
              {displayImage ? (
                <img
                  src={displayImage}
                  alt={actor.name}
                  className="actor-modal-avatar-img"
                />
              ) : (
                <div className="actor-modal-avatar-fallback">
                  <User size={48} />
                </div>
              )}
              <div className="actor-avatar-ring"></div>
            </div>

            {/* Profile Info */}
            <div className="actor-profile-info">
              <div className="actor-role-badge">
                <Clapperboard size={14} className="badge-icon" />
                <span>
                  Plays <strong>{actor.character || 'Lead Role'}</strong> in {currentMovieTitle || 'this film'}
                  {currentMovieYear ? ` (${currentMovieYear})` : ''}
                </span>
              </div>

              <h2 className="actor-modal-name">{actor.name}</h2>

              {/* Bio Meta Pills */}
              <div className="actor-meta-row">
                {details?.birthday && (
                  <div className="actor-meta-pill">
                    <Calendar size={14} className="meta-icon" />
                    <span>
                      {details.birthday}
                      {details.age ? ` (${details.age} yrs)` : ''}
                    </span>
                  </div>
                )}

                {details?.country && (
                  <div className="actor-meta-pill">
                    <MapPin size={14} className="meta-icon" />
                    <span>{details.country}</span>
                  </div>
                )}

                {details?.gender && (
                  <div className="actor-meta-pill">
                    <User size={14} className="meta-icon" />
                    <span>{details.gender}</span>
                  </div>
                )}
              </div>

              {/* IMDb / External Profile Link */}
              <div className="actor-external-links">
                <a
                  href={`https://www.imdb.com/find?q=${encodeURIComponent(actor.name)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="actor-external-btn imdb-btn"
                >
                  <span className="imdb-btn-badge">IMDb</span>
                  <span>View IMDb Filmography</span>
                  <ExternalLink size={13} />
                </a>

                {details?.url && (
                  <a
                    href={details.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="actor-external-btn tvmaze-btn"
                  >
                    <span>TVMaze Profile</span>
                    <ExternalLink size={13} />
                  </a>
                )}
              </div>
            </div>
          </div>

          {/* Filmography Section: All films & series starring this actor */}
          <div className="actor-filmography-section">
            <div className="filmography-header">
              <div className="filmography-title-wrap">
                <Film size={18} className="filmo-icon" />
                <h3 className="filmography-title">Notable Films & Shows</h3>
              </div>
              <span className="filmo-count">
                {films.length > 0 ? `${films.length} Titles` : 'Filmography'}
              </span>
            </div>

            {loading ? (
              <div className="filmography-loading">
                <div className="loading-spinner"></div>
                <span>Loading complete filmography...</span>
              </div>
            ) : films.length > 0 ? (
              <div className="filmography-grid">
                {films.map((item, idx) => (
                  <div
                    key={`${item.title}-${idx}`}
                    className="filmo-card"
                    onClick={() => handleFilmClick(item.title)}
                    title={`Search & Watch ${item.title}`}
                  >
                    <div className="filmo-poster-wrap">
                      {item.poster ? (
                        <img
                          src={item.poster}
                          alt={item.title}
                          className="filmo-poster-img"
                          loading="lazy"
                        />
                      ) : (
                        <div className="filmo-poster-fallback">
                          <Film size={28} />
                        </div>
                      )}
                      <div className="filmo-poster-overlay">
                        <span className="filmo-view-btn">View Title</span>
                      </div>
                    </div>

                    <div className="filmo-info">
                      <h4 className="filmo-name">{item.title}</h4>
                      <div className="filmo-meta">
                        <span className="filmo-year">{item.year}</span>
                        {item.character && item.character !== 'Featured Cast' && (
                          <span className="filmo-char" title={item.character}>
                            as {item.character}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="filmography-empty">
                <p>Additional filmography records available on IMDb profile.</p>
                <a
                  href={`https://www.imdb.com/find?q=${encodeURIComponent(actor.name)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="filmo-search-link"
                >
                  Search all films on IMDb →
                </a>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>,
    document.body
  );
};

export default ActorDetailModal;
