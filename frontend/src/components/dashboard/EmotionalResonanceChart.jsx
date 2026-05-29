import { useState, useEffect, useMemo } from 'react';
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
} from 'recharts';
import { MoreHorizontal, BookOpen } from 'lucide-react';
import { authFetch } from '../../services/authFetch';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';


const MOOD_LEVELS = {
  1: 'Subdued',
  2: 'Balanced',
  3: 'Elevated',
};

const moodLabels = ['', 'Subdued', 'Balanced', 'Elevated', ''];

/* ── Build a full 30-day date grid, merging in real mood data ── */
function buildChartData(moodSummary) {
  const dataMap = new Map();

  // Index API data by date string "YYYY-MM-DD" → averageValue
  for (const entry of moodSummary) {
    dataMap.set(entry.date, entry.averageValue);
  }

  const result = [];
  const today = new Date();

  for (let i = 29; i >= 0; i--) {
    const d = new Date(today);
    d.setDate(d.getDate() - i);
    const key = d.toISOString().slice(0, 10);
    const value = dataMap.has(key) ? dataMap.get(key) : null;

    result.push({
      date: d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
      fullDate: d.toLocaleDateString('en-US', {
        weekday: 'long',
        month: 'long',
        day: 'numeric',
      }),
      value,
    });
  }

  return result;
}

/* ── Custom tooltip ── */
function CustomTooltip({ active, payload }) {
  if (!active || !payload?.length) return null;
  const d = payload[0].payload;

  if (d.value === null) {
    return (
      <div
        style={{
          background: '#fff',
          padding: '10px 14px',
          borderRadius: '12px',
          boxShadow: '0 4px 16px rgba(0,0,0,0.1)',
          border: '1px solid #EEEDE7',
          fontSize: '13px',
          lineHeight: 1.5,
        }}
      >
        <div style={{ fontWeight: 600, color: '#2C2C2C' }}>{d.fullDate}</div>
        <div style={{ color: '#8A8A7A', marginTop: 2 }}>No entry</div>
      </div>
    );
  }

  const level = MOOD_LEVELS[Math.round(d.value)] || 'Balanced';

  return (
    <div
      style={{
        background: '#fff',
        padding: '10px 14px',
        borderRadius: '12px',
        boxShadow: '0 4px 16px rgba(0,0,0,0.1)',
        border: '1px solid #EEEDE7',
        fontSize: '13px',
        lineHeight: 1.5,
      }}
    >
      <div style={{ fontWeight: 600, color: '#2C2C2C' }}>{d.fullDate}</div>
      <div style={{ color: '#4A5E4A', marginTop: 2 }}>
        Avg. {level}
      </div>
    </div>
  );
}

export default function EmotionalResonanceChart({ updateTrigger }) {
  const [moodSummary, setMoodSummary] = useState(null); // null = loading
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchMoodSummary = async () => {
      try {
        const user = JSON.parse(localStorage.getItem('user'));
        const token = user?.token;

        if (!token) {
          setMoodSummary([]);
          return;
        }

        const res = await authFetch(`${API_URL}/api/diary/mood-summary`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        if (!res.ok) throw new Error('Failed to fetch mood data');

        const data = await res.json();
        setMoodSummary(data);
      } catch (err) {
        console.error('Mood summary error:', err.message);
        setError(err.message);
        setMoodSummary([]);
      }
    };

    fetchMoodSummary();
  }, [updateTrigger]);

  const data = useMemo(
    () => (moodSummary !== null ? buildChartData(moodSummary) : []),
    [moodSummary],
  );

  const hasEntries = data.some((d) => d.value !== null);

  return (
    <div className="card emotional-resonance" id="emotional-resonance-card">
      <div className="card-header">
        <div>
          <h3 className="card-title">Emotional Resonance</h3>
          <p className="card-subtitle">Your 30-day inner landscape</p>
        </div>
        <button className="card-menu-btn" aria-label="More options">
          <MoreHorizontal size={18} />
        </button>
      </div>

      {/* Loading state */}
      {moodSummary === null && (
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            height: 160,
            marginTop: 16,
            color: '#8A8A7A',
            fontSize: 13,
          }}
        >
          Loading your mood data…
        </div>
      )}

      {/* Empty state — user has no diary entries */}
      {moodSummary !== null && !hasEntries && (
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            height: 160,
            marginTop: 16,
            gap: 8,
          }}
        >
          <BookOpen size={28} style={{ color: '#8BA88B' }} />
          <p
            style={{
              color: '#8A8A7A',
              fontSize: 13,
              textAlign: 'center',
              maxWidth: 240,
              lineHeight: 1.5,
            }}
          >
            Start journaling to see your emotional landscape here.
          </p>
        </div>
      )}

      {/* Chart with real data */}
      {moodSummary !== null && hasEntries && (
        <div
          className="chart-container"
          style={{ width: '100%', height: 160, marginTop: 16 }}
        >
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart
              data={data}
              margin={{ top: 5, right: 5, bottom: 0, left: 0 }}
            >
              <defs>
                <linearGradient id="moodGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#4A5E4A" stopOpacity={0.15} />
                  <stop offset="95%" stopColor="#4A5E4A" stopOpacity={0.02} />
                </linearGradient>
              </defs>
              <CartesianGrid
                strokeDasharray="3 3"
                vertical={false}
                stroke="#EEEDE7"
              />
              <XAxis
                dataKey="date"
                axisLine={false}
                tickLine={false}
                tick={{ fontSize: 11, fill: '#8A8A7A' }}
                interval={9}
              />
              <YAxis
                domain={[0.5, 3.5]}
                ticks={[1, 2, 3]}
                tickFormatter={(v) => moodLabels[v] || ''}
                axisLine={false}
                tickLine={false}
                tick={{ fontSize: 11, fill: '#8A8A7A' }}
                width={70}
              />
              <Tooltip content={<CustomTooltip />} />
              <Area
                type="monotone"
                dataKey="value"
                stroke="#4A5E4A"
                strokeWidth={2.5}
                fill="url(#moodGradient)"
                dot={{ stroke: '#4A5E4A', strokeWidth: 2, r: 3, fill: '#fff' }}
                activeDot={{
                  r: 5,
                  fill: '#4A5E4A',
                  stroke: '#fff',
                  strokeWidth: 2,
                }}
                connectNulls={true}
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      )}
    </div>
  );
}
