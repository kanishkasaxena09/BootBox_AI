import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { BarChart3, Bookmark, Clock, Flame, Star, TrendingUp, TrendingDown, Target, Award } from 'lucide-react';

export default function ProgressDashboard({ history, bookmarks, streak, overallProgress, allQuestions }) {
  const [tab, setTab] = useState('stats');

  const avgScore = overallProgress.avgScore || 0;
  const completedCount = history.length;
  const bookmarkedQuestions = allQuestions?.filter(q => bookmarks.includes(q.id)) || [];

  const recentHistory = history.slice(0, 15);

  return (
    <div className="space-y-4">
      {/* Stats Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {[
          { icon: Flame, label: 'Streak', value: `${streak} day${streak !== 1 ? 's' : ''}`, color: 'text-orange-500', bg: 'bg-orange-500/10' },
          { icon: Clock, label: 'Sessions', value: completedCount, color: 'text-blue-500', bg: 'bg-blue-500/10' },
          { icon: Star, label: 'Avg Score', value: `${avgScore.toFixed(1)}/100`, color: 'text-amber-500', bg: 'bg-amber-500/10' },
          { icon: Bookmark, label: 'Bookmarks', value: bookmarks.length, color: 'text-pink-500', bg: 'bg-pink-500/10' },
        ].map((s, i) => (
          <motion.div key={i} initial={{ y: 10, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: i * 0.05 }}
            className="glass-panel border border-[var(--border)] rounded-xl p-4 space-y-2">
            <div className={`p-2 ${s.bg} rounded-lg w-fit`}>
              <s.icon className={`w-4 h-4 ${s.color}`} />
            </div>
            <p className="text-lg font-black text-[var(--text-primary)]">{s.value}</p>
            <p className="text-[10px] font-bold text-[var(--text-secondary)] uppercase">{s.label}</p>
          </motion.div>
        ))}
      </div>

      {/* Tabs */}
      <div className="flex gap-1 bg-[var(--bg-secondary)] rounded-xl p-1 border border-[var(--border)]">
        {[
          { id: 'stats', label: 'History', icon: Clock },
          { id: 'bookmarks', label: 'Bookmarks', icon: Bookmark },
          { id: 'topics', label: 'Topics', icon: Target },
        ].map(t => (
          <button key={t.id} onClick={() => setTab(t.id)}
            className={`flex-1 flex items-center justify-center gap-1.5 px-3 py-2 rounded-lg text-[11px] font-bold transition-all
              ${tab === t.id
                ? 'bg-[var(--bg-primary)] text-[var(--text-primary)] shadow-sm border border-[var(--border)]'
                : 'text-[var(--text-secondary)] hover:text-[var(--text-primary)]'}`}>
            <t.icon className="w-3 h-3" /> {t.label}
          </button>
        ))}
      </div>

      {/* Tab Content */}
      {tab === 'stats' && (
        <div className="space-y-2">
          {recentHistory.length === 0 ? (
            <div className="glass-panel border border-[var(--border)] rounded-2xl p-8 text-center">
              <Clock className="w-8 h-8 text-[var(--text-secondary)] mx-auto mb-2 opacity-30" />
              <p className="text-sm font-bold text-[var(--text-secondary)]">No sessions yet</p>
              <p className="text-xs text-[var(--text-secondary)] opacity-60">Complete questions to see your history here</p>
            </div>
          ) : recentHistory.map((h, i) => (
            <motion.div key={h.id} initial={{ x: -10, opacity: 0 }} animate={{ x: 0, opacity: 1 }}
              transition={{ delay: i * 0.03 }}
              className="glass-panel border border-[var(--border)] rounded-xl p-3 flex items-center justify-between gap-3">
              <div className="flex-1 min-w-0">
                <p className="text-xs font-bold text-[var(--text-primary)] truncate">{h.title}</p>
                <div className="flex items-center gap-2 text-[10px] text-[var(--text-secondary)] mt-0.5">
                  <span>{h.category}</span>
                  <span>·</span>
                  <span>{h.difficulty}</span>
                  <span>·</span>
                  <span>{Math.floor(h.elapsed / 60)}m {h.elapsed % 60}s</span>
                </div>
              </div>
              {h.scores && (
                <div className="flex items-center gap-1 px-2 py-1 rounded-lg bg-pink-500/10 shrink-0">
                  <Star className="w-3 h-3 text-pink-500" />
                  <span className="text-[10px] font-bold text-pink-500">{h.scores.overall}</span>
                </div>
              )}
            </motion.div>
          ))}
        </div>
      )}

      {tab === 'bookmarks' && (
        <div className="space-y-2">
          {bookmarkedQuestions.length === 0 ? (
            <div className="glass-panel border border-[var(--border)] rounded-2xl p-8 text-center">
              <Bookmark className="w-8 h-8 text-[var(--text-secondary)] mx-auto mb-2 opacity-30" />
              <p className="text-sm font-bold text-[var(--text-secondary)]">No bookmarks yet</p>
              <p className="text-xs text-[var(--text-secondary)] opacity-60">Bookmark questions to review later</p>
            </div>
          ) : bookmarkedQuestions.map((q, i) => (
            <motion.div key={q.id} initial={{ x: -10, opacity: 0 }} animate={{ x: 0, opacity: 1 }}
              transition={{ delay: i * 0.03 }}
              className="glass-panel border border-[var(--border)] rounded-xl p-3">
              <p className="text-xs font-bold text-[var(--text-primary)]">{q.title}</p>
              <div className="flex items-center gap-2 mt-1">
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-[var(--bg-secondary)] text-[var(--text-secondary)] border border-[var(--border)]">
                  {q.category}
                </span>
                {q.difficulty && (
                  <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                    q.difficulty === 'Easy' ? 'bg-emerald-500/15 text-emerald-500'
                    : q.difficulty === 'Medium' ? 'bg-amber-500/15 text-amber-500'
                    : 'bg-rose-500/15 text-rose-500'
                  }`}>{q.difficulty}</span>
                )}
              </div>
            </motion.div>
          ))}
        </div>
      )}

      {tab === 'topics' && (
        <div className="space-y-4">
          {/* Strong Topics */}
          <div className="glass-panel border border-[var(--border)] rounded-xl p-4 space-y-2">
            <p className="text-xs font-bold text-emerald-500 flex items-center gap-1.5">
              <TrendingUp className="w-3.5 h-3.5" /> Strong Topics
            </p>
            {overallProgress.strongTopics?.length > 0 ? (
              <div className="flex flex-wrap gap-1.5">
                {overallProgress.strongTopics.map((t, i) => (
                  <span key={i} className="text-[10px] font-bold px-2.5 py-1 rounded-full bg-emerald-500/15 text-emerald-500 border border-emerald-500/20">
                    {t}
                  </span>
                ))}
              </div>
            ) : (
              <p className="text-[10px] text-[var(--text-secondary)]">Complete questions with high scores to identify strong topics</p>
            )}
          </div>

          {/* Weak Topics */}
          <div className="glass-panel border border-[var(--border)] rounded-xl p-4 space-y-2">
            <p className="text-xs font-bold text-amber-500 flex items-center gap-1.5">
              <TrendingDown className="w-3.5 h-3.5" /> Areas for Improvement
            </p>
            {overallProgress.weakTopics?.length > 0 ? (
              <div className="flex flex-wrap gap-1.5">
                {overallProgress.weakTopics.map((t, i) => (
                  <span key={i} className="text-[10px] font-bold px-2.5 py-1 rounded-full bg-amber-500/15 text-amber-500 border border-amber-500/20">
                    {t}
                  </span>
                ))}
              </div>
            ) : (
              <p className="text-[10px] text-[var(--text-secondary)]">Keep practicing to identify areas that need more focus</p>
            )}
          </div>

          {/* Progress Bar */}
          <div className="glass-panel border border-[var(--border)] rounded-xl p-4 space-y-2">
            <div className="flex items-center justify-between">
              <p className="text-xs font-bold text-[var(--text-secondary)]">Overall Progress</p>
              <span className="text-[10px] font-bold text-[var(--text-primary)]">{overallProgress.total} questions answered</span>
            </div>
            <div className="h-2 bg-[var(--bg-secondary)] rounded-full overflow-hidden">
              <motion.div initial={{ width: 0 }}
                animate={{ width: `${Math.min((overallProgress.total / (allQuestions?.length || 30)) * 100, 100)}%` }}
                className="h-full bg-gradient-to-r from-pink-500 to-rose-500 rounded-full" />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
