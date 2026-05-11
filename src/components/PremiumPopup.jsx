import React from 'react';
import { Check, X } from 'lucide-react';

const PremiumPopup = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 bg-black/50">
      {/* Backdrop click to close */}
      <div className="absolute inset-0" onClick={onClose} />
      
      <div className="relative w-full max-w-lg bg-white rounded-t-2xl sm:rounded-2xl overflow-hidden shadow-xl animate-in slide-in-from-bottom duration-300">
        <div className="p-6 bg-indigo-600 text-white flex justify-between items-center">
          <h2 className="text-xl font-bold">Get Premium</h2>
          <button onClick={onClose} className="p-1 hover:bg-white/20 rounded-lg transition-colors">
            <X size={20} />
          </button>
        </div>

        <div className="p-6 space-y-6">
          <p className="text-gray-600 font-medium text-center">Upgrade to access all templates and features.</p>
          
          <div className="grid grid-cols-1 gap-3">
            {[
              'Unlock 500+ Templates',
              'HD Download Quality',
              'Remove Watermark',
              'Priority Support'
            ].map((benefit, i) => (
              <div key={i} className="flex items-center gap-2">
                <Check size={18} className="text-indigo-600" />
                <span className="text-sm text-gray-700">{benefit}</span>
              </div>
            ))}
          </div>

          <div className="space-y-3 pt-4">
            <button 
              className="w-full bg-indigo-600 text-white font-bold py-3 rounded-lg hover:bg-indigo-700 transition-colors shadow-md"
              onClick={() => alert("Payment feature coming soon!")}
            >
              Subscribe — ₹49/month
            </button>
            <button 
              onClick={onClose}
              className="w-full text-gray-500 text-sm font-medium hover:text-indigo-600 transition-colors"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PremiumPopup;
