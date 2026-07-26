import React from 'react';
import { motion } from 'framer-motion';
import { AlertCircle } from 'lucide-react';

export default function FormField({ label, error, hint, icon: Icon, required, children, className = '' }) {
  return (
    <div className={`space-y-1.5 ${className}`}>
      {label && (
        <label className="text-[10px] font-bold uppercase tracking-wider text-[var(--text-secondary)] flex items-center gap-1.5">
          {Icon && <Icon className="w-3 h-3" />} {label}
          {required && <span className="text-red-400">*</span>}
        </label>
      )}
      {children}
      {hint && !error && (
        <p className="text-[9px] font-medium text-[var(--text-secondary)] opacity-60">{hint}</p>
      )}
      {error && (
        <motion.p initial={{ opacity: 0, y: -4 }} animate={{ opacity: 1, y: 0 }}
          className="text-[10px] font-bold text-red-400 flex items-center gap-1">
          <AlertCircle className="w-3 h-3" /> {error}
        </motion.p>
      )}
    </div>
  );
}
