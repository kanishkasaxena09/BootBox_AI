import React, { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Wand2, Copy, RotateCcw, History, Trash2, Check, ArrowLeftRight,
  Briefcase, GraduationCap, MessageCircle, BookOpen, Building2, Sparkles,
  FileText, Download, Clock, AlertTriangle, CheckCircle2, Type, Eye
} from 'lucide-react';
import useTextHumanizer from './useTextHumanizer';
import { TONES, getReadabilityLabel, getDetectionLabel } from './mockData';
import { Tabs, StatCard, Button, EmptyState, ToolLayout, ErrorBoundary, useCopy } from '../../components/shared';

const iconMap = { Briefcase, GraduationCap, MessageCircle, BookOpen, Building2, Sparkles };

const TextHumanizer = () => {
  const {
    inputText, setInputText, tone, setTone,
    result, isProcessing,
    humanize, regenerate, reset, loadSample,
    history, loadHistory, removeHistory, clearHistory,
  } = useTextHumanizer();

  const [activeTab, setActiveTab] = useState('humanize');
  const [showCompare, setShowCompare] = useState(false);
  const { copied, copy } = useCopy();

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
    <ErrorBoundary>
      <ToolLayout icon={Wand2} title="AI Text Humanizer" subtitle="Transform AI-generated text into natural, human-written content" accentColor="#ec4899">
        <div className="space-y-5">
          <Tabs tabs={tabs} active={activeTab} onChange={setActiveTab} />

          <AnimatePresence mode="wait">
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
                      <Button variant="ghost" size="sm" onClick={loadSample}>Load Sample</Button>
                    </div>
                    <textarea value={inputText} onChange={e => setInputText(e.target.value)} rows={14}
                      className="w-full px-3 py-2.5 rounded-xl text-[11px] font-mono leading-relaxed bg-[var(--bg-secondary)] border border-[var(--border)] text-[var(--text-primary)] focus:outline-none focus:border-[var(--accent)] focus:ring-2 focus:ring-[var(--accent)]/20 transition-all resize-none"
                      placeholder="Paste your AI-generated text here..." />
                    <div className="flex items-center justify-between">
                      <span className="text-[9px] font-bold text-[var(--text-secondary)]">{inputText.split(/\s+/).filter(Boolean).length} words</span>
                      <Button variant="ghost" size="sm" icon={RotateCcw} onClick={reset}>Clear</Button>
                    </div>
                    <Button variant="primary" fullWidth icon={Wand2} loading={isProcessing}
                      disabled={!inputText.trim() || isProcessing}
                      onClick={() => humanize()}>
                      {isProcessing ? 'Humanizing...' : 'Humanize Text'}
                    </Button>
                  </div>

                  {/* Output */}
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <label className="text-[10px] font-bold uppercase tracking-wider text-[var(--text-secondary)]">Humanized Output</label>
                      {result && (
                        <div className="flex items-center gap-1.5">
                          <Button variant={showCompare ? 'accent' : 'ghost'} size="sm" icon={ArrowLeftRight}
                            onClick={() => setShowCompare(c => !c)}>
                            Compare
                          </Button>
                          <Button variant="ghost" size="sm" icon={copied ? Check : Copy}
                            onClick={() => copy(result.humanized)}>
                            {copied ? 'Copied' : 'Copy'}
                          </Button>
                          <Button variant="ghost" size="sm" icon={Download} onClick={handleExport}>Export</Button>
                        </div>
                      )}
                    </div>

                    {!result ? (
                      <EmptyState icon={Eye} title="Output will appear here" description="Paste text and click Humanize" />
                    ) : (
                      <div className="space-y-3">
                        {showCompare ? (
                          <div className="grid grid-cols-1 gap-3">
                            <div className="glass-panel rounded-2xl p-4 border border-[var(--border)] space-y-2">
                              <span className="text-[9px] font-bold text-red-500 uppercase">Before (AI)</span>
                              <p className="text-[11px] text-[var(--text-secondary)] leading-relaxed whitespace-pre-wrap max-h-[200px] overflow-y-auto">{result.input}</p>
                            </div>
                            <div className="glass-panel rounded-2xl p-4 border border-green-500/20 bg-green-500/5 space-y-2">
                              <span className="text-[9px] font-bold text-green-500 uppercase">After (Humanized)</span>
                              <p className="text-[11px] text-[var(--text-primary)] leading-relaxed whitespace-pre-wrap max-h-[200px] overflow-y-auto">{result.humanized}</p>
                            </div>
                          </div>
                        ) : (
                          <div className="glass-panel rounded-2xl p-5 border border-green-500/20 bg-green-500/5 min-h-[350px]">
                            <p className="text-[11px] text-[var(--text-primary)] leading-relaxed whitespace-pre-wrap">{result.humanized}</p>
                          </div>
                        )}

                        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                          <StatCard icon={Type} label="Readability" value={`${result.readabilityScore}/100`} sub={readability?.label} color={readability?.color} />
                          <StatCard icon={AlertTriangle} label="AI Detection" value={`${result.aiDetection}%`} sub={detection?.label} color={detection?.color} />
                          <StatCard icon={Wand2} label="Changes Made" value={result.changes.length} sub="transformations" color="#8b5cf6" />
                          <StatCard icon={FileText} label="Words" value={result.wordCount} sub={`${result.sentenceCount} sentences`} color="#06b6d4" />
                        </div>

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

                        <Button variant="secondary" fullWidth icon={RotateCcw} onClick={regenerate}>Regenerate</Button>
                      </div>
                    )}
                  </div>
                </div>
              </motion.div>
            )}

            {activeTab === 'history' && (
              <motion.div key="history" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
                className="max-w-3xl mx-auto space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-sm font-bold text-[var(--text-primary)]">History ({history.length})</h3>
                  {history.length > 0 && (
                    <Button variant="danger" size="sm" icon={Trash2} onClick={clearHistory}>Clear All</Button>
                  )}
                </div>
                {history.length === 0 ? (
                  <EmptyState icon={History} title="No history yet" description="Humanized texts will appear here" />
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
                              <Button variant="accent" size="sm" onClick={() => { loadHistory(entry); setActiveTab('humanize'); }}>Load</Button>
                              <button onClick={() => removeHistory(entry.id)}
                                className="p-1.5 rounded-lg hover:bg-red-500/10 text-[var(--text-secondary)] hover:text-red-500 transition-all">
                                <Trash2 className="w-3 h-3" />
                              </button>
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
      </ToolLayout>
    </ErrorBoundary>
  );
};

export default TextHumanizer;
