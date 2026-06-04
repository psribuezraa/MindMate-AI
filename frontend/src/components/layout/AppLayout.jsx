import { Outlet } from 'react-router-dom';
import { useState, useCallback } from 'react';
import Sidebar from './Sidebar';
import { Menu } from 'lucide-react';

export default function AppLayout() {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const toggleSidebar = useCallback(() => {
    setSidebarOpen((prev) => !prev);
  }, []);

  const closeSidebar = useCallback(() => {
    setSidebarOpen(false);
  }, []);

  return (
    <div className="app-layout">
      {/* Mobile hamburger button — only visible at ≤768px via CSS */}
      <button
        className="mobile-menu-btn"
        id="mobile-menu-btn"
        onClick={toggleSidebar}
        aria-label="Toggle navigation menu"
      >
        <Menu size={24} />
      </button>

      {/* Backdrop overlay when sidebar is open on mobile */}
      {sidebarOpen && (
        <div className="sidebar-backdrop" onClick={closeSidebar} />
      )}

      <Sidebar isOpen={sidebarOpen} onClose={closeSidebar} />
      <main className="app-main">
        <Outlet />
      </main>
    </div>
  );
}
