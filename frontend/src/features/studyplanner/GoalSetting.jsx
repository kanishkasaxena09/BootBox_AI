import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Target, Plus, Trash2, Check, X, Flame, Repeat, Calendar } from 'lucide-react';
import { PRIORITY } from './useStudyPlanner';

const fadeUp = { initial: { opacity: 0, y: 10 }, animate: { opacity: 1, y: 0 }, exit: { opacity: 0, y: -10 } };
const inputCls = "w-full px-3 py-2.5 rounded-xl text-xs font-medium bg-[var(--bg-secondary)] border border-[var(--border)] text-[var(--text-primary)] focus:outline-none focus:border-[var(--accent)]/30 transition-all";
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
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="p-2 bg-green-500/10 rounded-xl"><Target className="w-4 h-4 text-green-500" /></div>
          <h3 className="text-sm font-bold text-[var(--text-primary)]">Goal Setting</h3>
        </div>
        <button onClick={() => setShowForm(!showForm)} className="flex items-center gap-1 px-3 py-1.5 rounded-xl bg-indigo-500/10 border border-indigo-500/20 text-indigo-500 text-[10px] font-bold">
          <Plus className="w-3 h-3" /> Add
        </button>
      </div>

      {/* Stats */}
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

      {/* Filter */}
      <div className="flex gap-1.5">
        {['all', ...TYPES].map(t => (
          <button key={t} onClick={() => setFilter(t)}
            className={`px-2.5 py-1 rounded-lg text-[10px] font-bold capitalize transition-all ${filter === t ? 'bg-indigo-500/10 border border-indigo-500/30 text-indigo-500' : 'bg-[var(--bg-secondary)] border border-[var(--border)] text-[var(--text-secondary)]'}`}>
            {t}
          </button>
        ))}
      </div>

      {/* Form */}
      <AnimatePresence>
        {showForm && (
          <motion.form initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }}
            onSubmit={handleSave} className="overflow-hidden space-y-3">
            <input required value={form.title} onChange={e => setForm(f => ({ ...f, title: e.target.value }))} className={inputCls} placeholder="Goal title..." />
            <div className="grid grid-cols-3 gap-2">
              <select value={form.type} onChange={e => setForm(f => ({ ...f, type: e.target.value }))} className={inputCls + ' appearance-none'}>
                {TYPES.map(t => <option key={t} value={t}>{t.charAt(0).toUpperCase() + t.slice(1)}</option>)}
              </select>
              <select value={form.priority} onChange={e => setForm(f => ({ ...f, priority: e.target.value }))} className={inputCls + ' appearance-none'}>
                {Object.entries(PRIORITY).map(([k, v]) => <option key={k} value={k}>{v.label}</option>)}
              </select>
              <input type="date" value={form.deadline} onChange={e => setForm(f => ({ ...f, deadline: e.target.value }))} className={inputCls} />
            </div>
            <div className="flex items-center gap-2">
              <label className="flex items-center gap-1.5 text-[10px] font-bold text-[var(--text-secondary)] cursor-pointer">
                <input type="checkbox" checked={form.recurring} onChange={e => setForm(f => ({ ...f, recurring: e.target.checked }))} className="rounded" />
                <Repeat className="w-3 h-3" /> Recurring
              </label>
            </div>
            <button type="submit" className="w-full py-2 rounded-xl bg-gradient-to-r from-indigo-500 to-purple-600 text-white font-bold text-xs">Add Goal</button>
          </motion.form>
        )}
      </AnimatePresence>

      {/* Goal List */}
      <div className="space-y-2 max-h-[300px] overflow-y-auto pr-1">
        <AnimatePresence>
          {filtered.length === 0 ? (
            <div className="text-center py-6 space-y-2">
              <Target className="w-8 h-8 mx-auto text-[var(--text-secondary)] opacity-30" />
              <p className="text-xs font-bold text-[var(--text-secondary)]">No goals yet</p>
            </div>
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
              <button onClick={() => deleteGoal(g.id)} className="p-1 rounded hover:bg-red-500/10 text-[var(--text-secondary)] hover:text-red-500 flex-shrink-0"><Trash2 className="w-3 h-3" /></button>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </motion.div>
  );
};

export default GoalSetting;
