import React from 'react';

const SplashScreen = () => {
  return (
    <div className="fixed inset-0 z-[200] bg-white flex flex-col items-center justify-center animate-out fade-out fill-mode-forwards duration-500 delay-[1800ms]">
      <div className="text-center">
        <h1 className="text-4xl font-bold text-indigo-600 mb-2">Greetings & Wishes</h1>
        <p className="text-gray-500 font-medium mb-8">Personalize. Share. Celebrate.</p>
        
        {/* Simple Animated Spinner */}
        <div className="flex justify-center">
          <div className="w-8 h-8 border-4 border-indigo-100 border-t-indigo-600 rounded-full animate-spin"></div>
        </div>
      </div>
    </div>
  );
};

export default SplashScreen;
