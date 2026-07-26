import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { ClipboardList, Clock, TrendingUp, Target } from 'lucide-react';
import { StatCard } from '../../components/shared';

const CARD_CONFIG = [
  { key: 'assignments', icon: ClipboardList, color: '#6366f1', label: 'Total Assignments' },
  { key: 'todayHours', icon: Clock, color: '#10b981', label: "Today's Study Hours" },
  { key: 'progress', icon: TrendingUp, color: '#f59e0b', label: 'Overall Progress' },
  { key: 'goals', icon: Target, color: '#ec4899', label: 'Goals Completed' },
];

const CIRCLE_RADIUS = 36;
const CIRCLE_CIRCUMFERENCE = 2 * Math.PI * CIRCLE_RADIUS;

function CircularProgress({ progress, color }) {
  const [animatedOffset, setAnimatedOffset] = useState(CIRCLE_CIRCUMFERENCE);

  useEffect(() => {
    const offset = CIRCLE_CIRCUMFERENCE - (progress / 100) * CIRCLE_CIRCUMFERENCE;
    const timer = setTimeout(() => setAnimatedOffset(offset), 100);
    return () => clearTimeout(timer);
  }, [progress]);

  return (
    <div className="relative w-20 h-20">
      <svg className="w-full h-full -rotate-90" viewBox="0 0 80 80">
        <circle cx="40" cy="40" r={CIRCLE_RADIUS} fill="none" stroke="var(--border-color)" strokeWidth="6" />
        <circle
          cx="40" cy="40" r={CIRCLE_RADIUS} fill="none" stroke={color}
          strokeWidth="6" strokeLinecap="round"
          strokeDasharray={CIRCLE_CIRCUMFERENCE}
          strokeDashoffset={animatedOffset}
          style={{ transition: 'stroke-dashoffset 1s ease-out' }}
        />
      </svg>
      <div className="absolute inset-0 flex items-center justify-center">
        <span className="text-sm font-black text-[var(--text-primary)]">{progress}%</span>
      </div>
    </div>
  );
}

export default function TopSummaryCards({ stats }) {
  const hours = (stats.todayMinutes / 60).toFixed(1);
  const progressValue = stats.overallProgress ?? 0;

  const values = {
    assignments: stats.totalAssignments ?? 0,
    todayHours: `${hours}h`,
    progress: null,
    goals: stats.totalGoals > 0 ? `${stats.completedGoals}/${stats.totalGoals}` : '0/0',
  };

  const subtitles = {
    assignments: 'total tasks',
    todayHours: `${stats.todayMinutes ?? 0} minutes logged`,
    progress: null,
    goals: 'targets hit',
  };

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
      {CARD_CONFIG.map((card, i) => {
        const Icon = card.icon;
        return (
          <motion.div
            key={card.key}
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.35, delay: i * 0.08 }}
            className="glass-panel rounded-2xl border border-[var(--border)] p-4 space-y-3"
          >
            <div className="flex items-center justify-between">
              <div
                className="w-9 h-9 rounded-full flex items-center justify-center"
                style={{ backgroundColor: `${card.color}15` }}
              >
                <Icon className="w-4 h-4" style={{ color: card.color }} />
              </div>
              {card.key === 'progress' && (
                <CircularProgress progress={progressValue} color={card.color} />
              )}
            </div>
            <div>
              <p className="text-[10px] font-bold uppercase tracking-wider text-[var(--text-secondary)]">
                {card.label}
              </p>
              {card.key === 'progress' ? (
                <div className="mt-2">
                  <p className="text-2xl font-black text-[var(--text-primary)]">{progressValue}%</p>
                </div>
              ) : (
                <p className="text-2xl font-black text-[var(--text-primary)]">{values[card.key]}</p>
              )}
              <p className="text-[10px] font-medium text-[var(--text-secondary)]">
                {subtitles[card.key]}
              </p>
            </div>
          </motion.div>
        );
      })}
    </div>
  );
}
