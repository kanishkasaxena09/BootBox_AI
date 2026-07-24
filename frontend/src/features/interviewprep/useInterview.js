import { useState, useCallback, useRef, useEffect } from 'react';
import { generateQuestions } from './mockData';

const STORAGE_KEY = 'solmates_interview_history';
const BOOKMARK_KEY = 'solmates_interview_bookmarks';
const STREAK_KEY = 'solmates_interview_streak';
const SESSION_KEY = 'solmates_interview_session';
const PROGRESS_KEY = 'solmates_interview_progress';

const load = (key, fallback) => {
  try { const r = localStorage.getItem(key); return r ? JSON.parse(r) : fallback; }
  catch { return fallback; }
};

const save = (key, val) => {
  try { localStorage.setItem(key, JSON.stringify(val)); } catch {}
};

const calcStreak = (history) => {
  if (!history.length) return 0;
  const days = [...new Set(history.map(h => new Date(h.date).toDateString()))];
  days.sort((a, b) => new Date(b) - new Date(a));
  let streak = 0;
  const today = new Date();
  for (let i = 0; i < days.length; i++) {
    const expected = new Date(today);
    expected.setDate(expected.getDate() - i);
    if (new Date(days[i]).toDateString() === expected.toDateString()) streak++;
    else break;
  }
  return streak;
};

const initialSetup = {
  role: '',
  experience: '',
  interviewType: 'technical',
  difficulty: 'medium',
  targetCompany: '',
  count: 10,
  resumeFile: null,
  resumeData: null,
};

export default function useInterview() {
  const [screen, setScreen] = useState('setup');
  const [setup, setSetup] = useState(initialSetup);
  const [questions, setQuestions] = useState([]);
  const [currentIdx, setCurrentIdx] = useState(0);
  const [isGenerating, setIsGenerating] = useState(false);
  const [generateStep, setGenerateStep] = useState(0);
  const [history, setHistory] = useState(() => load(STORAGE_KEY, []));
  const [bookmarks, setBookmarks] = useState(() => load(BOOKMARK_KEY, []));
  const [sessionProgress, setSessionProgress] = useState(() => load(PROGRESS_KEY, {}));

  const [showHowToAnswer, setShowHowToAnswer] = useState(false);
  const [showKeyPoints, setShowKeyPoints] = useState(false);
  const [showMistakes, setShowMistakes] = useState(false);
  const [showSample, setShowSample] = useState(false);
  const [showFollowUps, setShowFollowUps] = useState(false);

  const [userAnswer, setUserAnswer] = useState('');
  const [timerRunning, setTimerRunning] = useState(false);
  const [elapsed, setElapsed] = useState(0);
  const [showEvaluation, setShowEvaluation] = useState(false);
  const [evaluationScores, setEvaluationScores] = useState(null);

  const [activeTab, setActiveTab] = useState('session');
  const [sessionStartTime, setSessionStartTime] = useState(null);
  const [sessionAnswers, setSessionAnswers] = useState([]);
  const [sessionData, setSessionData] = useState(null);
  const [showAnalysis, setShowAnalysis] = useState(false);

  const timerRef = useRef(null);

  const question = questions[currentIdx] || null;
  const streak = calcStreak(history);

  const overallProgress = {
    total: sessionProgress.totalAnswered || 0,
    sessions: sessionProgress.totalSessions || 0,
    avgScore: sessionProgress.avgScore || 0,
    weakTopics: sessionProgress.weakTopics || [],
    strongTopics: sessionProgress.strongTopics || [],
  };

  const updateSetup = useCallback((field, value) => {
    setSetup(prev => ({ ...prev, [field]: value }));
  }, []);

  const startGeneration = useCallback(async () => {
    setIsGenerating(true);
    setGenerateStep(0);

    const steps = 6;
    for (let i = 0; i < steps; i++) {
      setGenerateStep(i);
      await new Promise(r => setTimeout(r, 700 + Math.random() * 500));
    }

    const generated = await generateQuestions({
      interviewType: setup.interviewType,
      difficulty: setup.difficulty,
      count: setup.count,
    });

    setQuestions(generated);
    setCurrentIdx(0);
    setIsGenerating(false);
    setSessionStartTime(Date.now());
    setSessionAnswers([]);
    setScreen('session');
  }, [setup]);

  const endSession = useCallback(() => {
    stopTimer();
    const totalTime = sessionStartTime ? Math.round((Date.now() - sessionStartTime) / 1000) : 0;

    const completedQuestions = sessionAnswers.filter(a => a.completed);
    const allScores = completedQuestions.filter(a => a.scores).map(a => a.scores);
    const avgScore = allScores.length > 0
      ? Math.round(allScores.reduce((s, sc) => s + sc.overall, 0) / allScores.length)
      : 0;

    const categoryMap = {};
    questions.forEach(q => {
      if (!categoryMap[q.category]) categoryMap[q.category] = { total: 0, completed: 0, scores: [] };
      categoryMap[q.category].total++;
      const ans = sessionAnswers.find(a => a.questionId === q.id);
      if (ans?.completed) {
        categoryMap[q.category].completed++;
        if (ans.scores) categoryMap[q.category].scores.push(ans.scores.overall);
      }
    });

    const categoryBreakdown = {};
    const strongAreas = [];
    const weakAreas = [];
    Object.entries(categoryMap).forEach(([cat, data]) => {
      const catAvg = data.scores.length > 0 ? Math.round(data.scores.reduce((a, b) => a + b, 0) / data.scores.length) : 0;
      categoryBreakdown[cat] = { total: data.total, completed: data.completed, avgScore: catAvg };
      if (data.completed > 0 && catAvg >= 75) strongAreas.push(cat);
      if (data.completed > 0 && catAvg < 60) weakAreas.push(cat);
    });

    const data = {
      setup: { ...setup },
      startTime: sessionStartTime,
      endTime: Date.now(),
      totalTime,
      questions: questions.map(q => {
        const ans = sessionAnswers.find(a => a.questionId === q.id);
        return {
          id: q.id, category: q.category, title: q.title, difficulty: q.difficulty || 'Medium',
          completed: ans?.completed || false,
          timeSpent: ans?.timeSpent || 0,
          scores: ans?.scores || null,
          userAnswer: ans?.userAnswer || '',
          isBookmarked: bookmarks.includes(q.id),
        };
      }),
      summary: {
        totalQuestions: questions.length,
        completedQuestions: completedQuestions.length,
        skippedQuestions: questions.length - completedQuestions.length,
        avgScore,
        totalTime,
        categoryBreakdown,
        strongAreas,
        weakAreas,
      },
    };

    setSessionData(data);
    setShowAnalysis(true);
    setSessionStartTime(null);
    setSessionAnswers([]);
  }, [questions, sessionAnswers, sessionStartTime, setup, bookmarks]);

  const dismissAnalysis = useCallback(() => {
    setSessionData(null);
    setShowAnalysis(false);
    setScreen('setup');
    setQuestions([]);
    setCurrentIdx(0);
    setUserAnswer('');
    setShowEvaluation(false);
    setEvaluationScores(null);
    resetAllPanels();
  }, []);

  const resetAllPanels = useCallback(() => {
    setShowHowToAnswer(false);
    setShowKeyPoints(false);
    setShowMistakes(false);
    setShowSample(false);
    setShowFollowUps(false);
  }, []);

  const goTo = useCallback((idx) => {
    if (idx < 0 || idx >= questions.length) return;
    setCurrentIdx(idx);
    resetAllPanels();
    setElapsed(0);
    setTimerRunning(false);
    setUserAnswer('');
    setShowEvaluation(false);
    setEvaluationScores(null);
    if (timerRef.current) clearInterval(timerRef.current);
  }, [questions.length, resetAllPanels]);

  const next = useCallback(() => goTo(currentIdx + 1), [currentIdx, goTo]);
  const prev = useCallback(() => goTo(currentIdx - 1), [currentIdx, goTo]);

  const toggleBookmark = useCallback(() => {
    if (!question) return;
    setBookmarks(prev => {
      const exists = prev.includes(question.id);
      const next = exists ? prev.filter(id => id !== question.id) : [...prev, question.id];
      save(BOOKMARK_KEY, next);
      return next;
    });
  }, [question]);

  const markCompleted = useCallback(() => {
    if (!question) return;
    setQuestions(prev => prev.map((q, i) => i === currentIdx ? { ...q, isCompleted: true } : q));

    const answerEntry = {
      questionId: question.id,
      completed: true,
      timeSpent: elapsed,
      scores: evaluationScores,
      userAnswer,
      date: new Date().toISOString(),
    };
    setSessionAnswers(prev => {
      const filtered = prev.filter(a => a.questionId !== question.id);
      return [...filtered, answerEntry];
    });

    const entry = {
      id: Date.now(),
      questionId: question.id,
      category: question.category,
      title: question.title,
      difficulty: question.difficulty || 'Medium',
      elapsed,
      date: new Date().toISOString(),
      scores: evaluationScores,
    };
    const next = [entry, ...history].slice(0, 200);
    setHistory(next);
    save(STORAGE_KEY, next);

    setSessionProgress(prev => {
      const updated = {
        totalAnswered: (prev.totalAnswered || 0) + 1,
        totalSessions: (prev.totalSessions || 0),
        avgScore: evaluationScores
          ? ((prev.avgScore || 0) * (prev.totalAnswered || 0) + evaluationScores.overall) / ((prev.totalAnswered || 0) + 1)
          : prev.avgScore || 0,
        weakTopics: evaluationScores
          ? [...new Set([...(prev.weakTopics || []), ...(evaluationScores.suggestions || []).slice(0, 2).map(() => question.category)])]
          : prev.weakTopics || [],
        strongTopics: evaluationScores && evaluationScores.overall >= 8
          ? [...new Set([...(prev.strongTopics || []), question.category])]
          : prev.strongTopics || [],
      };
      save(PROGRESS_KEY, updated);
      return updated;
    });
  }, [question, currentIdx, elapsed, evaluationScores, history, userAnswer]);

  const isBookmarked = question ? bookmarks.includes(question.id) : false;

  // Timer
  const startTimer = useCallback(() => {
    setTimerRunning(true);
    timerRef.current = setInterval(() => setElapsed(e => e + 1), 1000);
  }, []);

  const stopTimer = useCallback(() => {
    setTimerRunning(false);
    if (timerRef.current) clearInterval(timerRef.current);
  }, []);

  const resetTimer = useCallback(() => {
    stopTimer();
    setElapsed(0);
  }, [stopTimer]);

  useEffect(() => {
    return () => { if (timerRef.current) clearInterval(timerRef.current); };
  }, []);

  // AI Evaluation (real Groq API with heuristic fallback)
  const generateEvaluation = useCallback(async () => {
    const wordCount = userAnswer.trim().split(/\s+/).filter(Boolean).length;

    const heuristicEval = () => {
      const hasStructure = /\n|•|-|\d\./.test(userAnswer);
      const hasExamples = /example|instance|specifically|such as|for instance/i.test(userAnswer);
      const sentenceCount = userAnswer.split(/[.!?]+/).filter(s => s.trim()).length;
      const avgWordsPerSentence = wordCount / Math.max(sentenceCount, 1);
      const baseScore = Math.min(wordCount / 2, 50);
      const structBonus = hasStructure ? 10 : 0;
      const exampleBonus = hasExamples ? 10 : 0;
      const detailBonus = wordCount > 50 ? 10 : wordCount > 20 ? 5 : 0;
      const concisenessBonus = avgWordsPerSentence >= 8 && avgWordsPerSentence <= 25 ? 10 : 0;
      const scores = {
        confidence: Math.min(95, Math.floor(50 + baseScore + structBonus + (Math.random() * 10))),
        communication: Math.min(95, Math.floor(45 + baseScore + concisenessBonus + (Math.random() * 10))),
        technicalAccuracy: Math.min(95, Math.floor(40 + baseScore + exampleBonus + detailBonus + (Math.random() * 10))),
        grammar: Math.min(95, Math.floor(60 + baseScore * 0.5 + (Math.random() * 15))),
        clarity: Math.min(95, Math.floor(50 + baseScore + structBonus + (Math.random() * 10))),
        wordCount,
        overall: 0,
        suggestions: [
          !hasStructure && 'Use bullet points or numbered lists to structure your answer.',
          !hasExamples && 'Include specific examples to strengthen your response.',
          wordCount < 30 && 'Try to provide a more detailed answer with specific details.',
          wordCount > 200 && 'Consider being more concise — interviewers prefer focused answers.',
          avgWordsPerSentence > 30 && 'Break long sentences into shorter ones for better clarity.',
        ].filter(Boolean),
      };
      if (scores.suggestions.length === 0) {
        scores.suggestions.push('Great answer! Keep practicing to maintain this level of quality.');
      }
      scores.overall = Math.round(
        (scores.confidence + scores.communication + scores.technicalAccuracy + scores.grammar + scores.clarity) / 5
      );
      return scores;
    };

    try {
      const res = await fetch('/api/interview/evaluate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ question: question, answer: userAnswer }),
      });
      if (res.ok) {
        const data = await res.json();
        if (!data.fallback && data.overall) {
          data.wordCount = wordCount;
          setEvaluationScores(data);
          setShowEvaluation(true);
          return;
        }
      }
    } catch (e) {
      console.warn('AI evaluation failed, using heuristic:', e.message);
    }

    const scores = heuristicEval();
    setEvaluationScores(scores);
    setShowEvaluation(true);
  }, [userAnswer, question]);

  const regenerateQuestion = useCallback(async () => {
    if (!question) return;
    const newQs = await generateQuestions({
      interviewType: setup.interviewType,
      difficulty: setup.difficulty,
      count: 1,
    });
    const newQ = newQs[0];
    if (newQ) {
      setQuestions(prev => prev.map((q, i) => i === currentIdx ? { ...newQ, isCompleted: false, isBookmarked: q.isBookmarked, userRating: 0 } : q));
      resetAllPanels();
      setUserAnswer('');
      setShowEvaluation(false);
      setEvaluationScores(null);
    }
  }, [question, currentIdx, setup, resetAllPanels]);

  const formatTime = useCallback((secs) => {
    const m = Math.floor(secs / 60);
    const s = secs % 60;
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  }, []);

  return {
    screen, setScreen,
    setup, updateSetup,
    questions, question, currentIdx,
    isGenerating, generateStep,
    showHowToAnswer, setShowHowToAnswer,
    showKeyPoints, setShowKeyPoints,
    showMistakes, setShowMistakes,
    showSample, setShowSample,
    showFollowUps, setShowFollowUps,
    userAnswer, setUserAnswer,
    timerRunning, elapsed,
    showEvaluation, evaluationScores,
    activeTab, setActiveTab,
    history, bookmarks, streak, overallProgress,
    isBookmarked, sessionData, showAnalysis, setShowAnalysis, dismissAnalysis,
    startGeneration, endSession,
    goTo, next, prev,
    toggleBookmark, markCompleted,
    startTimer, stopTimer, resetTimer,
    generateEvaluation, regenerateQuestion,
    formatTime,
  };
}
