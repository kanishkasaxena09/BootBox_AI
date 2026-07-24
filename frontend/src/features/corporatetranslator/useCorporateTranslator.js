import { useState, useCallback } from 'react';
import { applyTranslation } from './mockData';

const HISTORY_KEY = 'bootbox_corp_translator_history';
const FAVORITES_KEY = 'bootbox_corp_translator_favorites';

export default function useCorporateTranslator() {
  const [input, setInput] = useState('');
  const [output, setOutput] = useState('');
  const [direction, setDirection] = useState('simpleToCorporate');
  const [tone, setTone] = useState('formal');
  const [history, setHistory] = useState(() => {
    try { return JSON.parse(localStorage.getItem(HISTORY_KEY)) || []; }
    catch { return []; }
  });
  const [favorites, setFavorites] = useState(() => {
    try { return JSON.parse(localStorage.getItem(FAVORITES_KEY)) || []; }
    catch { return []; }
  });

  const translate = useCallback(async () => {
    if (!input.trim()) return;
    const result = await applyTranslation(input, direction, tone);
    setOutput(result);
    const entry = {
      id: Date.now(),
      input,
      output: result,
      direction,
      tone,
      timestamp: new Date().toISOString(),
    };
    setHistory(prev => {
      const next = [entry, ...prev].slice(0, 30);
      localStorage.setItem(HISTORY_KEY, JSON.stringify(next));
      return next;
    });
  }, [input, direction, tone]);

  const swapDirection = useCallback(() => {
    setDirection(d => d === 'simpleToCorporate' ? 'corporateToSimple' : 'simpleToCorporate');
    setInput(output);
    setOutput(input);
  }, [input, output]);

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
    setInput(entry.input);
    setDirection(entry.direction);
    setTone(entry.tone);
    setOutput(entry.output);
  }, []);

  const isFavorite = useCallback((id) => {
    return favorites.some(f => f.id === id);
  }, [favorites]);

  return {
    input, setInput, output, setOutput,
    direction, setDirection, tone, setTone,
    translate, swapDirection,
    history, removeHistoryEntry, clearHistory, loadEntry,
    favorites, toggleFavorite, removeFavorite, isFavorite,
  };
}
