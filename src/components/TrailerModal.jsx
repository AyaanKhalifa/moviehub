import React, { useEffect } from 'react';
import { createPortal } from 'react-dom';
import { X, ExternalLink, Film, Play } from 'lucide-react';
import { getTrailerVideoId } from '../utils/trailers';
import './TrailerModal.css';

const TrailerModal = ({ isOpen, onClose, title, year, trailerId }) => {
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') onClose();
    };
    if (isOpen) {
      document.body.style.overflow = 'hidden';
      window.addEventListener('keydown', handleKeyDown);
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const videoId = trailerId || getTrailerVideoId(title);
  const youtubeEmbedUrl = videoId
    ? `https://www.youtube.com/embed/${videoId}?autoplay=1&rel=0&playsinline=1&modestbranding=1`
    : null;
  const youtubeSearchUrl = `https://www.youtube.com/results?search_query=${encodeURIComponent(
    `${title} ${year || ''} official trailer`
  )}`;

  const modalContent = (
    <div className="trailer-modal-backdrop" onClick={onClose} role="dialog" aria-modal="true">
      <div className="trailer-modal-container" onClick={(e) => e.stopPropagation()}>
        <div className="trailer-modal-header">
          <div className="trailer-modal-title">
            <Film size={20} className="trailer-icon" />
            <span title={`${title} — Official Trailer`}>{title} — Official Trailer</span>
          </div>
          <div className="trailer-modal-actions">
            <a
              href={youtubeSearchUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="trailer-external-link"
              title="Watch on YouTube"
            >
              <ExternalLink size={15} />
              <span>YouTube</span>
            </a>
            <button className="trailer-close-btn" onClick={onClose} aria-label="Close trailer">
              <X size={20} />
            </button>
          </div>
        </div>

        {videoId ? (
          <div className="trailer-video-wrapper">
            <iframe
              src={youtubeEmbedUrl}
              title={`${title} Trailer`}
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
              allowFullScreen
              className="trailer-iframe"
            />
          </div>
        ) : (
          <div className="trailer-fallback-wrapper">
            <div className="trailer-fallback-icon-wrap">
              <Film size={34} />
            </div>
            <h3 className="trailer-fallback-title">{title}</h3>
            <p className="trailer-fallback-desc">
              Direct in-app embed is not available for this specific title or season. Watch the verified official trailer directly on YouTube:
            </p>
            <a
              href={youtubeSearchUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="trailer-fallback-btn"
            >
              <Play size={18} fill="#000000" />
              <span>Watch Official Trailer on YouTube</span>
              <ExternalLink size={16} />
            </a>
          </div>
        )}

        <div className="trailer-modal-footer">
          <div className="trailer-tip">
            <Play size={14} className="play-hint-icon" />
            <span>
              {videoId
                ? 'Playing official trailer in high definition'
                : 'Direct official search results on YouTube'}
            </span>
          </div>
          <a
            href={youtubeSearchUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="trailer-yt-btn"
          >
            Open in YouTube <ExternalLink size={13} />
          </a>
        </div>
      </div>
    </div>
  );

  return createPortal(modalContent, document.body);
};

export default TrailerModal;
