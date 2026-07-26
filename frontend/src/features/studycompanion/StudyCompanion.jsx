import React, { useState, useEffect, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  BookOpen, GraduationCap, Target, Brain, Sparkles,
  Copy, Download, RefreshCw, Save, MessageSquare,
  ChevronRight, Lightbulb, Calculator,
  FileText, Clock, Zap, Send,
  History, Trash2, Pencil,
  BookMarked, PenTool, ListChecks, BarChart3
} from 'lucide-react';
import { Tabs, Button, EmptyState, SectionHeader, ToolLayout, ErrorBoundary, useCopy } from '../../components/shared';

const DIFFICULTIES = [
  { id: 'beginner', label: 'Beginner', desc: 'Just starting out' },
  { id: 'intermediate', label: 'Intermediate', desc: 'Some familiarity' },
  { id: 'advanced', label: 'Advanced', desc: 'In-depth mastery' },
];

const GOALS = [
  { id: 'understand', label: 'Understand Concept', icon: Lightbulb },
  { id: 'exam', label: 'Exam Preparation', icon: GraduationCap },
  { id: 'assignment', label: 'Assignment Help', icon: PenTool },
  { id: 'interview', label: 'Interview Prep', icon: Target },
  { id: 'curiosity', label: 'Curiosity Learning', icon: Brain },
];

const STYLES = [
  { id: 'visual', label: 'Visual', desc: 'Diagrams & examples' },
  { id: 'text', label: 'Text-heavy', desc: 'Detailed explanations' },
  { id: 'balanced', label: 'Balanced', desc: 'Mix of both' },
  { id: 'practice', label: 'Practice-first', desc: 'Problems & exercises' },
];

const TABS = [
  { id: 'result', label: 'Study Guide', icon: BookOpen },
  { id: 'chat', label: 'Ask AI', icon: MessageSquare },
  { id: 'notes', label: 'Saved Notes', icon: BookMarked },
  { id: 'history', label: 'History', icon: History },
];

const StudyCompanion = () => {
  const [topic, setTopic] = useState('');
  const [subject, setSubject] = useState('');
  const [difficulty, setDifficulty] = useState('intermediate');
  const [goal, setGoal] = useState('understand');
  const [learningStyle, setLearningStyle] = useState('balanced');

  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [activeTab, setActiveTab] = useState('result');
  const [expandedSections, setExpandedSections] = useState({
    explanation: true, keyConcepts: true, formulas: true,
    examples: true, memoryTricks: true, quiz: true,
    exercises: true, revisionNotes: true, summary: true,
  });

  const [chatMessages, setChatMessages] = useState([]);
  const [chatInput, setChatInput] = useState('');
  const [chatLoading, setChatLoading] = useState(false);
  const chatEndRef = useRef(null);

  const [savedNotes, setSavedNotes] = useState(() => {
    try { return JSON.parse(localStorage.getItem('studyNotes') || '[]'); } catch { return []; }
  });
  const [history, setHistory] = useState(() => {
    try { return JSON.parse(localStorage.getItem('studyHistory') || '[]'); } catch { return []; }
  });

  const [regenerating, setRegenerating] = useState(null);
  const { copied, copy } = useCopy();

  useEffect(() => { localStorage.setItem('studyNotes', JSON.stringify(savedNotes)); }, [savedNotes]);
  useEffect(() => { localStorage.setItem('studyHistory', JSON.stringify(history)); }, [history]);
  useEffect(() => { chatEndRef.current?.scrollIntoView({ behavior: 'smooth' }); }, [chatMessages]);

  const handleGenerate = async () => {
    if (!topic.trim()) return;
    setLoading(true);
    setResult(null);
    try {
      const response = await fetch('/api/study/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ topic, subject, difficulty, goal, learningStyle }),
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || 'Failed to generate.');
      setResult(data);
      setChatMessages([]);
      const entry = { id: Date.now(), topic, subject, difficulty, goal, style: learningStyle, timestamp: new Date().toISOString(), data };
      setHistory(prev => [entry, ...prev].slice(0, 50));
    } catch (e) {
      alert(e.message || 'Generation failed. Please try again.');
    } finally { setLoading(false); }
  };

  const handleRegenerate = async (section) => {
    setRegenerating(section);
    try {
      const response = await fetch('/api/study/regenerate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ topic, section, subject, difficulty }),
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error);
      setResult(prev => ({ ...prev, [section]: data.content }));
    } catch (e) { console.error('Regenerate failed:', e); }
    finally { setRegenerating(null); }
  };

  const handleChatSend = async () => {
    if (!chatInput.trim() || chatLoading) return;
    const userMsg = { role: 'user', content: chatInput.trim() };
    setChatMessages(prev => [...prev, userMsg]);
    setChatInput('');
    setChatLoading(true);
    try {
      const response = await fetch('/api/study/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ messages: [...chatMessages, userMsg].map(m => ({ role: m.role, content: m.content })), topic }),
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error);
      setChatMessages(prev => [...prev, { role: 'assistant', content: data.content }]);
    } catch {
      setChatMessages(prev => [...prev, { role: 'assistant', content: 'Sorry, I encountered an error. Please try again.' }]);
    } finally { setChatLoading(false); }
  };

  const saveNotes = () => {
    if (!result) return;
    setSavedNotes(prev => [{ id: Date.now(), topic, subject, difficulty, timestamp: new Date().toISOString(), data: result }, ...prev].slice(0, 100));
  };

  const exportPDF = async () => {
    if (!result) return;
    try {
      const el = document.getElementById('study-printable-area');
      if (!el) return;
      const html2canvasModule = await import('html2canvas');
      const html2canvas = html2canvasModule.default || html2canvasModule;
      const jspdfModule = await import('jspdf');
      const jsPDF = jspdfModule.jsPDF || jspdfModule.default.jsPDF || jspdfModule.default;
      const canvas = await html2canvas(el, { scale: 2, useCORS: true });
      const imgData = canvas.toDataURL('image/jpeg', 0.95);
      const pdf = new jsPDF('p', 'pt', 'a4');
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = (canvas.height * pdfWidth) / canvas.width;
      pdf.addImage(imgData, 'JPEG', 0, 0, pdfWidth, pdfHeight);
      pdf.save(`${topic.replace(/\s+/g, '_')}_study_guide.pdf`);
    } catch (e) { console.error('PDF export failed:', e); alert('PDF export failed.'); }
  };

  const toggleSection = (key) => setExpandedSections(prev => ({ ...prev, [key]: !prev[key] }));
  const loadFromHistory = (entry) => {
    setTopic(entry.topic); setSubject(entry.subject || '');
    setDifficulty(entry.difficulty || 'intermediate'); setGoal(entry.goal || 'understand');
    setLearningStyle(entry.style || 'balanced'); setResult(entry.data);
    setActiveTab('result'); setChatMessages([]);
  };

  return (
    <ErrorBoundary>
      <ToolLayout icon={Brain} title="AI Study Companion" subtitle="Learn any topic with AI-powered explanations, quizzes & memory tricks" accentColor="#6366f1">
        <div className="space-y-5">
          {!result && (
            <motion.div initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} className="max-w-2xl mx-auto space-y-5">
              <div className="glass-panel p-5 rounded-2xl border border-[var(--border)] space-y-3">
                <div className="flex items-center gap-2">
                  <Pencil className="w-4 h-4 text-[var(--accent)]" />
                  <label className="text-xs font-bold uppercase tracking-wider text-[var(--text-secondary)]">What do you want to learn?</label>
                </div>
                <input type="text" value={topic} onChange={e => setTopic(e.target.value)}
                  placeholder="e.g. Quantum Entanglement, Binary Search Trees, Supply and Demand..."
                  className="w-full px-4 py-3 rounded-xl bg-[var(--bg-secondary)] border border-[var(--border)] text-sm text-[var(--text-primary)] focus:outline-none focus:ring-2 focus:ring-[var(--accent)]/20 focus:border-[var(--accent)] transition-all"
                  onKeyDown={e => e.key === 'Enter' && handleGenerate()} />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="glass-panel p-4 rounded-2xl border border-[var(--border)] space-y-3">
                  <label className="text-xs font-bold uppercase tracking-wider text-[var(--text-secondary)] flex items-center gap-1.5"><BookOpen className="w-3 h-3" /> Subject</label>
                  <input type="text" value={subject} onChange={e => setSubject(e.target.value)} placeholder="e.g. Mathematics, Physics..."
                    className="w-full px-3 py-2.5 rounded-xl bg-[var(--bg-secondary)] border border-[var(--border)] text-xs font-medium text-[var(--text-primary)] focus:outline-none focus:border-[var(--accent)] transition-all" />
                </div>
                <div className="glass-panel p-4 rounded-2xl border border-[var(--border)] space-y-3">
                  <label className="text-xs font-bold uppercase tracking-wider text-[var(--text-secondary)] flex items-center gap-1.5"><BarChart3 className="w-3 h-3" /> Difficulty</label>
                  <div className="flex gap-2">
                    {DIFFICULTIES.map(d => (
                      <button key={d.id} onClick={() => setDifficulty(d.id)}
                        className={`flex-1 px-2 py-2 rounded-xl text-[10px] font-bold transition-all border ${
                          difficulty === d.id ? 'bg-[var(--accent)]/10 border-[var(--accent)]/30 text-[var(--accent)]' : 'bg-[var(--bg-secondary)] border-[var(--border)] text-[var(--text-secondary)] hover:border-[var(--accent)]/20'
                        }`}>{d.label}</button>
                    ))}
                  </div>
                </div>
              </div>

              <div className="glass-panel p-4 rounded-2xl border border-[var(--border)] space-y-3">
                <label className="text-xs font-bold uppercase tracking-wider text-[var(--text-secondary)] flex items-center gap-1.5"><Target className="w-3 h-3" /> Study Goal</label>
                <div className="grid grid-cols-2 sm:grid-cols-5 gap-2">
                  {GOALS.map(g => {
                    const Icon = g.icon;
                    return (
                      <button key={g.id} onClick={() => setGoal(g.id)}
                        className={`flex flex-col items-center gap-1.5 px-2 py-3 rounded-xl text-[10px] font-bold transition-all border ${
                          goal === g.id ? 'bg-[var(--accent)]/10 border-[var(--accent)]/30 text-[var(--accent)]' : 'bg-[var(--bg-secondary)] border-[var(--border)] text-[var(--text-secondary)] hover:border-[var(--accent)]/20'
                        }`}>
                        <Icon className="w-4 h-4" /><span className="text-center leading-tight">{g.label}</span>
                      </button>
                    );
                  })}
                </div>
              </div>

              <div className="glass-panel p-4 rounded-2xl border border-[var(--border)] space-y-3">
                <label className="text-xs font-bold uppercase tracking-wider text-[var(--text-secondary)] flex items-center gap-1.5"><Sparkles className="w-3 h-3" /> Learning Style</label>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                  {STYLES.map(s => (
                    <button key={s.id} onClick={() => setLearningStyle(s.id)}
                      className={`flex flex-col items-center gap-1 px-3 py-3 rounded-xl text-[10px] font-bold transition-all border ${
                        learningStyle === s.id ? 'bg-[var(--accent)]/10 border-[var(--accent)]/30 text-[var(--accent)]' : 'bg-[var(--bg-secondary)] border-[var(--border)] text-[var(--text-secondary)] hover:border-[var(--accent)]/20'
                      }`}>
                      <span>{s.label}</span><span className="text-[9px] font-medium opacity-60">{s.desc}</span>
                    </button>
                  ))}
                </div>
              </div>

              <Button variant="primary" fullWidth size="lg" icon={loading ? RefreshCw : Zap}
                loading={loading} disabled={loading || !topic.trim()} onClick={handleGenerate}>
                {loading ? 'Generating study guide...' : 'Generate Study Guide'}
              </Button>
            </motion.div>
          )}

          {result && (
            <div className="space-y-5">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <div className="flex items-center gap-2">
                  <h2 className="text-lg font-black text-[var(--text-primary)] truncate max-w-xs">{topic}</h2>
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-[var(--accent)]/10 text-[var(--accent)]">{subject || 'General'}</span>
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-purple-500/10 text-purple-500 capitalize">{difficulty}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Button variant="secondary" size="sm" icon={Save} onClick={saveNotes}>Save</Button>
                  <Button variant="secondary" size="sm" icon={Download} onClick={exportPDF}>PDF</Button>
                  <Button variant="ghost" size="sm" icon={RefreshCw} onClick={() => { setResult(null); setChatMessages([]); }}>New Topic</Button>
                </div>
              </div>

              <Tabs tabs={TABS} active={activeTab} onChange={setActiveTab} />

              <AnimatePresence mode="wait">
                {activeTab === 'result' && (
                  <motion.div key="result" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
                    id="study-printable-area" className="max-w-3xl mx-auto space-y-3">
                    {[
                      { key: 'explanation', title: 'Explanation', icon: BookOpen, content: result.explanation },
                      { key: 'keyConcepts', title: 'Key Concepts', icon: Lightbulb, content: result.keyConcepts, isArray: true },
                      { key: 'formulas', title: 'Formulas & Rules', icon: Calculator, content: result.formulas },
                      { key: 'examples', title: 'Real-World Examples', icon: Sparkles, content: result.examples, isArray: true },
                      { key: 'memoryTricks', title: 'Memory Tricks', icon: Brain, content: result.memoryTricks, isArray: true },
                      { key: 'quiz', title: 'Quiz Questions', icon: ListChecks, content: result.quiz, isQuiz: true },
                      { key: 'exercises', title: 'Practice Exercises', icon: PenTool, content: result.exercises, isExercises: true },
                      { key: 'revisionNotes', title: 'Revision Notes', icon: BookMarked, content: result.revisionNotes },
                      { key: 'summary', title: 'Summary', icon: FileText, content: result.summary },
                    ].map(sec => {
                      const Icon = sec.icon;
                      const isOpen = expandedSections[sec.key];
                      const hasContent = sec.isArray || sec.isQuiz || sec.isExercises
                        ? (Array.isArray(sec.content) && sec.content.length > 0) : !!sec.content;
                      if (!hasContent) return null;
                      return (
                        <motion.div key={sec.key} layout className="glass-panel rounded-2xl border border-[var(--border)] overflow-hidden">
                          <button onClick={() => toggleSection(sec.key)}
                            className="w-full px-5 py-3.5 flex items-center justify-between hover:bg-[var(--bg-secondary)]/50 transition-colors">
                            <div className="flex items-center gap-2.5">
                              <div className="p-2 rounded-xl bg-[var(--accent)]/10"><Icon className="w-4 h-4 text-[var(--accent)]" /></div>
                              <h3 className="text-sm font-bold text-[var(--text-primary)]">{sec.title}</h3>
                            </div>
                            <div className="flex items-center gap-2">
                              <button onClick={(e) => { e.stopPropagation(); copy(sec.isArray || sec.isQuiz || sec.isExercises ? JSON.stringify(sec.content, null, 2) : sec.content); }}
                                className="p-1.5 rounded-lg hover:bg-[var(--bg-secondary)] text-[var(--text-secondary)] hover:text-[var(--accent)] transition-all">
                                <Copy className="w-3.5 h-3.5" />
                              </button>
                              <button onClick={(e) => { e.stopPropagation(); handleRegenerate(sec.key); }} disabled={regenerating === sec.key}
                                className="p-1.5 rounded-lg hover:bg-[var(--bg-secondary)] text-[var(--text-secondary)] hover:text-purple-500 transition-all disabled:opacity-40">
                                <RefreshCw className={`w-3.5 h-3.5 ${regenerating === sec.key ? 'animate-spin' : ''}`} />
                              </button>
                              <motion.div animate={{ rotate: isOpen ? 90 : 0 }}><ChevronRight className="w-4 h-4 text-[var(--text-secondary)]" /></motion.div>
                            </div>
                          </button>
                          <AnimatePresence>
                            {isOpen && (
                              <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }}
                                transition={{ duration: 0.2 }} className="overflow-hidden">
                                <div className="px-5 pb-5 border-t border-[var(--border)]">
                                  {sec.isArray && Array.isArray(sec.content) && (
                                    <div className="space-y-2 mt-4">
                                      {sec.content.map((item, i) => (
                                        <div key={i} className="flex items-start gap-2.5 p-3 rounded-xl bg-[var(--bg-secondary)]/50">
                                          <span className="text-[10px] font-bold text-[var(--accent)] bg-[var(--accent)]/10 rounded-full w-5 h-5 flex items-center justify-center flex-shrink-0 mt-0.5">{i + 1}</span>
                                          <span className="text-xs text-[var(--text-primary)] leading-relaxed">{item}</span>
                                        </div>
                                      ))}
                                    </div>
                                  )}
                                  {sec.isQuiz && Array.isArray(sec.content) && (
                                    <div className="space-y-3 mt-4">
                                      {sec.content.map((q, i) => (
                                        <div key={i} className="p-4 rounded-xl bg-[var(--bg-secondary)]/50 space-y-2">
                                          <div className="flex items-start gap-2">
                                            <span className="text-[10px] font-bold text-white bg-[var(--accent)] rounded-full w-5 h-5 flex items-center justify-center flex-shrink-0">{i + 1}</span>
                                            <div className="flex-1">
                                              <p className="text-xs font-bold text-[var(--text-primary)]">{q.question}</p>
                                              {q.type && <span className="text-[9px] font-bold px-1.5 py-0.5 rounded bg-purple-500/10 text-purple-500 mt-1 inline-block">{q.type.toUpperCase()}</span>}
                                            </div>
                                          </div>
                                          <div className="ml-7 p-2.5 rounded-lg bg-green-500/5 border border-green-500/10">
                                            <p className="text-[10px] font-bold text-green-500 mb-0.5">Answer:</p>
                                            <p className="text-xs text-[var(--text-primary)]">{q.answer}</p>
                                          </div>
                                        </div>
                                      ))}
                                    </div>
                                  )}
                                  {sec.isExercises && Array.isArray(sec.content) && (
                                    <div className="space-y-4 mt-4">
                                      {sec.content.map((ex, i) => (
                                        <div key={i} className="p-4 rounded-xl bg-[var(--bg-secondary)]/50 space-y-2">
                                          <div className="flex items-start gap-2">
                                            <span className="text-[10px] font-bold text-white bg-purple-500 rounded-full w-5 h-5 flex items-center justify-center flex-shrink-0">{i + 1}</span>
                                            <p className="text-xs font-bold text-[var(--text-primary)]">{ex.problem}</p>
                                          </div>
                                          <div className="ml-7 p-2.5 rounded-lg bg-[var(--accent)]/5 border border-[var(--accent)]/10">
                                            <p className="text-[10px] font-bold text-[var(--accent)] mb-0.5">Solution:</p>
                                            <p className="text-xs text-[var(--text-primary)] whitespace-pre-line">{ex.solution}</p>
                                          </div>
                                        </div>
                                      ))}
                                    </div>
                                  )}
                                  {!sec.isArray && !sec.isQuiz && !sec.isExercises && (
                                    <div className="mt-4 text-xs text-[var(--text-primary)] leading-relaxed whitespace-pre-line">{sec.content}</div>
                                  )}
                                </div>
                              </motion.div>
                            )}
                          </AnimatePresence>
                        </motion.div>
                      );
                    })}
                  </motion.div>
                )}

                {activeTab === 'chat' && (
                  <motion.div key="chat" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
                    className="max-w-3xl mx-auto">
                    <div className="glass-panel rounded-2xl border border-[var(--border)] overflow-hidden flex flex-col" style={{ height: '70vh', minHeight: '400px' }}>
                      <div className="px-4 py-3 border-b border-[var(--border)] flex items-center gap-2">
                        <div className="p-1.5 rounded-lg bg-[var(--accent)]/10"><MessageSquare className="w-4 h-4 text-[var(--accent)]" /></div>
                        <div>
                          <h3 className="text-xs font-bold text-[var(--text-primary)]">AI Tutor</h3>
                          <p className="text-[10px] text-[var(--text-secondary)]">Ask anything about "{topic}"</p>
                        </div>
                      </div>
                      <div className="flex-1 overflow-y-auto p-4 space-y-4">
                        {chatMessages.length === 0 && (
                          <EmptyState icon={MessageSquare} title="Start a conversation"
                            description="Ask questions, request examples, or get clarification on any concept." />
                        )}
                        {chatMessages.map((msg, i) => (
                          <motion.div key={i} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}
                            className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                            <div className={`max-w-[80%] px-4 py-2.5 rounded-2xl text-xs leading-relaxed ${
                              msg.role === 'user' ? 'bg-[var(--accent)] text-white rounded-br-sm' : 'bg-[var(--bg-secondary)] border border-[var(--border)] text-[var(--text-primary)] rounded-bl-sm'
                            }`}><div className="whitespace-pre-line">{msg.content}</div></div>
                          </motion.div>
                        ))}
                        {chatLoading && (
                          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex justify-start">
                            <div className="px-4 py-3 rounded-2xl bg-[var(--bg-secondary)] border border-[var(--border)] rounded-bl-sm">
                              <div className="flex items-center gap-1.5">
                                {[0, 150, 300].map((d, i) => (
                                  <div key={i} className="w-1.5 h-1.5 rounded-full bg-[var(--accent)] animate-bounce" style={{ animationDelay: `${d}ms` }} />
                                ))}
                              </div>
                            </div>
                          </motion.div>
                        )}
                        <div ref={chatEndRef} />
                      </div>
                      <div className="p-3 border-t border-[var(--border)]">
                        <div className="flex items-center gap-2">
                          <input type="text" value={chatInput} onChange={e => setChatInput(e.target.value)}
                            onKeyDown={e => e.key === 'Enter' && handleChatSend()} placeholder="Ask a question..." disabled={chatLoading}
                            className="flex-1 px-4 py-2.5 rounded-xl bg-[var(--bg-secondary)] border border-[var(--border)] text-xs text-[var(--text-primary)] focus:outline-none focus:border-[var(--accent)] transition-all" />
                          <Button variant="primary" size="sm" icon={Send} onClick={handleChatSend} disabled={chatLoading || !chatInput.trim()} />
                        </div>
                      </div>
                    </div>
                  </motion.div>
                )}

                {activeTab === 'notes' && (
                  <motion.div key="notes" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
                    className="max-w-3xl mx-auto space-y-3">
                    {savedNotes.length === 0 ? (
                      <EmptyState icon={BookMarked} title="No saved notes yet" description='Click "Save" on any study guide to store it here.' />
                    ) : savedNotes.map(note => (
                      <motion.div key={note.id} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}
                        className="glass-panel p-4 rounded-2xl border border-[var(--border)] flex items-center justify-between gap-3 hover:border-[var(--accent)]/20 transition-all cursor-pointer"
                        onClick={() => loadFromHistory(note)}>
                        <div className="flex items-center gap-3 min-w-0">
                          <div className="p-2 rounded-xl bg-[var(--accent)]/10 flex-shrink-0"><BookMarked className="w-4 h-4 text-[var(--accent)]" /></div>
                          <div className="min-w-0">
                            <p className="text-xs font-bold text-[var(--text-primary)] truncate">{note.topic}</p>
                            <p className="text-[10px] text-[var(--text-secondary)]">{note.subject || 'General'} · {new Date(note.timestamp).toLocaleDateString()}</p>
                          </div>
                        </div>
                        <button onClick={(e) => { e.stopPropagation(); setSavedNotes(prev => prev.filter(n => n.id !== note.id)); }}
                          className="p-1.5 rounded-lg hover:bg-red-500/10 text-[var(--text-secondary)] hover:text-red-500 transition-all flex-shrink-0">
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </motion.div>
                    ))}
                  </motion.div>
                )}

                {activeTab === 'history' && (
                  <motion.div key="history" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
                    className="max-w-3xl mx-auto space-y-3">
                    {history.length === 0 ? (
                      <EmptyState icon={History} title="No history yet" description="Generate your first study guide to see it here." />
                    ) : history.map(entry => (
                      <motion.div key={entry.id} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}
                        className="glass-panel p-4 rounded-2xl border border-[var(--border)] flex items-center justify-between gap-3 hover:border-[var(--accent)]/20 transition-all cursor-pointer"
                        onClick={() => loadFromHistory(entry)}>
                        <div className="flex items-center gap-3 min-w-0">
                          <div className="p-2 rounded-xl bg-purple-500/10 flex-shrink-0"><Clock className="w-4 h-4 text-purple-500" /></div>
                          <div className="min-w-0">
                            <p className="text-xs font-bold text-[var(--text-primary)] truncate">{entry.topic}</p>
                            <p className="text-[10px] text-[var(--text-secondary)]">{entry.subject || 'General'} · {entry.difficulty} · {new Date(entry.timestamp).toLocaleDateString()}</p>
                          </div>
                        </div>
                        <button onClick={(e) => { e.stopPropagation(); setHistory(prev => prev.filter(h => h.id !== entry.id)); }}
                          className="p-1.5 rounded-lg hover:bg-red-500/10 text-[var(--text-secondary)] hover:text-red-500 transition-all flex-shrink-0">
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </motion.div>
                    ))}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          )}
        </div>
      </ToolLayout>

      {/* Loading overlay */}
      <AnimatePresence>
        {loading && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm">
            <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }}
              className="glass-panel p-8 rounded-2xl flex flex-col items-center max-w-sm w-full mx-4 text-center border border-white/10">
              <div className="relative w-20 h-20 mb-6">
                <div className="absolute inset-0 rounded-full border-4 border-[var(--accent)]/10" />
                <motion.div animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 1.5, ease: "linear" }}
                  className="absolute inset-0 rounded-full border-4 border-t-[var(--accent)] border-r-[var(--accent)]/30 border-b-transparent border-l-transparent" />
                <div className="absolute inset-4 rounded-full border border-purple-500/20" />
                <motion.div animate={{ rotate: -360 }} transition={{ repeat: Infinity, duration: 2.5, ease: "linear" }}
                  className="absolute inset-4 rounded-full border border-t-purple-500 border-r-transparent border-b-transparent border-l-purple-500/30" />
              </div>
              <h3 className="text-lg font-semibold text-[var(--text-primary)] mb-2">Creating Your Study Guide</h3>
              <p className="text-sm text-[var(--text-secondary)]">AI is preparing explanations, quizzes, formulas & memory tricks for "{topic}"...</p>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </ErrorBoundary>
  );
};

export default StudyCompanion;
