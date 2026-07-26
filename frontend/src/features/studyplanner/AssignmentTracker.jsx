import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ClipboardList, Plus, Search, Trash2, Edit2, AlertTriangle, Check } from 'lucide-react';
import { PRIORITY, STATUS } from './useStudyPlanner';
import { Button, EmptyState, Modal, SectionHeader, TextInput, SelectInput, DateInput, TextArea } from '../../components/shared';

const fadeUp = { initial: { opacity: 0, y: 10 }, animate: { opacity: 1, y: 0 }, exit: { opacity: 0, y: -10 } };

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
      <SectionHeader icon={ClipboardList} label="Assignment Tracker">
        <Button variant="accent" size="sm" icon={Plus} onClick={openNew}>Add</Button>
      </SectionHeader>

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

      <div className="flex items-center gap-2 flex-wrap">
        <div className="relative flex-1 min-w-[120px]">
          <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3 h-3 text-[var(--text-secondary)]" />
          <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search..."
            className="w-full pl-8 pr-3 py-2 rounded-xl bg-[var(--bg-secondary)] border border-[var(--border)] text-[10px] font-bold text-[var(--text-primary)] focus:outline-none" />
        </div>
        <SelectInput value={sortBy} onChange={setSortBy} options={[
          { value: 'deadline', label: 'Deadline' }, { value: 'priority', label: 'Priority' }, { value: 'status', label: 'Status' }, { value: 'name', label: 'Name' }
        ]} />
      </div>

      <div className="space-y-2 max-h-[400px] overflow-y-auto pr-1">
        <AnimatePresence>
          {sorted.length === 0 ? (
            <EmptyState icon={ClipboardList} title="No assignments yet" description="Add your first assignment to start tracking."
              action={<Button variant="accent" size="sm" icon={Plus} onClick={openNew}>Add Assignment</Button>} />
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
                  <Button variant="ghost" size="sm" onClick={() => openEdit(a)}><Edit2 className="w-3 h-3" /></Button>
                  <Button variant="ghost" size="sm" onClick={() => deleteAssignment(a.id)} className="hover:!text-red-500 hover:!bg-red-500/10"><Trash2 className="w-3 h-3" /></Button>
                </div>
              </motion.div>
            );
          })}
        </AnimatePresence>
      </div>

      <Modal isOpen={showForm} onClose={() => setShowForm(false)} title={`${editId ? 'Edit' : 'New'} Assignment`} size="md">
        <form onSubmit={handleSave} className="space-y-3">
          <TextInput label="Assignment Name" value={form.name} onChange={v => setForm(f => ({ ...f, name: v }))} placeholder="e.g. Data Structures Lab" />
          <div className="grid grid-cols-2 gap-3">
            <SelectInput label="Subject" value={form.subject} onChange={v => setForm(f => ({ ...f, subject: v }))} options={[{ value: '', label: 'None' }, ...subjects.map(s => ({ value: s.id, label: s.name }))]} />
            <SelectInput label="Priority" value={form.priority} onChange={v => setForm(f => ({ ...f, priority: v }))} options={Object.entries(PRIORITY).map(([k, v]) => ({ value: k, label: v.label }))} />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <DateInput label="Deadline" value={form.deadline} onChange={v => setForm(f => ({ ...f, deadline: v }))} />
            <SelectInput label="Status" value={form.status} onChange={v => setForm(f => ({ ...f, status: v }))} options={Object.entries(STATUS).map(([k, v]) => ({ value: k, label: v }))} />
          </div>
          <TextArea label="Notes" value={form.notes} onChange={v => setForm(f => ({ ...f, notes: v }))} rows={2} placeholder="Optional notes..." />
          <div className="flex gap-2 pt-1">
            <Button type="submit" variant="primary" fullWidth className="!bg-gradient-to-r !from-indigo-500 !to-purple-600">{editId ? 'Save' : 'Add Assignment'}</Button>
            <Button type="button" variant="secondary" onClick={() => setShowForm(false)}>Cancel</Button>
          </div>
        </form>
      </Modal>
    </motion.div>
  );
};

export default AssignmentTracker;
