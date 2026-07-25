import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Calendar, ChevronLeft, ChevronRight, Plus, X, Clock, MapPin } from 'lucide-react';
import { COLORS } from './useStudyPlanner';

const inputCls = "w-full px-3 py-2.5 rounded-xl text-xs font-medium bg-[var(--bg-secondary)] border border-[var(--border)] text-[var(--text-primary)] focus:outline-none focus:border-[var(--accent)]/30 transition-all";
const WEEKDAYS = ['Sun','Mon','Tue','Wed','Thu','Fri','Sat'];

const StudyCalendar = ({ events, addEvent, deleteEvent, getMonthDays }) => {
  const [monthYear, setMonthYear] = useState(() => new Date().toISOString().slice(0, 7));
  const [selectedDate, setSelectedDate] = useState(() => new Date().toISOString().slice(0, 10));
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ title: '', type: 'task', color: COLORS[0] });
  const today = new Date().toISOString().slice(0, 10);

  const days = useMemo(() => getMonthDays(monthYear), [monthYear, getMonthDays]);
  const selectedEvents = events.filter(e => e.date === selectedDate);
  const [y, m] = monthYear.split('-').map(Number);

  const prevMonth = () => { const pm = m === 1 ? `${y - 1}-12` : `${y}-${String(m - 1).padStart(2, '0')}`; setMonthYear(pm); };
  const nextMonth = () => { const nm = m === 12 ? `${y + 1}-01` : `${y}-${String(m + 1).padStart(2, '0')}`; setMonthYear(nm); };

  const handleAdd = (e) => {
    e.preventDefault();
    addEvent({ title: form.title, date: selectedDate, type: form.type, color: form.color });
    setForm({ title: '', type: 'task', color: COLORS[0] });
    setShowForm(false);
  };

  return (
    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="glass-panel border border-[var(--border)] rounded-2xl p-6 space-y-4">
      <div className="flex items-center gap-2">
        <div className="p-2 bg-amber-500/10 rounded-xl"><Calendar className="w-4 h-4 text-amber-500" /></div>
        <h3 className="text-sm font-bold text-[var(--text-primary)]">Study Calendar</h3>
      </div>

      {/* Navigation */}
      <div className="flex items-center justify-between">
        <button onClick={prevMonth} className="p-1.5 rounded-lg bg-[var(--bg-secondary)] border border-[var(--border)]"><ChevronLeft className="w-3.5 h-3.5 text-[var(--text-secondary)]" /></button>
        <h4 className="text-xs font-bold text-[var(--text-primary)]">{new Date(monthYear + '-15').toLocaleDateString('en', { month: 'long', year: 'numeric' })}</h4>
        <div className="flex gap-1">
          <button onClick={() => { const d = new Date(); setMonthYear(d.toISOString().slice(0, 7)); setSelectedDate(today); }}
            className="px-2 py-1 rounded-lg text-[9px] font-bold bg-indigo-500/10 text-indigo-500 border border-indigo-500/20">Today</button>
          <button onClick={nextMonth} className="p-1.5 rounded-lg bg-[var(--bg-secondary)] border border-[var(--border)]"><ChevronRight className="w-3.5 h-3.5 text-[var(--text-secondary)]" /></button>
        </div>
      </div>

      {/* Grid */}
      <div className="grid grid-cols-7 gap-1">
        {WEEKDAYS.map(d => <div key={d} className="text-center text-[9px] font-bold text-[var(--text-secondary)] py-1">{d}</div>)}
        {days.map((cell, i) => {
          if (!cell) return <div key={`p-${i}`} />;
          const isToday = cell.date === today;
          const isSelected = cell.date === selectedDate;
          return (
            <button key={cell.date} onClick={() => setSelectedDate(cell.date)}
              className={`relative p-1.5 rounded-lg min-h-[48px] text-left transition-all border ${
                isSelected ? 'border-indigo-500/30 bg-indigo-500/10' : isToday ? 'border-indigo-500/20 bg-indigo-500/5' : 'border-transparent hover:border-[var(--border)]'
              }`}>
              <span className={`text-[10px] font-bold ${isToday ? 'text-indigo-500' : 'text-[var(--text-primary)]'}`}>{cell.day}</span>
              {cell.events.length > 0 && (
                <div className="flex gap-0.5 mt-0.5 flex-wrap">
                  {cell.events.slice(0, 3).map(e => (
                    <div key={e.id} className="w-1.5 h-1.5 rounded-full" style={{ background: e.color }} />
                  ))}
                </div>
              )}
            </button>
          );
        })}
      </div>

      {/* Selected Date Events */}
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <h4 className="text-[10px] font-bold uppercase tracking-wider text-[var(--text-secondary)]">
            {new Date(selectedDate + 'T00:00:00').toLocaleDateString('en', { weekday: 'long', month: 'short', day: 'numeric' })}
          </h4>
          <button onClick={() => setShowForm(!showForm)} className="p-1 rounded-lg bg-indigo-500/10 text-indigo-500"><Plus className="w-3 h-3" /></button>
        </div>

        <AnimatePresence>
          {showForm && (
            <motion.form initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }}
              onSubmit={handleAdd} className="overflow-hidden space-y-2">
              <input required value={form.title} onChange={e => setForm(f => ({ ...f, title: e.target.value }))} className={inputCls} placeholder="Event title..." />
              <div className="flex gap-2">
                <select value={form.type} onChange={e => setForm(f => ({ ...f, type: e.target.value }))} className={inputCls + ' appearance-none flex-1'}>
                  <option value="task">Task</option><option value="exam">Exam</option><option value="holiday">Holiday</option><option value="assignment">Assignment</option>
                </select>
                <div className="flex gap-1 items-center">
                  {COLORS.slice(0, 6).map(c => (
                    <button key={c} type="button" onClick={() => setForm(f => ({ ...f, color: c }))}
                      className={`w-5 h-5 rounded-full transition-all ${form.color === c ? 'ring-2 ring-offset-1 ring-indigo-500' : ''}`} style={{ background: c }} />
                  ))}
                </div>
              </div>
              <button type="submit" className="w-full py-2 rounded-xl bg-gradient-to-r from-indigo-500 to-purple-600 text-white font-bold text-[10px]">Add Event</button>
            </motion.form>
          )}
        </AnimatePresence>

        <div className="space-y-1.5 max-h-[150px] overflow-y-auto">
          {selectedEvents.length === 0 ? (
            <p className="text-[10px] text-[var(--text-secondary)] text-center py-3">No events</p>
          ) : selectedEvents.map(e => (
            <div key={e.id} className="flex items-center gap-2 p-2 rounded-lg bg-[var(--bg-secondary)]/50 border border-[var(--border)]">
              <div className="w-2 h-2 rounded-full flex-shrink-0" style={{ background: e.color }} />
              <span className="text-[10px] font-bold text-[var(--text-primary)] flex-1 truncate">{e.title}</span>
              <span className="text-[9px] text-[var(--text-secondary)] capitalize">{e.type}</span>
              <button onClick={() => deleteEvent(e.id)} className="p-0.5 rounded hover:bg-red-500/10 text-[var(--text-secondary)] hover:text-red-500"><X className="w-2.5 h-2.5" /></button>
            </div>
          ))}
        </div>
      </div>
    </motion.div>
  );
};

export default StudyCalendar;
