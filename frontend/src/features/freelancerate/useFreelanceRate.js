import { useState, useCallback } from 'react';
import { defaultInputs, calculateRates } from './mockData';

const HISTORY_KEY = 'bootbox_freelance_rate_history';

export default function useFreelanceRate() {
  const [inputs, setInputs] = useState({ ...defaultInputs });
  const [result, setResult] = useState(null);
  const [history, setHistory] = useState(() => {
    try { return JSON.parse(localStorage.getItem(HISTORY_KEY)) || []; }
    catch { return []; }
  });

  const updateInput = useCallback((field, value) => {
    setInputs(prev => ({ ...prev, [field]: Number(value) || 0 }));
  }, []);

  const calculate = useCallback(() => {
    const res = calculateRates(inputs);
    setResult(res);
    const entry = {
      id: Date.now(),
      inputs: { ...inputs },
      result: {
        hourlyRate: res.hourlyRate,
        dailyRate: res.dailyRate,
        weeklyRevenueTarget: res.weeklyRevenueTarget,
        monthlyRevenueTarget: res.monthlyRevenueTarget,
        annualRevenueTarget: res.annualRevenueTarget,
      },
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

  return {
    inputs, updateInput,
    result, calculate, reset,
    history, loadEntry, removeEntry, clearHistory,
  };
}
