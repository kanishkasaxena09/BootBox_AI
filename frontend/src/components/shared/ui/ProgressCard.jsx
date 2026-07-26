import React from 'react';
import { motion } from 'framer-motion';

export default function ProgressCard({ value = 0, max = 100, label, color = 'var(--accent)', size = 80, strokeWidth = 6, children, className = '' }) {
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const pct = Math.min(100, Math.max(0, (value / Math.max(1, max)) * 100));
  const offset = circumference - (pct / 100) * circumference;

  return (
    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
      className={`glass-panel rounded-2xl p-4 border border-[var(--border)] flex items-center gap-4 ${className}`}>
      <div className="relative flex-shrink-0" style={{ width: size, height: size }}>
        <svg width={size} height={size} className="-rotate-90">
          <circle cx={size / 2} cy={size / 2} r={radius}
            fill="none" stroke="var(--border)" strokeWidth={strokeWidth} />
          <motion.circle cx={size / 2} cy={size / 2} r={radius}
            fill="none" stroke={color} strokeWidth={strokeWidth}
            strokeLinecap="round" strokeDasharray={circumference}
            initial={{ strokeDashoffset: circumference }}
            animate={{ strokeDashoffset: offset }}
            transition={{ duration: 1, ease: 'easeOut' }} />
        </svg>
        <div className="absolute inset-0 flex items-center justify-center">
          <span className="text-sm font-black" style={{ color }}>{Math.round(pct)}%</span>
        </div>
      </div>
      <div className="flex-1 min-w-0 space-y-1">
        {label && <p className="text-xs font-bold text-[var(--text-primary)]">{label}</p>}
        {children}
      </div>
    </motion.div>
  );
}
