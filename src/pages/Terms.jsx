import React from 'react';
import { Shield } from 'lucide-react';
import './Legal.css';

const Terms = () => {
  return (
    <div className="container legal-page-container animate-fade-in">
      <div className="legal-card">
        <div className="legal-header">
          <div className="legal-tag">
            <Shield size={14} /> Legal Documentation
          </div>
          <h1 className="legal-title">Terms & Conditions</h1>
          <p className="legal-updated">Last Updated: September 2026</p>
        </div>

        <div className="legal-content">
          <div className="legal-section">
            <h2>1. Agreement to Terms</h2>
            <p>
              By accessing and using MovieHub, you agree to be bound by these Terms and Conditions. If you do not agree with any part of these terms, you must not use our service.
            </p>
          </div>

          <div className="legal-section">
            <h2>2. User Accounts & Watchlist</h2>
            <p>
              To access personalized features such as creating a Watchlist, saving movie progress, and tracking watched titles, you must register for an account using email or Google Authentication. You are responsible for maintaining the confidentiality of your login credentials.
            </p>
          </div>

          <div className="legal-section">
            <h2>3. Intellectual Property & Media Disclaimers</h2>
            <p>
              MovieHub is an informational catalog and entertainment discovery portal. All movie posters, titles, episode descriptions, trailer embeds, and cast imagery belong to their respective copyright owners, studios, and distributors. Metadata is retrieved via authorized entertainment databases including OMDb, TVMaze, and YouTube Embeds for educational and promotional discovery purposes.
            </p>
          </div>

          <div className="legal-section">
            <h2>4. Prohibited Uses</h2>
            <p>You agree not to:</p>
            <ul>
              <li>Use the service for any unlawful or fraudulent purpose.</li>
              <li>Attempt to scrape, overload, or disrupt the website infrastructure or API integrations.</li>
              <li>Circumvent authentication or access controls.</li>
            </ul>
          </div>

          <div className="legal-section">
            <h2>5. Limitation of Liability</h2>
            <p>
              MovieHub provides its services on an "as is" and "as available" basis without warranties of any kind. We do not host video files directly on our servers; all video trailers are embedded via YouTube's public API player.
            </p>
          </div>

          <div className="legal-contact-box">
            <p>For inquiries regarding these terms, please contact: <strong>legal@moviehub.app</strong></p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Terms;
