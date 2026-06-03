import { Search, Play, Wind } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import EmotionalResonanceChart from '../components/dashboard/EmotionalResonanceChart';
import BreathingRing from '../components/dashboard/BreathingRing';
import GuidedIntentionCard from '../components/dashboard/GuidedIntentionCard';
import SoundscapePlayer from '../components/dashboard/SoundscapePlayer';
import ThoughtShredder from '../components/dashboard/ThoughtShredder';
import DiaryCard from '../components/dashboard/DiaryCard';
import LocalSupportCard from '../components/dashboard/LocalSupportCard';
import GroundingExercise from '../components/dashboard/GroundingExercise';
import DailyTasksCard from '../components/dashboard/DailyTasksCard';

import { useState } from 'react';

function getGreeting() {
  const hour = new Date().getHours();
  if (hour < 12) return 'Good morning';
  if (hour < 17) return 'Good afternoon';
  return 'Good evening';
}

export default function SanctuaryPage() {
  const { user } = useAuth();
  const userName = user?.name ? user.name.split(' ')[0] : 'Guest';
  const [diaryUpdateTrigger, setDiaryUpdateTrigger] = useState(0);
  const [showGrounding, setShowGrounding] = useState(false);

  return (
    <div id="sanctuary-page">
      {/* Grounding Exercise Modal */}
      {showGrounding && (
        <GroundingExercise onClose={() => setShowGrounding(false)} />
      )}

      {/* Search Bar */}
      <div className="search-bar" id="search-bar">
        <Search size={18} />
        <input type="text" placeholder="Find peace…" aria-label="Search" />
      </div>

      {/* Greeting */}
      <div className="greeting">
        <h2>{getGreeting()}, {userName}.</h2>
        <p>Your sanctuary awaits. Take a deep breath.</p>
      </div>

      {/* Dashboard Grid — 3-column top row */}
      <div className="dashboard-grid">
        {/* Row 1 spans full width: Chart + Pace + Right sidebar */}
        <EmotionalResonanceChart updateTrigger={diaryUpdateTrigger} />
        <BreathingRing />
        <div className="dashboard-sidebar-right">
          <SoundscapePlayer />
          <LocalSupportCard />
        </div>

        {/* Row 2: Guided Intentions (spans 2 columns under chart+pace) */}
        <section className="guided-intentions" id="guided-intentions" style={{ gridColumn: 'span 2' }}>
          <h3 className="guided-intentions-title">Guided Intentions</h3>
          <div className="guided-intentions-grid">
            <GuidedIntentionCard
              icon={<Play size={18} />}
              iconVariant="sage"
              title="5-min Meditation"
              description="Ground yourself with the 5-4-3-2-1 sensory technique."
              ctaLabel="BEGIN"
              illustration="🧘"
              onClick={() => setShowGrounding(true)}
            />
            <GuidedIntentionCard
              icon={<Wind size={18} />}
              iconVariant="rose"
              title="Breathing Bubble"
              description="A gentle exercise to steady your heart rate."
              ctaLabel="START"
              illustration="🫧"
            />
          </div>
        </section>

        {/* Row 3: Daily Tasks (spans 2 columns) */}
        <div style={{ gridColumn: 'span 2' }}>
          <DailyTasksCard />
        </div>

        {/* Row 4: Daily Diary (spans 2 columns) */}
        <div style={{ gridColumn: 'span 2' }}>
          <DiaryCard onDiarySaved={() => setDiaryUpdateTrigger(prev => prev + 1)} />
        </div>

        {/* Row 4: Thought Shredder (spans 2 columns) */}
        <div style={{ gridColumn: 'span 2' }}>
          <ThoughtShredder />
        </div>
      </div>
    </div>
  );
}
