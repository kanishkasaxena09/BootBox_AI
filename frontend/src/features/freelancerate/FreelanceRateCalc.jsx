import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  DollarSign, Clock, Calendar, Briefcase, TrendingUp, PieChart, BarChart3,
  RotateCcw, History, Trash2, ArrowRight, Zap, ChevronDown, ChevronUp,
} from 'lucide-react';
import useFreelanceRate from './useFreelanceRate';
import { formatCurrency, formatFullCurrency } from './mockData';

const fadeUp = { initial: { opacity: 0, y: 10 }, animate: { opacity: 1, y: 0 }, transition: { duration: 0.2 } };

const NumberInput = ({ icon: Icon, label, value, onChange, prefix, suffix, accent, min = 0 }) => (
  <div className="space-y-1">
    <label className="text-[10px] font-bold uppercase tracking-wider text-[var(--text-secondary)] flex items-center gap-1.5">
      {Icon && <Icon className="w-3 h-3" style={{ color: accent }} /> } {label}
    </label>
    <div className="relative">
      {prefix && <span className="absolute left-3 top-1/2 -translate-y-1/2 text-xs font-bold text-[var(--text-secondary)]">{prefix}</span>}
      <input type="number" min={min} value={value} onChange={e => onChange(Number(e.target.value))}
        className={`w-full py-2.5 rounded-xl text-sm font-bold outline-none bg-[var(--bg-secondary)] border border-[var(--border)]
          text-[var(--text-primary)] hover:border-[var(--accent)] focus:border-[var(--accent)] focus:ring-2 focus:ring-[var(--accent)]/20 transition-all
          ${prefix ? 'pl-7' : 'pl-3'} ${suffix ? 'pr-10' : 'pr-3'}`} />
      {suffix && <span className="absolute right-3 top-1/2 -translate-y-1/2 text-[10px] font-bold text-[var(--text-secondary)]">{suffix}</span>}
    </div>
  </div>
);

const DonutChart = ({ data, size = 160 }) => {
  const total = data.reduce((s, d) => s + d.value, 0);
  if (total === 0) return null;
  const radius = (size - 20) / 2;
  const cx = size / 2;
  const cy = size / 2;
  const circumference = 2 * Math.PI * radius;
  let accumulated = 0;

  return (
    <div className="relative" style={{ width: size, height: size }}>
      <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
        {data.map((segment, i) => {
          const pct = segment.value / total;
          const dash = pct * circumference;
          const offset = -(accumulated / total) * circumference;
          accumulated += segment.value;
          return (
            <circle key={i} cx={cx} cy={cy} r={radius}
              fill="none" stroke={segment.color} strokeWidth="14" strokeDasharray={`${dash} ${circumference - dash}`}
              strokeDashoffset={offset} strokeLinecap="round"
              style={{ transform: 'rotate(-90deg)', transformOrigin: '50% 50%', transition: 'all 0.5s ease' }} />
          );
        })}
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span className="text-[10px] font-bold text-[var(--text-secondary)]">Annual</span>
        <span className="text-sm font-black text-[var(--text-primary)]">{formatCurrency(total)}</span>
      </div>
    </div>
  );
};

const BarChart = ({ data }) => {
  const maxVal = Math.max(...data.map(d => d.value));
  return (
    <div className="space-y-2.5">
      {data.map((item, i) => {
        const pct = maxVal > 0 ? (item.value / maxVal) * 100 : 0;
        return (
          <div key={i} className="space-y-1">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-bold text-[var(--text-secondary)]">{item.label}</span>
              <span className="text-xs font-black text-[var(--text-primary)]">{formatFullCurrency(item.value)}</span>
            </div>
            <div className="h-2 rounded-full bg-[var(--bg-secondary)] overflow-hidden">
              <motion.div initial={{ width: 0 }} animate={{ width: `${pct}%` }}
                transition={{ duration: 0.5, delay: i * 0.1 }}
                className="h-full rounded-full" style={{ backgroundColor: item.color }} />
            </div>
          </div>
        );
      })}
    </div>
  );
};

const StatCard = ({ icon: Icon, label, value, color, sub }) => (
  <motion.div {...fadeUp}
    className="glass-panel rounded-2xl p-4 border border-[var(--border)] space-y-1.5">
    <div className="flex items-center gap-2">
      <div className="p-2 rounded-xl" style={{ backgroundColor: `${color}15` }}>
        <Icon className="w-4 h-4" style={{ color }} />
      </div>
      <span className="text-[10px] font-bold uppercase tracking-wider text-[var(--text-secondary)]">{label}</span>
    </div>
    <div className="text-xl font-black text-[var(--text-primary)]">{formatFullCurrency(value)}</div>
    {sub && <div className="text-[10px] font-medium text-[var(--text-secondary)]">{sub}</div>}
  </motion.div>
);

export default function FreelanceRateCalc() {
  const h = useFreelanceRate();
  const [activeTab, setActiveTab] = useState('calculator');
  const [showHistory, setShowHistory] = useState(false);

  return (
    <div className="space-y-4">
      <div className="text-center space-y-2">
        <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-gradient-to-br from-emerald-500/20 to-teal-500/20 border border-emerald-500/30">
          <DollarSign className="w-7 h-7 text-emerald-400" />
        </div>
        <h1 className="text-3xl font-black bg-gradient-to-r from-emerald-400 via-teal-400 to-cyan-400 bg-clip-text text-transparent">
          Freelance Rate Calculator
        </h1>
        <p className="text-sm text-[var(--text-secondary)] max-w-md mx-auto">
          Calculate your ideal freelance hourly, daily, weekly & monthly rates.
        </p>
      </div>

      <div className="glass-panel rounded-2xl p-1.5 border border-[var(--border)] flex items-center gap-1 w-fit mx-auto">
        {['calculator', 'history'].map(tab => (
          <button key={tab} onClick={() => setActiveTab(tab)}
            className={`px-4 py-1.5 rounded-xl text-xs font-bold transition-all capitalize flex items-center gap-1.5
              ${activeTab === tab ? 'bg-[var(--accent)]/15 text-[var(--accent)]' : 'text-[var(--text-secondary)] hover:text-[var(--text-primary)]'}`}>
            {tab === 'history' && <History className="w-3 h-3" />}
            {tab}
          </button>
        ))}
      </div>

      <AnimatePresence mode="wait">
        {activeTab === 'calculator' ? (
          <motion.div key="calc" {...fadeUp} className="grid grid-cols-1 lg:grid-cols-12 gap-4">
            <div className="lg:col-span-4 space-y-3">
              <div className="glass-panel rounded-2xl p-4 border border-[var(--border)] space-y-4">
                <h3 className="text-xs font-black uppercase tracking-wider text-[var(--text-secondary)]">Configuration</h3>
                <NumberInput icon={DollarSign} label="Monthly Expenses" value={h.inputs.monthlyExpenses}
                  onChange={v => h.updateInput('monthlyExpenses', v)} prefix="₹" suffix="/mo" accent="#f43f5e" />
                <NumberInput icon={Briefcase} label="Desired Annual Salary" value={h.inputs.desiredSalary}
                  onChange={v => h.updateInput('desiredSalary', v)} prefix="₹" suffix="/yr" accent="#8b5cf6" />
                <NumberInput icon={Clock} label="Working Hours" value={h.inputs.workingHoursPerWeek}
                  onChange={v => h.updateInput('workingHoursPerWeek', v)} suffix="hrs/wk" accent="#0ea5e9" />
                <NumberInput icon={Calendar} label="Vacation Days" value={h.inputs.vacationDays}
                  onChange={v => h.updateInput('vacationDays', v)} suffix="days/yr" accent="#f97316" />
                <NumberInput icon={TrendingUp} label="Tax Rate" value={h.inputs.taxRate}
                  onChange={v => h.updateInput('taxRate', v)} suffix="%" accent="#eab308" />
                <NumberInput icon={Zap} label="Profit Margin" value={h.inputs.profitMargin}
                  onChange={v => h.updateInput('profitMargin', v)} suffix="%" accent="#22c55e" />

                <div className="flex gap-2 pt-1">
                  <button onClick={h.calculate}
                    className="flex-1 py-2.5 rounded-xl text-xs font-black bg-gradient-to-r from-emerald-500 to-teal-500 text-white
                      hover:shadow-lg hover:shadow-emerald-500/25 transition-all flex items-center justify-center gap-1.5">
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
                  <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
                    <StatCard icon={Clock} label="Hourly Rate" value={h.result.hourlyRate} color="#f43f5e" sub={`${h.result.totalWorkingHours} hrs/yr`} />
                    <StatCard icon={Calendar} label="Daily Rate" value={h.result.dailyRate} color="#8b5cf6" sub={`${h.result.totalWorkingDays} days/yr`} />
                    <StatCard icon={BarChart3} label="Weekly Rate" value={h.result.weeklyRevenueTarget} color="#0ea5e9" sub={`${Math.round(h.result.workingWeeks)} weeks/yr`} />
                    <StatCard icon={PieChart} label="Monthly Target" value={h.result.monthlyRevenueTarget} color="#22c55e" sub="Revenue target" />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div className="glass-panel rounded-2xl p-4 border border-[var(--border)] space-y-3">
                      <h3 className="text-xs font-black uppercase tracking-wider text-[var(--text-secondary)] flex items-center gap-2">
                        <PieChart className="w-4 h-4 text-[var(--accent)]" /> Revenue Breakdown
                      </h3>
                      <div className="flex justify-center">
                        <DonutChart data={h.result.chartData} />
                      </div>
                      <div className="flex flex-wrap gap-3 justify-center">
                        {h.result.chartData.map((d, i) => (
                          <span key={i} className="flex items-center gap-1.5 text-[10px] font-bold text-[var(--text-secondary)]">
                            <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: d.color }} />
                            {d.label} ({Math.round(d.value / h.result.chartData.reduce((s, x) => s + x.value, 0) * 100)}%)
                          </span>
                        ))}
                      </div>
                    </div>

                    <div className="glass-panel rounded-2xl p-4 border border-[var(--border)] space-y-3">
                      <h3 className="text-xs font-black uppercase tracking-wider text-[var(--text-secondary)] flex items-center gap-2">
                        <BarChart3 className="w-4 h-4 text-[var(--accent)]" /> Rate Comparison
                      </h3>
                      <BarChart data={h.result.rateComparison} />
                    </div>
                  </div>

                  <div className="glass-panel rounded-2xl p-4 border border-[var(--border)]">
                    <h3 className="text-xs font-black uppercase tracking-wider text-[var(--text-secondary)] mb-3">Summary</h3>
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-center">
                      <div>
                        <div className="text-[10px] font-bold text-[var(--text-secondary)]">Annual Target</div>
                        <div className="text-sm font-black text-[var(--text-primary)]">{formatFullCurrency(h.result.annualRevenueTarget)}</div>
                      </div>
                      <div>
                        <div className="text-[10px] font-bold text-[var(--text-secondary)]">Expenses</div>
                        <div className="text-sm font-black text-rose-400">{formatFullCurrency(h.result.breakdown.expenses)}</div>
                      </div>
                      <div>
                        <div className="text-[10px] font-bold text-[var(--text-secondary)]">Tax Amount</div>
                        <div className="text-sm font-black text-amber-400">{formatFullCurrency(h.result.breakdown.taxAmount)}</div>
                      </div>
                      <div>
                        <div className="text-[10px] font-bold text-[var(--text-secondary)]">Profit</div>
                        <div className="text-sm font-black text-emerald-400">{formatFullCurrency(h.result.breakdown.profitAmount)}</div>
                      </div>
                    </div>
                  </div>
                </>
              ) : (
                <div className="glass-panel rounded-2xl p-12 border border-[var(--border)] flex flex-col items-center justify-center text-center space-y-3 min-h-[400px]">
                  <DollarSign className="w-10 h-10 text-[var(--text-secondary)] opacity-30" />
                  <p className="text-sm font-bold text-[var(--text-secondary)]">Enter your details and click Calculate</p>
                  <p className="text-xs text-[var(--text-secondary)] opacity-60">Your ideal freelance rates will appear here with charts</p>
                </div>
              )}
            </div>
          </motion.div>
        ) : (
          <motion.div key="history" {...fadeUp} className="space-y-3">
            {h.history.length === 0 ? (
              <div className="glass-panel rounded-2xl p-12 border border-[var(--border)] flex flex-col items-center justify-center text-center space-y-3">
                <History className="w-10 h-10 text-[var(--text-secondary)] opacity-30" />
                <p className="text-sm font-bold text-[var(--text-secondary)]">No calculations yet</p>
              </div>
            ) : (
              <>
                <div className="flex justify-end">
                  <button onClick={h.clearHistory} className="text-xs font-bold text-red-400 hover:underline flex items-center gap-1">
                    <Trash2 className="w-3 h-3" /> Clear All
                  </button>
                </div>
                {h.history.map(entry => (
                  <div key={entry.id} className="glass-panel rounded-2xl p-4 border border-[var(--border)] hover:border-[var(--accent)]/30 transition-all space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] font-bold text-[var(--text-secondary)]">
                        {new Date(entry.timestamp).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
                      </span>
                      <div className="flex gap-1">
                        <button onClick={() => { h.loadEntry(entry); setActiveTab('calculator'); }}
                          className="p-1.5 rounded-lg text-[var(--accent)] hover:bg-[var(--accent)]/10 transition-all">
                          <ArrowRight className="w-3 h-3" />
                        </button>
                        <button onClick={() => h.removeEntry(entry.id)}
                          className="p-1.5 rounded-lg text-red-400 hover:bg-red-500/10 transition-all">
                          <Trash2 className="w-3 h-3" />
                        </button>
                      </div>
                    </div>
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs">
                      <div className="p-2 rounded-lg bg-[var(--bg-secondary)] border border-[var(--border)] text-center">
                        <div className="text-[10px] text-[var(--text-secondary)]">Hourly</div>
                        <div className="font-black text-rose-400">{formatFullCurrency(entry.result.hourlyRate)}</div>
                      </div>
                      <div className="p-2 rounded-lg bg-[var(--bg-secondary)] border border-[var(--border)] text-center">
                        <div className="text-[10px] text-[var(--text-secondary)]">Daily</div>
                        <div className="font-black text-purple-400">{formatFullCurrency(entry.result.dailyRate)}</div>
                      </div>
                      <div className="p-2 rounded-lg bg-[var(--bg-secondary)] border border-[var(--border)] text-center">
                        <div className="text-[10px] text-[var(--text-secondary)]">Weekly</div>
                        <div className="font-black text-sky-400">{formatFullCurrency(entry.result.weeklyRevenueTarget)}</div>
                      </div>
                      <div className="p-2 rounded-lg bg-[var(--bg-secondary)] border border-[var(--border)] text-center">
                        <div className="text-[10px] text-[var(--text-secondary)]">Monthly</div>
                        <div className="font-black text-emerald-400">{formatFullCurrency(entry.result.monthlyRevenueTarget)}</div>
                      </div>
                    </div>
                  </div>
                ))}
              </>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
