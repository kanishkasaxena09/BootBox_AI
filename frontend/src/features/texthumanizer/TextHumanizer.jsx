import React, { useState, useMemo, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Wand2, Copy, RotateCcw, History, Trash2, Check, ArrowLeftRight,
  Briefcase, GraduationCap, MessageCircle, BookOpen, Building2, Sparkles,
  FileText, Download, Clock, AlertTriangle, CheckCircle2, Type, Eye
} from 'lucide-react';
import useTextHumanizer from './useTextHumanizer';
import { TONES, getReadabilityLabel, getDetectionLabel } from './mockData';

const fadeUp = { initial: { opacity: 0, y: 10 }, animate: { opacity: 1, y: 0 } };
const inputCls = "w-full px-3 py-2.5 rounded-xl text-xs font-bold bg-[var(--bg-secondary)] border border-[var(--border)] text-[var(--text-primary)] focus:outline-none focus:border-indigo-500/30 focus:ring-2 focus:ring-indigo-500/10 transition-all [color-scheme:dark]";

const iconMap = { Briefcase, GraduationCap, MessageCircle, BookOpen, Building2, Sparkles };

const MetricCard = ({ label, value, sub, color, icon: Icon }) => (
  <motion.div {...fadeUp} className="glass-panel border border-[var(--border)] rounded-2xl p-4 space-y-2">
    <div className="flex items-center gap-2">
      <div className="p-1.5 rounded-lg" style={{ background: color + '15' }}><Icon className="w-3.5 h-3.5" style={{ color }} /></div>
      <span className="text-[10px] font-bold uppercase tracking-wider text-[var(--text-secondary)]">{label}</span>
    </div>
    <p className="text-xl font-black" style={{ color }}>{value}</p>
    {sub && <p className="text-[9px] font-bold text-[var(--text-secondary)]">{sub}</p>}
  </motion.div>
);

const TextHumanizer = () => {
  const {
    inputText, setInputText, tone, setTone,
    result, isProcessing,
    humanize, regenerate, reset, loadSample,
    history, loadHistory, removeHistory, clearHistory,
  } = useTextHumanizer();

  const [activeTab, setActiveTab] = useState('humanize');
  const [copied, setCopied] = useState(false);
  const [showCompare, setShowCompare] = useState(false);
  const outputRef = useRef(null);

  const handleCopy = () => {
    if (!result?.humanized) return;
    navigator.clipboard?.writeText(result.humanized);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleExport = () => {
    if (!result?.humanized) return;
    const blob = new Blob([result.humanized], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url; a.download = 'humanized-text.txt'; a.click();
    URL.revokeObjectURL(url);
  };

  const readability = result ? getReadabilityLabel(result.readabilityScore) : null;
  const detection = result ? getDetectionLabel(result.aiDetection) : null;

  const tabs = [
    { id: 'humanize', label: 'Humanize', icon: Wand2 },
    { id: 'history', label: 'History', icon: History },
  ];

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      {/* Header */}
      <div className="text-center space-y-2">
        <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-gradient-to-br from-purple-500/20 to-pink-500/20 border border-purple-500/30">
          <Wand2 className="w-7 h-7 text-purple-400" />
        </div>
        <h1 className="text-3xl font-black bg-gradient-to-r from-purple-400 via-pink-400 to-rose-400 bg-clip-text text-transparent">
          AI Text Humanizer
        </h1>
        <p className="text-sm text-[var(--text-secondary)] max-w-md mx-auto">
          Transform AI-generated text into natural, human-written content with tone control.
        </p>
      </div>

      {/* Tabs */}
      <div className="flex justify-center">
        <div className="glass-panel rounded-2xl p-1.5 border border-[var(--border)] flex items-center gap-1 w-fit">
          {tabs.map(tab => {
            const Icon = tab.icon;
            return (
              <button key={tab.id} onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                  activeTab === tab.id ? 'bg-purple-500/10 text-purple-500 border border-purple-500/20' : 'text-[var(--text-secondary)] hover:text-[var(--text-primary)] border border-transparent'
                }`}>
                <Icon className="w-3.5 h-3.5" /> {tab.label}
              </button>
            );
          })}
        </div>
      </div>

      <AnimatePresence mode="wait">
        {/* ============ HUMANIZE TAB ============ */}
        {activeTab === 'humanize' && (
          <motion.div key="humanize" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
            className="space-y-5">
            {/* Tone Selector */}
            <div className="space-y-2">
              <label className="text-[10px] font-bold uppercase tracking-wider text-[var(--text-secondary)]">Choose Tone</label>
              <div className="grid grid-cols-3 md:grid-cols-6 gap-2">
                {Object.values(TONES).map(t => {
                  const Icon = iconMap[t.icon] || Wand2;
                  return (
                    <button key={t.id} onClick={() => setTone(t.id)}
                      className={`flex flex-col items-center gap-1.5 p-3 rounded-xl border transition-all ${
                        tone === t.id
                          ? 'border-current bg-current/5 shadow-lg'
                          : 'bg-[var(--bg-secondary)]/50 border-[var(--border)] hover:border-[var(--text-secondary)]/30'
                      }`} style={tone === t.id ? { color: t.color, borderColor: t.color + '40' } : {}}>
                      <Icon className="w-4 h-4" style={tone === t.id ? { color: t.color } : { color: 'var(--text-secondary)' }} />
                      <span className="text-[10px] font-bold" style={tone === t.id ? { color: t.color } : { color: 'var(--text-secondary)' }}>{t.label}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
              {/* Input */}
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <label className="text-[10px] font-bold uppercase tracking-wider text-[var(--text-secondary)]">AI-Generated Text</label>
                  <button onClick={loadSample} className="text-[10px] font-bold text-purple-500 hover:text-purple-400">Load Sample</button>
                </div>
                <textarea value={inputText} onChange={e => setInputText(e.target.value)} rows={14}
                  className={inputCls + ' resize-none font-mono text-[11px] leading-relaxed'}
                  placeholder="Paste your AI-generated text here..." />
                <div className="flex items-center justify-between">
                  <span className="text-[9px] font-bold text-[var(--text-secondary)]">{inputText.split(/\s+/).filter(Boolean).length} words</span>
                  <button onClick={reset} className="text-[10px] font-bold text-[var(--text-secondary)] hover:text-red-500 flex items-center gap-1">
                    <RotateCcw className="w-3 h-3" /> Clear
                  </button>
                </div>
                <button onClick={() => humanize()} disabled={!inputText.trim() || isProcessing}
                  className="w-full flex items-center justify-center gap-1.5 py-3 rounded-xl bg-gradient-to-r from-purple-500 to-pink-600 text-white font-bold text-xs shadow-lg shadow-purple-500/20 transition-all disabled:opacity-40 disabled:cursor-not-allowed">
                  {isProcessing ? (
                    <><span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" /> Humanizing...</>
                  ) : (
                    <><Wand2 className="w-3.5 h-3.5" /> Humanize Text</>
                  )}
                </button>
              </div>

              {/* Output */}
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <label className="text-[10px] font-bold uppercase tracking-wider text-[var(--text-secondary)]">Humanized Output</label>
                  {result && (
                    <div className="flex items-center gap-1.5">
                      <button onClick={() => setShowCompare(c => !c)}
                        className={`text-[10px] font-bold flex items-center gap-1 px-2 py-1 rounded-lg transition-all ${
                          showCompare ? 'bg-purple-500/10 text-purple-500' : 'text-[var(--text-secondary)] hover:text-purple-500'
                        }`}>
                        <ArrowLeftRight className="w-3 h-3" /> Compare
                      </button>
                      <button onClick={handleCopy}
                        className="text-[10px] font-bold flex items-center gap-1 px-2 py-1 rounded-lg text-[var(--text-secondary)] hover:text-green-500 transition-all">
                        {copied ? <Check className="w-3 h-3 text-green-500" /> : <Copy className="w-3 h-3" />} {copied ? 'Copied' : 'Copy'}
                      </button>
                      <button onClick={handleExport}
                        className="text-[10px] font-bold flex items-center gap-1 px-2 py-1 rounded-lg text-[var(--text-secondary)] hover:text-indigo-500 transition-all">
                        <Download className="w-3 h-3" /> Export
                      </button>
                    </div>
                  )}
                </div>

                {!result ? (
                  <div className="glass-panel rounded-2xl p-12 border border-[var(--border)] flex flex-col items-center justify-center text-center space-y-3 min-h-[350px]">
                    <Eye className="w-10 h-10 text-[var(--text-secondary)] opacity-20" />
                    <p className="text-sm font-bold text-[var(--text-secondary)]">Output will appear here</p>
                    <p className="text-xs text-[var(--text-secondary)] opacity-60">Paste text and click Humanize</p>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {/* Compare Mode */}
                    {showCompare ? (
                      <div className="grid grid-cols-1 gap-3">
                        <div className="glass-panel rounded-2xl p-4 border border-[var(--border)] space-y-2">
                          <span className="text-[9px] font-bold text-red-500 uppercase">Before (AI)</span>
                          <p className="text-[11px] text-[var(--text-secondary)] leading-relaxed whitespace-pre-wrap max-h-[200px] overflow-y-auto">{result.input}</p>
                        </div>
                        <div className="glass-panel rounded-2xl p-4 border border-green-500/20 bg-green-500/5 space-y-2">
                          <span className="text-[9px] font-bold text-green-500 uppercase">After (Humanized)</span>
                          <p ref={outputRef} className="text-[11px] text-[var(--text-primary)] leading-relaxed whitespace-pre-wrap max-h-[200px] overflow-y-auto">{result.humanized}</p>
                        </div>
                      </div>
                    ) : (
                      <div className="glass-panel rounded-2xl p-5 border border-green-500/20 bg-green-500/5 min-h-[350px]">
                        <p ref={outputRef} className="text-[11px] text-[var(--text-primary)] leading-relaxed whitespace-pre-wrap">{result.humanized}</p>
                      </div>
                    )}

                    {/* Metrics */}
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                      <MetricCard label="Readability" value={`${result.readabilityScore}/100`} sub={readability?.label} color={readability?.color} icon={Type} />
                      <MetricCard label="AI Detection" value={`${result.aiDetection}%`} sub={detection?.label} color={detection?.color} icon={AlertTriangle} />
                      <MetricCard label="Changes Made" value={result.changes.length} sub="transformations applied" color="#8b5cf6" icon={Wand2} />
                      <MetricCard label="Words" value={result.wordCount} sub={`${result.sentenceCount} sentences`} color="#06b6d4" icon={FileText} />
                    </div>

                    {/* Changes List */}
                    {result.changes.length > 0 && (
                      <div className="glass-panel rounded-2xl p-4 border border-[var(--border)] space-y-2">
                        <h4 className="text-[10px] font-bold uppercase tracking-wider text-[var(--text-secondary)]">Changes Applied</h4>
                        <div className="flex flex-wrap gap-1.5 max-h-[120px] overflow-y-auto">
                          {result.changes.map((c, i) => (
                            <span key={i} className="text-[9px] font-bold px-2 py-1 rounded-lg bg-[var(--bg-secondary)] border border-[var(--border)]">
                              <span className="text-red-500 line-through">{c.from}</span>
                              <span className="text-[var(--text-secondary)] mx-1">→</span>
                              <span className="text-green-500">{c.to}</span>
                            </span>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Regenerate */}
                    <button onClick={regenerate}
                      className="w-full flex items-center justify-center gap-1.5 py-2.5 rounded-xl bg-[var(--bg-secondary)] border border-[var(--border)] text-[var(--text-secondary)] hover:text-purple-500 font-bold text-xs transition-all">
                      <RotateCcw className="w-3.5 h-3.5" /> Regenerate
                    </button>
                  </div>
                )}
              </div>
            </div>
          </motion.div>
        )}

        {/* ============ HISTORY TAB ============ */}
        {activeTab === 'history' && (
          <motion.div key="history" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
            className="max-w-3xl mx-auto space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-bold text-[var(--text-primary)]">History ({history.length})</h3>
              {history.length > 0 && (
                <button onClick={clearHistory} className="text-[10px] font-bold text-red-500 hover:text-red-400 flex items-center gap-1">
                  <Trash2 className="w-3 h-3" /> Clear All
                </button>
              )}
            </div>
            {history.length === 0 ? (
              <div className="glass-panel rounded-2xl p-12 border border-[var(--border)] flex flex-col items-center justify-center text-center space-y-3 min-h-[300px]">
                <History className="w-10 h-10 text-[var(--text-secondary)] opacity-20" />
                <p className="text-sm font-bold text-[var(--text-secondary)]">No history yet</p>
              </div>
            ) : (
              <div className="space-y-2">
                {history.map((entry, i) => {
                  const toneData = TONES[entry.tone];
                  return (
                    <motion.div key={entry.id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.03 }}
                      className="glass-panel border border-[var(--border)] rounded-xl p-4 space-y-2">
                      <div className="flex items-start gap-3">
                        <div className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0" style={{ background: (toneData?.color || '#6366f1') + '15' }}>
                          <span className="text-[10px] font-black" style={{ color: toneData?.color }}>{entry.readabilityScore}</span>
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-xs font-bold text-[var(--text-primary)] truncate">{entry.input.slice(0, 80)}...</p>
                          <div className="flex items-center gap-2 mt-1 flex-wrap">
                            <span className="text-[9px] font-bold px-1.5 py-0.5 rounded-full" style={{ background: (toneData?.color || '#6366f1') + '15', color: toneData?.color }}>{toneData?.label}</span>
                            <span className="text-[9px] font-bold text-[var(--text-secondary)]">{entry.changes} changes</span>
                            <span className="text-[9px] font-bold text-[var(--text-secondary)]">AI: {entry.aiDetection}%</span>
                            <span className="text-[9px] font-bold text-[var(--text-secondary)]"><Clock className="w-2.5 h-2.5 inline" /> {new Date(entry.timestamp).toLocaleDateString('en', { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })}</span>
                          </div>
                        </div>
                        <div className="flex gap-1">
                          <button onClick={() => { loadHistory(entry); setActiveTab('humanize'); }}
                            className="px-2 py-1.5 rounded-lg text-[10px] font-bold bg-purple-500/10 border border-purple-500/20 text-purple-500">Load</button>
                          <button onClick={() => removeHistory(entry.id)}
                            className="p-1.5 rounded-lg hover:bg-red-500/10 text-[var(--text-secondary)] hover:text-red-500"><Trash2 className="w-3 h-3" /></button>
                        </div>
                      </div>
                    </motion.div>
                  );
                })}
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default TextHumanizer;
