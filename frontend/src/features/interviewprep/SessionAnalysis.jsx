import React from 'react';
import { motion } from 'framer-motion';
import {
  Trophy, Target, Clock, CheckCircle2, XCircle, TrendingUp, TrendingDown,
  BarChart3, Star, ArrowLeft, Download, Bookmark, BookmarkCheck, Pencil, Copy,
} from 'lucide-react';

const fadeUp = { initial: { opacity: 0, y: 20 }, animate: { opacity: 1, y: 0 }, transition: { duration: 0.4 } };
const stagger = (i) => ({ initial: { opacity: 0, y: 15 }, animate: { opacity: 1, y: 0 }, transition: { duration: 0.3, delay: i * 0.06 } });

function ScoreRing({ score, size = 80, label, color }) {
  const r = (size - 8) / 2;
  const circ = 2 * Math.PI * r;
  const offset = circ - (circ * score) / 100;
  return (
    <div className="flex flex-col items-center gap-2">
      <div className="relative" style={{ width: size, height: size }}>
        <svg className="w-full h-full -rotate-90" viewBox={`0 0 ${size} ${size}`}>
          <circle cx={size/2} cy={size/2} r={r} fill="none" stroke="var(--bg-secondary)" strokeWidth="5" />
          <motion.circle cx={size/2} cy={size/2} r={r} fill="none" stroke={color} strokeWidth="5"
            strokeDasharray={circ} strokeLinecap="round"
            initial={{ strokeDashoffset: circ }} animate={{ strokeDashoffset: offset }}
            transition={{ duration: 1.2, ease: 'easeOut', delay: 0.3 }} />
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span className="text-xl font-black" style={{ color }}>{score}</span>
          <span className="text-[8px] font-bold text-[var(--text-secondary)]">/100</span>
        </div>
      </div>
      {label && <span className="text-[10px] font-bold text-[var(--text-secondary)]">{label}</span>}
    </div>
  );
}

function MiniBar({ value, max = 100, color }) {
  return (
    <div className="w-full h-2 rounded-full bg-[var(--bg-secondary)] overflow-hidden">
      <motion.div className="h-full rounded-full" style={{ backgroundColor: color }}
        initial={{ width: 0 }} animate={{ width: `${(value / max) * 100}%` }}
        transition={{ duration: 0.8, ease: 'easeOut', delay: 0.5 }} />
    </div>
  );
}

function formatSessionTime(secs) {
  if (secs < 60) return `${secs}s`;
  const m = Math.floor(secs / 60);
  const s = secs % 60;
  return s > 0 ? `${m}m ${s}s` : `${m}m`;
}

export default function SessionAnalysis({ data, onDismiss }) {
  if (!data) return null;
  const { setup, summary, questions } = data;

  const grade = summary.avgScore >= 85 ? 'A' : summary.avgScore >= 70 ? 'B' : summary.avgScore >= 55 ? 'C' : summary.avgScore >= 40 ? 'D' : 'F';
  const gradeColor = { A: '#22c55e', B: '#3b82f6', C: '#f59e0b', D: '#f97316', F: '#ef4444' }[grade];
  const gradeLabel = { A: 'Excellent', B: 'Good', C: 'Average', D: 'Needs Work', F: 'Keep Practicing' }[grade];

  const completionRate = summary.totalQuestions > 0 ? Math.round((summary.completedQuestions / summary.totalQuestions) * 100) : 0;

  const categories = Object.entries(summary.categoryBreakdown);
  const catColors = {
    'Coding': '#3b82f6', 'System Design': '#8b5cf6', 'Technical': '#06b6d4',
    'HR': '#ec4899', 'Behavioral': '#f59e0b', 'Mock Interview': '#22c55e',
  };

  const answered = questions.filter(q => q.completed);
  const skipped = questions.filter(q => !q.completed);

  const handleCopySummary = () => {
    const lines = [
      `Interview Session Summary`,
      `Role: ${setup.role || 'N/A'} | Type: ${setup.interviewType} | Difficulty: ${setup.difficulty}`,
      `Date: ${new Date(data.startTime).toLocaleDateString()}`,
      ``,
      `Score: ${summary.avgScore}/100 (${gradeLabel})`,
      `Completed: ${summary.completedQuestions}/${summary.totalQuestions} questions`,
      `Time: ${formatSessionTime(summary.totalTime)}`,
      ``,
      `Category Breakdown:`,
      ...categories.map(([cat, d]) => `  ${cat}: ${d.completed}/${d.total} completed, avg ${d.avgScore}/100`),
      ``,
      ...answered.map((q, i) => `${i + 1}. [${q.category}] ${q.title} — Score: ${q.scores?.overall || 'N/A'}/100, Time: ${formatSessionTime(q.timeSpent)}`),
    ];
    navigator.clipboard?.writeText(lines.join('\n')).catch(() => {});
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <motion.div {...fadeUp} className="text-center space-y-3">
        <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br from-pink-500/20 to-rose-500/20 border border-pink-500/30">
          <Trophy className="w-8 h-8 text-pink-400" />
        </div>
        <h1 className="text-3xl font-black bg-gradient-to-r from-pink-400 via-rose-400 to-fuchsia-400 bg-clip-text text-transparent">
          Session Complete
        </h1>
        <p className="text-sm text-[var(--text-secondary)]">
          {setup.role && `${setup.role} · `}{setup.interviewType} interview · {summary.totalQuestions} questions
        </p>
      </motion.div>

      {/* Overall Score Card */}
      <motion.div {...fadeUp} className="glass-panel rounded-2xl p-6 border border-[var(--border)]">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-6">
            <ScoreRing score={summary.avgScore} size={100} />
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <span className="text-2xl font-black" style={{ color: gradeColor }}>{grade}</span>
                <span className="text-sm font-bold text-[var(--text-primary)]">{gradeLabel}</span>
              </div>
              <p className="text-xs text-[var(--text-secondary)]">Overall Interview Performance</p>
            </div>
          </div>
          <div className="grid grid-cols-3 gap-6 text-center">
            <div>
              <p className="text-2xl font-black text-[var(--text-primary)]">{summary.completedQuestions}<span className="text-sm text-[var(--text-secondary)]">/{summary.totalQuestions}</span></p>
              <p className="text-[10px] font-bold text-[var(--text-secondary)] uppercase">Completed</p>
            </div>
            <div>
              <p className="text-2xl font-black text-[var(--text-primary)]">{formatSessionTime(summary.totalTime)}</p>
              <p className="text-[10px] font-bold text-[var(--text-secondary)] uppercase">Time Spent</p>
            </div>
            <div>
              <p className="text-2xl font-black text-[var(--text-primary)]">{completionRate}<span className="text-sm text-[var(--text-secondary)]">%</span></p>
              <p className="text-[10px] font-bold text-[var(--text-secondary)] uppercase">Completion</p>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Category Breakdown */}
      {categories.length > 0 && (
        <motion.div {...fadeUp} className="glass-panel rounded-2xl p-5 border border-[var(--border)] space-y-4">
          <h3 className="text-sm font-bold text-[var(--text-primary)] flex items-center gap-2">
            <BarChart3 className="w-4 h-4 text-pink-500" /> Category Breakdown
          </h3>
          <div className="space-y-3">
            {categories.map(([cat, d], i) => (
              <motion.div key={cat} {...stagger(i)} className="space-y-1.5">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: catColors[cat] || 'var(--text-secondary)' }} />
                    <span className="text-xs font-bold text-[var(--text-primary)]">{cat}</span>
                  </div>
                  <div className="flex items-center gap-3 text-[10px] font-bold text-[var(--text-secondary)]">
                    <span>{d.completed}/{d.total} done</span>
                    <span className="px-1.5 py-0.5 rounded" style={{ backgroundColor: `${catColors[cat] || 'var(--text-secondary)'}20`, color: catColors[cat] || 'var(--text-secondary)' }}>
                      {d.avgScore}/100
                    </span>
                  </div>
                </div>
                <MiniBar value={d.avgScore} color={catColors[cat] || 'var(--text-secondary)'} />
              </motion.div>
            ))}
          </div>
        </motion.div>
      )}

      {/* Strong & Weak Areas */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <motion.div {...fadeUp} className="glass-panel rounded-2xl p-5 border border-[var(--border)] space-y-3">
          <h3 className="text-sm font-bold text-emerald-500 flex items-center gap-2">
            <TrendingUp className="w-4 h-4" /> Strong Areas
          </h3>
          {summary.strongAreas.length > 0 ? (
            <div className="flex flex-wrap gap-1.5">
              {summary.strongAreas.map((a, i) => (
                <span key={i} className="text-[10px] font-bold px-2.5 py-1 rounded-full bg-emerald-500/15 text-emerald-500 border border-emerald-500/20">{a}</span>
              ))}
            </div>
          ) : (
            <p className="text-[10px] text-[var(--text-secondary)]">Complete more questions to identify strengths</p>
          )}
        </motion.div>
        <motion.div {...fadeUp} className="glass-panel rounded-2xl p-5 border border-[var(--border)] space-y-3">
          <h3 className="text-sm font-bold text-amber-500 flex items-center gap-2">
            <TrendingDown className="w-4 h-4" /> Areas to Improve
          </h3>
          {summary.weakAreas.length > 0 ? (
            <div className="flex flex-wrap gap-1.5">
              {summary.weakAreas.map((a, i) => (
                <span key={i} className="text-[10px] font-bold px-2.5 py-1 rounded-full bg-amber-500/15 text-amber-500 border border-amber-500/20">{a}</span>
              ))}
            </div>
          ) : (
            <p className="text-[10px] text-[var(--text-secondary)]">No weak areas identified — great job!</p>
          )}
        </motion.div>
      </div>

      {/* Question Detail List */}
      <motion.div {...fadeUp} className="glass-panel rounded-2xl p-5 border border-[var(--border)] space-y-4">
        <h3 className="text-sm font-bold text-[var(--text-primary)] flex items-center gap-2">
          <Target className="w-4 h-4 text-pink-500" /> Question Details
        </h3>

        {/* Answered */}
        {answered.length > 0 && (
          <div className="space-y-2">
            <p className="text-[10px] font-bold text-[var(--text-secondary)] uppercase tracking-wider">Answered ({answered.length})</p>
            {answered.map((q, i) => (
              <motion.div key={q.id} {...stagger(i)}
                className="flex items-center gap-3 p-3 rounded-xl bg-[var(--bg-secondary)] border border-[var(--border)]">
                <div className="shrink-0 w-8 h-8 rounded-lg bg-emerald-500/15 flex items-center justify-center">
                  <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-xs font-bold text-[var(--text-primary)] truncate">{q.title}</p>
                  <div className="flex items-center gap-2 text-[10px] text-[var(--text-secondary)] mt-0.5">
                    <span>{q.category}</span>
                    <span>·</span>
                    <span>{q.difficulty}</span>
                    <span>·</span>
                    <span>{formatSessionTime(q.timeSpent)}</span>
                  </div>
                </div>
                <div className="flex items-center gap-2 shrink-0">
                  {q.scores && (
                    <span className="text-[10px] font-black px-2 py-0.5 rounded-lg bg-pink-500/10 text-pink-500">
                      {q.scores.overall}
                    </span>
                  )}
                  {q.isBookmarked && <BookmarkCheck className="w-3.5 h-3.5 text-pink-500" />}
                </div>
              </motion.div>
            ))}
          </div>
        )}

        {/* Skipped */}
        {skipped.length > 0 && (
          <div className="space-y-2">
            <p className="text-[10px] font-bold text-[var(--text-secondary)] uppercase tracking-wider">Skipped ({skipped.length})</p>
            {skipped.map((q, i) => (
              <motion.div key={q.id} {...stagger(i)}
                className="flex items-center gap-3 p-3 rounded-xl bg-[var(--bg-secondary)] border border-[var(--border)] opacity-60">
                <div className="shrink-0 w-8 h-8 rounded-lg bg-rose-500/15 flex items-center justify-center">
                  <XCircle className="w-4 h-4 text-rose-500" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-xs font-bold text-[var(--text-primary)] truncate">{q.title}</p>
                  <div className="flex items-center gap-2 text-[10px] text-[var(--text-secondary)] mt-0.5">
                    <span>{q.category}</span>
                    <span>·</span>
                    <span>{q.difficulty}</span>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </motion.div>

      {/* Actions */}
      <motion.div {...fadeUp} className="flex flex-col sm:flex-row gap-3">
        <motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}
          onClick={onDismiss}
          className="flex-1 flex items-center justify-center gap-2 px-5 py-3 rounded-xl bg-gradient-to-r from-pink-500 to-rose-500 text-white text-sm font-bold shadow-lg shadow-pink-500/25">
          <ArrowLeft className="w-4 h-4" /> New Session
        </motion.button>
        <motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}
          onClick={handleCopySummary}
          className="flex items-center justify-center gap-2 px-5 py-3 rounded-xl bg-[var(--bg-secondary)] border border-[var(--border)] text-[var(--text-primary)] text-sm font-bold">
          <Copy className="w-4 h-4" /> Copy Summary
        </motion.button>
      </motion.div>
    </div>
  );
}
