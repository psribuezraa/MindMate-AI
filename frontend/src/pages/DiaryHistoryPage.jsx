import { useState, useEffect } from 'react';
import { BookOpen, Trash2, Calendar, Loader } from 'lucide-react';

const MOOD_EMOJIS = {
  Happy: '😊',
  Calm: '😌',
  Neutral: '😐',
  Anxious: '😰',
  Sad: '😢',
  Angry: '😤',
};

export default function DiaryHistoryPage() {
  const [entries, setEntries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [deletingId, setDeletingId] = useState(null);

  useEffect(() => {
    fetchEntries();
  }, []);

  const fetchEntries = async () => {
    try {
      const token = localStorage.getItem('token');
      const res = await fetch('http://localhost:5000/api/diary', {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (!res.ok) throw new Error('Failed to load diary entries');

      const data = await res.json();
      setEntries(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this entry?')) return;

    setDeletingId(id);
    try {
      const token = localStorage.getItem('token');
      const res = await fetch(`http://localhost:5000/api/diary/${id}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` },
      });

      if (!res.ok) throw new Error('Failed to delete entry');

      setEntries((prev) => prev.filter((entry) => entry._id !== id));
    } catch (err) {
      setError(err.message);
    } finally {
      setDeletingId(null);
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  const formatTime = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  if (loading) {
    return (
      <div className="diary-history" id="diary-history-page">
        <div className="diary-history-loading">
          <Loader size={24} className="spin" />
          <p>Loading your diary…</p>
        </div>
      </div>
    );
  }

  return (
    <div className="diary-history" id="diary-history-page">
      {/* Page Header */}
      <div className="diary-history-header">
        <div className="diary-history-header-icon">
          <BookOpen size={24} />
        </div>
        <div>
          <h2>Diary History</h2>
          <p>Your private reflections, preserved over time.</p>
        </div>
      </div>

      {error && <div className="diary-error">{error}</div>}

      {/* Empty State */}
      {entries.length === 0 && !error && (
        <div className="diary-history-empty">
          <BookOpen size={48} />
          <h3>No entries yet</h3>
          <p>Head back to your Sanctuary and write your first diary entry.</p>
        </div>
      )}

      {/* Entries List */}
      <div className="diary-history-entries">
        {entries.map((entry) => (
          <div key={entry._id} className="diary-history-entry" id={`diary-entry-${entry._id}`}>
            <div className="diary-entry-header">
              <div className="diary-entry-meta">
                <Calendar size={14} />
                <span className="diary-entry-date">{formatDate(entry.createdAt)}</span>
                <span className="diary-entry-time">{formatTime(entry.createdAt)}</span>
              </div>
              <div className="diary-entry-mood">
                <span className="diary-entry-mood-emoji">
                  {MOOD_EMOJIS[entry.mood] || '😐'}
                </span>
                <span className="diary-entry-mood-label">{entry.mood}</span>
              </div>
            </div>

            <p className="diary-entry-content">{entry.content}</p>

            <div className="diary-entry-actions">
              <button
                className="diary-entry-delete-btn"
                onClick={() => handleDelete(entry._id)}
                disabled={deletingId === entry._id}
                title="Delete entry"
              >
                <Trash2 size={14} />
                {deletingId === entry._id ? 'Deleting…' : 'Delete'}
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
