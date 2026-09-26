import React, { useState } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { Mail, Lock, Film, ArrowRight, AlertCircle, Eye, EyeOff } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useAdmin } from '../context/AdminContext';
import './Auth.css';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const { login, signInWithGoogle } = useAuth();
  const { adminLogin } = useAdmin();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const redirectUrl = searchParams.get('redirect') || '/';

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

    const trimmedEmail = email.trim().toLowerCase();
    const trimmedPass = password.trim();

    if (!trimmedEmail || !trimmedPass) {
      setError('Please fill in both email and password.');
      return;
    }

    // Direct Admin Recognition (ayaan@habibi.com + 443244 or Master PIN 443244)
    if (
      (trimmedEmail === 'ayaan@habibi.com' && trimmedPass === '443244') ||
      (trimmedEmail === 'admin' && trimmedPass === '443244') ||
      (trimmedEmail === '443244' || trimmedPass === '443244' && trimmedEmail.includes('ayaan'))
    ) {
      adminLogin('ayaan@habibi.com', '443244');
      navigate('/admin');
      return;
    }

    // Standard User Login
    try {
      setSubmitting(true);
      await login(email, password);
      navigate(redirectUrl);
    } catch (err) {
      // Fallback check for admin credentials
      if (trimmedEmail === 'ayaan@habibi.com' && trimmedPass === '443244') {
        adminLogin('ayaan@habibi.com', '443244');
        navigate('/admin');
        return;
      }
      setError(formatFirebaseError(err));
    } finally {
      setSubmitting(false);
    }
  };

  const handleGoogleSignIn = async () => {
    try {
      setError('');
      setSubmitting(true);
      const res = await signInWithGoogle();
      if (res?.user?.email === 'ayaan@habibi.com') {
        adminLogin('ayaan@habibi.com', '443244');
        navigate('/admin');
      } else {
        navigate(redirectUrl);
      }
    } catch (err) {
      setError(formatFirebaseError(err));
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="auth-page-container">
      <div className="auth-card animate-fade-in">
        {/* Brand Header */}
        <div className="auth-brand-wrap">
          <div className="auth-logo-badge">
            <Film size={26} className="auth-film-icon" />
          </div>
          <h1 className="auth-title">Welcome Back</h1>
          <p className="auth-subtitle">
            Sign in to access your Watchlist, track watched movies, and customize your experience.
          </p>
        </div>

        {/* Error Alert */}
        {error && (
          <div className="auth-error-alert animate-fade-in">
            <AlertCircle size={18} className="error-icon" />
            <span>{error}</span>
          </div>
        )}

        {/* Google 1-Click Sign In */}
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

        {/* Regular Unified Email & Password Form */}
        <form onSubmit={handleSubmit} className="auth-form">
          <div className="form-group">
            <label className="form-label" htmlFor="email">Email Address</label>
            <div className="input-wrap">
              <Mail size={18} className="input-icon" />
              <input
                id="email"
                type="text"
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

          <button
            type="submit"
            className="auth-submit-btn"
            disabled={submitting}
          >
            {submitting ? (
              <span className="btn-loading">Signing in...</span>
            ) : (
              <>
                <span>Sign In</span>
                <ArrowRight size={18} />
              </>
            )}
          </button>
        </form>

        {/* Footer Link */}
        <div className="auth-footer-prompt">
          <span>Don't have an account? </span>
          <Link to={`/register${redirectUrl !== '/' ? `?redirect=${encodeURIComponent(redirectUrl)}` : ''}`} className="auth-switch-link">
            Create an Account
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Login;
