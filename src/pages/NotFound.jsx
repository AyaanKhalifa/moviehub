import React from 'react';
import { Link } from 'react-router-dom';
import { Film, Home, Search, Calendar, ArrowLeft } from 'lucide-react';
import './NotFound.css';

const NotFound = () => {
  return (
    <div className="not-found-page-container animate-fade-in">
      <div className="not-found-card">
        <div className="not-found-icon-wrap">
          <Film size={54} className="not-found-film-icon" />
          <span className="not-found-404-tag">404</span>
        </div>

        <h1 className="not-found-title">Lost in the Multiverse</h1>
        <p className="not-found-desc">
          The scene or page you are looking for has been cut from the final edit or moved to another dimension.
        </p>

        <div className="not-found-actions">
          <Link to="/" className="not-found-btn primary-btn">
            <Home size={18} />
            <span>Return to Homepage</span>
          </Link>

          <Link to="/upcoming" className="not-found-btn secondary-btn">
            <Calendar size={18} />
            <span>Upcoming Releases</span>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default NotFound;
