import { Trees } from 'lucide-react';

export default function MindfulnessPage() {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: '60vh', gap: 16 }}>
      <Trees size={48} style={{ color: 'var(--color-accent-sage-muted)' }} />
      <h2 style={{ fontSize: 24, fontWeight: 600, color: 'var(--color-text-primary)' }}>Mindfulness</h2>
      <p style={{ color: 'var(--color-text-muted)', fontSize: 14 }}>Breathing exercises and guided meditations coming soon.</p>
    </div>
  );
}
