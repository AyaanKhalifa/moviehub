import React, { useState, useEffect } from 'react';
import { 
  Shield, 
  Wrench, 
  Users, 
  Bookmark, 
  Sparkles, 
  CheckCircle2, 
  Power, 
  Eye, 
  Search, 
  Film, 
  Clock, 
  LogOut, 
  Save, 
  Trash2, 
  Plus, 
  Edit3, 
  X, 
  Activity, 
  Globe, 
  Check, 
  AlertCircle 
} from 'lucide-react';
import { useAdmin } from '../context/AdminContext';
import { DEFAULT_MAINTENANCE_POEM } from '../utils/adminService';
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
    visitorStats,
    usersData,
    updateMaintenance, 
    adminLogout,
    addUser,
    editUser,
    removeUser,
    addWatchlistMovie,
    toggleWatchlistMovieStatus,
    removeWatchlistMovie,
    clearUserAllWatchlist
  } = useAdmin();

  const [activeTab, setActiveTab] = useState('maintenance'); // 'maintenance' | 'users' | 'watchlists'
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedUserFilter, setSelectedUserFilter] = useState('all');
  const [isCheckingSession, setIsCheckingSession] = useState(true);

  // Form states for Maintenance Tab
  const [isMaintenanceOn, setIsMaintenanceOn] = useState(isMaintenanceActive);
  const [maintenanceTitle, setMaintenanceTitle] = useState(maintenanceConfig.title || '');
  const [maintenancePoem, setMaintenancePoem] = useState(maintenanceConfig.poem || '');
  const [maintenanceEta, setMaintenanceEta] = useState(maintenanceConfig.eta || '');
  const [saveFeedback, setSaveFeedback] = useState('');

  // Modals for User CRUD
  const [showAddUserModal, setShowAddUserModal] = useState(false);
  const [showEditUserModal, setShowEditUserModal] = useState(false);
  const [currentUserToEdit, setCurrentUserToEdit] = useState(null);
  const [userForm, setUserForm] = useState({ displayName: '', email: '', role: 'user', status: 'active' });

  // Modal for Watchlist Add
  const [showAddMovieModal, setShowAddMovieModal] = useState(false);
  const [targetUserId, setTargetUserId] = useState(null);
  const [movieForm, setMovieForm] = useState({ Title: '', Year: '2026', Poster: '', Type: 'movie', imdbRating: '8.0', status: 'undone' });

  const navigate = useNavigate();

  // Guard: wait for session to load before redirecting (prevents race condition)
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsCheckingSession(false);
      if (!isAdmin) {
        navigate('/login?redirect=/admin');
      }
    }, 600);
    return () => clearTimeout(timer);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // If admin status changes while on page, redirect
  useEffect(() => {
    if (!isCheckingSession && !isAdmin) {
      navigate('/login?redirect=/admin');
    }
  }, [isAdmin, isCheckingSession, navigate]);

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

  // User CRUD Handlers
  const handleOpenAddUser = () => {
    setUserForm({ displayName: '', email: '', role: 'user', status: 'active' });
    setShowAddUserModal(true);
  };

  const handleSaveNewUser = (e) => {
    e.preventDefault();
    if (!userForm.email) return;
    addUser(userForm);
    setShowAddUserModal(false);
    setSaveFeedback(`User ${userForm.displayName || userForm.email} created successfully! ✅`);
    setTimeout(() => setSaveFeedback(''), 3500);
  };

  const handleOpenEditUser = (user) => {
    setCurrentUserToEdit(user);
    setUserForm({
      displayName: user.displayName || '',
      email: user.email || '',
      role: user.role || 'user',
      status: user.status || 'active'
    });
    setShowEditUserModal(true);
  };

  const handleSaveEditUser = (e) => {
    e.preventDefault();
    if (!currentUserToEdit) return;
    editUser(currentUserToEdit.uid, userForm);
    setShowEditUserModal(false);
    setSaveFeedback(`User ${userForm.displayName} updated! ✅`);
    setTimeout(() => setSaveFeedback(''), 3500);
  };

  const handleDeleteUser = (user) => {
    if (window.confirm(`Are you sure you want to delete user "${user.displayName || user.email}"?`)) {
      removeUser(user.uid);
      setSaveFeedback(`User deleted. 🗑️`);
      setTimeout(() => setSaveFeedback(''), 3500);
    }
  };

  // Watchlist CRUD Handlers
  const handleOpenAddMovie = (uid) => {
    setTargetUserId(uid);
    setMovieForm({ Title: '', Year: '2026', Poster: '', Type: 'movie', imdbRating: '8.0', status: 'undone' });
    setShowAddMovieModal(true);
  };

  const handleSaveNewMovie = (e) => {
    e.preventDefault();
    if (!targetUserId || !movieForm.Title) return;
    addWatchlistMovie(targetUserId, movieForm);
    setShowAddMovieModal(false);
    setSaveFeedback(`Added "${movieForm.Title}" to watchlist! 🎬`);
    setTimeout(() => setSaveFeedback(''), 3500);
  };

  // Filtered Users
  const filteredUsers = usersData.filter((u) => {
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

  if (isCheckingSession) {
    return (
      <div style={{ minHeight: '60vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#0a0a0a', color: '#f5c518' }}>
        <div style={{ textAlign: 'center' }}>
          <Shield size={40} style={{ marginBottom: '16px', opacity: 0.8 }} />
          <p style={{ fontFamily: 'Inter, sans-serif', fontSize: '1.1rem', opacity: 0.7 }}>Verifying admin session...</p>
        </div>
      </div>
    );
  }

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
              Logged in as <strong>ayaan@habibi.com</strong> &bull; Full CRUD Controls
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

      {/* Live Visitor Statistics Cards (Tracks guest & logged-in visitors) */}
      <div className="admin-metrics-grid">
        <div className="admin-metric-card stat-total-visits">
          <div className="metric-icon-wrap blue">
            <Globe size={22} />
          </div>
          <div className="metric-info">
            <span className="metric-label">Total Site Visitors</span>
            <strong className="metric-value">{visitorStats.totalVisits?.toLocaleString()}</strong>
            <span className="metric-sub">Guests & registered users</span>
          </div>
        </div>

        <div className="admin-metric-card stat-today-visits">
          <div className="metric-icon-wrap green">
            <Activity size={22} />
          </div>
          <div className="metric-info">
            <span className="metric-label">Today's Visits</span>
            <strong className="metric-value">{visitorStats.todayVisits?.toLocaleString()}</strong>
            <span className="metric-sub">Live daily traffic</span>
          </div>
        </div>

        <div className="admin-metric-card stat-unique-visitors">
          <div className="metric-icon-wrap gold">
            <Users size={22} />
          </div>
          <div className="metric-info">
            <span className="metric-label">Unique Devices</span>
            <strong className="metric-value">{visitorStats.uniqueVisitors?.toLocaleString()}</strong>
            <span className="metric-sub">Individual browsers</span>
          </div>
        </div>

        <div className="admin-metric-card stat-pageviews">
          <div className="metric-icon-wrap purple">
            <Film size={22} />
          </div>
          <div className="metric-info">
            <span className="metric-label">Total Page Views</span>
            <strong className="metric-value">{visitorStats.totalPageViews?.toLocaleString()}</strong>
            <span className="metric-sub">All movie / series views</span>
          </div>
        </div>
      </div>

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
          <span>2. User Management ({usersData.length})</span>
        </button>

        <button
          type="button"
          className={`admin-tab-btn ${activeTab === 'watchlists' ? 'active' : ''}`}
          onClick={() => setActiveTab('watchlists')}
        >
          <Bookmark size={18} />
          <span>3. User Watchlists</span>
        </button>
      </nav>

      {/* Global Feedback Banner */}
      {saveFeedback && (
        <div className="admin-save-alert animate-fade-in">
          <CheckCircle2 size={18} />
          <span>{saveFeedback}</span>
        </div>
      )}

      {/* TAB 1: MAINTENANCE MODE */}
      {activeTab === 'maintenance' && (
        <section className="admin-tab-content maintenance-tab-section animate-fade-in">
          {/* Live Switch Banner */}
          <div className={`maintenance-master-toggle-card ${isMaintenanceOn ? 'is-active' : ''}`}>
            <div className="toggle-card-info">
              <div className="toggle-status-header">
                <Power size={22} className={isMaintenanceOn ? 'power-on' : 'power-off'} />
                <h2>Maintenance Mode: <strong>{isMaintenanceOn ? 'ACTIVE (POEM SCREEN ON)' : 'OFF (PUBLIC SITE OPEN)'}</strong></h2>
              </div>
              <p>
                {isMaintenanceOn 
                  ? 'Navbar & Footer remain visible while public visitors see the cinema poem intermission screen.'
                  : 'All pages (Home, Movies, Series, Anime, Search, Watchlist) are fully open.'}
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

      {/* TAB 2: USERS MANAGEMENT (FULL CRUD) */}
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

            <div className="users-actions-right">
              <div className="users-filter-group">
                <button
                  type="button"
                  className={`user-filter-btn ${selectedUserFilter === 'all' ? 'active' : ''}`}
                  onClick={() => setSelectedUserFilter('all')}
                >
                  All Users ({usersData.length})
                </button>
                <button
                  type="button"
                  className={`user-filter-btn ${selectedUserFilter === 'with_watchlist' ? 'active' : ''}`}
                  onClick={() => setSelectedUserFilter('with_watchlist')}
                >
                  With Watchlist ({usersData.filter((u) => u.totalItems > 0).length})
                </button>
              </div>

              {/* CREATE USER BUTTON */}
              <button
                type="button"
                className="admin-create-btn"
                onClick={handleOpenAddUser}
              >
                <Plus size={16} />
                <span>Add New User</span>
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
                  <th>Watched vs Undone</th>
                  <th>Status</th>
                  <th>Actions</th>
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
                        <span className="progress-text">{user.watchedCount} done / {user.undoneCount} undone ({user.progressPct}%)</span>
                      </div>
                    </td>
                    <td>
                      <span className={`status-badge ${user.status === 'suspended' ? 'status-suspended' : 'status-badge-active'}`}>
                        {user.status === 'suspended' ? 'Suspended' : 'Active'}
                      </span>
                    </td>
                    <td>
                      <div className="table-actions-cell">
                        <button
                          type="button"
                          className="table-action-btn edit-btn"
                          onClick={() => handleOpenEditUser(user)}
                          title="Edit User"
                        >
                          <Edit3 size={15} />
                        </button>
                        <button
                          type="button"
                          className="table-action-btn delete-btn"
                          onClick={() => handleDeleteUser(user)}
                          title="Delete User"
                        >
                          <Trash2 size={15} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
      )}

      {/* TAB 3: WATCHLISTS MANAGEMENT (FULL CRUD) */}
      {activeTab === 'watchlists' && (
        <section className="admin-tab-content watchlists-tab-section animate-fade-in">
          <div className="watchlists-header-summary">
            <div>
              <h2>User Watchlists (Full CRUD Management)</h2>
              <p>Add titles, toggle watched status, remove movies, or manage any user's watchlist.</p>
            </div>
          </div>

          <div className="users-watchlists-stack">
            {usersData.map((user) => (
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

                  <div className="user-wl-actions-group">
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

                    <button
                      type="button"
                      className="add-movie-to-user-btn"
                      onClick={() => handleOpenAddMovie(user.uid)}
                    >
                      <Plus size={14} />
                      <span>Add Title</span>
                    </button>

                    {user.totalItems > 0 && (
                      <button
                        type="button"
                        className="clear-user-wl-btn"
                        onClick={() => {
                          if (window.confirm(`Clear all watchlist items for ${user.displayName}?`)) {
                            clearUserAllWatchlist(user.uid);
                          }
                        }}
                      >
                        Clear All
                      </button>
                    )}
                  </div>
                </div>

                {/* Movie Posters Gallery with CRUD Controls */}
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
                          <button
                            type="button"
                            className={`admin-movie-status-badge ${movie.status === 'watched' ? 'badge-watched' : 'badge-undone'}`}
                            onClick={() => toggleWatchlistMovieStatus(user.uid, movie.imdbID, movie.status)}
                            title="Click to toggle status"
                          >
                            {movie.status === 'watched' ? '✓ Watched' : '⏳ Undone'}
                          </button>
                          <button
                            type="button"
                            className="remove-movie-btn"
                            onClick={() => removeWatchlistMovie(user.uid, movie.imdbID)}
                            title="Remove movie"
                          >
                            <Trash2 size={13} />
                          </button>
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
                    <span>No movies added yet. Click <strong>"Add Title"</strong> above to assign a movie.</span>
                  </div>
                )}
              </div>
            ))}
          </div>
        </section>
      )}

      {/* CREATE USER MODAL */}
      {showAddUserModal && (
        <div className="admin-modal-backdrop" onClick={() => setShowAddUserModal(false)}>
          <div className="admin-modal-card" onClick={(e) => e.stopPropagation()}>
            <div className="admin-modal-header">
              <h3>Add New User</h3>
              <button type="button" className="admin-modal-close" onClick={() => setShowAddUserModal(false)}>
                <X size={18} />
              </button>
            </div>
            <form onSubmit={handleSaveNewUser} className="admin-modal-form">
              <div className="admin-form-group">
                <label>Display Name</label>
                <input
                  type="text"
                  placeholder="e.g. John Wick"
                  value={userForm.displayName}
                  onChange={(e) => setUserForm({ ...userForm, displayName: e.target.value })}
                  className="admin-input"
                  required
                />
              </div>
              <div className="admin-form-group">
                <label>Email Address</label>
                <input
                  type="email"
                  placeholder="e.g. john@wick.com"
                  value={userForm.email}
                  onChange={(e) => setUserForm({ ...userForm, email: e.target.value })}
                  className="admin-input"
                  required
                />
              </div>
              <div className="admin-form-group">
                <label>Role</label>
                <select
                  value={userForm.role}
                  onChange={(e) => setUserForm({ ...userForm, role: e.target.value })}
                  className="admin-input"
                >
                  <option value="user">User</option>
                  <option value="admin">Admin</option>
                </select>
              </div>
              <div className="admin-form-group">
                <label>Status</label>
                <select
                  value={userForm.status}
                  onChange={(e) => setUserForm({ ...userForm, status: e.target.value })}
                  className="admin-input"
                >
                  <option value="active">Active</option>
                  <option value="suspended">Suspended</option>
                </select>
              </div>
              <button type="submit" className="admin-save-btn">
                <span>Create User</span>
              </button>
            </form>
          </div>
        </div>
      )}

      {/* EDIT USER MODAL */}
      {showEditUserModal && (
        <div className="admin-modal-backdrop" onClick={() => setShowEditUserModal(false)}>
          <div className="admin-modal-card" onClick={(e) => e.stopPropagation()}>
            <div className="admin-modal-header">
              <h3>Edit User Details</h3>
              <button type="button" className="admin-modal-close" onClick={() => setShowEditUserModal(false)}>
                <X size={18} />
              </button>
            </div>
            <form onSubmit={handleSaveEditUser} className="admin-modal-form">
              <div className="admin-form-group">
                <label>Display Name</label>
                <input
                  type="text"
                  value={userForm.displayName}
                  onChange={(e) => setUserForm({ ...userForm, displayName: e.target.value })}
                  className="admin-input"
                  required
                />
              </div>
              <div className="admin-form-group">
                <label>Email Address</label>
                <input
                  type="email"
                  value={userForm.email}
                  onChange={(e) => setUserForm({ ...userForm, email: e.target.value })}
                  className="admin-input"
                  required
                />
              </div>
              <div className="admin-form-group">
                <label>Role</label>
                <select
                  value={userForm.role}
                  onChange={(e) => setUserForm({ ...userForm, role: e.target.value })}
                  className="admin-input"
                >
                  <option value="user">User</option>
                  <option value="admin">Admin</option>
                </select>
              </div>
              <div className="admin-form-group">
                <label>Status</label>
                <select
                  value={userForm.status}
                  onChange={(e) => setUserForm({ ...userForm, status: e.target.value })}
                  className="admin-input"
                >
                  <option value="active">Active</option>
                  <option value="suspended">Suspended</option>
                </select>
              </div>
              <button type="submit" className="admin-save-btn">
                <span>Update User</span>
              </button>
            </form>
          </div>
        </div>
      )}

      {/* ADD MOVIE TO WATCHLIST MODAL */}
      {showAddMovieModal && (
        <div className="admin-modal-backdrop" onClick={() => setShowAddMovieModal(false)}>
          <div className="admin-modal-card" onClick={(e) => e.stopPropagation()}>
            <div className="admin-modal-header">
              <h3>Add Title to User's Watchlist</h3>
              <button type="button" className="admin-modal-close" onClick={() => setShowAddMovieModal(false)}>
                <X size={18} />
              </button>
            </div>
            <form onSubmit={handleSaveNewMovie} className="admin-modal-form">
              <div className="admin-form-group">
                <label>Movie / Show Title</label>
                <input
                  type="text"
                  placeholder="e.g. Inception"
                  value={movieForm.Title}
                  onChange={(e) => setMovieForm({ ...movieForm, Title: e.target.value })}
                  className="admin-input"
                  required
                />
              </div>
              <div className="admin-form-group">
                <label>Release Year</label>
                <input
                  type="text"
                  placeholder="e.g. 2010"
                  value={movieForm.Year}
                  onChange={(e) => setMovieForm({ ...movieForm, Year: e.target.value })}
                  className="admin-input"
                />
              </div>
              <div className="admin-form-group">
                <label>Poster Image URL</label>
                <input
                  type="url"
                  placeholder="https://...poster.jpg"
                  value={movieForm.Poster}
                  onChange={(e) => setMovieForm({ ...movieForm, Poster: e.target.value })}
                  className="admin-input"
                />
              </div>
              <div className="admin-form-group">
                <label>Status</label>
                <select
                  value={movieForm.status}
                  onChange={(e) => setMovieForm({ ...movieForm, status: e.target.value })}
                  className="admin-input"
                >
                  <option value="undone">Undone (Plan to Watch)</option>
                  <option value="watched">Watched (Completed)</option>
                </select>
              </div>
              <button type="submit" className="admin-save-btn">
                <span>Add to Watchlist</span>
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Admin;
