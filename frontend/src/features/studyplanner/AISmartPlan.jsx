import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Brain, Sparkles, Clock, Coffee, Lightbulb, RefreshCw } from 'lucide-react';
import { TIMES } from './useStudyPlanner';
import { FormField, DateInput, NumberInput, SelectInput, Button, SectionHeader } from '../../components/shared';

const AISmartPlan = ({ subjects, generateAIPlan, aiPlan }) => {
  const [loading, setLoading] = useState(false);
  const [showForm, setShowForm] = useState(!aiPlan);
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
          <Button variant="secondary" size="sm" icon={RefreshCw} onClick={() => setShowForm(!showForm)}>Regenerate</Button>
        )}
      </div>

      <AnimatePresence>
        {showForm && (
          <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }} className="overflow-hidden space-y-3">
            <FormField label="Weak Subjects">
              <div className="flex flex-wrap gap-1.5">
                {subjects.map(s => (
                  <Button key={s.id} variant={inputs.weakSubjects.includes(s.id) ? 'danger' : 'secondary'} size="sm" onClick={() => toggleWeak(s.id)}>
                    {s.name}
                  </Button>
                ))}
              </div>
            </FormField>
            <div className="grid grid-cols-2 gap-3">
              <DateInput label="Target Exam Date" value={inputs.targetDate} onChange={v => setInputs(p => ({ ...p, targetDate: v }))} />
              <NumberInput label="Hours / Week" value={inputs.hoursPerWeek} onChange={v => setInputs(p => ({ ...p, hoursPerWeek: v }))} min={7} />
              <SelectInput label="Study Style" value={inputs.studyStyle} onChange={v => setInputs(p => ({ ...p, studyStyle: v }))} options={['Balanced', 'Intensive', 'Light', 'Deep Focus', 'Pomodoro']} />
              <SelectInput label="Revision Priority" value={inputs.revisionPriority} onChange={v => setInputs(p => ({ ...p, revisionPriority: v }))} options={['Spaced', 'Cramming', 'Active Recall', 'Interleaved']} />
            </div>
            <Button variant="primary" fullWidth loading={loading} onClick={handleGenerate} className="!bg-gradient-to-r !from-purple-500 !to-indigo-600 hover:!shadow-lg hover:!shadow-purple-500/20">
              {loading ? 'Generating AI Plan...' : 'Generate Smart Plan'}
            </Button>
          </motion.div>
        )}
      </AnimatePresence>

      {aiPlan && !showForm && (
        <div className="space-y-3">
          <div className="space-y-2">
            <SectionHeader icon={Clock} label="Weekly Schedule" />
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

          <div className="p-3 rounded-xl bg-purple-500/5 border border-purple-500/10 space-y-1">
            <h4 className="text-[10px] font-bold uppercase tracking-wider text-purple-500">Strategy</h4>
            <p className="text-[11px] text-[var(--text-secondary)]">{aiPlan.strategy}</p>
          </div>

          <div className="p-3 rounded-xl bg-amber-500/5 border border-amber-500/10 space-y-1">
            <SectionHeader icon={Coffee} label="Break Schedule" />
            <p className="text-[11px] text-[var(--text-secondary)]">{aiPlan.breakSchedule}</p>
          </div>

          <div className="p-3 rounded-xl bg-green-500/5 border border-green-500/10 space-y-2">
            <SectionHeader icon={Lightbulb} label="Motivational Tips" />
            <ul className="space-y-1">
              {aiPlan.tips?.map((tip, i) => (
                <li key={i} className="text-[11px] text-[var(--text-secondary)] flex items-start gap-1.5">
                  <span className="text-green-500 font-bold">{i + 1}.</span> {tip}
                </li>
              ))}
            </ul>
          </div>

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
