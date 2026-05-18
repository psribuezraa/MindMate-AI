import React from 'react';
import { Link, Navigate } from 'react-router-dom';
import { Sparkles, Brain, Heart, Shield, ArrowRight } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export default function LandingPage() {
  const { isAuthenticated } = useAuth();

  // If already logged in, redirect to dashboard so they don't see the public landing page.
  // This is optional, but common for apps.
  if (isAuthenticated) {
    return <Navigate to="/dashboard" replace />;
  }

  return (
    <div className="landing-container">
      {/* Navbar */}
      <nav className="landing-nav">
        <div className="landing-nav-content">
          <div className="landing-logo">
            <div className="landing-logo-icon">
              <Sparkles size={24} />
            </div>
            <span>MindMate AI</span>
          </div>
          <div className="landing-nav-actions">
            <Link to="/login" className="landing-btn-outline">Sign In</Link>
            <Link to="/register" className="landing-btn-primary">Get Started</Link>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <main className="landing-main">
        <div className="hero-section">
          <div className="hero-badge">
            <Sparkles size={16} />
            <span>Your Personal Mental Wellness Companion</span>
          </div>
          <h1 className="hero-title">
            Find Peace in a <br/>
            <span className="text-gradient">Chaotic World</span>
          </h1>
          <p className="hero-subtitle">
            MindMate AI uses advanced artificial intelligence to provide personalized emotional support, guided mindfulness, and therapeutic soundscapes tailored to your current state of mind.
          </p>
          <div className="hero-actions">
            <Link to="/register" className="landing-btn-primary hero-btn">
              Start Your Journey <ArrowRight size={20} />
            </Link>
          </div>
        </div>

        {/* Features Preview */}
        <div className="features-grid">
          <div className="feature-card">
            <div className="feature-icon sage">
              <Brain size={24} />
            </div>
            <h3>AI Emotion Tracking</h3>
            <p>Understand your emotional patterns with intelligent daily mood analysis and insights.</p>
          </div>
          <div className="feature-card">
            <div className="feature-icon blush">
              <Heart size={24} />
            </div>
            <h3>Guided Mindfulness</h3>
            <p>Personalized breathing exercises and intentions adapted to how you feel right now.</p>
          </div>
          <div className="feature-card">
            <div className="feature-icon rose">
              <Shield size={24} />
            </div>
            <h3>Private Sanctuary</h3>
            <p>A safe, judgment-free space to shred negative thoughts and cultivate positivity.</p>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="landing-footer">
        <div className="footer-content">
          <div className="footer-brand">
            <div className="landing-logo-icon small">
              <Sparkles size={16} />
            </div>
            <span>MindMate AI</span>
          </div>
          <p className="footer-copyright">
            &copy; {new Date().getFullYear()} MindMate AI. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
}
