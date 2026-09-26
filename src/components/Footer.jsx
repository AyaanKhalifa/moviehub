import React from 'react';
import { Link } from 'react-router-dom';
import { Film, Heart, Shield, Cookie, FileText, Calendar, User, Bookmark } from 'lucide-react';
import './Footer.css';

const Footer = () => {
  return (
    <footer className="site-footer">
      <div className="container footer-container">
        <div className="footer-grid" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid #333', paddingBottom: '20px' }}>
          {/* Brand Info */}
          <div className="footer-col brand-col" style={{ maxWidth: '400px' }}>
            <Link to="/" className="footer-brand">
              <div className="footer-brand-icon">
                <Film size={20} />
              </div>
              <span className="brand-text">
                Movie<span className="brand-highlight">Hub</span>
              </span>
            </Link>
            <p className="footer-tagline">
              Your ultimate cinematic universe. Discover blockbuster movies, binge-worthy web series, acclaimed anime, and upcoming theatrical releases.
            </p>
          </div>

          {/* Legal & Important Links */}
          <div className="footer-col" style={{ display: 'flex', gap: '20px' }}>
            <Link to="/upcoming">Upcoming</Link>
            <Link to="/terms">Terms</Link>
            <Link to="/privacy">Privacy</Link>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="footer-bottom-bar" style={{ display: 'flex', justifyContent: 'space-between', marginTop: '20px' }}>
          <p className="footer-copyright">
            © {new Date().getFullYear()} MovieHub Inc. All rights reserved.
          </p>
          <div className="footer-badges">
            <span style={{ color: '#aaa', fontSize: '0.9rem' }}>Made by Ayaan Khalifa</span>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
