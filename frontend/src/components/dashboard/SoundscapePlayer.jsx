import { useState } from 'react';
import {
  SkipBack,
  Play,
  Pause,
  SkipForward,
  Heart,
  Mountain,
} from 'lucide-react';

const tracks = [
  { title: 'Deep Canopy', genre: 'Nature', duration: '45 min' },
  { title: 'Ocean Drift', genre: 'Water', duration: '30 min' },
  { title: 'Midnight Rain', genre: 'Ambient', duration: '60 min' },
];

export default function SoundscapePlayer() {
  const [currentTrack, setCurrentTrack] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isFavorite, setIsFavorite] = useState(false);

  const track = tracks[currentTrack];

  const prev = () =>
    setCurrentTrack((i) => (i - 1 + tracks.length) % tracks.length);
  const next = () =>
    setCurrentTrack((i) => (i + 1) % tracks.length);
  const togglePlay = () => setIsPlaying((p) => !p);
  const toggleFav = () => setIsFavorite((f) => !f);

  return (
    <div className="soundscape-card" id="soundscape-player">
      {/* Header */}
      <div className="soundscape-header">
        <div className="soundscape-badge">
          <Mountain size={12} />
          SOUNDSCAPE
        </div>
        <button
          className="soundscape-fav"
          onClick={toggleFav}
          aria-label="Toggle favorite"
        >
          <Heart size={18} fill={isFavorite ? '#fff' : 'none'} />
        </button>
      </div>

      {/* Track Info */}
      <div className="soundscape-info">
        <div className="soundscape-title">{track.title}</div>
        <div className="soundscape-meta">
          {track.genre} · {track.duration}
        </div>
      </div>

      {/* Controls */}
      <div className="soundscape-controls">
        <button className="soundscape-btn" onClick={prev} aria-label="Previous track">
          <SkipBack size={18} />
        </button>
        <button
          className="soundscape-btn play"
          onClick={togglePlay}
          aria-label={isPlaying ? 'Pause' : 'Play'}
        >
          {isPlaying ? <Pause size={22} /> : <Play size={22} />}
        </button>
        <button className="soundscape-btn" onClick={next} aria-label="Next track">
          <SkipForward size={18} />
        </button>
      </div>
    </div>
  );
}
