import React, { useState, useEffect, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Brain, Layers, FileText, PenTool, Sparkles, Plus, X, Send,
  Copy, Download, Bookmark, BookmarkCheck, Shuffle, RotateCcw,
  ChevronLeft, ChevronRight, Check, BarChart3, Clock, Trash2,
  Eye, EyeOff, Zap, Upload, ArrowRight, ListChecks, Target,
  RefreshCw, AlertCircle, History, Star, BookMarked
} from 'lucide-react';
import Dropzone from '../../components/Dropzone';
import { Tabs, Button, EmptyState, StatCard, SectionHeader, ToolLayout, ErrorBoundary } from '../../components/shared';

const DIFFICULTIES = [
  { id: 'easy', label: 'Easy' },
  { id: 'medium', label: 'Medium' },
  { id: 'hard', label: 'Hard' },
];

const TABS = [
  { id: 'create', label: 'Create', icon: Plus },
  { id: 'study', label: 'Study', icon: Eye },
  { id: 'quiz', label: 'Quiz', icon: Target },
  { id: 'stats', label: 'Stats', icon: BarChart3 },
  { id: 'history', label: 'History', icon: History },
];

const FlashcardTool = () => {
  const [cards, setCards] = useState(() => {
    try { return JSON.parse(localStorage.getItem('flashcards') || '[]'); } catch { return []; }
  });
  const [activeTab, setActiveTab] = useState('create');
  const [loading, setLoading] = useState(false);
  const [loadingMsg, setLoadingMsg] = useState('');

  const [createMode, setCreateMode] = useState('topic');
  const [topicInput, setTopicInput] = useState('');
  const [topicCount, setTopicCount] = useState(10);
  const [topicDifficulty, setTopicDifficulty] = useState('medium');
  const [notesInput, setNotesInput] = useState('');
  const [fileFile, setFileFile] = useState(null);
  const [manualFront, setManualFront] = useState('');
  const [manualBack, setManualBack] = useState('');
  const [manualHint, setManualHint] = useState('');
  const [manualDifficulty, setManualDifficulty] = useState('medium');

  const [studyIndex, setStudyIndex] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);
  const [studyFilter, setStudyFilter] = useState('all');
  const [shuffled, setShuffled] = useState(false);
  const [studyOrder, setStudyOrder] = useState([]);

  const [quizIndex, setQuizIndex] = useState(0);
  const [quizAnswer, setQuizAnswer] = useState('');
  const [quizResult, setQuizResult] = useState(null);
  const [quizScore, setQuizScore] = useState({ correct: 0, total: 0 });
  const [quizFilter, setQuizFilter] = useState('all');
  const [quizOrder, setQuizOrder] = useState([]);
  const [showHint, setShowHint] = useState(false);

  const [stats, setStats] = useState(() => {
    try { return JSON.parse(localStorage.getItem('flashcardStats') || '{"totalStudySessions":0,"totalCardsStudied":0,"totalQuizzes":0,"averageQuizScore":0,"streak":0,"lastStudyDate":null}'); } catch { return { totalStudySessions: 0, totalCardsStudied: 0, totalQuizzes: 0, averageQuizScore: 0, streak: 0, lastStudyDate: null }; }
  });
  const [history, setHistory] = useState(() => {
    try { return JSON.parse(localStorage.getItem('flashcardHistory') || '[]'); } catch { return []; }
  });

  useEffect(() => { localStorage.setItem('flashcards', JSON.stringify(cards)); }, [cards]);
  useEffect(() => { localStorage.setItem('flashcardStats', JSON.stringify(stats)); }, [stats]);
  useEffect(() => { localStorage.setItem('flashcardHistory', JSON.stringify(history)); }, [history]);

  useEffect(() => {
    const filtered = filterCards(cards, studyFilter);
    setStudyOrder(shuffled ? shuffleArray(filtered.map((_, i) => i)) : filtered.map((_, i) => i));
    setStudyIndex(0); setIsFlipped(false);
  }, [cards, studyFilter, shuffled]);

  useEffect(() => {
    const filtered = filterCards(cards, quizFilter);
    setQuizOrder(shuffled ? shuffleArray(filtered.map((_, i) => i)) : filtered.map((_, i) => i));
    setQuizIndex(0); setQuizAnswer(''); setQuizResult(null); setQuizScore({ correct: 0, total: 0 });
  }, [cards, quizFilter, shuffled]);

  function filterCards(allCards, filter) {
    if (filter === 'all') return allCards;
    if (filter === 'bookmarked') return allCards.filter(c => c.bookmarked);
    if (['easy', 'medium', 'hard'].includes(filter)) return allCards.filter(c => c.difficulty === filter);
    if (filter === 'due') return allCards.filter(c => new Date(c.nextReview) <= new Date());
    return allCards;
  }

  function shuffleArray(arr) {
    const copy = [...arr];
    for (let i = copy.length - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1)); [copy[i], copy[j]] = [copy[j], copy[i]]; }
    return copy;
  }

  const handleTopicGenerate = async () => {
    if (!topicInput.trim()) return;
    setLoading(true); setLoadingMsg('AI is creating flashcards...');
    try {
      const res = await fetch('/api/flashcard/generate', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ topic: topicInput, count: topicCount, difficulty: topicDifficulty }) });
      const data = await res.json(); if (!res.ok) throw new Error(data.error);
      setCards(prev => [...data, ...prev]); setTopicInput(''); setActiveTab('study');
    } catch (e) { alert(e.message || 'Failed to generate flashcards.'); }
    finally { setLoading(false); }
  };

  const handleFileGenerate = async () => {
    if (!fileFile) return;
    setLoading(true); setLoadingMsg('Extracting text and generating flashcards...');
    try {
      const fd = new FormData(); fd.append('file', fileFile); fd.append('count', '10'); fd.append('difficulty', 'medium');
      const res = await fetch('/api/flashcard/file', { method: 'POST', body: fd });
      const data = await res.json(); if (!res.ok) throw new Error(data.error);
      setCards(prev => [...data, ...prev]); setFileFile(null); setActiveTab('study');
    } catch (e) { alert(e.message || 'Failed to generate from file.'); }
    finally { setLoading(false); }
  };

  const handleNotesGenerate = async () => {
    if (notesInput.trim().length < 20) return;
    setLoading(true); setLoadingMsg('Generating flashcards from your notes...');
    try {
      const res = await fetch('/api/flashcard/notes', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ text: notesInput, count: 10, difficulty: 'medium' }) });
      const data = await res.json(); if (!res.ok) throw new Error(data.error);
      setCards(prev => [...data, ...prev]); setNotesInput(''); setActiveTab('study');
    } catch (e) { alert(e.message || 'Failed to generate from notes.'); }
    finally { setLoading(false); }
  };

  const handleManualAdd = () => {
    if (!manualFront.trim() || !manualBack.trim()) return;
    setCards(prev => [{ id: `manual-${Date.now()}`, front: manualFront.trim(), back: manualBack.trim(), difficulty: manualDifficulty, hint: manualHint.trim(), bookmarked: false, repetitions: 0, easeFactor: 2.5, interval: 1, nextReview: new Date().toISOString(), lastReviewed: null }, ...prev]);
    setManualFront(''); setManualBack(''); setManualHint(''); setManualDifficulty('medium');
  };

  const deleteCard = (id) => setCards(prev => prev.filter(c => c.id !== id));
  const toggleBookmark = (id) => setCards(prev => prev.map(c => c.id === id ? { ...c, bookmarked: !c.bookmarked } : c));

  const updateSpacedRepetition = (cardId, quality) => {
    setCards(prev => prev.map(c => {
      if (c.id !== cardId) return c;
      let { easeFactor, interval, repetitions } = c;
      if (quality >= 3) { if (repetitions === 0) interval = 1; else if (repetitions === 1) interval = 6; else interval = Math.round(interval * easeFactor); repetitions += 1; }
      else { repetitions = 0; interval = 1; }
      easeFactor = Math.max(1.3, easeFactor + (0.1 - (5 - quality) * (0.08 + (5 - quality) * 0.02)));
      const next = new Date(); next.setDate(next.getDate() + interval);
      return { ...c, easeFactor, interval, repetitions, nextReview: next.toISOString(), lastReviewed: new Date().toISOString() };
    }));
  };

  const checkQuizAnswer = () => {
    const filtered = filterCards(cards, quizFilter);
    const card = filtered[quizOrder[quizIndex]];
    if (!card) return;
    const isCorrect = quizAnswer.trim().toLowerCase() === card.back.trim().toLowerCase();
    setQuizResult(isCorrect ? 'correct' : 'wrong');
    setQuizScore(prev => ({ correct: prev.correct + (isCorrect ? 1 : 0), total: prev.total + 1 }));
    updateSpacedRepetition(card.id, isCorrect ? 4 : 1);
  };

  const nextQuiz = () => { if (quizIndex < quizOrder.length - 1) { setQuizIndex(prev => prev + 1); setQuizAnswer(''); setQuizResult(null); setShowHint(false); } };
  const toggleShuffle = () => setShuffled(prev => !prev);
  const clearAllCards = () => { if (window.confirm('Delete all flashcards? This cannot be undone.')) setCards([]); };

  const exportCards = () => {
    const data = cards.map(c => ({ front: c.front, back: c.back, difficulty: c.difficulty, hint: c.hint }));
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob); const a = document.createElement('a'); a.href = url; a.download = `flashcards_${new Date().toISOString().slice(0, 10)}.json`; a.click(); URL.revokeObjectURL(url);
  };

  const filteredStudy = filterCards(cards, studyFilter);
  const filteredQuiz = filterCards(cards, quizFilter);
  const studyCard = filteredStudy[studyOrder[studyIndex]];
  const quizCard = filteredQuiz[quizOrder[quizIndex]];

  const createModes = [
    { id: 'topic', label: 'AI Topic', icon: Sparkles },
    { id: 'file', label: 'PDF / DOCX', icon: Upload },
    { id: 'notes', label: 'Paste Notes', icon: FileText },
    { id: 'manual', label: 'Manual', icon: PenTool },
  ];

  return (
    <ErrorBoundary>
      <ToolLayout icon={Layers} title="Smart Flashcards" subtitle="Create, study & quiz with AI-powered flashcards. Spaced repetition for better retention." accentColor="#6366f1">
        <div className="space-y-5">
          <Tabs tabs={TABS} active={activeTab} onChange={setActiveTab} />

          <AnimatePresence mode="wait">
            {/* ==================== CREATE TAB ==================== */}
            {activeTab === 'create' && (
              <motion.div key="create" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="max-w-2xl mx-auto space-y-5">
                <div className="flex gap-2 overflow-x-auto pb-1">
                  {createModes.map(m => (
                    <button key={m.id} onClick={() => setCreateMode(m.id)}
                      className={`flex items-center gap-1.5 px-3 py-2 rounded-xl text-[10px] font-bold whitespace-nowrap border transition-all ${
                        createMode === m.id ? 'bg-[var(--accent)]/10 border-[var(--accent)]/30 text-[var(--accent)]' : 'bg-[var(--bg-secondary)] border-[var(--border)] text-[var(--text-secondary)] hover:border-[var(--accent)]/20'
                      }`}><m.icon className="w-3 h-3" /> {m.label}</button>
                  ))}
                </div>

                {createMode === 'topic' && (
                  <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="glass-panel p-5 rounded-2xl border border-[var(--border)] space-y-4">
                    <SectionHeader icon={Sparkles} label="Generate from Topic" />
                    <input type="text" value={topicInput} onChange={e => setTopicInput(e.target.value)} placeholder="e.g. Machine Learning, Photosynthesis..."
                      className="w-full px-4 py-3 rounded-xl bg-[var(--bg-secondary)] border border-[var(--border)] text-sm text-[var(--text-primary)] focus:outline-none focus:border-[var(--accent)] transition-all"
                      onKeyDown={e => e.key === 'Enter' && handleTopicGenerate()} />
                    <div className="grid grid-cols-2 gap-3">
                      <div className="space-y-1">
                        <label className="text-[10px] font-bold uppercase tracking-wider text-[var(--text-secondary)]">Cards</label>
                        <select value={topicCount} onChange={e => setTopicCount(Number(e.target.value))}
                          className="w-full px-3 py-2 rounded-xl bg-[var(--bg-secondary)] border border-[var(--border)] text-xs font-bold text-[var(--text-primary)] focus:outline-none appearance-none">
                          {[5,10,15,20,25].map(n => <option key={n} value={n}>{n} cards</option>)}
                        </select>
                      </div>
                      <div className="space-y-1">
                        <label className="text-[10px] font-bold uppercase tracking-wider text-[var(--text-secondary)]">Difficulty</label>
                        <div className="flex gap-1.5">
                          {DIFFICULTIES.map(d => (
                            <button key={d.id} onClick={() => setTopicDifficulty(d.id)}
                              className={`flex-1 py-2 rounded-lg text-[10px] font-bold border transition-all ${
                                topicDifficulty === d.id ? 'bg-[var(--accent)]/10 border-[var(--accent)]/30 text-[var(--accent)]' : 'bg-[var(--bg-secondary)] border-[var(--border)] text-[var(--text-secondary)]'
                              }`}>{d.label}</button>
                          ))}
                        </div>
                      </div>
                    </div>
                    <Button variant="primary" fullWidth icon={Zap} onClick={handleTopicGenerate} disabled={!topicInput.trim()}>Generate Flashcards</Button>
                  </motion.div>
                )}

                {createMode === 'file' && (
                  <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="glass-panel p-5 rounded-2xl border border-[var(--border)] space-y-4">
                    <SectionHeader icon={Upload} label="Extract from PDF / DOCX" />
                    <Dropzone onFilesSelected={setFileFile} accept=".pdf,.docx" maxSizeMB={10} label="Drop PDF or DOCX here" value={fileFile} onClear={() => setFileFile(null)} />
                    <Button variant="primary" fullWidth icon={Sparkles} onClick={handleFileGenerate} disabled={!fileFile}>Generate from File</Button>
                  </motion.div>
                )}

                {createMode === 'notes' && (
                  <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="glass-panel p-5 rounded-2xl border border-[var(--border)] space-y-4">
                    <SectionHeader icon={FileText} label="Generate from Notes" />
                    <textarea value={notesInput} onChange={e => setNotesInput(e.target.value)} rows={8}
                      placeholder="Paste your notes, textbook content, or lecture material here..."
                      className="w-full px-4 py-3 rounded-xl bg-[var(--bg-secondary)] border border-[var(--border)] text-sm text-[var(--text-primary)] focus:outline-none focus:border-[var(--accent)] transition-all resize-none" />
                    <Button variant="primary" fullWidth icon={Sparkles} onClick={handleNotesGenerate} disabled={notesInput.trim().length < 20}>Generate from Notes</Button>
                  </motion.div>
                )}

                {createMode === 'manual' && (
                  <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="glass-panel p-5 rounded-2xl border border-[var(--border)] space-y-4">
                    <SectionHeader icon={PenTool} label="Create Manually" />
                    <div className="space-y-3">
                      <input type="text" value={manualFront} onChange={e => setManualFront(e.target.value)} placeholder="Front (Question / Term)"
                        className="w-full px-4 py-2.5 rounded-xl bg-[var(--bg-secondary)] border border-[var(--border)] text-sm text-[var(--text-primary)] focus:outline-none focus:border-[var(--accent)] transition-all" />
                      <textarea value={manualBack} onChange={e => setManualBack(e.target.value)} rows={3} placeholder="Back (Answer / Definition)"
                        className="w-full px-4 py-2.5 rounded-xl bg-[var(--bg-secondary)] border border-[var(--border)] text-sm text-[var(--text-primary)] focus:outline-none focus:border-[var(--accent)] transition-all resize-none" />
                      <input type="text" value={manualHint} onChange={e => setManualHint(e.target.value)} placeholder="Hint (optional)"
                        className="w-full px-4 py-2.5 rounded-xl bg-[var(--bg-secondary)] border border-[var(--border)] text-sm text-[var(--text-primary)] focus:outline-none focus:border-[var(--accent)] transition-all" />
                      <div className="flex gap-2">
                        {DIFFICULTIES.map(d => (
                          <button key={d.id} onClick={() => setManualDifficulty(d.id)}
                            className={`flex-1 py-2 rounded-lg text-[10px] font-bold border transition-all ${
                              manualDifficulty === d.id ? 'bg-[var(--accent)]/10 border-[var(--accent)]/30 text-[var(--accent)]' : 'bg-[var(--bg-secondary)] border-[var(--border)] text-[var(--text-secondary)]'
                            }`}>{d.label}</button>
                        ))}
                      </div>
                    </div>
                    <Button variant="primary" fullWidth icon={Plus} onClick={handleManualAdd} disabled={!manualFront.trim() || !manualBack.trim()}>Add Flashcard</Button>
                  </motion.div>
                )}

                {cards.length > 0 && (
                  <div className="glass-panel p-5 rounded-2xl border border-[var(--border)] space-y-4">
                    <div className="flex items-center justify-between">
                      <h3 className="text-sm font-bold text-[var(--text-primary)]">All Cards ({cards.length})</h3>
                      <div className="flex gap-2">
                        <Button variant="secondary" size="sm" icon={Download} onClick={exportCards}>Export</Button>
                        <Button variant="danger" size="sm" icon={Trash2} onClick={clearAllCards}>Clear</Button>
                      </div>
                    </div>
                    <div className="max-h-[300px] overflow-y-auto space-y-2 pr-1">
                      {cards.map((card, i) => (
                        <div key={card.id} className="flex items-start gap-3 p-3 rounded-xl bg-[var(--bg-secondary)]/50 border border-[var(--border)]">
                          <span className="text-[10px] font-bold text-[var(--accent)] bg-[var(--accent)]/10 rounded-full w-5 h-5 flex items-center justify-center flex-shrink-0 mt-0.5">{i + 1}</span>
                          <div className="flex-1 min-w-0">
                            <p className="text-xs font-bold text-[var(--text-primary)] truncate">{card.front}</p>
                            <p className="text-[10px] text-[var(--text-secondary)] truncate mt-0.5">{card.back}</p>
                            <div className="flex items-center gap-2 mt-1">
                              <span className={`text-[9px] font-bold px-1.5 py-0.5 rounded ${card.difficulty === 'easy' ? 'bg-green-500/10 text-green-500' : card.difficulty === 'hard' ? 'bg-red-500/10 text-red-500' : 'bg-amber-500/10 text-amber-500'}`}>{card.difficulty}</span>
                              {card.repetitions > 0 && <span className="text-[9px] text-[var(--text-secondary)]">x{card.repetitions}</span>}
                            </div>
                          </div>
                          <button onClick={() => deleteCard(card.id)} className="p-1 rounded hover:bg-red-500/10 text-[var(--text-secondary)] hover:text-red-500 transition-all flex-shrink-0"><X className="w-3 h-3" /></button>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </motion.div>
            )}

            {/* ==================== STUDY TAB ==================== */}
            {activeTab === 'study' && (
              <motion.div key="study" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="max-w-2xl mx-auto space-y-5">
                {cards.length === 0 ? (
                  <EmptyState icon={Layers} title="No flashcards" description="Create some flashcards first to start studying." />
                ) : (
                  <>
                    <div className="flex flex-wrap items-center gap-2">
                      <select value={studyFilter} onChange={e => setStudyFilter(e.target.value)}
                        className="px-3 py-1.5 rounded-xl bg-[var(--bg-secondary)] border border-[var(--border)] text-[10px] font-bold text-[var(--text-primary)] appearance-none cursor-pointer focus:outline-none">
                        <option value="all">All ({filterCards(cards, 'all').length})</option>
                        <option value="bookmarked">Bookmarked ({filterCards(cards, 'bookmarked').length})</option>
                        <option value="easy">Easy ({filterCards(cards, 'easy').length})</option>
                        <option value="medium">Medium ({filterCards(cards, 'medium').length})</option>
                        <option value="hard">Hard ({filterCards(cards, 'hard').length})</option>
                        <option value="due">Due for Review ({filterCards(cards, 'due').length})</option>
                      </select>
                      <button onClick={toggleShuffle}
                        className={`p-2 rounded-xl border transition-all ${shuffled ? 'bg-[var(--accent)]/10 border-[var(--accent)]/30 text-[var(--accent)]' : 'bg-[var(--bg-secondary)] border border-[var(--border)] text-[var(--text-secondary)]'}`}>
                        <Shuffle className="w-3.5 h-3.5" />
                      </button>
                      <span className="text-[10px] font-bold text-[var(--text-secondary)] ml-auto">{studyIndex + 1} / {studyOrder.length}</span>
                    </div>

                    {studyCard && (
                      <div style={{ perspective: '1000px' }}>
                        <motion.div onClick={() => setIsFlipped(!isFlipped)} className="relative w-full cursor-pointer"
                          style={{ transformStyle: 'preserve-3d', minHeight: '280px' }}
                          animate={{ rotateY: isFlipped ? 180 : 0 }} transition={{ duration: 0.5, type: 'spring', stiffness: 200, damping: 25 }}>
                          <div className="glass-panel p-8 rounded-2xl border border-[var(--border)] absolute inset-0 flex flex-col items-center justify-center text-center"
                            style={{ backfaceVisibility: 'hidden' }}>
                            <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full mb-4 ${studyCard.difficulty === 'easy' ? 'bg-green-500/10 text-green-500' : studyCard.difficulty === 'hard' ? 'bg-red-500/10 text-red-500' : 'bg-amber-500/10 text-amber-500'}`}>{studyCard.difficulty}</span>
                            <p className="text-lg font-bold text-[var(--text-primary)] mb-2">{studyCard.front}</p>
                            <p className="text-[10px] text-[var(--text-secondary)] mt-4">Click to reveal answer</p>
                          </div>
                          <div className="glass-panel p-8 rounded-2xl border border-[var(--accent)]/20 absolute inset-0 flex flex-col items-center justify-center text-center"
                            style={{ backfaceVisibility: 'hidden', transform: 'rotateY(180deg)' }}>
                            <p className="text-sm font-bold text-[var(--accent)] mb-3">Answer</p>
                            <p className="text-sm text-[var(--text-primary)] leading-relaxed">{studyCard.back}</p>
                            {studyCard.hint && <p className="text-[10px] text-[var(--text-secondary)] mt-4 italic">Hint: {studyCard.hint}</p>}
                            <button onClick={(e) => { e.stopPropagation(); toggleBookmark(studyCard.id); }} className="mt-4 p-2 rounded-xl hover:bg-[var(--accent)]/10 transition-all">
                              {studyCard.bookmarked ? <BookmarkCheck className="w-5 h-5 text-amber-500" /> : <Bookmark className="w-5 h-5 text-[var(--text-secondary)]" />}
                            </button>
                          </div>
                        </motion.div>
                      </div>
                    )}

                    {studyCard && (
                      <div className="flex items-center justify-between">
                        <Button variant="secondary" size="sm" icon={ChevronLeft} onClick={() => { setStudyIndex(prev => Math.max(0, prev - 1)); setIsFlipped(false); }} disabled={studyIndex === 0}>Prev</Button>
                        <div className="flex items-center gap-2">
                          <button onClick={() => { updateSpacedRepetition(studyCard.id, 1); setStudyIndex(prev => Math.min(studyOrder.length - 1, prev + 1)); setIsFlipped(false); }}
                            className="px-3 py-2 rounded-xl bg-red-500/10 border border-red-500/20 text-[10px] font-bold text-red-500">Again</button>
                          <button onClick={() => { updateSpacedRepetition(studyCard.id, 3); setStudyIndex(prev => Math.min(studyOrder.length - 1, prev + 1)); setIsFlipped(false); }}
                            className="px-3 py-2 rounded-xl bg-amber-500/10 border border-amber-500/20 text-[10px] font-bold text-amber-500">Good</button>
                          <button onClick={() => { updateSpacedRepetition(studyCard.id, 5); setStudyIndex(prev => Math.min(studyOrder.length - 1, prev + 1)); setIsFlipped(false); }}
                            className="px-3 py-2 rounded-xl bg-green-500/10 border border-green-500/20 text-[10px] font-bold text-green-500">Easy</button>
                        </div>
                        <Button variant="secondary" size="sm" iconRight={ChevronRight} onClick={() => { setStudyIndex(prev => Math.min(studyOrder.length - 1, prev + 1)); setIsFlipped(false); }} disabled={studyIndex >= studyOrder.length - 1}>Next</Button>
                      </div>
                    )}
                  </>
                )}
              </motion.div>
            )}

            {/* ==================== QUIZ TAB ==================== */}
            {activeTab === 'quiz' && (
              <motion.div key="quiz" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="max-w-2xl mx-auto space-y-5">
                {cards.length === 0 ? (
                  <EmptyState icon={Target} title="No flashcards" description="Create flashcards first to start quizzing." />
                ) : quizOrder.length === 0 ? (
                  <EmptyState icon={AlertCircle} title="No cards match filter" description="Try selecting a different filter." />
                ) : quizIndex >= quizOrder.length ? (
                  <div className="glass-panel p-8 rounded-2xl border border-[var(--border)] text-center space-y-4">
                    <div className="p-4 rounded-2xl bg-green-500/10 w-fit mx-auto"><Check className="w-8 h-8 text-green-500" /></div>
                    <h3 className="text-lg font-bold text-[var(--text-primary)]">Quiz Complete!</h3>
                    <p className="text-sm text-[var(--text-secondary)]">Score: <span className="font-bold text-[var(--accent)]">{quizScore.correct}/{quizScore.total}</span>
                      {quizScore.total > 0 && ` (${Math.round(quizScore.correct / quizScore.total * 100)}%)`}</p>
                    <Button variant="primary" onClick={() => { setQuizIndex(0); setQuizScore({ correct: 0, total: 0 }); setQuizOrder(shuffled ? shuffleArray(filterCards(cards, quizFilter).map((_, i) => i)) : filterCards(cards, quizFilter).map((_, i) => i)); setQuizAnswer(''); setQuizResult(null); }}>Restart Quiz</Button>
                  </div>
                ) : (
                  <>
                    <div className="flex flex-wrap items-center gap-2">
                      <select value={quizFilter} onChange={e => setQuizFilter(e.target.value)}
                        className="px-3 py-1.5 rounded-xl bg-[var(--bg-secondary)] border border-[var(--border)] text-[10px] font-bold text-[var(--text-primary)] appearance-none cursor-pointer focus:outline-none">
                        <option value="all">All ({filterCards(cards, 'all').length})</option>
                        <option value="easy">Easy ({filterCards(cards, 'easy').length})</option>
                        <option value="medium">Medium ({filterCards(cards, 'medium').length})</option>
                        <option value="hard">Hard ({filterCards(cards, 'hard').length})</option>
                      </select>
                      <button onClick={toggleShuffle}
                        className={`p-2 rounded-xl border transition-all ${shuffled ? 'bg-[var(--accent)]/10 border-[var(--accent)]/30 text-[var(--accent)]' : 'bg-[var(--bg-secondary)] border border-[var(--border)] text-[var(--text-secondary)]'}`}>
                        <Shuffle className="w-3.5 h-3.5" />
                      </button>
                      <span className="text-[10px] font-bold text-[var(--text-secondary)] ml-auto">{quizIndex + 1} / {quizOrder.length} | Score: {quizScore.correct}/{quizScore.total}</span>
                    </div>

                    {quizCard && (
                      <div className="glass-panel p-8 rounded-2xl border border-[var(--border)] text-center space-y-5">
                        <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${quizCard.difficulty === 'easy' ? 'bg-green-500/10 text-green-500' : quizCard.difficulty === 'hard' ? 'bg-red-500/10 text-red-500' : 'bg-amber-500/10 text-amber-500'}`}>{quizCard.difficulty}</span>
                        <p className="text-lg font-bold text-[var(--text-primary)]">{quizCard.front}</p>
                        {showHint && quizCard.hint && <p className="text-xs text-[var(--accent)] italic">Hint: {quizCard.hint}</p>}
                        <div className="flex gap-2 max-w-md mx-auto">
                          <input type="text" value={quizAnswer} onChange={e => setQuizAnswer(e.target.value)}
                            onKeyDown={e => e.key === 'Enter' && !quizResult && checkQuizAnswer()} placeholder="Type your answer..." disabled={quizResult !== null}
                            className="flex-1 px-4 py-2.5 rounded-xl bg-[var(--bg-secondary)] border border-[var(--border)] text-sm text-[var(--text-primary)] focus:outline-none focus:border-[var(--accent)] transition-all disabled:opacity-60" />
                          {!quizResult && <Button variant="primary" size="sm" icon={Send} onClick={checkQuizAnswer} disabled={!quizAnswer.trim()} />}
                        </div>
                        {!quizResult && !showHint && quizCard.hint && (
                          <button onClick={() => setShowHint(true)} className="text-[10px] font-bold text-[var(--accent)] hover:underline flex items-center gap-1 mx-auto"><Eye className="w-3 h-3" /> Show Hint</button>
                        )}
                        {quizResult && (
                          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
                            className={`p-4 rounded-xl border text-left ${quizResult === 'correct' ? 'bg-green-500/5 border-green-500/15' : 'bg-red-500/5 border-red-500/15'}`}>
                            <p className={`text-xs font-bold mb-1 ${quizResult === 'correct' ? 'text-green-500' : 'text-red-500'}`}>{quizResult === 'correct' ? 'Correct!' : 'Incorrect'}</p>
                            <p className="text-xs text-[var(--text-primary)]"><span className="font-bold">Answer:</span> {quizCard.back}</p>
                          </motion.div>
                        )}
                        {quizResult && <Button variant="primary" iconRight={ArrowRight} onClick={nextQuiz}>Next</Button>}
                      </div>
                    )}
                  </>
                )}
              </motion.div>
            )}

            {/* ==================== STATS TAB ==================== */}
            {activeTab === 'stats' && (
              <motion.div key="stats" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="max-w-2xl mx-auto space-y-4">
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                  <StatCard icon={Layers} label="Total" value={cards.length} color="#6366f1" />
                  <StatCard icon={Eye} label="Studied" value={cards.filter(c => c.repetitions > 0).length} color="#10b981" />
                  <StatCard icon={BookmarkCheck} label="Bookmarked" value={cards.filter(c => c.bookmarked).length} color="#f59e0b" />
                  <StatCard icon={Clock} label="Due Review" value={cards.filter(c => new Date(c.nextReview) <= new Date()).length} color="#8b5cf6" />
                </div>
                <div className="glass-panel p-5 rounded-2xl border border-[var(--border)] space-y-3">
                  <SectionHeader icon={BarChart3} label="Difficulty Breakdown" />
                  {[['easy', '#10b981'], ['medium', '#f59e0b'], ['hard', '#ef4444']].map(([key, color]) => {
                    const val = cards.filter(c => c.difficulty === key).length;
                    const maxBar = Math.max(cards.filter(c => c.difficulty === 'easy').length, cards.filter(c => c.difficulty === 'medium').length, cards.filter(c => c.difficulty === 'hard').length, 1);
                    return (
                      <div key={key} className="flex items-center gap-3">
                        <span className="text-[10px] font-bold w-12 capitalize" style={{ color }}>{key}</span>
                        <div className="flex-1 h-2 rounded-full bg-[var(--bg-secondary)]">
                          <motion.div initial={{ width: 0 }} animate={{ width: `${(val / maxBar) * 100}%` }} className="h-full rounded-full" style={{ backgroundColor: color }} />
                        </div>
                        <span className="text-[10px] font-bold text-[var(--text-secondary)] w-8 text-right">{val}</span>
                      </div>
                    );
                  })}
                </div>
                <div className="glass-panel p-5 rounded-2xl border border-[var(--border)] space-y-3">
                  <SectionHeader icon={Brain} label="Spaced Repetition" />
                  <div className="grid grid-cols-2 gap-3">
                    <div className="p-3 rounded-xl bg-[var(--bg-secondary)]/50 text-center">
                      <p className="text-lg font-black text-[var(--accent)]">{cards.length > 0 ? (cards.reduce((s, c) => s + c.easeFactor, 0) / cards.length).toFixed(2) : 0}</p>
                      <p className="text-[10px] font-bold text-[var(--text-secondary)]">Avg Ease Factor</p>
                    </div>
                    <div className="p-3 rounded-xl bg-[var(--bg-secondary)]/50 text-center">
                      <p className="text-lg font-black text-purple-500">{cards.reduce((s, c) => s + c.repetitions, 0)}</p>
                      <p className="text-[10px] font-bold text-[var(--text-secondary)]">Total Reviews</p>
                    </div>
                  </div>
                </div>
              </motion.div>
            )}

            {/* ==================== HISTORY TAB ==================== */}
            {activeTab === 'history' && (
              <motion.div key="history" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="max-w-2xl mx-auto space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-xs font-bold uppercase tracking-wider text-[var(--text-secondary)]">Review History</h3>
                  {history.length > 0 && <Button variant="danger" size="sm" icon={Trash2} onClick={() => setHistory([])}>Clear</Button>}
                </div>
                {history.length === 0 ? (
                  <EmptyState icon={History} title="No history yet" description="Complete a study or quiz session to see history." />
                ) : history.map((entry, i) => (
                  <div key={i} className="glass-panel p-4 rounded-2xl border border-[var(--border)]">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <div className="p-1.5 rounded-lg bg-[var(--accent)]/10">
                          {entry.mode === 'study' ? <Eye className="w-3.5 h-3.5 text-[var(--accent)]" /> : <Target className="w-3.5 h-3.5 text-purple-500" />}
                        </div>
                        <span className="text-xs font-bold text-[var(--text-primary)] capitalize">{entry.mode} Session</span>
                      </div>
                      <span className="text-[10px] text-[var(--text-secondary)]">{new Date(entry.date).toLocaleString()}</span>
                    </div>
                    <div className="flex gap-4 mt-2 text-[10px] text-[var(--text-secondary)]">
                      <span>Cards: <span className="font-bold text-[var(--text-primary)]">{entry.cardsStudied}</span></span>
                      {entry.score !== undefined && <span>Score: <span className="font-bold text-[var(--accent)]">{entry.score}%</span></span>}
                      <span>Duration: <span className="font-bold text-[var(--text-primary)]">{entry.duration || 'N/A'}</span></span>
                    </div>
                  </div>
                ))}
              </motion.div>
            )}
          </AnimatePresence>
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
              <h3 className="text-lg font-semibold text-[var(--text-primary)] mb-2">Creating Flashcards</h3>
              <p className="text-sm text-[var(--text-secondary)]">{loadingMsg}</p>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </ErrorBoundary>
  );
};

export default FlashcardTool;
