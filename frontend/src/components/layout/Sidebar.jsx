import { NavLink, useLocation, useNavigate } from "react-router-dom";
import {
  Sparkles,
  BarChart3,
  Trees,
  Music,
  HeartHandshake,
  BookOpen,
  Settings,
  LogOut,
  Plus,
} from "lucide-react";
import { useAuth } from "../../context/AuthContext";

const navItems = [
  { to: "/dashboard", label: "Sanctuary", icon: Sparkles },
  { to: "/dashboard/diary", label: "Diary History", icon: BookOpen },
  { to: "/dashboard/analytics", label: "Analytics", icon: BarChart3 },
  { to: "/dashboard/mindfulness", label: "Mindfulness", icon: Trees },
  { to: "/dashboard/soundscapes", label: "Soundscapes", icon: Music },
  { to: "/dashboard/support", label: "Local Support", icon: HeartHandshake },
];

export default function Sidebar() {
  const location = useLocation();
  const navigate = useNavigate();
  const { logout } = useAuth();

  return (
    <aside className="sidebar" id="sidebar">
      {/* Brand */}
      <div className="sidebar-brand">
        <div className="sidebar-brand-icon">
          <Sparkles size={20} />
        </div>
        <div>
          <h1>MindMate AI</h1>
          <p>Your Digital Sanctuary</p>
        </div>
      </div>

      {/* New Session Button */}
      <button
        className="sidebar-new-session"
        id="new-session-btn"
        onClick={() => navigate("/dashboard/chat")}
      >
        <Plus size={18} />
        <span>New Session</span>
      </button>

      {/* Navigation */}
      <nav className="sidebar-nav">
        {navItems.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            className={({ isActive }) =>
              `sidebar-nav-item ${isActive ? "active" : ""}`
            }
            end={item.to === "/dashboard"}
          >
            <item.icon size={20} />
            <span>{item.label}</span>
          </NavLink>
        ))}
      </nav>

      {/* Bottom */}
      <div className="sidebar-bottom">
        <NavLink
          to="/dashboard/settings"
          className={({ isActive }) =>
            `sidebar-nav-item ${isActive ? "active" : ""}`
          }
        >
          <Settings size={20} />
          <span>Settings</span>
        </NavLink>
        <button className="sidebar-nav-item" id="logout-btn" onClick={logout}>
          <LogOut size={20} />
          <span>Log out</span>
        </button>
      </div>
    </aside>
  );
}
