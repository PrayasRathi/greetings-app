import { useState, useEffect } from 'react';
import { showToast } from '../utils/toast';

export const useFavourites = (userId = 'guest') => {
  const [favourites, setFavourites] = useState([]);
  const key = `greetings_favourites_${userId}`;

  useEffect(() => {
    const saved = localStorage.getItem(key);
    if (saved) {
      setFavourites(JSON.parse(saved));
    } else {
      setFavourites([]);
    }
  }, [key]);

  const toggleFavourite = (id) => {
    setFavourites(prev => {
      const isFav = prev.includes(id);
      let updated;
      if (isFav) {
        updated = prev.filter(favId => favId !== id);
        showToast("Removed from favourites");
      } else {
        updated = [...prev, id];
        showToast("Added to favourites!");
      }
      localStorage.setItem(key, JSON.stringify(updated));
      return updated;
    });
  };

  const isFavourite = (id) => favourites.includes(id);

  return { favourites, toggleFavourite, isFavourite };
};
