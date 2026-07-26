import React, { useState, useMemo } from 'react';
import { ClipboardCheck, TrendingUp, TrendingDown, Target, Clock, Trash2, Download, History, AlertTriangle, CheckCircle2, Minus } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import useAttendance from './useAttendance';
import { getColorForPercentage } from './mockData';
import { Tabs, StatCard, EmptyState, Button, ToolLayout, ErrorBoundary } from '../../components/shared';

const fadeUp = { initial: { opacity: 0, y: 10 }, animate: { opacity: 1, y: 0 } };

const AttendanceCalculator = () => {
  const {
    inputs, setInputs, result, history,
    calculate, loadEntry, removeEntry, clearHistory, reset,
  } = useAttendance();

  const [activeTab, setActiveTab] = useState('calculator');

  const ringColor = useMemo(() => {
    if (!result) return '#6366f1';
    return getColorForPercentage(result.currentPercentage);
  }, [result]);

  const tabs = [
    { id: 'calculator', label: 'Calculator', icon: ClipboardCheck },
    { id: 'history', label: 'History', icon: History },
  ];

  return (
    <ErrorBoundary>
      <ToolLayout icon={ClipboardCheck} title="Attendance Calculator" subtitle="Track attendance percentage, forecast trends & plan your classes" accentColor="#f59e0b">
        <div className="space-y-5">
          <Tabs tabs={tabs} active={activeTab} onChange={setActiveTab} />

          <AnimatePresence mode="wait">
            {activeTab === 'calculator' && (
              <motion.div key="calc" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
                className="grid grid-cols-1 lg:grid-cols-5 gap-5">
                {/* Left: Input Panel */}
                <div className="lg:col-span-2 space-y-4">
                  <div className="glass-panel rounded-2xl p-5 border border-[var(--border)] space-y-4">
                    <h3 className="text-xs font-black uppercase tracking-wider text-[var(--text-secondary)]">Input Details</h3>
                    <div className="space-y-3">
                      <div>
                        <label className="text-[10px] font-bold text-[var(--text-secondary)] mb-1 block">Classes Attended</label>
                        <input type="number" min="0" value={inputs.attended} placeholder="0"
                          onChange={e => setInputs(p => ({ ...p, attended: e.target.value }))}
                          className="w-full px-3 py-2.5 rounded-xl text-xs font-bold bg-[var(--bg-secondary)] border border-[var(--border)] text-[var(--text-primary)] focus:outline-none focus:border-[var(--accent)] focus:ring-2 focus:ring-[var(--accent)]/20 transition-all" />
                      </div>
                      <div>
                        <label className="text-[10px] font-bold text-[var(--text-secondary)] mb-1 block">Classes Conducted</label>
                        <input type="number" min="0" value={inputs.conducted} placeholder="0"
                          onChange={e => setInputs(p => ({ ...p, conducted: e.target.value }))}
                          className="w-full px-3 py-2.5 rounded-xl text-xs font-bold bg-[var(--bg-secondary)] border border-[var(--border)] text-[var(--text-primary)] focus:outline-none focus:border-[var(--accent)] focus:ring-2 focus:ring-[var(--accent)]/20 transition-all" />
                      </div>
                      <div>
                        <label className="text-[10px] font-bold text-[var(--text-secondary)] mb-1 block">Required %</label>
                        <input type="number" min="0" max="100" value={inputs.required} placeholder="75"
                          onChange={e => setInputs(p => ({ ...p, required: e.target.value }))}
                          className="w-full px-3 py-2.5 rounded-xl text-xs font-bold bg-[var(--bg-secondary)] border border-[var(--border)] text-[var(--text-primary)] focus:outline-none focus:border-[var(--accent)] focus:ring-2 focus:ring-[var(--accent)]/20 transition-all" />
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <Button variant="primary" fullWidth onClick={calculate}
                        disabled={!inputs.attended || !inputs.conducted}>Calculate</Button>
                      <Button variant="ghost" onClick={reset}>Reset</Button>
                    </div>
                  </div>
                </div>

                {/* Right: Results Panel */}
                <div className="lg:col-span-3 space-y-4">
                  {!result ? (
                    <EmptyState icon={ClipboardCheck} title="No results yet"
                      description="Enter your attendance details and click Calculate" />
                  ) : (
                    <motion.div {...fadeUp} className="space-y-4">
                      {/* Status Banner */}
                      <div className={`glass-panel rounded-2xl p-4 border flex items-center gap-3 ${
                        result.type === 'safe' ? 'border-green-500/20 bg-green-500/5' :
                        result.type === 'warning' ? 'border-amber-500/20 bg-amber-500/5' :
                        'border-red-500/20 bg-red-500/5'
                      }`}>
                        {result.type === 'safe' ? <CheckCircle2 className="w-5 h-5 text-green-500" /> :
                         result.type === 'warning' ? <AlertTriangle className="w-5 h-5 text-amber-500" /> :
                         <Minus className="w-5 h-5 text-red-500" />}
                        <div>
                          <p className="text-xs font-bold text-[var(--text-primary)]">{result.status}</p>
                          <p className="text-[10px] text-[var(--text-secondary)]">{result.message}</p>
                        </div>
                      </div>

                      {/* Progress Ring */}
                      <div className="glass-panel rounded-2xl p-6 border border-[var(--border)] flex items-center justify-center">
                        <div className="relative" style={{ width: 160, height: 160 }}>
                          <svg width={160} height={160} className="-rotate-90">
                            <circle cx={80} cy={80} r={70} fill="none" stroke="var(--border)" strokeWidth={10} />
                            <motion.circle cx={80} cy={80} r={70} fill="none" stroke={ringColor} strokeWidth={10}
                              strokeLinecap="round" strokeDasharray={2 * Math.PI * 70}
                              initial={{ strokeDashoffset: 2 * Math.PI * 70 }}
                              animate={{ strokeDashoffset: 2 * Math.PI * 70 * (1 - result.currentPercentage / 100) }}
                              transition={{ duration: 1.2, ease: 'easeOut' }} />
                          </svg>
                          <div className="absolute inset-0 flex flex-col items-center justify-center">
                            <span className="text-3xl font-black" style={{ color: ringColor }}>{result.currentPercentage}%</span>
                            <span className="text-[10px] font-bold text-[var(--text-secondary)]">Current</span>
                          </div>
                        </div>
                      </div>

                      {/* Stat Cards */}
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                        <StatCard icon={Target} label="Classes Needed" value={result.classesNeeded} sub="to reach target" color="#6366f1" />
                        <StatCard icon={TrendingUp} label="Can Skip" value={result.classesCanSkip} sub="classes" color="#10b981" />
                        <StatCard icon={TrendingDown} label="Deficit" value={`${result.deficitPercentage}%`} sub="below target" color="#f59e0b" />
                        <StatCard icon={Clock} label="Forecast" value={result.forecast.length} sub="class projection" color="#8b5cf6" />
                      </div>

                      {/* Semester Stats */}
                      {result.semesterStats && result.semesterStats.length > 0 && (
                        <div className="glass-panel rounded-2xl p-4 border border-[var(--border)] space-y-3">
                          <h4 className="text-[10px] font-bold uppercase tracking-wider text-[var(--text-secondary)]">Semester Breakdown</h4>
                          <div className="space-y-2">
                            {result.semesterStats.map((s, i) => (
                              <div key={i} className="flex items-center gap-3">
                                <span className="text-[10px] font-bold text-[var(--text-secondary)] w-12">{s.label}</span>
                                <div className="flex-1 h-2 rounded-full bg-[var(--bg-secondary)] overflow-hidden">
                                  <motion.div initial={{ width: 0 }} animate={{ width: `${s.percentage}%` }}
                                    transition={{ duration: 0.8, delay: i * 0.1 }}
                                    className="h-full rounded-full" style={{ backgroundColor: getColorForPercentage(s.percentage) }} />
                                </div>
                                <span className="text-[10px] font-bold text-[var(--text-secondary)] w-10 text-right">{s.percentage}%</span>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}

                      {/* Forecast Chart */}
                      {result.forecast && result.forecast.length > 0 && (
                        <div className="glass-panel rounded-2xl p-4 border border-[var(--border)] space-y-3">
                          <h4 className="text-[10px] font-bold uppercase tracking-wider text-[var(--text-secondary)]">20-Class Attendance Forecast</h4>
                          <div className="flex items-end gap-1 h-32">
                            {result.forecast.map((f, i) => (
                              <div key={i} className="flex-1 flex flex-col items-center gap-0.5">
                                <motion.div initial={{ height: 0 }} animate={{ height: `${f.ifAttended}%` }}
                                  transition={{ duration: 0.5, delay: i * 0.03 }}
                                  className="w-full rounded-t bg-green-500/60" style={{ maxHeight: '50%' }} />
                                <motion.div initial={{ height: 0 }} animate={{ height: `${f.ifSkipped}%` }}
                                  transition={{ duration: 0.5, delay: i * 0.03 + 0.1 }}
                                  className="w-full rounded-t bg-red-500/40" style={{ maxHeight: '50%' }} />
                              </div>
                            ))}
                          </div>
                          <div className="flex items-center justify-center gap-4 text-[9px] font-bold text-[var(--text-secondary)]">
                            <span className="flex items-center gap-1"><span className="w-2 h-2 rounded bg-green-500/60" /> If Attended</span>
                            <span className="flex items-center gap-1"><span className="w-2 h-2 rounded bg-red-500/40" /> If Skipped</span>
                          </div>
                        </div>
                      )}
                    </motion.div>
                  )}
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
                  <EmptyState icon={History} title="No history yet" description="Past calculations will appear here" />
                ) : (
                  <div className="space-y-2">
                    {history.map((entry, i) => (
                      <motion.div key={entry.id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.03 }}
                        className="glass-panel border border-[var(--border)] rounded-xl p-4 flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0"
                          style={{ background: getColorForPercentage(entry.result.currentPercentage) + '20' }}>
                          <span className="text-[10px] font-black" style={{ color: getColorForPercentage(entry.result.currentPercentage) }}>
                            {entry.result.currentPercentage}%
                          </span>
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-xs font-bold text-[var(--text-primary)]">
                            {entry.inputs.attended}/{entry.inputs.conducted} classes
                          </p>
                          <p className="text-[10px] text-[var(--text-secondary)]">
                            {new Date(entry.timestamp).toLocaleDateString('en', { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })}
                          </p>
                        </div>
                        <div className="flex gap-1">
                          <Button variant="accent" size="sm" onClick={() => { loadEntry(entry); setActiveTab('calculator'); }}>Load</Button>
                          <button onClick={() => removeEntry(entry.id)}
                            className="p-1.5 rounded-lg hover:bg-red-500/10 text-[var(--text-secondary)] hover:text-red-500 transition-all">
                            <Trash2 className="w-3 h-3" />
                          </button>
                        </div>
                      </motion.div>
                    ))}
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

export default AttendanceCalculator;
