import { useState, useCallback } from 'react';
import {
  defaultInputs, defaultTasks, defaultAssets, defaultExitChecklist,
  generateResignationLetter, generateNoticeMail, generateManagerMail,
  generateKnowledgeTransfer, generateTaskHandover, generateAssetChecklist,
  generateExitChecklist,
} from './mockData';

const STORAGE_KEY = 'bootbox_resignation_data';

export default function useResignation() {
  const [inputs, setInputs] = useState(() => {
    try { return JSON.parse(localStorage.getItem(STORAGE_KEY)) || { ...defaultInputs }; }
    catch { return { ...defaultInputs }; }
  });
  const [activeDoc, setActiveDoc] = useState('resignation');
  const [tasks, setTasks] = useState([...defaultTasks]);
  const [assets, setAssets] = useState([...defaultAssets]);
  const [exitChecklist, setExitChecklist] = useState([...defaultExitChecklist]);

  const updateInput = useCallback((field, value) => {
    setInputs(prev => {
      const next = { ...prev, [field]: value };
      localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
      return next;
    });
  }, []);

  const addTask = useCallback(() => {
    setTasks(prev => [...prev, { id: 't' + Date.now(), task: '', status: 'Pending', assignee: '', deadline: '', notes: '' }]);
  }, []);

  const updateTask = useCallback((id, field, value) => {
    setTasks(prev => prev.map(t => t.id === id ? { ...t, [field]: value } : t));
  }, []);

  const removeTask = useCallback((id) => {
    setTasks(prev => prev.filter(t => t.id !== id));
  }, []);

  const addAsset = useCallback(() => {
    setAssets(prev => [...prev, { id: 'a' + Date.now(), item: '', serial: '', status: 'With Employee', returned: false }]);
  }, []);

  const updateAsset = useCallback((id, field, value) => {
    setAssets(prev => prev.map(a => a.id === id ? { ...a, [field]: value } : a));
  }, []);

  const toggleAssetReturned = useCallback((id) => {
    setAssets(prev => prev.map(a => a.id === id ? { ...a, returned: !a.returned, status: !a.returned ? 'Returned' : 'With Employee' } : a));
  }, []);

  const removeAsset = useCallback((id) => {
    setAssets(prev => prev.filter(a => a.id !== id));
  }, []);

  const toggleExitItem = useCallback((id) => {
    setExitChecklist(prev => prev.map(c => c.id === id ? { ...c, done: !c.done } : c));
  }, []);

  const getOutput = useCallback(async () => {
    switch (activeDoc) {
      case 'resignation': return await generateResignationLetter(inputs);
      case 'notice': return await generateNoticeMail(inputs);
      case 'manager': return await generateManagerMail(inputs);
      case 'knowledge': return await generateKnowledgeTransfer(inputs);
      case 'handover': return generateTaskHandover(inputs, tasks);
      case 'assets': return generateAssetChecklist(inputs, assets);
      case 'exit': return generateExitChecklist(inputs, exitChecklist);
      default: return '';
    }
  }, [activeDoc, inputs, tasks, assets, exitChecklist]);

  const reset = useCallback(() => {
    setInputs({ ...defaultInputs });
    setTasks([...defaultTasks]);
    setAssets([...defaultAssets]);
    setExitChecklist([...defaultExitChecklist]);
    localStorage.removeItem(STORAGE_KEY);
  }, []);

  return {
    inputs, updateInput,
    activeDoc, setActiveDoc,
    tasks, addTask, updateTask, removeTask,
    assets, addAsset, updateAsset, toggleAssetReturned, removeAsset,
    exitChecklist, toggleExitItem,
    getOutput, reset,
  };
}
