import { BarChart3 } from 'lucide-react';

export default function AnalyticsPage() {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: '60vh', gap: 16 }}>
      <BarChart3 size={48} style={{ color: 'var(--color-accent-sage-muted)' }} />
      <h2 style={{ fontSize: 24, fontWeight: 600, color: 'var(--color-text-primary)' }}>Analytics</h2>
      <p style={{ color: 'var(--color-text-muted)', fontSize: 14 }}>Your mood analytics dashboard is coming soon.</p>
    </div>
  );
}
