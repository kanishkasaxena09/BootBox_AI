import { useState, useCallback } from 'react';
import { defaultInputs, calculateAttendance } from './mockData';

const HISTORY_KEY = 'bootbox_attendance_history';

export default function useAttendance() {
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
    const res = calculateAttendance(inputs);
    setResult(res);
    const entry = {
      id: Date.now(),
      inputs: { ...inputs },
      result: {
        currentPercentage: res.currentPercentage,
        classesNeeded: res.classesNeeded,
        classesCanSkip: res.classesCanSkip,
        status: res.status,
        statusType: res.statusType,
      },
      timestamp: new Date().toISOString(),
    };
    setHistory(prev => {
      const next = [entry, ...prev].slice(0, 20);
      try { localStorage.setItem(HISTORY_KEY, JSON.stringify(next)); } catch {}
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
      try { localStorage.setItem(HISTORY_KEY, JSON.stringify(next)); } catch {}
      return next;
    });
  }, []);

  const clearHistory = useCallback(() => {
    setHistory([]);
    try { localStorage.removeItem(HISTORY_KEY); } catch {}
  }, []);

  const reset = useCallback(() => {
    setInputs({ ...defaultInputs });
    setResult(null);
  }, []);

  return { inputs, updateInput, result, calculate, reset, history, loadEntry, removeEntry, clearHistory };
}
