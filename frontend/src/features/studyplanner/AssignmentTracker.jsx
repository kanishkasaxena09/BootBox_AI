import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ClipboardList, Plus, Search, Trash2, Edit2, Calendar, AlertTriangle, Check, X, ChevronDown, Filter, ArrowUpDown } from 'lucide-react';
import { PRIORITY, STATUS } from './useStudyPlanner';

const fadeUp = { initial: { opacity: 0, y: 10 }, animate: { opacity: 1, y: 0 }, exit: { opacity: 0, y: -10 } };
const inputCls = "w-full px-3 py-2.5 rounded-xl text-xs font-medium bg-[var(--bg-secondary)] border border-[var(--border)] text-[var(--text-primary)] focus:outline-none focus:border-[var(--accent)]/30 transition-all";
const selectCls = inputCls + " appearance-none";

const AssignmentTracker = ({ assignments, addAssignment, updateAssignment, deleteAssignment, subjects, getSubjectName, getSubjectColor }) => {
  const [showForm, setShowForm] = useState(false);
  const [editId, setEditId] = useState(null);
  const [search, setSearch] = useState('');
  const [sortBy, setSortBy] = useState('deadline');
  const [form, setForm] = useState({ name: '', subject: '', priority: 'medium', deadline: '', status: 'pending', notes: '' });
  const today = new Date().toISOString().slice(0, 10);

  const sorted = useMemo(() => {
    let list = [...assignments];
    if (search) list = list.filter(a => a.name.toLowerCase().includes(search.toLowerCase()) || (getSubjectName(a.subject)).toLowerCase().includes(search.toLowerCase()));
    const pOrder = { high: 0, medium: 1, low: 2 };
    const sOrder = { 'in-progress': 0, pending: 1, completed: 2 };
    list.sort((a, b) => {
      if (sortBy === 'deadline') return (a.deadline || 'z').localeCompare(b.deadline || 'z');
      if (sortBy === 'priority') return (pOrder[a.priority] || 1) - (pOrder[b.priority] || 1);
      if (sortBy === 'status') return (sOrder[a.status] || 1) - (sOrder[b.status] || 1);
      return a.name.localeCompare(b.name);
    });
    return list;
  }, [assignments, search, sortBy, getSubjectName]);

  const completedCount = assignments.filter(a => a.status === 'completed').length;
  const progressPct = assignments.length > 0 ? Math.round((completedCount / assignments.length) * 100) : 0;
  const overdueCount = assignments.filter(a => a.status !== 'completed' && a.deadline && a.deadline < today).length;

  const openNew = () => { setForm({ name: '', subject: '', priority: 'medium', deadline: '', status: 'pending', notes: '' }); setEditId(null); setShowForm(true); };
  const openEdit = (a) => { setForm({ name: a.name, subject: a.subject, priority: a.priority, deadline: a.deadline, status: a.status, notes: a.notes }); setEditId(a.id); setShowForm(true); };
  const handleSave = (e) => {
    e.preventDefault();
    if (editId) updateAssignment(editId, form);
    else addAssignment(form);
    setShowForm(false); setEditId(null);
  };

  const statusColors = { pending: 'bg-amber-500/10 text-amber-500', 'in-progress': 'bg-blue-500/10 text-blue-500', completed: 'bg-green-500/10 text-green-500' };

  return (
    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="glass-panel border border-[var(--border)] rounded-2xl p-6 space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="p-2 bg-purple-500/10 rounded-xl"><ClipboardList className="w-4 h-4 text-purple-500" /></div>
          <h3 className="text-sm font-bold text-[var(--text-primary)]">Assignment Tracker</h3>
        </div>
        <button onClick={openNew} className="flex items-center gap-1 px-3 py-1.5 rounded-xl bg-indigo-500/10 border border-indigo-500/20 text-indigo-500 text-[10px] font-bold">
          <Plus className="w-3 h-3" /> Add
        </button>
      </div>

      {/* Progress Bar */}
      <div className="space-y-1.5">
        <div className="flex items-center justify-between">
          <span className="text-[10px] font-bold text-[var(--text-secondary)]">{completedCount}/{assignments.length} completed</span>
          <span className="text-[10px] font-bold text-indigo-500">{progressPct}%</span>
        </div>
        <div className="h-2 rounded-full bg-[var(--bg-secondary)]">
          <motion.div initial={{ width: 0 }} animate={{ width: `${progressPct}%` }} className="h-full rounded-full bg-gradient-to-r from-indigo-500 to-purple-500" />
        </div>
        {overdueCount > 0 && (
          <div className="flex items-center gap-1 text-[10px] font-bold text-red-500">
            <AlertTriangle className="w-3 h-3" /> {overdueCount} overdue
          </div>
        )}
      </div>

      {/* Filters */}
      <div className="flex items-center gap-2 flex-wrap">
        <div className="relative flex-1 min-w-[120px]">
          <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3 h-3 text-[var(--text-secondary)]" />
          <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search..."
            className="w-full pl-8 pr-3 py-2 rounded-xl bg-[var(--bg-secondary)] border border-[var(--border)] text-[10px] font-bold text-[var(--text-primary)] focus:outline-none" />
        </div>
        <select value={sortBy} onChange={e => setSortBy(e.target.value)}
          className="px-2.5 py-2 rounded-xl bg-[var(--bg-secondary)] border border-[var(--border)] text-[10px] font-bold text-[var(--text-secondary)] appearance-none focus:outline-none">
          <option value="deadline">Deadline</option>
          <option value="priority">Priority</option>
          <option value="status">Status</option>
          <option value="name">Name</option>
        </select>
      </div>

      {/* List */}
      <div className="space-y-2 max-h-[400px] overflow-y-auto pr-1">
        <AnimatePresence>
          {sorted.length === 0 ? (
            <div className="text-center py-8 space-y-2">
              <ClipboardList className="w-8 h-8 mx-auto text-[var(--text-secondary)] opacity-30" />
              <p className="text-xs font-bold text-[var(--text-secondary)]">No assignments yet</p>
              <button onClick={openNew} className="text-[10px] font-bold text-indigo-500">+ Add Assignment</button>
            </div>
          ) : sorted.map(a => {
            const isOverdue = a.status !== 'completed' && a.deadline && a.deadline < today;
            return (
              <motion.div key={a.id} layout variants={fadeUp} initial="initial" animate="animate" exit="exit"
                className={`flex items-start gap-3 p-3 rounded-xl border transition-all ${isOverdue ? 'bg-red-500/5 border-red-500/20' : 'bg-[var(--bg-secondary)]/50 border-[var(--border)]'}`}>
                <button onClick={() => updateAssignment(a.id, { status: a.status === 'completed' ? 'pending' : 'completed' })}
                  className={`mt-0.5 w-5 h-5 rounded-full border-2 flex items-center justify-center flex-shrink-0 transition-all ${a.status === 'completed' ? 'bg-green-500 border-green-500' : 'border-[var(--border)] hover:border-indigo-500/50'}`}>
                  {a.status === 'completed' && <Check className="w-3 h-3 text-white" />}
                </button>
                <div className="flex-1 min-w-0">
                  <p className={`text-xs font-bold ${a.status === 'completed' ? 'line-through text-[var(--text-secondary)]' : 'text-[var(--text-primary)]'}`}>{a.name}</p>
                  <div className="flex items-center gap-1.5 mt-1.5 flex-wrap">
                    {a.subject && (
                      <span className="flex items-center gap-1 text-[9px] font-bold px-1.5 py-0.5 rounded-full" style={{ background: getSubjectColor(a.subject) + '20', color: getSubjectColor(a.subject) }}>
                        <span className="w-1.5 h-1.5 rounded-full" style={{ background: getSubjectColor(a.subject) }} />{getSubjectName(a.subject)}
                      </span>
                    )}
                    <span className={`text-[9px] font-bold px-1.5 py-0.5 rounded-full ${PRIORITY[a.priority]?.bg || ''} ${PRIORITY[a.priority]?.text || ''}`}>{a.priority}</span>
                    <span className={`text-[9px] font-bold px-1.5 py-0.5 rounded-full ${statusColors[a.status] || ''}`}>{STATUS[a.status]}</span>
                    {a.deadline && <span className={`text-[9px] font-bold ${isOverdue ? 'text-red-500' : 'text-[var(--text-secondary)]'}`}>{a.deadline}</span>}
                  </div>
                  {a.notes && <p className="text-[10px] text-[var(--text-secondary)] mt-1 truncate">{a.notes}</p>}
                </div>
                <div className="flex gap-1 flex-shrink-0">
                  <button onClick={() => openEdit(a)} className="p-1 rounded hover:bg-[var(--bg-secondary)] text-[var(--text-secondary)]"><Edit2 className="w-3 h-3" /></button>
                  <button onClick={() => deleteAssignment(a.id)} className="p-1 rounded hover:bg-red-500/10 text-[var(--text-secondary)] hover:text-red-500"><Trash2 className="w-3 h-3" /></button>
                </div>
              </motion.div>
            );
          })}
        </AnimatePresence>
      </div>

      {/* Form Modal */}
      <AnimatePresence>
        {showForm && (
          <div className="fixed inset-0 z-[9998] flex items-center justify-center p-4">
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setShowForm(false)} />
            <motion.div initial={{ opacity: 0, scale: 0.95, y: 10 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.95, y: 10 }}
              className="relative w-full max-w-md glass-panel rounded-2xl border border-[var(--border)] shadow-2xl p-6 space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-bold text-[var(--text-primary)]">{editId ? 'Edit' : 'New'} Assignment</h3>
                <button onClick={() => setShowForm(false)}><X className="w-4 h-4 text-[var(--text-secondary)]" /></button>
              </div>
              <form onSubmit={handleSave} className="space-y-3">
                <div className="space-y-1">
                  <label className="text-[10px] font-bold uppercase tracking-wider text-[var(--text-secondary)]">Assignment Name</label>
                  <input required value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))} className={inputCls} placeholder="e.g. Data Structures Lab" />
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-1">
                    <label className="text-[10px] font-bold uppercase tracking-wider text-[var(--text-secondary)]">Subject</label>
                    <select value={form.subject} onChange={e => setForm(f => ({ ...f, subject: e.target.value }))} className={selectCls}>
                      <option value="">None</option>
                      {subjects.map(s => <option key={s.id} value={s.id}>{s.name}</option>)}
                    </select>
                  </div>
                  <div className="space-y-1">
                    <label className="text-[10px] font-bold uppercase tracking-wider text-[var(--text-secondary)]">Priority</label>
                    <select value={form.priority} onChange={e => setForm(f => ({ ...f, priority: e.target.value }))} className={selectCls}>
                      {Object.entries(PRIORITY).map(([k, v]) => <option key={k} value={k}>{v.label}</option>)}
                    </select>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-1">
                    <label className="text-[10px] font-bold uppercase tracking-wider text-[var(--text-secondary)]">Deadline</label>
                    <input type="date" value={form.deadline} onChange={e => setForm(f => ({ ...f, deadline: e.target.value }))} className={inputCls} />
                  </div>
                  <div className="space-y-1">
                    <label className="text-[10px] font-bold uppercase tracking-wider text-[var(--text-secondary)]">Status</label>
                    <select value={form.status} onChange={e => setForm(f => ({ ...f, status: e.target.value }))} className={selectCls}>
                      {Object.entries(STATUS).map(([k, v]) => <option key={k} value={k}>{v}</option>)}
                    </select>
                  </div>
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] font-bold uppercase tracking-wider text-[var(--text-secondary)]">Notes</label>
                  <textarea value={form.notes} onChange={e => setForm(f => ({ ...f, notes: e.target.value }))} rows={2} className={inputCls + ' resize-none'} placeholder="Optional notes..." />
                </div>
                <div className="flex gap-2 pt-1">
                  <button type="submit" className="flex-1 py-2.5 rounded-xl bg-gradient-to-r from-indigo-500 to-purple-600 text-white font-bold text-xs">{editId ? 'Save' : 'Add Assignment'}</button>
                  <button type="button" onClick={() => setShowForm(false)} className="px-4 py-2.5 rounded-xl bg-[var(--bg-secondary)] border border-[var(--border)] text-[var(--text-secondary)] font-bold text-xs">Cancel</button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

export default AssignmentTracker;
