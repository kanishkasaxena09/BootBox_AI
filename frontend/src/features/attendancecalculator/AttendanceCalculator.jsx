import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ClipboardCheck, Calculator, RotateCcw, History, Trash2, TrendingUp, TrendingDown, AlertTriangle, CheckCircle2, Clock, ArrowDown, ArrowUp, Minus } from 'lucide-react';
import useAttendance from './useAttendance';
import { getColorForPercentage } from './mockData';
import { Tabs, StatCard, EmptyState } from '../../components/shared';

const fadeUp = { initial: { opacity: 0, y: 10 }, animate: { opacity: 1, y: 0 } };
const inputCls = "w-full px-3 py-2.5 rounded-xl text-xs font-bold bg-[var(--bg-secondary)] border border-[var(--border)] text-[var(--text-primary)] focus:outline-none focus:border-indigo-500/30 focus:ring-2 focus:ring-indigo-500/10 transition-all [color-scheme:dark]";

const RING_RADIUS = 58;
const RING_STROKE = 8;
const RING_CIRCUMFERENCE = 2 * Math.PI * RING_RADIUS;

const AttendanceCalculator = () => {
  const { inputs, updateInput, result, calculate, reset, history, loadEntry, removeEntry, clearHistory } = useAttendance();
  const [activeTab, setActiveTab] = useState('calculator');

  const ringColor = useMemo(() => result ? getColorForPercentage(result.currentPercentage) : '#6366f1', [result]);
  const ringOffset = useMemo(() => {
    if (!result) return RING_CIRCUMFERENCE;
    return RING_CIRCUMFERENCE - (result.currentPercentage / 100) * RING_CIRCUMFERENCE;
  }, [result]);

  const canCalculate = inputs.classesAttended > 0 && inputs.classesConducted > 0 && inputs.classesConducted >= inputs.classesAttended;

  const handleCalculate = (e) => {
    e?.preventDefault();
    if (canCalculate) calculate();
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') handleCalculate();
  };

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      {/* Header */}
      <div className="text-center space-y-2">
        <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-gradient-to-br from-indigo-500/20 to-purple-500/20 border border-indigo-500/30">
          <ClipboardCheck className="w-7 h-7 text-indigo-400" />
        </div>
        <h1 className="text-3xl font-black bg-gradient-to-r from-indigo-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
          Attendance Calculator
        </h1>
        <p className="text-sm text-[var(--text-secondary)] max-w-md mx-auto">
          Track your attendance, calculate required classes, and plan your semester smartly.
        </p>
      </div>

      {/* Tabs */}
      <div className="flex justify-center">
        <div className="glass-panel rounded-2xl p-1.5 border border-[var(--border)] flex items-center gap-1 w-fit">
          {[
            { id: 'calculator', label: 'Calculator', icon: Calculator },
            { id: 'history', label: 'History', icon: History },
          ].map(tab => {
            const Icon = tab.icon;
            return (
              <button key={tab.id} onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                  activeTab === tab.id ? 'bg-indigo-500/10 text-indigo-500 border border-indigo-500/20' : 'text-[var(--text-secondary)] hover:text-[var(--text-primary)] border border-transparent'
                }`}>
                <Icon className="w-3.5 h-3.5" /> {tab.label}
              </button>
            );
          })}
        </div>
      </div>

      <AnimatePresence mode="wait">
        {/* ============ CALCULATOR TAB ============ */}
        {activeTab === 'calculator' && (
          <motion.div key="calc" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
            className="grid grid-cols-1 lg:grid-cols-12 gap-5">

            {/* Left: Inputs */}
            <div className="lg:col-span-4">
              <form onSubmit={handleCalculate} className="glass-panel border border-[var(--border)] rounded-2xl p-6 space-y-5 sticky top-4">
                <div className="flex items-center gap-2">
                  <div className="p-2 bg-indigo-500/10 rounded-xl"><Calculator className="w-4 h-4 text-indigo-500" /></div>
                  <h3 className="text-sm font-bold text-[var(--text-primary)]">Input Details</h3>
                </div>

                <div className="space-y-4">
                  <div className="space-y-1">
                    <label className="text-[10px] font-bold uppercase tracking-wider text-[var(--text-secondary)]">Classes Attended</label>
                    <input type="number" min={0} value={inputs.classesAttended || ''} onChange={e => updateInput('classesAttended', e.target.value)}
                      onKeyDown={handleKeyDown} placeholder="e.g. 45" className={inputCls} />
                  </div>
                  <div className="space-y-1">
                    <label className="text-[10px] font-bold uppercase tracking-wider text-[var(--text-secondary)]">Classes Conducted</label>
                    <input type="number" min={0} value={inputs.classesConducted || ''} onChange={e => updateInput('classesConducted', e.target.value)}
                      onKeyDown={handleKeyDown} placeholder="e.g. 60" className={inputCls} />
                  </div>
                  <div className="space-y-1">
                    <label className="text-[10px] font-bold uppercase tracking-wider text-[var(--text-secondary)]">Required Attendance %</label>
                    <div className="relative">
                      <input type="number" min={0} max={100} value={inputs.requiredPercentage || ''} onChange={e => updateInput('requiredPercentage', e.target.value)}
                        onKeyDown={handleKeyDown} placeholder="e.g. 75" className={inputCls + ' pr-8'} />
                      <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs font-bold text-[var(--text-secondary)]">%</span>
                    </div>
                  </div>
                </div>

                <div className="flex gap-2 pt-1">
                  <button type="submit" disabled={!canCalculate}
                    className="flex-1 flex items-center justify-center gap-1.5 py-2.5 rounded-xl bg-gradient-to-r from-indigo-500 to-purple-600 text-white font-bold text-xs shadow-lg shadow-indigo-500/20 transition-all disabled:opacity-40 disabled:cursor-not-allowed">
                    <Calculator className="w-3.5 h-3.5" /> Calculate
                  </button>
                  <button type="button" onClick={reset}
                    className="px-4 py-2.5 rounded-xl bg-[var(--bg-secondary)] border border-[var(--border)] text-[var(--text-secondary)] hover:text-[var(--text-primary)] font-bold text-xs transition-all">
                    <RotateCcw className="w-3.5 h-3.5" />
                  </button>
                </div>

                {inputs.classesAttended > 0 && inputs.classesConducted > 0 && inputs.classesAttended > inputs.classesConducted && (
                  <p className="text-[10px] font-bold text-red-500 text-center">Attended cannot exceed conducted.</p>
                )}
              </form>
            </div>

            {/* Right: Results */}
            <div className="lg:col-span-8 space-y-5">
              {!result ? (
                <div className="glass-panel rounded-2xl p-12 border border-[var(--border)] flex flex-col items-center justify-center text-center space-y-3 min-h-[400px]">
                  <ClipboardCheck className="w-12 h-12 text-[var(--text-secondary)] opacity-20" />
                  <p className="text-sm font-bold text-[var(--text-secondary)]">Enter your attendance details</p>
                  <p className="text-xs text-[var(--text-secondary)] opacity-60">Results will appear here with charts & forecasts</p>
                </div>
              ) : (
                <div className="space-y-5">
                  {/* Status Banner */}
                  <motion.div {...fadeUp} className={`flex items-center gap-3 p-4 rounded-xl border ${
                    result.statusType === 'success' ? 'bg-green-500/5 border-green-500/20' :
                    result.statusType === 'warning' ? 'bg-amber-500/5 border-amber-500/20' :
                    result.statusType === 'danger' ? 'bg-red-500/5 border-red-500/20' :
                    'bg-[var(--bg-secondary)] border-[var(--border)]'
                  }`}>
                    {result.statusType === 'success' ? <CheckCircle2 className="w-5 h-5 text-green-500 flex-shrink-0" /> :
                     result.statusType === 'warning' ? <AlertTriangle className="w-5 h-5 text-amber-500 flex-shrink-0" /> :
                     <AlertTriangle className="w-5 h-5 text-red-500 flex-shrink-0" />}
                    <div>
                      <p className={`text-sm font-bold ${
                        result.statusType === 'success' ? 'text-green-500' :
                        result.statusType === 'warning' ? 'text-amber-500' : 'text-red-500'
                      }`}>{result.status}</p>
                    </div>
                  </motion.div>

                  {/* Stat Cards */}
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                    <motion.div {...fadeUp} transition={{ delay: 0.05 }}>
                      <StatCard icon={TrendingUp} label="Current Attendance" value={`${result.currentPercentage}%`} color={ringColor} />
                    </motion.div>
                    <motion.div {...fadeUp} transition={{ delay: 0.1 }}>
                      <StatCard icon={result.isDeficient ? ArrowUp : Minus} label={result.isDeficient ? 'Classes Needed' : 'Classes Can Skip'}
                        value={result.isDeficient ? result.classesNeeded : result.classesCanSkip}
                        color={result.isDeficient ? '#f59e0b' : '#10b981'}
                        sub={result.isDeficient ? `to reach ${inputs.requiredPercentage}%` : `while staying above ${inputs.requiredPercentage}%`} />
                    </motion.div>
                    <motion.div {...fadeUp} transition={{ delay: 0.15 }}>
                      <StatCard icon={CheckCircle2} label="Attended" value={`${inputs.classesAttended}/${inputs.classesConducted}`} color="#6366f1" />
                    </motion.div>
                    <motion.div {...fadeUp} transition={{ delay: 0.2 }}>
                      <StatCard icon={AlertTriangle} label="Absent" value={result.semesterStats.absent} color="#ef4444" />
                    </motion.div>
                  </div>

                  {/* Progress Ring + Quick Stats */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                    {/* Progress Ring */}
                    <motion.div {...fadeUp} transition={{ delay: 0.25 }}
                      className="glass-panel border border-[var(--border)] rounded-2xl p-6 flex flex-col items-center justify-center space-y-4">
                      <h4 className="text-[10px] font-bold uppercase tracking-wider text-[var(--text-secondary)]">Attendance Progress</h4>
                      <div className="relative">
                        <svg className="w-36 h-36 -rotate-90" viewBox="0 0 140 140">
                          <circle cx="70" cy="70" r={RING_RADIUS} fill="none" stroke="var(--border)" strokeWidth={RING_STROKE} />
                          <circle cx="70" cy="70" r={RING_RADIUS} fill="none" stroke={ringColor} strokeWidth={RING_STROKE}
                            strokeLinecap="round" strokeDasharray={RING_CIRCUMFERENCE}
                            strokeDashoffset={ringOffset} style={{ transition: 'stroke-dashoffset 1.2s ease-out, stroke 0.5s ease' }} />
                          {/* Required line */}
                          {inputs.requiredPercentage > 0 && inputs.requiredPercentage <= 100 && (
                            <circle cx="70" cy="70" r={RING_RADIUS} fill="none" stroke="var(--text-secondary)" strokeWidth={1.5}
                              strokeDasharray={RING_CIRCUMFERENCE}
                              strokeDashoffset={RING_CIRCUMFERENCE - (inputs.requiredPercentage / 100) * RING_CIRCUMFERENCE}
                              opacity={0.3} strokeDasharray="4 4" />
                          )}
                        </svg>
                        <div className="absolute inset-0 flex flex-col items-center justify-center">
                          <span className="text-2xl font-black" style={{ color: ringColor }}>{result.currentPercentage}%</span>
                          <span className="text-[9px] font-bold text-[var(--text-secondary)]">of {inputs.requiredPercentage}% required</span>
                        </div>
                      </div>
                      {/* Legend */}
                      <div className="flex items-center gap-3">
                        <div className="flex items-center gap-1">
                          <div className="w-2 h-2 rounded-full" style={{ background: ringColor }} />
                          <span className="text-[9px] font-bold text-[var(--text-secondary)]">Current</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <div className="w-2 h-2 rounded-full bg-[var(--text-secondary)] opacity-40" />
                          <span className="text-[9px] font-bold text-[var(--text-secondary)]">Required ({inputs.requiredPercentage}%)</span>
                        </div>
                      </div>
                    </motion.div>

                    {/* Semester Statistics */}
                    <motion.div {...fadeUp} transition={{ delay: 0.3 }}
                      className="glass-panel border border-[var(--border)] rounded-2xl p-6 space-y-4">
                      <h4 className="text-[10px] font-bold uppercase tracking-wider text-[var(--text-secondary)]">Semester Statistics</h4>
                      {/* Bar chart for attended vs absent */}
                      <div className="space-y-3 pt-2">
                        <div className="space-y-1.5">
                          <div className="flex items-center justify-between">
                            <span className="text-[10px] font-bold text-green-500">Attended</span>
                            <span className="text-[10px] font-bold text-[var(--text-primary)]">{result.semesterStats.attended} classes</span>
                          </div>
                          <div className="h-3 rounded-full bg-[var(--bg-secondary)] overflow-hidden">
                            <motion.div initial={{ width: 0 }} animate={{ width: `${result.currentPercentage}%` }}
                              transition={{ duration: 1, delay: 0.4 }}
                              className="h-full rounded-full bg-gradient-to-r from-green-500 to-emerald-500" />
                          </div>
                        </div>
                        <div className="space-y-1.5">
                          <div className="flex items-center justify-between">
                            <span className="text-[10px] font-bold text-red-500">Absent</span>
                            <span className="text-[10px] font-bold text-[var(--text-primary)]">{result.semesterStats.absent} classes</span>
                          </div>
                          <div className="h-3 rounded-full bg-[var(--bg-secondary)] overflow-hidden">
                            <motion.div initial={{ width: 0 }} animate={{ width: `${100 - result.currentPercentage}%` }}
                              transition={{ duration: 1, delay: 0.5 }}
                              className="h-full rounded-full bg-gradient-to-r from-red-500 to-rose-500" />
                          </div>
                        </div>
                      </div>
                      {/* Summary stats */}
                      <div className="grid grid-cols-3 gap-2 pt-2 border-t border-[var(--border)]">
                        <div className="text-center">
                          <p className="text-lg font-black text-[var(--text-primary)]">{result.semesterStats.total}</p>
                          <p className="text-[9px] font-bold text-[var(--text-secondary)]">Total</p>
                        </div>
                        <div className="text-center">
                          <p className="text-lg font-black text-green-500">{result.semesterStats.attended}</p>
                          <p className="text-[9px] font-bold text-[var(--text-secondary)]">Attended</p>
                        </div>
                        <div className="text-center">
                          <p className="text-lg font-black text-red-500">{result.semesterStats.absent}</p>
                          <p className="text-[9px] font-bold text-[var(--text-secondary)]">Absent</p>
                        </div>
                      </div>
                      {/* Quick message */}
                      <div className="p-3 rounded-xl bg-[var(--bg-secondary)]/50 border border-[var(--border)]">
                        {result.isDeficient ? (
                          <p className="text-[10px] font-bold text-amber-500 text-center">
                            Attend next <span className="text-sm font-black">{result.classesNeeded}</span> class{result.classesNeeded !== 1 ? 'es' : ''} to reach {inputs.requiredPercentage}%
                          </p>
                        ) : (
                          <p className="text-[10px] font-bold text-green-500 text-center">
                            You can skip <span className="text-sm font-black">{result.classesCanSkip}</span> more class{result.classesCanSkip !== 1 ? 'es' : ''} and still stay above {inputs.requiredPercentage}%
                          </p>
                        )}
                      </div>
                    </motion.div>
                  </div>

                  {/* Attendance Forecast Chart */}
                  <motion.div {...fadeUp} transition={{ delay: 0.35 }}
                    className="glass-panel border border-[var(--border)] rounded-2xl p-6 space-y-4">
                    <div className="flex items-center justify-between">
                      <h4 className="text-[10px] font-bold uppercase tracking-wider text-[var(--text-secondary)]">Attendance Forecast (Next 20 Classes)</h4>
                      <div className="flex items-center gap-3">
                        <div className="flex items-center gap-1">
                          <div className="w-2 h-2 rounded-full bg-green-500" />
                          <span className="text-[9px] font-bold text-[var(--text-secondary)]">If Attended</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <div className="w-2 h-2 rounded-full bg-red-500" />
                          <span className="text-[9px] font-bold text-[var(--text-secondary)]">If Skipped</span>
                        </div>
                      </div>
                    </div>
                    {/* Bar chart */}
                    <div className="h-[200px] flex items-end gap-1 pt-2">
                      {result.forecastData.map((d, i) => {
                        const barHeight = Math.max(2, (d.ifAttended / 100) * 180);
                        const skipHeight = Math.max(2, (d.ifSkipped / 100) * 180);
                        const meetsReq = d.ifAttended >= inputs.requiredPercentage;
                        return (
                          <div key={i} className="flex-1 flex flex-col items-center gap-0.5" title={`+${d.classes} class: ${d.ifAttended}% (attended) / ${d.ifSkipped}% (skipped)`}>
                            <div className="w-full flex gap-px items-end" style={{ height: '180px' }}>
                              <motion.div initial={{ height: 0 }} animate={{ height: barHeight }}
                                transition={{ duration: 0.6, delay: 0.4 + i * 0.03 }}
                                className="flex-1 rounded-t-sm" style={{ background: meetsReq ? '#10b981' : '#f59e0b', minHeight: 2 }} />
                              <motion.div initial={{ height: 0 }} animate={{ height: skipHeight }}
                                transition={{ duration: 0.6, delay: 0.4 + i * 0.03 }}
                                className="flex-1 rounded-t-sm bg-red-500/60" style={{ minHeight: 2 }} />
                            </div>
                            {i % 4 === 0 && (
                              <span className="text-[8px] font-bold text-[var(--text-secondary)]">+{d.classes}</span>
                            )}
                          </div>
                        );
                      })}
                    </div>
                    {/* Required line indicator */}
                    <div className="flex items-center gap-2 pt-2 border-t border-[var(--border)]">
                      <div className="h-px flex-1 border-t-2 border-dashed border-[var(--text-secondary)] opacity-30" />
                      <span className="text-[9px] font-bold text-[var(--text-secondary)]">Required: {inputs.requiredPercentage}%</span>
                      <div className="h-px flex-1 border-t-2 border-dashed border-[var(--text-secondary)] opacity-30" />
                    </div>
                  </motion.div>
                </div>
              )}
            </div>
          </motion.div>
        )}

        {/* ============ HISTORY TAB ============ */}
        {activeTab === 'history' && (
          <motion.div key="history" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
            className="max-w-2xl mx-auto space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-bold text-[var(--text-primary)]">Calculation History</h3>
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
                <p className="text-xs text-[var(--text-secondary)] opacity-60">Previous calculations will appear here</p>
              </div>
            ) : (
              <div className="space-y-2">
                {history.map((entry, i) => {
                  const color = getColorForPercentage(entry.result.currentPercentage);
                  return (
                    <motion.div key={entry.id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.03 }}
                      className="glass-panel border border-[var(--border)] rounded-xl p-4 flex items-center gap-4">
                      <div className="w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0" style={{ background: color + '15' }}>
                        <span className="text-sm font-black" style={{ color }}>{entry.result.currentPercentage}%</span>
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2">
                          <span className="text-xs font-bold text-[var(--text-primary)]">{entry.inputs.classesAttended}/{entry.inputs.classesConducted} classes</span>
                          <span className={`text-[9px] font-bold px-1.5 py-0.5 rounded-full ${
                            entry.result.statusType === 'success' ? 'bg-green-500/10 text-green-500' :
                            entry.result.statusType === 'warning' ? 'bg-amber-500/10 text-amber-500' : 'bg-red-500/10 text-red-500'
                          }`}>{entry.result.statusType}</span>
                        </div>
                        <p className="text-[10px] text-[var(--text-secondary)] mt-0.5">
                          Required: {entry.inputs.requiredPercentage}% · {new Date(entry.timestamp).toLocaleDateString('en', { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })}
                        </p>
                      </div>
                      <div className="flex gap-1">
                        <button onClick={() => { loadEntry(entry); setActiveTab('calculator'); }}
                          className="px-2.5 py-1.5 rounded-lg text-[10px] font-bold bg-indigo-500/10 border border-indigo-500/20 text-indigo-500 hover:bg-indigo-500/20 transition-all">
                          Load
                        </button>
                        <button onClick={() => removeEntry(entry.id)}
                          className="p-1.5 rounded-lg hover:bg-red-500/10 text-[var(--text-secondary)] hover:text-red-500 transition-all">
                          <Trash2 className="w-3 h-3" />
                        </button>
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

export default AttendanceCalculator;
