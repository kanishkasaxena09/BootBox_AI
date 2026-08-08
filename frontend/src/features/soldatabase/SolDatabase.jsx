import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { BookOpen, GraduationCap, ArrowLeft, Library, FileText, ExternalLink, Loader2, Link, ChevronDown, ChevronUp, Download } from 'lucide-react';

const YEAR_ICONS = [GraduationCap, BookOpen, Library, FileText];

const SolDatabase = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedYear, setSelectedYear] = useState(null);
  const [selectedSem, setSelectedSem] = useState(null);
  const [expandedSubject, setExpandedSubject] = useState(null);

  useEffect(() => {
    fetch('/api/soldatabase')
      .then(r => r.json())
      .then(d => { setData(d); setLoading(false); })
      .catch(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <Loader2 className="h-6 w-6 animate-spin text-pink-500" />
      </div>
    );
  }

  const years = data?.years || [];

  if (selectedSem && selectedYear) {
    const year = years.find(y => y.id === selectedYear);
    const sem = year?.semesters.find(s => s.id === selectedSem);
    if (!year || !sem) {
      setSelectedSem(null);
      return null;
    }
    return (
      <div className="space-y-6">
        <button onClick={() => setSelectedSem(null)}
          className="flex items-center gap-1.5 text-xs font-bold text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-colors">
          <ArrowLeft className="w-3.5 h-3.5" /> Back to semesters
        </button>
        <div className="text-center space-y-2">
          <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-gradient-to-br from-pink-500/20 to-rose-500/20 border border-pink-500/30">
            <FileText className="w-7 h-7 text-pink-400" />
          </div>
          <h1 className="text-2xl sm:text-3xl font-black bg-gradient-to-r from-pink-500 to-rose-500 bg-clip-text text-transparent">
            {year.label} — {sem.label}
          </h1>
          <p className="text-sm text-[var(--text-secondary)] max-w-md mx-auto">{sem.desc}</p>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {sem.subjects.length === 0 && (
            <div className="sm:col-span-2 glass-panel rounded-2xl p-12 border border-[var(--border)] text-center">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-pink-500/10 mb-4">
                <BookOpen className="w-8 h-8 text-pink-400/50" />
              </div>
              <p className="text-sm font-bold text-[var(--text-secondary)]">No subjects added yet for this semester.</p>
            </div>
          )}
          {sem.subjects.map((subj, idx) => {
            const docs = subj.documents || [];
            const isExpanded = expandedSubject === idx;
            return (
              <motion.div key={idx} layout
                className="card-hover-border glass-panel border border-[var(--border-color)] rounded-2xl overflow-hidden shadow-sm">
                <div onClick={() => setExpandedSubject(isExpanded ? null : idx)}
                  className="p-5 cursor-pointer flex flex-col text-left space-y-1">
                  <div className="flex items-center justify-between">
                    <h3 className="font-bold text-[var(--text-primary)] text-sm">{subj.name}</h3>
                    {docs.length > 0 && (
                      <span className="flex items-center space-x-1 text-[10px] font-semibold text-pink-500">
                        {isExpanded ? <ChevronUp className="h-3.5 w-3.5" /> : <ChevronDown className="h-3.5 w-3.5" />}
                        <span>{docs.length} doc{docs.length !== 1 ? 's' : ''}</span>
                      </span>
                    )}
                  </div>
                  {subj.desc && <p className="text-xs text-[var(--text-secondary)]">{subj.desc}</p>}
                </div>
                {isExpanded && docs.length > 0 && (
                  <div className="border-t border-[var(--border-color)] px-5 py-3 space-y-2 bg-[var(--bg-secondary)]/30">
                    <p className="text-[10px] font-bold text-[var(--text-secondary)] uppercase tracking-wider">Documents</p>
                    {docs.map((doc, di) => (
                      <a key={di} href={doc.url} target="_blank" rel="noopener noreferrer"
                        className="flex items-center space-x-2 p-2 rounded-lg bg-[var(--card-bg)]/50 hover:bg-pink-500/5 transition-all group">
                        {doc.type === 'file' ? <Download className="h-3.5 w-3.5 text-pink-500 flex-shrink-0" /> : <Link className="h-3.5 w-3.5 text-pink-500 flex-shrink-0" />}
                        <span className="text-xs font-medium text-[var(--text-primary)] group-hover:text-pink-500 transition-colors truncate">{doc.name || doc.filename || 'Document'}</span>
                        <ExternalLink className="h-3 w-3 text-[var(--text-secondary)] flex-shrink-0 ml-auto opacity-0 group-hover:opacity-100 transition-opacity" />
                      </a>
                    ))}
                  </div>
                )}
                {isExpanded && docs.length === 0 && (
                  <div className="border-t border-[var(--border-color)] px-5 py-4 text-center">
                    <p className="text-[10px] text-[var(--text-secondary)] italic">No documents added yet.</p>
                  </div>
                )}
              </motion.div>
            );
          })}
        </div>
      </div>
    );
  }

  if (selectedYear) {
    const year = years.find(y => y.id === selectedYear);
    if (!year) {
      setSelectedYear(null);
      return null;
    }
    return (
      <div className="space-y-6">
        <button onClick={() => setSelectedYear(null)}
          className="flex items-center gap-1.5 text-xs font-bold text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-colors">
          <ArrowLeft className="w-3.5 h-3.5" /> Back to years
        </button>
        <div className="text-center space-y-2">
          <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-gradient-to-br from-pink-500/20 to-rose-500/20 border border-pink-500/30">
            <GraduationCap className="w-7 h-7 text-pink-400" />
          </div>
          <h1 className="text-2xl sm:text-3xl font-black bg-gradient-to-r from-pink-500 to-rose-500 bg-clip-text text-transparent">
            {year.label}
          </h1>
          <p className="text-sm text-[var(--text-secondary)]">{year.desc}</p>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {year.semesters.map(sem => (
            <motion.div key={sem.id} whileHover={{ y: -4 }}
              onClick={() => setSelectedSem(sem.id)}
              className="card-hover-border glass-panel border border-[var(--border-color)] p-6 rounded-2xl cursor-pointer transition-all flex flex-col text-left space-y-3 shadow-sm">
              <div className="p-3 bg-pink-500/10 rounded-xl w-fit">
                <FileText className="h-5 w-5 text-pink-500" />
              </div>
              <div>
                <h3 className="font-bold text-[var(--text-primary)]">{sem.label}</h3>
                <p className="text-xs text-[var(--text-secondary)] mt-1">{sem.desc}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="text-center space-y-2">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3 }}
          className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-gradient-to-br from-pink-500/20 to-rose-500/20 border border-pink-500/30">
          <Library className="w-7 h-7 text-pink-400" />
        </motion.div>
        <motion.h1 initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3 }}
          className="text-2xl sm:text-3xl font-black bg-gradient-to-r from-pink-500 to-rose-500 bg-clip-text text-transparent">
          SOL Database
        </motion.h1>
        <motion.p initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3 }}
          className="text-sm text-[var(--text-secondary)] max-w-md mx-auto">
          Browse semester-wise resources, notes, assignments, and study material for all B.Tech years.
        </motion.p>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {years.map((year, idx) => {
          const Icon = YEAR_ICONS[idx % YEAR_ICONS.length];
          return (
            <motion.div key={year.id} whileHover={{ y: -4 }}
              onClick={() => setSelectedYear(year.id)}
              className="card-hover-border glass-panel border border-[var(--border-color)] p-6 rounded-2xl cursor-pointer transition-all flex flex-col text-left space-y-3 shadow-sm">
              <div className="p-3 bg-pink-500/10 rounded-xl w-fit">
                <Icon className="h-5 w-5 text-pink-500" />
              </div>
              <div>
                <h3 className="font-bold text-[var(--text-primary)]">{year.label}</h3>
                <p className="text-xs text-[var(--text-secondary)] mt-1">{year.desc}</p>
              </div>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
};

export default SolDatabase;
