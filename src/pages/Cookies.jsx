import React from 'react';
import { Cookie } from 'lucide-react';
import './Legal.css';

const Cookies = () => {
  return (
    <div className="container legal-page-container animate-fade-in">
      <div className="legal-card">
        <div className="legal-header">
          <div className="legal-tag">
            <Cookie size={14} /> Cookie Notice
          </div>
          <h1 className="legal-title">Cookie Policy</h1>
          <p className="legal-updated">Last Updated: September 2026</p>
        </div>

        <div className="legal-content">
          <div className="legal-section">
            <h2>1. What Are Cookies & Local Storage?</h2>
            <p>
              Cookies and local browser storage are small text fragments stored on your device that enable websites to remember your preferences, authentication status, and active sessions.
            </p>
          </div>

          <div className="legal-section">
            <h2>2. How MovieHub Uses Storage</h2>
            <p>MovieHub uses browser storage strictly for functional and performance purposes:</p>
            <ul>
              <li><strong>Authentication Cookies:</strong> Manage secure Firebase login sessions so you remain signed in.</li>
              <li><strong>Watchlist Storage:</strong> Keep your saved movies and marked watched titles readily available offline and instantly upon loading.</li>
              <li><strong>Recent Searches:</strong> Store your last search queries for fast one-click recall.</li>
              <li><strong>UI Preferences:</strong> Preserve your preferred layout view (horizontal carousel vs. vertical grid).</li>
            </ul>
          </div>

          <div className="legal-section">
            <h2>3. Managing & Clearing Cookies</h2>
            <p>
              You can control or clear stored cookies and local storage through your browser settings. Please note that disabling essential storage may require you to sign in each time you visit and may prevent your Watchlist from saving locally.
            </p>
          </div>

          <div className="legal-contact-box">
            <p>Questions regarding our cookie usage? Reach us at: <strong>cookies@moviehub.app</strong></p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Cookies;
