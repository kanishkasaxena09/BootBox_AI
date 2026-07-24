import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Play, Pause, RotateCcw } from 'lucide-react';

export default function Timer({ elapsed, running, onStart, onStop, onReset, formatTime }) {
  const progress = Math.min((elapsed / 300) * 100, 100);
  const circumference = 2 * Math.PI * 28;

  return (
    <div className="flex items-center gap-3">
      <div className="relative w-16 h-16">
        <svg className="w-full h-full -rotate-90" viewBox="0 0 60 60">
          <circle cx="30" cy="30" r="28" fill="none" stroke="var(--bg-secondary)" strokeWidth="3" />
          <motion.circle cx="30" cy="30" r="28" fill="none" stroke="url(#timerGradient)" strokeWidth="3"
            strokeDasharray={circumference}
            strokeDashoffset={circumference - (circumference * progress) / 100}
            strokeLinecap="round" transition={{ duration: 0.5 }} />
          <defs>
            <linearGradient id="timerGradient" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#ec4899" />
              <stop offset="100%" stopColor="#f43f5e" />
            </linearGradient>
          </defs>
        </svg>
        <div className="absolute inset-0 flex items-center justify-center">
          <span className="text-[11px] font-mono font-bold text-[var(--text-primary)]">{formatTime(elapsed)}</span>
        </div>
      </div>
      <div className="flex flex-col gap-1.5">
        {!running ? (
          <button onClick={onStart}
            className="flex items-center gap-1 px-3 py-1.5 rounded-lg bg-emerald-500/15 text-emerald-500 text-[11px] font-bold transition-all hover:bg-emerald-500/25">
            <Play className="w-3 h-3" /> Start
          </button>
        ) : (
          <button onClick={onStop}
            className="flex items-center gap-1 px-3 py-1.5 rounded-lg bg-amber-500/15 text-amber-500 text-[11px] font-bold transition-all hover:bg-amber-500/25">
            <Pause className="w-3 h-3" /> Pause
          </button>
        )}
        {elapsed > 0 && (
          <button onClick={onReset}
            className="flex items-center gap-1 px-3 py-1.5 rounded-lg bg-[var(--bg-secondary)] text-[var(--text-secondary)] text-[11px] font-bold transition-all hover:text-[var(--text-primary)] border border-[var(--border)]">
            <RotateCcw className="w-3 h-3" /> Reset
          </button>
        )}
      </div>
    </div>
  );
}
