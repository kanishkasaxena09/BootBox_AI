import { useState, useCallback, useRef, useEffect } from 'react';
import mammoth from 'mammoth';
import { defaultSettings, SAMPLE_TEXT } from './mockData';

const STORAGE_KEY = 'bootbox_teleprompter';

export default function useTeleprompter() {
  const [text, setText] = useState(() => {
    try { return localStorage.getItem(STORAGE_KEY) || SAMPLE_TEXT; }
    catch { return SAMPLE_TEXT; }
  });
  const [settings, setSettings] = useState(() => {
    try { return { ...defaultSettings, ...JSON.parse(localStorage.getItem(STORAGE_KEY + '_settings')) }; }
    catch { return { ...defaultSettings }; }
  });
  const [isScrolling, setIsScrolling] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [speechStatus, setSpeechStatus] = useState('');
  const scrollRef = useRef(null);
  const rafRef = useRef(null);
  const lastTimeRef = useRef(0);
  const recognitionRef = useRef(null);

  // Persist
  useEffect(() => {
    try { localStorage.setItem(STORAGE_KEY, text); } catch {}
  }, [text]);
  useEffect(() => {
    try { localStorage.setItem(STORAGE_KEY + '_settings', JSON.stringify(settings)); } catch {}
  }, [settings]);

  // Auto-scroll animation loop
  useEffect(() => {
    if (!isScrolling || isPaused || !scrollRef.current) {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
      return;
    }
    const el = scrollRef.current;
    const tick = (time) => {
      if (!lastTimeRef.current) lastTimeRef.current = time;
      const delta = time - lastTimeRef.current;
      lastTimeRef.current = time;
      el.scrollTop += settings.speed * (delta / 16);
      if (el.scrollTop >= el.scrollHeight - el.clientHeight) {
        setIsScrolling(false);
        setIsPaused(false);
        return;
      }
      rafRef.current = requestAnimationFrame(tick);
    };
    lastTimeRef.current = 0;
    rafRef.current = requestAnimationFrame(tick);
    return () => { if (rafRef.current) cancelAnimationFrame(rafRef.current); };
  }, [isScrolling, isPaused, settings.speed]);

  // Fullscreen listener
  useEffect(() => {
    const handler = () => setIsFullscreen(!!document.fullscreenElement);
    document.addEventListener('fullscreenchange', handler);
    return () => document.removeEventListener('fullscreenchange', handler);
  }, []);

  // Playback controls
  const play = useCallback(() => { setIsPaused(false); setIsScrolling(true); }, []);
  const pause = useCallback(() => setIsPaused(true), []);
  const resume = useCallback(() => setIsPaused(false), []);
  const stop = useCallback(() => { setIsScrolling(false); setIsPaused(false); }, []);
  const togglePlay = useCallback(() => {
    if (!isScrolling) { play(); }
    else if (isPaused) { resume(); }
    else { pause(); }
  }, [isScrolling, isPaused, play, pause, resume]);

  // Settings
  const updateSetting = useCallback((key, value) => setSettings(s => ({ ...s, [key]: value })), []);
  const adjustSpeed = useCallback((delta) => setSettings(s => ({ ...s, speed: Math.max(1, Math.min(10, s.speed + delta)) })), []);
  const adjustFontSize = useCallback((delta) => setSettings(s => ({ ...s, fontSize: Math.max(16, Math.min(72, s.fontSize + delta)) })), []);

  // Fullscreen
  const toggleFullscreen = useCallback(async () => {
    try {
      if (document.fullscreenElement) await document.exitFullscreen();
      else await document.documentElement.requestFullscreen();
    } catch {}
  }, []);

  // File imports
  const importTxt = useCallback((file) => {
    const reader = new FileReader();
    reader.onload = (e) => setText(e.target.result);
    reader.readAsText(file);
  }, []);

  const importDocx = useCallback(async (file) => {
    try {
      const arrayBuffer = await file.arrayBuffer();
      const result = await mammoth.extractRawText({ arrayBuffer });
      setText(result.value);
    } catch (err) {
      console.error('DOCX import failed:', err);
    }
  }, []);

  // Reset scroll position
  const resetScroll = useCallback(() => {
    if (scrollRef.current) scrollRef.current.scrollTop = 0;
  }, []);

  // Speech Recognition
  const toggleSpeech = useCallback(() => {
    if (isListening) {
      recognitionRef.current?.stop();
      setIsListening(false);
      setSpeechStatus('');
      return;
    }
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) { setSpeechStatus('Not supported'); return; }
    const recognition = new SpeechRecognition();
    recognition.continuous = true;
    recognition.interimResults = false;
    recognition.lang = 'en-US';
    recognition.onresult = (event) => {
      const last = event.results[event.results.length - 1];
      if (!last.isFinal) return;
      const transcript = last[0].transcript.trim().toLowerCase();
      if (transcript.includes('start') || transcript.includes('resume') || transcript.includes('go') || transcript.includes('play')) {
        play(); setSpeechStatus('Playing');
      } else if (transcript.includes('pause') || transcript.includes('stop') || transcript.includes('hold')) {
        pause(); setSpeechStatus('Paused');
      } else if (transcript.includes('faster')) {
        adjustSpeed(1); setSpeechStatus('Speed up');
      } else if (transcript.includes('slower')) {
        adjustSpeed(-1); setSpeechStatus('Speed down');
      } else if (transcript.includes('reset')) {
        resetScroll(); setSpeechStatus('Reset');
      }
      setTimeout(() => setSpeechStatus(''), 1500);
    };
    recognition.onerror = () => { setIsListening(false); setSpeechStatus(''); };
    recognition.onend = () => { if (isListening) try { recognition.start(); } catch {} };
    recognition.start();
    recognitionRef.current = recognition;
    setIsListening(true);
  }, [isListening, play, pause, adjustSpeed, resetScroll]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      recognitionRef.current?.stop();
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, []);

  return {
    text, setText,
    settings, updateSetting,
    isScrolling, isPaused, isFullscreen, isListening, speechStatus,
    scrollRef,
    play, pause, resume, stop, togglePlay,
    adjustSpeed, adjustFontSize,
    toggleFullscreen, toggleSpeech,
    importTxt, importDocx,
    resetScroll,
  };
}
