import React, { useState, useEffect, useCallback, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Play, Pause, Square, SkipForward, SkipBack, Upload, FileText, Type,
  Maximize, Minimize, RotateCcw, Mic, MicOff, Settings, Keyboard,
  Sun, Moon, FlipHorizontal, ChevronUp, ChevronDown, MonitorPlay, Volume2, X
} from 'lucide-react';
import useTeleprompter from './useTeleprompter';
import { SPEED_MIN, SPEED_MAX, FONT_MIN, FONT_MAX, KEYBOARD_SHORTCUTS } from './mockData';

const inputCls = "w-full px-3 py-2.5 rounded-xl text-xs font-bold bg-[var(--bg-secondary)] border border-[var(--border)] text-[var(--text-primary)] focus:outline-none focus:border-indigo-500/30 transition-all [color-scheme:dark]";

const Teleprompter = () => {
  const {
    text, setText, settings, updateSetting,
    isScrolling, isPaused, isFullscreen, isListening, speechStatus,
    scrollRef,
    play, pause, resume, stop, togglePlay,
    adjustSpeed, adjustFontSize,
    toggleFullscreen, toggleSpeech,
    importTxt, importDocx, resetScroll,
  } = useTeleprompter();

  const [activePanel, setActivePanel] = useState('text'); // 'text' | 'controls' | 'shortcuts'
  const [showControls, setShowControls] = useState(true);
  const txtInputRef = useRef(null);
  const docxInputRef = useRef(null);

  // Keyboard shortcuts
  useEffect(() => {
    const handler = (e) => {
      if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA' || e.target.tagName === 'SELECT') return;
      switch (e.key) {
        case ' ': e.preventDefault(); togglePlay(); break;
        case 'ArrowUp': e.preventDefault(); adjustSpeed(1); break;
        case 'ArrowDown': e.preventDefault(); adjustSpeed(-1); break;
        case '+': case '=': e.preventDefault(); adjustFontSize(2); break;
        case '-': e.preventDefault(); adjustFontSize(-2); break;
        case 'f': case 'F': e.preventDefault(); toggleFullscreen(); break;
        case 'm': case 'M': e.preventDefault(); updateSetting('isMirrorMode', !settings.isMirrorMode); break;
        case 'd': case 'D': e.preventDefault(); updateSetting('isDarkMode', !settings.isDarkMode); break;
        case 'r': case 'R': e.preventDefault(); resetScroll(); break;
        case 'Escape': if (document.fullscreenElement) document.exitFullscreen(); break;
      }
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [togglePlay, adjustSpeed, adjustFontSize, toggleFullscreen, updateSetting, settings.isMirrorMode, settings.isDarkMode, resetScroll]);

  const handleTxtImport = (e) => {
    const file = e.target.files?.[0];
    if (file) importTxt(file);
    if (txtInputRef.current) txtInputRef.current.value = '';
  };
  const handleDocxImport = (e) => {
    const file = e.target.files?.[0];
    if (file) importDocx(file);
    if (docxInputRef.current) docxInputRef.current.value = '';
  };

  const panelTabs = [
    { id: 'text', label: 'Script', icon: FileText },
    { id: 'controls', label: 'Controls', icon: Settings },
    { id: 'shortcuts', label: 'Keys', icon: Keyboard },
  ];

  // Fullscreen view
  if (isFullscreen) {
    return (
      <div className={`fixed inset-0 z-[9999] flex flex-col ${settings.isDarkMode ? 'bg-black' : 'bg-white'}`}
        style={{ cursor: showControls ? 'default' : 'none' }}>
        {/* Floating controls */}
        <AnimatePresence>
          {showControls && (
            <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }}
              className="absolute top-0 left-0 right-0 z-20 flex items-center justify-between px-6 py-3 bg-gradient-to-b from-black/80 to-transparent">
              <div className="flex items-center gap-2">
                <button onClick={togglePlay}
                  className={`p-2.5 rounded-xl ${isScrolling && !isPaused ? 'bg-amber-500/20 text-amber-400' : 'bg-green-500/20 text-green-400'}`}>
                  {isScrolling && !isPaused ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
                </button>
                <button onClick={stop} className="p-2.5 rounded-xl bg-red-500/20 text-red-400"><Square className="w-4 h-4" /></button>
                <button onClick={() => adjustSpeed(-1)} className="p-2 rounded-lg bg-white/10 text-white"><ChevronDown className="w-3.5 h-3.5" /></button>
                <span className="text-xs font-bold text-white/80 min-w-[32px] text-center">{settings.speed}x</span>
                <button onClick={() => adjustSpeed(1)} className="p-2 rounded-lg bg-white/10 text-white"><ChevronUp className="w-3.5 h-3.5" /></button>
              </div>
              <div className="flex items-center gap-2">
                {speechStatus && <span className="text-[10px] font-bold text-green-400 px-2 py-1 rounded-lg bg-green-500/10">{speechStatus}</span>}
                <button onClick={toggleSpeech}
                  className={`p-2.5 rounded-xl ${isListening ? 'bg-green-500/20 text-green-400' : 'bg-white/10 text-white/60'}`}>
                  {isListening ? <Volume2 className="w-4 h-4" /> : <Mic className="w-4 h-4" />}
                </button>
                <button onClick={() => { resetScroll(); }}
                  className="p-2.5 rounded-xl bg-white/10 text-white/60"><RotateCcw className="w-4 h-4" /></button>
                <button onClick={toggleFullscreen} className="p-2.5 rounded-xl bg-white/10 text-white/60"><Minimize className="w-4 h-4" /></button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Text display */}
        <div ref={scrollRef} className="flex-1 overflow-y-auto px-8 md:px-24 py-20"
          onClick={() => setShowControls(c => !c)}
          style={{ transform: settings.isMirrorMode ? 'scaleX(-1)' : 'none' }}>
          <div className="max-w-3xl mx-auto whitespace-pre-wrap" style={{
            fontSize: settings.fontSize,
            lineHeight: settings.lineHeight,
            color: settings.isDarkMode ? '#ffffff' : '#1a1a1a',
            fontFamily: 'Georgia, "Times New Roman", serif',
          }}>
            {text}
          </div>
        </div>

        {/* Center play indicator */}
        {!showControls && isScrolling && !isPaused && (
          <div className="absolute bottom-8 left-1/2 -translate-x-1/2 px-3 py-1.5 rounded-full bg-white/10 text-white/50 text-[10px] font-bold">
            {settings.speed}x · Playing
          </div>
        )}
      </div>
    );
  }

  // Normal view
  return (
    <div className="max-w-7xl mx-auto space-y-6">
      {/* Header */}
      <div className="text-center space-y-2">
        <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-gradient-to-br from-indigo-500/20 to-cyan-500/20 border border-indigo-500/30">
          <MonitorPlay className="w-7 h-7 text-indigo-400" />
        </div>
        <h1 className="text-3xl font-black bg-gradient-to-r from-indigo-400 via-cyan-400 to-teal-400 bg-clip-text text-transparent">
          Web Teleprompter
        </h1>
        <p className="text-sm text-[var(--text-secondary)] max-w-md mx-auto">
          Auto-scrolling script reader with voice control, mirror mode & fullscreen.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
        {/* Left: Controls Panel */}
        <div className="lg:col-span-4 space-y-4">
          {/* Panel Tabs */}
          <div className="glass-panel rounded-2xl p-1.5 border border-[var(--border)] flex gap-1">
            {panelTabs.map(tab => {
              const Icon = tab.icon;
              return (
                <button key={tab.id} onClick={() => setActivePanel(tab.id)}
                  className={`flex-1 flex items-center justify-center gap-1.5 py-2 rounded-xl text-[10px] font-bold transition-all ${
                    activePanel === tab.id ? 'bg-indigo-500/10 text-indigo-500 border border-indigo-500/20' : 'text-[var(--text-secondary)] border border-transparent'
                  }`}>
                  <Icon className="w-3 h-3" /> {tab.label}
                </button>
              );
            })}
          </div>

          {/* Script Panel */}
          {activePanel === 'text' && (
            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
              className="glass-panel border border-[var(--border)] rounded-2xl p-5 space-y-4">
              <textarea value={text} onChange={e => setText(e.target.value)} rows={12}
                className={inputCls + ' resize-none font-mono text-[11px] leading-relaxed'}
                placeholder="Paste your script here..." />
              <div className="flex gap-2">
                <button onClick={() => txtInputRef.current?.click()}
                  className="flex-1 flex items-center justify-center gap-1.5 py-2.5 rounded-xl bg-[var(--bg-secondary)] border border-[var(--border)] text-[var(--text-secondary)] hover:text-indigo-500 font-bold text-[10px] transition-all">
                  <Upload className="w-3 h-3" /> Import TXT
                </button>
                <button onClick={() => docxInputRef.current?.click()}
                  className="flex-1 flex items-center justify-center gap-1.5 py-2.5 rounded-xl bg-[var(--bg-secondary)] border border-[var(--border)] text-[var(--text-secondary)] hover:text-indigo-500 font-bold text-[10px] transition-all">
                  <Upload className="w-3 h-3" /> Import DOCX
                </button>
                <input ref={txtInputRef} type="file" accept=".txt" className="hidden" onChange={handleTxtImport} />
                <input ref={docxInputRef} type="file" accept=".docx" className="hidden" onChange={handleDocxImport} />
              </div>
              <p className="text-[9px] text-[var(--text-secondary)] text-center">{text.split(/\s+/).filter(Boolean).length} words · {text.length} chars</p>
            </motion.div>
          )}

          {/* Controls Panel */}
          {activePanel === 'controls' && (
            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
              className="glass-panel border border-[var(--border)] rounded-2xl p-5 space-y-5">
              {/* Playback */}
              <div className="space-y-3">
                <h4 className="text-[10px] font-bold uppercase tracking-wider text-[var(--text-secondary)]">Playback</h4>
                <div className="flex items-center justify-center gap-3">
                  <button onClick={resetScroll} className="p-2.5 rounded-xl bg-[var(--bg-secondary)] border border-[var(--border)] text-[var(--text-secondary)] hover:text-[var(--text-primary)]">
                    <RotateCcw className="w-4 h-4" />
                  </button>
                  <button onClick={togglePlay}
                    className={`p-4 rounded-2xl shadow-lg transition-all ${
                      isScrolling && !isPaused
                        ? 'bg-gradient-to-r from-amber-500 to-orange-600 text-white shadow-amber-500/25'
                        : 'bg-gradient-to-r from-green-500 to-emerald-600 text-white shadow-green-500/25'
                    }`}>
                    {isScrolling && !isPaused ? <Pause className="w-6 h-6" /> : <Play className="w-6 h-6" />}
                  </button>
                  <button onClick={stop} className="p-2.5 rounded-xl bg-[var(--bg-secondary)] border border-[var(--border)] text-[var(--text-secondary)] hover:text-red-500">
                    <Square className="w-4 h-4" />
                  </button>
                </div>
                {isScrolling && (
                  <p className="text-center text-[10px] font-bold text-[var(--text-secondary)]">
                    {isPaused ? 'Paused' : 'Scrolling at'} {isPaused ? '' : `${settings.speed}x`}
                  </p>
                )}
              </div>

              {/* Speed */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <label className="text-[10px] font-bold uppercase tracking-wider text-[var(--text-secondary)]">Scroll Speed</label>
                  <span className="text-xs font-black text-indigo-500">{settings.speed}x</span>
                </div>
                <div className="flex items-center gap-2">
                  <button onClick={() => adjustSpeed(-1)} className="p-1.5 rounded-lg bg-[var(--bg-secondary)] border border-[var(--border)]"><ChevronDown className="w-3 h-3 text-[var(--text-secondary)]" /></button>
                  <input type="range" min={SPEED_MIN} max={SPEED_MAX} value={settings.speed}
                    onChange={e => updateSetting('speed', Number(e.target.value))}
                    className="flex-1 h-1.5 rounded-full appearance-none bg-[var(--bg-secondary)] accent-indigo-500 cursor-pointer" />
                  <button onClick={() => adjustSpeed(1)} className="p-1.5 rounded-lg bg-[var(--bg-secondary)] border border-[var(--border)]"><ChevronUp className="w-3 h-3 text-[var(--text-secondary)]" /></button>
                </div>
              </div>

              {/* Font Size */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <label className="text-[10px] font-bold uppercase tracking-wider text-[var(--text-secondary)]">Font Size</label>
                  <span className="text-xs font-black text-indigo-500">{settings.fontSize}px</span>
                </div>
                <div className="flex items-center gap-2">
                  <button onClick={() => adjustFontSize(-2)} className="p-1.5 rounded-lg bg-[var(--bg-secondary)] border border-[var(--border)]"><Type className="w-3 h-3 text-[var(--text-secondary)]" /></button>
                  <input type="range" min={FONT_MIN} max={FONT_MAX} value={settings.fontSize}
                    onChange={e => updateSetting('fontSize', Number(e.target.value))}
                    className="flex-1 h-1.5 rounded-full appearance-none bg-[var(--bg-secondary)] accent-indigo-500 cursor-pointer" />
                  <button onClick={() => adjustFontSize(2)} className="p-1.5 rounded-lg bg-[var(--bg-secondary)] border border-[var(--border)]"><Type className="w-4 h-4 text-[var(--text-secondary)]" /></button>
                </div>
              </div>

              {/* Display Toggles */}
              <div className="space-y-3">
                <h4 className="text-[10px] font-bold uppercase tracking-wider text-[var(--text-secondary)]">Display</h4>
                <div className="grid grid-cols-2 gap-2">
                  <button onClick={() => updateSetting('isDarkMode', !settings.isDarkMode)}
                    className={`flex items-center justify-center gap-1.5 py-2.5 rounded-xl text-[10px] font-bold border transition-all ${
                      settings.isDarkMode ? 'bg-indigo-500/10 border-indigo-500/30 text-indigo-500' : 'bg-[var(--bg-secondary)] border-[var(--border)] text-[var(--text-secondary)]'
                    }`}>
                    {settings.isDarkMode ? <Moon className="w-3 h-3" /> : <Sun className="w-3 h-3" />} Dark
                  </button>
                  <button onClick={() => updateSetting('isMirrorMode', !settings.isMirrorMode)}
                    className={`flex items-center justify-center gap-1.5 py-2.5 rounded-xl text-[10px] font-bold border transition-all ${
                      settings.isMirrorMode ? 'bg-indigo-500/10 border-indigo-500/30 text-indigo-500' : 'bg-[var(--bg-secondary)] border-[var(--border)] text-[var(--text-secondary)]'
                    }`}>
                    <FlipHorizontal className="w-3 h-3" /> Mirror
                  </button>
                  <button onClick={toggleFullscreen}
                    className="flex items-center justify-center gap-1.5 py-2.5 rounded-xl bg-[var(--bg-secondary)] border border-[var(--border)] text-[10px] font-bold text-[var(--text-secondary)] hover:text-indigo-500 transition-all col-span-2">
                    <Maximize className="w-3 h-3" /> Fullscreen
                  </button>
                </div>
              </div>

              {/* Speech Recognition */}
              <div className="space-y-3">
                <h4 className="text-[10px] font-bold uppercase tracking-wider text-[var(--text-secondary)]">Voice Control</h4>
                <button onClick={toggleSpeech}
                  className={`w-full flex items-center justify-center gap-1.5 py-2.5 rounded-xl text-[10px] font-bold border transition-all ${
                    isListening ? 'bg-green-500/10 border-green-500/30 text-green-500' : 'bg-[var(--bg-secondary)] border-[var(--border)] text-[var(--text-secondary)] hover:text-green-500'
                  }`}>
                  {isListening ? <Volume2 className="w-3 h-3" /> : <Mic className="w-3 h-3" />}
                  {isListening ? 'Listening...' : 'Start Voice Control'}
                </button>
                {speechStatus && (
                  <p className="text-center text-[10px] font-bold text-green-500">{speechStatus}</p>
                )}
                {isListening && (
                  <div className="p-2.5 rounded-xl bg-green-500/5 border border-green-500/10 space-y-1">
                    <p className="text-[9px] font-bold text-green-500">Say:</p>
                    <div className="flex flex-wrap gap-1">
                      {['Start', 'Pause', 'Faster', 'Slower', 'Reset'].map(cmd => (
                        <span key={cmd} className="text-[9px] font-bold px-1.5 py-0.5 rounded bg-green-500/10 text-green-500">{cmd}</span>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </motion.div>
          )}

          {/* Shortcuts Panel */}
          {activePanel === 'shortcuts' && (
            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
              className="glass-panel border border-[var(--border)] rounded-2xl p-5 space-y-3">
              <h4 className="text-[10px] font-bold uppercase tracking-wider text-[var(--text-secondary)]">Keyboard Shortcuts</h4>
              <div className="space-y-1.5">
                {KEYBOARD_SHORTCUTS.map(s => (
                  <div key={s.key} className="flex items-center justify-between py-1.5 border-b border-[var(--border)] last:border-0">
                    <span className="text-[10px] font-bold text-[var(--text-secondary)]">{s.label}</span>
                    <kbd className="px-2 py-0.5 rounded bg-[var(--bg-secondary)] border border-[var(--border)] text-[9px] font-mono font-bold text-[var(--text-primary)]">{s.key}</kbd>
                  </div>
                ))}
              </div>
            </motion.div>
          )}
        </div>

        {/* Right: Teleprompter Display */}
        <div className="lg:col-span-8">
          <div className={`relative rounded-2xl border overflow-hidden ${
            settings.isDarkMode
              ? 'bg-black border-white/10'
              : 'bg-white border-gray-200'
          }`} style={{ height: 'calc(100vh - 240px)', minHeight: '400px' }}>
            {/* Scroll area */}
            <div ref={scrollRef} className="absolute inset-0 overflow-y-auto px-6 md:px-12 py-20"
              style={{ transform: settings.isMirrorMode ? 'scaleX(-1)' : 'none' }}>
              <div className="max-w-2xl mx-auto whitespace-pre-wrap" style={{
                fontSize: settings.fontSize,
                lineHeight: settings.lineHeight,
                color: settings.isDarkMode ? '#e2e8f0' : '#1e293b',
                fontFamily: 'Georgia, "Times New Roman", serif',
              }}>
                {text}
              </div>
              {/* Bottom spacer for scrolling past end */}
              <div style={{ height: '60vh' }} />
            </div>

            {/* Status bar */}
            <div className={`absolute bottom-0 left-0 right-0 flex items-center justify-between px-4 py-2 ${
              settings.isDarkMode ? 'bg-black/80' : 'bg-white/80'
            } backdrop-blur-sm border-t ${settings.isDarkMode ? 'border-white/10' : 'border-gray-200'}`}>
              <div className="flex items-center gap-3">
                <span className={`text-[9px] font-bold ${settings.isDarkMode ? 'text-white/50' : 'text-gray-400'}`}>
                  {settings.fontSize}px · {settings.speed}x
                </span>
                {settings.isMirrorMode && (
                  <span className="text-[9px] font-bold text-indigo-500">MIRROR</span>
                )}
              </div>
              <div className="flex items-center gap-2">
                {isListening && (
                  <span className="flex items-center gap-1 text-[9px] font-bold text-green-500">
                    <span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" /> VOICE
                  </span>
                )}
                {isScrolling && (
                  <span className={`text-[9px] font-bold ${isPaused ? 'text-amber-500' : 'text-green-500'}`}>
                    {isPaused ? 'PAUSED' : 'PLAYING'}
                  </span>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Teleprompter;
