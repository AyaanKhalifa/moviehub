import React, { useState, useEffect } from 'react';
import { 
  Shield, 
  Wrench, 
  Users, 
  Bookmark, 
  Sparkles, 
  CheckCircle2, 
  AlertTriangle, 
  Power, 
  Eye, 
  RotateCcw, 
  Search, 
  Film, 
  Check, 
  Clock, 
  ExternalLink,
  LogOut,
  Save,
  Trash2
} from 'lucide-react';
import { useAdmin } from '../context/AdminContext';
import { 
  getAllUsersWithWatchlists, 
  DEFAULT_MAINTENANCE_POEM 
} from '../utils/adminService';
import { Link, useNavigate } from 'react-router-dom';
import './Admin.css';

const POEM_PRESETS = [
  {
    name: 'Classic Reel (Default)',
    title: 'Upgrading the Cinema Experience',
    eta: 'Back shortly with exciting new features',
    poem: DEFAULT_MAINTENANCE_POEM
  },
  {
    name: 'Director’s Cut',
    title: 'The Director is Polishing the Scene',
    eta: 'Re-opening the theater in a few moments',
    poem: `Behind the red velvet, behind the silver screen,
We're perfecting every frame you haven't yet seen.
The projector is cooling, the sound is refined,
A breathtaking showcase is being designed.

Stay in your seats, let the orchestra play,
MovieHub will dazzle before end of day.`
  },
  {
    name: 'Midnight Premiere',
    title: 'Intermission & Premiere Preparation',
    eta: 'Curtain rises very soon',
    poem: `The theater rests in a quiet moonlight,
As stars align for a magical night.
We're dusting the aisles and rolling the reels,
To bring you the thrills and cinematic feels.

Thank you for waiting, dear cinema friend,
Our grandest premiere is just round the bend.`
  }
];

const Admin = () => {
  const { 
    isAdmin, 
    isMaintenanceActive, 
    maintenanceConfig, 
    updateMaintenance, 
    adminLogout 
  } = useAdmin();

  const [activeTab, setActiveTab] = useState('maintenance'); // 'maintenance' | 'users' | 'watchlists'
  const [userData, setUserData] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedUserFilter, setSelectedUserFilter] = useState('all');

  // Form states for Maintenance Tab
  const [isMaintenanceOn, setIsMaintenanceOn] = useState(isMaintenanceActive);
  const [maintenanceTitle, setMaintenanceTitle] = useState(maintenanceConfig.title || '');
  const [maintenancePoem, setMaintenancePoem] = useState(maintenanceConfig.poem || '');
  const [maintenanceEta, setMaintenanceEta] = useState(maintenanceConfig.eta || '');
  const [saveFeedback, setSaveFeedback] = useState('');

  const navigate = useNavigate();

  // Redirect if not admin
  useEffect(() => {
    if (!isAdmin) {
      navigate('/login?redirect=/admin');
    } else {
      setUserData(getAllUsersWithWatchlists());
    }
  }, [isAdmin, navigate]);

  // Sync state when config updates
  useEffect(() => {
    setIsMaintenanceOn(maintenanceConfig.isActive);
    setMaintenanceTitle(maintenanceConfig.title || '');
    setMaintenancePoem(maintenanceConfig.poem || '');
    setMaintenanceEta(maintenanceConfig.eta || '');
  }, [maintenanceConfig]);

  const handleSaveMaintenance = (overrideActive = isMaintenanceOn) => {
    updateMaintenance(overrideActive, maintenancePoem, maintenanceEta, maintenanceTitle);
    setIsMaintenanceOn(overrideActive);
    setSaveFeedback('Maintenance settings saved & broadcast live! ✨');
    setTimeout(() => setSaveFeedback(''), 3500);
  };

  const handleToggleMaintenance = () => {
    const nextState = !isMaintenanceOn;
    setIsMaintenanceOn(nextState);
    handleSaveMaintenance(nextState);
  };

  const applyPoemPreset = (preset) => {
    setMaintenanceTitle(preset.title);
    setMaintenancePoem(preset.poem);
    setMaintenanceEta(preset.eta);
  };

  const handleLogout = () => {
    adminLogout();
    navigate('/');
  };

  // Filtered Users
  const filteredUsers = userData.filter((u) => {
    const q = searchQuery.toLowerCase();
    const matchesQuery = 
      (u.displayName || '').toLowerCase().includes(q) ||
      (u.email || '').toLowerCase().includes(q) ||
      (u.uid || '').toLowerCase().includes(q);
    
    if (selectedUserFilter === 'all') return matchesQuery;
    if (selectedUserFilter === 'with_watchlist') return matchesQuery && u.totalItems > 0;
    if (selectedUserFilter === 'empty_watchlist') return matchesQuery && u.totalItems === 0;
    return matchesQuery;
  });

  if (!isAdmin) return null;

  return (
    <div className="admin-page-container animate-fade-in">
      {/* Admin Top Banner */}
      <header className="admin-header">
        <div className="admin-header-left">
          <div className="admin-badge-icon">
            <Shield size={24} className="admin-shield" />
          </div>
          <div>
            <h1 className="admin-main-title">Admin Command Center</h1>
            <p className="admin-subtitle">
              Manage Maintenance Mode &bull; Registered Users &bull; User Watchlists
            </p>
          </div>
        </div>

        <div className="admin-header-right">
          <Link to="/" className="admin-view-site-btn">
            <Eye size={16} />
            <span>View Site</span>
          </Link>
          <button type="button" onClick={handleLogout} className="admin-logout-btn">
            <LogOut size={16} />
            <span>Exit Admin</span>
          </button>
        </div>
      </header>

      {/* 3 Main Navigation Tabs */}
      <nav className="admin-nav-tabs">
        <button
          type="button"
          className={`admin-tab-btn ${activeTab === 'maintenance' ? 'active' : ''}`}
          onClick={() => setActiveTab('maintenance')}
        >
          <Wrench size={18} />
          <span>1. Maintenance Mode</span>
          {isMaintenanceOn && <span className="tab-pill-live">LIVE ON</span>}
        </button>

        <button
          type="button"
          className={`admin-tab-btn ${activeTab === 'users' ? 'active' : ''}`}
          onClick={() => setActiveTab('users')}
        >
          <Users size={18} />
          <span>2. Users ({userData.length})</span>
        </button>

        <button
          type="button"
          className={`admin-tab-btn ${activeTab === 'watchlists' ? 'active' : ''}`}
          onClick={() => setActiveTab('watchlists')}
        >
          <Bookmark size={18} />
          <span>3. Their Watchlists</span>
        </button>
      </nav>

      {/* TAB 1: MAINTENANCE MODE */}
      {activeTab === 'maintenance' && (
        <section className="admin-tab-content maintenance-tab-section animate-fade-in">
          {/* Live Switch Banner */}
          <div className={`maintenance-master-toggle-card ${isMaintenanceOn ? 'is-active' : ''}`}>
            <div className="toggle-card-info">
              <div className="toggle-status-header">
                <Power size={22} className={isMaintenanceOn ? 'power-on' : 'power-off'} />
                <h2>Maintenance Mode Status: <strong>{isMaintenanceOn ? 'ACTIVE (SITE LOCKED)' : 'OFF (SITE LIVE)'}</strong></h2>
              </div>
              <p>
                {isMaintenanceOn 
                  ? 'All non-admin visitors are currently greeted with the cinema poem maintenance screen.'
                  : 'The website is normal and open to all public users.'}
              </p>
            </div>

            <button
              type="button"
              className={`toggle-switch-btn ${isMaintenanceOn ? 'switch-active' : ''}`}
              onClick={handleToggleMaintenance}
            >
              <span className="switch-knob" />
              <span>{isMaintenanceOn ? 'TURN OFF' : 'ACTIVATE NOW'}</span>
            </button>
          </div>

          {saveFeedback && (
            <div className="admin-save-alert animate-fade-in">
              <CheckCircle2 size={18} />
              <span>{saveFeedback}</span>
            </div>
          )}

          <div className="maintenance-editor-grid">
            {/* Left: Poem & Config Editor */}
            <div className="admin-card editor-card">
              <div className="card-header-row">
                <div className="card-title-group">
                  <Sparkles size={18} className="gold-icon" />
                  <h3>Maintenance Poem & Message Editor</h3>
                </div>
              </div>

              {/* Preset Selector */}
              <div className="preset-selector-row">
                <span className="preset-label">Poem Presets:</span>
                <div className="preset-btns-wrap">
                  {POEM_PRESETS.map((preset, idx) => (
                    <button
                      key={idx}
                      type="button"
                      className="preset-btn"
                      onClick={() => applyPoemPreset(preset)}
                    >
                      {preset.name}
                    </button>
                  ))}
                </div>
              </div>

              <div className="admin-form-group">
                <label>Screen Title</label>
                <input
                  type="text"
                  value={maintenanceTitle}
                  onChange={(e) => setMaintenanceTitle(e.target.value)}
                  placeholder="e.g. Upgrading the Cinema Experience"
                  className="admin-input"
                />
              </div>

              <div className="admin-form-group">
                <label>Cinema Poem (Lines displayed poetically)</label>
                <textarea
                  rows={8}
                  value={maintenancePoem}
                  onChange={(e) => setMaintenancePoem(e.target.value)}
                  placeholder="Enter poem verses here..."
                  className="admin-textarea poem-textarea"
                />
              </div>

              <div className="admin-form-group">
                <label>Estimated Time / Notice Message</label>
                <input
                  type="text"
                  value={maintenanceEta}
                  onChange={(e) => setMaintenanceEta(e.target.value)}
                  placeholder="e.g. Back shortly with exciting new features"
                  className="admin-input"
                />
              </div>

              <div className="editor-actions-row">
                <button
                  type="button"
                  className="admin-save-btn"
                  onClick={() => handleSaveMaintenance()}
                >
                  <Save size={16} />
                  <span>Save & Apply Changes</span>
                </button>
              </div>
            </div>

            {/* Right: Live Preview */}
            <div className="admin-card preview-card">
              <div className="card-header-row">
                <div className="card-title-group">
                  <Eye size={18} className="gold-icon" />
                  <h3>Live Visitor Preview</h3>
                </div>
              </div>

              <div className="mini-preview-container">
                <div className="mini-preview-header">
                  <Film size={18} className="gold-icon" />
                  <span>MovieHub &bull; Maintenance Intermission</span>
                </div>
                <h4 className="mini-preview-title">{maintenanceTitle || 'Upgrading the Cinema Experience'}</h4>
                
                <div className="mini-poem-box">
                  {maintenancePoem.split('\n').map((line, i) => (
                    <p key={i} className="mini-poem-line">{line}</p>
                  ))}
                </div>

                <div className="mini-preview-footer">
                  <Clock size={13} />
                  <span>{maintenanceEta || 'Back shortly with exciting new features'}</span>
                </div>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* TAB 2: USERS PAGE */}
      {activeTab === 'users' && (
        <section className="admin-tab-content users-tab-section animate-fade-in">
          <div className="users-control-bar">
            <div className="users-search-wrap">
              <Search size={18} className="search-icon" />
              <input
                type="text"
                placeholder="Search users by name, email, or ID..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="users-search-input"
              />
            </div>

            <div className="users-filter-group">
              <button
                type="button"
                className={`user-filter-btn ${selectedUserFilter === 'all' ? 'active' : ''}`}
                onClick={() => setSelectedUserFilter('all')}
              >
                All Users ({userData.length})
              </button>
              <button
                type="button"
                className={`user-filter-btn ${selectedUserFilter === 'with_watchlist' ? 'active' : ''}`}
                onClick={() => setSelectedUserFilter('with_watchlist')}
              >
                With Watchlist ({userData.filter((u) => u.totalItems > 0).length})
              </button>
            </div>
          </div>

          <div className="users-table-container">
            <table className="users-table">
              <thead>
                <tr>
                  <th>User</th>
                  <th>Email</th>
                  <th>Role</th>
                  <th>Watchlist Items</th>
                  <th>Progress</th>
                  <th>Joined Date</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {filteredUsers.map((user) => (
                  <tr key={user.uid}>
                    <td>
                      <div className="user-profile-cell">
                        <div className="user-avatar-circle">
                          {user.displayName ? user.displayName[0].toUpperCase() : 'U'}
                        </div>
                        <div className="user-info-text">
                          <strong className="user-name">{user.displayName || 'MovieHub Member'}</strong>
                          <span className="user-uid">ID: {user.uid}</span>
                        </div>
                      </div>
                    </td>
                    <td className="user-email-cell">{user.email}</td>
                    <td>
                      <span className={`role-badge ${user.role === 'admin' ? 'role-admin' : 'role-user'}`}>
                        {user.role ? user.role.toUpperCase() : 'USER'}
                      </span>
                    </td>
                    <td>
                      <strong className="items-count">{user.totalItems} titles</strong>
                    </td>
                    <td>
                      <div className="progress-cell">
                        <div className="mini-progress-bar">
                          <div 
                            className="mini-progress-fill" 
                            style={{ width: `${user.progressPct}%` }}
                          />
                        </div>
                        <span className="progress-text">{user.watchedCount}/{user.totalItems} watched ({user.progressPct}%)</span>
                      </div>
                    </td>
                    <td className="date-cell">
                      {user.createdAt ? new Date(user.createdAt).toLocaleDateString() : 'Recent'}
                    </td>
                    <td>
                      <span className="status-badge-active">Active</span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
      )}

      {/* TAB 3: THEIR WATCHLISTS PAGE */}
      {activeTab === 'watchlists' && (
        <section className="admin-tab-content watchlists-tab-section animate-fade-in">
          <div className="watchlists-header-summary">
            <h2>User Watchlists Overview</h2>
            <p>Review every user's saved movies, web series, watched status, and undone items.</p>
          </div>

          <div className="users-watchlists-stack">
            {userData.map((user) => (
              <div key={user.uid} className="user-watchlist-card">
                {/* User Watchlist Card Header */}
                <div className="user-wl-header">
                  <div className="user-wl-left">
                    <div className="user-avatar-circle">
                      {user.displayName ? user.displayName[0].toUpperCase() : 'U'}
                    </div>
                    <div>
                      <h3 className="user-wl-name">{user.displayName}</h3>
                      <span className="user-wl-email">{user.email}</span>
                    </div>
                  </div>

                  <div className="user-wl-stats-pill">
                    <div className="wl-stat-item">
                      <span className="stat-num">{user.totalItems}</span>
                      <span className="stat-lbl">Total</span>
                    </div>
                    <div className="wl-stat-item stat-watched">
                      <span className="stat-num">{user.watchedCount}</span>
                      <span className="stat-lbl">Watched</span>
                    </div>
                    <div className="wl-stat-item stat-undone">
                      <span className="stat-num">{user.undoneCount}</span>
                      <span className="stat-lbl">Undone</span>
                    </div>
                  </div>
                </div>

                {/* Movie Posters Gallery */}
                {user.watchlist && user.watchlist.length > 0 ? (
                  <div className="user-movies-horizontal-scroll">
                    {user.watchlist.map((movie) => (
                      <div key={movie.imdbID} className="admin-movie-card">
                        <div className="admin-movie-poster-wrap">
                          {movie.Poster && movie.Poster !== 'N/A' ? (
                            <img src={movie.Poster} alt={movie.Title} />
                          ) : (
                            <div className="poster-placeholder">
                              <Film size={24} />
                            </div>
                          )}
                          <span className={`admin-movie-status-badge ${movie.status === 'watched' ? 'badge-watched' : 'badge-undone'}`}>
                            {movie.status === 'watched' ? '✓ Watched' : '⏳ Plan to Watch'}
                          </span>
                        </div>
                        <div className="admin-movie-info">
                          <h4 className="admin-movie-title" title={movie.Title}>{movie.Title}</h4>
                          <div className="admin-movie-sub">
                            <span>{movie.Year}</span>
                            {movie.imdbRating && <span>★ {movie.imdbRating}</span>}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="empty-user-watchlist">
                    <span>No movies added to watchlist yet.</span>
                  </div>
                )}
              </div>
            ))}
          </div>
        </section>
      )}
    </div>
  );
};

export default Admin;
