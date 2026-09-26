import React, { useState } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { Mail, Lock, Film, ArrowRight, AlertCircle, Sparkles, Eye, EyeOff, Shield, KeyRound, User } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useAdmin } from '../context/AdminContext';
import './Auth.css';

const Login = () => {
  const [isAdminMode, setIsAdminMode] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [adminPin, setAdminPin] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const { login, signInWithGoogle } = useAuth();
  const { adminLogin } = useAdmin();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const redirectUrl = searchParams.get('redirect') || (isAdminMode ? '/admin' : '/');

  const formatFirebaseError = (err) => {
    const msg = err.code || err.message || '';
    if (msg.includes('user-not-found') || msg.includes('wrong-password') || msg.includes('invalid-credential')) {
      return 'Invalid email or password. Please try again.';
    }
    if (msg.includes('invalid-email')) {
      return 'Please enter a valid email address.';
    }
    if (msg.includes('too-many-requests')) {
      return 'Too many unsuccessful attempts. Please try again later or reset password.';
    }
    return err.message || 'Failed to sign in. Please verify your credentials.';
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    // Handle Admin Mode Login
    if (isAdminMode) {
      if (!adminPin && !email) {
        setError('Please enter the master Admin PIN (443244) or admin credentials.');
        return;
      }

      setSubmitting(true);
      const res = adminLogin(adminPin || email, password);
      setSubmitting(false);

      if (res.success) {
        navigate('/admin');
      } else {
        setError(res.error || 'Invalid admin credentials or PIN.');
      }
      return;
    }

    // Standard User Login
    if (!email || !password) {
      setError('Please fill in both email and password.');
      return;
    }

    try {
      setSubmitting(true);
      await login(email, password);
      navigate(redirectUrl);
    } catch (err) {
      setError(formatFirebaseError(err));
    } finally {
      setSubmitting(false);
    }
  };

  const handleGoogleSignIn = async () => {
    try {
      setError('');
      setSubmitting(true);
      await signInWithGoogle();
      navigate(redirectUrl);
    } catch (err) {
      setError(formatFirebaseError(err));
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="auth-page-container">
      <div className="auth-card animate-fade-in">
        {/* Portal Switcher (User vs Admin) */}
        <div className="auth-role-switcher">
          <button
            type="button"
            className={`role-tab-btn ${!isAdminMode ? 'active' : ''}`}
            onClick={() => {
              setIsAdminMode(false);
              setError('');
            }}
          >
            <User size={15} />
            <span>Member Login</span>
          </button>
          <button
            type="button"
            className={`role-tab-btn ${isAdminMode ? 'active admin-active' : ''}`}
            onClick={() => {
              setIsAdminMode(true);
              setError('');
            }}
          >
            <Shield size={15} />
            <span>Admin Portal</span>
          </button>
        </div>

        {/* Brand Header */}
        <div className="auth-brand-wrap">
          <div className={`auth-logo-badge ${isAdminMode ? 'admin-badge-glow' : ''}`}>
            {isAdminMode ? (
              <Shield size={26} className="auth-film-icon gold-shield" />
            ) : (
              <Film size={26} className="auth-film-icon" />
            )}
          </div>
          <h1 className="auth-title">
            {isAdminMode ? 'Admin Command Center' : 'Welcome Back'}
          </h1>
          <p className="auth-subtitle">
            {isAdminMode
              ? 'Enter admin master PIN (443244) or admin email (ayaan@habibi.com) to manage maintenance, users, and watchlists.'
              : 'Sign in to access your Watchlist, track watched movies, and customize your experience.'}
          </p>
        </div>

        {/* Error Alert */}
        {error && (
          <div className="auth-error-alert animate-fade-in">
            <AlertCircle size={18} className="error-icon" />
            <span>{error}</span>
          </div>
        )}

        {/* Google 1-Click Sign In (Only in User Mode) */}
        {!isAdminMode && (
          <>
            <button
              type="button"
              className="google-auth-btn"
              onClick={handleGoogleSignIn}
              disabled={submitting}
            >
              <svg className="google-icon" viewBox="0 0 24 24" width="20" height="20">
                <path
                  fill="#4285F4"
                  d="M23.745 12.27c0-.7-.06-1.4-.19-2.07H12v4.51h6.6c-.29 1.52-1.14 2.82-2.4 3.68v3.05h3.88c2.27-2.09 3.66-5.17 3.66-9.17z"
                />
                <path
                  fill="#34A853"
                  d="M12 24c3.24 0 5.95-1.08 7.93-2.91l-3.88-3.05c-1.08.72-2.45 1.16-4.05 1.16-3.12 0-5.77-2.1-6.72-4.93H1.25v3.15C3.26 21.36 7.34 24 12 24z"
                />
                <path
                  fill="#FBBC05"
                  d="M5.28 14.27c-.25-.72-.38-1.49-.38-2.27s.13-1.55.38-2.27V6.58H1.25C.45 8.18 0 10.03 0 12s.45 3.82 1.25 5.42l4.03-3.15z"
                />
                <path
                  fill="#EA4335"
                  d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42C17.95 1.19 15.24 0 12 0 7.34 0 3.26 2.64 1.25 6.58l4.03 3.15c.95-2.83 3.6-4.98 6.72-4.98z"
                />
              </svg>
              <span>Continue with Google</span>
            </button>

            <div className="auth-divider">
              <span>or sign in with email</span>
            </div>
          </>
        )}

        {/* Email & Password / Admin PIN Form */}
        <form onSubmit={handleSubmit} className="auth-form">
          {isAdminMode ? (
            /* Admin Mode Input */
            <div className="form-group">
              <label className="form-label" htmlFor="adminPin">Admin Master PIN or Key</label>
              <div className="input-wrap">
                <KeyRound size={18} className="input-icon" />
                <input
                  id="adminPin"
                  type="password"
                  className="form-input"
                  placeholder="Enter PIN (443244)"
                  value={adminPin}
                  onChange={(e) => setAdminPin(e.target.value)}
                  autoFocus
                  required
                />
              </div>
              <span className="admin-hint-text">Master PIN: <strong>443244</strong> &bull; Email: <strong>ayaan@habibi.com</strong></span>
            </div>
          ) : (
            /* User Mode Inputs */
            <>
              <div className="form-group">
                <label className="form-label" htmlFor="email">Email Address</label>
                <div className="input-wrap">
                  <Mail size={18} className="input-icon" />
                  <input
                    id="email"
                    type="email"
                    className="form-input"
                    placeholder="name@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    autoComplete="email"
                  />
                </div>
              </div>

              <div className="form-group">
                <div className="password-header-row">
                  <label className="form-label" htmlFor="password">Password</label>
                  <Link to="/forgot-password" className="forgot-password-link">
                    Forgot password?
                  </Link>
                </div>
                <div className="input-wrap">
                  <Lock size={18} className="input-icon" />
                  <input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    className="form-input password-input"
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    autoComplete="current-password"
                  />
                  <button 
                    type="button" 
                    className="password-toggle-btn"
                    onClick={() => setShowPassword(!showPassword)}
                    aria-label="Toggle password visibility"
                    style={{ background: 'transparent', border: 'none', color: '#999', cursor: 'pointer', position: 'absolute', right: '12px', display: 'flex', alignItems: 'center' }}
                  >
                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
              </div>
            </>
          )}

          <button
            type="submit"
            className={`auth-submit-btn ${isAdminMode ? 'admin-submit-btn' : ''}`}
            disabled={submitting}
          >
            {submitting ? (
              <span className="btn-loading">{isAdminMode ? 'Verifying...' : 'Signing in...'}</span>
            ) : (
              <>
                <span>{isAdminMode ? 'Unlock Admin Portal' : 'Sign In'}</span>
                <ArrowRight size={18} />
              </>
            )}
          </button>
        </form>

        {/* Footer Link */}
        {!isAdminMode && (
          <div className="auth-footer-prompt">
            <span>Don't have an account? </span>
            <Link to={`/register${redirectUrl !== '/' ? `?redirect=${encodeURIComponent(redirectUrl)}` : ''}`} className="auth-switch-link">
              Create an Account
            </Link>
          </div>
        )}
      </div>
    </div>
  );
};

export default Login;

