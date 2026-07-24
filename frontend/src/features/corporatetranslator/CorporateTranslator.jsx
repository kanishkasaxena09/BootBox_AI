import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Languages, ArrowRightLeft, Copy, Check, History, Star, Trash2, Sparkles,
  ChevronDown, ChevronUp, Briefcase, Building2, Users, Handshake, GraduationCap,
  ArrowRight, RotateCcw, Heart, X,
} from 'lucide-react';
import useCorporateTranslator from './useCorporateTranslator';
import { tones, suggestionPrompts } from './mockData';

const fadeUp = { initial: { opacity: 0, y: 10 }, animate: { opacity: 1, y: 0 }, transition: { duration: 0.2 } };

const toneIcons = { formal: Briefcase, executive: Building2, manager: Users, hr: GraduationCap, client: Handshake };

export default function CorporateTranslator() {
  const h = useCorporateTranslator();
  const [copied, setCopied] = useState(false);
  const [activeTab, setActiveTab] = useState('translator');
  const [showSuggestions, setShowSuggestions] = useState(false);

  const copy = (text) => {
    navigator.clipboard?.writeText(text).catch(() => {});
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };

  const selectedTone = tones.find(t => t.id === h.tone) || tones[0];
  const suggestions = suggestionPrompts[h.direction] || suggestionPrompts.simpleToCorporate;

  return (
    <div className="space-y-4">
      <div className="text-center space-y-2">
        <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-gradient-to-br from-indigo-500/20 to-violet-500/20 border border-indigo-500/30">
          <Languages className="w-7 h-7 text-indigo-400" />
        </div>
        <h1 className="text-3xl font-black bg-gradient-to-r from-indigo-400 via-violet-400 to-purple-400 bg-clip-text text-transparent">
          Corporate Translator
        </h1>
        <p className="text-sm text-[var(--text-secondary)] max-w-md mx-auto">
          Transform between plain language and corporate speak with multiple tones.
        </p>
      </div>

      <div className="glass-panel rounded-2xl p-1.5 border border-[var(--border)] flex items-center gap-1 w-fit mx-auto">
        {['translator', 'history', 'favorites'].map(tab => (
          <button key={tab} onClick={() => setActiveTab(tab)}
            className={`px-4 py-1.5 rounded-xl text-xs font-bold transition-all capitalize flex items-center gap-1.5
              ${activeTab === tab ? 'bg-[var(--accent)]/15 text-[var(--accent)]' : 'text-[var(--text-secondary)] hover:text-[var(--text-primary)]'}`}>
            {tab === 'history' && <History className="w-3 h-3" />}
            {tab === 'favorites' && <Star className="w-3 h-3" />}
            {tab}
          </button>
        ))}
      </div>

      <AnimatePresence mode="wait">
        {activeTab === 'translator' && (
          <motion.div key="translator" {...fadeUp} className="space-y-4">
            <div className="glass-panel rounded-2xl p-3 border border-[var(--border)] flex flex-wrap items-center gap-3">
              <div className="flex items-center gap-1 bg-[var(--bg-secondary)] rounded-xl p-0.5 border border-[var(--border)]">
                <button onClick={() => { h.setDirection('simpleToCorporate'); h.setOutput(''); }}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5
                    ${h.direction === 'simpleToCorporate' ? 'bg-indigo-500/20 text-indigo-400' : 'text-[var(--text-secondary)]'}`}>
                  <span className="hidden sm:inline">Simple</span> <ArrowRight className="w-3 h-3" /> <span className="hidden sm:inline">Corporate</span>
                </button>
                <button onClick={h.swapDirection}
                  className="p-1.5 rounded-lg text-[var(--text-secondary)] hover:text-[var(--accent)] hover:bg-[var(--accent)]/10 transition-all">
                  <ArrowRightLeft className="w-3.5 h-3.5" />
                </button>
                <button onClick={() => { h.setDirection('corporateToSimple'); h.setOutput(''); }}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5
                    ${h.direction === 'corporateToSimple' ? 'bg-indigo-500/20 text-indigo-400' : 'text-[var(--text-secondary)]'}`}>
                  <span className="hidden sm:inline">Corporate</span> <ArrowRight className="w-3 h-3" /> <span className="hidden sm:inline">Simple</span>
                </button>
              </div>
              <div className="h-5 w-px bg-[var(--border)] hidden sm:block" />
              <div className="flex items-center gap-1.5 flex-wrap">
                {tones.map(tone => {
                  const ToneIcon = toneIcons[tone.id] || Briefcase;
                  return (
                    <button key={tone.id} onClick={() => h.setTone(tone.id)}
                      className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl text-xs font-bold transition-all border
                        ${h.tone === tone.id
                          ? 'text-white border-transparent shadow-lg'
                          : 'text-[var(--text-secondary)] border-[var(--border)] hover:border-[var(--accent)]/30 bg-[var(--bg-secondary)]'
                        }`}
                      style={h.tone === tone.id ? { backgroundColor: tone.color, boxShadow: `0 4px 14px ${tone.color}40` } : {}}>
                      <ToneIcon className="w-3 h-3" />
                      <span className="hidden md:inline">{tone.name}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            <div className="glass-panel rounded-2xl p-3 border border-[var(--border)]">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-[var(--text-secondary)]">
                    {h.direction === 'simpleToCorporate' ? 'Plain Language' : 'Corporate Speak'}
                  </span>
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-full" style={{ backgroundColor: `${selectedTone.color}20`, color: selectedTone.color }}>
                    {selectedTone.name} Tone
                  </span>
                </div>
                <button onClick={() => setShowSuggestions(!showSuggestions)}
                  className="flex items-center gap-1 text-[10px] font-bold text-[var(--accent)] hover:underline">
                  <Sparkles className="w-3 h-3" /> AI Suggestions {showSuggestions ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />}
                </button>
              </div>

              <AnimatePresence>
                {showSuggestions && (
                  <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }} className="overflow-hidden mb-3">
                    <div className="flex flex-wrap gap-2">
                      {suggestions.map((s, i) => (
                        <button key={i} onClick={() => { h.setInput(s); setShowSuggestions(false); h.setOutput(''); }}
                          className="text-left px-3 py-1.5 rounded-xl text-xs font-medium bg-[var(--bg-secondary)] border border-[var(--border)]
                            text-[var(--text-secondary)] hover:border-[var(--accent)]/30 hover:text-[var(--text-primary)] transition-all">
                          {s}
                        </button>
                      ))}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

              <textarea value={h.input} onChange={e => { h.setInput(e.target.value); h.setOutput(''); }}
                placeholder={h.direction === 'simpleToCorporate'
                  ? 'Type something simple... e.g. "I need to tell my boss the project is late"'
                  : 'Type corporate speak... e.g. "We need to leverage our synergies to drive growth"'}
                rows={5}
                className="w-full px-3 py-2.5 rounded-xl text-sm font-medium resize-none outline-none
                  bg-[var(--bg-secondary)] border border-[var(--border)] text-[var(--text-primary)]
                  hover:border-[var(--accent)] focus:border-[var(--accent)] focus:ring-2 focus:ring-[var(--accent)]/20 transition-all" />

              <div className="flex items-center gap-2 mt-3">
                <button onClick={h.translate} disabled={!h.input.trim()}
                  className="flex-1 py-2.5 rounded-xl text-xs font-black text-white transition-all disabled:opacity-40 flex items-center justify-center gap-1.5"
                  style={{ background: `linear-gradient(135deg, ${selectedTone.color}, ${selectedTone.color}cc)` }}>
                  <Languages className="w-3.5 h-3.5" /> Translate
                </button>
                <button onClick={h.swapDirection}
                  className="p-2.5 rounded-xl border border-[var(--border)] text-[var(--text-secondary)] hover:text-[var(--accent)] hover:border-[var(--accent)]/30 transition-all">
                  <ArrowRightLeft className="w-4 h-4" />
                </button>
              </div>
            </div>

            {h.output && (
              <motion.div {...fadeUp} className="glass-panel rounded-2xl p-4 border border-[var(--border)] space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-[var(--text-secondary)]">
                    {h.direction === 'simpleToCorporate' ? 'Corporate Output' : 'Plain Language Output'}
                  </span>
                  <div className="flex items-center gap-1.5">
                    <button onClick={() => copy(h.output)}
                      className="flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-bold text-[var(--accent)] hover:bg-[var(--accent)]/10 transition-all">
                      {copied ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                      {copied ? 'Copied!' : 'Copy'}
                    </button>
                    <button onClick={() => h.toggleFavorite({ id: Date.now(), input: h.input, output: h.output, direction: h.direction, tone: h.tone, timestamp: new Date().toISOString() })}
                      className="p-1.5 rounded-lg text-amber-400 hover:bg-amber-500/10 transition-all">
                      <Star className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
                <p className="text-sm font-medium text-[var(--text-primary)] leading-relaxed whitespace-pre-wrap">{h.output}</p>
              </motion.div>
            )}
          </motion.div>
        )}

        {activeTab === 'history' && (
          <motion.div key="history" {...fadeUp} className="space-y-3">
            {h.history.length === 0 ? (
              <div className="glass-panel rounded-2xl p-12 border border-[var(--border)] flex flex-col items-center justify-center text-center space-y-3">
                <History className="w-10 h-10 text-[var(--text-secondary)] opacity-30" />
                <p className="text-sm font-bold text-[var(--text-secondary)]">No translations yet</p>
              </div>
            ) : (
              <>
                <div className="flex justify-end">
                  <button onClick={h.clearHistory} className="text-xs font-bold text-red-400 hover:underline flex items-center gap-1">
                    <Trash2 className="w-3 h-3" /> Clear All
                  </button>
                </div>
                {h.history.map(entry => (
                  <div key={entry.id} className="glass-panel rounded-2xl p-4 border border-[var(--border)] space-y-2 hover:border-[var(--accent)]/30 transition-all">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className="text-[10px] font-bold px-2 py-0.5 rounded-full capitalize"
                          style={{ backgroundColor: `${(tones.find(t => t.id === entry.tone) || tones[0]).color}20`, color: (tones.find(t => t.id === entry.tone) || tones[0]).color }}>
                          {entry.tone}
                        </span>
                        <span className="text-[10px] font-bold text-[var(--text-secondary)]">
                          {entry.direction === 'simpleToCorporate' ? 'S→C' : 'C→S'}
                        </span>
                      </div>
                      <div className="flex gap-1">
                        <button onClick={() => { h.loadEntry(entry); setActiveTab('translator'); }}
                          className="p-1.5 rounded-lg text-[var(--accent)] hover:bg-[var(--accent)]/10 transition-all">
                          <ArrowRight className="w-3 h-3" />
                        </button>
                        <button onClick={() => h.removeHistoryEntry(entry.id)}
                          className="p-1.5 rounded-lg text-red-400 hover:bg-red-500/10 transition-all">
                          <Trash2 className="w-3 h-3" />
                        </button>
                      </div>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                      <div className="p-2 rounded-lg bg-[var(--bg-secondary)] border border-[var(--border)]">
                        <span className="text-[10px] font-bold text-[var(--text-secondary)]">Input</span>
                        <p className="text-[var(--text-primary)] mt-0.5 line-clamp-2">{entry.input}</p>
                      </div>
                      <div className="p-2 rounded-lg bg-[var(--bg-secondary)] border border-[var(--border)]">
                        <span className="text-[10px] font-bold text-[var(--text-secondary)]">Output</span>
                        <p className="text-[var(--text-primary)] mt-0.5 line-clamp-2">{entry.output}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </>
            )}
          </motion.div>
        )}

        {activeTab === 'favorites' && (
          <motion.div key="favorites" {...fadeUp} className="space-y-3">
            {h.favorites.length === 0 ? (
              <div className="glass-panel rounded-2xl p-12 border border-[var(--border)] flex flex-col items-center justify-center text-center space-y-3">
                <Star className="w-10 h-10 text-[var(--text-secondary)] opacity-30" />
                <p className="text-sm font-bold text-[var(--text-secondary)]">No favorites saved</p>
                <p className="text-xs text-[var(--text-secondary)] opacity-60">Click the star icon on a translation to save it</p>
              </div>
            ) : (
              h.favorites.map(entry => (
                <div key={entry.id} className="glass-panel rounded-2xl p-4 border border-amber-500/20 space-y-2 hover:border-amber-500/40 transition-all">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Heart className="w-3.5 h-3.5 text-amber-400 fill-amber-400" />
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded-full capitalize"
                        style={{ backgroundColor: `${(tones.find(t => t.id === entry.tone) || tones[0]).color}20`, color: (tones.find(t => t.id === entry.tone) || tones[0]).color }}>
                        {entry.tone}
                      </span>
                      <span className="text-[10px] font-bold text-[var(--text-secondary)]">
                        {entry.direction === 'simpleToCorporate' ? 'S→C' : 'C→S'}
                      </span>
                    </div>
                    <div className="flex gap-1">
                      <button onClick={() => { h.loadEntry(entry); setActiveTab('translator'); }}
                        className="p-1.5 rounded-lg text-[var(--accent)] hover:bg-[var(--accent)]/10 transition-all">
                        <ArrowRight className="w-3 h-3" />
                      </button>
                      <button onClick={() => h.removeFavorite(entry.id)}
                        className="p-1.5 rounded-lg text-red-400 hover:bg-red-500/10 transition-all">
                        <X className="w-3 h-3" />
                      </button>
                    </div>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                    <div className="p-2 rounded-lg bg-[var(--bg-secondary)] border border-[var(--border)]">
                      <span className="text-[10px] font-bold text-[var(--text-secondary)]">Input</span>
                      <p className="text-[var(--text-primary)] mt-0.5 line-clamp-2">{entry.input}</p>
                    </div>
                    <div className="p-2 rounded-lg bg-[var(--bg-secondary)] border border-[var(--border)]">
                      <span className="text-[10px] font-bold text-[var(--text-secondary)]">Output</span>
                      <p className="text-[var(--text-primary)] mt-0.5 line-clamp-2">{entry.output}</p>
                    </div>
                  </div>
                </div>
              ))
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
