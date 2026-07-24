import { useState, useCallback } from 'react';
import { tabs, tones, lengths, tabFields, getCharLimit, generateOutput } from './mockTemplates';

const HISTORY_KEY = 'solmates_emailgen_history';
const FAV_KEY = 'solmates_emailgen_favorites';

const load = (key, fallback) => {
  try { const r = localStorage.getItem(key); return r ? JSON.parse(r) : fallback; }
  catch { return fallback; }
};

const save = (key, val) => {
  try { localStorage.setItem(key, JSON.stringify(val)); } catch {}
};

const defaultFields = () => {
  const fields = {};
  Object.values(tabFields).forEach(fieldList => {
    fieldList.forEach(f => { fields[f.key] = ''; });
  });
  return fields;
};

export const useEmailGen = () => {
  const [activeTab, setActiveTab] = useState('linkedin');
  const [fields, setFields] = useState(defaultFields);
  const [tone, setTone] = useState('Professional');
  const [length, setLength] = useState('Medium (100-200 words)');
  const [output, setOutput] = useState('');
  const [generating, setGenerating] = useState(false);
  const [history, setHistory] = useState(() => load(HISTORY_KEY, []));
  const [favorites, setFavorites] = useState(() => load(FAV_KEY, []));
  const [showHistory, setShowHistory] = useState(false);

  const currentFields = tabFields[activeTab] || [];
  const charLimit = getCharLimit(activeTab);

  const setField = useCallback((key, val) => {
    setFields(prev => ({ ...prev, [key]: val }));
  }, []);

  const clearFields = useCallback(() => {
    setFields(defaultFields());
    setOutput('');
  }, []);

  const switchTab = useCallback((tab) => {
    setActiveTab(tab);
    setOutput('');
  }, []);

  const generate = useCallback(async () => {
    setGenerating(true);
    const text = await generateOutput(activeTab, fields, tone, length);
    setOutput(text);
    setGenerating(false);
    const entry = {
      id: Date.now(),
      tab: activeTab,
      fields: { ...fields },
      tone, length,
      output: text,
      date: new Date().toISOString(),
    };
    const next = [entry, ...history].slice(0, 50);
    setHistory(next);
    save(HISTORY_KEY, next);
  }, [activeTab, fields, tone, length, history]);

  const regenerate = useCallback(() => {
    generate();
  }, [generate]);

  const copyToClipboard = useCallback(async (text) => {
    try { await navigator.clipboard.writeText(text || output); return true; }
    catch { return false; }
  }, [output]);

  const toggleFavorite = useCallback(() => {
    if (!output) return;
    setFavorites(prev => {
      const exists = prev.find(f => f.output === output);
      let next;
      if (exists) {
        next = prev.filter(f => f.id !== exists.id);
      } else {
        const fav = {
          id: Date.now(),
          tab: activeTab,
          fields: { ...fields },
          tone, output,
          date: new Date().toISOString(),
        };
        next = [fav, ...prev].slice(0, 50);
      }
      save(FAV_KEY, next);
      return next;
    });
  }, [output, activeTab, fields, tone]);

  const isFavorited = favorites.some(f => f.output === output);

  const loadFromHistory = useCallback((entry) => {
    setActiveTab(entry.tab);
    setFields(entry.fields || defaultFields());
    setTone(entry.tone || 'Professional');
    setLength(entry.length || 'Medium (100-200 words)');
    setOutput(entry.output);
    setShowHistory(false);
  }, []);

  const loadFromFavorite = useCallback((fav) => {
    setActiveTab(fav.tab);
    setFields(fav.fields || defaultFields());
    setTone(fav.tone || 'Professional');
    setOutput(fav.output);
    setShowHistory(false);
  }, []);

  const deleteEntry = useCallback((id) => {
    setHistory(prev => {
      const next = prev.filter(h => h.id !== id);
      save(HISTORY_KEY, next);
      return next;
    });
    setFavorites(prev => {
      const next = prev.filter(f => f.id !== id);
      save(FAV_KEY, next);
      return next;
    });
  }, []);

  const clearAll = useCallback(() => {
    setHistory([]);
    setFavorites([]);
    save(HISTORY_KEY, []);
    save(FAV_KEY, []);
  }, []);

  return {
    tabs, tones, lengths, tabFields,
    activeTab, switchTab,
    currentFields, fields, setField, clearFields,
    tone, setTone, length, setLength,
    output, generating, charLimit,
    generate, regenerate, copyToClipboard,
    history, favorites, showHistory, setShowHistory,
    toggleFavorite, isFavorited,
    loadFromHistory, loadFromFavorite, deleteEntry, clearAll,
  };
};
