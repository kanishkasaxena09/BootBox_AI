import React, { useState, useMemo, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ClipboardList, Plus, Search, Trash2, Edit2, Calendar, AlertTriangle,
  Check, X, ChevronLeft, ChevronRight, Bell, BellOff, Paperclip,
  Filter, ArrowUpDown, RotateCcw, BarChart3, Clock, Target, CheckCircle2,
  FileText, ListTodo, Archive
} from 'lucide-react';
import { PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';
import useAssignmentTracker from './useAssignmentTracker';
import { PRIORITY, STATUS, SUBJECTS, daysUntil, isOverdue, getMonthDays, today } from './mockData';

const fadeUp = { initial: { opacity: 0, y: 10 }, animate: { opacity: 1, y: 0 } };
const inputCls = "w-full px-3 py-2.5 rounded-xl text-xs font-bold bg-[var(--bg-secondary)] border border-[var(--border)] text-[var(--text-primary)] focus:outline-none focus:border-indigo-500/30 focus:ring-2 focus:ring-indigo-500/10 transition-all [color-scheme:dark]";
const selectCls = inputCls + " appearance-none";
const RING_RADIUS = 52;
const RING_CIRCUMFERENCE = 2 * Math.PI * RING_RADIUS;
const WEEKDAYS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

const CustomTooltip = ({ active, payload, label }) => {
  if (!active || !payload?.length) return null;
  return (
    <div className="glass-panel border border-[var(--border)] rounded-xl px-3 py-2 text-[10px]">
      <p className="font-bold text-[var(--text-primary)]">{label}</p>
      {payload.map((p, i) => <p key={i} style={{ color: p.fill || p.color }} className="font-bold">{p.name}: {p.value}</p>)}
    </div>
  );
};

const AssignmentTrackerTool = () => {
  const { assignments, addAssignment, updateAssignment, deleteAssignment, toggleStatus, bulkDelete, stats } = useAssignmentTracker();
  const [activeTab, setActiveTab] = useState('dashboard');
  const [showForm, setShowForm] = useState(false);
  const [editId, setEditId] = useState(null);
  const [form, setForm] = useState({ name: '', subject: '', priority: 'medium', deadline: '', status: 'pending', notes: '', attachments: [], reminder: '' });
  const fileInputRef = useRef(null);

  // Filters
  const [search, setSearch] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [filterPriority, setFilterPriority] = useState('all');
  const [filterSubject, setFilterSubject] = useState('all');
  const [sortBy, setSortBy] = useState('deadline');

  // Calendar
  const [calMonth, setCalMonth] = useState(() => new Date().toISOString().slice(0, 7));
  const [calSelectedDate, setCalSelectedDate] = useState(() => today());

  // Filtered + sorted list
  const filtered = useMemo(() => {
    let list = [...assignments].filter(a => a.status !== 'completed');
    if (search) {
      const q = search.toLowerCase();
      list = list.filter(a => a.name.toLowerCase().includes(q) || (SUBJECTS.find(s => s.id === a.subject)?.name || '').toLowerCase().includes(q) || (a.notes || '').toLowerCase().includes(q));
    }
    if (filterStatus !== 'all') list = list.filter(a => a.status === filterStatus);
    if (filterPriority !== 'all') list = list.filter(a => a.priority === filterPriority);
    if (filterSubject !== 'all') list = list.filter(a => a.subject === filterSubject);
    const pOrder = { high: 0, medium: 1, low: 2 };
    const sOrder = { 'in-progress': 0, pending: 1 };
    list.sort((a, b) => {
      if (sortBy === 'deadline') return (a.deadline || 'zzzz').localeCompare(b.deadline || 'zzzz');
      if (sortBy === 'priority') return (pOrder[a.priority] ?? 1) - (pOrder[b.priority] ?? 1);
      if (sortBy === 'status') return (sOrder[a.status] ?? 1) - (sOrder[b.status] ?? 1);
      if (sortBy === 'name') return a.name.localeCompare(b.name);
      if (sortBy === 'created') return (b.createdAt || '').localeCompare(a.createdAt || '');
      return 0;
    });
    return list;
  }, [assignments, search, filterStatus, filterPriority, filterSubject, sortBy]);

  const completedList = useMemo(() =>
    assignments.filter(a => a.status === 'completed').sort((a, b) => (b.completedAt || '').localeCompare(a.completedAt || '')),
  [assignments]);

  // Calendar data
  const calDays = useMemo(() => getMonthDays(calMonth, assignments), [calMonth, assignments]);
  const calSelectedAssignments = useMemo(() => assignments.filter(a => a.deadline === calSelectedDate), [assignments, calSelectedDate]);

  // Charts data
  const pieData = [
    { name: 'High', value: stats.priorityBreakdown.high, color: '#ef4444' },
    { name: 'Medium', value: stats.priorityBreakdown.medium, color: '#f59e0b' },
    { name: 'Low', value: stats.priorityBreakdown.low, color: '#10b981' },
  ].filter(d => d.value > 0);

  const barData = useMemo(() =>
    Object.entries(stats.subjectBreakdown).map(([id, count]) => {
      const s = SUBJECTS.find(sub => sub.id === id);
      return { name: s?.name?.slice(0, 8) || id, count, color: s?.color || '#6366f1' };
    }).sort((a, b) => b.count - a.count),
  [stats.subjectBreakdown]);

  // Form helpers
  const openNew = () => { setForm({ name: '', subject: '', priority: 'medium', deadline: '', status: 'pending', notes: '', attachments: [], reminder: '' }); setEditId(null); setShowForm(true); };
  const openEdit = (a) => { setForm({ name: a.name, subject: a.subject, priority: a.priority, deadline: a.deadline, status: a.status, notes: a.notes, attachments: a.attachments || [], reminder: a.reminder || '' }); setEditId(a.id); setShowForm(true); };
  const handleSave = (e) => { e.preventDefault(); if (!form.name.trim()) return; if (editId) updateAssignment(editId, form); else addAssignment(form); setShowForm(false); };
  const handleAttach = (e) => {
    const files = Array.from(e.target.files || []);
    const newAttachments = files.map(f => ({ name: f.name, size: f.size, type: f.type }));
    setForm(f => ({ ...f, attachments: [...f.attachments, ...newAttachments] }));
    if (fileInputRef.current) fileInputRef.current.value = '';
  };
  const removeAttachment = (idx) => setForm(f => ({ ...f, attachments: f.attachments.filter((_, i) => i !== idx) }));

  const calPrev = () => { const [y, m] = calMonth.split('-').map(Number); setCalMonth(m === 1 ? `${y - 1}-12` : `${y}-${String(m - 1).padStart(2, '0')}`); };
  const calNext = () => { const [y, m] = calMonth.split('-').map(Number); setCalMonth(m === 12 ? `${y + 1}-01` : `${y}-${String(m + 1).padStart(2, '0')}`); };

  const ringOffset = RING_CIRCUMFERENCE - (stats.progress / 100) * RING_CIRCUMFERENCE;

  const tabs = [
    { id: 'dashboard', label: 'Dashboard', icon: BarChart3 },
    { id: 'assignments', label: 'Assignments', icon: ListTodo },
    { id: 'calendar', label: 'Calendar', icon: Calendar },
    { id: 'completed', label: 'Completed', icon: Archive },
  ];

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      {/* Header */}
      <div className="text-center space-y-2">
        <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-gradient-to-br from-purple-500/20 to-pink-500/20 border border-purple-500/30">
          <ClipboardList className="w-7 h-7 text-purple-400" />
        </div>
        <h1 className="text-3xl font-black bg-gradient-to-r from-purple-400 via-pink-400 to-rose-400 bg-clip-text text-transparent">
          Assignment Tracker
        </h1>
        <p className="text-sm text-[var(--text-secondary)] max-w-md mx-auto">
          Track assignments, set reminders, meet deadlines & never miss a submission.
        </p>
      </div>

      {/* Tabs */}
      <div className="flex justify-center">
        <div className="glass-panel rounded-2xl p-1.5 border border-[var(--border)] flex items-center gap-1 w-fit flex-wrap">
          {tabs.map(tab => {
            const Icon = tab.icon;
            return (
              <button key={tab.id} onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                  activeTab === tab.id ? 'bg-purple-500/10 text-purple-500 border border-purple-500/20' : 'text-[var(--text-secondary)] hover:text-[var(--text-primary)] border border-transparent'
                }`}>
                <Icon className="w-3.5 h-3.5" /> {tab.label}
              </button>
            );
          })}
        </div>
      </div>

      <AnimatePresence mode="wait">
        {/* ============ DASHBOARD ============ */}
        {activeTab === 'dashboard' && (
          <motion.div key="dash" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="space-y-5">
            {/* Stat Cards */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              {[
                { icon: ClipboardList, label: 'Total', value: stats.total, color: '#6366f1' },
                { icon: Clock, label: 'Pending', value: stats.pending, color: '#f59e0b' },
                { icon: Target, label: 'In Progress', value: stats.inProgress, color: '#8b5cf6' },
                { icon: CheckCircle2, label: 'Completed', value: stats.completed, color: '#10b981' },
              ].map((c, i) => {
                const Icon = c.icon;
                return (
                  <motion.div key={c.label} {...fadeUp} transition={{ delay: i * 0.05 }}
                    className="glass-panel border border-[var(--border)] rounded-2xl p-4 space-y-2">
                    <div className="flex items-center justify-between">
                      <div className="p-2 rounded-xl" style={{ background: c.color + '15' }}><Icon className="w-4 h-4" style={{ color: c.color }} /></div>
                    </div>
                    <p className="text-2xl font-black text-[var(--text-primary)]">{c.value}</p>
                    <p className="text-[10px] font-bold uppercase tracking-wider text-[var(--text-secondary)]">{c.label}</p>
                  </motion.div>
                );
              })}
            </div>

            {/* Overdue + Due Soon Warnings */}
            {(stats.overdue > 0 || stats.dueSoon > 0) && (
              <div className="flex gap-3 flex-wrap">
                {stats.overdue > 0 && (
                  <div className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-red-500/5 border border-red-500/20">
                    <AlertTriangle className="w-4 h-4 text-red-500" />
                    <span className="text-xs font-bold text-red-500">{stats.overdue} overdue assignment{stats.overdue !== 1 ? 's' : ''}</span>
                  </div>
                )}
                {stats.dueSoon > 0 && (
                  <div className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-amber-500/5 border border-amber-500/20">
                    <Clock className="w-4 h-4 text-amber-500" />
                    <span className="text-xs font-bold text-amber-500">{stats.dueSoon} due within 3 days</span>
                  </div>
                )}
              </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
              {/* Progress Ring */}
              <div className="glass-panel border border-[var(--border)] rounded-2xl p-6 flex flex-col items-center space-y-3">
                <h4 className="text-[10px] font-bold uppercase tracking-wider text-[var(--text-secondary)]">Overall Progress</h4>
                <div className="relative">
                  <svg className="w-32 h-32 -rotate-90" viewBox="0 0 120 120">
                    <circle cx="60" cy="60" r={RING_RADIUS} fill="none" stroke="var(--border)" strokeWidth="8" />
                    <circle cx="60" cy="60" r={RING_RADIUS} fill="none" stroke="#10b981" strokeWidth="8"
                      strokeLinecap="round" strokeDasharray={RING_CIRCUMFERENCE}
                      strokeDashoffset={ringOffset} style={{ transition: 'stroke-dashoffset 1s ease-out' }} />
                  </svg>
                  <div className="absolute inset-0 flex flex-col items-center justify-center">
                    <span className="text-2xl font-black text-[var(--text-primary)]">{stats.progress}%</span>
                    <span className="text-[9px] font-bold text-[var(--text-secondary)]">{stats.completed}/{stats.total}</span>
                  </div>
                </div>
              </div>

              {/* Priority Pie */}
              <div className="glass-panel border border-[var(--border)] rounded-2xl p-6 space-y-3">
                <h4 className="text-[10px] font-bold uppercase tracking-wider text-[var(--text-secondary)]">Priority Distribution</h4>
                {pieData.length > 0 ? (
                  <div className="h-[140px]">
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie data={pieData} dataKey="value" nameKey="name" cx="50%" cy="50%" innerRadius={35} outerRadius={55} paddingAngle={3}>
                          {pieData.map((d, i) => <Cell key={i} fill={d.color} />)}
                        </Pie>
                        <Tooltip content={<CustomTooltip />} />
                      </PieChart>
                    </ResponsiveContainer>
                  </div>
                ) : <p className="text-[10px] text-[var(--text-secondary)] text-center py-8">No pending assignments</p>}
                <div className="flex justify-center gap-3">
                  {pieData.map(d => (
                    <div key={d.name} className="flex items-center gap-1">
                      <div className="w-2 h-2 rounded-full" style={{ background: d.color }} />
                      <span className="text-[9px] font-bold text-[var(--text-secondary)]">{d.name} ({d.value})</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Subject Bar */}
              <div className="glass-panel border border-[var(--border)] rounded-2xl p-6 space-y-3">
                <h4 className="text-[10px] font-bold uppercase tracking-wider text-[var(--text-secondary)]">By Subject</h4>
                {barData.length > 0 ? (
                  <div className="h-[140px]">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={barData} layout="vertical">
                        <XAxis type="number" tick={{ fontSize: 10, fill: 'var(--text-secondary)' }} axisLine={false} tickLine={false} />
                        <YAxis type="category" dataKey="name" tick={{ fontSize: 10, fill: 'var(--text-secondary)' }} axisLine={false} tickLine={false} width={65} />
                        <Tooltip content={<CustomTooltip />} />
                        <Bar dataKey="count" name="assignments" radius={[0, 6, 6, 0]} maxBarSize={18}>
                          {barData.map((d, i) => <Cell key={i} fill={d.color} />)}
                        </Bar>
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                ) : <p className="text-[10px] text-[var(--text-secondary)] text-center py-8">No data</p>}
              </div>
            </div>

            {/* Upcoming Deadlines */}
            {stats.upcoming.length > 0 && (
              <div className="glass-panel border border-[var(--border)] rounded-2xl p-6 space-y-3">
                <h4 className="text-[10px] font-bold uppercase tracking-wider text-[var(--text-secondary)]">Upcoming Deadlines</h4>
                <div className="space-y-2">
                  {stats.upcoming.map(a => {
                    const days = daysUntil(a.deadline);
                    const subject = SUBJECTS.find(s => s.id === a.subject);
                    return (
                      <div key={a.id} className="flex items-center gap-3 p-3 rounded-xl bg-[var(--bg-secondary)]/50 border border-[var(--border)]">
                        <div className="w-2 h-2 rounded-full flex-shrink-0" style={{ background: PRIORITY[a.priority]?.color }} />
                        <div className="flex-1 min-w-0">
                          <p className="text-xs font-bold text-[var(--text-primary)] truncate">{a.name}</p>
                          <div className="flex items-center gap-2 mt-1">
                            {subject && <span className="text-[9px] font-bold" style={{ color: subject.color }}>{subject.name}</span>}
                            <span className="text-[9px] font-bold text-[var(--text-secondary)]">{a.deadline}</span>
                          </div>
                        </div>
                        <span className={`text-[10px] font-bold px-2 py-1 rounded-full ${days <= 1 ? 'bg-red-500/10 text-red-500' : days <= 3 ? 'bg-amber-500/10 text-amber-500' : 'bg-green-500/10 text-green-500'}`}>
                          {days === 0 ? 'Today' : days === 1 ? 'Tomorrow' : `${days}d`}
                        </span>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}
          </motion.div>
        )}

        {/* ============ ASSIGNMENTS ============ */}
        {activeTab === 'assignments' && (
          <motion.div key="list" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="space-y-4">
            {/* Toolbar */}
            <div className="flex items-center gap-2 flex-wrap">
              <div className="relative flex-1 min-w-[180px]">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-[var(--text-secondary)]" />
                <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search assignments..."
                  className="w-full pl-9 pr-3 py-2.5 rounded-xl bg-[var(--bg-secondary)] border border-[var(--border)] text-xs font-bold text-[var(--text-primary)] focus:outline-none focus:border-purple-500/30" />
              </div>
              <select value={filterStatus} onChange={e => setFilterStatus(e.target.value)}
                className="px-3 py-2.5 rounded-xl bg-[var(--bg-secondary)] border border-[var(--border)] text-[10px] font-bold text-[var(--text-secondary)] appearance-none focus:outline-none">
                <option value="all">All Status</option>
                {Object.entries(STATUS).filter(([k]) => k !== 'completed').map(([k, v]) => <option key={k} value={k}>{v.label}</option>)}
              </select>
              <select value={filterPriority} onChange={e => setFilterPriority(e.target.value)}
                className="px-3 py-2.5 rounded-xl bg-[var(--bg-secondary)] border border-[var(--border)] text-[10px] font-bold text-[var(--text-secondary)] appearance-none focus:outline-none">
                <option value="all">All Priority</option>
                {Object.entries(PRIORITY).map(([k, v]) => <option key={k} value={k}>{v.label}</option>)}
              </select>
              <select value={filterSubject} onChange={e => setFilterSubject(e.target.value)}
                className="px-3 py-2.5 rounded-xl bg-[var(--bg-secondary)] border border-[var(--border)] text-[10px] font-bold text-[var(--text-secondary)] appearance-none focus:outline-none">
                <option value="all">All Subjects</option>
                {SUBJECTS.map(s => <option key={s.id} value={s.id}>{s.name}</option>)}
              </select>
              <select value={sortBy} onChange={e => setSortBy(e.target.value)}
                className="px-3 py-2.5 rounded-xl bg-[var(--bg-secondary)] border border-[var(--border)] text-[10px] font-bold text-[var(--text-secondary)] appearance-none focus:outline-none">
                <option value="deadline">Sort: Deadline</option>
                <option value="priority">Sort: Priority</option>
                <option value="status">Sort: Status</option>
                <option value="name">Sort: Name</option>
                <option value="created">Sort: Newest</option>
              </select>
              <button onClick={openNew}
                className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-gradient-to-r from-purple-500 to-pink-600 text-white font-bold text-xs shadow-lg shadow-purple-500/20 flex-shrink-0">
                <Plus className="w-3.5 h-3.5" /> Add
              </button>
            </div>

            {/* List */}
            <div className="space-y-2">
              {filtered.length === 0 ? (
                <div className="glass-panel rounded-2xl p-12 border border-[var(--border)] flex flex-col items-center justify-center text-center space-y-3 min-h-[300px]">
                  <ClipboardList className="w-10 h-10 text-[var(--text-secondary)] opacity-20" />
                  <p className="text-sm font-bold text-[var(--text-secondary)]">No assignments found</p>
                  <button onClick={openNew} className="text-xs font-bold text-purple-500">+ Add Assignment</button>
                </div>
              ) : (
                <AnimatePresence>
                  {filtered.map(a => {
                    const overdue = isOverdue(a);
                    const days = daysUntil(a.deadline);
                    const subject = SUBJECTS.find(s => s.id === a.subject);
                    const hasReminder = a.reminder && new Date(a.reminder) > new Date();
                    return (
                      <motion.div key={a.id} layout initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, x: -20 }}
                        className={`glass-panel border rounded-2xl p-4 transition-all ${
                          overdue ? 'border-red-500/20 bg-red-500/5' : 'border-[var(--border)] bg-[var(--bg-secondary)]/30'
                        }`}>
                        <div className="flex items-start gap-3">
                          <button onClick={() => toggleStatus(a.id)}
                            className={`mt-0.5 w-5 h-5 rounded-full border-2 flex items-center justify-center flex-shrink-0 transition-all ${
                              a.status === 'completed' ? 'bg-green-500 border-green-500' : 'border-[var(--border)] hover:border-purple-500/50'
                            }`}>
                            {a.status === 'completed' && <Check className="w-3 h-3 text-white" />}
                          </button>
                          <div className="flex-1 min-w-0 space-y-1.5">
                            <div className="flex items-center gap-2 flex-wrap">
                              <p className={`text-xs font-bold ${a.status === 'completed' ? 'line-through text-[var(--text-secondary)]' : 'text-[var(--text-primary)]'}`}>{a.name}</p>
                              {a.status === 'in-progress' && <span className="px-1.5 py-0.5 rounded-full bg-indigo-500/10 text-indigo-500 text-[8px] font-bold">IN PROGRESS</span>}
                            </div>
                            <div className="flex items-center gap-1.5 flex-wrap">
                              {subject && (
                                <span className="flex items-center gap-1 text-[9px] font-bold px-1.5 py-0.5 rounded-full" style={{ background: subject.color + '20', color: subject.color }}>
                                  <span className="w-1.5 h-1.5 rounded-full" style={{ background: subject.color }} />{subject.name}
                                </span>
                              )}
                              <span className={`text-[9px] font-bold px-1.5 py-0.5 rounded-full ${PRIORITY[a.priority]?.bg} ${PRIORITY[a.priority]?.text}`}>{PRIORITY[a.priority]?.label}</span>
                              <span className={`text-[9px] font-bold px-1.5 py-0.5 rounded-full ${STATUS[a.status]?.bg} ${STATUS[a.status]?.text}`}>{STATUS[a.status]?.label}</span>
                              {a.deadline && (
                                <span className={`text-[9px] font-bold ${overdue ? 'text-red-500' : days !== null && days <= 3 ? 'text-amber-500' : 'text-[var(--text-secondary)]'}`}>
                                  {a.deadline}{days !== null ? (days === 0 ? ' (Today)' : days === 1 ? ' (Tomorrow)' : ` (${days}d)`) : ''}
                                </span>
                              )}
                              {hasReminder && <Bell className="w-3 h-3 text-purple-500" />}
                              {a.attachments?.length > 0 && (
                                <span className="flex items-center gap-0.5 text-[9px] font-bold text-[var(--text-secondary)]">
                                  <Paperclip className="w-2.5 h-2.5" />{a.attachments.length}
                                </span>
                              )}
                            </div>
                            {a.notes && <p className="text-[10px] text-[var(--text-secondary)] truncate">{a.notes}</p>}
                          </div>
                          <div className="flex gap-1 flex-shrink-0">
                            <button onClick={() => openEdit(a)} className="p-1.5 rounded-lg hover:bg-purple-500/10 text-[var(--text-secondary)] hover:text-purple-500 transition-all"><Edit2 className="w-3 h-3" /></button>
                            <button onClick={() => deleteAssignment(a.id)} className="p-1.5 rounded-lg hover:bg-red-500/10 text-[var(--text-secondary)] hover:text-red-500 transition-all"><Trash2 className="w-3 h-3" /></button>
                          </div>
                        </div>
                      </motion.div>
                    );
                  })}
                </AnimatePresence>
              )}
            </div>
          </motion.div>
        )}

        {/* ============ CALENDAR ============ */}
        {activeTab === 'calendar' && (
          <motion.div key="cal" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
            className="grid grid-cols-1 lg:grid-cols-3 gap-5">
            <div className="lg:col-span-2 glass-panel border border-[var(--border)] rounded-2xl p-6 space-y-4">
              {/* Cal Header */}
              <div className="flex items-center justify-between">
                <button onClick={calPrev} className="p-2 rounded-xl bg-[var(--bg-secondary)] border border-[var(--border)]"><ChevronLeft className="w-4 h-4 text-[var(--text-secondary)]" /></button>
                <h3 className="text-sm font-bold text-[var(--text-primary)]">{new Date(calMonth + '-15').toLocaleDateString('en', { month: 'long', year: 'numeric' })}</h3>
                <div className="flex gap-1.5">
                  <button onClick={() => { setCalMonth(new Date().toISOString().slice(0, 7)); setCalSelectedDate(today()); }}
                    className="px-3 py-1.5 rounded-lg text-[10px] font-bold bg-purple-500/10 text-purple-500 border border-purple-500/20">Today</button>
                  <button onClick={calNext} className="p-2 rounded-xl bg-[var(--bg-secondary)] border border-[var(--border)]"><ChevronRight className="w-4 h-4 text-[var(--text-secondary)]" /></button>
                </div>
              </div>
              {/* Grid */}
              <div className="grid grid-cols-7 gap-1">
                {WEEKDAYS.map(d => <div key={d} className="text-center text-[9px] font-bold text-[var(--text-secondary)] py-1">{d}</div>)}
                {calDays.map((cell, i) => {
                  if (!cell) return <div key={`e-${i}`} />;
                  const isSelected = cell.date === calSelectedDate;
                  const count = cell.assignments.length;
                  return (
                    <button key={cell.date} onClick={() => setCalSelectedDate(cell.date)}
                      className={`relative p-1.5 rounded-lg min-h-[52px] text-left transition-all border ${
                        isSelected ? 'border-purple-500/30 bg-purple-500/10' : cell.isToday ? 'border-purple-500/20 bg-purple-500/5' : 'border-transparent hover:border-[var(--border)]'
                      }`}>
                      <span className={`text-[10px] font-bold ${cell.isToday ? 'text-purple-500' : 'text-[var(--text-primary)]'}`}>{cell.day}</span>
                      {count > 0 && (
                        <div className="flex gap-0.5 mt-0.5 flex-wrap">
                          {cell.assignments.slice(0, 3).map(a => (
                            <div key={a.id} className="w-1.5 h-1.5 rounded-full" style={{ background: PRIORITY[a.priority]?.color }} />
                          ))}
                          {count > 3 && <span className="text-[7px] font-bold text-[var(--text-secondary)]">+{count - 3}</span>}
                        </div>
                      )}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Selected Day */}
            <div className="glass-panel border border-[var(--border)] rounded-2xl p-6 space-y-3">
              <h4 className="text-xs font-bold text-[var(--text-primary)]">
                {new Date(calSelectedDate + 'T00:00:00').toLocaleDateString('en', { weekday: 'long', month: 'short', day: 'numeric' })}
              </h4>
              {calSelectedAssignments.length === 0 ? (
                <p className="text-[10px] text-[var(--text-secondary)] text-center py-6">No assignments due</p>
              ) : (
                <div className="space-y-2">
                  {calSelectedAssignments.map(a => {
                    const subject = SUBJECTS.find(s => s.id === a.subject);
                    return (
                      <div key={a.id} className="p-3 rounded-xl bg-[var(--bg-secondary)]/50 border border-[var(--border)] space-y-1.5">
                        <div className="flex items-center gap-2">
                          <div className="w-2 h-2 rounded-full" style={{ background: PRIORITY[a.priority]?.color }} />
                          <span className="text-xs font-bold text-[var(--text-primary)]">{a.name}</span>
                        </div>
                        <div className="flex items-center gap-1.5">
                          {subject && <span className="text-[9px] font-bold" style={{ color: subject.color }}>{subject.name}</span>}
                          <span className={`text-[9px] font-bold px-1.5 py-0.5 rounded-full ${PRIORITY[a.priority]?.bg} ${PRIORITY[a.priority]?.text}`}>{PRIORITY[a.priority]?.label}</span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          </motion.div>
        )}

        {/* ============ COMPLETED ============ */}
        {activeTab === 'completed' && (
          <motion.div key="done" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="max-w-3xl mx-auto space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-bold text-[var(--text-primary)]">Completed Assignments ({completedList.length})</h3>
            </div>
            {completedList.length === 0 ? (
              <div className="glass-panel rounded-2xl p-12 border border-[var(--border)] flex flex-col items-center justify-center text-center space-y-3 min-h-[300px]">
                <Archive className="w-10 h-10 text-[var(--text-secondary)] opacity-20" />
                <p className="text-sm font-bold text-[var(--text-secondary)]">No completed assignments</p>
                <p className="text-xs text-[var(--text-secondary)] opacity-60">Completed tasks will appear here</p>
              </div>
            ) : (
              <div className="space-y-2">
                {completedList.map(a => {
                  const subject = SUBJECTS.find(s => s.id === a.subject);
                  return (
                    <motion.div key={a.id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
                      className="glass-panel border border-[var(--border)] rounded-xl p-4 flex items-center gap-3 opacity-70">
                      <div className="w-5 h-5 rounded-full bg-green-500 flex items-center justify-center flex-shrink-0"><Check className="w-3 h-3 text-white" /></div>
                      <div className="flex-1 min-w-0">
                        <p className="text-xs font-bold text-[var(--text-secondary)] line-through">{a.name}</p>
                        <div className="flex items-center gap-2 mt-1">
                          {subject && <span className="text-[9px] font-bold" style={{ color: subject.color }}>{subject.name}</span>}
                          {a.completedAt && <span className="text-[9px] font-bold text-[var(--text-secondary)]">Done {new Date(a.completedAt).toLocaleDateString('en', { month: 'short', day: 'numeric' })}</span>}
                        </div>
                      </div>
                      <div className="flex gap-1">
                        <button onClick={() => toggleStatus(a.id)} title="Restore"
                          className="p-1.5 rounded-lg hover:bg-purple-500/10 text-[var(--text-secondary)] hover:text-purple-500 transition-all"><RotateCcw className="w-3 h-3" /></button>
                        <button onClick={() => deleteAssignment(a.id)} className="p-1.5 rounded-lg hover:bg-red-500/10 text-[var(--text-secondary)] hover:text-red-500 transition-all"><Trash2 className="w-3 h-3" /></button>
                      </div>
                    </motion.div>
                  );
                })}
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>

      {/* ============ ADD/EDIT MODAL ============ */}
      <AnimatePresence>
        {showForm && (
          <div className="fixed inset-0 z-[9998] flex items-center justify-center p-4">
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setShowForm(false)} />
            <motion.div initial={{ opacity: 0, scale: 0.95, y: 10 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.95, y: 10 }}
              className="relative w-full max-w-lg glass-panel rounded-2xl border border-[var(--border)] shadow-2xl max-h-[85vh] overflow-y-auto">
              <div className="sticky top-0 z-10 flex items-center justify-between px-6 py-4 border-b border-[var(--border)] bg-[var(--bg-primary)]/80 backdrop-blur-xl rounded-t-2xl">
                <h3 className="text-sm font-bold text-[var(--text-primary)]">{editId ? 'Edit' : 'New'} Assignment</h3>
                <button onClick={() => setShowForm(false)} className="p-1 rounded-lg hover:bg-[var(--bg-secondary)]"><X className="w-4 h-4 text-[var(--text-secondary)]" /></button>
              </div>
              <form onSubmit={handleSave} className="p-6 space-y-4">
                <div className="space-y-1">
                  <label className="text-[10px] font-bold uppercase tracking-wider text-[var(--text-secondary)]">Assignment Name *</label>
                  <input required value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))} className={inputCls} placeholder="e.g. Data Structures Lab Report" />
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-1">
                    <label className="text-[10px] font-bold uppercase tracking-wider text-[var(--text-secondary)]">Subject</label>
                    <select value={form.subject} onChange={e => setForm(f => ({ ...f, subject: e.target.value }))} className={selectCls}>
                      <option value="">None</option>
                      {SUBJECTS.map(s => <option key={s.id} value={s.id}>{s.name}</option>)}
                    </select>
                  </div>
                  <div className="space-y-1">
                    <label className="text-[10px] font-bold uppercase tracking-wider text-[var(--text-secondary)]">Deadline</label>
                    <input type="date" value={form.deadline} onChange={e => setForm(f => ({ ...f, deadline: e.target.value }))} className={inputCls} />
                  </div>
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] font-bold uppercase tracking-wider text-[var(--text-secondary)]">Priority</label>
                  <div className="flex gap-2">
                    {Object.entries(PRIORITY).map(([k, v]) => (
                      <button key={k} type="button" onClick={() => setForm(f => ({ ...f, priority: k }))}
                        className={`flex-1 py-2 rounded-xl text-[10px] font-bold border transition-all ${
                          form.priority === k ? `${v.bg} ${v.text} ${v.border}` : 'bg-[var(--bg-secondary)] border-[var(--border)] text-[var(--text-secondary)]'
                        }`}>{v.label}</button>
                    ))}
                  </div>
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] font-bold uppercase tracking-wider text-[var(--text-secondary)]">Status</label>
                  <div className="flex gap-2">
                    {Object.entries(STATUS).map(([k, v]) => (
                      <button key={k} type="button" onClick={() => setForm(f => ({ ...f, status: k }))}
                        className={`flex-1 py-2 rounded-xl text-[10px] font-bold border transition-all ${
                          form.status === k ? `${v.bg} ${v.text} border-current/20` : 'bg-[var(--bg-secondary)] border-[var(--border)] text-[var(--text-secondary)]'
                        }`}>{v.label}</button>
                    ))}
                  </div>
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] font-bold uppercase tracking-wider text-[var(--text-secondary)]">Reminder</label>
                  <input type="datetime-local" value={form.reminder} onChange={e => setForm(f => ({ ...f, reminder: e.target.value }))} className={inputCls} />
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] font-bold uppercase tracking-wider text-[var(--text-secondary)]">Notes</label>
                  <textarea value={form.notes} onChange={e => setForm(f => ({ ...f, notes: e.target.value }))} rows={3} className={inputCls + ' resize-none'} placeholder="Additional notes..." />
                </div>
                {/* Attachments */}
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <label className="text-[10px] font-bold uppercase tracking-wider text-[var(--text-secondary)]">Attachments</label>
                    <button type="button" onClick={() => fileInputRef.current?.click()}
                      className="text-[10px] font-bold text-purple-500 flex items-center gap-1"><Paperclip className="w-3 h-3" /> Add File</button>
                    <input ref={fileInputRef} type="file" multiple className="hidden" onChange={handleAttach} />
                  </div>
                  {form.attachments.length > 0 && (
                    <div className="space-y-1.5">
                      {form.attachments.map((att, idx) => (
                        <div key={idx} className="flex items-center gap-2 p-2 rounded-lg bg-[var(--bg-secondary)]/50 border border-[var(--border)]">
                          <FileText className="w-3 h-3 text-[var(--text-secondary)] flex-shrink-0" />
                          <span className="text-[10px] font-bold text-[var(--text-primary)] flex-1 truncate">{att.name}</span>
                          <span className="text-[9px] text-[var(--text-secondary)]">{(att.size / 1024).toFixed(1)}KB</span>
                          <button type="button" onClick={() => removeAttachment(idx)} className="p-0.5 rounded hover:bg-red-500/10 text-[var(--text-secondary)] hover:text-red-500"><X className="w-2.5 h-2.5" /></button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
                <div className="flex gap-2 pt-2">
                  <button type="submit" className="flex-1 py-2.5 rounded-xl bg-gradient-to-r from-purple-500 to-pink-600 text-white font-bold text-xs shadow-lg shadow-purple-500/20">
                    {editId ? 'Save Changes' : 'Add Assignment'}
                  </button>
                  <button type="button" onClick={() => setShowForm(false)} className="px-4 py-2.5 rounded-xl bg-[var(--bg-secondary)] border border-[var(--border)] text-[var(--text-secondary)] font-bold text-xs">Cancel</button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default AssignmentTrackerTool;
