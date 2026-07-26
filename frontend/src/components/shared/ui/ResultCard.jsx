import React from 'react';
import { motion } from 'framer-motion';

const fadeUp = { initial: { opacity: 0, y: 10 }, animate: { opacity: 1, y: 0 } };

export default function ResultCard({ icon: Icon, label, value, color = 'var(--accent)', sub, children, className = '' }) {
  return (
    <motion.div {...fadeUp}
      className={`glass-panel rounded-2xl p-4 border border-[var(--border)] space-y-2 ${className}`}>
      <div className="flex items-center gap-2">
        {Icon && (
          <div className="p-1.5 rounded-lg" style={{ backgroundColor: `${color}15` }}>
            <Icon className="w-3.5 h-3.5" style={{ color }} />
          </div>
        )}
        <span className="text-[10px] font-bold uppercase tracking-wider text-[var(--text-secondary)]">{label}</span>
      </div>
      <div className="text-lg font-black" style={{ color }}>{value}</div>
      {sub && <p className="text-[10px] font-medium text-[var(--text-secondary)]">{sub}</p>}
      {children}
    </motion.div>
  );
}
