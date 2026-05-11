import React from 'react';
import { LogIn, User } from 'lucide-react';

const AuthPage = ({ onGoogleLogin, onGuestLogin }) => {
  return (
    <div className="min-h-screen bg-white flex flex-col items-center justify-center p-6 text-[#1a1a1a]">
      <div className="w-full max-w-sm text-center">
        <h1 className="text-3xl font-bold mb-2">Greetings App</h1>
        <p className="text-gray-500 mb-10">Simple way to create and share greetings.</p>

        <div className="flex flex-col gap-3">
          <button 
            onClick={onGoogleLogin}
            className="w-full flex items-center justify-center gap-2 bg-indigo-600 text-white font-medium py-3 px-6 rounded-lg hover:bg-indigo-700 transition-colors"
          >
            <img src="https://www.google.com/favicon.ico" alt="Google" className="w-4 h-4 brightness-0 invert" />
            Sign in with Google
          </button>

          <button 
            onClick={onGuestLogin}
            className="w-full flex items-center justify-center gap-2 bg-white border border-gray-300 text-gray-700 font-medium py-3 px-6 rounded-lg hover:bg-gray-50 transition-colors"
          >
            <User size={18} />
            Continue as Guest
          </button>
        </div>

        <p className="mt-8 text-xs text-gray-400">
          Built for the 2026 Internship Assessment
        </p>
      </div>
    </div>
  );
};

export default AuthPage;
