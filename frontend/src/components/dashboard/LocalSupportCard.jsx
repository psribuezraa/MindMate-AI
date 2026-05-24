import { ArrowRight, MapPin } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export default function LocalSupportCard() {
  const navigate = useNavigate();

  return (
    <div className="card local-support-card" id="local-support-card">
      <div className="card-header">
        <h3 className="card-title">Local Support</h3>
        <MapPin size={18} style={{ color: 'var(--color-text-muted)' }} />
      </div>

      <div className="support-map-placeholder">
        <MapPin size={32} style={{ color: 'var(--color-accent-sage-muted)', opacity: 0.5 }} />
      </div>

      <div className="support-location">
        <div className="support-location-info">
          <h4>Find therapists near you</h4>
          <p>Mental health clinics & crisis hotlines</p>
        </div>
        <button
          className="support-arrow"
          aria-label="View local support"
          onClick={() => navigate('/dashboard/support')}
        >
          <ArrowRight size={16} />
        </button>
      </div>
    </div>
  );
}
