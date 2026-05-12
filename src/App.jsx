import React, { useState, useEffect } from 'react';
import { useAuth } from './hooks/useAuth';
import AuthPage from './components/AuthPage';
import HomePage from './components/HomePage';
import ProfileSetupModal from './components/ProfileSetupModal';
import SplashScreen from './components/SplashScreen';
import { ToastContainer } from './utils/toast';

function App() {
  const [showSplash, setShowSplash] = useState(true);
  const { 
    user, 
    loading, 
    needsProfileSetup, 
    loginWithGoogle, 
    loginAsGuest, 
    logout,
    updateProfile 
  } = useAuth();

  useEffect(() => {
    const timer = setTimeout(() => {
      setShowSplash(false);
    }, 2000);
    return () => clearTimeout(timer);
  }, []);

  if (showSplash) {
    return <SplashScreen />;
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-bg-main flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-indigo-600 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  if (!user) {
    return <AuthPage onGoogleLogin={loginWithGoogle} onGuestLogin={loginAsGuest} />;
  }

  return (
    <>
      <HomePage 
        user={user} 
        onLogout={logout} 
        onUpdateProfile={updateProfile} 
      />
      
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
