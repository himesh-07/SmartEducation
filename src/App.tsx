import React, { useState } from 'react';
import { AuthProvider, useAuth } from './context/AuthContext';
import { Navbar } from './components/common/Navbar';
import { LandingPage } from './components/landing/LandingPage';
import { ParentDashboard } from './components/parent/ParentDashboard';
import { TeacherDashboard } from './components/teacher/TeacherDashboard';
import { LoginModal } from './components/auth/LoginModal';

const AppContent: React.FC = () => {
  const { currentUser } = useAuth();
  const [loginModalOpen, setLoginModalOpen] = useState(false);
  const [loginInitialRole, setLoginInitialRole] = useState<'teacher' | 'parent'>('parent');

  const handleOpenLogin = (role: 'teacher' | 'parent' = 'parent') => {
    setLoginInitialRole(role);
    setLoginModalOpen(true);
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 font-sans flex flex-col">
      {/* Global Navbar */}
      <Navbar 
        onOpenLogin={handleOpenLogin}
      />

      {/* Main View Router */}
      <main className="flex-1">
        {!currentUser && (
          <LandingPage onOpenLogin={handleOpenLogin} />
        )}

        {currentUser && currentUser.role === 'teacher' && (
          <TeacherDashboard />
        )}

        {currentUser && currentUser.role === 'parent' && (
          <ParentDashboard />
        )}
      </main>

      {/* Login / Role Selection Modal */}
      <LoginModal
        isOpen={loginModalOpen}
        initialRole={loginInitialRole}
        onClose={() => setLoginModalOpen(false)}
      />
    </div>
  );
};

export default function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
}

