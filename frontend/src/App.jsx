import { BrowserRouter, Routes, Route } from 'react-router-dom';
import AppLayout from './components/layout/AppLayout';
import SanctuaryPage from './pages/SanctuaryPage';
import AnalyticsPage from './pages/AnalyticsPage';
import MindfulnessPage from './pages/MindfulnessPage';
import SoundscapesPage from './pages/SoundscapesPage';
import SupportPage from './pages/SupportPage';
import SettingsPage from './pages/SettingsPage';

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<AppLayout />}>
          <Route index element={<SanctuaryPage />} />
          <Route path="analytics" element={<AnalyticsPage />} />
          <Route path="mindfulness" element={<MindfulnessPage />} />
          <Route path="soundscapes" element={<SoundscapesPage />} />
          <Route path="support" element={<SupportPage />} />
          <Route path="settings" element={<SettingsPage />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}
