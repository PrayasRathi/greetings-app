import React, { useEffect, useRef, useState } from 'react';
import { useCanvas } from '../hooks/useCanvas';

const TemplateCard = ({ template, user, onClick }) => {
  const [previewUrl, setPreviewUrl] = useState(null);
  const { drawGreeting } = useCanvas();

  useEffect(() => {
    const generatePreview = async () => {
      // Keep the staggered delay to prevent heavy canvas ops
      await new Promise(resolve => setTimeout(resolve, Math.random() * 500));
      const canvas = document.createElement('canvas');
      const url = await drawGreeting(canvas, template, user);
      setPreviewUrl(url);
    };

    if (user) {
      generatePreview();
    }
  }, [template, user, drawGreeting]);

  return (
    <div 
      onClick={() => onClick(template)}
      className="bg-white rounded-lg overflow-hidden cursor-pointer border border-gray-200 card-shadow hover:border-indigo-300 transition-colors"
    >
      <div className="aspect-square w-full relative bg-gray-100">
        {previewUrl ? (
          <img 
            src={previewUrl} 
            alt={template.category} 
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-gray-400 text-xs">
            Loading...
          </div>
        )}
        
        <div className="absolute top-2 right-2">
          {template.isPremium ? (
            <span className="bg-indigo-600 text-white text-[10px] font-bold px-2 py-0.5 rounded">PREMIUM</span>
          ) : (
            <span className="bg-green-600 text-white text-[10px] font-bold px-2 py-0.5 rounded">FREE</span>
          )}
        </div>
      </div>
      
      <div className="p-3">
        <p className="text-[10px] text-indigo-600 font-bold uppercase tracking-wider mb-1">{template.category}</p>
        <p className="text-xs text-gray-500 line-clamp-2 italic">"{template.quote}"</p>
      </div>
    </div>
  );
};

export default TemplateCard;
