import React, { useMemo } from 'react';
import { motion } from 'framer-motion';
import {
  LayoutDashboard, Mail, Briefcase, Languages, FileText, MessageSquare,
  Link2, CalendarClock, Calculator, GraduationCap, HeartHandshake,
  DollarSign, User, Send, Clock, ArrowRight, TrendingUp, Sparkles,
  History, Star, Zap,
} from 'lucide-react';

const fadeUp = { initial: { opacity: 0, y: 10 }, animate: { opacity: 1, y: 0 }, transition: { duration: 0.2 } };

const TOOLS = [
  { key: 'emailgen', label: 'Email Generator', icon: Mail, color: 'from-violet-500 to-purple-500', route: 'tools', storageKey: 'solmates_emailgen_history', dateField: 'date' },
  { key: 'coverletter', label: 'Cover Letter', icon: FileText, color: 'from-blue-500 to-indigo-500', route: 'tools', storageKey: 'solmates_coverletter_history', dateField: 'date' },
  { key: 'interview', label: 'Interview Prep', icon: GraduationCap, color: 'from-emerald-500 to-teal-500', route: 'tools', storageKey: 'solmates_interview_history', dateField: 'date' },
  { key: 'linkedin', label: 'LinkedIn Suite', icon: Link2, color: 'from-sky-500 to-blue-500', route: 'tools', storageKey: 'bootbox_linkedin_history', dateField: 'timestamp' },
  { key: 'excuse', label: 'Excuse Generator', icon: MessageSquare, color: 'from-amber-500 to-orange-500', route: 'tools', storageKey: 'bootbox_excuse_history', dateField: 'timestamp' },
  { key: 'corporate', label: 'Corporate Translator', icon: Languages, color: 'from-rose-500 to-pink-500', route: 'tools', storageKey: 'bootbox_corp_translator_history', dateField: 'timestamp' },
  { key: 'resignation', label: 'Resignation Letter', icon: Send, color: 'from-red-500 to-rose-500', route: 'tools', storageKey: 'bootbox_resignation_data', dateField: null },
  { key: 'salary', label: 'Salary Calculator', icon: DollarSign, color: 'from-lime-500 to-green-500', route: 'tools', storageKey: 'bootbox_salary_history', dateField: 'timestamp' },
  { key: 'notice', label: 'Notice Period', icon: CalendarClock, color: 'from-cyan-500 to-teal-500', route: 'tools', storageKey: 'bootbox_notice_period_history', dateField: 'timestamp' },
  { key: 'freelance', label: 'Freelance Rate', icon: HeartHandshake, color: 'from-fuchsia-500 to-pink-500', route: 'tools', storageKey: 'bootbox_freelance_rate_history', dateField: 'timestamp' },
  { key: 'careertest', label: 'Career Test', icon: TrendingUp, color: 'from-yellow-500 to-amber-500', route: 'tools', storageKey: 'solmates_careertest_history', dateField: 'date' },
  { key: 'jobsearch', label: 'Job Search', icon: Briefcase, color: 'from-indigo-500 to-violet-500', route: 'tools', storageKey: 'savedJobs', dateField: null },
];

function readStorage(key) {
  try {
    const raw = localStorage.getItem(key);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch { return []; }
}

function readSingle(key) {
  try {
    const raw = localStorage.getItem(key);
    return raw ? JSON.parse(raw) : null;
  } catch { return null; }
}

function timeAgo(dateStr) {
  if (!dateStr) return '';
  const diff = Date.now() - new Date(dateStr).getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 1) return 'Just now';
  if (mins < 60) return `${mins}m ago`;
  const hours = Math.floor(mins / 60);
  if (hours < 24) return `${hours}h ago`;
  const days = Math.floor(hours / 24);
  if (days < 7) return `${days}d ago`;
  return new Date(dateStr).toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
}

export default function Dashboard({ onNavigate }) {
  const toolData = useMemo(() => {
    return TOOLS.map(tool => {
      const history = readStorage(tool.storageKey);
      const count = tool.key === 'jobsearch'
        ? history.length
        : tool.key === 'resignation'
          ? (readSingle(tool.storageKey) ? 1 : 0)
          : history.length;
      return { ...tool, history, count };
    });
  }, []);

  const totalItems = useMemo(() => toolData.reduce((sum, t) => sum + t.count, 0), [toolData]);

  const recentActivity = useMemo(() => {
    const all = [];
    toolData.forEach(tool => {
      if (tool.key === 'resignation' || tool.key === 'jobsearch') return;
      tool.history.slice(0, 5).forEach(entry => {
        const dateStr = entry[tool.dateField] || entry.date || entry.timestamp;
        all.push({
          id: entry.id || `${tool.key}-${Math.random()}`,
          tool: tool.label,
          toolKey: tool.key,
          icon: tool.icon,
          color: tool.color,
          date: dateStr,
          timeAgo: timeAgo(dateStr),
          preview: entry.output || entry.excuse || entry.result || entry.topCareer || '',
        });
      });
    });
    all.sort((a, b) => {
      const da = a.date ? new Date(a.date).getTime() : 0;
      const db = b.date ? new Date(b.date).getTime() : 0;
      return db - da;
    });
    return all.slice(0, 15);
  }, [toolData]);

  const activeTools = toolData.filter(t => t.count > 0).length;

  return (
    <div className="space-y-6">
      <div className="text-center space-y-2">
        <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-gradient-to-br from-pink-500/20 to-rose-500/20 border border-pink-500/30">
          <LayoutDashboard className="w-7 h-7 text-pink-400" />
        </div>
        <h1 className="text-3xl font-black bg-gradient-to-r from-pink-500 via-rose-500 to-red-500 bg-clip-text text-transparent">
          Dashboard
        </h1>
        <p className="text-sm text-[var(--text-secondary)] max-w-lg mx-auto">
          Your activity across all BootBox tools at a glance.
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {[
          { label: 'Total Items', value: totalItems, icon: Zap, color: 'text-pink-400' },
          { label: 'Active Tools', value: `${activeTools}/${TOOLS.length}`, icon: TrendingUp, color: 'text-emerald-400' },
          { label: 'Recent Actions', value: recentActivity.length, icon: Clock, color: 'text-sky-400' },
          { label: 'Bookmarks', value: (() => { try { return JSON.parse(localStorage.getItem('solmates_interview_bookmarks') || '[]').length; } catch { return 0; } })(), icon: Star, color: 'text-amber-400' },
        ].map((stat, i) => (
          <motion.div key={stat.label} {...fadeUp} transition={{ ...fadeUp.transition, delay: i * 0.05 }}
            className="glass-panel rounded-2xl p-4 border border-[var(--border)]">
            <div className="flex items-center gap-2 mb-2">
              <stat.icon className={`w-4 h-4 ${stat.color}`} />
              <span className="text-xs font-bold text-[var(--text-secondary)] uppercase tracking-wider">{stat.label}</span>
            </div>
            <p className="text-2xl font-black text-[var(--text-primary)]">{stat.value}</p>
          </motion.div>
        ))}
      </div>

      {/* Tool Activity Grid */}
      <div>
        <h2 className="text-sm font-black uppercase tracking-wider text-[var(--text-secondary)] mb-3 flex items-center gap-2">
          <Sparkles className="w-4 h-4 text-[var(--accent)]" /> Tool Usage
        </h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3">
          {toolData.map((tool, i) => (
            <motion.button key={tool.key} {...fadeUp} transition={{ ...fadeUp.transition, delay: i * 0.03 }}
              onClick={() => onNavigate(tool.route)}
              className="glass-panel rounded-2xl p-4 border border-[var(--border)] hover:border-[var(--accent)]/50 transition-all text-left group">
              <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${tool.color} flex items-center justify-center mb-3 group-hover:scale-110 transition-transform`}>
                <tool.icon className="w-5 h-5 text-white" />
              </div>
              <p className="text-xs font-bold text-[var(--text-primary)] truncate">{tool.label}</p>
              <p className="text-lg font-black text-[var(--text-primary)] mt-1">{tool.count}</p>
              <p className="text-[10px] text-[var(--text-secondary)]">
                {tool.count === 0 ? 'No data yet' : tool.count === 1 ? '1 entry' : `${tool.count} entries`}
              </p>
            </motion.button>
          ))}
        </div>
      </div>

      {/* Recent Activity */}
      <div>
        <h2 className="text-sm font-black uppercase tracking-wider text-[var(--text-secondary)] mb-3 flex items-center gap-2">
          <History className="w-4 h-4 text-[var(--accent)]" /> Recent Activity
        </h2>
        {recentActivity.length === 0 ? (
          <div className="glass-panel rounded-2xl p-8 border border-[var(--border)] text-center">
            <History className="w-10 h-10 text-[var(--text-secondary)] mx-auto mb-3 opacity-50" />
            <p className="text-sm font-bold text-[var(--text-secondary)]">No activity yet</p>
            <p className="text-xs text-[var(--text-secondary)] mt-1">Start using tools to see your activity here</p>
            <button onClick={() => onNavigate('tools')}
              className="mt-4 px-4 py-2 rounded-xl bg-gradient-to-r from-pink-500 to-rose-500 text-white text-xs font-bold hover:shadow-lg hover:shadow-pink-500/30 transition-all">
              Explore Tools
            </button>
          </div>
        ) : (
          <div className="space-y-2">
            {recentActivity.map((item, i) => (
              <motion.div key={item.id + i} {...fadeUp} transition={{ ...fadeUp.transition, delay: i * 0.03 }}
                className="glass-panel rounded-xl p-3 border border-[var(--border)] flex items-center gap-3 hover:border-[var(--accent)]/30 transition-all">
                <div className={`w-8 h-8 rounded-lg bg-gradient-to-br ${item.color} flex items-center justify-center shrink-0`}>
                  <item.icon className="w-4 h-4 text-white" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <p className="text-xs font-bold text-[var(--text-primary)]">{item.tool}</p>
                    <span className="text-[10px] text-[var(--text-secondary)]">{item.timeAgo}</span>
                  </div>
                  {item.preview && (
                    <p className="text-[11px] text-[var(--text-secondary)] truncate mt-0.5">{item.preview}</p>
                  )}
                </div>
                <ArrowRight className="w-3.5 h-3.5 text-[var(--text-secondary)] shrink-0" />
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
