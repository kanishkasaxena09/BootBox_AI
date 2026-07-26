import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { GraduationCap, Save, Sparkles } from 'lucide-react';
import { TIMES } from './useStudyPlanner';
import { FormField, TextInput, NumberInput, DateInput, SelectInput, Button } from '../../components/shared';

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

  return (
    <motion.div {...fadeUp} className="glass-panel border border-[var(--border)] rounded-2xl p-6 space-y-5">
      <div className="flex items-center gap-2">
        <div className="p-2 bg-indigo-500/10 rounded-xl"><GraduationCap className="w-4 h-4 text-indigo-500" /></div>
        <h3 className="text-sm font-bold text-[var(--text-primary)]">Semester Planner</h3>
      </div>
      <div className="grid grid-cols-2 gap-3">
        <TextInput label="Semester Name" value={semester.name || ''} onChange={v => update('name', v)} placeholder="e.g. Fall 2026" />
        <TextInput label="Academic Year" value={semester.year || ''} onChange={v => update('year', v)} placeholder="e.g. 2026-27" />
        <DateInput label="Start Date" value={semester.startDate || ''} onChange={v => update('startDate', v)} />
        <DateInput label="End Date" value={semester.endDate || ''} onChange={v => update('endDate', v)} />
        <NumberInput label="Number of Subjects" value={semester.subjectsCount || ''} onChange={v => update('subjectsCount', v)} min={1} />
        <NumberInput label="Study Hours / Day" value={semester.hoursPerDay || ''} onChange={v => update('hoursPerDay', v)} min={1} />
        <FormField label="Target CGPA">
          <input type="number" min={0} max={10} step={0.1} value={semester.targetCgpa || ''} onChange={e => update('targetCgpa', e.target.value)} placeholder="e.g. 8.5"
            className="w-full px-3 py-2.5 rounded-xl text-xs font-medium bg-[var(--bg-secondary)] border border-[var(--border)] text-[var(--text-primary)] focus:outline-none focus:border-[var(--accent)]/30 focus:ring-2 focus:ring-[var(--accent)]/10 transition-all [color-scheme:dark]" />
        </FormField>
        <SelectInput label="Preferred Study Time" value={semester.studyTime || 'Morning'} onChange={v => update('studyTime', v)} options={TIMES} />
      </div>
      <div className="flex gap-2 pt-1">
        <Button variant="primary" icon={Save} fullWidth className="!bg-gradient-to-r !from-indigo-500 !to-purple-600 hover:!shadow-lg hover:!shadow-indigo-500/20">
          Save Semester Plan
        </Button>
        <Button variant="secondary" icon={Sparkles} loading={loading} onClick={handleGenerate} fullWidth>
          {loading ? 'Generating...' : 'Generate AI Schedule'}
        </Button>
      </div>
    </motion.div>
  );
};

export default SemesterPlanner;
