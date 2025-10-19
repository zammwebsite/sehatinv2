import React from 'react';
import { HashRouter, Routes, Route, useLocation } from 'react-router-dom';
import { AuthProvider, useAuth } from './hooks/useAuth';
import HomePage from './pages/HomePage';
import AIChatPage from './pages/AIChatPage';
import HealthCheckPage from './pages/HealthCheckPage';
import NearbyHealthPage from './pages/NearbyHealthPage';
import ProfilePage from './pages/ProfilePage';
import LoginPage from './pages/LoginPage';
import Navbar from './components/Navbar';
import ProtectedRoute from './components/ProtectedRoute';
import ErrorBoundary from './components/ErrorBoundary';

const AppContent: React.FC = () => {
  const location = useLocation();
  const { user, loading } = useAuth();
  const showNavbar = user && !loading && location.pathname !== '/login';

  return (
    <div className="min-h-screen bg-gray-50 font-sans">
      <main className={`pb-20 ${!showNavbar ? 'h-screen' : ''}`}>
        <Routes>
          <Route path="/login" element={<LoginPage />} />
          <Route element={<ProtectedRoute />}>
            <Route path="/" element={<HomePage />} />
            <Route path="/ai-chat" element={<AIChatPage />} />
            <Route path="/health-check" element={<HealthCheckPage />} />
            <Route path="/nearby" element={<NearbyHealthPage />} />
            <Route path="/profile" element={<ProfilePage />} />
          </Route>
        </Routes>
      </main>
      {showNavbar && <Navbar />}
    </div>
  );
};

const App: React.FC = () => {
  return (
    <ErrorBoundary>
      <AuthProvider>
        <HashRouter>
          <AppContent />
        </HashRouter>
      </AuthProvider>
    </ErrorBoundary>
  );
};

export default App;
