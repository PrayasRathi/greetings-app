import React, { useState } from 'react';
import { User, Mail, Lock } from 'lucide-react';
import { useAuth } from '../hooks/useAuth';

const AuthPage = ({ onGoogleLogin, onGuestLogin }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  
  const { signUpWithEmail, signInWithEmail } = useAuth();

  const handleEmailAuth = async (isSignUp) => {
    setError('');
    if (!email || !password) {
      setError('Please enter both email and password.');
      return;
    }
    
    setLoading(true);
    const result = isSignUp 
      ? await signUpWithEmail(email, password)
      : await signInWithEmail(email, password);
    
    if (!result.success) {
      setError(result.error);
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-bg-main flex flex-col items-center justify-center p-6 text-text-main transition-colors">
      <div className="w-full max-w-sm text-center">
        <h1 className="text-3xl font-bold mb-2">Greetings App</h1>
        <p className="text-text-muted mb-10">Simple way to create and share greetings.</p>

        <div className="flex flex-col gap-3">
          <button 
            disabled={loading}
            onClick={onGoogleLogin}
            className="w-full flex items-center justify-center gap-2 bg-indigo-600 text-white font-medium py-3 px-6 rounded-lg hover:bg-indigo-700 transition-colors disabled:opacity-50"
          >
            <img src="https://www.google.com/favicon.ico" alt="Google" className="w-4 h-4 brightness-0 invert" />
            Sign in with Google
          </button>

          <div className="flex items-center gap-4 my-4">
            <div className="flex-1 h-[1px] bg-gray-200 dark:bg-gray-800"></div>
            <span className="text-xs text-text-muted uppercase font-bold tracking-widest">or</span>
            <div className="flex-1 h-[1px] bg-gray-200 dark:bg-gray-800"></div>
          </div>

          {/* Email Auth Form */}
          <div className="space-y-3 text-left">
            <div className="relative">
              <Mail size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-text-muted" />
              <input 
                type="email"
                placeholder="Email address"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full bg-bg-main border border-gray-300 dark:border-gray-700 rounded-lg py-3 pl-12 pr-4 text-sm outline-none focus:border-indigo-600 transition-colors"
              />
            </div>
            <div className="relative">
              <Lock size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-text-muted" />
              <input 
                type="password"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full bg-bg-main border border-gray-300 dark:border-gray-700 rounded-lg py-3 pl-12 pr-4 text-sm outline-none focus:border-indigo-600 transition-colors"
              />
            </div>
            {error && <p className="text-xs text-red-500 font-medium ml-1">{error}</p>}
            
            <div className="flex gap-3">
              <button 
                disabled={loading}
                onClick={() => handleEmailAuth(true)}
                className="flex-1 bg-bg-main border border-gray-300 dark:border-gray-700 text-text-main font-bold py-3 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors disabled:opacity-50"
              >
                Sign Up
              </button>
              <button 
                disabled={loading}
                onClick={() => handleEmailAuth(false)}
                className="flex-1 bg-indigo-600 text-white font-bold py-3 rounded-lg hover:bg-indigo-700 transition-colors disabled:opacity-50 shadow-sm"
              >
                Login
              </button>
            </div>
          </div>

          <button 
            disabled={loading}
            onClick={onGuestLogin}
            className="w-full mt-4 flex items-center justify-center gap-2 bg-transparent text-text-muted text-sm font-medium py-2 rounded-lg hover:text-text-main transition-colors disabled:opacity-50"
          >
            <User size={16} />
            Continue as Guest
          </button>
        </div>
      </div>
    </div>
  );
};

export default AuthPage;
