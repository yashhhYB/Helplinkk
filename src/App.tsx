import React from 'react';
import { AuthProvider, useAuth } from './context/AuthContext';
import { AppProvider } from './context/AppContext';
import { LoginForm } from './components/auth/LoginForm';
import { WelcomeScreen } from './components/features/WelcomeScreen';
import { Header } from './components/layout/Header';
import { Sidebar } from './components/layout/Sidebar';
import { ChatBot } from './components/features/ChatBot';
import { MainContent } from './components/layout/MainContent';

function AppContent() {
  const { user, loading } = useAuth();
  const [showWelcome, setShowWelcome] = React.useState(!user);
  const [selectedRole, setSelectedRole] = React.useState<string>('');

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading HelpLink...</p>
        </div>
      </div>
    );
  }

  if (showWelcome && !user) {
    return (
      <WelcomeScreen 
        onRoleSelect={(role) => {
          setSelectedRole(role);
          setShowWelcome(false);
        }} 
      />
    );
  }

  if (!user) {
    return <LoginForm preSelectedRole={selectedRole} />;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <div className="flex">
        <Sidebar />
        <MainContent />
      </div>
      <ChatBot />
    </div>
  );
}

function App() {
  return (
    <AuthProvider>
      <AppProvider>
        <AppContent />
      </AppProvider>
    </AuthProvider>
  );
}

export default App;