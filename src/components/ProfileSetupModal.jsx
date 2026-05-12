import React, { useState, useEffect } from 'react';
import { Camera, X } from 'lucide-react';

const ProfileSetupModal = ({ isOpen, onSubmit, user, onClose }) => {
  const [name, setName] = useState('');
  const [avatar, setAvatar] = useState(null);
  const [previewAvatar, setPreviewAvatar] = useState(null);

  useEffect(() => {
    if (user) {
      setName(user.displayName || '');
      setAvatar(user.photoURL || null);
      setPreviewAvatar(user.photoURL || null);
    }
  }, [user, isOpen]);

  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit({ displayName: name, photoURL: avatar });
    if (onClose) onClose();
  };

  const handleAvatarChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        setAvatar(event.target.result);
        setPreviewAvatar(event.target.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const getInitials = (name) => {
    if (!name) return 'U';
    return name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 1);
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
      <div className="bg-bg-main w-full max-w-sm rounded-2xl overflow-hidden shadow-2xl border border-gray-100 dark:border-gray-800 animate-in zoom-in-95 duration-200 relative">
        {onClose && (
          <button 
            onClick={onClose}
            className="absolute top-4 right-4 p-1 text-text-muted hover:text-text-main transition-colors"
          >
            <X size={20} />
          </button>
        )}

        <div className="p-8">
          <h2 className="text-xl font-bold text-center mb-6">Setup Your Profile</h2>
          
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="flex flex-col items-center gap-3">
              <div 
                className="relative cursor-pointer group" 
                onClick={() => document.getElementById('avatar-input').click()}
              >
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
                <input 
                  id="avatar-input"
                  type="file" 
                  accept="image/*"
                  className="hidden"
                  onChange={handleAvatarChange}
                />
              </div>
              <p className="text-[10px] text-text-muted font-bold tracking-widest uppercase">Click to upload photo</p>
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
