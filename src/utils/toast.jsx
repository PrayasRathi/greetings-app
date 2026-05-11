import React, { useState, useEffect } from 'react';

export const showToast = (message) => {
  window.dispatchEvent(new CustomEvent('show-toast', { detail: message }));
};

export const ToastContainer = () => {
  const [toast, setToast] = useState(null);

  useEffect(() => {
    const handleToast = (e) => {
      setToast(e.detail);
      setTimeout(() => setToast(null), 2500);
    };

    window.addEventListener('show-toast', handleToast);
    return () => window.removeEventListener('show-toast', handleToast);
  }, []);

  if (!toast) return null;

  return (
    <div className="fixed bottom-8 left-1/2 -translate-x-1/2 z-[100] animate-in fade-in slide-in-from-bottom-4 duration-300">
      <div className="px-6 py-3 bg-gray-900 text-white text-sm font-medium rounded-full shadow-xl">
        {toast}
      </div>
    </div>
  );
};
