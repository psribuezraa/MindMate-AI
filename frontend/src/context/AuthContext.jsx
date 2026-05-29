import { createContext, useContext, useState, useEffect, useCallback } from 'react';

const AuthContext = createContext(null);

/**
 * Wraps the entire app and provides auth state + helpers to all children.
 * Usage: const { user, isAuthenticated, login, logout } = useAuth();
 */
export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    // Rehydrate user from localStorage on first load
    try {
      const stored = localStorage.getItem('user');
      return stored ? JSON.parse(stored) : null;
    } catch {
      return null;
    }
  });

  const [sessionExpired, setSessionExpired] = useState(false);

  /**
   * Call this after a successful /api/auth/login or /api/auth/register response.
   * Expects the full response object: { _id, name, email, token }
   */
  const login = (userData) => {
    localStorage.setItem('token', userData.token);
    localStorage.setItem('user', JSON.stringify(userData));
    setUser(userData);
    setSessionExpired(false);
  };

  /**
   * Call this from the Sidebar logout button.
   * Clears all auth data and redirects to /login.
   */
  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setUser(null);
  };

  /**
   * Listen for custom 'auth:session-expired' events dispatched by any API call
   * that receives a 401 Unauthorized response. This allows session expiry
   * detection from anywhere in the app without modifying each component.
   */
  useEffect(() => {
    const handleSessionExpired = () => {
      // Only show the popup if the user was previously logged in
      if (localStorage.getItem('user') || localStorage.getItem('token')) {
        setSessionExpired(true);
      }
    };

    window.addEventListener('auth:session-expired', handleSessionExpired);
    return () => window.removeEventListener('auth:session-expired', handleSessionExpired);
  }, []);

  /**
   * When the user acknowledges the session expired popup,
   * clear auth data and redirect to login.
   */
  const handleExpiredDismiss = useCallback(() => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setUser(null);
    setSessionExpired(false);
    window.location.href = '/login';
  }, []);

  const value = {
    user,
    isAuthenticated: !!user,
    login,
    logout,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}

      {/* Session Expired Modal Overlay */}
      {sessionExpired && (
        <div
          style={{
            position: 'fixed',
            inset: 0,
            zIndex: 10000,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            background: 'rgba(0, 0, 0, 0.5)',
            backdropFilter: 'blur(4px)',
            animation: 'fadeIn 0.2s ease-out',
          }}
        >
          <div
            style={{
              background: '#fff',
              borderRadius: '16px',
              padding: '32px',
              maxWidth: '380px',
              width: '90%',
              textAlign: 'center',
              boxShadow: '0 20px 60px rgba(0, 0, 0, 0.15)',
              animation: 'slideUp 0.3s ease-out',
            }}
          >
            {/* Lock icon */}
            <div
              style={{
                width: '56px',
                height: '56px',
                borderRadius: '50%',
                background: '#FFF3E0',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                margin: '0 auto 16px',
                fontSize: '24px',
              }}
            >
              🔒
            </div>

            <h3
              style={{
                margin: '0 0 8px',
                fontSize: '18px',
                fontWeight: 600,
                color: '#2C2C2C',
              }}
            >
              Session Expired
            </h3>

            <p
              style={{
                margin: '0 0 24px',
                fontSize: '14px',
                color: '#6B6B6B',
                lineHeight: 1.5,
              }}
            >
              Your login session has expired. Please log in again to continue.
            </p>

            <button
              onClick={handleExpiredDismiss}
              style={{
                width: '100%',
                padding: '12px 24px',
                border: 'none',
                borderRadius: '10px',
                background: '#4A5E4A',
                color: '#fff',
                fontSize: '14px',
                fontWeight: 600,
                cursor: 'pointer',
                transition: 'background 0.2s',
              }}
              onMouseEnter={(e) => (e.target.style.background = '#3A4E3A')}
              onMouseLeave={(e) => (e.target.style.background = '#4A5E4A')}
            >
              Log In Again
            </button>
          </div>
        </div>
      )}

      {/* Inline keyframe animations for the modal */}
      <style>{`
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        @keyframes slideUp {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </AuthContext.Provider>
  );
}

/** Custom hook for easy access to auth context */
export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
