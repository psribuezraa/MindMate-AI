import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import ProtectedRoute from "./components/routing/ProtectedRoute";
import PublicRoute from "./components/routing/PublicRoute";

import AppLayout from "./components/layout/AppLayout";
import SanctuaryPage from "./pages/SanctuaryPage";
import AnalyticsPage from "./pages/AnalyticsPage";
import MindfulnessPage from "./pages/MindfulnessPage";
import SoundscapesPage from "./pages/SoundscapesPage";
import SupportPage from "./pages/SupportPage";
import SettingsPage from "./pages/SettingsPage";
import ChatPage from "./pages/ChatPage";
import DiaryHistoryPage from "./pages/DiaryHistoryPage";

import SignInPage from "./pages/SignInPage";
import SignUpPage from "./pages/SignUpPage";
import ForgotPasswordPage from "./pages/ForgotPasswordPage";
import LandingPage from "./pages/LandingPage";

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          {/* Public Landing Page */}
          <Route path="/" element={<LandingPage />} />

          {/* Public-only routes — redirect to /dashboard if already logged in */}
          <Route element={<PublicRoute />}>
            <Route path="/login" element={<SignInPage />} />
            <Route path="/register" element={<SignUpPage />} />
            <Route path="/forgot-password" element={<ForgotPasswordPage />} />
          </Route>

          {/* Protected routes — redirect to /login if not logged in */}
          <Route element={<ProtectedRoute />}>
            <Route path="/" element={<Navigate to="/dashboard" replace />} />
            <Route path="/dashboard" element={<AppLayout />}>
              <Route index element={<SanctuaryPage />} />
              <Route path="chat" element={<ChatPage />} />
              <Route path="diary" element={<DiaryHistoryPage />} />
              <Route path="analytics" element={<AnalyticsPage />} />
              <Route path="mindfulness" element={<MindfulnessPage />} />
              <Route path="soundscapes" element={<SoundscapesPage />} />
              <Route path="support" element={<SupportPage />} />
              <Route path="settings" element={<SettingsPage />} />
            </Route>
          </Route>
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}

