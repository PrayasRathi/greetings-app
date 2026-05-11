import React, { useEffect, useState } from 'react';
import { Heart } from 'lucide-react';
import { useCanvas } from '../hooks/useCanvas';
import { useFavourites } from '../hooks/useFavourites';

const TemplateCard = ({ template, user, onClick, scaled = false }) => {
  const [previewUrl, setPreviewUrl] = useState(null);
  const { drawGreeting } = useCanvas();
  const { isFavourite, toggleFavourite } = useFavourites();

  useEffect(() => {
    const generatePreview = async () => {
      await new Promise(resolve => setTimeout(resolve, Math.random() * 500));
      const canvas = document.createElement('canvas');
      const url = await drawGreeting(canvas, template, user);
      setPreviewUrl(url);
    };

    if (user) {
      generatePreview();
    }
  }, [template, user, drawGreeting]);

  const formatDownloads = (count) => {
    if (count >= 1000) {
      return (count / 1000).toFixed(1) + 'k';
    }
    return count;
  };

  const handleFavourite = (e) => {
    e.stopPropagation();
    toggleFavourite(template.id);
  };

  return (
    <div 
      onClick={() => onClick(template)}
      className={`bg-white rounded-lg overflow-hidden cursor-pointer border border-gray-200 card-shadow hover:border-indigo-300 transition-colors ${
        scaled ? 'scale-[0.85] origin-left flex-shrink-0 w-64' : ''
      }`}
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
        
        {/* Badges & Actions */}
        <div className="absolute top-2 left-2 right-2 flex justify-between items-start">
          <div>
            {template.isPremium ? (
              <span className="bg-indigo-600 text-white text-[10px] font-bold px-2 py-0.5 rounded">PREMIUM</span>
            ) : (
              <span className="bg-green-600 text-white text-[10px] font-bold px-2 py-0.5 rounded">FREE</span>
            )}
          </div>
          
          <button 
            onClick={handleFavourite}
            className="p-1.5 bg-white/80 backdrop-blur-sm rounded-full hover:bg-white transition-colors shadow-sm"
          >
            <Heart 
              size={16} 
              className={isFavourite(template.id) ? 'fill-red-500 text-red-500' : 'text-gray-400'} 
            />
          </button>
        </div>
      </div>
      
      <div className="p-3">
        <div className="flex items-center justify-between mb-1">
          <p className="text-[10px] text-indigo-600 font-bold uppercase tracking-wider">{template.category}</p>
          <p className="text-[10px] text-gray-400">↓ {formatDownloads(template.downloads)} downloads</p>
        </div>
        <p className="text-xs text-gray-500 line-clamp-2 italic">"{template.quote}"</p>
      </div>
    </div>
  );
};

export default TemplateCard;
