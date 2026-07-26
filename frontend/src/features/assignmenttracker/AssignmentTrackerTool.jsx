import React, { useState, useMemo, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ClipboardList, Plus, Search, Trash2, Check, Clock, AlertTriangle,
  Calendar, BarChart3, Filter, ChevronLeft, ChevronRight, X, Edit2, Bell, Paperclip, History
} from 'lucide-react';
import { PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';
import useAssignmentTracker from './useAssignmentTracker';
import { PRIORITY, STATUS, SUBJECTS, daysUntil, getMonthDays } from './mockData';
import { Tabs, StatCard, EmptyState, Button, Modal, ToolLayout, ErrorBoundary } from '../../components/shared';

const fadeUp = { initial: { opacity: 0, y: 10 }, animate: { opacity: 1, y: 0 } };

const AssignmentTrackerTool = () => {
  const {
    assignments, addAssignment, updateAssignment, deleteAssignment, toggleStatus, stats,
  } = useAssignmentTracker();

  const [activeTab, setActiveTab] = useState('dashboard');
  const [search, setSearch] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [filterPriority, setFilterPriority] = useState('all');
  const [filterSubject, setFilterSubject] = useState('all');
  const [sortBy, setSortBy] = useState('deadline');
  const [showForm, setShowForm] = useState(false);
  const [editItem, setEditItem] = useState(null);
  const [calMonth, setCalMonth] = useState(new Date().getMonth());
  const [calYear, setCalYear] = useState(new Date().getFullYear());
  const [selectedCalDay, setSelectedCalDay] = useState(null);

  const [form, setForm] = useState({ title: '', subject: 'Math', priority: 'medium', deadline: '', notes: '', status: 'pending' });

  const openAdd = () => { setEditItem(null); setForm({ title: '', subject: 'Math', priority: 'medium', deadline: '', notes: '', status: 'pending' }); setShowForm(true); };
  const openEdit = (item) => { setEditItem(item); setForm({ title: item.title, subject: item.subject, priority: item.priority, deadline: item.deadline, notes: item.notes || '', status: item.status }); setShowForm(true); };

  const handleSubmit = () => {
    if (!form.title.trim()) return;
    if (editItem) { updateAssignment(editItem.id, form); }
    else { addAssignment(form); }
    setShowForm(false);
  };

  const filtered = useMemo(() => {
    let list = [...assignments];
    if (search) list = list.filter(a => a.title.toLowerCase().includes(search.toLowerCase()));
    if (filterStatus !== 'all') list = list.filter(a => a.status === filterStatus);
    if (filterPriority !== 'all') list = list.filter(a => a.priority === filterPriority);
    if (filterSubject !== 'all') list = list.filter(a => a.subject === filterSubject);
    if (sortBy === 'deadline') list.sort((a, b) => new Date(a.deadline) - new Date(b.deadline));
    else if (sortBy === 'priority') { const order = { high: 0, medium: 1, low: 2 }; list.sort((a, b) => order[a.priority] - order[b.priority]); }
    else if (sortBy === 'title') list.sort((a, b) => a.title.localeCompare(b.title));
    return list;
  }, [assignments, search, filterStatus, filterPriority, filterSubject, sortBy]);

  const calDays = useMemo(() => getMonthDays(calYear, calMonth, assignments), [calYear, calMonth, assignments]);
  const calMonthLabel = new Date(calYear, calMonth).toLocaleString('default', { month: 'long', year: 'numeric' });

  const tabs = [
    { id: 'dashboard', label: 'Dashboard', icon: BarChart3 },
    { id: 'assignments', label: 'Assignments', icon: ClipboardList },
    { id: 'calendar', label: 'Calendar', icon: Calendar },
    { id: 'completed', label: 'Completed', icon: Check },
  ];

  const PIE_COLORS = ['#ef4444', '#f59e0b', '#10b981'];
  const priorityData = [
    { name: 'High', value: stats.priorityBreakdown.high },
    { name: 'Medium', value: stats.priorityBreakdown.medium },
    { name: 'Low', value: stats.priorityBreakdown.low },
  ].filter(d => d.value > 0);

  return (
    <ErrorBoundary>
      <ToolLayout icon={ClipboardList} title="Assignment Tracker" subtitle="Track deadlines, manage priorities & stay on top of your work" accentColor="#f97316">
        <div className="space-y-5">
          <div className="flex items-center justify-between flex-wrap gap-3">
            <Tabs tabs={tabs} active={activeTab} onChange={setActiveTab} />
            <Button variant="primary" size="sm" icon={Plus} onClick={openAdd}>Add Assignment</Button>
          </div>

          <AnimatePresence mode="wait">
            {/* ============ DASHBOARD ============ */}
            {activeTab === 'dashboard' && (
              <motion.div key="dash" {...fadeUp} className="space-y-4">
                {stats.overdue > 0 && (
                  <div className="glass-panel rounded-xl p-3 border border-red-500/20 bg-red-500/5 flex items-center gap-2">
                    <AlertTriangle className="w-4 h-4 text-red-500" />
                    <span className="text-xs font-bold text-red-500">{stats.overdue} overdue assignment{stats.overdue > 1 ? 's' : ''}</span>
                  </div>
                )}

                <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                  <StatCard icon={ClipboardList} label="Total" value={stats.total} color="#6366f1" />
                  <StatCard icon={Clock} label="Pending" value={stats.pending} color="#f59e0b" />
                  <StatCard icon={AlertTriangle} label="In Progress" value={stats.inProgress} color="#8b5cf6" />
                  <StatCard icon={Check} label="Completed" value={stats.completed} color="#10b981" />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* Progress Ring */}
                  <div className="glass-panel rounded-2xl p-5 border border-[var(--border)] flex items-center gap-5">
                    <div className="relative" style={{ width: 100, height: 100 }}>
                      <svg width={100} height={100} className="-rotate-90">
                        <circle cx={50} cy={50} r={42} fill="none" stroke="var(--border)" strokeWidth={7} />
                        <motion.circle cx={50} cy={50} r={42} fill="none" stroke="#10b981" strokeWidth={7}
                          strokeLinecap="round" strokeDasharray={2 * Math.PI * 42}
                          initial={{ strokeDashoffset: 2 * Math.PI * 42 }}
                          animate={{ strokeDashoffset: 2 * Math.PI * 42 * (1 - stats.progress / 100) }}
                          transition={{ duration: 1 }} />
                      </svg>
                      <div className="absolute inset-0 flex items-center justify-center">
                        <span className="text-lg font-black text-green-500">{stats.progress}%</span>
                      </div>
                    </div>
                    <div>
                      <p className="text-sm font-bold text-[var(--text-primary)]">Completion Progress</p>
                      <p className="text-[10px] text-[var(--text-secondary)]">{stats.completed} of {stats.total} assignments done</p>
                    </div>
                  </div>

                  {/* Priority Pie */}
                  <div className="glass-panel rounded-2xl p-5 border border-[var(--border)]">
                    <h4 className="text-[10px] font-bold uppercase tracking-wider text-[var(--text-secondary)] mb-3">By Priority</h4>
                    {priorityData.length > 0 ? (
                      <ResponsiveContainer width="100%" height={140}>
                        <PieChart>
                          <Pie data={priorityData} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={50} innerRadius={25}>
                            {priorityData.map((_, i) => <Cell key={i} fill={PIE_COLORS[i]} />)}
                          </Pie>
                          <Tooltip contentStyle={{ background: 'var(--bg-primary)', border: '1px solid var(--border)', borderRadius: 12, fontSize: 11 }} />
                        </PieChart>
                      </ResponsiveContainer>
                    ) : (
                      <p className="text-xs text-[var(--text-secondary)] text-center py-4">No data</p>
                    )}
                  </div>
                </div>

                {/* Subject Bar Chart */}
                {Object.keys(stats.subjectBreakdown).length > 0 && (
                  <div className="glass-panel rounded-2xl p-5 border border-[var(--border)] space-y-3">
                    <h4 className="text-[10px] font-bold uppercase tracking-wider text-[var(--text-secondary)]">By Subject</h4>
                    <ResponsiveContainer width="100%" height={Math.max(100, Object.keys(stats.subjectBreakdown).length * 35)}>
                      <BarChart data={Object.entries(stats.subjectBreakdown).map(([name, count]) => ({ name, count }))} layout="vertical" margin={{ left: 10 }}>
                        <XAxis type="number" hide />
                        <YAxis type="category" dataKey="name" width={80} tick={{ fontSize: 10, fill: 'var(--text-secondary)' }} />
                        <Bar dataKey="count" fill="var(--accent)" radius={[0, 6, 6, 0]} barSize={16} />
                        <Tooltip contentStyle={{ background: 'var(--bg-primary)', border: '1px solid var(--border)', borderRadius: 12, fontSize: 11 }} />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                )}
              </motion.div>
            )}

            {/* ============ ASSIGNMENTS ============ */}
            {activeTab === 'assignments' && (
              <motion.div key="list" {...fadeUp} className="space-y-4">
                <div className="glass-panel rounded-2xl p-3 border border-[var(--border)] flex flex-wrap items-center gap-2">
                  <div className="flex-1 min-w-[200px] relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-[var(--text-secondary)]" />
                    <input type="text" value={search} onChange={e => setSearch(e.target.value)} placeholder="Search assignments..."
                      className="w-full pl-9 pr-3 py-2 rounded-xl text-xs font-bold bg-[var(--bg-secondary)] border border-[var(--border)] text-[var(--text-primary)] focus:outline-none focus:border-[var(--accent)] transition-all" />
                  </div>
                  <select value={filterStatus} onChange={e => setFilterStatus(e.target.value)}
                    className="px-3 py-2 rounded-xl text-[10px] font-bold bg-[var(--bg-secondary)] border border-[var(--border)] text-[var(--text-primary)] focus:outline-none">
                    <option value="all">All Status</option>
                    {STATUS.map(s => <option key={s.id} value={s.id}>{s.label}</option>)}
                  </select>
                  <select value={filterPriority} onChange={e => setFilterPriority(e.target.value)}
                    className="px-3 py-2 rounded-xl text-[10px] font-bold bg-[var(--bg-secondary)] border border-[var(--border)] text-[var(--text-primary)] focus:outline-none">
                    <option value="all">All Priority</option>
                    {Object.entries(PRIORITY).map(([k, v]) => <option key={k} value={k}>{v.label}</option>)}
                  </select>
                  <select value={sortBy} onChange={e => setSortBy(e.target.value)}
                    className="px-3 py-2 rounded-xl text-[10px] font-bold bg-[var(--bg-secondary)] border border-[var(--border)] text-[var(--text-primary)] focus:outline-none">
                    <option value="deadline">Sort by Deadline</option>
                    <option value="priority">Sort by Priority</option>
                    <option value="title">Sort by Title</option>
                  </select>
                </div>

                {filtered.length === 0 ? (
                  <EmptyState icon={ClipboardList} title="No assignments found" description="Add your first assignment to get started" />
                ) : (
                  <div className="space-y-2">
                    {filtered.map((a, i) => {
                      const days = daysUntil(a.deadline);
                      const isOverdue = a.status !== 'completed' && days < 0;
                      const isDueSoon = a.status !== 'completed' && days >= 0 && days <= 3;
                      const pColor = PRIORITY[a.priority]?.color || '#6366f1';
                      const sColor = SUBJECTS.find(s => s.name === a.subject)?.color || '#6366f1';

                      return (
                        <motion.div key={a.id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.03 }}
                          className={`glass-panel border rounded-xl p-4 flex items-center gap-3 transition-all ${
                            isOverdue ? 'border-red-500/30' : isDueSoon ? 'border-amber-500/30' : 'border-[var(--border)]'
                          }`}>
                          <button onClick={() => toggleStatus(a.id)}
                            className={`w-5 h-5 rounded-lg border-2 flex items-center justify-center flex-shrink-0 transition-all ${
                              a.status === 'completed' ? 'bg-green-500 border-green-500' : 'border-[var(--border)] hover:border-[var(--accent)]'
                            }`}>
                            {a.status === 'completed' && <Check className="w-3 h-3 text-white" />}
                          </button>
                          <div className="flex-1 min-w-0">
                            <p className={`text-xs font-bold ${a.status === 'completed' ? 'line-through text-[var(--text-secondary)]' : 'text-[var(--text-primary)]'}`}>
                              {a.title}
                            </p>
                            <div className="flex items-center gap-2 mt-1 flex-wrap">
                              <span className="text-[9px] font-bold px-1.5 py-0.5 rounded-full" style={{ background: sColor + '20', color: sColor }}>{a.subject}</span>
                              <span className="text-[9px] font-bold px-1.5 py-0.5 rounded-full" style={{ background: pColor + '20', color: pColor }}>{PRIORITY[a.priority]?.label}</span>
                              {isOverdue && <span className="text-[9px] font-bold text-red-500">{Math.abs(days)}d overdue</span>}
                              {isDueSoon && <span className="text-[9px] font-bold text-amber-500">Due in {days}d</span>}
                              {a.notes && <Bell className="w-2.5 h-2.5 text-[var(--text-secondary)]" />}
                            </div>
                          </div>
                          <div className="flex gap-1">
                            <Button variant="ghost" size="sm" icon={Edit2} onClick={() => openEdit(a)} />
                            <button onClick={() => deleteAssignment(a.id)}
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

            {/* ============ CALENDAR ============ */}
            {activeTab === 'calendar' && (
              <motion.div key="cal" {...fadeUp} className="space-y-4">
                <div className="glass-panel rounded-2xl p-5 border border-[var(--border)]">
                  <div className="flex items-center justify-between mb-4">
                    <button onClick={() => { if (calMonth === 0) { setCalMonth(11); setCalYear(y => y - 1); } else setCalMonth(m => m - 1); }}
                      className="p-2 rounded-xl hover:bg-[var(--bg-secondary)] text-[var(--text-secondary)]"><ChevronLeft className="w-4 h-4" /></button>
                    <h3 className="text-sm font-bold text-[var(--text-primary)]">{calMonthLabel}</h3>
                    <button onClick={() => { if (calMonth === 11) { setCalMonth(0); setCalYear(y => y + 1); } else setCalMonth(m => m + 1); }}
                      className="p-2 rounded-xl hover:bg-[var(--bg-secondary)] text-[var(--text-secondary)]"><ChevronRight className="w-4 h-4" /></button>
                  </div>
                  <div className="grid grid-cols-7 gap-1 text-center">
                    {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(d => (
                      <div key={d} className="text-[9px] font-bold text-[var(--text-secondary)] py-1">{d}</div>
                    ))}
                    {calDays.map((day, i) => (
                      <button key={i} onClick={() => day.day && setSelectedCalDay(day)}
                        className={`p-2 rounded-xl text-xs font-bold transition-all min-h-[40px] ${
                          !day.day ? '' :
                          day.isToday ? 'bg-[var(--accent)]/20 text-[var(--accent)]' :
                          day.hasAssignments ? 'bg-purple-500/10 text-purple-500 hover:bg-purple-500/20' :
                          'text-[var(--text-secondary)] hover:bg-[var(--bg-secondary)]'
                        }`}>
                        {day.day || ''}
                        {day.hasAssignments && <div className="w-1.5 h-1.5 rounded-full bg-purple-500 mx-auto mt-0.5" />}
                      </button>
                    ))}
                  </div>
                </div>

                {selectedCalDay && selectedCalDay.assignments.length > 0 && (
                  <div className="glass-panel rounded-2xl p-4 border border-[var(--border)] space-y-2">
                    <h4 className="text-xs font-bold text-[var(--text-primary)]">
                      {new Date(calYear, calMonth, selectedCalDay.day).toLocaleDateString('en', { weekday: 'long', month: 'long', day: 'numeric' })}
                    </h4>
                    {selectedCalDay.assignments.map(a => (
                      <div key={a.id} className="flex items-center gap-2 p-2 rounded-xl bg-[var(--bg-secondary)]">
                        <div className="w-2 h-2 rounded-full" style={{ background: PRIORITY[a.priority]?.color }} />
                        <span className="text-xs font-bold text-[var(--text-primary)]">{a.title}</span>
                        <span className="text-[9px] text-[var(--text-secondary)]">{a.subject}</span>
                      </div>
                    ))}
                  </div>
                )}
              </motion.div>
            )}

            {/* ============ COMPLETED ============ */}
            {activeTab === 'completed' && (
              <motion.div key="done" {...fadeUp} className="space-y-4">
                {stats.completed === 0 ? (
                  <EmptyState icon={Check} title="No completed assignments" description="Complete assignments to see them here" />
                ) : (
                  <div className="space-y-2">
                    {assignments.filter(a => a.status === 'completed').map((a, i) => (
                      <motion.div key={a.id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.03 }}
                        className="glass-panel border border-[var(--border)] rounded-xl p-4 flex items-center gap-3 opacity-70">
                        <div className="w-5 h-5 rounded-lg bg-green-500 flex items-center justify-center flex-shrink-0">
                          <Check className="w-3 h-3 text-white" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-xs font-bold text-[var(--text-secondary)] line-through">{a.title}</p>
                          <p className="text-[9px] text-[var(--text-secondary)]">{a.subject} · Completed {a.completedAt ? new Date(a.completedAt).toLocaleDateString() : ''}</p>
                        </div>
                        <button onClick={() => toggleStatus(a.id)}
                          className="p-1.5 rounded-lg hover:bg-amber-500/10 text-[var(--text-secondary)] hover:text-amber-500 transition-all" title="Restore">
                          <History className="w-3 h-3" />
                        </button>
                      </motion.div>
                    ))}
                  </div>
                )}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </ToolLayout>

      {/* Add/Edit Modal */}
      <Modal isOpen={showForm} onClose={() => setShowForm(false)} title={editItem ? 'Edit Assignment' : 'New Assignment'}>
        <div className="space-y-4">
          <div className="space-y-1.5">
            <label className="text-[10px] font-bold uppercase tracking-wider text-[var(--text-secondary)]">Title *</label>
            <input type="text" value={form.title} onChange={e => setForm(f => ({ ...f, title: e.target.value }))} placeholder="Assignment title"
              className="w-full px-3 py-2.5 rounded-xl text-xs font-bold bg-[var(--bg-secondary)] border border-[var(--border)] text-[var(--text-primary)] focus:outline-none focus:border-[var(--accent)] transition-all" />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <label className="text-[10px] font-bold uppercase tracking-wider text-[var(--text-secondary)]">Subject</label>
              <select value={form.subject} onChange={e => setForm(f => ({ ...f, subject: e.target.value }))}
                className="w-full px-3 py-2.5 rounded-xl text-xs font-bold bg-[var(--bg-secondary)] border border-[var(--border)] text-[var(--text-primary)] focus:outline-none">
                {SUBJECTS.map(s => <option key={s.name} value={s.name}>{s.name}</option>)}
              </select>
            </div>
            <div className="space-y-1.5">
              <label className="text-[10px] font-bold uppercase tracking-wider text-[var(--text-secondary)]">Priority</label>
              <select value={form.priority} onChange={e => setForm(f => ({ ...f, priority: e.target.value }))}
                className="w-full px-3 py-2.5 rounded-xl text-xs font-bold bg-[var(--bg-secondary)] border border-[var(--border)] text-[var(--text-primary)] focus:outline-none">
                {Object.entries(PRIORITY).map(([k, v]) => <option key={k} value={k}>{v.label}</option>)}
              </select>
            </div>
          </div>
          <div className="space-y-1.5">
            <label className="text-[10px] font-bold uppercase tracking-wider text-[var(--text-secondary)]">Deadline</label>
            <input type="date" value={form.deadline} onChange={e => setForm(f => ({ ...f, deadline: e.target.value }))}
              className="w-full px-3 py-2.5 rounded-xl text-xs font-bold bg-[var(--bg-secondary)] border border-[var(--border)] text-[var(--text-primary)] focus:outline-none [color-scheme:dark]" />
          </div>
          <div className="space-y-1.5">
            <label className="text-[10px] font-bold uppercase tracking-wider text-[var(--text-secondary)]">Notes</label>
            <textarea value={form.notes} onChange={e => setForm(f => ({ ...f, notes: e.target.value }))} rows={3} placeholder="Optional notes..."
              className="w-full px-3 py-2.5 rounded-xl text-xs font-bold bg-[var(--bg-secondary)] border border-[var(--border)] text-[var(--text-primary)] focus:outline-none focus:border-[var(--accent)] transition-all resize-none" />
          </div>
          <div className="flex gap-2 justify-end">
            <Button variant="ghost" onClick={() => setShowForm(false)}>Cancel</Button>
            <Button variant="primary" onClick={handleSubmit} disabled={!form.title.trim()}>
              {editItem ? 'Save Changes' : 'Add Assignment'}
            </Button>
          </div>
        </div>
      </Modal>
    </ErrorBoundary>
  );
};

export default AssignmentTrackerTool;
