import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  CalendarDays, ListTodo, BarChart3, Target, Clock, Play, Pause, RotateCcw,
  Bell, Brain, Zap
} from 'lucide-react';
import useStudyPlanner from './useStudyPlanner';
import TopSummaryCards from './TopSummaryCards';
import SemesterPlanner from './SemesterPlanner';
import AssignmentTracker from './AssignmentTracker';
import ExamCountdown from './ExamCountdown';
import ProgressAnalytics from './ProgressAnalytics';
import GoalSetting from './GoalSetting';
import StudyCalendar from './StudyCalendar';
import AISmartPlan from './AISmartPlan';
import AIProductivityInsights from './AIProductivityInsights';
import Notifications from './Notifications';
import ExportPanel from './ExportPanel';
import { Tabs, Button, SectionHeader } from '../../components/shared';

const POMO = [
  { id: 'focus', label: 'Focus', mins: 25, color: 'from-indigo-500 to-purple-600' },
  { id: 'short', label: 'Short Break', mins: 5, color: 'from-green-500 to-emerald-600' },
  { id: 'long', label: 'Long Break', mins: 15, color: 'from-amber-500 to-orange-600' },
];

const StudyPlannerTool = () => {
  const store = useStudyPlanner();
  const {
    semester, setSemester, subjects, addSubject, updateSubject, deleteSubject,
    assignments, addAssignment, updateAssignment, deleteAssignment,
    exams, addExam, updateExam, deleteExam,
    goals, addGoal, updateGoal, deleteGoal, toggleGoal,
    events, addEvent, deleteEvent,
    sessions,
    notifications, markNotificationRead, clearNotifications,
    aiPlan, generateAIPlan,
    streaks,
    timerRunning, timerSeconds, timerPreset, timerSubject, startTimer, pauseTimer, resetTimer,
    getStats, getInsights, getSubjectName, getSubjectColor, getTasksForDate, getMonthDays,
  } = store;

  const [activeSection, setActiveSection] = useState('dashboard');
  const [timerSelect, setTimerSelect] = useState('focus');
  const [timerSubjectSelect, setTimerSubjectSelect] = useState('');
  const [showNotifPanel, setShowNotifPanel] = useState(false);

  const stats = useMemo(() => getStats(), [getStats, assignments, sessions, goals, exams, subjects, events, streaks]);

  const formatTime = (s) => `${String(Math.floor(s / 60)).padStart(2, '0')}:${String(s % 60).padStart(2, '0')}`;

  const handleStartTimer = () => startTimer(timerSelect, timerSubjectSelect);

  const sectionTabs = [
    { id: 'dashboard', label: 'Dashboard', icon: BarChart3 },
    { id: 'planner', label: 'Planner', icon: CalendarDays },
    { id: 'assignments', label: 'Tasks', icon: ListTodo },
    { id: 'goals', label: 'Goals', icon: Target },
    { id: 'ai', label: 'AI Plan', icon: Brain },
    { id: 'insights', label: 'Insights', icon: Zap },
  ];

  const unreadCount = notifications.filter(n => !n.read).length;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div className="space-y-1">
          <h2 className="text-2xl font-black bg-gradient-to-r from-indigo-500 to-purple-500 bg-clip-text text-transparent">Study Planner</h2>
          <p className="text-sm text-[var(--text-secondary)]">Plan, track & ace your semester.</p>
        </div>
        <div className="flex items-center gap-2">
          {streaks.current > 0 && (
            <div className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-amber-500/10 border border-amber-500/20">
              <span className="text-amber-500">🔥</span>
              <span className="text-xs font-bold text-amber-500">{streaks.current} day streak</span>
            </div>
          )}
          <div className="relative">
            <Button variant="secondary" size="sm" onClick={() => setShowNotifPanel(!showNotifPanel)} className="relative">
              <Bell className="w-4 h-4" />
              {unreadCount > 0 && <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-red-500 text-white text-[8px] font-bold flex items-center justify-center">{unreadCount}</span>}
            </Button>
          </div>
          <ExportPanel stats={stats} assignments={assignments} exams={exams} goals={goals} subjects={subjects} />
        </div>
      </div>

      <AnimatePresence>
        {showNotifPanel && (
          <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }} className="overflow-hidden">
            <Notifications notifications={notifications} markNotificationRead={markNotificationRead} clearNotifications={clearNotifications} />
          </motion.div>
        )}
      </AnimatePresence>

      <TopSummaryCards stats={stats} />

      <Tabs tabs={sectionTabs} active={activeSection} onChange={setActiveSection} />

      <AnimatePresence mode="wait">
        {activeSection === 'dashboard' && (
          <motion.div key="dash" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
            className="grid grid-cols-1 lg:grid-cols-2 gap-5">
            <div className="glass-panel border border-[var(--border)] rounded-2xl p-6 space-y-4">
              <div className="flex items-center gap-2">
                <Clock className="w-4 h-4 text-indigo-500" />
                <h3 className="text-sm font-bold text-[var(--text-primary)]">Pomodoro Timer</h3>
              </div>
              <div className="flex gap-1.5">
                {POMO.map(p => (
                  <Button key={p.id} variant={timerSelect === p.id ? 'accent' : 'secondary'} size="sm" fullWidth
                    onClick={() => { if (!timerRunning) { setTimerSelect(p.id); resetTimer(p.id); } }}>
                    {p.label}
                  </Button>
                ))}
              </div>
              <select value={timerSubjectSelect} onChange={e => setTimerSubjectSelect(e.target.value)} disabled={timerRunning}
                className="w-full px-3 py-2 rounded-xl bg-[var(--bg-secondary)] border border-[var(--border)] text-xs font-bold text-[var(--text-primary)] focus:outline-none appearance-none">
                <option value="">No subject</option>
                {subjects.map(s => <option key={s.id} value={s.id}>{s.name}</option>)}
              </select>
              <div className="text-center py-8">
                <p className="text-6xl font-black text-[var(--text-primary)] font-mono tracking-wider">{formatTime(timerSeconds)}</p>
              </div>
              <div className="flex gap-2 justify-center">
                {!timerRunning ? (
                  <Button variant="primary" icon={Play} onClick={handleStartTimer} className="!bg-gradient-to-r !from-indigo-500 !to-purple-600 hover:!shadow-lg hover:!shadow-indigo-500/20">
                    Start
                  </Button>
                ) : (
                  <Button variant="secondary" icon={Pause} onClick={pauseTimer} className="!text-amber-500 !border-amber-500/20 hover:!bg-amber-500/10">
                    Pause
                  </Button>
                )}
                <Button variant="secondary" size="sm" onClick={() => resetTimer()}><RotateCcw className="w-3.5 h-3.5" /></Button>
              </div>
              {sessions.length > 0 && (
                <div className="space-y-2 pt-2 border-t border-[var(--border)]">
                  <SectionHeader icon={Clock} label="Recent Sessions" />
                  {sessions.slice(-5).reverse().map(s => (
                    <div key={s.id} className="flex items-center gap-2 py-1">
                      <div className="w-2 h-2 rounded-full" style={{ background: getSubjectColor(s.subjectId) }} />
                      <span className="text-[10px] font-bold text-[var(--text-primary)] flex-1">{getSubjectName(s.subjectId)}</span>
                      <span className="text-[10px] text-[var(--text-secondary)]">{s.duration}m</span>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <ExamCountdown exams={exams} addExam={addExam} deleteExam={deleteExam} subjects={subjects} getSubjectName={getSubjectName} getSubjectColor={getSubjectColor} />
          </motion.div>
        )}

        {activeSection === 'planner' && (
          <motion.div key="plan" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
            className="grid grid-cols-1 lg:grid-cols-2 gap-5">
            <SemesterPlanner semester={semester} setSemester={setSemester} onGenerateAI={() => setActiveSection('ai')} />
            <StudyCalendar events={events} addEvent={addEvent} deleteEvent={deleteEvent} getMonthDays={getMonthDays} />
          </motion.div>
        )}

        {activeSection === 'assignments' && (
          <motion.div key="assign" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
            className="max-w-3xl">
            <AssignmentTracker assignments={assignments} addAssignment={addAssignment} updateAssignment={updateAssignment}
              deleteAssignment={deleteAssignment} subjects={subjects} getSubjectName={getSubjectName} getSubjectColor={getSubjectColor} />
          </motion.div>
        )}

        {activeSection === 'goals' && (
          <motion.div key="goals" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
            className="grid grid-cols-1 lg:grid-cols-2 gap-5">
            <GoalSetting goals={goals} addGoal={addGoal} updateGoal={updateGoal} deleteGoal={deleteGoal} toggleGoal={toggleGoal} />
            <ProgressAnalytics stats={stats} />
          </motion.div>
        )}

        {activeSection === 'ai' && (
          <motion.div key="ai" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
            className="grid grid-cols-1 lg:grid-cols-2 gap-5">
            <AISmartPlan subjects={subjects} generateAIPlan={generateAIPlan} aiPlan={aiPlan} />
            <AIProductivityInsights getInsights={getInsights} />
          </motion.div>
        )}

        {activeSection === 'insights' && (
          <motion.div key="insights" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
            className="grid grid-cols-1 lg:grid-cols-2 gap-5">
            <ProgressAnalytics stats={stats} />
            <AIProductivityInsights getInsights={getInsights} />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default StudyPlannerTool;
