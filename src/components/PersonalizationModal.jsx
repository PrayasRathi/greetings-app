import React, { useEffect, useRef, useState } from 'react';
import { Download, Share2, ArrowLeft } from 'lucide-react';
import { useCanvas } from '../hooks/useCanvas';
import { shareImage, downloadImage } from '../utils/shareImage';
import { showToast } from '../utils/toast';

const PersonalizationModal = ({ isOpen, template, user, onClose }) => {
  const canvasRef = useRef(null);
  const [dataUrl, setDataUrl] = useState(null);
  const [customQuote, setCustomQuote] = useState('');
  const { drawGreeting } = useCanvas();

  useEffect(() => {
    if (template) {
      setCustomQuote(template.quote);
    }
  }, [template]);

  useEffect(() => {
    if (isOpen && template && user && canvasRef.current) {
      const render = async () => {
        // Use customQuote if available, otherwise template.quote
        const currentTemplate = { ...template, quote: customQuote || template.quote };
        const url = await drawGreeting(canvasRef.current, currentTemplate, user);
        setDataUrl(url);
      };
      const timer = setTimeout(render, 100); // Slight debounce for typing
      return () => clearTimeout(timer);
    }
  }, [isOpen, template, user, customQuote, drawGreeting]);

  if (!isOpen) return null;

  const handleDownload = () => {
    if (dataUrl) {
      downloadImage(dataUrl, `greeting-${template.id}.png`);
      showToast("Image downloaded!");
    }
  };

  const handleShare = async () => {
    if (dataUrl) {
      const shared = await shareImage(dataUrl, `Check out this greeting!`);
      if (!shared) {
        // Fallback to clipboard happened in utility, but we can show toast here
        showToast("Copied to clipboard!");
      }
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-white flex flex-col">
      {/* Header */}
      <div className="h-16 px-4 flex items-center justify-between border-b border-gray-200 bg-white">
        <button 
          onClick={onClose}
          className="flex items-center gap-2 text-gray-600 hover:text-indigo-600 font-medium"
        >
          <ArrowLeft size={20} />
          <span>Back</span>
        </button>
        <h2 className="text-lg font-bold">Personalize</h2>
        <div className="w-16" /> 
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto p-4 md:p-8 flex flex-col items-center">
        <div className="w-full max-w-md aspect-square bg-gray-100 rounded-lg overflow-hidden border border-gray-200 shadow-sm mb-6">
          <canvas 
            ref={canvasRef} 
            className="w-full h-full object-contain"
          />
        </div>
        
        <div className="w-full max-w-md space-y-4">
          <div className="space-y-1">
            <label className="text-xs font-bold text-gray-500 uppercase tracking-wide">Edit quote</label>
            <textarea 
              value={customQuote}
              onChange={(e) => setCustomQuote(e.target.value)}
              className="w-full bg-white border border-gray-300 rounded-lg py-3 px-4 text-sm text-gray-800 outline-none focus:border-indigo-600 transition-colors h-24 resize-none"
              placeholder="Enter your custom message..."
            />
          </div>
        </div>
      </div>

      {/* Footer Actions */}
      <div className="p-4 border-t border-gray-200 bg-white flex gap-3">
        <button 
          onClick={handleDownload}
          className="flex-1 flex items-center justify-center gap-2 bg-gray-100 text-gray-700 font-bold py-4 rounded-lg hover:bg-gray-200 transition-colors"
        >
          <Download size={18} />
          Download
        </button>
        <button 
          onClick={handleShare}
          className="flex-1 flex items-center justify-center gap-2 bg-indigo-600 text-white font-bold py-4 rounded-lg hover:bg-indigo-700 transition-colors"
        >
          <Share2 size={18} />
          Share
        </button>
      </div>
    </div>
  );
};

export default PersonalizationModal;
