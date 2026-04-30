import { useState, useEffect, useRef, useCallback } from 'react';

const PHASES = [
  { label: 'Inhale', duration: 4000 },
  { label: 'Hold', duration: 4000 },
  { label: 'Exhale', duration: 4000 },
];

const TOTAL_CYCLE = PHASES.reduce((sum, p) => sum + p.duration, 0);

export default function BreathingRing() {
  const [isActive, setIsActive] = useState(true);
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

  return (
    <div className="card pace-card" id="pace-card">
      <h3 className="card-title">Pace</h3>
      <div className="breathing-ring-container">
        <div
          className={`breathing-ring ${!isActive ? 'paused' : ''}`}
          onClick={toggleActive}
          role="button"
          tabIndex={0}
          aria-label={`Breathing exercise: ${phase.label}. Click to ${isActive ? 'pause' : 'resume'}.`}
          style={{
            animationDuration: `${TOTAL_CYCLE}ms`,
          }}
        >
          <span>{phase.label}</span>
        </div>
      </div>
    </div>
  );
}
