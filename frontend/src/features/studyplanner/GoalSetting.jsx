import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Target, Plus, Trash2, Check, Flame, Repeat } from 'lucide-react';
import { PRIORITY } from './useStudyPlanner';
import { Button, EmptyState, SectionHeader, TextInput, SelectInput, DateInput } from '../../components/shared';

const fadeUp = { initial: { opacity: 0, y: 10 }, animate: { opacity: 1, y: 0 }, exit: { opacity: 0, y: -10 } };
const TYPES = ['daily', 'weekly', 'monthly', 'yearly'];

const GoalSetting = ({ goals, addGoal, updateGoal, deleteGoal, toggleGoal }) => {
  const [showForm, setShowForm] = useState(false);
  const [filter, setFilter] = useState('all');
  const [form, setForm] = useState({ title: '', type: 'daily', priority: 'medium', deadline: '', recurring: false });

  const filtered = filter === 'all' ? goals : goals.filter(g => g.type === filter);
  const completedCount = goals.filter(g => g.completed).length;
  const streakGoals = goals.filter(g => g.streak > 0).sort((a, b) => b.streak - a.streak);

  const handleSave = (e) => {
    e.preventDefault();
    addGoal(form);
    setForm({ title: '', type: 'daily', priority: 'medium', deadline: '', recurring: false });
    setShowForm(false);
  };

  return (
    <motion.div {...fadeUp} className="glass-panel border border-[var(--border)] rounded-2xl p-6 space-y-4">
      <SectionHeader icon={Target} label="Goal Setting">
        <Button variant="accent" size="sm" icon={Plus} onClick={() => setShowForm(!showForm)}>Add</Button>
      </SectionHeader>

      <div className="flex gap-3">
        <div className="flex-1 p-2.5 rounded-xl bg-[var(--bg-secondary)] text-center">
          <p className="text-lg font-black text-[var(--text-primary)]">{completedCount}/{goals.length}</p>
          <p className="text-[9px] font-bold text-[var(--text-secondary)]">Completed</p>
        </div>
        <div className="flex-1 p-2.5 rounded-xl bg-[var(--bg-secondary)] text-center">
          <p className="text-lg font-black text-amber-500">{streakGoals[0]?.streak || 0}</p>
          <p className="text-[9px] font-bold text-[var(--text-secondary)]">Best Streak</p>
        </div>
      </div>

      <div className="flex gap-1.5">
        {['all', ...TYPES].map(t => (
          <Button key={t} variant={filter === t ? 'accent' : 'secondary'} size="sm" onClick={() => setFilter(t)} className="capitalize">
            {t}
          </Button>
        ))}
      </div>

      <AnimatePresence>
        {showForm && (
          <motion.form initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }}
            onSubmit={handleSave} className="overflow-hidden space-y-3">
            <TextInput label="Goal Title" value={form.title} onChange={v => setForm(f => ({ ...f, title: v }))} placeholder="Goal title..." />
            <div className="grid grid-cols-3 gap-2">
              <SelectInput label="Type" value={form.type} onChange={v => setForm(f => ({ ...f, type: v }))} options={TYPES.map(t => ({ value: t, label: t.charAt(0).toUpperCase() + t.slice(1) }))} />
              <SelectInput label="Priority" value={form.priority} onChange={v => setForm(f => ({ ...f, priority: v }))} options={Object.entries(PRIORITY).map(([k, v]) => ({ value: k, label: v.label }))} />
              <DateInput label="Deadline" value={form.deadline} onChange={v => setForm(f => ({ ...f, deadline: v }))} />
            </div>
            <div className="flex items-center gap-2">
              <label className="flex items-center gap-1.5 text-[10px] font-bold text-[var(--text-secondary)] cursor-pointer">
                <input type="checkbox" checked={form.recurring} onChange={e => setForm(f => ({ ...f, recurring: e.target.checked }))} className="rounded" />
                <Repeat className="w-3 h-3" /> Recurring
              </label>
            </div>
            <Button type="submit" variant="primary" fullWidth className="!bg-gradient-to-r !from-indigo-500 !to-purple-600">Add Goal</Button>
          </motion.form>
        )}
      </AnimatePresence>

      <div className="space-y-2 max-h-[300px] overflow-y-auto pr-1">
        <AnimatePresence>
          {filtered.length === 0 ? (
            <EmptyState icon={Target} title="No goals yet" description="Set your first goal to start tracking progress." />
          ) : filtered.map(g => (
            <motion.div key={g.id} layout variants={fadeUp} initial="initial" animate="animate" exit="exit"
              className={`flex items-center gap-3 p-3 rounded-xl border transition-all ${g.completed ? 'bg-green-500/5 border-green-500/10 opacity-70' : 'bg-[var(--bg-secondary)]/50 border-[var(--border)]'}`}>
              <button onClick={() => toggleGoal(g.id)}
                className={`w-5 h-5 rounded-full border-2 flex items-center justify-center flex-shrink-0 transition-all ${g.completed ? 'bg-green-500 border-green-500' : 'border-[var(--border)] hover:border-indigo-500/50'}`}>
                {g.completed && <Check className="w-3 h-3 text-white" />}
              </button>
              <div className="flex-1 min-w-0">
                <p className={`text-xs font-bold ${g.completed ? 'line-through text-[var(--text-secondary)]' : 'text-[var(--text-primary)]'}`}>{g.title}</p>
                <div className="flex items-center gap-2 mt-1">
                  <span className="text-[9px] font-bold px-1.5 py-0.5 rounded-full bg-[var(--bg-secondary)] text-[var(--text-secondary)] capitalize">{g.type}</span>
                  <span className={`text-[9px] font-bold px-1.5 py-0.5 rounded-full ${PRIORITY[g.priority]?.bg} ${PRIORITY[g.priority]?.text}`}>{g.priority}</span>
                  {g.streak > 0 && <span className="flex items-center gap-0.5 text-[9px] font-bold text-amber-500"><Flame className="w-2.5 h-2.5" />{g.streak}</span>}
                  {g.recurring && <Repeat className="w-2.5 h-2.5 text-[var(--text-secondary)]" />}
                </div>
              </div>
              <Button variant="ghost" size="sm" onClick={() => deleteGoal(g.id)} className="!text-[var(--text-secondary)] hover:!text-red-500 hover:!bg-red-500/10">
                <Trash2 className="w-3 h-3" />
              </Button>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </motion.div>
  );
};

export default GoalSetting;
