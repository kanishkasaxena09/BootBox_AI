import React from 'react';
import { motion } from 'framer-motion';

const SkeletonCard = ({ index }) => (
  <motion.div
    initial={{ opacity: 0 }}
    animate={{ opacity: 1 }}
    transition={{ delay: index * 0.05 }}
    className="glass-panel border border-[var(--border-color)] p-5 rounded-2xl space-y-4 shadow-sm"
  >
    <div className="flex items-start justify-between">
      <div className="flex items-center space-x-3">
        <div className="w-11 h-11 rounded-xl bg-[var(--bg-secondary)] animate-pulse" />
        <div className="space-y-2">
          <div className="h-3.5 w-36 rounded bg-[var(--bg-secondary)] animate-pulse" />
          <div className="h-2.5 w-20 rounded bg-[var(--bg-secondary)] animate-pulse" />
        </div>
      </div>
      <div className="w-8 h-8 rounded-lg bg-[var(--bg-secondary)] animate-pulse" />
    </div>

    <div className="flex gap-1.5">
      <div className="h-5 w-14 rounded-full bg-[var(--bg-secondary)] animate-pulse" />
      <div className="h-5 w-16 rounded-full bg-[var(--bg-secondary)] animate-pulse" />
      <div className="h-5 w-12 rounded-full bg-[var(--bg-secondary)] animate-pulse" />
    </div>

    <div className="grid grid-cols-2 gap-2">
      {[...Array(4)].map((_, i) => (
        <div key={i} className="flex items-center space-x-1.5">
          <div className="h-3 w-3 rounded bg-[var(--bg-secondary)] animate-pulse" />
          <div className="h-2.5 w-20 rounded bg-[var(--bg-secondary)] animate-pulse" />
        </div>
      ))}
    </div>

    <div className="pt-2 border-t border-[var(--border-color)] flex justify-between">
      <div className="h-2.5 w-24 rounded bg-[var(--bg-secondary)] animate-pulse" />
      <div className="h-2.5 w-16 rounded bg-[var(--bg-secondary)] animate-pulse" />
    </div>
  </motion.div>
);

export default SkeletonCard;
