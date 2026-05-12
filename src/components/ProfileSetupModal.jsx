import React, { useState } from 'react';
import { Camera } from 'lucide-react';

const ProfileSetupModal = ({ isOpen, onSubmit, user }) => {
  const [name, setName] = useState(user?.displayName || '');
  const [avatar, setAvatar] = useState(user?.photoURL || null);
  const [previewAvatar, setPreviewAvatar] = useState(user?.photoURL || null);

  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit({ displayName: name, photoURL: avatar });
  };

  const generateNewAvatar = () => {
    const newAvatar = `https://api.dicebear.com/7.x/avataaars/svg?seed=${Math.random()}`;
    setAvatar(newAvatar);
    setPreviewAvatar(newAvatar);
  };

  const getInitials = (name) => {
    if (!name) return 'U';
    return name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 1);
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
      <div className="bg-bg-main w-full max-w-sm rounded-2xl overflow-hidden shadow-2xl border border-gray-100 dark:border-gray-800 animate-in zoom-in-95 duration-200">
        <div className="p-8">
          <h2 className="text-xl font-bold text-center mb-6">Setup Your Profile</h2>
          
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="flex flex-col items-center gap-3">
              <div className="relative cursor-pointer group" onClick={generateNewAvatar}>
                <div className="w-24 h-24 rounded-full border-2 border-accent bg-accent text-white flex items-center justify-center text-3xl font-bold shadow-md overflow-hidden group-hover:scale-105 transition-transform">
                  {previewAvatar ? (
                    <img 
                      src={previewAvatar} 
                      alt="Avatar Preview" 
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <span>{getInitials(name)}</span>
                  )}
                </div>
                <div className="absolute bottom-0 right-0 p-1.5 bg-accent rounded-full text-white shadow-sm">
                  <Camera size={14} />
                </div>
              </div>
              <p className="text-[10px] text-text-muted font-bold tracking-widest uppercase">Click to change avatar</p>
            </div>

            <div className="space-y-1">
              <label className="text-xs font-bold text-text-muted uppercase tracking-wide">Display Name</label>
              <input 
                type="text" 
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Enter your name"
                className="w-full bg-bg-main border border-gray-300 dark:border-gray-700 rounded-lg py-3 px-4 text-sm text-text-main outline-none focus:border-accent transition-colors"
                required
              />
            </div>

            <button 
              type="submit"
              className="w-full bg-accent text-white font-bold py-3 rounded-lg hover:bg-indigo-700 transition-colors shadow-md active:scale-[0.98]"
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
