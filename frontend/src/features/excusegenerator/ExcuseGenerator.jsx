import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  CalendarOff, Clock, VideoOff, Timer, Home, AlertTriangle, Briefcase, Laugh,
  Copy, Check, RotateCcw, Sparkles, History, Star, Trash2, Heart, X,
  Wand2, ArrowRight,
} from 'lucide-react';
import useExcuseGenerator from './useExcuseGenerator';
import { categories, tones, getCategoryById, getToneById } from './mockData';

const fadeUp = { initial: { opacity: 0, y: 16 }, animate: { opacity: 1, y: 0 }, transition: { duration: 0.3, ease: 'easeOut' } };
const scaleIn = { initial: { opacity: 0, scale: 0.9 }, animate: { opacity: 1, scale: 1 }, transition: { duration: 0.3, type: 'spring', stiffness: 300, damping: 25 } };
const slideRight = { initial: { opacity: 0, x: -20 }, animate: { opacity: 1, x: 0 }, transition: { duration: 0.25 } };

const iconMap = { CalendarOff, Clock, VideoOff, Timer, Home, AlertTriangle, Briefcase, Laugh };

export default function ExcuseGenerator() {
  const h = useExcuseGenerator();
  const [copied, setCopied] = useState(false);
  const [activeTab, setActiveTab] = useState('generator');
  const [showExcuse, setShowExcuse] = useState(false);

  const copy = (text) => {
    navigator.clipboard?.writeText(text).catch(() => {});
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };

  const handleGenerate = async () => {
    await h.generate();
    setShowExcuse(true);
  };

  const selectedCat = getCategoryById(h.category);
  const selectedTone = getToneById(h.tone);

  return (
    <div className="space-y-4">
      <div className="text-center space-y-2">
        <motion.div {...scaleIn}
          className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-gradient-to-br from-pink-500/20 to-rose-500/20 border border-pink-500/30">
          <Wand2 className="w-7 h-7 text-pink-400" />
        </motion.div>
        <motion.h1 {...fadeUp}
          className="text-3xl font-black bg-gradient-to-r from-pink-400 via-rose-400 to-fuchsia-400 bg-clip-text text-transparent">
          AI Excuse Generator
        </motion.h1>
        <motion.p {...fadeUp} className="text-sm text-[var(--text-secondary)] max-w-md mx-auto">
          Never run out of excuses. Generate the perfect one for any situation.
        </motion.p>
      </div>

      <div className="glass-panel rounded-2xl p-1.5 border border-[var(--border)] flex items-center gap-1 w-fit mx-auto">
        {['generator', 'history', 'favorites'].map(tab => (
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
        {activeTab === 'generator' && (
          <motion.div key="gen" {...fadeUp} className="space-y-4">
            <div className="space-y-2">
              <label className="text-[10px] font-bold uppercase tracking-wider text-[var(--text-secondary)]">Category</label>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                {categories.map((cat, i) => {
                  const Icon = iconMap[cat.icon] || Briefcase;
                  return (
                    <motion.button key={cat.id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: i * 0.04 }}
                      onClick={() => { h.setCategory(cat.id); setShowExcuse(false); }}
                      className={`flex items-center gap-2.5 p-3 rounded-xl border text-left transition-all
                        ${h.category === cat.id
                          ? 'border-transparent text-white shadow-lg'
                          : 'bg-[var(--bg-secondary)] border-[var(--border)] text-[var(--text-secondary)] hover:border-[var(--accent)]/30 hover:text-[var(--text-primary)]'
                        }`}
                      style={h.category === cat.id ? { backgroundColor: cat.color, boxShadow: `0 4px 14px ${cat.color}30` } : {}}>
                      <Icon className="w-4 h-4 shrink-0" />
                      <div>
                        <div className="text-xs font-bold">{cat.name}</div>
                        <div className="text-[9px] opacity-70">{cat.desc}</div>
                      </div>
                    </motion.button>
                  );
                })}
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-[10px] font-bold uppercase tracking-wider text-[var(--text-secondary)]">Tone</label>
              <div className="flex items-center gap-2">
                {tones.map(tone => (
                  <button key={tone.id} onClick={() => { h.setTone(tone.id); setShowExcuse(false); }}
                    className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all border
                      ${h.tone === tone.id
                        ? 'bg-[var(--accent)]/15 text-[var(--accent)] border-[var(--accent)]/30 shadow-lg'
                        : 'bg-[var(--bg-secondary)] border-[var(--border)] text-[var(--text-secondary)] hover:border-[var(--accent)]/30'
                      }`}>
                    <span>{tone.emoji}</span>
                    <span>{tone.name}</span>
                  </button>
                ))}
              </div>
            </div>

            <motion.button onClick={handleGenerate}
              whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}
              className="w-full py-3 rounded-2xl text-sm font-black text-white transition-all
                bg-gradient-to-r from-pink-500 via-rose-500 to-fuchsia-500
                hover:shadow-xl hover:shadow-pink-500/25 flex items-center justify-center gap-2">
              <Sparkles className="w-4 h-4" /> Generate Excuse
            </motion.button>

            <AnimatePresence mode="wait">
              {showExcuse && h.currentExcuse && (
                <motion.div key={h.currentExcuse} initial={{ opacity: 0, y: 20, scale: 0.97 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: -10, scale: 0.97 }}
                  transition={{ type: 'spring', stiffness: 300, damping: 25 }}
                  className="glass-panel rounded-2xl p-5 border border-[var(--border)] space-y-4 relative overflow-hidden">
                  <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-bl from-pink-500/10 to-transparent rounded-bl-full" />
                  <div className="flex items-center gap-2">
                    <span className="text-lg">{selectedTone.emoji}</span>
                    <span className="text-xs font-bold text-[var(--text-secondary)]">
                      {selectedCat.name} • {selectedTone.name}
                    </span>
                  </div>
                  <p className="text-sm font-medium text-[var(--text-primary)] leading-relaxed relative z-10">
                    {h.currentExcuse}
                  </p>
                  <div className="flex items-center gap-2 relative z-10">
                    <motion.button onClick={() => copy(h.currentExcuse)} whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}
                      className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold text-[var(--accent)] border border-[var(--accent)]/30 hover:bg-[var(--accent)]/10 transition-all">
                      {copied ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                      {copied ? 'Copied!' : 'Copy'}
                    </motion.button>
                    <motion.button onClick={h.regenerate} whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}
                      className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold text-rose-400 border border-rose-500/30 hover:bg-rose-500/10 transition-all">
                      <RotateCcw className="w-3 h-3" /> Regenerate
                    </motion.button>
                    <motion.button onClick={() => h.toggleFavorite({
                      id: Date.now(), excuse: h.currentExcuse, category: h.category, tone: h.tone, timestamp: new Date().toISOString()
                    })} whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}
                      className="p-1.5 rounded-xl text-amber-400 hover:bg-amber-500/10 transition-all">
                      <Star className="w-4 h-4" />
                    </motion.button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        )}

        {activeTab === 'history' && (
          <motion.div key="history" {...fadeUp} className="space-y-3">
            {h.history.length === 0 ? (
              <div className="glass-panel rounded-2xl p-12 border border-[var(--border)] flex flex-col items-center justify-center text-center space-y-3">
                <History className="w-10 h-10 text-[var(--text-secondary)] opacity-30" />
                <p className="text-sm font-bold text-[var(--text-secondary)]">No excuses generated yet</p>
              </div>
            ) : (
              <>
                <div className="flex justify-end">
                  <button onClick={h.clearHistory} className="text-xs font-bold text-red-400 hover:underline flex items-center gap-1">
                    <Trash2 className="w-3 h-3" /> Clear All
                  </button>
                </div>
                {h.history.map((entry, i) => {
                  const cat = getCategoryById(entry.category);
                  return (
                    <motion.div key={entry.id} initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: i * 0.03 }}
                      className="glass-panel rounded-2xl p-4 border border-[var(--border)] hover:border-[var(--accent)]/30 transition-all space-y-2">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <span className="text-[10px] font-bold px-2 py-0.5 rounded-full" style={{ backgroundColor: `${cat.color}20`, color: cat.color }}>
                            {cat.name}
                          </span>
                          <span className="text-[10px] text-[var(--text-secondary)]">
                            {new Date(entry.timestamp).toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' })}
                          </span>
                        </div>
                        <div className="flex gap-1">
                          <button onClick={() => { h.loadEntry(entry); setActiveTab('generator'); setShowExcuse(true); }}
                            className="p-1.5 rounded-lg text-[var(--accent)] hover:bg-[var(--accent)]/10 transition-all">
                            <ArrowRight className="w-3 h-3" />
                          </button>
                          <button onClick={() => h.removeHistoryEntry(entry.id)}
                            className="p-1.5 rounded-lg text-red-400 hover:bg-red-500/10 transition-all">
                            <Trash2 className="w-3 h-3" />
                          </button>
                        </div>
                      </div>
                      <p className="text-xs text-[var(--text-primary)] line-clamp-2">{entry.excuse}</p>
                    </motion.div>
                  );
                })}
              </>
            )}
          </motion.div>
        )}

        {activeTab === 'favorites' && (
          <motion.div key="favs" {...fadeUp} className="space-y-3">
            {h.favorites.length === 0 ? (
              <div className="glass-panel rounded-2xl p-12 border border-[var(--border)] flex flex-col items-center justify-center text-center space-y-3">
                <Star className="w-10 h-10 text-[var(--text-secondary)] opacity-30" />
                <p className="text-sm font-bold text-[var(--text-secondary)]">No favorites saved</p>
                <p className="text-xs text-[var(--text-secondary)] opacity-60">Click the star icon to save your best excuses</p>
              </div>
            ) : (
              h.favorites.map((entry, i) => {
                const cat = getCategoryById(entry.category);
                return (
                  <motion.div key={entry.id} initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.03 }}
                    className="glass-panel rounded-2xl p-4 border border-amber-500/20 hover:border-amber-500/40 transition-all space-y-2">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Heart className="w-3.5 h-3.5 text-amber-400 fill-amber-400" />
                        <span className="text-[10px] font-bold px-2 py-0.5 rounded-full" style={{ backgroundColor: `${cat.color}20`, color: cat.color }}>
                          {cat.name}
                        </span>
                      </div>
                      <div className="flex gap-1">
                        <button onClick={() => { h.loadEntry(entry); setActiveTab('generator'); setShowExcuse(true); }}
                          className="p-1.5 rounded-lg text-[var(--accent)] hover:bg-[var(--accent)]/10 transition-all">
                          <ArrowRight className="w-3 h-3" />
                        </button>
                        <button onClick={() => h.removeFavorite(entry.id)}
                          className="p-1.5 rounded-lg text-red-400 hover:bg-red-500/10 transition-all">
                          <X className="w-3 h-3" />
                        </button>
                      </div>
                    </div>
                    <p className="text-xs text-[var(--text-primary)]">{entry.excuse}</p>
                  </motion.div>
                );
              })
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
