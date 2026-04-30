import { Music } from 'lucide-react';

export default function SoundscapesPage() {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: '60vh', gap: 16 }}>
      <Music size={48} style={{ color: 'var(--color-accent-sage-muted)' }} />
      <h2 style={{ fontSize: 24, fontWeight: 600, color: 'var(--color-text-primary)' }}>Soundscapes</h2>
      <p style={{ color: 'var(--color-text-muted)', fontSize: 14 }}>Your calming audio library is coming soon.</p>
    </div>
  );
}
