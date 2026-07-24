import React from 'react';
import { motion } from 'framer-motion';

export default function Tabs({ tabs, active, onChange, className = '' }) {
  return (
    <div className={`glass-panel rounded-2xl p-1.5 border border-[var(--border)] flex items-center gap-1 w-fit mx-auto ${className}`}>
      {tabs.map(tab => (
        <button key={tab.id} onClick={() => onChange(tab.id)}
          className={`flex items-center gap-1.5 px-4 py-1.5 rounded-xl text-xs font-bold transition-all capitalize
            ${active === tab.id ? 'bg-[var(--accent)]/15 text-[var(--accent)]' : 'text-[var(--text-secondary)] hover:text-[var(--text-primary)]'}`}
          role="tab" aria-selected={active === tab.id}>
          {tab.icon && <tab.icon className="w-3 h-3" />}
          {tab.label}
        </button>
      ))}
    </div>
  );
}
