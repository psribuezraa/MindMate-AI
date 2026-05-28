import { useState, useRef, useEffect } from 'react';
import {
  SkipBack,
  Play,
  Pause,
  SkipForward,
  Heart,
  Mountain,
} from 'lucide-react';

const tracks = [
  { title: 'Chill Rain', genre: 'Nature', duration: '3:09', src: '/audio/chill-rain.mp3' },
  { title: 'Ocean Vibes', genre: 'Nature', duration: '3:25', src: '/audio/ocean-vibes.mp3' },
  { title: 'Midnight Forest', genre: 'Nature', duration: '2:48', src: '/audio/midnight-forest.mp3' },
  { title: 'Soft Piano', genre: 'Music', duration: '2:11', src: '/audio/relaxing--soft-piano-music.mp3' },
  { title: 'Handpan', genre: 'Music', duration: '4:00', src: '/audio/handpan-feel-like-nature-trip.mp3' },
];

export default function SoundscapePlayer() {
  const [currentTrack, setCurrentTrack] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [favorites, setFavorites] = useState(() => {
    try {
      const stored = localStorage.getItem('soundscape-favorites');
      return stored ? new Set(JSON.parse(stored)) : new Set();
    } catch {
      return new Set();
    }
  });
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const audioRef = useRef(null);

  const track = tracks[currentTrack];
  const isFavorite = favorites.has(currentTrack);

  useEffect(() => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.play().catch(error => console.error("Audio playback failed:", error));
      } else {
        audioRef.current.pause();
      }
    }
  }, [isPlaying]);

  const handleCanPlay = () => {
    if (isPlaying && audioRef.current) {
      audioRef.current.play().catch(console.error);
    }
  };

  const prev = () => {
    setCurrentTime(0);
    setCurrentTrack((i) => (i - 1 + tracks.length) % tracks.length);
  };
  const next = () => {
    setCurrentTime(0);
    setCurrentTrack((i) => (i + 1) % tracks.length);
  };
  const togglePlay = () => setIsPlaying((p) => !p);
  const toggleFav = () => {
    setFavorites((prev) => {
      const next = new Set(prev);
      if (next.has(currentTrack)) {
        next.delete(currentTrack);
      } else {
        next.add(currentTrack);
      }
      localStorage.setItem('soundscape-favorites', JSON.stringify([...next]));
      return next;
    });
  };

  const handleTimeUpdate = () => {
    if (audioRef.current) setCurrentTime(audioRef.current.currentTime);
  };

  const handleLoadedMetadata = () => {
    if (audioRef.current) setDuration(audioRef.current.duration);
  };

  const handleSeek = (e) => {
    const val = parseFloat(e.target.value);
    if (audioRef.current) audioRef.current.currentTime = val;
    setCurrentTime(val);
  };

  const formatTime = (secs) => {
    if (!secs || isNaN(secs)) return '0:00';
    const m = Math.floor(secs / 60);
    const s = Math.floor(secs % 60).toString().padStart(2, '0');
    return `${m}:${s}`;
  };

  const handleEnded = () => {
    next();
  };

  return (
    <div className="soundscape-card" id="soundscape-player">
      <audio
        ref={audioRef}
        src={track.src}
        onEnded={handleEnded}
        onCanPlay={handleCanPlay}
        onTimeUpdate={handleTimeUpdate}
        onLoadedMetadata={handleLoadedMetadata}
        loop={false}
      />
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
          <Heart size={18} fill={isFavorite ? 'currentColor' : 'none'} style={{ color: isFavorite ? '#e76f51' : 'inherit', transition: 'color 0.2s, fill 0.2s' }} />
        </button>
      </div>

      {/* Track Info */}
      <div className="soundscape-info">
        <div className="soundscape-title">{track.title}</div>
        <div className="soundscape-meta">
          {track.genre} · {track.duration}
        </div>
      </div>

      {/* Progress Bar */}
      <div className="soundscape-progress-wrapper">
        <span className="soundscape-time">{formatTime(currentTime)}</span>
        <input
          type="range"
          className="soundscape-progress"
          min={0}
          max={duration || 0}
          step={0.1}
          value={currentTime}
          onChange={handleSeek}
          aria-label="Seek"
          style={{ '--progress': `${duration ? (currentTime / duration) * 100 : 0}%` }}
        />
        <span className="soundscape-time">{formatTime(duration)}</span>
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
