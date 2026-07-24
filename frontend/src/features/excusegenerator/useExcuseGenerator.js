import { useState, useCallback } from 'react';
import { generateExcuse } from './mockData';

const HISTORY_KEY = 'bootbox_excuse_history';
const FAVORITES_KEY = 'bootbox_excuse_favorites';

export default function useExcuseGenerator() {
  const [category, setCategory] = useState('leave');
  const [tone, setTone] = useState('formal');
  const [currentExcuse, setCurrentExcuse] = useState('');
  const [history, setHistory] = useState(() => {
    try { return JSON.parse(localStorage.getItem(HISTORY_KEY)) || []; }
    catch { return []; }
  });
  const [favorites, setFavorites] = useState(() => {
    try { return JSON.parse(localStorage.getItem(FAVORITES_KEY)) || []; }
    catch { return []; }
  });

  const generate = useCallback(async () => {
    const excuse = await generateExcuse(category, tone);
    setCurrentExcuse(excuse);
    const entry = {
      id: Date.now(),
      excuse,
      category,
      tone,
      timestamp: new Date().toISOString(),
    };
    setHistory(prev => {
      const next = [entry, ...prev].slice(0, 30);
      localStorage.setItem(HISTORY_KEY, JSON.stringify(next));
      return next;
    });
  }, [category, tone]);

  const regenerate = useCallback(async () => {
    const excuse = await generateExcuse(category, tone);
    setCurrentExcuse(excuse);
    const entry = {
      id: Date.now(),
      excuse,
      category,
      tone,
      timestamp: new Date().toISOString(),
    };
    setHistory(prev => {
      const next = [entry, ...prev].slice(0, 30);
      localStorage.setItem(HISTORY_KEY, JSON.stringify(next));
      return next;
    });
  }, [category, tone]);

  const toggleFavorite = useCallback((entry) => {
    setFavorites(prev => {
      const exists = prev.find(f => f.id === entry.id);
      let next;
      if (exists) {
        next = prev.filter(f => f.id !== entry.id);
      } else {
        next = [entry, ...prev].slice(0, 20);
      }
      localStorage.setItem(FAVORITES_KEY, JSON.stringify(next));
      return next;
    });
  }, []);

  const isFavorite = useCallback((id) => favorites.some(f => f.id === id), [favorites]);

  const removeHistoryEntry = useCallback((id) => {
    setHistory(prev => {
      const next = prev.filter(e => e.id !== id);
      localStorage.setItem(HISTORY_KEY, JSON.stringify(next));
      return next;
    });
  }, []);

  const removeFavorite = useCallback((id) => {
    setFavorites(prev => {
      const next = prev.filter(f => f.id !== id);
      localStorage.setItem(FAVORITES_KEY, JSON.stringify(next));
      return next;
    });
  }, []);

  const clearHistory = useCallback(() => {
    setHistory([]);
    localStorage.removeItem(HISTORY_KEY);
  }, []);

  const loadEntry = useCallback((entry) => {
    setCategory(entry.category);
    setTone(entry.tone);
    setCurrentExcuse(entry.excuse);
  }, []);

  return {
    category, setCategory,
    tone, setTone,
    currentExcuse,
    generate, regenerate,
    history, removeHistoryEntry, clearHistory, loadEntry,
    favorites, toggleFavorite, removeFavorite, isFavorite,
  };
}
