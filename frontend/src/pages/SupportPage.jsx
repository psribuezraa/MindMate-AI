import { HeartHandshake } from 'lucide-react';

export default function SupportPage() {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: '60vh', gap: 16 }}>
      <HeartHandshake size={48} style={{ color: 'var(--color-accent-sage-muted)' }} />
      <h2 style={{ fontSize: 24, fontWeight: 600, color: 'var(--color-text-primary)' }}>Support</h2>
      <p style={{ color: 'var(--color-text-muted)', fontSize: 14 }}>Find mental health professionals near you. Coming soon.</p>
    </div>
  );
}
