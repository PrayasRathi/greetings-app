import React, { useState, useEffect } from 'react';
import { LogOut, User } from 'lucide-react';
import { categories, templates } from '../data/templates';
import TemplateCard from './TemplateCard';
import PersonalizationModal from './PersonalizationModal';
import PremiumPopup from './PremiumPopup';

const HomePage = ({ user, onLogout }) => {
  const [activeCategory, setActiveCategory] = useState('All');
  const [filteredTemplates, setFilteredTemplates] = useState(templates);
  const [selectedTemplate, setSelectedTemplate] = useState(null);
  const [showPremiumPopup, setShowPremiumPopup] = useState(false);

  useEffect(() => {
    if (activeCategory === 'All') {
      setFilteredTemplates(templates);
    } else {
      setFilteredTemplates(templates.filter(t => t.category === activeCategory));
    }
  }, [activeCategory]);

  const handleTemplateClick = (template) => {
    if (template.isPremium) {
      setShowPremiumPopup(true);
    } else {
      setSelectedTemplate(template);
    }
  };

  return (
    <div className="min-h-screen bg-white text-[#1a1a1a]">
      {/* Simple Navbar */}
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
          <button 
            onClick={onLogout}
            className="p-1.5 text-gray-500 hover:text-red-600 transition-colors"
            title="Logout"
          >
            <LogOut size={18} />
          </button>
        </div>
      </nav>

      <main className="max-w-6xl mx-auto px-4 py-8">
        {/* Simple Category Filters */}
        <div className="flex items-center gap-2 overflow-x-auto scrollbar-hide pb-8">
          {categories.map((category) => (
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

        {/* Template Grid */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
          {filteredTemplates.map((template) => (
            <TemplateCard 
              key={template.id}
              template={template}
              user={user}
              onClick={handleTemplateClick}
            />
          ))}
        </div>
      </main>

      {/* Modals */}
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
