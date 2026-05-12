import React, { useEffect, useRef, useState } from 'react';
import { Download, Share2, ArrowLeft, Upload, RotateCcw } from 'lucide-react';
import { useCanvas } from '../hooks/useCanvas';
import { shareImage, downloadImage } from '../utils/shareImage';
import { showToast } from '../utils/toast';

const PersonalizationModal = ({ isOpen, template, user, onClose }) => {
  const canvasRef = useRef(null);
  const fileInputRef = useRef(null);
  const [dataUrl, setDataUrl] = useState(null);
  const [customQuote, setCustomQuote] = useState('');
  const [customPhoto, setCustomPhoto] = useState(null);
  const { drawGreeting } = useCanvas();

  const userId = user?.uid || 'guest';

  useEffect(() => {
    if (template) {
      setCustomQuote(template.quote);
      setCustomPhoto(null);
    }
  }, [template, isOpen]);

  useEffect(() => {
    if (isOpen && template && user && canvasRef.current) {
      const render = async () => {
        const currentTemplate = { ...template, quote: customQuote || template.quote };
        const url = await drawGreeting(canvasRef.current, currentTemplate, user, customPhoto);
        setDataUrl(url);
      };
      const timer = setTimeout(render, 100); 
      return () => clearTimeout(timer);
    }
  }, [isOpen, template, user, customQuote, customPhoto, drawGreeting]);

  if (!isOpen) return null;

  const handleDownload = () => {
    if (dataUrl) {
      downloadImage(dataUrl, `greeting-${template.id}.png`);
      showToast("Image downloaded!");
      
      const downloadKey = `greetings_download_count_${userId}`;
      const currentCount = parseInt(localStorage.getItem(downloadKey) || '0');
      localStorage.setItem(downloadKey, (currentCount + 1).toString());
    }
  };

  const handleShare = async () => {
    if (dataUrl) {
      const shared = await shareImage(dataUrl, `Check out this greeting!`);
      if (!shared) {
        showToast("Copied to clipboard!");
      }
    }
  };

  const handlePhotoUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        setCustomPhoto(event.target.result);
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-bg-main flex flex-col transition-colors">
      {/* Header */}
      <div className="h-16 px-4 flex items-center justify-between border-b border-gray-200 dark:border-gray-800 bg-bg-main">
        <button 
          onClick={onClose}
          className="flex items-center gap-2 text-text-muted hover:text-accent font-medium"
        >
          <ArrowLeft size={20} />
          <span>Back</span>
        </button>
        <h2 className="text-lg font-bold">Personalize</h2>
        <div className="w-16" /> 
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto p-4 md:p-8 flex flex-col items-center">
        <div className="w-full max-w-md aspect-square bg-card-bg rounded-lg overflow-hidden border border-gray-200 dark:border-gray-800 shadow-sm mb-6">
          <canvas 
            ref={canvasRef} 
            className="w-full h-full object-contain"
          />
        </div>
        
        <div className="w-full max-w-md space-y-6">
          <div className="space-y-1">
            <label className="text-xs font-bold text-text-muted uppercase tracking-wide">Edit quote</label>
            <textarea 
              value={customQuote}
              onChange={(e) => setCustomQuote(e.target.value)}
              className="w-full bg-bg-main border border-gray-300 dark:border-gray-700 rounded-lg py-3 px-4 text-sm text-text-main outline-none focus:border-accent transition-colors h-24 resize-none"
              placeholder="Enter your custom message..."
            />
          </div>

          <div className="space-y-3">
            <label className="text-xs font-bold text-text-muted uppercase tracking-wide">Change your photo for this template</label>
            <div className="flex items-center gap-3">
              <button 
                onClick={() => fileInputRef.current.click()}
                className="flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white text-xs font-bold rounded-lg hover:bg-indigo-700 transition-colors"
              >
                <Upload size={14} />
                Upload Photo
              </button>
              {customPhoto && (
                <button 
                  onClick={() => setCustomPhoto(null)}
                  className="flex items-center gap-2 px-4 py-2 bg-gray-100 dark:bg-gray-800 text-text-main text-xs font-bold rounded-lg hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
                >
                  <RotateCcw size={14} />
                  Reset to profile photo
                </button>
              )}
              <input 
                type="file" 
                ref={fileInputRef}
                onChange={handlePhotoUpload}
                accept="image/*"
                className="hidden"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Footer Actions */}
      <div className="p-4 border-t border-gray-200 dark:border-gray-800 bg-bg-main flex gap-3">
        <button 
          onClick={handleDownload}
          className="flex-1 flex items-center justify-center gap-2 bg-card-bg text-text-main font-bold py-4 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-800 transition-colors"
        >
          <Download size={18} />
          Download
        </button>
        <button 
          onClick={handleShare}
          className="flex-1 flex items-center justify-center gap-2 bg-accent text-white font-bold py-4 rounded-lg hover:bg-indigo-700 transition-colors"
        >
          <Share2 size={18} />
          Share
        </button>
      </div>
    </div>
  );
};

export default PersonalizationModal;
