import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { GraduationCap, Save, Sparkles } from 'lucide-react';
import { TIMES } from './useStudyPlanner';

const fadeUp = { initial: { opacity: 0, y: 10 }, animate: { opacity: 1, y: 0 } };

const SemesterPlanner = ({ semester, setSemester, onGenerateAI }) => {
  const [loading, setLoading] = useState(false);
  const update = (k, v) => setSemester(p => ({ ...p, [k]: v }));

  const handleGenerate = async () => {
    setLoading(true);
    await new Promise(r => setTimeout(r, 1500));
    onGenerateAI?.();
    setLoading(false);
  };

  const Field = ({ label, children }) => (
    <div className="space-y-1">
      <label className="text-[10px] font-bold uppercase tracking-wider text-[var(--text-secondary)]">{label}</label>
      {children}
    </div>
  );

  const inputCls = "w-full px-3 py-2.5 rounded-xl text-xs font-medium bg-[var(--bg-secondary)] border border-[var(--border)] text-[var(--text-primary)] focus:outline-none focus:border-[var(--accent)]/30 focus:ring-2 focus:ring-[var(--accent)]/10 transition-all [color-scheme:dark]";

  return (
    <motion.div {...fadeUp} className="glass-panel border border-[var(--border)] rounded-2xl p-6 space-y-5">
      <div className="flex items-center gap-2">
        <div className="p-2 bg-indigo-500/10 rounded-xl"><GraduationCap className="w-4 h-4 text-indigo-500" /></div>
        <h3 className="text-sm font-bold text-[var(--text-primary)]">Semester Planner</h3>
      </div>
      <div className="grid grid-cols-2 gap-3">
        <Field label="Semester Name">
          <input className={inputCls} value={semester.name || ''} onChange={e => update('name', e.target.value)} placeholder="e.g. Fall 2026" />
        </Field>
        <Field label="Academic Year">
          <input className={inputCls} value={semester.year || ''} onChange={e => update('year', e.target.value)} placeholder="e.g. 2026-27" />
        </Field>
        <Field label="Start Date">
          <input type="date" className={inputCls} value={semester.startDate || ''} onChange={e => update('startDate', e.target.value)} />
        </Field>
        <Field label="End Date">
          <input type="date" className={inputCls} value={semester.endDate || ''} onChange={e => update('endDate', e.target.value)} />
        </Field>
        <Field label="Number of Subjects">
          <input type="number" min={1} max={15} className={inputCls} value={semester.subjectsCount || ''} onChange={e => update('subjectsCount', parseInt(e.target.value) || 0)} />
        </Field>
        <Field label="Study Hours / Day">
          <input type="number" min={1} max={16} className={inputCls} value={semester.hoursPerDay || ''} onChange={e => update('hoursPerDay', parseInt(e.target.value) || 0)} />
        </Field>
        <Field label="Target CGPA">
          <input type="number" min={0} max={10} step={0.1} className={inputCls} value={semester.targetCgpa || ''} onChange={e => update('targetCgpa', e.target.value)} placeholder="e.g. 8.5" />
        </Field>
        <Field label="Preferred Study Time">
          <div className="relative">
            <select className={inputCls + ' appearance-none pr-8'} value={semester.studyTime || 'Morning'} onChange={e => update('studyTime', e.target.value)}>
              {TIMES.map(t => <option key={t} value={t}>{t}</option>)}
            </select>
          </div>
        </Field>
      </div>
      <div className="flex gap-2 pt-1">
        <button className="flex-1 flex items-center justify-center gap-1.5 py-2.5 rounded-xl bg-gradient-to-r from-indigo-500 to-purple-600 text-white font-bold text-xs shadow-lg shadow-indigo-500/20 transition-all">
          <Save className="w-3.5 h-3.5" /> Save Semester Plan
        </button>
        <button onClick={handleGenerate} disabled={loading}
          className="flex-1 flex items-center justify-center gap-1.5 py-2.5 rounded-xl bg-[var(--bg-secondary)] border border-[var(--border)] text-[var(--text-secondary)] hover:text-indigo-500 font-bold text-xs transition-all disabled:opacity-50">
          {loading ? <span className="w-3.5 h-3.5 border-2 border-indigo-500 border-t-transparent rounded-full animate-spin" /> : <Sparkles className="w-3.5 h-3.5" />}
          {loading ? 'Generating...' : 'Generate AI Schedule'}
        </button>
      </div>
    </motion.div>
  );
};

export default SemesterPlanner;
