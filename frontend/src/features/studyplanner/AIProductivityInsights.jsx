import React from 'react';
import { motion } from 'framer-motion';
import { Brain, Clock, Sun, Calendar, BookOpen, Zap, AlertTriangle, Target, Gauge, TrendingUp } from 'lucide-react';

const fadeUp = { initial: { opacity: 0, y: 10 }, animate: { opacity: 1, y: 0 } };

const InsightCard = ({ icon: Icon, label, value, color, sub }) => (
  <motion.div {...fadeUp} className="p-3 rounded-xl bg-[var(--bg-secondary)]/50 border border-[var(--border)] space-y-1.5">
    <div className="flex items-center gap-2">
      <div className="p-1.5 rounded-lg" style={{ background: color + '15' }}><Icon className="w-3.5 h-3.5" style={{ color }} /></div>
      <span className="text-[10px] font-bold uppercase tracking-wider text-[var(--text-secondary)]">{label}</span>
    </div>
    <p className="text-sm font-black text-[var(--text-primary)]">{value}</p>
    {sub && <p className="text-[9px] text-[var(--text-secondary)]">{sub}</p>}
  </motion.div>
);

const ScoreBar = ({ label, score, color }) => (
  <div className="space-y-1">
    <div className="flex items-center justify-between">
      <span className="text-[10px] font-bold text-[var(--text-secondary)]">{label}</span>
      <span className="text-[10px] font-bold" style={{ color }}>{score}/100</span>
    </div>
    <div className="h-1.5 rounded-full bg-[var(--bg-secondary)]">
      <motion.div initial={{ width: 0 }} animate={{ width: `${score}%` }} transition={{ duration: 1, delay: 0.3 }}
        className="h-full rounded-full" style={{ background: color }} />
    </div>
  </div>
);

const AIProductivityInsights = ({ getInsights }) => {
  const insights = getInsights();

  return (
    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="glass-panel border border-[var(--border)] rounded-2xl p-6 space-y-5">
      <div className="flex items-center gap-2">
        <div className="p-2 bg-violet-500/10 rounded-xl"><Brain className="w-4 h-4 text-violet-500" /></div>
        <h3 className="text-sm font-bold text-[var(--text-primary)]">AI Productivity Insights</h3>
      </div>

      <div className="grid grid-cols-2 gap-3">
        <InsightCard icon={Sun} label="Best Study Time" value={insights.bestStudyTime} color="#f59e0b" />
        <InsightCard icon={Calendar} label="Most Productive Day" value={insights.mostProductiveDay} color="#6366f1" />
        <InsightCard icon={Clock} label="Avg Focus Time" value={insights.avgFocusTime} color="#10b981" />
        <InsightCard icon={BookOpen} label="Difficult Subject" value={insights.difficultSubject} color="#ef4444" />
        <InsightCard icon={Target} label="Recommended Hours" value={insights.recommendedHours} color="#8b5cf6" />
        <InsightCard icon={AlertTriangle} label="Burnout Risk" value={insights.burnoutRisk}
          color={insights.burnoutRisk === 'Low' ? '#10b981' : insights.burnoutRisk === 'Medium' ? '#f59e0b' : '#ef4444'}
          sub={insights.burnoutRisk === 'High' ? 'Take more breaks!' : 'Keep it up!'} />
      </div>

      <div className="space-y-3 pt-2">
        <h4 className="text-[10px] font-bold uppercase tracking-wider text-[var(--text-secondary)]">Performance Scores</h4>
        <ScoreBar label="Focus Score" score={insights.focusScore} color="#6366f1" />
        <ScoreBar label="Consistency Score" score={insights.consistencyScore} color="#10b981" />
        <ScoreBar label="Learning Speed" score={insights.learningSpeed === 'Fast' ? 85 : insights.learningSpeed === 'Moderate' ? 60 : 35} color="#8b5cf6" />
      </div>
    </motion.div>
  );
};

export default AIProductivityInsights;
