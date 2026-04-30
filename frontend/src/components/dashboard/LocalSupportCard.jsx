import { ArrowRight, MapPin } from 'lucide-react';

// Simple SVG world-map placeholder (no API key needed for the dashboard preview)
function MapPlaceholder() {
  return (
    <svg viewBox="0 0 400 200" xmlns="http://www.w3.org/2000/svg" style={{ width: '100%', height: '100%' }}>
      {/* Simplified world map shapes */}
      <rect width="400" height="200" fill="#E8EDE8" />
      {/* Americas */}
      <ellipse cx="120" cy="80" rx="40" ry="55" fill="#4A5E4A" opacity="0.18" />
      <ellipse cx="115" cy="140" rx="20" ry="30" fill="#4A5E4A" opacity="0.15" />
      {/* Europe/Africa */}
      <ellipse cx="220" cy="75" rx="25" ry="35" fill="#4A5E4A" opacity="0.18" />
      <ellipse cx="225" cy="130" rx="20" ry="40" fill="#4A5E4A" opacity="0.15" />
      {/* Asia */}
      <ellipse cx="310" cy="70" rx="50" ry="40" fill="#4A5E4A" opacity="0.18" />
      <ellipse cx="330" cy="140" rx="25" ry="25" fill="#4A5E4A" opacity="0.12" />
      {/* Pin */}
      <circle cx="225" cy="85" r="5" fill="#C08B76" />
      <circle cx="225" cy="85" r="10" fill="#C08B76" opacity="0.25" />
    </svg>
  );
}

export default function LocalSupportCard() {
  return (
    <div className="card local-support-card" id="local-support-card">
      <div className="card-header">
        <h3 className="card-title">Local Support</h3>
        <MapPin size={18} style={{ color: 'var(--color-text-muted)' }} />
      </div>

      <div className="support-map-placeholder">
        <MapPlaceholder />
      </div>

      <div className="support-location">
        <div className="support-location-info">
          <h4>MindMate Care Center</h4>
          <p>2.4 miles away</p>
        </div>
        <button className="support-arrow" aria-label="View details">
          <ArrowRight size={16} />
        </button>
      </div>
    </div>
  );
}
