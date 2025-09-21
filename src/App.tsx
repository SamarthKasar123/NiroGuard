import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Navbar from './components/Navbar';
import LandingPage from './pages/LandingPage';
import LoginPage from './pages/LoginPage';
import CommunityDashboard from './pages/CommunityDashboard';
import ASHADashboard from './pages/ASHADashboard';
import AdminDashboard from './pages/AdminDashboard';
import WaterQualityMonitoring from './pages/WaterQualityMonitoring';
import EducationPage from './pages/EducationPage';
import TrainingPortal from './pages/TrainingPortal';
import ImpactDashboard from './pages/ImpactDashboard';
import NotificationSystem from './pages/NotificationSystem';

interface User {
  id: string;
  name: string;
  role: 'community' | 'asha' | 'admin';
  language: string;
}

function App() {
  const [user, setUser] = React.useState<User | null>(null);
  const [language, setLanguage] = React.useState('en');

  const handleLogin = (userData: User) => {
    setUser(userData);
  };

  const handleLogout = () => {
    setUser(null);
  };

  const handleLanguageChange = (newLanguage: string) => {
    setLanguage(newLanguage);
  };

  // Protected route component
  const ProtectedRoute: React.FC<{ 
    children: React.ReactNode; 
    allowedRoles?: Array<'community' | 'asha' | 'admin'>;
  }> = ({ children, allowedRoles = [] }) => {
    if (!user) {
      return <Navigate to="/login" replace />;
    }
    
    if (allowedRoles.length > 0 && !allowedRoles.includes(user.role)) {
      return <Navigate to="/" replace />;
    }
    
    return <>{children}</>;
  };

  return (
    <Router>
      <div className="App">
        <Navbar 
          user={user} 
          language={language} 
          setLanguage={handleLanguageChange}
          onLogout={handleLogout}
        />
        
        <Routes>
          {/* Public routes */}
          <Route path="/" element={<LandingPage language={language} />} />
          <Route 
            path="/login" 
            element={
              user ? <Navigate to={`/${user.role}`} replace /> : 
              <LoginPage onLogin={handleLogin} language={language} />
            } 
          />
          
          {/* Protected routes */}
          <Route 
            path="/community" 
            element={
              <ProtectedRoute allowedRoles={['community']}>
                <CommunityDashboard user={user!} language={language} />
              </ProtectedRoute>
            } 
          />
          
          <Route 
            path="/asha" 
            element={
              <ProtectedRoute allowedRoles={['asha']}>
                <ASHADashboard user={user!} language={language} />
              </ProtectedRoute>
            } 
          />
          
          <Route 
            path="/admin" 
            element={
              <ProtectedRoute allowedRoles={['admin']}>
                <AdminDashboard user={user!} language={language} />
              </ProtectedRoute>
            } 
          />
          
          {/* Shared protected routes */}
          <Route 
            path="/water-quality" 
            element={
              <ProtectedRoute>
                <WaterQualityMonitoring user={user!} language={language} />
              </ProtectedRoute>
            } 
          />
          
          <Route 
            path="/education" 
            element={
              <ProtectedRoute>
                <EducationPage user={user!} language={language} />
              </ProtectedRoute>
            } 
          />
          
          <Route 
            path="/training" 
            element={
              <ProtectedRoute allowedRoles={['asha', 'admin']}>
                <TrainingPortal user={user!} language={language} />
              </ProtectedRoute>
            } 
          />
          
          <Route 
            path="/impact" 
            element={
              <ProtectedRoute allowedRoles={['admin']}>
                <ImpactDashboard user={user!} language={language} />
              </ProtectedRoute>
            } 
          />
          
          <Route 
            path="/notifications" 
            element={
              <ProtectedRoute allowedRoles={['admin']}>
                <NotificationSystem user={user!} language={language} />
              </ProtectedRoute>
            } 
          />
          
          {/* Catch all route */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
