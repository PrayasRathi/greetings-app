import React, { useState, useEffect, useMemo, useRef } from 'react';
import { LogOut, Search, X, User, Settings, BarChart2, Heart, Moon, Sun, ChevronRight, Download } from 'lucide-react';
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
  const [showDropdown, setShowDropdown] = useState(false);
  const [showProfileModal, setShowProfileModal] = useState(false);
  const [darkMode, setDarkMode] = useState(() => localStorage.getItem('greetings_dark_mode') === 'true');
  
  const dropdownRef = useRef(null);
  const userId = user?.uid || 'guest';
  
  const { favourites, isFavourite } = useFavourites(userId);
  const { recentIds, addToRecent } = useRecentlyViewed(userId);

  const allCategories = useMemo(() => ['All', 'Favourites', ...categories], []);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setShowDropdown(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
    localStorage.setItem('greetings_dark_mode', darkMode);
  }, [darkMode]);

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
      result = result.filter(t => isFavourite(t.id));
    } else if (activeCategory !== 'All') {
      result = result.filter(t => t.category === activeCategory);
    }

    return result;
  }, [activeCategory, searchQuery, favourites, isFavourite]);

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

  const getInitials = (name) => {
    if (!name) return 'U';
    return name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 1);
  };

  const downloadKey = `greetings_download_count_${userId}`;
  const downloadCount = localStorage.getItem(downloadKey) || '0';

  const UserAvatar = ({ size = "10" }) => (
    <div className={`flex items-center justify-center w-${size} h-${size} rounded-full bg-accent text-white font-bold overflow-hidden border-2 border-transparent hover:border-white transition-all shadow-sm flex-shrink-0`}>
      {user.photoURL ? (
        <img src={user.photoURL} alt="User" className="w-full h-full object-cover" />
      ) : (
        <span className={size === "24" ? "text-3xl" : "text-base"}>{getInitials(user.displayName)}</span>
      )}
    </div>
  );

  return (
    <div className="min-h-screen bg-bg-main text-text-main transition-colors duration-200">
      {/* Navbar */}
      <nav className="sticky top-0 z-40 bg-nav-bg border-b border-gray-200 dark:border-gray-800 h-16 px-4 flex items-center justify-between transition-colors">
        <h1 className="text-xl font-bold tracking-tight">Greetings App</h1>
        
        <div className="relative" ref={dropdownRef}>
          <button onClick={() => setShowDropdown(!showDropdown)}>
            <UserAvatar size="10" />
          </button>

          {/* Dropdown Menu */}
          {showDropdown && (
            <div className="absolute right-0 mt-2 w-64 bg-white dark:bg-[#1A1A1A] rounded-xl shadow-xl border border-gray-100 dark:border-gray-800 py-2 overflow-hidden animate-in fade-in zoom-in-95 duration-100">
              <div className="px-4 py-3 border-b border-gray-100 dark:border-gray-800 mb-2">
                <p className="text-sm font-bold truncate text-[#1a1a1a] dark:text-[#F5F5F5]">{user.displayName}</p>
                <p className="text-[10px] text-text-muted truncate">{user.email || 'Guest User'}</p>
              </div>

              <button 
                onClick={() => { setShowProfileModal(true); setShowDropdown(false); }}
                className="w-full flex items-center gap-3 px-4 py-2 text-sm text-[#1a1a1a] dark:text-[#F5F5F5] hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
              >
                <User size={16} />
                <span>View Profile</span>
              </button>

              <div className="px-4 py-2 border-t border-b border-gray-50 dark:border-gray-800 my-1 bg-gray-50/50 dark:bg-gray-800/50">
                <div className="flex items-center gap-2 text-[10px] font-bold text-text-muted uppercase tracking-wider mb-2">
                  <BarChart2 size={12} />
                  <span>My Stats</span>
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <div className="text-center p-1.5 rounded-lg bg-white dark:bg-[#1A1A1A] border border-gray-100 dark:border-gray-700">
                    <p className="text-xs font-bold text-[#1a1a1a] dark:text-[#F5F5F5]">{downloadCount}</p>
                    <p className="text-[8px] text-text-muted uppercase">Downloads</p>
                  </div>
                  <div className="text-center p-1.5 rounded-lg bg-white dark:bg-[#1A1A1A] border border-gray-100 dark:border-gray-700">
                    <p className="text-xs font-bold text-[#1a1a1a] dark:text-[#F5F5F5]">{favourites.length}</p>
                    <p className="text-[8px] text-text-muted uppercase">Saved</p>
                  </div>
                </div>
              </div>

              <button 
                onClick={() => { setActiveCategory('Favourites'); setShowDropdown(false); }}
                className="w-full flex items-center justify-between px-4 py-2 text-sm text-[#1a1a1a] dark:text-[#F5F5F5] hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
              >
                <div className="flex items-center gap-3">
                  <Heart size={16} />
                  <span>Favourites</span>
                </div>
                <ChevronRight size={14} className="text-text-muted" />
              </button>

              <div className="flex items-center justify-between px-4 py-2 text-sm text-[#1a1a1a] dark:text-[#F5F5F5] hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors cursor-pointer" onClick={() => setDarkMode(!darkMode)}>
                <div className="flex items-center gap-3">
                  {darkMode ? <Sun size={16} /> : <Moon size={16} />}
                  <span>Dark Mode</span>
                </div>
                <div className={`w-8 h-4 rounded-full relative transition-colors ${darkMode ? 'bg-accent' : 'bg-gray-300'}`}>
                  <div className={`absolute top-0.5 w-3 h-3 bg-white rounded-full transition-transform ${darkMode ? 'translate-x-4' : 'translate-x-0'}`}></div>
                </div>
              </div>

              <div className="border-t border-gray-100 dark:border-gray-800 mt-2">
                <button 
                  onClick={onLogout}
                  className="w-full flex items-center gap-3 px-4 py-2 text-sm text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors"
                >
                  <LogOut size={16} />
                  <span>Logout</span>
                </button>
              </div>
            </div>
          )}
        </div>
      </nav>

      <main className="max-w-6xl mx-auto px-4 py-6">
        {/* Search Bar */}
        <div className="mb-6 relative max-w-md mx-auto sm:mx-0">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-text-muted">
            <Search size={18} />
          </div>
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search templates..."
            className="w-full bg-card-bg border border-gray-300 dark:border-gray-700 rounded-lg py-2.5 pl-10 pr-10 text-sm outline-none focus:border-accent transition-colors"
          />
          {searchQuery && (
            <button 
              onClick={() => setSearchQuery('')}
              className="absolute inset-y-0 right-0 pr-3 flex items-center text-text-muted hover:text-text-main"
            >
              <X size={18} />
            </button>
          )}
        </div>

        {/* Categories */}
        {!searchQuery && (
          <div className="flex items-center gap-2 overflow-x-auto scrollbar-hide pb-6">
            {allCategories.map((category) => (
              <button
                key={category}
                onClick={() => setActiveCategory(category)}
                className={`whitespace-nowrap px-5 py-2 rounded-full text-sm font-medium border transition-colors ${
                  activeCategory === category 
                  ? 'bg-accent border-accent text-white' 
                  : 'bg-card-bg border-gray-300 dark:border-gray-700 text-text-muted hover:bg-gray-50 dark:hover:bg-gray-800'
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
            <h2 className="text-sm font-bold text-text-muted uppercase tracking-widest mb-4">Recently Viewed</h2>
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
            <div className="col-span-full py-20 text-center text-text-muted">
              No templates found matching your search.
            </div>
          )}
        </div>
      </main>

      {/* View Profile Modal */}
      {showProfileModal && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <div className="bg-bg-main w-full max-w-sm rounded-2xl overflow-hidden shadow-2xl border border-gray-100 dark:border-gray-800">
            <div className="p-8 text-center">
              <div className="mx-auto mb-4">
                <UserAvatar size="24" />
              </div>
              <h3 className="text-xl font-bold mb-1">{user.displayName}</h3>
              <p className="text-sm text-text-muted mb-8">{user.email || 'Guest User'}</p>
              
              <button 
                onClick={() => setShowProfileModal(false)}
                className="w-full bg-accent text-white font-bold py-3 rounded-xl hover:bg-indigo-700 transition-colors shadow-md"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

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
