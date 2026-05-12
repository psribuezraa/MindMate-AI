import { createContext, useContext, useState } from 'react';

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

  /**
   * Call this after a successful /api/auth/login or /api/auth/register response.
   * Expects the full response object: { _id, name, email, token }
   */
  const login = (userData) => {
    localStorage.setItem('token', userData.token);
    localStorage.setItem('user', JSON.stringify(userData));
    setUser(userData);
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

  const value = {
    user,
    isAuthenticated: !!user,
    login,
    logout,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

/** Custom hook for easy access to auth context */
export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
