import { useState, useCallback, useEffect, useRef, useMemo } from 'react';
import useLocalStorage from '../../components/shared/hooks/useLocalStorage';

const uid = () => `${Date.now()}-${Math.random().toString(36).slice(2, 7)}`;
const today = () => new Date().toISOString().slice(0, 10);
const fmt = (d) => new Date(d + 'T00:00:00');

const DEFAULT_SUBJECTS = [
  { id: 'math', name: 'Mathematics', color: '#6366f1', weak: false },
  { id: 'physics', name: 'Physics', color: '#ec4899', weak: false },
  { id: 'cs', name: 'Computer Science', color: '#10b981', weak: true },
  { id: 'eng', name: 'English', color: '#f59e0b', weak: false },
];

const PRIORITY = { high: { label: 'High', color: '#ef4444', bg: 'bg-red-500/10', text: 'text-red-500', border: 'border-red-500/30' }, medium: { label: 'Medium', color: '#f59e0b', bg: 'bg-amber-500/10', text: 'text-amber-500', border: 'border-amber-500/30' }, low: { label: 'Low', color: '#10b981', bg: 'bg-green-500/10', text: 'text-green-500', border: 'border-green-500/30' } };
const STATUS = { pending: 'Pending', 'in-progress': 'In Progress', completed: 'Completed' };
const COLORS = ['#6366f1','#ec4899','#10b981','#f59e0b','#ef4444','#8b5cf6','#06b6d4','#f97316','#14b8a6','#e11d48'];
const TIMES = ['Morning','Afternoon','Evening','Night'];

export { PRIORITY, STATUS, COLORS, TIMES, DEFAULT_SUBJECTS };

export default function useStudyPlanner() {
  const [semester, setSemester] = useLocalStorage('sp_semester', { name: '', year: '', startDate: '', endDate: '', subjectsCount: 4, hoursPerDay: 4, targetCgpa: '', studyTime: 'Morning' });
  const [subjects, setSubjects] = useLocalStorage('sp_subjects', DEFAULT_SUBJECTS);
  const [assignments, setAssignments] = useLocalStorage('sp_assignments', []);
  const [exams, setExams] = useLocalStorage('sp_exams', []);
  const [goals, setGoals] = useLocalStorage('sp_goals', []);
  const [events, setEvents] = useLocalStorage('sp_events', []);
  const [sessions, setSessions] = useLocalStorage('sp_sessions', []);
  const [notifications, setNotifications] = useLocalStorage('sp_notifications', []);
  const [aiPlan, setAiPlan] = useLocalStorage('sp_aiplan', null);
  const [undoStack, setUndoStack] = useLocalStorage('sp_undo', []);
  const [streaks, setStreaks] = useLocalStorage('sp_streaks', { current: 0, longest: 0, lastDate: null });

  // ---- Assignment CRUD ----
  const addAssignment = useCallback((a) => {
    const newA = { id: uid(), name: a.name, subject: a.subject || '', priority: a.priority || 'medium', deadline: a.deadline || '', status: a.status || 'pending', notes: a.notes || '', attachments: a.attachments || [], createdAt: today() };
    setAssignments(p => [newA, ...p]);
  }, [setAssignments]);
  const updateAssignment = useCallback((id, u) => setAssignments(p => p.map(a => a.id === id ? { ...a, ...u } : a)), [setAssignments]);
  const deleteAssignment = useCallback((id) => setAssignments(p => p.filter(a => a.id !== id)), [setAssignments]);

  // ---- Exam CRUD ----
  const addExam = useCallback((e) => {
    const newE = { id: uid(), name: e.name, subject: e.subject || '', date: e.date || '', time: e.time || '', priority: e.priority || 'medium', reminder: e.reminder !== false, createdAt: today() };
    setExams(p => [newE, ...p]);
  }, [setExams]);
  const updateExam = useCallback((id, u) => setExams(p => p.map(e => e.id === id ? { ...e, ...u } : e)), [setExams]);
  const deleteExam = useCallback((id) => setExams(p => p.filter(e => e.id !== id)), [setExams]);

  // ---- Goal CRUD ----
  const addGoal = useCallback((g) => {
    const newG = { id: uid(), title: g.title, type: g.type || 'daily', priority: g.priority || 'medium', deadline: g.deadline || '', completed: false, checklist: g.checklist || [], streak: 0, recurring: g.recurring || false, createdAt: today() };
    setGoals(p => [newG, ...p]);
  }, [setGoals]);
  const updateGoal = useCallback((id, u) => setGoals(p => p.map(g => g.id === id ? { ...g, ...u } : g)), [setGoals]);
  const deleteGoal = useCallback((id) => setGoals(p => p.filter(g => g.id !== id)), [setGoals]);
  const toggleGoal = useCallback((id) => {
    setGoals(p => p.map(g => {
      if (g.id !== id) return g;
      const done = !g.completed;
      return { ...g, completed: done, streak: done ? (g.streak || 0) + 1 : 0 };
    }));
  }, [setGoals]);

  // ---- Event CRUD ----
  const addEvent = useCallback((e) => {
    setEvents(p => [...p, { id: uid(), title: e.title, date: e.date, type: e.type || 'task', color: e.color || '#6366f1' }]);
  }, [setEvents]);
  const deleteEvent = useCallback((id) => setEvents(p => p.filter(e => e.id !== id)), [setEvents]);

  // ---- Subject CRUD ----
  const addSubject = useCallback((name, color) => { const id = `s-${uid()}`; setSubjects(p => [...p, { id, name, color, weak: false }]); }, [setSubjects]);
  const updateSubject = useCallback((id, u) => setSubjects(p => p.map(s => s.id === id ? { ...s, ...u } : s)), [setSubjects]);
  const deleteSubject = useCallback((id) => setSubjects(p => p.filter(s => s.id !== id)), [setSubjects]);

  // ---- Timer ----
  const [timerRunning, setTimerRunning] = useState(false);
  const [timerSeconds, setTimerSeconds] = useState(25 * 60);
  const [timerPreset, setTimerPreset] = useState('focus');
  const [timerSubject, setTimerSubject] = useState('');
  const timerRef = useRef(null);
  const startTimer = useCallback((preset, subj) => {
    const mins = { focus: 25, short: 5, long: 15 }[preset] || 25;
    setTimerPreset(preset); setTimerSubject(subj || ''); setTimerSeconds(mins * 60); setTimerRunning(true);
  }, []);
  const pauseTimer = useCallback(() => { setTimerRunning(false); clearInterval(timerRef.current); }, []);
  const resetTimer = useCallback((preset) => {
    const mins = { focus: 25, short: 5, long: 15 }[preset || timerPreset] || 25;
    setTimerSeconds(mins * 60); setTimerRunning(false); clearInterval(timerRef.current);
  }, [timerPreset]);

  useEffect(() => {
    if (!timerRunning) return;
    timerRef.current = setInterval(() => {
      setTimerSeconds(p => {
        if (p <= 1) {
          clearInterval(timerRef.current); setTimerRunning(false);
          if (timerPreset === 'focus' && timerSubject) {
            const mins = { focus: 25, short: 5, long: 15 }[timerPreset] || 25;
            setSessions(s => [...s, { id: uid(), subjectId: timerSubject, duration: mins, type: timerPreset, completedAt: new Date().toISOString() }]);
            updateStreakLocal();
          }
          return 0;
        }
        return p - 1;
      });
    }, 1000);
    return () => clearInterval(timerRef.current);
  }, [timerRunning, timerPreset, timerSubject]);

  const updateStreakLocal = () => {
    setStreaks(prev => {
      const t = today(), y = new Date(Date.now() - 86400000).toISOString().slice(0, 10);
      let c = prev.current;
      if (prev.lastDate === t) return prev;
      c = prev.lastDate === y ? c + 1 : 1;
      return { current: c, longest: Math.max(c, prev.longest), lastDate: t };
    });
  };

  // ---- Notifications ----
  const addNotification = useCallback((n) => {
    setNotifications(p => [{ id: uid(), title: n.title, message: n.message, type: n.type || 'info', read: false, createdAt: new Date().toISOString() }, ...p].slice(0, 50));
  }, [setNotifications]);
  const markNotificationRead = useCallback((id) => setNotifications(p => p.map(n => n.id === id ? { ...n, read: true } : n)), [setNotifications]);
  const clearNotifications = useCallback(() => setNotifications([]), [setNotifications]);

  // ---- AI Smart Plan Generator (Mock) ----
  const generateAIPlan = useCallback((inputs) => {
    const { subjects: subjs, weakSubjects, targetDate, hoursPerWeek, studyStyle, revisionPriority } = inputs;
    const days = ['Monday','Tuesday','Wednesday','Thursday','Friday','Saturday','Sunday'];
    const dailyHours = (hoursPerWeek || 28) / 7;
    const schedule = days.map(day => {
      const blocks = [];
      let remaining = dailyHours;
      (subjs || subjects).forEach((s, i) => {
        const isWeak = (weakSubjects || []).includes(s.id);
        const mins = isWeak ? Math.min(remaining, 90) : Math.min(remaining, 60);
        if (mins >= 30) {
          blocks.push({ subject: s.name, duration: mins, type: isWeak ? 'deep-study' : 'regular', startTime: `${9 + Math.floor((dailyHours - remaining) * 2)}:00` });
          remaining -= mins / 60;
        }
      });
      if (remaining > 0.5) blocks.push({ subject: 'Revision', duration: remaining * 60, type: 'revision', startTime: `${9 + Math.floor((dailyHours - remaining) * 2)}:00` });
      return { day, blocks, totalMinutes: blocks.reduce((a, b) => a + b.duration, 0) };
    });
    const plan = {
      id: uid(), schedule, strategy: `${revisionPriority || ' spaced'} revision with ${studyStyle || 'balanced'} study approach. Focus 60% on weak subjects, 40% on strong. 15-min breaks every 90 minutes.`,
      breakSchedule: '5 min break every 25 min (Pomodoro), 15 min break every 2 hours, 1 hour lunch break',
      tips: ['Start with hardest subject when energy is peak', 'Use active recall instead of passive reading', 'Review notes within 24 hours of learning', 'Teach concepts to reinforce understanding', 'Take proper sleep for memory consolidation'],
      estimatedCompletion: targetDate || new Date(Date.now() + 60 * 86400000).toISOString().slice(0, 10),
      createdAt: new Date().toISOString(),
    };
    setAiPlan(plan);
    addNotification({ title: 'AI Plan Generated', message: 'Your smart study schedule is ready!', type: 'success' });
    return plan;
  }, [subjects, setAiPlan, addNotification]);

  // ---- AI Productivity Insights (Mock) ----
  const getInsights = useCallback(() => {
    const totalStudy = sessions.reduce((a, s) => a + (s.duration || 0), 0);
    const avgDaily = sessions.length > 0 ? totalStudy / Math.max(1, new Set(sessions.map(s => s.completedAt?.slice(0, 10))).size) : 0;
    return {
      bestStudyTime: 'Morning (9 AM - 12 PM)',
      mostProductiveDay: 'Wednesday',
      avgFocusTime: `${Math.round(avgDaily)} min/day`,
      difficultSubject: subjects.find(s => s.weak)?.name || 'None',
      recommendedHours: '4-6 hours/day',
      burnoutRisk: totalStudy > 600 ? 'Low' : totalStudy > 300 ? 'Medium' : 'High',
      focusScore: Math.min(100, Math.round((totalStudy / 7) * 2.5)),
      consistencyScore: streaks.current >= 5 ? 85 : streaks.current >= 3 ? 65 : 40,
      learningSpeed: 'Moderate',
    };
  }, [sessions, subjects, streaks]);

  // ---- Stats ----
  const getStats = useCallback(() => {
    const t = today();
    const completedAssignments = assignments.filter(a => a.status === 'completed').length;
    const overdue = assignments.filter(a => a.status !== 'completed' && a.deadline && a.deadline < t).length;
    const todaySessions = sessions.filter(s => s.completedAt?.startsWith(t));
    const todayMinutes = todaySessions.reduce((a, s) => a + (s.duration || 0), 0);
    const totalMinutes = sessions.reduce((a, s) => a + (s.duration || 0), 0);
    const completedGoals = goals.filter(g => g.completed).length;
    const upcomingExams = exams.filter(e => e.date >= t).sort((a, b) => a.date.localeCompare(b.date));
    const nextExam = upcomingExams[0];
    const examDaysLeft = nextExam ? Math.max(0, Math.ceil((fmt(nextExam.date) - fmt(t)) / 86400000)) : null;
    const weekData = [];
    for (let i = 6; i >= 0; i--) {
      const d = new Date(Date.now() - i * 86400000).toISOString().slice(0, 10);
      const mins = sessions.filter(s => s.completedAt?.startsWith(d)).reduce((a, s) => a + (s.duration || 0), 0);
      weekData.push({ date: d, label: new Date(d + 'T00:00:00').toLocaleDateString('en', { weekday: 'short' }), minutes: mins });
    }
    const monthData = [];
    for (let i = 29; i >= 0; i--) {
      const d = new Date(Date.now() - i * 86400000).toISOString().slice(0, 10);
      const mins = sessions.filter(s => s.completedAt?.startsWith(d)).reduce((a, s) => a + (s.duration || 0), 0);
      monthData.push({ date: d, minutes: mins });
    }
    const subjectStats = {};
    subjects.forEach(s => { subjectStats[s.id] = { name: s.name, color: s.color, total: 0, completed: 0, minutes: 0 }; });
    assignments.forEach(a => { if (a.subject && subjectStats[a.subject]) { subjectStats[a.subject].total++; if (a.status === 'completed') subjectStats[a.subject].completed++; } });
    sessions.forEach(s => { if (s.subjectId && subjectStats[s.subjectId]) subjectStats[s.subjectId].minutes += s.duration || 0; });
    const overallProgress = assignments.length > 0 ? Math.round((completedAssignments / assignments.length) * 100) : 0;
    return { totalAssignments: assignments.length, completedAssignments, overdue, todayMinutes, totalMinutes, completedGoals, totalGoals: goals.length, upcomingExams, nextExam, examDaysLeft, weekData, monthData, subjectStats, overallProgress, streaks };
  }, [assignments, sessions, goals, exams, subjects, streaks]);

  // ---- Helpers ----
  const getSubjectName = useCallback((id) => subjects.find(s => s.id === id)?.name || 'Unassigned', [subjects]);
  const getSubjectColor = useCallback((id) => subjects.find(s => s.id === id)?.color || '#6366f1', [subjects]);
  const getTasksForDate = useCallback((date) => events.filter(e => e.date === date), [events]);
  const getMonthDays = useCallback((ym) => {
    const t = today();
    const [y, m] = ym.split('-').map(Number);
    const firstDay = new Date(y, m - 1, 1).getDay();
    const daysInMonth = new Date(y, m, 0).getDate();
    const days = [];
    for (let i = 0; i < firstDay; i++) days.push(null);
    for (let d = 1; d <= daysInMonth; d++) {
      const ds = `${y}-${String(m).padStart(2,'0')}-${String(d).padStart(2,'0')}`;
      days.push({ date: ds, day: d, events: events.filter(e => e.date === ds), isToday: ds === t });
    }
    return days;
  }, [events]);

  return {
    semester, setSemester, subjects, addSubject, updateSubject, deleteSubject,
    assignments, addAssignment, updateAssignment, deleteAssignment,
    exams, addExam, updateExam, deleteExam,
    goals, addGoal, updateGoal, deleteGoal, toggleGoal,
    events, addEvent, deleteEvent,
    sessions,
    notifications, addNotification, markNotificationRead, clearNotifications,
    aiPlan, generateAIPlan,
    streaks,
    timerRunning, timerSeconds, timerPreset, timerSubject, startTimer, pauseTimer, resetTimer,
    getStats, getInsights, getSubjectName, getSubjectColor, getTasksForDate, getMonthDays,
  };
}
