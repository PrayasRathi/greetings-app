import { useState, useEffect } from 'react';

export const useRecentlyViewed = (userId = 'guest') => {
  const [recentIds, setRecentIds] = useState([]);
  const key = `greetings_recent_${userId}`;

  useEffect(() => {
    const saved = localStorage.getItem(key);
    if (saved) {
      setRecentIds(JSON.parse(saved));
    } else {
      setRecentIds([]);
    }
  }, [key]);

  const addToRecent = (id) => {
    setRecentIds(prev => {
      const filtered = prev.filter(item => item !== id);
      const updated = [id, ...filtered].slice(0, 4);
      localStorage.setItem(key, JSON.stringify(updated));
      return updated;
    });
  };

  return { recentIds, addToRecent };
};
