import { Settings } from 'lucide-react';

export default function SettingsPage() {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: '60vh', gap: 16 }}>
      <Settings size={48} style={{ color: 'var(--color-accent-sage-muted)' }} />
      <h2 style={{ fontSize: 24, fontWeight: 600, color: 'var(--color-text-primary)' }}>Settings</h2>
      <p style={{ color: 'var(--color-text-muted)', fontSize: 14 }}>Profile, notifications, and display preferences coming soon.</p>
    </div>
  );
}
