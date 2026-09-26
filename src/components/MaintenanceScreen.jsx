import React, { useState } from 'react';
import { Film, Sparkles, Shield, Clock, Lock, ArrowRight, X, History, CheckCircle, RefreshCw } from 'lucide-react';
import { useAdmin } from '../context/AdminContext';
import { useNavigate } from 'react-router-dom';
import './MaintenanceScreen.css';

const MaintenanceScreen = () => {
  const { maintenanceConfig, adminLogin } = useAdmin();
  const [showAdminModal, setShowAdminModal] = useState(false);
  const [adminPin, setAdminPin] = useState('');
  const [adminError, setAdminError] = useState('');
  const navigate = useNavigate();

  const poemLines = (maintenanceConfig.poem || '').split('\n');

  const handleAdminUnlock = (e) => {
    e.preventDefault();
    const res = adminLogin(adminPin);
    if (res.success) {
      setShowAdminModal(false);
      navigate('/admin');
    } else {
      setAdminError('Incorrect PIN. Try 443244 or admin credentials.');
    }
  };

  return (
    <div className="maintenance-overlay">
      {/* Background Animated Cinema Elements */}
      <div className="maintenance-ambient-glow" />
      <div className="maintenance-reel-bg left-reel" />
      <div className="maintenance-reel-bg right-reel" />

      <div className="maintenance-container animate-fade-in">
        {/* Brand Header */}
        <div className="maintenance-brand">
          <div className="maintenance-badge">
            <Film size={26} className="maintenance-film-icon" />
          </div>
          <span className="maintenance-brand-title">
            Movie<span className="brand-highlight">Hub</span>
          </span>
        </div>

        {/* Live Status Pill */}
        <div className="maintenance-status-pill">
          <span className="status-pulse-dot" />
          <span>Intermission &bull; Director's Cut In Progress</span>
        </div>

        {/* Main Cinema Poetic Card */}
        <div className="maintenance-card">
          <div className="card-top-icon">
            <Sparkles size={28} className="sparkle-gold" />
          </div>

          <h1 className="maintenance-title">
            {maintenanceConfig.title || 'Upgrading the Cinema Experience'}
          </h1>

          {/* Current Upgrade Announcement Message */}
          {maintenanceConfig.message && (
            <div className="maintenance-current-notice">
              <RefreshCw size={16} className="notice-icon-spin" />
              <span>{maintenanceConfig.message}</span>
            </div>
          )}

          {/* The Beautiful Poem */}
          <div className="maintenance-poem-box">
            <div className="poem-quote-mark top">&ldquo;</div>
            <div className="poem-verses">
              {poemLines.map((line, idx) => (
                <p key={idx} className={`poem-line ${line.trim() === '' ? 'poem-break' : ''}`}>
                  {line}
                </p>
              ))}
            </div>
            <div className="poem-quote-mark bottom">&rdquo;</div>
          </div>

          {/* Past Conditions & System Upgrade History */}
          <div className="maintenance-past-conditions-card">
            <div className="past-conditions-header">
              <History size={16} className="history-gold-icon" />
              <h4>System Progress & Past Conditions</h4>
            </div>
            <div className="conditions-list">
              <div className="condition-item completed">
                <CheckCircle size={14} className="check-green" />
                <div className="condition-text">
                  <strong>Previous Release (V1.3 - V1.4):</strong> Full Mobile PWA App Support, Firebase Auth & Watchlists completed.
                </div>
              </div>
              <div className="condition-item in-progress">
                <span className="pulse-bullet" />
                <div className="condition-text">
                  <strong>Current Upgrade (V1.5):</strong> {maintenanceConfig.pastConditions || 'Real-time database sync, live visitor analytics, and enhanced high-speed movie discovery engine.'}
                </div>
              </div>
            </div>
          </div>

          {/* ETA / Info Footer */}
          <div className="maintenance-footer-info">
            <Clock size={16} className="info-icon" />
            <span>{maintenanceConfig.eta || 'Back shortly with exciting new features'}</span>
          </div>

          <div className="maintenance-signature">
            <span>Crafted with passion by <strong>Ayaan Khalifa</strong></span>
          </div>
        </div>

        {/* Discreet Admin Portal Bypass Button */}
        <button
          type="button"
          className="admin-bypass-btn"
          onClick={() => setShowAdminModal(true)}
          title="Admin Access"
        >
          <Shield size={14} />
          <span>Admin Portal</span>
        </button>
      </div>

      {/* Admin Unlock Modal */}
      {showAdminModal && (
        <div className="admin-modal-backdrop" onClick={() => setShowAdminModal(false)}>
          <div className="admin-modal-card" onClick={(e) => e.stopPropagation()}>
            <div className="admin-modal-header">
              <div className="admin-modal-title">
                <Lock size={18} className="admin-lock-icon" />
                <h3>Admin Authorization</h3>
              </div>
              <button
                type="button"
                className="admin-modal-close"
                onClick={() => setShowAdminModal(false)}
              >
                <X size={18} />
              </button>
            </div>

            <p className="admin-modal-desc">
              Enter admin master PIN (<strong>443244</strong>) or password to manage maintenance mode.
            </p>

            {adminError && <div className="admin-modal-error">{adminError}</div>}

            <form onSubmit={handleAdminUnlock} className="admin-modal-form">
              <input
                type="password"
                placeholder="Enter PIN (443244) or admin password"
                value={adminPin}
                onChange={(e) => setAdminPin(e.target.value)}
                autoFocus
                className="admin-pin-input"
              />
              <button type="submit" className="admin-unlock-btn">
                <span>Unlock & Manage</span>
                <ArrowRight size={16} />
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default MaintenanceScreen;
