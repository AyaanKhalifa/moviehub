import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Mail, Film, ArrowLeft, AlertCircle, CheckCircle2, Send } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import './Auth.css';

const ForgotPassword = () => {
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const { resetPassword } = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email) {
      setError('Please enter your email address.');
      return;
    }

    try {
      setError('');
      setSubmitting(true);
      await resetPassword(email);
      setSuccess(true);
    } catch (err) {
      const msg = err.code || err.message || '';
      if (msg.includes('user-not-found')) {
        setError('No account found with this email address.');
      } else if (msg.includes('invalid-email')) {
        setError('Please enter a valid email address.');
      } else {
        setError(err.message || 'Failed to send password reset email. Please try again.');
      }
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="auth-page-container">
      <div className="auth-card animate-fade-in">
        <div className="auth-brand-wrap">
          <div className="auth-logo-badge">
            <Film size={26} className="auth-film-icon" />
          </div>
          <h1 className="auth-title">Reset Password</h1>
          <p className="auth-subtitle">
            Enter your email and we'll send you a secure link to reset your password.
          </p>
        </div>

        {error && (
          <div className="auth-error-alert animate-fade-in">
            <AlertCircle size={18} className="error-icon" />
            <span>{error}</span>
          </div>
        )}

        {success ? (
          <div className="auth-success-card animate-fade-in">
            <div className="success-icon-wrap">
              <CheckCircle2 size={44} className="success-icon" />
            </div>
            <h3 className="success-title">Check Your Email</h3>
            <p className="success-desc">
              We have sent a password reset link to <strong>{email}</strong>. Please check your inbox (and spam folder) and follow the instructions.
            </p>
            <Link to="/login" className="auth-submit-btn back-login-btn">
              <ArrowLeft size={18} />
              <span>Back to Sign In</span>
            </Link>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="auth-form">
            <div className="form-group">
              <label className="form-label" htmlFor="email">Your Account Email</label>
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

            <button
              type="submit"
              className="auth-submit-btn"
              disabled={submitting}
            >
              {submitting ? (
                <span className="btn-loading">Sending Reset Link...</span>
              ) : (
                <>
                  <span>Send Reset Link</span>
                  <Send size={16} />
                </>
              )}
            </button>

            <div className="auth-back-row">
              <Link to="/login" className="back-link">
                <ArrowLeft size={16} />
                <span>Return to Sign In</span>
              </Link>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};

export default ForgotPassword;
