import { useState, useCallback } from 'react';
import { SAMPLE_TEXT, humanizeText } from './mockData';

const HISTORY_KEY = 'bootbox_text_humanizer';

function computeMetrics(text) {
  if (!text?.trim()) return { readabilityScore: 0, aiDetection: 50, wordCount: 0, sentenceCount: 0 };
  const words = text.split(/\s+/).filter(Boolean);
  const wordCount = words.length;
  const sentences = text.split(/[.!?]+/).filter(s => s.trim()).length;
  const avgWordsPerSentence = sentences > 0 ? wordCount / sentences : 0;
  const syllableCount = words.reduce((sum, w) => sum + Math.max(1, w.replace(/[^aeiou]/gi, '').length), 0);
  const readabilityScore = Math.max(0, Math.min(100, Math.round(206.835 - 1.015 * avgWordsPerSentence - 84.6 * (syllableCount / Math.max(1, wordCount)))));
  const aiWords = ['delve', 'leverage', 'holistic', 'robust', 'pivotal', 'fostering', 'synergy', 'comprehensive', 'innovative', 'cutting-edge', 'seamless', 'transformative', 'myriad', 'plethora', 'meticulous', 'moreover', 'furthermore', 'consequently', 'utilize', 'streamline', 'optimize', 'enhance', 'tapestry', 'landscape', 'harnessing', 'unprecedented'];
  const lowerText = text.toLowerCase();
  const aiHits = aiWords.filter(w => lowerText.includes(w)).length;
  let aiDetection = Math.max(5, Math.min(60, 15 + aiHits * 5 + (wordCount > 200 ? 10 : 0)));
  return { readabilityScore, aiDetection, wordCount, sentenceCount: sentences };
}

export default function useTextHumanizer() {
  const [inputText, setInputText] = useState('');
  const [tone, setTone] = useState('professional');
  const [result, setResult] = useState(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [history, setHistory] = useState(() => {
    try { return JSON.parse(localStorage.getItem(HISTORY_KEY)) || []; }
    catch { return []; }
  });

  const humanize = useCallback(async (text, selectedTone) => {
    const src = text || inputText;
    const t = selectedTone || tone;
    if (!src.trim()) return;
    setIsProcessing(true);
    try {
      const res = await fetch('/api/humanize', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text: src, tone: t }),
      });
      const data = await res.json();
      if (res.ok && data.humanized) {
        const metrics = computeMetrics(data.humanized);
        const humanizedResult = {
          humanized: data.humanized,
          input: src,
          tone: t,
          ...metrics,
          changes: [{ from: '(AI text)', to: '(humanized)', type: 'ai-rewrite' }],
          timestamp: new Date().toISOString(),
        };
        setResult(humanizedResult);
        const entry = {
          id: Date.now(),
          input: src,
          output: data.humanized,
          tone: t,
          readabilityScore: metrics.readabilityScore,
          aiDetection: metrics.aiDetection,
          changes: 1,
          timestamp: new Date().toISOString(),
        };
        setHistory(prev => {
          const next = [entry, ...prev].slice(0, 30);
          try { localStorage.setItem(HISTORY_KEY, JSON.stringify(next)); } catch {}
          return next;
        });
      } else if (data.fallback) {
        throw new Error('fallback');
      } else {
        throw new Error(data.error || 'Humanization failed');
      }
    } catch {
      const fallbackResult = humanizeText(src, t);
      const metrics = computeMetrics(fallbackResult.humanized);
      setResult({ ...fallbackResult, input: src, tone: t, ...metrics });
      const entry = {
        id: Date.now(),
        input: src,
        output: fallbackResult.humanized,
        tone: t,
        readabilityScore: metrics.readabilityScore,
        aiDetection: metrics.aiDetection,
        changes: fallbackResult.changes.length,
        timestamp: new Date().toISOString(),
      };
      setHistory(prev => {
        const next = [entry, ...prev].slice(0, 30);
        try { localStorage.setItem(HISTORY_KEY, JSON.stringify(next)); } catch {}
        return next;
      });
    } finally {
      setIsProcessing(false);
    }
  }, [inputText, tone]);

  const regenerate = useCallback(() => {
    if (result?.input) humanize(result.input, result.tone);
  }, [result, humanize]);

  const loadHistory = useCallback((entry) => {
    setInputText(entry.input);
    setTone(entry.tone);
    setResult(null);
  }, []);

  const removeHistory = useCallback((id) => {
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
    setInputText('');
    setResult(null);
  }, []);

  const loadSample = useCallback(() => {
    setInputText(SAMPLE_TEXT);
    setResult(null);
  }, []);

  return {
    inputText, setInputText,
    tone, setTone,
    result, isProcessing,
    humanize, regenerate, reset, loadSample,
    history, loadHistory, removeHistory, clearHistory,
  };
}
