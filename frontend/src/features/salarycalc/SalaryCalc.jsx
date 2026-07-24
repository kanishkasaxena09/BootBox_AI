import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Calculator, IndianRupee, Percent, History, Trash2, ChevronDown,
  Home, UtensilsCrossed, Ticket, Receipt, CircleDollarSign, Plus, X,
  TrendingUp, ArrowDown, ArrowUp, Wallet, PiggyBank, ShieldCheck,
  BarChart3, PieChart, Check,
} from 'lucide-react';
import useSalaryCalc from './useSalaryCalc';

const fadeUp = { initial: { opacity: 0, y: 20 }, animate: { opacity: 1, y: 0 }, transition: { duration: 0.3 } };

const expenseIcons = { Home, UtensilsCrossed, Ticket, Receipt, CircleDollarSign };

const Toggle = ({ checked, onChange, label, subtext }) => (
  <div className="flex items-center justify-between gap-3 p-3 rounded-xl bg-[var(--bg-secondary)] border border-[var(--border)]">
    <div className="min-w-0 flex-1">
      <p className="text-sm font-bold text-[var(--text-primary)]">{label}</p>
      {subtext && <p className="text-[10px] text-[var(--text-secondary)] mt-0.5">{subtext}</p>}
    </div>
    <button onClick={() => onChange(!checked)}
      className={`relative w-11 h-6 rounded-full transition-all duration-300 shrink-0 ${
        checked ? 'bg-[var(--accent)] shadow-lg shadow-[var(--accent)]/30' : 'bg-[var(--bg-primary)] border border-[var(--border)]'
      }`}>
      <motion.div className="absolute top-0.5 w-5 h-5 rounded-full bg-white shadow-md"
        animate={{ left: checked ? '22px' : '2px' }} transition={{ duration: 0.2 }} />
    </button>
  </div>
);

const NumberInput = ({ label, icon: Icon, value, onChange, placeholder, prefix }) => (
  <div className="space-y-1.5">
    <label className="text-xs font-bold uppercase tracking-wider text-[var(--text-secondary)]">{label}</label>
    <div className="relative">
      {Icon && <div className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--text-secondary)]"><Icon className="w-4 h-4" /></div>}
      {prefix && <span className="absolute left-3 top-1/2 -translate-y-1/2 text-xs font-bold text-[var(--text-secondary)] ml-5">{prefix}</span>}
      <input type="number" value={value} onChange={e => onChange(e.target.value)} placeholder={placeholder}
        className={`w-full ${prefix ? 'pl-12' : Icon ? 'pl-9' : 'pl-3'} pr-3 py-2.5 rounded-xl text-sm font-medium outline-none
          bg-[var(--bg-secondary)] border border-[var(--border)] text-[var(--text-primary)]
          hover:border-[var(--accent)] focus:border-[var(--accent)] focus:ring-2 focus:ring-[var(--accent)]/20
          [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none`} />
    </div>
  </div>
);

const StatCard = ({ icon: Icon, label, value, color, sub }) => (
  <div className="glass-panel rounded-2xl p-4 border border-[var(--border)]">
    <div className="flex items-center gap-2 mb-2">
      <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${color}`}>
        <Icon className="w-4 h-4" />
      </div>
      <span className="text-[10px] font-bold uppercase tracking-wider text-[var(--text-secondary)]">{label}</span>
    </div>
    <p className="text-xl font-black text-[var(--text-primary)]">{value}</p>
    {sub && <p className="text-[10px] text-[var(--text-secondary)] mt-0.5">{sub}</p>}
  </div>
);

const SalaryBarChart = ({ items, symbol }) => {
  const maxVal = Math.max(...items.map(i => i.value), 1);
  return (
    <div className="space-y-3">
      {items.map((item, i) => (
        <div key={i} className="space-y-1">
          <div className="flex justify-between items-center">
            <span className="text-xs font-bold text-[var(--text-secondary)]">{item.label}</span>
            <span className="text-xs font-black text-[var(--text-primary)]">{symbol}{item.value.toLocaleString()}</span>
          </div>
          <div className="w-full h-2.5 rounded-full bg-[var(--bg-secondary)] overflow-hidden">
            <motion.div className={`h-full rounded-full ${item.color}`}
              initial={{ width: 0 }} animate={{ width: `${Math.round((item.value / maxVal) * 100)}%` }}
              transition={{ duration: 0.7, delay: i * 0.1, ease: 'easeOut' }} />
          </div>
        </div>
      ))}
    </div>
  );
};

export default function SalaryCalc() {
  const {
    ctc, setCtc, bonus, setBonus,
    deductEpf, setDeductEpf, deductProfTax, setDeductProfTax,
    expenses, updateExpense,
    customExpenses, addCustomExpense, updateCustomExpense, removeCustomExpense,
    result, handleCalculate, canCalculate,
    history, clearHistory, removeHistoryEntry, loadHistoryEntry,
  } = useSalaryCalc();

  const [showHistory, setShowHistory] = useState(false);
  const [copied, setCopied] = useState(false);

  const copy = (text) => {
    navigator.clipboard?.writeText(text).catch(() => {});
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="text-center space-y-2">
        <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-gradient-to-br from-emerald-500/20 to-teal-500/20 border border-emerald-500/30">
          <Calculator className="w-7 h-7 text-emerald-400" />
        </div>
        <h1 className="text-3xl font-black bg-gradient-to-r from-emerald-400 via-teal-400 to-cyan-400 bg-clip-text text-transparent">
          In-Hand Salary Calculator
        </h1>
        <p className="text-sm text-[var(--text-secondary)] max-w-md mx-auto">
          Calculate your actual take-home salary after EPF, professional tax & income tax deductions.
        </p>
      </div>

      {/* Main Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">

        {/* Left: Configuration Panel */}
        <div className="lg:col-span-2 space-y-4">
          <div className="glass-panel rounded-2xl p-5 space-y-5 border border-[var(--border)]">
            <h2 className="text-sm font-black uppercase tracking-wider text-[var(--text-secondary)]">Configuration</h2>

            {/* Section 1: Primary Salary Details */}
            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <div className="w-6 h-6 rounded-md flex items-center justify-center bg-emerald-500/20">
                  <IndianRupee className="w-3.5 h-3.5 text-emerald-400" />
                </div>
                <p className="text-xs font-black uppercase tracking-wider text-emerald-400">Primary Salary Details</p>
              </div>
              <NumberInput label="Total Yearly CTC (Cost to Company)" value={ctc} onChange={setCtc}
                placeholder="e.g. 600000" prefix="₹" />
              <NumberInput label="Expected Annual Bonus (Variable Pay)" value={bonus} onChange={setBonus}
                placeholder="e.g. 50000 (Leave 0 if none)" prefix="₹" />
            </div>

            <div className="w-full h-px bg-[var(--border)]" />

            {/* Section 2: Deductions Toggles */}
            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <div className="w-6 h-6 rounded-md flex items-center justify-center bg-amber-500/20">
                  <Percent className="w-3.5 h-3.5 text-amber-400" />
                </div>
                <p className="text-xs font-black uppercase tracking-wider text-amber-400">Deductions</p>
              </div>
              <Toggle checked={deductEpf} onChange={setDeductEpf} label="Deduct EPF (Provident Fund)"
                subtext="Standard 12% of Basic Pay (Applies to both Emp. & Employer)" />
              <Toggle checked={deductProfTax} onChange={setDeductProfTax} label="Deduct Professional Tax"
                subtext="Avg ₹200/month (Depends on state)" />
            </div>

            <div className="w-full h-px bg-[var(--border)]" />

            {/* Section 3: Monthly Expenses */}
            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <div className="w-6 h-6 rounded-md flex items-center justify-center bg-pink-500/20">
                  <span className="text-sm">🛒</span>
                </div>
                <p className="text-xs font-black uppercase tracking-wider text-pink-400">Monthly Expenses (Optional)</p>
              </div>

              {expenses.map(exp => {
                const Icon = expenseIcons[exp.icon] || CircleDollarSign;
                return (
                  <div key={exp.id} className="space-y-1.5">
                    <label className="text-xs font-bold text-[var(--text-secondary)] flex items-center gap-1.5">
                      <Icon className="w-3 h-3" /> {exp.label}
                    </label>
                    <div className="relative">
                      <span className="absolute left-3 top-1/2 -translate-y-1/2 text-xs font-bold text-[var(--text-secondary)]">₹</span>
                      <input type="number" value={exp.amount || ''} onChange={e => updateExpense(exp.id, e.target.value)}
                        placeholder={exp.placeholder}
                        className="w-full pl-8 pr-3 py-2.5 rounded-xl text-sm font-medium outline-none
                          bg-[var(--bg-secondary)] border border-[var(--border)] text-[var(--text-primary)]
                          hover:border-[var(--accent)] focus:border-[var(--accent)] focus:ring-2 focus:ring-[var(--accent)]/20
                          [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none" />
                    </div>
                  </div>
                );
              })}

              {/* Custom Expenses */}
              <AnimatePresence>
                {customExpenses.map(ce => (
                  <motion.div key={ce.id} initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }} className="space-y-1.5 overflow-hidden">
                    <div className="flex items-center gap-2">
                      <input value={ce.label} onChange={e => updateCustomExpense(ce.id, 'label', e.target.value)}
                        placeholder="Expense name" className="flex-1 px-3 py-2 rounded-xl text-xs font-medium outline-none
                          bg-[var(--bg-secondary)] border border-[var(--border)] text-[var(--text-primary)]
                          focus:border-[var(--accent)]" />
                      <div className="relative w-28">
                        <span className="absolute left-2.5 top-1/2 -translate-y-1/2 text-xs font-bold text-[var(--text-secondary)]">₹</span>
                        <input type="number" value={ce.amount || ''} onChange={e => updateCustomExpense(ce.id, 'amount', e.target.value)}
                          placeholder="0"
                          className="w-full pl-7 pr-2 py-2 rounded-xl text-xs font-medium outline-none
                            bg-[var(--bg-secondary)] border border-[var(--border)] text-[var(--text-primary)]
                            focus:border-[var(--accent)]
                            [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none" />
                      </div>
                      <button onClick={() => removeCustomExpense(ce.id)}
                        className="p-2 rounded-lg text-red-400 hover:text-red-300 hover:bg-red-500/10 transition-all">
                        <X className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>

              <button onClick={addCustomExpense}
                className="w-full py-2.5 rounded-xl text-xs font-bold text-[var(--accent)] border-2 border-dashed border-[var(--accent)]/30
                  hover:border-[var(--accent)]/60 hover:bg-[var(--accent)]/5 transition-all flex items-center justify-center gap-2">
                <Plus className="w-3.5 h-3.5" /> Add Custom Expense
              </button>
            </div>

            {/* Calculate Button */}
            <button onClick={handleCalculate} disabled={!canCalculate}
              className={`w-full py-3 rounded-xl text-sm font-black uppercase tracking-wider transition-all duration-300 flex items-center justify-center gap-2
                ${canCalculate
                  ? 'bg-gradient-to-r from-emerald-500 to-teal-500 text-white shadow-lg shadow-emerald-500/25 hover:shadow-emerald-500/40 hover:scale-[1.02] active:scale-[0.98]'
                  : 'bg-[var(--bg-secondary)] text-[var(--text-secondary)] cursor-not-allowed border border-[var(--border)]'
                }`}>
              <Calculator className="w-4 h-4" /> Calculate In-Hand Salary
            </button>
          </div>

          {/* History */}
          <div className="glass-panel rounded-2xl p-5 border border-[var(--border)]">
            <div className="flex items-center justify-between mb-3">
              <button onClick={() => setShowHistory(!showHistory)}
                className="flex items-center gap-2 text-sm font-bold text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-colors">
                <History className="w-4 h-4" />
                <span>History ({history.length})</span>
                <ChevronDown className={`w-4 h-4 transition-transform ${showHistory ? 'rotate-180' : ''}`} />
              </button>
              {history.length > 0 && (
                <button onClick={clearHistory} className="text-xs text-red-400 hover:text-red-300 font-semibold">Clear All</button>
              )}
            </div>
            <AnimatePresence>
              {showHistory && (
                <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }} className="overflow-hidden space-y-2">
                  {history.length === 0 && <p className="text-xs text-[var(--text-secondary)] py-2">No calculations yet.</p>}
                  {history.map(entry => (
                    <div key={entry.id}
                      className="flex items-center gap-2 p-2.5 rounded-xl bg-[var(--bg-secondary)] border border-[var(--border)] hover:border-[var(--accent)]/30 transition-colors group">
                      <button onClick={() => loadHistoryEntry(entry)} className="flex-1 text-left min-w-0">
                        <p className="text-xs font-bold text-[var(--text-primary)]">CTC ₹{entry.ctc.toLocaleString()}</p>
                        <p className="text-[10px] text-[var(--text-secondary)]">In-hand ₹{entry.result.monthlyInHand.toLocaleString()}/mo</p>
                      </button>
                      <button onClick={() => removeHistoryEntry(entry.id)}
                        className="opacity-0 group-hover:opacity-100 text-red-400 hover:text-red-300 transition-all">
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  ))}
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>

        {/* Right: Output Panel */}
        <div className="lg:col-span-3 space-y-5">
          <AnimatePresence mode="wait">
            {!result ? (
              <motion.div key="empty" {...fadeUp}
                className="glass-panel rounded-2xl p-12 border border-[var(--border)] text-center">
                <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-[var(--accent)]/10 mb-4">
                  <IndianRupee className="w-8 h-8 text-[var(--accent)]/50" />
                </div>
                <p className="text-sm font-bold text-[var(--text-secondary)]">
                  Enter your CTC and click Calculate to see your in-hand salary breakdown.
                </p>
              </motion.div>
            ) : (
              <motion.div key="results" {...fadeUp} className="space-y-5">

                {/* Top Stats */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <StatCard icon={IndianRupee} label="Monthly CTC" value={`₹${result.monthlyCTC.toLocaleString()}`}
                    color="bg-blue-500/20 text-blue-400" sub={`₹${result.annualCTC.toLocaleString()}/year`} />
                  <StatCard icon={Wallet} label="In-Hand / Month" value={`₹${result.monthlyInHand.toLocaleString()}`}
                    color="bg-emerald-500/20 text-emerald-400" sub={`₹${result.annualInHand.toLocaleString()}/year`} />
                  <StatCard icon={ShieldCheck} label="Total Deductions" value={`₹${result.totalDeductionsMonthly.toLocaleString()}`}
                    color="bg-amber-500/20 text-amber-400" sub="EPF + Tax + Prof. Tax" />
                </div>

                {/* Salary Breakdown Bar Chart */}
                <div className="glass-panel rounded-2xl p-5 border border-[var(--border)]">
                  <h3 className="text-sm font-black uppercase tracking-wider text-[var(--text-secondary)] mb-4 flex items-center gap-2">
                    <BarChart3 className="w-4 h-4" /> Monthly Salary Breakdown
                  </h3>
                  <SalaryBarChart symbol="₹" items={[
                    { label: 'Basic', value: result.breakdown.basic, color: 'bg-gradient-to-r from-blue-500 to-blue-400' },
                    { label: 'HRA', value: result.breakdown.hra, color: 'bg-gradient-to-r from-purple-500 to-purple-400' },
                    { label: 'Special Allowance', value: result.breakdown.special, color: 'bg-gradient-to-r from-cyan-500 to-cyan-400' },
                    { label: 'In-Hand Salary', value: result.monthlyInHand, color: 'bg-gradient-to-r from-emerald-500 to-teal-400' },
                  ]} />
                </div>

                {/* Deduction Details */}
                <div className="glass-panel rounded-2xl p-5 border border-[var(--border)]">
                  <h3 className="text-sm font-black uppercase tracking-wider text-[var(--text-secondary)] mb-4 flex items-center gap-2">
                    <Percent className="w-4 h-4" /> Deduction Breakdown
                  </h3>
                  <div className="grid grid-cols-2 gap-3">
                    {[
                      { label: 'Employee EPF', value: result.breakdown.employeeEpf, color: 'text-amber-400', active: result.breakdown.employeeEpf > 0 },
                      { label: 'Employer EPF', value: result.breakdown.employerEpf, color: 'text-amber-400', active: result.breakdown.employerEpf > 0 },
                      { label: 'Gratuity', value: result.breakdown.gratuity, color: 'text-purple-400', active: true },
                      { label: 'Professional Tax', value: result.breakdown.profTax, color: 'text-amber-400', active: result.breakdown.profTax > 0 },
                      { label: 'Income Tax', value: result.breakdown.incomeTax, color: 'text-red-400', active: result.breakdown.incomeTax > 0 },
                    ].filter(d => d.active).map(d => (
                      <div key={d.label} className="flex justify-between items-center p-3 rounded-xl bg-[var(--bg-secondary)] border border-[var(--border)]">
                        <span className="text-xs font-bold text-[var(--text-secondary)]">{d.label}</span>
                        <span className={`text-sm font-black ${d.color}`}>₹{d.value.toLocaleString()}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Monthly Take-Home Summary */}
                <div className="glass-panel rounded-2xl p-5 border border-emerald-500/30 bg-gradient-to-br from-emerald-500/5 to-teal-500/5">
                  <h3 className="text-sm font-black uppercase tracking-wider text-emerald-400 mb-4 flex items-center gap-2">
                    <PiggyBank className="w-4 h-4" /> Take-Home Summary
                  </h3>
                  <div className="space-y-2">
                    {[
                      { label: 'Gross Monthly', value: result.grossMonthly, color: 'text-blue-400' },
                      { label: 'Bonus (Monthly)', value: result.monthlyBonus, color: 'text-purple-400', show: result.monthlyBonus > 0 },
                      { label: '(-) EPF', value: result.breakdown.employeeEpf, color: 'text-amber-400', show: result.breakdown.employeeEpf > 0 },
                      { label: '(-) Professional Tax', value: result.profTaxMonthly, color: 'text-amber-400', show: result.profTaxMonthly > 0 },
                      { label: '(-) Income Tax', value: result.incomeTaxMonthly, color: 'text-red-400', show: result.incomeTaxMonthly > 0 },
                    ].filter(r => r.show !== false).map(r => (
                      <div key={r.label} className="flex justify-between items-center p-2.5 rounded-lg">
                        <span className="text-xs font-bold text-[var(--text-secondary)]">{r.label}</span>
                        <span className={`text-sm font-black ${r.color}`}>₹{r.value.toLocaleString()}</span>
                      </div>
                    ))}
                    <div className="w-full h-px bg-emerald-500/30 my-2" />
                    <div className="flex justify-between items-center p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/20">
                      <span className="text-sm font-black text-emerald-400">In-Hand / Month</span>
                      <span className="text-xl font-black text-emerald-400">₹{result.monthlyInHand.toLocaleString()}</span>
                    </div>
                  </div>
                </div>

                {/* Expenses & Disposable */}
                {result.monthlyExpenses > 0 && (
                  <div className="glass-panel rounded-2xl p-5 border border-[var(--border)]">
                    <h3 className="text-sm font-black uppercase tracking-wider text-[var(--text-secondary)] mb-4 flex items-center gap-2">
                      <span className="text-sm">🛒</span> Expenses & Savings
                    </h3>
                    <div className="space-y-2">
                      {result.expenseBreakdown.map(exp => (
                        <div key={exp.id} className="flex justify-between items-center p-2.5 rounded-lg">
                          <span className="text-xs font-bold text-[var(--text-secondary)]">{exp.label}</span>
                          <span className="text-sm font-black text-pink-400">₹{exp.amount.toLocaleString()}</span>
                        </div>
                      ))}
                      <div className="w-full h-px bg-[var(--border)] my-2" />
                      <div className="flex justify-between items-center p-2.5 rounded-lg">
                        <span className="text-xs font-bold text-[var(--text-secondary)]">Total Expenses</span>
                        <span className="text-sm font-black text-pink-400">₹{result.monthlyExpenses.toLocaleString()}</span>
                      </div>
                      <div className={`flex justify-between items-center p-3 rounded-xl border ${
                        result.disposable >= 0
                          ? 'bg-emerald-500/10 border-emerald-500/20'
                          : 'bg-red-500/10 border-red-500/20'
                      }`}>
                        <span className={`text-sm font-black ${result.disposable >= 0 ? 'text-emerald-400' : 'text-red-400'}`}>
                          {result.disposable >= 0 ? 'Monthly Savings' : 'Shortfall'}
                        </span>
                        <span className={`text-xl font-black ${result.disposable >= 0 ? 'text-emerald-400' : 'text-red-400'}`}>
                          ₹{Math.abs(result.disposable).toLocaleString()}
                        </span>
                      </div>
                      <div className="flex justify-between items-center p-2 rounded-lg">
                        <span className="text-xs font-bold text-[var(--text-secondary)]">Savings Rate</span>
                        <span className={`text-sm font-black ${result.savingsRate >= 20 ? 'text-emerald-400' : result.savingsRate >= 0 ? 'text-amber-400' : 'text-red-400'}`}>
                          {result.savingsRate}%
                        </span>
                      </div>
                    </div>
                  </div>
                )}

                {/* Copy Summary */}
                <button onClick={() => copy(
                  `In-Hand Salary Breakdown:\nCTC: ₹${result.monthlyCTC.toLocaleString()}/mo\nIn-Hand: ₹${result.monthlyInHand.toLocaleString()}/mo\nEPF: ₹${result.breakdown.employeeEpf.toLocaleString()}\nTax: ₹${result.incomeTaxMonthly.toLocaleString()}`
                )}
                  className="w-full py-2.5 rounded-xl text-xs font-bold text-[var(--accent)] border border-[var(--accent)]/30 hover:bg-[var(--accent)]/5 transition-all flex items-center justify-center gap-2">
                  {copied ? <><Check className="w-3.5 h-3.5" /> Copied!</> : 'Copy Summary'}
                </button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}
