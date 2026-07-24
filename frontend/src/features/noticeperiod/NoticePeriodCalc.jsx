import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Clock, CalendarDays, Briefcase, Coffee, Sun, ArrowRight,
  Download, RotateCcw, History, Trash2, CheckCircle2, AlertTriangle,
  Timer, ChevronLeft, ChevronRight, Copy, Check, Trash,
} from 'lucide-react';
import useNoticePeriod from './useNoticePeriod';
import {
  formatDate, formatDateFull, isWeekend, getMonthDays, getMonthName,
  getCalendarMonths, addDays,
} from './mockData';

const fadeUp = { initial: { opacity: 0, y: 10 }, animate: { opacity: 1, y: 0 }, transition: { duration: 0.2 } };

const NumberInput = ({ icon: Icon, label, value, onChange, min = 0, suffix = 'days', accent }) => (
  <div className="space-y-1">
    <label className="text-[10px] font-bold uppercase tracking-wider text-[var(--text-secondary)] flex items-center gap-1.5">
      <Icon className="w-3 h-3" style={{ color: accent }} /> {label}
    </label>
    <div className="relative">
      <input type="number" min={min} value={value} onChange={e => onChange(Number(e.target.value))}
        className="w-full px-3 py-2.5 rounded-xl text-sm font-bold outline-none bg-[var(--bg-secondary)] border border-[var(--border)]
          text-[var(--text-primary)] hover:border-[var(--accent)] focus:border-[var(--accent)] focus:ring-2 focus:ring-[var(--accent)]/20 transition-all" />
      <span className="absolute right-3 top-1/2 -translate-y-1/2 text-[10px] font-bold text-[var(--text-secondary)]">{suffix}</span>
    </div>
  </div>
);

const DateInput = ({ icon: Icon, label, value, onChange, accent }) => (
  <div className="space-y-1">
    <label className="text-[10px] font-bold uppercase tracking-wider text-[var(--text-secondary)] flex items-center gap-1.5">
      <Icon className="w-3 h-3" style={{ color: accent }} /> {label}
    </label>
    <input type="date" value={value} onChange={e => onChange(e.target.value)}
      className="w-full px-3 py-2.5 rounded-xl text-sm font-bold outline-none bg-[var(--bg-secondary)] border border-[var(--border)]
        text-[var(--text-primary)] hover:border-[var(--accent)] focus:border-[var(--accent)] focus:ring-2 focus:ring-[var(--accent)]/20 transition-all
        [color-scheme:dark]" />
  </div>
);

const StatCard = ({ icon: Icon, label, value, sub, color, animate }) => (
  <motion.div {...(animate ? fadeUp : {})}
    className="glass-panel rounded-2xl p-4 border border-[var(--border)] space-y-2">
    <div className="flex items-center gap-2">
      <div className="p-2 rounded-xl" style={{ backgroundColor: `${color}15` }}>
        <Icon className="w-4 h-4" style={{ color }} />
      </div>
      <span className="text-[10px] font-bold uppercase tracking-wider text-[var(--text-secondary)]">{label}</span>
    </div>
    <div className="text-2xl font-black text-[var(--text-primary)]">{value}</div>
    {sub && <div className="text-xs font-medium text-[var(--text-secondary)]">{sub}</div>}
  </motion.div>
);

const CalendarView = ({ lastWorkingDay, effectiveNotice, releaseDateObj }) => {
  const [viewOffset, setViewOffset] = useState(0);
  if (!lastWorkingDay || !effectiveNotice) return null;

  const startDate = new Date(lastWorkingDay);
  const startMonth = startDate.getMonth() + viewOffset;
  const startYear = startDate.getFullYear() + Math.floor(startMonth / 12);
  const normalizedMonth = ((startMonth % 12) + 12) % 12;

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const daysInMonth = getMonthDays(startYear, normalizedMonth);
  const firstDayOfWeek = new Date(startYear, normalizedMonth, 1).getDay();
  const weekDays = ['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'];

  const startStr = lastWorkingDay;
  const endStr = releaseDateObj ? releaseDateObj.toISOString().split('T')[0] : null;

  const cells = [];
  for (let i = 0; i < firstDayOfWeek; i++) cells.push(null);
  for (let d = 1; d <= daysInMonth; d++) cells.push(d);

  return (
    <div className="glass-panel rounded-2xl p-4 border border-[var(--border)] space-y-3">
      <div className="flex items-center justify-between">
        <h3 className="text-xs font-black uppercase tracking-wider text-[var(--text-secondary)] flex items-center gap-2">
          <CalendarDays className="w-4 h-4 text-[var(--accent)]" /> Calendar View
        </h3>
        <div className="flex items-center gap-1">
          <button onClick={() => setViewOffset(v => v - 1)}
            className="p-1.5 rounded-lg hover:bg-[var(--bg-secondary)] text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-all">
            <ChevronLeft className="w-4 h-4" />
          </button>
          <span className="text-xs font-bold text-[var(--text-primary)] min-w-[100px] text-center">
            {getMonthName(normalizedMonth)} {startYear}
          </span>
          <button onClick={() => setViewOffset(v => v + 1)}
            className="p-1.5 rounded-lg hover:bg-[var(--bg-secondary)] text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-all">
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>

      <div className="grid grid-cols-7 gap-1">
        {weekDays.map(d => (
          <div key={d} className="text-center text-[10px] font-bold text-[var(--text-secondary)] py-1">{d}</div>
        ))}
        {cells.map((day, i) => {
          if (day === null) return <div key={`empty-${i}`} />;
          const dateStr = `${startYear}-${String(normalizedMonth + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
          const isInRange = startStr && endStr && dateStr >= startStr && dateStr <= endStr;
          const isStart = dateStr === startStr;
          const isEnd = endStr && dateStr === endStr;
          const isToday = dateStr === today.toISOString().split('T')[0];
          const weekend = isWeekend(dateStr);

          let bg = 'transparent';
          let textColor = 'text-[var(--text-primary)]';
          let ring = '';
          let extra = '';

          if (isStart) {
            bg = 'bg-rose-500';
            textColor = 'text-white font-black';
            extra = 'rounded-l-lg';
          } else if (isEnd) {
            bg = 'bg-emerald-500';
            textColor = 'text-white font-black';
            extra = 'rounded-r-lg';
          } else if (isInRange && weekend) {
            bg = 'bg-rose-500/10';
            textColor = 'text-rose-400';
          } else if (isInRange) {
            bg = 'bg-[var(--accent)]/10';
            textColor = 'text-[var(--accent)]';
          }

          if (isToday) ring = 'ring-2 ring-[var(--accent)] ring-offset-1 ring-offset-[var(--bg-primary)]';

          return (
            <div key={day}
              className={`relative text-center py-1.5 rounded-lg text-xs font-bold cursor-default transition-all ${bg} ${textColor} ${ring} ${extra}`}>
              {day}
              {isStart && <span className="absolute -top-0.5 -right-0.5 w-1.5 h-1.5 bg-rose-400 rounded-full animate-pulse" />}
              {isEnd && <span className="absolute -top-0.5 -right-0.5 w-1.5 h-1.5 bg-emerald-400 rounded-full animate-pulse" />}
            </div>
          );
        })}
      </div>

      <div className="flex items-center gap-4 text-[10px] font-bold text-[var(--text-secondary)] pt-1">
        <span className="flex items-center gap-1.5">
          <span className="w-3 h-3 rounded bg-rose-500" /> Last Working Day
        </span>
        <span className="flex items-center gap-1.5">
          <span className="w-3 h-3 rounded bg-[var(--accent)]/20" /> Notice Period
        </span>
        <span className="flex items-center gap-1.5">
          <span className="w-3 h-3 rounded bg-rose-500/10" /> Weekend
        </span>
        <span className="flex items-center gap-1.5">
          <span className="w-3 h-3 rounded bg-emerald-500" /> Release Date
        </span>
      </div>
    </div>
  );
};

export default function NoticePeriodCalc() {
  const h = useNoticePeriod();
  const [copied, setCopied] = useState(false);
  const [activeTab, setActiveTab] = useState('inputs');
  const [showHistory, setShowHistory] = useState(false);

  const copy = (text) => {
    navigator.clipboard?.writeText(text).catch(() => {});
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };

  const exportPDF = async () => {
    if (!h.result) return;
    const { default: jsPDF } = await import('jspdf');
    const doc = new jsPDF('p', 'mm', 'a4');
    const w = doc.internal.pageSize.getWidth();
    let y = 20;

    doc.setFillColor(15, 15, 25);
    doc.rect(0, 0, w, doc.internal.pageSize.getHeight(), 'F');

    doc.setFont('helvetica', 'bold');
    doc.setFontSize(22);
    doc.setTextColor(244, 63, 94);
    doc.text('Notice Period Report', w / 2, y, { align: 'center' });
    y += 10;

    doc.setFontSize(10);
    doc.setTextColor(150, 150, 170);
    doc.text(`Generated on ${formatDateFull(new Date().toISOString())}`, w / 2, y, { align: 'center' });
    y += 14;

    const lines = [
      ['Last Working Day', formatDate(h.inputs.lastWorkingDay)],
      ['Notice Period', `${h.inputs.noticePeriod} days`],
      ['Leaves Applied', `${h.inputs.leaves || 0} days`],
      ['Public Holidays', `${h.inputs.holidays || 0} days`],
      ['Effective Notice', `${h.result.effectiveNotice} days`],
      ['Release Date', h.result.releaseDate],
      ['Remaining Days', `${h.result.remainingDays} days`],
    ];

    if (h.inputs.joiningDate) {
      lines.push(['Joining Date', formatDate(h.inputs.joiningDate)]);
      if (h.result.joiningReadiness) {
        lines.push(['Joining Status', h.result.joiningReadiness.message]);
      }
    }

    doc.setFillColor(25, 25, 40);
    doc.roundedRect(16, y, w - 32, lines.length * 10 + 8, 4, 4, 'F');

    lines.forEach((row, i) => {
      const ly = y + 8 + i * 10;
      doc.setFont('helvetica', 'normal');
      doc.setFontSize(10);
      doc.setTextColor(150, 150, 170);
      doc.text(row[0], 24, ly);
      doc.setFont('helvetica', 'bold');
      doc.setTextColor(248, 250, 252);
      doc.text(row[1], w - 24, ly, { align: 'right' });
    });

    doc.save('notice-period-report.pdf');
  };

  const summaryText = h.result
    ? `Notice Period Report\nLast Working Day: ${formatDate(h.inputs.lastWorkingDay)}\nRelease Date: ${h.result.releaseDate}\nRemaining Days: ${h.result.remainingDays}\nEffective Notice: ${h.result.effectiveNotice} days`
    : '';

  return (
    <div className="space-y-4">
      <div className="text-center space-y-2">
        <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-gradient-to-br from-rose-500/20 to-pink-500/20 border border-rose-500/30">
          <Timer className="w-7 h-7 text-rose-400" />
        </div>
        <h1 className="text-3xl font-black bg-gradient-to-r from-rose-400 via-pink-400 to-fuchsia-400 bg-clip-text text-transparent">
          Notice Period Calculator
        </h1>
        <p className="text-sm text-[var(--text-secondary)] max-w-md mx-auto">
          Track your notice period, calculate release dates, view calendar & export reports.
        </p>
      </div>

      <div className="glass-panel rounded-2xl p-1.5 border border-[var(--border)] flex items-center gap-1 w-fit mx-auto">
        {['inputs', 'calendar'].map(tab => (
          <button key={tab} onClick={() => setActiveTab(tab)}
            className={`px-4 py-1.5 rounded-xl text-xs font-bold transition-all capitalize
              ${activeTab === tab ? 'bg-[var(--accent)]/15 text-[var(--accent)]' : 'text-[var(--text-secondary)] hover:text-[var(--text-primary)]'}`}>
            {tab}
          </button>
        ))}
      </div>

      <AnimatePresence mode="wait">
        {activeTab === 'inputs' ? (
          <motion.div key="inputs" {...fadeUp} className="grid grid-cols-1 lg:grid-cols-12 gap-4">
            <div className="lg:col-span-4 space-y-3">
              <div className="glass-panel rounded-2xl p-4 border border-[var(--border)] space-y-4">
                <h3 className="text-xs font-black uppercase tracking-wider text-[var(--text-secondary)]">Configuration</h3>
                <DateInput icon={CalendarDays} label="Last Working Day" value={h.inputs.lastWorkingDay}
                  onChange={v => h.updateInput('lastWorkingDay', v)} accent="#f43f5e" />
                <DateInput icon={Briefcase} label="Joining Date (optional)" value={h.inputs.joiningDate}
                  onChange={v => h.updateInput('joiningDate', v)} accent="#8b5cf6" />
                <NumberInput icon={Clock} label="Notice Period" value={h.inputs.noticePeriod}
                  onChange={v => h.updateInput('noticePeriod', v)} min={0} suffix="days" accent="#f43f5e" />
                <NumberInput icon={Coffee} label="Leaves Applied" value={h.inputs.leaves}
                  onChange={v => h.updateInput('leaves', v)} min={0} suffix="days" accent="#f97316" />
                <NumberInput icon={Sun} label="Public Holidays" value={h.inputs.holidays}
                  onChange={v => h.updateInput('holidays', v)} min={0} suffix="days" accent="#eab308" />

                <div className="flex gap-2 pt-1">
                  <button onClick={h.calculate} disabled={!h.canCalculate}
                    className="flex-1 py-2.5 rounded-xl text-xs font-black bg-gradient-to-r from-rose-500 to-pink-500 text-white
                      hover:shadow-lg hover:shadow-rose-500/25 transition-all disabled:opacity-40 disabled:cursor-not-allowed flex items-center justify-center gap-1.5">
                    <ArrowRight className="w-3.5 h-3.5" /> Calculate
                  </button>
                  <button onClick={h.reset}
                    className="p-2.5 rounded-xl border border-[var(--border)] text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-secondary)] transition-all">
                    <RotateCcw className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>

            <div className="lg:col-span-8 space-y-3">
              {h.result ? (
                <>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    <StatCard icon={Clock} label="Remaining Days" value={`${h.result.remainingDays}`} sub={`Until ${h.result.releaseDate}`} color="#f43f5e" animate />
                    <StatCard icon={CalendarDays} label="Release Date" value={h.result.releaseDate} sub={`${h.result.effectiveNotice} effective days`} color="#22c55e" animate />
                    <StatCard icon={Timer} label="Effective Notice" value={`${h.result.effectiveNotice}d`}
                      sub={`- ${h.result.totalDeductions} deductions`} color="#8b5cf6" animate />
                  </div>

                  {h.result.joiningReadiness && (
                    <motion.div {...fadeUp}
                      className={`glass-panel rounded-2xl p-4 border flex items-center gap-3 ${
                        h.result.joiningReadiness.status === 'ready'
                          ? 'border-emerald-500/30 bg-emerald-500/5'
                          : h.result.joiningReadiness.status === 'perfect'
                          ? 'border-[var(--accent)]/30 bg-[var(--accent)]/5'
                          : 'border-amber-500/30 bg-amber-500/5'
                      }`}>
                      {h.result.joiningReadiness.status === 'ready' || h.result.joiningReadiness.status === 'perfect' ? (
                        <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
                      ) : (
                        <AlertTriangle className="w-5 h-5 text-amber-400 shrink-0" />
                      )}
                      <div>
                        <div className="text-xs font-black uppercase tracking-wider text-[var(--text-secondary)]">Joining Readiness</div>
                        <div className="text-sm font-bold text-[var(--text-primary)]">{h.result.joiningReadiness.message}</div>
                      </div>
                    </motion.div>
                  )}

                  <div className="flex gap-2">
                    <button onClick={exportPDF}
                      className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold text-rose-400 border border-rose-500/30 hover:bg-rose-500/5 transition-all">
                      <Download className="w-3.5 h-3.5" /> Export PDF
                    </button>
                    <button onClick={() => copy(summaryText)}
                      className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold text-[var(--text-secondary)] border border-[var(--border)] hover:bg-[var(--bg-secondary)] transition-all">
                      {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                      {copied ? 'Copied!' : 'Copy Summary'}
                    </button>
                  </div>

                  <div className="glass-panel rounded-2xl p-4 border border-[var(--border)]">
                    <h3 className="text-xs font-black uppercase tracking-wider text-[var(--text-secondary)] mb-3">Timeline</h3>
                    <div className="flex items-center gap-0">
                      <div className="flex flex-col items-center">
                        <div className="w-8 h-8 rounded-full bg-rose-500/20 flex items-center justify-center">
                          <CalendarDays className="w-4 h-4 text-rose-400" />
                        </div>
                        <span className="text-[10px] font-bold text-[var(--text-secondary)] mt-1">Start</span>
                        <span className="text-[10px] font-bold text-[var(--text-primary)]">{formatDate(h.inputs.lastWorkingDay)}</span>
                      </div>
                      <div className="flex-1 h-1 mx-2 rounded-full bg-gradient-to-r from-rose-500 via-[var(--accent)] to-emerald-500" />
                      <div className="flex flex-col items-center">
                        <div className="w-8 h-8 rounded-full bg-emerald-500/20 flex items-center justify-center">
                          <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                        </div>
                        <span className="text-[10px] font-bold text-[var(--text-secondary)] mt-1">Release</span>
                        <span className="text-[10px] font-bold text-[var(--text-primary)]">{h.result.releaseDate}</span>
                      </div>
                    </div>
                  </div>
                </>
              ) : (
                <div className="glass-panel rounded-2xl p-12 border border-[var(--border)] flex flex-col items-center justify-center text-center space-y-3 min-h-[300px]">
                  <Timer className="w-10 h-10 text-[var(--text-secondary)] opacity-30" />
                  <p className="text-sm font-bold text-[var(--text-secondary)]">Set your dates and click Calculate</p>
                  <p className="text-xs text-[var(--text-secondary)] opacity-60">Results will appear here with calendar view and export options</p>
                </div>
              )}
            </div>
          </motion.div>
        ) : (
          <motion.div key="calendar" {...fadeUp}>
            {h.result ? (
              <CalendarView
                lastWorkingDay={h.inputs.lastWorkingDay}
                effectiveNotice={h.result.effectiveNotice}
                releaseDateObj={h.result.releaseDateObj}
              />
            ) : (
              <div className="glass-panel rounded-2xl p-12 border border-[var(--border)] flex flex-col items-center justify-center text-center space-y-3 min-h-[300px]">
                <CalendarDays className="w-10 h-10 text-[var(--text-secondary)] opacity-30" />
                <p className="text-sm font-bold text-[var(--text-secondary)]">Calculate first to see the calendar</p>
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>

      {h.history.length > 0 && (
        <div className="glass-panel rounded-2xl p-4 border border-[var(--border)] space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="text-xs font-black uppercase tracking-wider text-[var(--text-secondary)] flex items-center gap-2">
              <History className="w-4 h-4" /> Recent Calculations
            </h3>
            <div className="flex items-center gap-2">
              <button onClick={() => setShowHistory(!showHistory)}
                className="text-[10px] font-bold text-[var(--accent)] hover:underline">
                {showHistory ? 'Hide' : 'Show'}
              </button>
              <button onClick={h.clearHistory}
                className="text-[10px] font-bold text-red-400 hover:underline">Clear All</button>
            </div>
          </div>
          <AnimatePresence>
            {showHistory && (
              <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }}
                exit={{ height: 0, opacity: 0 }} className="space-y-2 overflow-hidden">
                {h.history.map(entry => (
                  <div key={entry.id}
                    className="flex items-center gap-3 p-3 rounded-xl bg-[var(--bg-secondary)] border border-[var(--border)] hover:border-[var(--accent)]/30 transition-all">
                    <div className="flex-1 min-w-0 grid grid-cols-3 gap-2 text-xs">
                      <span className="font-bold text-[var(--text-primary)] truncate">{formatDate(entry.inputs.lastWorkingDay)}</span>
                      <span className="text-[var(--text-secondary)]">{entry.result.releaseDate}</span>
                      <span className="text-[var(--accent)] font-bold">{entry.result.remainingDays}d left</span>
                    </div>
                    <div className="flex gap-1">
                      <button onClick={() => h.loadEntry(entry)}
                        className="p-1.5 rounded-lg text-[var(--accent)] hover:bg-[var(--accent)]/10 transition-all">
                        <ArrowRight className="w-3 h-3" />
                      </button>
                      <button onClick={() => h.removeEntry(entry.id)}
                        className="p-1.5 rounded-lg text-red-400 hover:bg-red-500/10 transition-all">
                        <Trash2 className="w-3 h-3" />
                      </button>
                    </div>
                  </div>
                ))}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      )}
    </div>
  );
}
