import React, { useState } from 'react';
import { Link } from 'react-router-dom';

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('');
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    // Handle forgot password submission
    console.log({ email });
    setIsSubmitted(true);
  };

  return (
    <div className="auth-container">
      <div className="auth-card">
        <div className="auth-header">
          <h1 className="auth-title">Reset Password</h1>
          <p className="auth-subtitle">
            {isSubmitted
              ? "Check your email for instructions"
              : "Enter your email to receive a reset link"}
          </p>
        </div>

        {!isSubmitted ? (
          <form onSubmit={handleSubmit} className="auth-form">
            <div className="auth-form-group">
              <label className="auth-label">Email</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="auth-input"
                placeholder="Enter your email"
                required
              />
            </div>

            <button type="submit" className="auth-button">
              Send Reset Link
            </button>
          </form>
        ) : (
          <div className="auth-form" style={{ textAlign: 'center' }}>
            <div style={{
              width: '64px',
              height: '64px',
              background: 'var(--color-bg-sage-light)',
              color: 'var(--color-accent-sage)',
              borderRadius: '50%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              margin: '0 auto 16px',
              fontSize: '32px'
            }}>
              ✓
            </div>
            <p style={{ color: 'var(--color-text-secondary)', marginBottom: '16px', lineHeight: '1.6' }}>
              We've sent a password reset link to <br /><strong>{email}</strong>.
            </p>
            <button
              onClick={() => setIsSubmitted(false)}
              className="auth-link"
              style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: '14px', width: '100%' }}
            >
              Didn't receive the email? Try again
            </button>
          </div>
        )}

        <div className="auth-footer">
          Remember your password?{' '}
          <Link to="/login" className="auth-link" style={{ fontSize: '14px' }}>
            Back to Sign In
          </Link>
        </div>
      </div>
    </div>
  );
}
