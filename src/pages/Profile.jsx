import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { 
  User, 
  Mail, 
  Calendar, 
  Film, 
  CheckCircle2, 
  Clock, 
  LogOut, 
  Edit3, 
  Save, 
  ShieldCheck, 
  Bookmark, 
  Sparkles,
  ArrowRight
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useWatchlist } from '../context/WatchlistContext';
import './Profile.css';

const Profile = () => {
  const { currentUser, logout, updateProfileName } = useAuth();
  const { watchlist, watchedCount, undoneCount, totalCount, progressPercentage } = useWatchlist();
  const navigate = useNavigate();

  const [isEditing, setIsEditing] = useState(false);
  const [displayName, setDisplayName] = useState(currentUser?.displayName || '');
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState('');

  if (!currentUser) {
    navigate('/login?redirect=/profile');
    return null;
  }

  const handleSaveName = async (e) => {
    e.preventDefault();
    if (!displayName.trim()) return;

    try {
      setSaving(true);
      setMessage('');
      await updateProfileName(displayName.trim());
      setIsEditing(false);
      setMessage('Profile updated successfully!');
      setTimeout(() => setMessage(''), 3000);
    } catch {
      setMessage('Failed to update profile.');
    } finally {
      setSaving(false);
    }
  };

  const handleLogout = async () => {
    try {
      await logout();
      navigate('/login');
    } catch (e) {
      console.error('Logout error:', e);
    }
  };

  const userInitial = (currentUser.displayName || currentUser.email || 'U')[0].toUpperCase();
  const memberSince = currentUser.metadata?.creationTime
    ? new Date(currentUser.metadata.creationTime).toLocaleDateString('en-US', {
        month: 'long',
        year: 'numeric'
      })
    : 'Recently';

  return (
    <div className="container profile-page-container animate-fade-in">
      {/* Profile Header Card */}
      <div className="profile-hero-card">
        <div className="profile-avatar-wrapper">
          {currentUser.photoURL ? (
            <img
              src={currentUser.photoURL}
              alt={currentUser.displayName || 'Profile'}
              className="profile-avatar-img"
            />
          ) : (
            <div className="profile-avatar-fallback">
              <span>{userInitial}</span>
            </div>
          )}
          <div className="profile-avatar-ring"></div>
        </div>

        <div className="profile-hero-info">
          <div className="profile-badge-row">
            <span className="profile-role-pill">
              <ShieldCheck size={14} /> Verified Member
            </span>
            <span className="profile-since-pill">
              <Calendar size={13} /> Member since {memberSince}
            </span>
          </div>

          {isEditing ? (
            <form onSubmit={handleSaveName} className="profile-name-edit-form">
              <input
                type="text"
                value={displayName}
                onChange={(e) => setDisplayName(e.target.value)}
                className="profile-edit-input"
                placeholder="Enter your name"
                autoFocus
              />
              <button type="submit" className="profile-save-btn" disabled={saving}>
                <Save size={15} /> Save
              </button>
              <button
                type="button"
                className="profile-cancel-btn"
                onClick={() => setIsEditing(false)}
              >
                Cancel
              </button>
            </form>
          ) : (
            <div className="profile-name-row">
              <h1 className="profile-user-name">
                {currentUser.displayName || 'Movie Fan'}
              </h1>
              <button
                className="profile-edit-btn"
                onClick={() => setIsEditing(true)}
                title="Edit name"
              >
                <Edit3 size={15} />
              </button>
            </div>
          )}

          <p className="profile-user-email">
            <Mail size={15} /> {currentUser.email}
          </p>

          {message && <div className="profile-toast">{message}</div>}
        </div>

        <button className="profile-logout-btn" onClick={handleLogout}>
          <LogOut size={16} />
          <span>Sign Out</span>
        </button>
      </div>

      {/* Watchlist & Cinema Activity Stats */}
      <div className="profile-stats-grid">
        <div className="profile-stat-box stat-total">
          <div className="stat-icon-wrap">
            <Bookmark size={24} className="stat-box-icon" />
          </div>
          <div className="stat-text-group">
            <span className="stat-box-num">{totalCount}</span>
            <span className="stat-box-label">In Watchlist</span>
          </div>
        </div>

        <div className="profile-stat-box stat-watched">
          <div className="stat-icon-wrap green">
            <CheckCircle2 size={24} className="stat-box-icon green" />
          </div>
          <div className="stat-text-group">
            <span className="stat-box-num">{watchedCount}</span>
            <span className="stat-box-label">Movies Watched (Done)</span>
          </div>
        </div>

        <div className="profile-stat-box stat-undone">
          <div className="stat-icon-wrap amber">
            <Clock size={24} className="stat-box-icon amber" />
          </div>
          <div className="stat-text-group">
            <span className="stat-box-num">{undoneCount}</span>
            <span className="stat-box-label">To Watch (Undone)</span>
          </div>
        </div>
      </div>

      {/* Watch Progress Bar */}
      <div className="profile-progress-card">
        <div className="progress-header">
          <div className="progress-title-wrap">
            <Sparkles size={18} className="progress-icon" />
            <h3 className="progress-title">Watchlist Progress</h3>
          </div>
          <span className="progress-percent-badge">{progressPercentage}% Completed</span>
        </div>

        <div className="progress-track">
          <div
            className="progress-fill"
            style={{ width: `${progressPercentage}%` }}
          ></div>
        </div>

        <div className="progress-footer">
          <span>{watchedCount} of {totalCount} titles watched</span>
          <Link to="/watchlist" className="view-watchlist-link">
            <span>Manage Watchlist</span>
            <ArrowRight size={14} />
          </Link>
        </div>
      </div>

      {/* Admin Portal Quick Access */}
      <div className="profile-admin-shortcut-card">
        <div className="admin-shortcut-info">
          <ShieldCheck size={20} className="gold-shield-icon" />
          <div>
            <h4>Admin Command Center</h4>
            <p>Manage Maintenance Mode, Registered Users, and All User Watchlists.</p>
          </div>
        </div>
        <Link to="/admin" className="admin-shortcut-btn">
          <span>Open Admin Portal</span>
          <ArrowRight size={15} />
        </Link>
      </div>
    </div>
  );
};

export default Profile;
