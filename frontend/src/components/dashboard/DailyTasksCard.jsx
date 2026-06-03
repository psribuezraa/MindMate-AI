import { useState, useEffect } from "react";
import { Sparkles, Loader2 } from "lucide-react";
import { useAuth } from "../../context/AuthContext";
import { authFetch } from "../../services/authFetch";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";

// Get today's date as YYYY-MM-DD for cache key
function getTodayKey() {
  return new Date().toISOString().slice(0, 10);
}

export default function DailyTasksCard() {
  const { user } = useAuth();
  const token = user?.token;

  const [tasks, setTasks] = useState([]);
  const [checked, setChecked] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  const cacheKey = `mindmate_daily_tasks_${user?._id || "guest"}`;

  useEffect(() => {
    if (!token) return;

    const loadTasks = async () => {
      // 1. Check localStorage cache
      try {
        const cached = JSON.parse(localStorage.getItem(cacheKey));
        if (cached && cached.date === getTodayKey()) {
          setTasks(cached.tasks);
          setChecked(cached.checked || cached.tasks.map(() => false));
          setIsLoading(false);
          return;
        }
      } catch {
        // Cache corrupt, continue to fetch
      }

      // 2. Fetch from backend
      setIsLoading(true);
      setError(null);
      try {
        const res = await authFetch(`${API_URL}/api/chat/daily-tasks`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        if (!res.ok) {
          throw new Error("Failed to fetch tasks");
        }

        const data = await res.json();
        const fetchedTasks = data.tasks || [];
        const initialChecked = fetchedTasks.map(() => false);

        setTasks(fetchedTasks);
        setChecked(initialChecked);

        // 3. Cache in localStorage
        localStorage.setItem(
          cacheKey,
          JSON.stringify({
            date: getTodayKey(),
            tasks: fetchedTasks,
            checked: initialChecked,
          })
        );
      } catch (err) {
        console.error("Daily tasks fetch error:", err);
        setError("Could not load tasks right now.");
        // Use fallback tasks
        const fallback = [
          "Take a few deep breaths and relax",
          "Write down how you're feeling today",
          "Listen to a calming soundscape",
        ];
        setTasks(fallback);
        setChecked(fallback.map(() => false));
      } finally {
        setIsLoading(false);
      }
    };

    loadTasks();
  }, [token, cacheKey]);

  const toggleCheck = (index) => {
    setChecked((prev) => {
      const next = [...prev];
      next[index] = !next[index];

      // Persist to localStorage
      try {
        const cached = JSON.parse(localStorage.getItem(cacheKey));
        if (cached) {
          cached.checked = next;
          localStorage.setItem(cacheKey, JSON.stringify(cached));
        }
      } catch {
        // Ignore
      }

      return next;
    });
  };

  const completedCount = checked.filter(Boolean).length;

  return (
    <div className="card daily-tasks-card" id="daily-tasks-card">
      <div className="daily-tasks-header">
        <div className="daily-tasks-icon-wrapper">
          <Sparkles size={18} />
        </div>
        <div>
          <h3 className="card-title">Today&apos;s Intentions</h3>
          <p className="card-subtitle">Personalized by AI based on your journey</p>
        </div>
      </div>

      {isLoading ? (
        <div className="daily-tasks-loading">
          <Loader2 size={22} className="daily-tasks-spinner" />
          <span>AI is crafting your tasks…</span>
        </div>
      ) : error && tasks.length === 0 ? (
        <p className="daily-tasks-error">{error}</p>
      ) : (
        <>
          <ul className="daily-tasks-list">
            {tasks.map((task, i) => (
              <li
                key={i}
                className={`daily-task-item ${checked[i] ? "completed" : ""}`}
                onClick={() => toggleCheck(i)}
              >
                <div className={`daily-task-checkbox ${checked[i] ? "checked" : ""}`}>
                  {checked[i] && (
                    <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
                      <path
                        d="M2 6L5 9L10 3"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                  )}
                </div>
                <span className="daily-task-text">{task}</span>
              </li>
            ))}
          </ul>

          {completedCount === tasks.length && tasks.length > 0 && (
            <div className="daily-tasks-congrats">
              🎉 All done! You&apos;re doing amazing today.
            </div>
          )}

          <div className="daily-tasks-progress">
            <div
              className="daily-tasks-progress-fill"
              style={{
                width: tasks.length > 0 ? `${(completedCount / tasks.length) * 100}%` : "0%",
              }}
            />
          </div>
          <p className="daily-tasks-progress-label">
            {completedCount} of {tasks.length} completed
          </p>
        </>
      )}
    </div>
  );
}
