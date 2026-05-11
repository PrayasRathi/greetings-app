import { useState, useEffect } from 'react';
import { showToast } from '../utils/toast';

export const useFavourites = () => {
  const [favourites, setFavourites] = useState([]);

  useEffect(() => {
    const saved = localStorage.getItem('greetings_favourites');
    if (saved) {
      setFavourites(JSON.parse(saved));
    }
  }, []);

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
      localStorage.setItem('greetings_favourites', JSON.stringify(updated));
      return updated;
    });
  };

  const isFavourite = (id) => favourites.includes(id);

  return { favourites, toggleFavourite, isFavourite };
};
