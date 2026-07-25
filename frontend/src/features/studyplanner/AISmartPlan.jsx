import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Brain, Sparkles, Calendar, Clock, BookOpen, Coffee, Lightbulb, RefreshCw, ChevronDown, ChevronUp } from 'lucide-react';
import { TIMES } from './useStudyPlanner';

const inputCls = "w-full px-3 py-2.5 rounded-xl text-xs font-medium bg-[var(--bg-secondary)] border border-[var(--border)] text-[var(--text-primary)] focus:outline-none focus:border-[var(--accent)]/30 transition-all";

const AISmartPlan = ({ subjects, generateAIPlan, aiPlan }) => {
  const [loading, setLoading] = useState(false);
  const [showForm, setShowForm] = useState(!aiPlan);
  const [expanded, setExpanded] = useState(null);
  const [inputs, setInputs] = useState({
    weakSubjects: [], targetDate: '', hoursPerWeek: 28, studyStyle: 'Balanced', revisionPriority: 'Spaced',
  });

  const toggleWeak = (id) => setInputs(p => ({ ...p, weakSubjects: p.weakSubjects.includes(id) ? p.weakSubjects.filter(s => s !== id) : [...p.weakSubjects, id] }));

  const handleGenerate = async () => {
    setLoading(true);
    await new Promise(r => setTimeout(r, 2000));
    generateAIPlan(inputs);
    setLoading(false);
    setShowForm(false);
  };

  return (
    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="glass-panel border border-[var(--border)] rounded-2xl p-6 space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="p-2 bg-purple-500/10 rounded-xl"><Brain className="w-4 h-4 text-purple-500" /></div>
          <h3 className="text-sm font-bold text-[var(--text-primary)]">AI Smart Study Plan</h3>
        </div>
        {aiPlan && (
          <button onClick={() => setShowForm(!showForm)} className="flex items-center gap-1 px-2.5 py-1 rounded-lg bg-[var(--bg-secondary)] border border-[var(--border)] text-[10px] font-bold text-[var(--text-secondary)]">
            <RefreshCw className="w-3 h-3" /> Regenerate
          </button>
        )}
      </div>

      {/* Input Form */}
      <AnimatePresence>
        {showForm && (
          <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }} className="overflow-hidden space-y-3">
            <div className="space-y-1">
              <label className="text-[10px] font-bold uppercase tracking-wider text-[var(--text-secondary)]">Weak Subjects</label>
              <div className="flex flex-wrap gap-1.5">
                {subjects.map(s => (
                  <button key={s.id} onClick={() => toggleWeak(s.id)}
                    className={`px-2.5 py-1 rounded-lg text-[10px] font-bold border transition-all ${inputs.weakSubjects.includes(s.id) ? 'bg-red-500/10 border-red-500/30 text-red-500' : 'bg-[var(--bg-secondary)] border-[var(--border)] text-[var(--text-secondary)]'}`}>
                    {s.name}
                  </button>
                ))}
              </div>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1">
                <label className="text-[10px] font-bold uppercase tracking-wider text-[var(--text-secondary)]">Target Exam Date</label>
                <input type="date" value={inputs.targetDate} onChange={e => setInputs(p => ({ ...p, targetDate: e.target.value }))} className={inputCls} />
              </div>
              <div className="space-y-1">
                <label className="text-[10px] font-bold uppercase tracking-wider text-[var(--text-secondary)]">Hours / Week</label>
                <input type="number" min={7} max={80} value={inputs.hoursPerWeek} onChange={e => setInputs(p => ({ ...p, hoursPerWeek: parseInt(e.target.value) || 28 }))} className={inputCls} />
              </div>
              <div className="space-y-1">
                <label className="text-[10px] font-bold uppercase tracking-wider text-[var(--text-secondary)]">Study Style</label>
                <select value={inputs.studyStyle} onChange={e => setInputs(p => ({ ...p, studyStyle: e.target.value }))} className={inputCls + ' appearance-none'}>
                  {['Balanced', 'Intensive', 'Light', 'Deep Focus', 'Pomodoro'].map(s => <option key={s} value={s}>{s}</option>)}
                </select>
              </div>
              <div className="space-y-1">
                <label className="text-[10px] font-bold uppercase tracking-wider text-[var(--text-secondary)]">Revision Priority</label>
                <select value={inputs.revisionPriority} onChange={e => setInputs(p => ({ ...p, revisionPriority: e.target.value }))} className={inputCls + ' appearance-none'}>
                  {['Spaced', 'Cramming', 'Active Recall', 'Interleaved'].map(s => <option key={s} value={s}>{s}</option>)}
                </select>
              </div>
            </div>
            <button onClick={handleGenerate} disabled={loading}
              className="w-full flex items-center justify-center gap-1.5 py-2.5 rounded-xl bg-gradient-to-r from-purple-500 to-indigo-600 text-white font-bold text-xs shadow-lg shadow-purple-500/20 disabled:opacity-50">
              {loading ? <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" /> : <Sparkles className="w-3.5 h-3.5" />}
              {loading ? 'Generating AI Plan...' : 'Generate Smart Plan'}
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* AI Plan Output */}
      {aiPlan && !showForm && (
        <div className="space-y-3">
          {/* Schedule */}
          <div className="space-y-2">
            <h4 className="text-[10px] font-bold uppercase tracking-wider text-[var(--text-secondary)]">Weekly Schedule</h4>
            {aiPlan.schedule?.map((day, i) => (
              <div key={i} className="p-3 rounded-xl bg-[var(--bg-secondary)]/50 border border-[var(--border)] space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-[var(--text-primary)]">{day.day}</span>
                  <span className="text-[9px] font-bold text-indigo-500">{day.totalMinutes} min</span>
                </div>
                <div className="space-y-1">
                  {day.blocks?.map((b, j) => (
                    <div key={j} className="flex items-center gap-2 text-[10px]">
                      <Clock className="w-2.5 h-2.5 text-[var(--text-secondary)]" />
                      <span className="text-[var(--text-secondary)]">{b.startTime}</span>
                      <span className="font-bold text-[var(--text-primary)]">{b.subject}</span>
                      <span className="text-[var(--text-secondary)]">{b.duration}m</span>
                      {b.type === 'deep-study' && <span className="px-1.5 py-0.5 rounded-full bg-red-500/10 text-red-500 text-[8px] font-bold">Deep</span>}
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>

          {/* Strategy */}
          <div className="p-3 rounded-xl bg-purple-500/5 border border-purple-500/10 space-y-1">
            <h4 className="text-[10px] font-bold uppercase tracking-wider text-purple-500">Strategy</h4>
            <p className="text-[11px] text-[var(--text-secondary)]">{aiPlan.strategy}</p>
          </div>

          {/* Break Schedule */}
          <div className="p-3 rounded-xl bg-amber-500/5 border border-amber-500/10 space-y-1">
            <h4 className="text-[10px] font-bold uppercase tracking-wider text-amber-500 flex items-center gap-1"><Coffee className="w-3 h-3" /> Break Schedule</h4>
            <p className="text-[11px] text-[var(--text-secondary)]">{aiPlan.breakSchedule}</p>
          </div>

          {/* Tips */}
          <div className="p-3 rounded-xl bg-green-500/5 border border-green-500/10 space-y-2">
            <h4 className="text-[10px] font-bold uppercase tracking-wider text-green-500 flex items-center gap-1"><Lightbulb className="w-3 h-3" /> Motivational Tips</h4>
            <ul className="space-y-1">
              {aiPlan.tips?.map((tip, i) => (
                <li key={i} className="text-[11px] text-[var(--text-secondary)] flex items-start gap-1.5">
                  <span className="text-green-500 font-bold">{i + 1}.</span> {tip}
                </li>
              ))}
            </ul>
          </div>

          {/* Estimated Completion */}
          <div className="p-3 rounded-xl bg-[var(--bg-secondary)] text-center">
            <p className="text-[10px] font-bold text-[var(--text-secondary)]">Estimated Completion</p>
            <p className="text-sm font-black text-indigo-500">{aiPlan.estimatedCompletion ? new Date(aiPlan.estimatedCompletion + 'T00:00:00').toLocaleDateString('en', { month: 'long', day: 'numeric', year: 'numeric' }) : 'N/A'}</p>
          </div>
        </div>
      )}
    </motion.div>
  );
};

export default AISmartPlan;
