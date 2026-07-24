import { useState, useCallback } from 'react';
import { defaultInputs, calculateNoticePeriod } from './mockData';

const HISTORY_KEY = 'bootbox_notice_period_history';

export default function useNoticePeriod() {
  const [inputs, setInputs] = useState({ ...defaultInputs });
  const [result, setResult] = useState(null);
  const [history, setHistory] = useState(() => {
    try { return JSON.parse(localStorage.getItem(HISTORY_KEY)) || []; }
    catch { return []; }
  });

  const updateInput = useCallback((field, value) => {
    setInputs(prev => ({ ...prev, [field]: value }));
  }, []);

  const calculate = useCallback(() => {
    const res = calculateNoticePeriod(inputs);
    if (!res) return;
    setResult(res);
    const entry = {
      id: Date.now(),
      inputs: { ...inputs },
      result: res,
      timestamp: new Date().toISOString(),
    };
    setHistory(prev => {
      const next = [entry, ...prev].slice(0, 20);
      localStorage.setItem(HISTORY_KEY, JSON.stringify(next));
      return next;
    });
  }, [inputs]);

  const loadEntry = useCallback((entry) => {
    setInputs({ ...entry.inputs });
    setResult(null);
  }, []);

  const removeEntry = useCallback((id) => {
    setHistory(prev => {
      const next = prev.filter(e => e.id !== id);
      localStorage.setItem(HISTORY_KEY, JSON.stringify(next));
      return next;
    });
  }, []);

  const clearHistory = useCallback(() => {
    setHistory([]);
    localStorage.removeItem(HISTORY_KEY);
  }, []);

  const reset = useCallback(() => {
    setInputs({ ...defaultInputs });
    setResult(null);
  }, []);

  const canCalculate = !!inputs.lastWorkingDay;

  return {
    inputs, updateInput,
    result, calculate, canCalculate, reset,
    history, loadEntry, removeEntry, clearHistory,
  };
}
