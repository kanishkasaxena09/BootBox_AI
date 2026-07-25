export const PRIORITY = {
  high: { label: 'High', color: '#ef4444', bg: 'bg-red-500/10', text: 'text-red-500', border: 'border-red-500/30' },
  medium: { label: 'Medium', color: '#f59e0b', bg: 'bg-amber-500/10', text: 'text-amber-500', border: 'border-amber-500/30' },
  low: { label: 'Low', color: '#10b981', bg: 'bg-green-500/10', text: 'text-green-500', border: 'border-green-500/30' },
};

export const STATUS = {
  pending: { label: 'Pending', color: '#f59e0b', bg: 'bg-amber-500/10', text: 'text-amber-500' },
  'in-progress': { label: 'In Progress', color: '#6366f1', bg: 'bg-indigo-500/10', text: 'text-indigo-500' },
  completed: { label: 'Completed', color: '#10b981', bg: 'bg-green-500/10', text: 'text-green-500' },
};

export const SUBJECTS = [
  { id: 'math', name: 'Mathematics', color: '#6366f1' },
  { id: 'physics', name: 'Physics', color: '#ec4899' },
  { id: 'cs', name: 'Computer Science', color: '#10b981' },
  { id: 'eng', name: 'English', color: '#f59e0b' },
  { id: 'chem', name: 'Chemistry', color: '#8b5cf6' },
  { id: 'bio', name: 'Biology', color: '#14b8a6' },
  { id: 'hist', name: 'History', color: '#f97316' },
  { id: 'eco', name: 'Economics', color: '#06b6d4' },
];

export const defaultAssignment = {
  name: '',
  subject: '',
  priority: 'medium',
  deadline: '',
  status: 'pending',
  notes: '',
  attachments: [],
  reminder: '',
  createdAt: '',
  completedAt: null,
};

export const uid = () => `${Date.now()}-${Math.random().toString(36).slice(2, 7)}`;

export const today = () => new Date().toISOString().slice(0, 10);

export const daysUntil = (dateStr) => {
  if (!dateStr) return null;
  const diff = Math.ceil((new Date(dateStr + 'T00:00:00').getTime() - new Date(today() + 'T00:00:00').getTime()) / 86400000);
  return diff;
};

export const isOverdue = (assignment) => {
  return assignment.status !== 'completed' && assignment.deadline && assignment.deadline < today();
};

export const getMonthDays = (ym, assignments) => {
  const [y, m] = ym.split('-').map(Number);
  const firstDay = new Date(y, m - 1, 1).getDay();
  const daysInMonth = new Date(y, m, 0).getDate();
  const t = today();
  const days = [];
  for (let i = 0; i < firstDay; i++) days.push(null);
  for (let d = 1; d <= daysInMonth; d++) {
    const ds = `${y}-${String(m).padStart(2, '0')}-${String(d).padStart(2, '0')}`;
    days.push({
      date: ds,
      day: d,
      isToday: ds === t,
      assignments: assignments.filter(a => a.deadline === ds),
    });
  }
  return days;
};
