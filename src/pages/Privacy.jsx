import React from 'react';
import { Lock } from 'lucide-react';
import './Legal.css';

const Privacy = () => {
  return (
    <div className="container legal-page-container animate-fade-in">
      <div className="legal-card">
        <div className="legal-header">
          <div className="legal-tag">
            <Lock size={14} /> Data Privacy
          </div>
          <h1 className="legal-title">Privacy Policy</h1>
          <p className="legal-updated">Last Updated: September 2026</p>
        </div>

        <div className="legal-content">
          <div className="legal-section">
            <h2>1. Information We Collect</h2>
            <p>
              When you create an account with MovieHub, we collect basic identification data including your name, email address, and authentication provider identifiers through Google Firebase Authentication.
            </p>
            <p>
              We also store your cinema preferences, such as items in your Watchlist, your watched/undone status, and your recent search queries in secure local and session caches.
            </p>
          </div>

          <div className="legal-section">
            <h2>2. How We Use Your Information</h2>
            <p>We use your information exclusively to:</p>
            <ul>
              <li>Authenticate your account and protect against unauthorized access.</li>
              <li>Save and synchronize your Watchlist across your devices.</li>
              <li>Provide personalized search suggestions and tailored film recommendations.</li>
              <li>Monitor application health, performance, and server stability.</li>
            </ul>
          </div>

          <div className="legal-section">
            <h2>3. Third-Party Services</h2>
            <p>
              MovieHub integrates trusted industry standard third-party services:
            </p>
            <ul>
              <li><strong>Google Firebase:</strong> Secure authentication and session management.</li>
              <li><strong>YouTube Player API:</strong> Streaming official HD movie and series trailers.</li>
              <li><strong>TVMaze & OMDb API:</strong> Fetching verified cast portraits and show schedules.</li>
            </ul>
          </div>

          <div className="legal-section">
            <h2>4. Data Security & Storage</h2>
            <p>
              We apply state-of-the-art encryption protocols (HTTPS/TLS) and secure credential handling. Passwords are encrypted by Google Firebase and are never accessible in plain text.
            </p>
          </div>

          <div className="legal-section">
            <h2>5. Your Rights</h2>
            <p>
              You retain the right to edit your profile, clear your watchlist, delete your recent searches, or request account removal at any time.
            </p>
          </div>

          <div className="legal-contact-box">
            <p>For privacy inquiries or data requests, contact our Data Protection Officer: <strong>privacy@moviehub.app</strong></p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Privacy;
