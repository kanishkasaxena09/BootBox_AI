import React, { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Timer, Plus, Trash2, Bell, BellOff, Calendar, ChevronDown, X } from 'lucide-react';
import { PRIORITY } from './useStudyPlanner';
import { EmptyState, Modal } from '../../components/shared';

const fadeUp = { initial: { opacity: 0, y: 10 }, animate: { opacity: 1, y: 0 }, transition: { duration: 0.25 } };

function getDiff(target) {
  const diff = new Date(target).getTime() - Date.now();
  if (diff <= 0) return { days: 0, hours: 0, minutes: 0, seconds: 0, total: 0 };
  return {
    days: Math.floor(diff / 86400000),
    hours: Math.floor((diff % 86400000) / 3600000),
    minutes: Math.floor((diff % 3600000) / 60000),
    seconds: Math.floor((diff % 60000) / 1000),
    total: diff,
  };
}

function CountdownUnit({ value, label }) {
  return (
    <div className="flex flex-col items-center">
      <div className="relative w-16 h-16 sm:w-20 sm:h-20 flex items-center justify-center rounded-2xl bg-[var(--bg-secondary)] border border-[var(--border)] overflow-hidden">
        <motion.span
          key={value}
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          className="text-4xl font-black font-mono text-[var(--text-primary)]"
        >
          {String(value).padStart(2, '0')}
        </motion.span>
      </div>
      <span className="text-[10px] font-bold uppercase tracking-wider text-[var(--text-secondary)] mt-2">{label}</span>
    </div>
  );
}

export default function ExamCountdown({ exams, addExam, deleteExam, subjects, getSubjectName, getSubjectColor }) {
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ name: '', subject: '', date: '', time: '', priority: 'medium' });
  const [now, setNow] = useState(Date.now());

  useEffect(() => {
    const id = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(id);
  }, []);

  const upcoming = useMemo(() => {
    const today = new Date().toISOString().slice(0, 10);
    return (exams || [])
      .filter(e => e.date >= today)
      .sort((a, b) => a.date.localeCompare(b.date));
  }, [exams]);

  const nextExam = upcoming[0] || null;

  const countdown = useMemo(() => {
    if (!nextExam) return null;
    const target = nextExam.time
      ? `${nextExam.date}T${nextExam.time}:00`
      : `${nextExam.date}T23:59:59`;
    return getDiff(target);
  }, [nextExam, now]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!form.name.trim() || !form.date) return;
    addExam(form);
    setForm({ name: '', subject: '', date: '', time: '', priority: 'medium' });
    setShowForm(false);
  };

  const daysLeft = (date) => {
    const diff = Math.ceil((new Date(date + 'T00:00:00').getTime() - Date.now()) / 86400000);
    return Math.max(0, diff);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div className="space-y-1">
          <h2 className="text-2xl font-black bg-gradient-to-r from-indigo-500 to-purple-500 bg-clip-text text-transparent">Exam Countdown</h2>
          <p className="text-sm text-[var(--text-secondary)]">Never miss an exam again.</p>
        </div>
        <button onClick={() => setShowForm(true)}
          className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-gradient-to-r from-indigo-500 to-purple-600 text-white font-bold text-xs shadow-lg shadow-indigo-500/20">
          <Plus className="w-3.5 h-3.5" /> Add Exam
        </button>
      </div>

      {/* Countdown Hero */}
      {nextExam && countdown && (
        <motion.div {...fadeUp} className="glass-panel border border-[var(--border)] rounded-2xl p-6 space-y-4">
          <div className="flex items-center gap-2 mb-2">
            <Timer className="w-4 h-4 text-indigo-500" />
            <span className="text-[10px] font-bold uppercase tracking-wider text-[var(--text-secondary)]">Next Exam</span>
          </div>
          <p className="text-lg font-black text-[var(--text-primary)]">{nextExam.name}</p>
          <div className="flex items-center gap-2 flex-wrap">
            {nextExam.subject && (
              <span className="flex items-center gap-1 text-[10px] font-bold px-2 py-1 rounded-full"
                style={{ background: getSubjectColor(nextExam.subject) + '20', color: getSubjectColor(nextExam.subject) }}>
                <div className="w-1.5 h-1.5 rounded-full" style={{ background: getSubjectColor(nextExam.subject) }} />
                {getSubjectName(nextExam.subject)}
              </span>
            )}
            {nextExam.priority && PRIORITY[nextExam.priority] && (
              <span className={`text-[10px] font-bold px-2 py-1 rounded-full border ${PRIORITY[nextExam.priority].bg} ${PRIORITY[nextExam.priority].text} ${PRIORITY[nextExam.priority].border}`}>
                {PRIORITY[nextExam.priority].label}
              </span>
            )}
            <span className="text-[10px] font-bold text-[var(--text-secondary)]">
              {new Date(nextExam.date + 'T00:00:00').toLocaleDateString('en', { weekday: 'long', month: 'short', day: 'numeric' })}
            </span>
          </div>
          <div className="flex items-center justify-center gap-3 sm:gap-5 pt-2">
            <CountdownUnit value={countdown.days} label="Days" />
            <span className="text-2xl font-black text-[var(--text-secondary)] mt-[-20px]">:</span>
            <CountdownUnit value={countdown.hours} label="Hours" />
            <span className="text-2xl font-black text-[var(--text-secondary)] mt-[-20px]">:</span>
            <CountdownUnit value={countdown.minutes} label="Mins" />
            <span className="text-2xl font-black text-[var(--text-secondary)] mt-[-20px]">:</span>
            <CountdownUnit value={countdown.seconds} label="Secs" />
          </div>
        </motion.div>
      )}

      {/* Exam List */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <h3 className="text-xs font-black uppercase tracking-wider text-[var(--text-secondary)] flex items-center gap-2">
            <Calendar className="w-4 h-4 text-indigo-500" /> All Upcoming Exams
          </h3>
          <span className="text-[10px] font-bold text-[var(--text-secondary)]">{upcoming.length} exam{upcoming.length !== 1 ? 's' : ''}</span>
        </div>

        {upcoming.length === 0 ? (
          <EmptyState
            icon={Timer}
            title="No upcoming exams"
            description="Add an exam to start the countdown."
            action={
              <button onClick={() => setShowForm(true)} className="text-xs font-bold text-indigo-500">+ Add Exam</button>
            }
          />
        ) : (
          <div className="space-y-2">
            <AnimatePresence>
              {upcoming.map((exam) => {
                const days = daysLeft(exam.date);
                const pc = PRIORITY[exam.priority] || PRIORITY.medium;
                return (
                  <motion.div key={exam.id} layout {...fadeUp}
                    className="glass-panel border border-[var(--border)] rounded-2xl p-4 flex items-start gap-3">
                    <div className="flex-1 min-w-0 space-y-1.5">
                      <div className="flex items-center gap-2 flex-wrap">
                        <p className="text-xs font-bold text-[var(--text-primary)]">{exam.name}</p>
                        {exam.subject && (
                          <span className="flex items-center gap-1 text-[9px] font-bold px-1.5 py-0.5 rounded-full"
                            style={{ background: getSubjectColor(exam.subject) + '20', color: getSubjectColor(exam.subject) }}>
                            <div className="w-1.5 h-1.5 rounded-full" style={{ background: getSubjectColor(exam.subject) }} />
                            {getSubjectName(exam.subject)}
                          </span>
                        )}
                        <span className={`text-[9px] font-bold px-1.5 py-0.5 rounded-full ${pc.bg} ${pc.text}`}>
                          {pc.label}
                        </span>
                      </div>
                      <div className="flex items-center gap-3 flex-wrap">
                        <span className="text-[10px] font-bold text-[var(--text-secondary)]">
                          {new Date(exam.date + 'T00:00:00').toLocaleDateString('en', { month: 'short', day: 'numeric' })}
                          {exam.time ? ` · ${exam.time}` : ''}
                        </span>
                        <span className={`text-[10px] font-bold ${days <= 3 ? 'text-red-500' : days <= 7 ? 'text-amber-500' : 'text-green-500'}`}>
                          {days === 0 ? 'Today!' : `${days} day${days !== 1 ? 's' : ''} left`}
                        </span>
                      </div>
                    </div>
                    <div className="flex gap-1 flex-shrink-0 items-center">
                      <button
                        onClick={() => {}}
                        className="p-1.5 rounded-lg hover:bg-indigo-500/10 text-[var(--text-secondary)] hover:text-indigo-500 transition-all"
                        title={exam.reminder ? 'Reminder on' : 'Reminder off'}
                      >
                        {exam.reminder ? <Bell className="w-3.5 h-3.5" /> : <BellOff className="w-3.5 h-3.5" />}
                      </button>
                      <button onClick={() => deleteExam(exam.id)}
                        className="p-1.5 rounded-lg hover:bg-red-500/10 text-[var(--text-secondary)] hover:text-red-500 transition-all">
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </motion.div>
                );
              })}
            </AnimatePresence>
          </div>
        )}
      </div>

      {/* Add Exam Modal */}
      <Modal isOpen={showForm} onClose={() => setShowForm(false)} title="Add Exam" size="md">
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-1">
            <label className="text-[10px] font-bold uppercase tracking-wider text-[var(--text-secondary)]">Exam Name</label>
            <input type="text" required value={form.name} onChange={e => setForm(p => ({ ...p, name: e.target.value }))}
              placeholder="e.g. Midterm Physics"
              className="w-full px-3 py-2.5 rounded-xl text-xs font-medium bg-[var(--bg-secondary)] border border-[var(--border)] text-[var(--text-primary)] focus:outline-none focus:border-indigo-500/30" />
          </div>
          <div className="space-y-1">
            <label className="text-[10px] font-bold uppercase tracking-wider text-[var(--text-secondary)]">Subject</label>
            <select value={form.subject} onChange={e => setForm(p => ({ ...p, subject: e.target.value }))}
              className="w-full px-3 py-2.5 rounded-xl text-xs font-bold bg-[var(--bg-secondary)] border border-[var(--border)] text-[var(--text-primary)] focus:outline-none appearance-none">
              <option value="">None</option>
              {(subjects || []).map(s => <option key={s.id} value={s.id}>{s.name}</option>)}
            </select>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1">
              <label className="text-[10px] font-bold uppercase tracking-wider text-[var(--text-secondary)]">Date</label>
              <input type="date" required value={form.date} onChange={e => setForm(p => ({ ...p, date: e.target.value }))}
                className="w-full px-3 py-2.5 rounded-xl text-xs font-medium bg-[var(--bg-secondary)] border border-[var(--border)] text-[var(--text-primary)] focus:outline-none [color-scheme:dark]" />
            </div>
            <div className="space-y-1">
              <label className="text-[10px] font-bold uppercase tracking-wider text-[var(--text-secondary)]">Time</label>
              <input type="time" value={form.time} onChange={e => setForm(p => ({ ...p, time: e.target.value }))}
                className="w-full px-3 py-2.5 rounded-xl text-xs font-medium bg-[var(--bg-secondary)] border border-[var(--border)] text-[var(--text-primary)] focus:outline-none [color-scheme:dark]" />
            </div>
          </div>
          <div className="space-y-1">
            <label className="text-[10px] font-bold uppercase tracking-wider text-[var(--text-secondary)]">Priority</label>
            <div className="flex gap-2">
              {Object.entries(PRIORITY).map(([key, val]) => (
                <button key={key} type="button" onClick={() => setForm(p => ({ ...p, priority: key }))}
                  className={`flex-1 py-2 rounded-xl text-[10px] font-bold border transition-all ${
                    form.priority === key
                      ? `${val.bg} ${val.text} ${val.border}`
                      : 'bg-[var(--bg-secondary)] border-[var(--border)] text-[var(--text-secondary)]'
                  }`}>
                  {val.label}
                </button>
              ))}
            </div>
          </div>
          <div className="flex gap-2 pt-2">
            <button type="submit"
              className="flex-1 py-2.5 rounded-xl bg-gradient-to-r from-indigo-500 to-purple-600 text-white font-bold text-xs">
              Add Exam
            </button>
            <button type="button" onClick={() => setShowForm(false)}
              className="px-4 py-2.5 rounded-xl bg-[var(--bg-secondary)] border border-[var(--border)] text-[var(--text-secondary)] font-bold text-xs">
              Cancel
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
