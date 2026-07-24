import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  LayoutGrid, ListChecks, Globe, Database, Zap, Code, ArrowLeftRight, ChevronDown,
} from 'lucide-react';

function Section({ icon: Icon, title, color, items, isOpen, onToggle }) {
  return (
    <div>
      <button onClick={onToggle}
        className="w-full flex items-center justify-between p-3 rounded-xl bg-[var(--bg-secondary)] border border-[var(--border)] transition-all hover:border-[var(--accent)]/30">
        <div className="flex items-center gap-2">
          <Icon className={`w-4 h-4 ${color}`} />
          <span className="text-xs font-bold text-[var(--text-primary)]">{title}</span>
          <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-[var(--bg-primary)] text-[var(--text-secondary)]">
            {items?.length || 0}
          </span>
        </div>
        <motion.div animate={{ rotate: isOpen ? 180 : 0 }}>
          <ChevronDown className="w-4 h-4 text-[var(--text-secondary)]" />
        </motion.div>
      </button>
      <AnimatePresence>
        {isOpen && (
          <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }} className="overflow-hidden">
            <div className="p-3 mt-1 rounded-xl bg-[var(--bg-secondary)] border border-[var(--border)]">
              <ul className="space-y-1.5">
                {items?.map((item, i) => (
                  <li key={i} className="flex items-start gap-2 text-xs text-[var(--text-primary)]">
                    <span className={`${color} mt-0.5 shrink-0`}>•</span>
                    <span className="leading-relaxed">{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default function SystemDesignQuestion({ systemDesign }) {
  const [openSections, setOpenSections] = useState({});

  if (!systemDesign) return null;

  const toggle = (key) => setOpenSections(prev => ({ ...prev, [key]: !prev[key] }));

  const sections = [
    { key: 'functional', icon: ListChecks, title: 'Functional Requirements', color: 'text-blue-500', items: systemDesign.functionalRequirements },
    { key: 'nonFunctional', icon: Globe, title: 'Non-Functional Requirements', color: 'text-emerald-500', items: systemDesign.nonFunctionalRequirements },
    { key: 'scalability', icon: LayoutGrid, title: 'Scalability Considerations', color: 'text-amber-500', items: systemDesign.scalability },
    { key: 'databases', icon: Database, title: 'Database Suggestions', color: 'text-violet-500', items: systemDesign.databases },
    { key: 'caching', icon: Zap, title: 'Caching Suggestions', color: 'text-orange-500', items: systemDesign.caching },
    { key: 'apiDesign', icon: Code, title: 'API Design', color: 'text-cyan-500', items: systemDesign.apiDesign },
    { key: 'tradeoffs', icon: ArrowLeftRight, title: 'Trade-offs', color: 'text-rose-500', items: systemDesign.tradeoffs },
  ];

  return (
    <div className="glass-panel rounded-2xl p-5 border border-[var(--border)] space-y-4">
      <div className="flex items-center gap-2">
        <div className="p-2 rounded-xl bg-violet-500/10">
          <LayoutGrid className="w-4 h-4 text-violet-500" />
        </div>
        <h4 className="text-sm font-bold text-[var(--text-primary)]">System Design Details</h4>
      </div>

      {/* Architecture Placeholder */}
      <div className="p-6 rounded-xl bg-[var(--bg-secondary)] border border-[var(--border)] border-dashed text-center">
        <LayoutGrid className="w-8 h-8 text-[var(--text-secondary)] opacity-30 mx-auto mb-2" />
        <p className="text-xs font-bold text-[var(--text-secondary)]">Architecture Diagram</p>
        <p className="text-[10px] text-[var(--text-secondary)] opacity-60 mt-0.5">Draw your architecture here during the interview</p>
      </div>

      {/* Expandable Sections */}
      <div className="space-y-2">
        {sections.map(s => (
          <Section key={s.key} icon={s.icon} title={s.title} color={s.color} items={s.items}
            isOpen={!!openSections[s.key]} onToggle={() => toggle(s.key)} />
        ))}
      </div>
    </div>
  );
}
