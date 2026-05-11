import React from 'react';
import { useAuth } from './hooks/useAuth';
import AuthPage from './components/AuthPage';
import HomePage from './components/HomePage';
import ProfileSetupModal from './components/ProfileSetupModal';
import { ToastContainer } from './utils/toast';

function App() {
  const { 
    user, 
    loading, 
    needsProfileSetup, 
    loginWithGoogle, 
    loginAsGuest, 
    logout,
    updateProfile 
  } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-indigo-600 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  if (!user) {
    return <AuthPage onGoogleLogin={loginWithGoogle} onGuestLogin={loginAsGuest} />;
  }

  return (
    <>
      <HomePage user={user} onLogout={logout} />
      
      <ProfileSetupModal 
        isOpen={needsProfileSetup} 
        onSubmit={updateProfile}
        user={user}
      />

      <ToastContainer />
    </>
  );
}

export default App;
