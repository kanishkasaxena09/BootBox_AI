import { useState, useCallback } from 'react';
import { calculateInHand, defaultExpenses } from './mockData';

const STORAGE_KEY = 'bootbox_salary_history';

export default function useSalaryCalc() {
  const [ctc, setCtc] = useState('');
  const [bonus, setBonus] = useState('');
  const [deductEpf, setDeductEpf] = useState(true);
  const [deductProfTax, setDeductProfTax] = useState(true);
  const [expenses, setExpenses] = useState(defaultExpenses);
  const [customExpenses, setCustomExpenses] = useState([]);
  const [result, setResult] = useState(null);
  const [history, setHistory] = useState(() => {
    try { return JSON.parse(localStorage.getItem(STORAGE_KEY)) || []; }
    catch { return []; }
  });

  const updateExpense = useCallback((id, value) => {
    setExpenses(prev => prev.map(e => e.id === id ? { ...e, amount: Number(value) || 0 } : e));
  }, []);

  const addCustomExpense = useCallback(() => {
    setCustomExpenses(prev => [...prev, {
      id: 'custom-' + Date.now(),
      label: 'Custom Expense',
      icon: 'CircleDollarSign',
      placeholder: 'e.g. 1000',
      amount: 0,
    }]);
  }, []);

  const updateCustomExpense = useCallback((id, field, value) => {
    setCustomExpenses(prev => prev.map(e => e.id === id ? { ...e, [field]: field === 'amount' ? Number(value) || 0 : value } : e));
  }, []);

  const removeCustomExpense = useCallback((id) => {
    setCustomExpenses(prev => prev.filter(e => e.id !== id));
  }, []);

  const handleCalculate = useCallback(() => {
    if (!ctc || Number(ctc) <= 0) return;
    const res = calculateInHand({
      ctc, bonus, deductEpf, deductProfTax, expenses, customExpenses,
    });
    setResult(res);

    const entry = {
      id: Date.now(),
      ctc: Number(ctc),
      bonus: Number(bonus) || 0,
      deductEpf,
      deductProfTax,
      result: res,
      timestamp: new Date().toISOString(),
    };
    setHistory(prev => {
      const next = [entry, ...prev].slice(0, 20);
      localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
      return next;
    });
  }, [ctc, bonus, deductEpf, deductProfTax, expenses, customExpenses]);

  const clearHistory = useCallback(() => {
    setHistory([]);
    localStorage.removeItem(STORAGE_KEY);
  }, []);

  const removeHistoryEntry = useCallback((id) => {
    setHistory(prev => {
      const next = prev.filter(e => e.id !== id);
      localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
      return next;
    });
  }, []);

  const loadHistoryEntry = useCallback((entry) => {
    setCtc(String(entry.ctc));
    setBonus(String(entry.bonus || ''));
    setDeductEpf(entry.deductEpf);
    setDeductProfTax(entry.deductProfTax);
    setResult(null);
  }, []);

  const canCalculate = Number(ctc) > 0;

  return {
    ctc, setCtc,
    bonus, setBonus,
    deductEpf, setDeductEpf,
    deductProfTax, setDeductProfTax,
    expenses, updateExpense,
    customExpenses, addCustomExpense, updateCustomExpense, removeCustomExpense,
    result, handleCalculate, canCalculate,
    history, clearHistory, removeHistoryEntry, loadHistoryEntry,
  };
}
