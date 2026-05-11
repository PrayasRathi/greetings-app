import React, { useState } from 'react';
import { Camera } from 'lucide-react';

const ProfileSetupModal = ({ isOpen, onSubmit, user }) => {
  const [name, setName] = useState(user?.displayName || '');
  const [avatar, setAvatar] = useState(user?.photoURL || 'https://api.dicebear.com/7.x/avataaars/svg?seed=Lucky');

  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit({ displayName: name, photoURL: avatar });
  };

  const generateNewAvatar = () => {
    setAvatar(`https://api.dicebear.com/7.x/avataaars/svg?seed=${Math.random()}`);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50">
      <div className="bg-white w-full max-w-sm rounded-xl overflow-hidden shadow-xl">
        <div className="p-6">
          <h2 className="text-xl font-bold text-center mb-6 text-gray-800">Setup Your Profile</h2>
          
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="flex flex-col items-center gap-3">
              <div className="relative cursor-pointer" onClick={generateNewAvatar}>
                <img 
                  src={avatar} 
                  alt="Avatar Preview" 
                  className="w-24 h-24 rounded-full border-2 border-indigo-600 bg-gray-50 object-cover"
                />
                <div className="absolute bottom-0 right-0 p-1.5 bg-indigo-600 rounded-full text-white shadow-sm">
                  <Camera size={14} />
                </div>
              </div>
              <p className="text-[10px] text-gray-400 font-bold tracking-widest uppercase">Click to change avatar</p>
            </div>

            <div className="space-y-1">
              <label className="text-xs font-bold text-gray-500 uppercase tracking-wide">Display Name</label>
              <input 
                type="text" 
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Enter your name"
                className="w-full bg-white border border-gray-300 rounded-lg py-3 px-4 text-sm text-gray-800 outline-none focus:border-indigo-600 transition-colors"
                required
              />
            </div>

            <button 
              type="submit"
              className="w-full bg-indigo-600 text-white font-bold py-3 rounded-lg hover:bg-indigo-700 transition-colors shadow-sm active:scale-[0.98]"
            >
              Continue
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ProfileSetupModal;
