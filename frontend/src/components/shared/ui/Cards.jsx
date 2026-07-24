import React from 'react';
import { motion } from 'framer-motion';

export function StatCard({ icon: Icon, label, value, sub, color = 'var(--accent)' }) {
  return (
    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
      className="glass-panel rounded-2xl p-4 border border-[var(--border)] space-y-1.5">
      <div className="flex items-center gap-2">
        <div className="p-2 rounded-xl" style={{ backgroundColor: `${color}15` }}>
          <Icon className="w-4 h-4" style={{ color }} />
        </div>
        <span className="text-[10px] font-bold uppercase tracking-wider text-[var(--text-secondary)]">{label}</span>
      </div>
      <div className="text-xl font-black text-[var(--text-primary)]">{value}</div>
      {sub && <div className="text-[10px] font-medium text-[var(--text-secondary)]">{sub}</div>}
    </motion.div>
  );
}

export function EmptyState({ icon: Icon, title, description, action }) {
  return (
    <div className="glass-panel rounded-2xl p-12 border border-[var(--border)] flex flex-col items-center justify-center text-center space-y-3 min-h-[300px]">
      <Icon className="w-10 h-10 text-[var(--text-secondary)] opacity-30" />
      <p className="text-sm font-bold text-[var(--text-secondary)]">{title}</p>
      {description && <p className="text-xs text-[var(--text-secondary)] opacity-60 max-w-sm">{description}</p>}
      {action}
    </div>
  );
}

export function SectionHeader({ icon: Icon, label, children }) {
  return (
    <div className="flex items-center justify-between">
      <h3 className="text-xs font-black uppercase tracking-wider text-[var(--text-secondary)] flex items-center gap-2">
        {Icon && <Icon className="w-4 h-4 text-[var(--accent)]" />} {label}
      </h3>
      {children}
    </div>
  );
}

export function PanelHeader({ filename, children }) {
  return (
    <div className="px-4 py-2.5 bg-[var(--bg-primary)] border-b border-[var(--border)] flex items-center justify-between">
      <div className="flex items-center gap-2">
        <div className="flex gap-1.5">
          <div className="w-2.5 h-2.5 rounded-full bg-red-500/60" />
          <div className="w-2.5 h-2.5 rounded-full bg-amber-500/60" />
          <div className="w-2.5 h-2.5 rounded-full bg-emerald-500/60" />
        </div>
        <span className="text-[10px] font-bold text-[var(--text-secondary)]">{filename}</span>
      </div>
      <div className="flex items-center gap-1.5">{children}</div>
    </div>
  );
}
