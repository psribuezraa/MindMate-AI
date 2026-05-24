import { useState, useEffect, useRef, useCallback } from 'react';

const PHASES = [
  { label: 'Inhale',  duration: 4000, scale: 0.85 },
  { label: 'Hold',    duration: 4000, scale: 0.85 },
  { label: 'Exhale',  duration: 4000, scale: 0.5 },
];

export default function BreathingRing() {
  const [isActive, setIsActive]     = useState(false); // start paused like the design implies
  const [phaseIndex, setPhaseIndex] = useState(0);
  const timerRef = useRef(null);

  const advancePhase = useCallback(() => {
    setPhaseIndex((prev) => (prev + 1) % PHASES.length);
  }, []);

  useEffect(() => {
    if (!isActive) return;
    timerRef.current = setTimeout(advancePhase, PHASES[phaseIndex].duration);
    return () => clearTimeout(timerRef.current);
  }, [isActive, phaseIndex, advancePhase]);

  const toggleActive = () => {
    setIsActive((prev) => !prev);
    if (!isActive) setPhaseIndex(0);
  };

  const phase = PHASES[phaseIndex];

  /* The CSS transition duration must match the phase duration so
     the size change finishes exactly when the next phase starts. */
  const transitionDuration =
    phaseIndex === 1
      ? '0ms'           // Hold: snap to same size instantly
      : `${phase.duration}ms`;

  return (
    <div className="card pace-card" id="pace-card" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center', padding: '24px' }}>
      <h3 className="card-title" style={{ alignSelf: 'flex-start', width: '100%', textAlign: 'center', fontSize: '22px', marginBottom: '32px' }}>Pace</h3>
      
      <div className="breathing-ring-wrapper" style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: '32px', width: '100%' }}>
        
        {/* Outer Ring boundary */}
        <div className="breathing-ring-container">
          {/* Animated Inner Circle */}
          <div
            className={`breathing-ring ${!isActive ? 'paused' : ''}`}
            aria-label={`Breathing exercise: ${phase.label}`}
            style={{
              transform: isActive ? `scale(${phase.scale})` : 'scale(0.5)',
              transition: isActive
                ? `transform ${transitionDuration} ease-in-out`
                : 'transform 500ms ease', // smooth shrink when paused
            }}
          >
            <span>{phase.label}</span>
          </div>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '16px' }}>
          <p style={{ color: 'var(--color-text-secondary)', fontSize: '13px', fontWeight: 500 }}>
            4–4–4 Breathing Technique
          </p>
          <button 
            onClick={toggleActive}
            style={{
              background: 'var(--color-accent-sage)',
              color: '#ffffff',
              padding: '10px 28px',
              borderRadius: '24px',
              fontWeight: 600,
              fontSize: '15px',
              border: 'none',
              cursor: 'pointer',
              transition: 'background 200ms ease'
            }}
          >
            {isActive ? 'Pause Session' : 'Start Session'}
          </button>
        </div>

      </div>
    </div>
  );
}
