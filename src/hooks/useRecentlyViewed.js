import { useState, useEffect } from 'react';

export const useRecentlyViewed = () => {
  const [recentIds, setRecentIds] = useState([]);

  useEffect(() => {
    const saved = localStorage.getItem('greetings_recent');
    if (saved) {
      setRecentIds(JSON.parse(saved));
    }
  }, []);

  const addToRecent = (id) => {
    setRecentIds(prev => {
      // Remove if already exists to move to front
      const filtered = prev.filter(item => item !== id);
      const updated = [id, ...filtered].slice(0, 4);
      localStorage.setItem('greetings_recent', JSON.stringify(updated));
      return updated;
    });
  };

  return { recentIds, addToRecent };
};
