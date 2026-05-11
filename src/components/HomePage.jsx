import React, { useState, useEffect, useMemo } from 'react';
import { LogOut, Search, X } from 'lucide-react';
import { categories, templates } from '../data/templates';
import TemplateCard from './TemplateCard';
import PersonalizationModal from './PersonalizationModal';
import PremiumPopup from './PremiumPopup';
import { useFavourites } from '../hooks/useFavourites';
import { useRecentlyViewed } from '../hooks/useRecentlyViewed';

const HomePage = ({ user, onLogout }) => {
  const [activeCategory, setActiveCategory] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedTemplate, setSelectedTemplate] = useState(null);
  const [showPremiumPopup, setShowPremiumPopup] = useState(false);
  
  const { favourites } = useFavourites();
  const { recentIds, addToRecent } = useRecentlyViewed();

  const allCategories = useMemo(() => ['All', 'Favourites', ...categories], []);

  const filteredTemplates = useMemo(() => {
    let result = templates;

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      return result.filter(t => 
        t.category.toLowerCase().includes(q) || 
        t.quote.toLowerCase().includes(q)
      );
    }

    if (activeCategory === 'Favourites') {
      result = result.filter(t => favourites.includes(t.id));
    } else if (activeCategory !== 'All') {
      result = result.filter(t => t.category === activeCategory);
    }

    return result;
  }, [activeCategory, searchQuery, favourites]);

  const recentTemplates = useMemo(() => {
    return recentIds
      .map(id => templates.find(t => t.id === id))
      .filter(Boolean);
  }, [recentIds]);

  const handleTemplateClick = (template) => {
    addToRecent(template.id);
    if (template.isPremium) {
      setShowPremiumPopup(true);
    } else {
      setSelectedTemplate(template);
    }
  };

  return (
    <div className="min-h-screen bg-white text-[#1a1a1a]">
      {/* Navbar */}
      <nav className="sticky top-0 z-40 bg-white border-b border-gray-200 h-16 px-4 flex items-center justify-between">
        <h1 className="text-xl font-bold tracking-tight">Greetings App</h1>
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <span className="text-sm font-medium hidden sm:block">{user.displayName}</span>
            <img 
              src={user.photoURL} 
              alt="Profile" 
              className="w-8 h-8 rounded-full border border-gray-200 object-cover"
            />
          </div>
          <button onClick={onLogout} className="p-1.5 text-gray-500 hover:text-red-600 transition-colors">
            <LogOut size={18} />
          </button>
        </div>
      </nav>

      <main className="max-w-6xl mx-auto px-4 py-6">
        {/* Search Bar */}
        <div className="mb-6 relative max-w-md mx-auto sm:mx-0">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400">
            <Search size={18} />
          </div>
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search templates..."
            className="w-full bg-white border border-gray-300 rounded-lg py-2.5 pl-10 pr-10 text-sm outline-none focus:border-indigo-600 transition-colors"
          />
          {searchQuery && (
            <button 
              onClick={() => setSearchQuery('')}
              className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600"
            >
              <X size={18} />
            </button>
          )}
        </div>

        {/* Categories (Hidden if search active) */}
        {!searchQuery && (
          <div className="flex items-center gap-2 overflow-x-auto scrollbar-hide pb-6">
            {allCategories.map((category) => (
              <button
                key={category}
                onClick={() => setActiveCategory(category)}
                className={`whitespace-nowrap px-5 py-2 rounded-full text-sm font-medium border transition-colors ${
                  activeCategory === category 
                  ? 'bg-indigo-600 border-indigo-600 text-white' 
                  : 'bg-white border-gray-300 text-gray-600 hover:bg-gray-50'
                }`}
              >
                {category}
              </button>
            ))}
          </div>
        )}

        {/* Recently Viewed */}
        {!searchQuery && recentTemplates.length > 0 && (
          <div className="mb-8">
            <h2 className="text-sm font-bold text-gray-400 uppercase tracking-widest mb-4">Recently Viewed</h2>
            <div className="flex gap-4 overflow-x-auto scrollbar-hide -mx-4 px-4 pb-2">
              {recentTemplates.map(template => (
                <TemplateCard 
                  key={`recent-${template.id}`}
                  template={template}
                  user={user}
                  onClick={handleTemplateClick}
                  scaled={true}
                />
              ))}
            </div>
          </div>
        )}

        {/* Main Grid */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
          {filteredTemplates.length > 0 ? (
            filteredTemplates.map((template) => (
              <TemplateCard 
                key={template.id}
                template={template}
                user={user}
                onClick={handleTemplateClick}
              />
            ))
          ) : (
            <div className="col-span-full py-20 text-center text-gray-400">
              No templates found matching your search.
            </div>
          )}
        </div>
      </main>

      <PersonalizationModal 
        isOpen={!!selectedTemplate}
        template={selectedTemplate}
        user={user}
        onClose={() => setSelectedTemplate(null)}
      />

      <PremiumPopup 
        isOpen={showPremiumPopup}
        onClose={() => setShowPremiumPopup(false)}
      />
    </div>
  );
};

export default HomePage;
