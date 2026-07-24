import React from 'react';
import { motion } from 'framer-motion';

const ProgressBar = ({ progress, currentQ, total, categories, questionCategory }) => {
  return (
    <div className="space-y-3">
      {/* Main progress bar */}
      <div className="flex items-center justify-between">
        <span className="text-xs font-bold text-[var(--text-primary)]">
          Question {currentQ + 1} / {total}
        </span>
        <span className="text-xs font-bold text-pink-500">{progress}%</span>
      </div>
      <div className="h-2 bg-[var(--bg-tertiary)] rounded-full overflow-hidden">
        <motion.div
          className="h-full bg-gradient-to-r from-pink-500 to-rose-500 rounded-full"
          initial={{ width: 0 }}
          animate={{ width: `${progress}%` }}
          transition={{ type: 'spring', stiffness: 100, damping: 20 }}
        />
      </div>

      {/* Category pills */}
      <div className="flex flex-wrap gap-2 pt-1">
        {categories.map(cat => (
          <span
            key={cat.id}
            className={`text-[10px] font-bold px-2.5 py-1 rounded-full transition-all ${
              cat.id === questionCategory
                ? 'bg-pink-500/20 text-pink-500 ring-1 ring-pink-500/30'
                : 'bg-[var(--bg-tertiary)] text-[var(--text-secondary)]'
            }`}
          >
            {cat.icon} {cat.label}
          </span>
        ))}
      </div>
    </div>
  );
};

export default ProgressBar;
