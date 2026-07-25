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

const fadeUp = { initial: { opacity: 0, y: 10 }, animate: { opacity: 1, y: 0 }, transition: { duration: 0.25 } };

const StudyCompanion = () => {
  // Form state
  const [topic, setTopic] = useState('');
  const [subject, setSubject] = useState('');
  const [difficulty, setDifficulty] = useState('intermediate');
  const [goal, setGoal] = useState('understand');
  const [learningStyle, setLearningStyle] = useState('balanced');

  // Generation state
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [activeTab, setActiveTab] = useState('result');
  const [expandedSections, setExpandedSections] = useState({
    explanation: true, keyConcepts: true, formulas: true,
    examples: true, memoryTricks: true, quiz: true,
    exercises: true, revisionNotes: true, summary: true,
  });

  // Chat state
  const [chatMessages, setChatMessages] = useState([]);
  const [chatInput, setChatInput] = useState('');
  const [chatLoading, setChatLoading] = useState(false);
  const chatEndRef = useRef(null);

  // Notes & History
  const [savedNotes, setSavedNotes] = useState(() => {
    try { return JSON.parse(localStorage.getItem('studyNotes') || '[]'); } catch { return []; }
  });
  const [history, setHistory] = useState(() => {
    try { return JSON.parse(localStorage.getItem('studyHistory') || '[]'); } catch { return []; }
  });

  // Regenerate state
  const [regenerating, setRegenerating] = useState(null);

  // Save to localStorage
  useEffect(() => {
    localStorage.setItem('studyNotes', JSON.stringify(savedNotes));
  }, [savedNotes]);

  useEffect(() => {
    localStorage.setItem('studyHistory', JSON.stringify(history));
  }, [history]);

  // Auto-scroll chat
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [chatMessages]);

  // Generate study content
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

      // Add to history
      const entry = {
        id: Date.now(),
        topic,
        subject,
        difficulty,
        goal,
        style: learningStyle,
        timestamp: new Date().toISOString(),
        data,
      };
      setHistory(prev => [entry, ...prev].slice(0, 50));
    } catch (e) {
      alert(e.message || 'Generation failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  // Regenerate a section
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
    } catch (e) {
      console.error('Regenerate failed:', e);
    } finally {
      setRegenerating(null);
    }
  };

  // Chat
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
        body: JSON.stringify({
          messages: [...chatMessages, userMsg].map(m => ({ role: m.role, content: m.content })),
          topic,
        }),
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error);
      setChatMessages(prev => [...prev, { role: 'assistant', content: data.content }]);
    } catch (e) {
      setChatMessages(prev => [...prev, { role: 'assistant', content: 'Sorry, I encountered an error. Please try again.' }]);
    } finally {
      setChatLoading(false);
    }
  };

  // Copy to clipboard
  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(typeof text === 'string' ? text : JSON.stringify(text, null, 2));
  };

  // Save notes
  const saveNotes = () => {
    if (!result) return;
    const note = {
      id: Date.now(),
      topic,
      subject,
      difficulty,
      timestamp: new Date().toISOString(),
      data: result,
    };
    setSavedNotes(prev => [note, ...prev].slice(0, 100));
  };

  // Export PDF
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
    } catch (e) {
      console.error('PDF export failed:', e);
      alert('PDF export failed. Please try again.');
    }
  };

  // Toggle section
  const toggleSection = (key) => {
    setExpandedSections(prev => ({ ...prev, [key]: !prev[key] }));
  };

  // Delete history entry
  const deleteHistory = (id) => {
    setHistory(prev => prev.filter(h => h.id !== id));
  };

  // Load from history
  const loadFromHistory = (entry) => {
    setTopic(entry.topic);
    setSubject(entry.subject || '');
    setDifficulty(entry.difficulty || 'intermediate');
    setGoal(entry.goal || 'understand');
    setLearningStyle(entry.style || 'balanced');
    setResult(entry.data);
    setActiveTab('result');
    setChatMessages([]);
  };

  // Delete saved note
  const deleteNote = (id) => {
    setSavedNotes(prev => prev.filter(n => n.id !== id));
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="text-center space-y-2">
        <motion.div {...fadeUp} className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-gradient-to-br from-indigo-500/20 to-purple-500/10 border border-indigo-500/30">
          <Brain className="w-7 h-7 text-indigo-500" />
        </motion.div>
        <motion.h1 {...fadeUp} className="text-3xl font-black bg-gradient-to-r from-indigo-500 to-purple-500 bg-clip-text text-transparent">
          AI Study Companion
        </motion.h1>
        <motion.p {...fadeUp} className="text-sm text-[var(--text-secondary)] max-w-md mx-auto">
          Learn any topic with AI-powered explanations, quizzes, memory tricks & more.
        </motion.p>
      </div>

      {/* Form */}
      {!result && (
        <motion.div initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} className="max-w-2xl mx-auto space-y-5">
          {/* Topic Input */}
          <div className="glass-panel p-5 rounded-2xl space-y-3">
            <div className="flex items-center gap-2">
              <Pencil className="w-4 h-4 text-indigo-500" />
              <label className="text-xs font-bold uppercase tracking-wider text-[var(--text-secondary)]">What do you want to learn?</label>
            </div>
            <input type="text" value={topic} onChange={e => setTopic(e.target.value)}
              placeholder="e.g. Quantum Entanglement, Binary Search Trees, Supply and Demand..."
              className="w-full px-4 py-3 rounded-xl bg-[var(--bg-secondary)] border border-[var(--border)] text-sm text-[var(--text-primary)] focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all"
              onKeyDown={e => e.key === 'Enter' && handleGenerate()} />
          </div>

          {/* Options Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Subject */}
            <div className="glass-panel p-4 rounded-2xl space-y-3">
              <label className="text-xs font-bold uppercase tracking-wider text-[var(--text-secondary)] flex items-center gap-1.5">
                <BookOpen className="w-3 h-3" /> Subject
              </label>
              <input type="text" value={subject} onChange={e => setSubject(e.target.value)}
                placeholder="e.g. Mathematics, Physics, History..."
                className="w-full px-3 py-2.5 rounded-xl bg-[var(--bg-secondary)] border border-[var(--border)] text-xs font-medium text-[var(--text-primary)] focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all" />
            </div>

            {/* Difficulty */}
            <div className="glass-panel p-4 rounded-2xl space-y-3">
              <label className="text-xs font-bold uppercase tracking-wider text-[var(--text-secondary)] flex items-center gap-1.5">
                <BarChart3 className="w-3 h-3" /> Difficulty
              </label>
              <div className="flex gap-2">
                {DIFFICULTIES.map(d => (
                  <button key={d.id} onClick={() => setDifficulty(d.id)}
                    className={`flex-1 px-2 py-2 rounded-xl text-[10px] font-bold transition-all border ${
                      difficulty === d.id
                        ? 'bg-indigo-500/10 border-indigo-500/30 text-indigo-500'
                        : 'bg-[var(--bg-secondary)] border-[var(--border)] text-[var(--text-secondary)] hover:border-indigo-500/20'
                    }`}>
                    {d.label}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Study Goal */}
          <div className="glass-panel p-4 rounded-2xl space-y-3">
            <label className="text-xs font-bold uppercase tracking-wider text-[var(--text-secondary)] flex items-center gap-1.5">
              <Target className="w-3 h-3" /> Study Goal
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-5 gap-2">
              {GOALS.map(g => {
                const Icon = g.icon;
                return (
                  <button key={g.id} onClick={() => setGoal(g.id)}
                    className={`flex flex-col items-center gap-1.5 px-2 py-3 rounded-xl text-[10px] font-bold transition-all border ${
                      goal === g.id
                        ? 'bg-indigo-500/10 border-indigo-500/30 text-indigo-500'
                        : 'bg-[var(--bg-secondary)] border-[var(--border)] text-[var(--text-secondary)] hover:border-indigo-500/20'
                    }`}>
                    <Icon className="w-4 h-4" />
                    <span className="text-center leading-tight">{g.label}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Learning Style */}
          <div className="glass-panel p-4 rounded-2xl space-y-3">
            <label className="text-xs font-bold uppercase tracking-wider text-[var(--text-secondary)] flex items-center gap-1.5">
              <Sparkles className="w-3 h-3" /> Learning Style
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              {STYLES.map(s => (
                <button key={s.id} onClick={() => setLearningStyle(s.id)}
                  className={`flex flex-col items-center gap-1 px-3 py-3 rounded-xl text-[10px] font-bold transition-all border ${
                    learningStyle === s.id
                      ? 'bg-indigo-500/10 border-indigo-500/30 text-indigo-500'
                      : 'bg-[var(--bg-secondary)] border-[var(--border)] text-[var(--text-secondary)] hover:border-indigo-500/20'
                  }`}>
                  <span>{s.label}</span>
                  <span className="text-[9px] font-medium opacity-60">{s.desc}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Generate Button */}
          <motion.button whileHover={!loading ? { scale: 1.02 } : {}} whileTap={!loading ? { scale: 0.98 } : {}}
            onClick={handleGenerate} disabled={loading || !topic.trim()}
            className="w-full py-3.5 rounded-xl bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 text-white font-bold text-sm shadow-lg shadow-indigo-500/20 flex items-center justify-center gap-2 transition-all disabled:opacity-40 disabled:cursor-not-allowed">
            {loading ? (
              <>
                <RefreshCw className="w-4 h-4 animate-spin" />
                Generating study guide...
              </>
            ) : (
              <>
                <Zap className="w-4 h-4" />
                Generate Study Guide
              </>
            )}
          </motion.button>
        </motion.div>
      )}

      {/* Result Area */}
      {result && (
        <div className="space-y-5">
          {/* Action Bar */}
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div className="flex items-center gap-2">
              <h2 className="text-lg font-black text-[var(--text-primary)] truncate max-w-xs">{topic}</h2>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-indigo-500/10 text-indigo-500">{subject || 'General'}</span>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-purple-500/10 text-purple-500 capitalize">{difficulty}</span>
            </div>
            <div className="flex items-center gap-2">
              <button onClick={saveNotes} className="px-3 py-1.5 rounded-xl text-xs font-bold bg-[var(--bg-secondary)] border border-[var(--border)] text-[var(--text-secondary)] hover:text-indigo-500 hover:border-indigo-500/30 transition-all flex items-center gap-1.5">
                <Save className="w-3 h-3" /> Save
              </button>
              <button onClick={exportPDF} className="px-3 py-1.5 rounded-xl text-xs font-bold bg-[var(--bg-secondary)] border border-[var(--border)] text-[var(--text-secondary)] hover:text-indigo-500 hover:border-indigo-500/30 transition-all flex items-center gap-1.5">
                <Download className="w-3 h-3" /> PDF
              </button>
              <button onClick={() => { setResult(null); setChatMessages([]); }} className="px-3 py-1.5 rounded-xl text-xs font-bold bg-[var(--bg-secondary)] border border-[var(--border)] text-[var(--text-secondary)] hover:text-pink-500 hover:border-pink-500/30 transition-all flex items-center gap-1.5">
                <RefreshCw className="w-3 h-3" /> New Topic
              </button>
            </div>
          </div>

          {/* Tabs */}
          <div className="flex border-b border-[var(--border)] pb-1 overflow-x-auto scrollbar-hide">
            {TABS.map(tab => {
              const Icon = tab.icon;
              return (
                <button key={tab.id} onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center gap-1.5 px-4 py-2 font-bold text-xs border-b-2 whitespace-nowrap transition-all ${
                    activeTab === tab.id
                      ? 'border-indigo-500 text-indigo-500'
                      : 'border-transparent text-[var(--text-secondary)] hover:text-[var(--text-primary)]'
                  }`}>
                  <Icon className="w-3.5 h-3.5" /> {tab.label}
                </button>
              );
            })}
          </div>

          {/* Tab Content */}
          <AnimatePresence mode="wait">
            {activeTab === 'result' && (
              <motion.div key="result" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}
                id="study-printable-area" className="max-w-3xl mx-auto space-y-4">
                <StudyResultPanel result={result} expandedSections={expandedSections} toggleSection={toggleSection}
                  onRegenerate={handleRegenerate} regenerating={regenerating} onCopy={copyToClipboard} />
              </motion.div>
            )}

            {activeTab === 'chat' && (
              <motion.div key="chat" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}
                className="max-w-3xl mx-auto">
                <ChatPanel messages={chatMessages} input={chatInput} setInput={setChatInput}
                  onSend={handleChatSend} loading={chatLoading} chatEndRef={chatEndRef} topic={topic} />
              </motion.div>
            )}

            {activeTab === 'notes' && (
              <motion.div key="notes" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}
                className="max-w-3xl mx-auto">
                <NotesPanel notes={savedNotes} onLoad={loadFromHistory} onDelete={deleteNote} />
              </motion.div>
            )}

            {activeTab === 'history' && (
              <motion.div key="history" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}
                className="max-w-3xl mx-auto">
                <HistoryPanel history={history} onLoad={loadFromHistory} onDelete={deleteHistory} />
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      )}

      {/* Loading overlay */}
      <AnimatePresence>
        {loading && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm">
            <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }}
              className="glass-panel p-8 rounded-2xl flex flex-col items-center max-w-sm w-full mx-4 text-center border border-white/10">
              <div className="relative w-20 h-20 mb-6">
                <div className="absolute inset-0 rounded-full border-4 border-indigo-500/10"></div>
                <motion.div animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 1.5, ease: "linear" }}
                  className="absolute inset-0 rounded-full border-4 border-t-indigo-500 border-r-indigo-500/30 border-b-transparent border-l-transparent" />
                <div className="absolute inset-4 rounded-full border border-purple-500/20"></div>
                <motion.div animate={{ rotate: -360 }} transition={{ repeat: Infinity, duration: 2.5, ease: "linear" }}
                  className="absolute inset-4 rounded-full border border-t-purple-500 border-r-transparent border-b-transparent border-l-purple-500/30" />
              </div>
              <h3 className="text-lg font-semibold text-[var(--text-primary)] mb-2">Creating Your Study Guide</h3>
              <p className="text-sm text-[var(--text-secondary)]">AI is preparing explanations, quizzes, formulas & memory tricks for "{topic}"...</p>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

// ============================================================
// StudyResultPanel — renders all generated sections
// ============================================================
const StudyResultPanel = ({ result, expandedSections, toggleSection, onRegenerate, regenerating, onCopy }) => {
  const sections = [
    { key: 'explanation', title: 'Explanation', icon: BookOpen, content: result.explanation },
    { key: 'keyConcepts', title: 'Key Concepts', icon: Lightbulb, content: result.keyConcepts, isArray: true },
    { key: 'formulas', title: 'Formulas & Rules', icon: Calculator, content: result.formulas },
    { key: 'examples', title: 'Real-World Examples', icon: Sparkles, content: result.examples, isArray: true },
    { key: 'memoryTricks', title: 'Memory Tricks', icon: Brain, content: result.memoryTricks, isArray: true },
    { key: 'quiz', title: 'Quiz Questions', icon: ListChecks, content: result.quiz, isQuiz: true },
    { key: 'exercises', title: 'Practice Exercises', icon: PenTool, content: result.exercises, isExercises: true },
    { key: 'revisionNotes', title: 'Revision Notes', icon: BookMarked, content: result.revisionNotes },
    { key: 'summary', title: 'Summary', icon: FileText, content: result.summary },
  ];

  return (
    <div className="space-y-3">
      {sections.map(sec => {
        const Icon = sec.icon;
        const isOpen = expandedSections[sec.key];
        const hasContent = sec.isArray || sec.isQuiz || sec.isExercises
          ? (Array.isArray(sec.content) && sec.content.length > 0)
          : !!sec.content;

        if (!hasContent) return null;

        return (
          <motion.div key={sec.key} layout className="glass-panel rounded-2xl border border-[var(--border)] overflow-hidden">
            {/* Header */}
            <button onClick={() => toggleSection(sec.key)}
              className="w-full px-5 py-3.5 flex items-center justify-between hover:bg-[var(--bg-secondary)]/50 transition-colors">
              <div className="flex items-center gap-2.5">
                <div className="p-2 rounded-xl bg-indigo-500/10">
                  <Icon className="w-4 h-4 text-indigo-500" />
                </div>
                <h3 className="text-sm font-bold text-[var(--text-primary)]">{sec.title}</h3>
              </div>
              <div className="flex items-center gap-2">
                <button onClick={(e) => { e.stopPropagation(); onCopy(sec.isArray || sec.isQuiz || sec.isExercises ? JSON.stringify(sec.content, null, 2) : sec.content); }}
                  className="p-1.5 rounded-lg hover:bg-[var(--bg-secondary)] text-[var(--text-secondary)] hover:text-indigo-500 transition-all" title="Copy">
                  <Copy className="w-3.5 h-3.5" />
                </button>
                <button onClick={(e) => { e.stopPropagation(); onRegenerate(sec.key); }}
                  disabled={regenerating === sec.key}
                  className="p-1.5 rounded-lg hover:bg-[var(--bg-secondary)] text-[var(--text-secondary)] hover:text-purple-500 transition-all disabled:opacity-40" title="Regenerate">
                  <RefreshCw className={`w-3.5 h-3.5 ${regenerating === sec.key ? 'animate-spin' : ''}`} />
                </button>
                <motion.div animate={{ rotate: isOpen ? 90 : 0 }}>
                  <ChevronRight className="w-4 h-4 text-[var(--text-secondary)]" />
                </motion.div>
              </div>
            </button>

            {/* Content */}
            <AnimatePresence>
              {isOpen && (
                <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }} transition={{ duration: 0.2 }}
                  className="overflow-hidden">
                  <div className="px-5 pb-5 border-t border-[var(--border)]">
                    {sec.isArray && Array.isArray(sec.content) && (
                      <div className="space-y-2 mt-4">
                        {sec.content.map((item, i) => (
                          <div key={i} className="flex items-start gap-2.5 p-3 rounded-xl bg-[var(--bg-secondary)]/50">
                            <span className="text-[10px] font-bold text-indigo-500 bg-indigo-500/10 rounded-full w-5 h-5 flex items-center justify-center flex-shrink-0 mt-0.5">{i + 1}</span>
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
                              <span className="text-[10px] font-bold text-white bg-indigo-500 rounded-full w-5 h-5 flex items-center justify-center flex-shrink-0">{i + 1}</span>
                              <div className="flex-1">
                                <p className="text-xs font-bold text-[var(--text-primary)]">{q.question}</p>
                                {q.type && <span className="text-[9px] font-bold px-1.5 py-0.5 rounded bg-purple-500/10 text-purple-500 mt-1 inline-block">{q.type.toUpperCase()}</span>}
                              </div>
                            </div>
                            <div className="ml-7 p-2.5 rounded-lg bg-green-500/5 border border-green-500/10">
                              <p className="text-[10px] font-bold text-green-600 dark:text-green-400 mb-0.5">Answer:</p>
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
                            <div className="ml-7 p-2.5 rounded-lg bg-indigo-500/5 border border-indigo-500/10">
                              <p className="text-[10px] font-bold text-indigo-500 mb-0.5">Solution:</p>
                              <p className="text-xs text-[var(--text-primary)] whitespace-pre-line">{ex.solution}</p>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}

                    {!sec.isArray && !sec.isQuiz && !sec.isExercises && (
                      <div className="mt-4 text-xs text-[var(--text-primary)] leading-relaxed whitespace-pre-line">
                        {sec.content}
                      </div>
                    )}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        );
      })}
    </div>
  );
};

// ============================================================
// ChatPanel
// ============================================================
const ChatPanel = ({ messages, input, setInput, onSend, loading, chatEndRef, topic }) => {
  return (
    <div className="glass-panel rounded-2xl border border-[var(--border)] overflow-hidden flex flex-col" style={{ height: '70vh', minHeight: '400px' }}>
      {/* Chat Header */}
      <div className="px-4 py-3 border-b border-[var(--border)] flex items-center gap-2">
        <div className="p-1.5 rounded-lg bg-indigo-500/10">
          <MessageSquare className="w-4 h-4 text-indigo-500" />
        </div>
        <div>
          <h3 className="text-xs font-bold text-[var(--text-primary)]">AI Tutor</h3>
          <p className="text-[10px] text-[var(--text-secondary)]">Ask anything about "{topic}"</p>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.length === 0 && (
          <div className="flex flex-col items-center justify-center h-full text-center space-y-3">
            <div className="p-4 rounded-2xl bg-indigo-500/10">
              <MessageSquare className="w-8 h-8 text-indigo-500" />
            </div>
            <p className="text-sm font-bold text-[var(--text-primary)]">Start a conversation</p>
            <p className="text-xs text-[var(--text-secondary)] max-w-xs">Ask questions, request examples, or get clarification on any concept.</p>
          </div>
        )}

        {messages.map((msg, i) => (
          <motion.div key={i} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}
            className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
            <div className={`max-w-[80%] px-4 py-2.5 rounded-2xl text-xs leading-relaxed ${
              msg.role === 'user'
                ? 'bg-indigo-500 text-white rounded-br-sm'
                : 'bg-[var(--bg-secondary)] border border-[var(--border)] text-[var(--text-primary)] rounded-bl-sm'
            }`}>
              <div className="whitespace-pre-line">{msg.content}</div>
            </div>
          </motion.div>
        ))}

        {loading && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex justify-start">
            <div className="px-4 py-3 rounded-2xl bg-[var(--bg-secondary)] border border-[var(--border)] rounded-bl-sm">
              <div className="flex items-center gap-1.5">
                <div className="w-1.5 h-1.5 rounded-full bg-indigo-500 animate-bounce" style={{ animationDelay: '0ms' }} />
                <div className="w-1.5 h-1.5 rounded-full bg-indigo-500 animate-bounce" style={{ animationDelay: '150ms' }} />
                <div className="w-1.5 h-1.5 rounded-full bg-indigo-500 animate-bounce" style={{ animationDelay: '300ms' }} />
              </div>
            </div>
          </motion.div>
        )}

        <div ref={chatEndRef} />
      </div>

      {/* Input */}
      <div className="p-3 border-t border-[var(--border)]">
        <div className="flex items-center gap-2">
          <input type="text" value={input} onChange={e => setInput(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && onSend()}
            placeholder="Ask a question..."
            className="flex-1 px-4 py-2.5 rounded-xl bg-[var(--bg-secondary)] border border-[var(--border)] text-xs text-[var(--text-primary)] focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all"
            disabled={loading} />
          <button onClick={onSend} disabled={loading || !input.trim()}
            className="p-2.5 rounded-xl bg-indigo-500 hover:bg-indigo-600 text-white transition-all disabled:opacity-40 disabled:cursor-not-allowed">
            <Send className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};

// ============================================================
// NotesPanel
// ============================================================
const NotesPanel = ({ notes, onLoad, onDelete }) => {
  if (notes.length === 0) {
    return (
      <div className="glass-panel rounded-2xl p-12 border border-[var(--border)] flex flex-col items-center justify-center text-center space-y-3 min-h-[300px]">
        <BookMarked className="w-10 h-10 text-[var(--text-secondary)] opacity-30" />
        <p className="text-sm font-bold text-[var(--text-secondary)]">No saved notes yet</p>
        <p className="text-xs text-[var(--text-secondary)] opacity-60">Click "Save" on any study guide to store it here.</p>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      <h3 className="text-xs font-bold uppercase tracking-wider text-[var(--text-secondary)]">Saved Notes ({notes.length})</h3>
      {notes.map(note => (
        <motion.div key={note.id} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}
          className="glass-panel p-4 rounded-2xl border border-[var(--border)] flex items-center justify-between gap-3 hover:border-indigo-500/20 transition-all cursor-pointer"
          onClick={() => onLoad(note)}>
          <div className="flex items-center gap-3 min-w-0">
            <div className="p-2 rounded-xl bg-indigo-500/10 flex-shrink-0">
              <BookMarked className="w-4 h-4 text-indigo-500" />
            </div>
            <div className="min-w-0">
              <p className="text-xs font-bold text-[var(--text-primary)] truncate">{note.topic}</p>
              <p className="text-[10px] text-[var(--text-secondary)]">
                {note.subject || 'General'} · {new Date(note.timestamp).toLocaleDateString()}
              </p>
            </div>
          </div>
          <button onClick={(e) => { e.stopPropagation(); onDelete(note.id); }}
            className="p-1.5 rounded-lg hover:bg-red-500/10 text-[var(--text-secondary)] hover:text-red-500 transition-all flex-shrink-0">
            <Trash2 className="w-3.5 h-3.5" />
          </button>
        </motion.div>
      ))}
    </div>
  );
};

// ============================================================
// HistoryPanel
// ============================================================
const HistoryPanel = ({ history, onLoad, onDelete }) => {
  if (history.length === 0) {
    return (
      <div className="glass-panel rounded-2xl p-12 border border-[var(--border)] flex flex-col items-center justify-center text-center space-y-3 min-h-[300px]">
        <History className="w-10 h-10 text-[var(--text-secondary)] opacity-30" />
        <p className="text-sm font-bold text-[var(--text-secondary)]">No history yet</p>
        <p className="text-xs text-[var(--text-secondary)] opacity-60">Generate your first study guide to see it here.</p>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      <h3 className="text-xs font-bold uppercase tracking-wider text-[var(--text-secondary)]">Study History ({history.length})</h3>
      {history.map(entry => (
        <motion.div key={entry.id} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}
          className="glass-panel p-4 rounded-2xl border border-[var(--border)] flex items-center justify-between gap-3 hover:border-indigo-500/20 transition-all cursor-pointer"
          onClick={() => onLoad(entry)}>
          <div className="flex items-center gap-3 min-w-0">
            <div className="p-2 rounded-xl bg-purple-500/10 flex-shrink-0">
              <Clock className="w-4 h-4 text-purple-500" />
            </div>
            <div className="min-w-0">
              <p className="text-xs font-bold text-[var(--text-primary)] truncate">{entry.topic}</p>
              <p className="text-[10px] text-[var(--text-secondary)]">
                {entry.subject || 'General'} · {entry.difficulty} · {new Date(entry.timestamp).toLocaleDateString()}
              </p>
            </div>
          </div>
          <button onClick={(e) => { e.stopPropagation(); onDelete(entry.id); }}
            className="p-1.5 rounded-lg hover:bg-red-500/10 text-[var(--text-secondary)] hover:text-red-500 transition-all flex-shrink-0">
            <Trash2 className="w-3.5 h-3.5" />
          </button>
        </motion.div>
      ))}
    </div>
  );
};

export default StudyCompanion;
