import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Code, Terminal, Lightbulb, Zap, ChevronDown, Clock, HardDrive } from 'lucide-react';

export default function CodingQuestion({ coding }) {
  const [showHints, setShowHints] = useState(false);
  const [showApproach, setShowApproach] = useState(false);

  if (!coding) return null;

  return (
    <div className="glass-panel rounded-2xl p-5 border border-[var(--border)] space-y-4">
      <div className="flex items-center gap-2">
        <div className="p-2 rounded-xl bg-blue-500/10">
          <Code className="w-4 h-4 text-blue-500" />
        </div>
        <h4 className="text-sm font-bold text-[var(--text-primary)]">Coding Problem</h4>
      </div>

      {/* Problem Statement */}
      <div className="p-4 rounded-xl bg-[var(--bg-secondary)] border border-[var(--border)]">
        <p className="text-xs font-bold text-[var(--text-secondary)] uppercase tracking-wider mb-2">Problem Statement</p>
        <p className="text-sm text-[var(--text-primary)] leading-relaxed">{coding.problemStatement}</p>
      </div>

      {/* Constraints */}
      <div className="p-4 rounded-xl bg-[var(--bg-secondary)] border border-[var(--border)]">
        <p className="text-xs font-bold text-[var(--text-secondary)] uppercase tracking-wider mb-2">Constraints</p>
        <ul className="space-y-1">
          {coding.constraints?.map((c, i) => (
            <li key={i} className="text-xs text-[var(--text-primary)] font-mono">• {c}</li>
          ))}
        </ul>
      </div>

      {/* Examples */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        <div className="p-4 rounded-xl bg-emerald-500/5 border border-emerald-500/15">
          <p className="text-[10px] font-bold text-emerald-500 uppercase tracking-wider mb-1.5">Example Input</p>
          <code className="text-xs text-[var(--text-primary)] font-mono block whitespace-pre-wrap">{coding.exampleInput}</code>
        </div>
        <div className="p-4 rounded-xl bg-blue-500/5 border border-blue-500/15">
          <p className="text-[10px] font-bold text-blue-500 uppercase tracking-wider mb-1.5">Example Output</p>
          <code className="text-xs text-[var(--text-primary)] font-mono block whitespace-pre-wrap">{coding.exampleOutput}</code>
        </div>
      </div>

      {/* Hints */}
      <div>
        <button onClick={() => setShowHints(!showHints)}
          className="w-full flex items-center justify-between p-3 rounded-xl bg-[var(--bg-secondary)] border border-[var(--border)] transition-all hover:border-amber-500/30">
          <div className="flex items-center gap-2">
            <Lightbulb className="w-4 h-4 text-amber-500" />
            <span className="text-xs font-bold text-[var(--text-primary)]">Hints ({coding.hints?.length || 0})</span>
          </div>
          <motion.div animate={{ rotate: showHints ? 180 : 0 }}>
            <ChevronDown className="w-4 h-4 text-[var(--text-secondary)]" />
          </motion.div>
        </button>
        <AnimatePresence>
          {showHints && (
            <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }} className="overflow-hidden">
              <div className="p-3 mt-1 rounded-xl bg-amber-500/5 border border-amber-500/15 space-y-1.5">
                {coding.hints?.map((h, i) => (
                  <p key={i} className="text-xs text-amber-600 dark:text-amber-400 flex items-start gap-2">
                    <span className="font-bold">{i + 1}.</span> {h}
                  </p>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Optimal Approach */}
      <div>
        <button onClick={() => setShowApproach(!showApproach)}
          className="w-full flex items-center justify-between p-3 rounded-xl bg-[var(--bg-secondary)] border border-[var(--border)] transition-all hover:border-violet-500/30">
          <div className="flex items-center gap-2">
            <Zap className="w-4 h-4 text-violet-500" />
            <span className="text-xs font-bold text-[var(--text-primary)]">Optimal Approach</span>
          </div>
          <motion.div animate={{ rotate: showApproach ? 180 : 0 }}>
            <ChevronDown className="w-4 h-4 text-[var(--text-secondary)]" />
          </motion.div>
        </button>
        <AnimatePresence>
          {showApproach && (
            <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }} className="overflow-hidden">
              <div className="p-3 mt-1 rounded-xl bg-violet-500/5 border border-violet-500/15 space-y-3">
                <p className="text-xs text-[var(--text-primary)]">{coding.optimalApproach}</p>
                <div className="flex items-center gap-4">
                  <div className="flex items-center gap-1.5">
                    <Clock className="w-3.5 h-3.5 text-blue-500" />
                    <span className="text-[10px] font-bold text-[var(--text-secondary)]">Time:</span>
                    <span className="text-[10px] font-bold text-blue-500">{coding.timeComplexity}</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <HardDrive className="w-3.5 h-3.5 text-rose-500" />
                    <span className="text-[10px] font-bold text-[var(--text-secondary)]">Space:</span>
                    <span className="text-[10px] font-bold text-rose-500">{coding.spaceComplexity}</span>
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
