import { useState, useCallback } from 'react';

export default function useLocalStorage(key, initialValue) {
  const [stored, setStored] = useState(() => {
    try {
      const item = localStorage.getItem(key);
      return item ? JSON.parse(item) : initialValue;
    } catch {
      return initialValue;
    }
  });

  const setValue = useCallback((value) => {
    try {
      const next = value instanceof Function ? value(stored) : value;
      setStored(next);
      localStorage.setItem(key, JSON.stringify(next));
    } catch {}
  }, [key, stored]);

  const removeValue = useCallback(() => {
    setStored(initialValue);
    localStorage.removeItem(key);
  }, [key, initialValue]);

  return [stored, setValue, removeValue];
}
