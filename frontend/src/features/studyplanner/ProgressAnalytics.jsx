import React, { useMemo } from 'react';
import { motion } from 'framer-motion';
import { BarChart3, TrendingUp, BookOpen } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, LineChart, Line, PieChart, Pie, Cell, AreaChart, Area } from 'recharts';
import { SectionHeader, EmptyState } from '../../components/shared';

const fadeUp = { initial: { opacity: 0, y: 10 }, animate: { opacity: 1, y: 0 } };

const CustomTooltip = ({ active, payload, label }) => {
  if (!active || !payload?.length) return null;
  return (
    <div className="glass-panel border border-[var(--border)] rounded-xl px-3 py-2 text-[10px]">
      <p className="font-bold text-[var(--text-primary)]">{label}</p>
      {payload.map((p, i) => <p key={i} style={{ color: p.color }} className="font-bold">{p.value} {p.name === 'minutes' ? 'min' : p.name}</p>)}
    </div>
  );
};

const ProgressAnalytics = ({ stats }) => {
  const { weekData, monthData, subjectStats } = stats;

  const subjectPieData = useMemo(() =>
    Object.values(subjectStats).filter(s => s.total > 0).map(s => ({ name: s.name, value: s.total, color: s.color })),
  [subjectStats]);

  const subjectBarData = useMemo(() =>
    Object.values(subjectStats).filter(s => s.total > 0).map(s => ({ name: s.name.slice(0, 8), completed: s.completed, total: s.total, color: s.color })),
  [subjectStats]);

  const cgpaPrediction = useMemo(() => {
    const avg = subjectPieData.length > 0 ? (subjectPieData.reduce((a, s) => a + s.value, 0) / subjectPieData.length) * 2.5 : 0;
    return Math.min(10, avg).toFixed(1);
  }, [subjectPieData]);

  return (
    <motion.div {...fadeUp} className="glass-panel border border-[var(--border)] rounded-2xl p-6 space-y-5">
      <div className="flex items-center gap-2">
        <div className="p-2 bg-cyan-500/10 rounded-xl"><BarChart3 className="w-4 h-4 text-cyan-500" /></div>
        <h3 className="text-sm font-bold text-[var(--text-primary)]">Progress Analytics</h3>
      </div>

      <div className="space-y-2">
        <SectionHeader icon={BarChart3} label="Weekly Study Hours" />
        <div className="h-[160px]">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={weekData}>
              <XAxis dataKey="label" tick={{ fontSize: 10, fill: 'var(--text-secondary)' }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 10, fill: 'var(--text-secondary)' }} axisLine={false} tickLine={false} width={30} />
              <Tooltip content={<CustomTooltip />} />
              <Bar dataKey="minutes" name="minutes" fill="#6366f1" radius={[6, 6, 0, 0]} maxBarSize={40} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="space-y-2">
        <SectionHeader icon={TrendingUp} label="Monthly Progress" />
        <div className="h-[140px]">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={monthData}>
              <defs><linearGradient id="grad" x1="0" y1="0" x2="0" y2="1"><stop offset="5%" stopColor="#6366f1" stopOpacity={0.3}/><stop offset="95%" stopColor="#6366f1" stopOpacity={0}/></linearGradient></defs>
              <XAxis dataKey="date" tick={{ fontSize: 9, fill: 'var(--text-secondary)' }} axisLine={false} tickLine={false} tickFormatter={d => d.slice(8)} interval={4} />
              <YAxis tick={{ fontSize: 10, fill: 'var(--text-secondary)' }} axisLine={false} tickLine={false} width={30} />
              <Tooltip content={<CustomTooltip />} />
              <Area type="monotone" dataKey="minutes" name="minutes" stroke="#6366f1" fill="url(#grad)" strokeWidth={2} />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="space-y-2">
        <SectionHeader icon={BookOpen} label="Subject Performance" />
        {subjectBarData.length > 0 ? (
          <div className="h-[140px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={subjectBarData} layout="vertical">
                <XAxis type="number" tick={{ fontSize: 10, fill: 'var(--text-secondary)' }} axisLine={false} tickLine={false} />
                <YAxis type="category" dataKey="name" tick={{ fontSize: 10, fill: 'var(--text-secondary)' }} axisLine={false} tickLine={false} width={70} />
                <Tooltip content={<CustomTooltip />} />
                <Bar dataKey="completed" name="completed" fill="#10b981" radius={[0, 6, 6, 0]} maxBarSize={20} />
                <Bar dataKey="total" name="total" fill="#374151" radius={[0, 6, 6, 0]} maxBarSize={20} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        ) : (
          <div className="py-6">
            <EmptyState icon={BarChart3} title="No subject data yet" description="Start tracking study sessions to see analytics." />
          </div>
        )}
      </div>

      <div className="flex items-center gap-4 p-4 rounded-xl bg-gradient-to-r from-indigo-500/5 to-purple-500/5 border border-indigo-500/10">
        <div className="p-3 rounded-xl bg-indigo-500/10">
          <TrendingUp className="w-5 h-5 text-indigo-500" />
        </div>
        <div>
          <p className="text-[10px] font-bold uppercase tracking-wider text-[var(--text-secondary)]">CGPA Prediction</p>
          <p className="text-xl font-black text-indigo-500">{cgpaPrediction}</p>
        </div>
      </div>
    </motion.div>
  );
};

export default ProgressAnalytics;
