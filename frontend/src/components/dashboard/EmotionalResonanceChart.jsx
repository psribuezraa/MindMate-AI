import { useState, useMemo } from 'react';
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
} from 'recharts';
import { MoreHorizontal } from 'lucide-react';

// Generate mock 30-day mood data with natural variation
function generateMoodData() {
  const data = [];
  const today = new Date();
  let value = 2; // start Balanced

  for (let i = 29; i >= 0; i--) {
    const date = new Date(today);
    date.setDate(date.getDate() - i);

    // Random walk with mean reversion
    const drift = (2 - value) * 0.15;
    const noise = (Math.random() - 0.5) * 0.8;
    value = Math.max(0.5, Math.min(3.5, value + drift + noise));

    data.push({
      date: date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
      value: Math.round(value * 100) / 100,
      fullDate: date.toLocaleDateString('en-US', {
        weekday: 'long',
        month: 'long',
        day: 'numeric',
      }),
    });
  }
  return data;
}

const moodLabels = ['', 'Subdued', 'Balanced', 'Elevated', ''];

function CustomTooltip({ active, payload }) {
  if (!active || !payload?.length) return null;
  const d = payload[0].payload;
  const level =
    d.value <= 1.33 ? 'Subdued' : d.value <= 2.33 ? 'Balanced' : 'Elevated';
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
      <div style={{ color: '#4A5E4A', marginTop: 2 }}>{level}</div>
    </div>
  );
}

export default function EmotionalResonanceChart() {
  const data = useMemo(() => generateMoodData(), []);

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

      <div className="chart-container" style={{ width: '100%', height: 160, marginTop: 16 }}>
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={data} margin={{ top: 5, right: 5, bottom: 0, left: 0 }}>
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
              dot={false}
              activeDot={{
                r: 5,
                fill: '#4A5E4A',
                stroke: '#fff',
                strokeWidth: 2,
              }}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
