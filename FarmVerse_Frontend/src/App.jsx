import React from 'react';
import { Routes, Route } from 'react-router-dom';
import { LanguageProvider } from './contexts/LanguageContext';
// Correcting all import paths to be consistent and accurate
import WelcomePage from './pages/WelcomePage.jsx';
import LoginPage from './pages/LoginPage.jsx';
import RegisterPage from './pages/RegisterPage.jsx'; // Corrected path from './pages-old'
import DashboardPage from './pages/DashboardPage.jsx';
import ProtectedRoute from './components/ProtectedRoute.jsx';
import LeaderboardPage from './pages/LeaderboardPage.jsx';
import QuizPage from './pages/QuizPage.jsx';
import MyCouponsPage from './pages/MyCouponsPage.jsx';
import RewardsPage from './pages/RewardsPage.jsx';
import ForumPage from './pages/ForumPage.jsx';

function App() {
  return (
    <LanguageProvider>
      <Routes>
        {/* Public routes that anyone can access */}
        <Route path="/" element={<WelcomePage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        
        {/* Protected routes that only logged-in users can access */}
        {/* The ProtectedRoute component acts as a guard */}
        <Route element={<ProtectedRoute />}>
          <Route path="/dashboard" element={<DashboardPage />} />
          <Route path="/leaderboard" element={<LeaderboardPage />} />
          <Route path="/quiz/:quizId" element={<QuizPage />} />
          <Route path="/rewards" element={<RewardsPage />} />
          <Route path="/my-coupons" element={<MyCouponsPage />} />
          <Route path="/forum" element={<ForumPage />} />
        </Route>
      </Routes>
    </LanguageProvider>
  );
}

export default App;

