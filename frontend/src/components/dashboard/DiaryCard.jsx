import { useState, useRef } from 'react';
import { BookOpen, Save, Check } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

const MOOD_OPTIONS = [
  { value: 'Happy', emoji: '😊' },
  { value: 'Calm', emoji: '😌' },
  { value: 'Neutral', emoji: '😐' },
  { value: 'Anxious', emoji: '😰' },
  { value: 'Sad', emoji: '😢' },
  { value: 'Angry', emoji: '😤' },
];

export default function DiaryCard() {
  const [content, setContent] = useState('');
  const [mood, setMood] = useState('');
  const [isSaving, setIsSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState('');
  const textareaRef = useRef(null);
  const { user } = useAuth();

  const handleSave = async () => {
    if (!content.trim() || !mood) return;
    setIsSaving(true);
    setError('');

    try {
      const token = localStorage.getItem('token');
      const res = await fetch('http://localhost:5000/api/diary', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ content: content.trim(), mood }),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.message || 'Failed to save entry');
      }

      // Success feedback
      setSaved(true);
      setTimeout(() => {
        setContent('');
        setMood('');
        setSaved(false);
        textareaRef.current?.focus();
      }, 1500);
    } catch (err) {
      setError(err.message || 'Unable to connect to server.');
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="card diary-card" id="diary-card">
      <div className="diary-card-header">
        <BookOpen size={20} />
        <h3>Daily Diary</h3>
      </div>
      <p>Reflect on your day. Your thoughts are saved privately.</p>

      {error && <div className="diary-error">{error}</div>}

      <textarea
        ref={textareaRef}
        value={content}
        onChange={(e) => setContent(e.target.value)}
        placeholder="Today I feel…"
        disabled={isSaving || saved}
        rows={4}
      />

      {/* Mood Selector */}
      <div className="diary-mood-selector">
        <span className="diary-mood-label">How are you feeling?</span>
        <div className="diary-mood-options">
          {MOOD_OPTIONS.map((option) => (
            <button
              key={option.value}
              type="button"
              className={`diary-mood-btn ${mood === option.value ? 'selected' : ''}`}
              onClick={() => setMood(option.value)}
              disabled={isSaving || saved}
              title={option.value}
            >
              <span className="diary-mood-emoji">{option.emoji}</span>
              <span className="diary-mood-text">{option.value}</span>
            </button>
          ))}
        </div>
      </div>

      <button
        className="diary-save-btn"
        onClick={handleSave}
        disabled={!content.trim() || !mood || isSaving || saved}
        id="save-diary-btn"
      >
        {saved ? (
          <>Entry Saved <Check size={16} /></>
        ) : isSaving ? (
          'Saving…'
        ) : (
          <>Save Entry <Save size={16} /></>
        )}
      </button>
    </div>
  );
}
