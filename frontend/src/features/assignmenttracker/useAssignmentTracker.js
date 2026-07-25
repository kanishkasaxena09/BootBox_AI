import { useState, useCallback, useMemo } from 'react';
import { defaultAssignment, uid, today, isOverdue } from './mockData';

const STORAGE_KEY = 'bootbox_assignment_tracker';

export default function useAssignmentTracker() {
  const [assignments, setAssignments] = useState(() => {
    try { return JSON.parse(localStorage.getItem(STORAGE_KEY)) || []; }
    catch { return []; }
  });

  const persist = useCallback((list) => {
    try { localStorage.setItem(STORAGE_KEY, JSON.stringify(list)); } catch {}
  }, []);

  const addAssignment = useCallback((data) => {
    const a = { ...defaultAssignment, ...data, id: uid(), createdAt: new Date().toISOString() };
    setAssignments(p => { const next = [a, ...p]; persist(next); return next; });
  }, [persist]);

  const updateAssignment = useCallback((id, updates) => {
    setAssignments(p => {
      const next = p.map(a => {
        if (a.id !== id) return a;
        const updated = { ...a, ...updates };
        if (updates.status === 'completed' && !updated.completedAt) updated.completedAt = new Date().toISOString();
        if (updates.status !== 'completed') updated.completedAt = null;
        return updated;
      });
      persist(next);
      return next;
    });
  }, [persist]);

  const deleteAssignment = useCallback((id) => {
    setAssignments(p => { const next = p.filter(a => a.id !== id); persist(next); return next; });
  }, [persist]);

  const toggleStatus = useCallback((id) => {
    setAssignments(p => {
      const next = p.map(a => {
        if (a.id !== id) return a;
        const newStatus = a.status === 'completed' ? 'pending' : 'completed';
        return { ...a, status: newStatus, completedAt: newStatus === 'completed' ? new Date().toISOString() : null };
      });
      persist(next);
      return next;
    });
  }, [persist]);

  const bulkDelete = useCallback((ids) => {
    setAssignments(p => { const next = p.filter(a => !ids.includes(a.id)); persist(next); return next; });
  }, [persist]);

  const stats = useMemo(() => {
    const t = today();
    const total = assignments.length;
    const completed = assignments.filter(a => a.status === 'completed').length;
    const pending = assignments.filter(a => a.status === 'pending').length;
    const inProgress = assignments.filter(a => a.status === 'in-progress').length;
    const overdue = assignments.filter(a => isOverdue(a)).length;
    const dueSoon = assignments.filter(a => {
      if (a.status === 'completed' || !a.deadline) return false;
      const diff = Math.ceil((new Date(a.deadline + 'T00:00:00').getTime() - new Date(t + 'T00:00:00').getTime()) / 86400000);
      return diff >= 0 && diff <= 3;
    }).length;
    const progress = total > 0 ? Math.round((completed / total) * 100) : 0;

    // Priority breakdown
    const priorityBreakdown = { high: 0, medium: 0, low: 0 };
    assignments.filter(a => a.status !== 'completed').forEach(a => { priorityBreakdown[a.priority] = (priorityBreakdown[a.priority] || 0) + 1; });

    // Subject breakdown
    const subjectBreakdown = {};
    assignments.filter(a => a.status !== 'completed' && a.subject).forEach(a => {
      subjectBreakdown[a.subject] = (subjectBreakdown[a.subject] || 0) + 1;
    });

    // Upcoming deadlines (next 7 days)
    const upcoming = assignments
      .filter(a => a.status !== 'completed' && a.deadline && a.deadline >= t)
      .sort((a, b) => a.deadline.localeCompare(b.deadline))
      .slice(0, 5);

    return { total, completed, pending, inProgress, overdue, dueSoon, progress, priorityBreakdown, subjectBreakdown, upcoming };
  }, [assignments]);

  return { assignments, addAssignment, updateAssignment, deleteAssignment, toggleStatus, bulkDelete, stats };
}
