import { NavLink, useLocation } from 'react-router-dom';
import {
  Sparkles,
  BarChart3,
  Trees,
  Music,
  HeartHandshake,
  Settings,
  LogOut,
} from 'lucide-react';

const navItems = [
  { to: '/', label: 'Sanctuary', icon: Sparkles },
  { to: '/analytics', label: 'Analytics', icon: BarChart3 },
  { to: '/mindfulness', label: 'Mindfulness', icon: Trees },
  { to: '/soundscapes', label: 'Soundscapes', icon: Music },
  { to: '/support', label: 'Support', icon: HeartHandshake },
];

export default function Sidebar() {
  const location = useLocation();

  return (
    <aside className="sidebar" id="sidebar">
      {/* Brand */}
      <div className="sidebar-brand">
        <div className="sidebar-brand-icon">
          <Sparkles size={20} />
        </div>
        <div>
          <h1>MindMate AI</h1>
          <p>Digital Sanctuary</p>
        </div>
      </div>

      {/* Navigation */}
      <nav className="sidebar-nav">
        {navItems.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            className={({ isActive }) =>
              `sidebar-nav-item ${isActive ? 'active' : ''}`
            }
            end={item.to === '/'}
          >
            <item.icon size={20} />
            <span>{item.label}</span>
          </NavLink>
        ))}
      </nav>

      {/* Bottom */}
      <div className="sidebar-bottom">
        <NavLink
          to="/settings"
          className={({ isActive }) =>
            `sidebar-nav-item ${isActive ? 'active' : ''}`
          }
        >
          <Settings size={20} />
          <span>Settings</span>
        </NavLink>
        <button className="sidebar-nav-item" id="logout-btn">
          <LogOut size={20} />
          <span>Log out</span>
        </button>
      </div>
    </aside>
  );
}
