import { useState, useCallback, useMemo } from 'react';
import { questions, categories, careerProfiles } from './mockQuestions';

const STORAGE_KEY = 'solmates_careertest_progress';
const HISTORY_KEY = 'solmates_careertest_history';

const loadProgress = () => {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch { return null; }
};

const saveProgress = (data) => {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  } catch {}
};

const clearProgress = () => {
  try { localStorage.removeItem(STORAGE_KEY); } catch {}
};

const loadHistory = () => {
  try {
    const raw = localStorage.getItem(HISTORY_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch { return []; }
};

const saveHistory = (history) => {
  try {
    localStorage.setItem(HISTORY_KEY, JSON.stringify(history));
  } catch {}
};

const scoreAnswer = (question, answer) => {
  if (!answer) return {};
  const scores = {};
  if (question.type === 'likert') {
    const val = parseInt(answer, 10);
    scores.personality = val;
    scores.technical = val;
    scores.soft = val;
    scores.leadership = val;
    scores.communication = val;
    scores.interests = val;
    scores.preference = val;
    return scores;
  }
  if (question.type === 'multiselect') {
    scores.selected = answer;
    return scores;
  }
  if (question.type === 'choice') {
    scores.choice = answer;
    return scores;
  }
  return {};
};

const calculateResults = (answers) => {
  const catScores = {};
  categories.forEach(c => { catScores[c.id] = { total: 0, count: 0 }; });

  questions.forEach(q => {
    const ans = answers[q.id];
    if (!ans) return;
    const cat = q.category;
    if (q.type === 'likert') {
      const val = parseInt(ans, 10);
      catScores[cat].total += val;
      catScores[cat].count += 1;
    } else {
      catScores[cat].total += 3;
      catScores[cat].count += 1;
    }
  });

  const normalizedScores = {};
  categories.forEach(c => {
    const { total, count } = catScores[c.id];
    normalizedScores[c.id] = count > 0 ? Math.round((total / (count * 5)) * 100) : 0;
  });

  const overall = Math.round(
    categories.reduce((sum, c) => sum + normalizedScores[c.id], 0) / categories.length
  );

  const answeredQuestions = questions.filter(q => answers[q.id]);
  const answeredCategories = new Set(answeredQuestions.map(q => q.category));

  const careerMatches = careerProfiles.map(career => {
    let score = 0;
    let matched = 0;

    answeredQuestions.forEach(q => {
      const ans = answers[q.id];
      if (!ans) return;

      if (q.type === 'multiselect' && Array.isArray(ans)) {
        ans.forEach(a => {
          if (career.keywords.some(k => a.includes(k) || k.includes(a))) {
            score += 2;
            matched++;
          }
        });
      } else if (q.type === 'choice') {
        if (career.keywords.some(k => ans.includes(k) || k.includes(ans))) {
          score += 2;
          matched++;
        }
      } else if (q.type === 'likert') {
        const val = parseInt(ans, 10);
        if (val >= 4) {
          const catLabel = categories.find(c => c.id === q.category)?.label || '';
          if (career.keywords.some(k => catLabel.includes(k.split(' ')[0]))) {
            score += 1;
            matched++;
          }
        }
      }
    });

    const baseScore = career.keywords.length > 0 ? (score / (career.keywords.length * 1.5)) : 0;
    const completion = answeredQuestions.length / questions.length;
    const finalScore = Math.min(100, Math.round(baseScore * 100 * 0.7 + overall * 0.3));

    return { ...career, score: Math.max(15, finalScore), matched };
  });

  careerMatches.sort((a, b) => b.score - a.score);
  const top5 = careerMatches.slice(0, 5);

  const strengths = [];
  const weaknesses = [];
  categories.forEach(c => {
    const s = normalizedScores[c.id];
    if (s >= 70) strengths.push({ label: c.label, score: s });
    else if (s <= 40 && answeredCategories.has(c.id)) weaknesses.push({ label: c.label, score: s });
  });

  const skillsToImprove = [
    { skill: 'Problem Solving', reason: 'Critical across most roles', priority: normalizedScores.personality < 60 ? 'High' : 'Medium' },
    { skill: 'Communication', reason: 'Essential for team collaboration', priority: normalizedScores.communication < 60 ? 'High' : 'Low' },
    { skill: 'Leadership', reason: 'Key for career advancement', priority: normalizedScores.leadership < 50 ? 'High' : 'Medium' },
    { skill: 'Technical Proficiency', reason: 'Required for tech roles', priority: normalizedScores.technical < 50 ? 'High' : 'Low' },
    { skill: 'Adaptability', reason: 'Valued in dynamic environments', priority: normalizedScores.personality < 70 ? 'Medium' : 'Low' },
  ];

  const roadmap = top5.slice(0, 3).map(career => ({
    career: career.title,
    steps: [
      { phase: 'Months 1-2', action: `Learn core fundamentals of ${career.title.toLowerCase()}` },
      { phase: 'Months 3-4', action: 'Build 2-3 portfolio projects' },
      { phase: 'Months 5-6', action: 'Apply for internships or entry-level roles' },
      { phase: 'Months 7-9', action: 'Get certified or complete a specialization' },
      { phase: 'Months 10-12', action: 'Network and apply for full-time positions' },
    ],
  }));

  return {
    overallScore: overall,
    topCareers: top5,
    strengths,
    weaknesses,
    skillsToImprove,
    roadmap,
    normalizedScores,
  };
};

export const useCareerTest = () => {
  const [currentQ, setCurrentQ] = useState(0);
  const [answers, setAnswers] = useState(() => loadProgress()?.answers || {});
  const [direction, setDirection] = useState(1);
  const [showResults, setShowResults] = useState(false);
  const [savedHistory, setSavedHistory] = useState(() => loadHistory());
  const [selected, setSelected] = useState(() => {
    const saved = loadProgress();
    if (saved?.answers && saved?.currentQ !== undefined) {
      return saved.answers[questions[saved.currentQ]?.id] || null;
    }
    return null;
  });

  const question = questions[currentQ];
  const total = questions.length;
  const progress = Math.round(((currentQ + 1) / total) * 100);
  const answeredCount = Object.keys(answers).length;

  const goTo = useCallback((idx) => {
    if (idx < 0 || idx >= total) return;
    setDirection(idx > currentQ ? 1 : -1);
    setCurrentQ(idx);
    setSelected(answers[questions[idx]?.id] || null);
  }, [currentQ, total, answers]);

  const next = useCallback(() => {
    if (currentQ >= total - 1) return;
    goTo(currentQ + 1);
  }, [currentQ, total, goTo]);

  const prev = useCallback(() => {
    if (currentQ <= 0) return;
    goTo(currentQ - 1);
  }, [currentQ, goTo]);

  const answer = useCallback((val) => {
    setSelected(val);
    setAnswers(prev => {
      const next = { ...prev, [question.id]: val };
      saveProgress({ answers: next, currentQ });
      return next;
    });
  }, [question, currentQ]);

  const resumeLater = useCallback(() => {
    saveProgress({ answers, currentQ });
  }, [answers, currentQ]);

  const resetTest = useCallback(() => {
    clearProgress();
    setAnswers({});
    setCurrentQ(0);
    setSelected(null);
    setDirection(1);
    setShowResults(false);
  }, []);

  const finishTest = useCallback(() => {
    const results = calculateResults(answers);
    const entry = {
      id: Date.now(),
      date: new Date().toISOString(),
      score: results.overallScore,
      topCareer: results.topCareers[0]?.title,
      answers,
    };
    const history = [entry, ...savedHistory].slice(0, 10);
    setSavedHistory(history);
    saveHistory(history);
    clearProgress();
    setShowResults(true);
    return results;
  }, [answers, savedHistory]);

  const results = useMemo(() => {
    if (!showResults) return null;
    return calculateResults(answers);
  }, [showResults, answers]);

  const getResults = useCallback(() => calculateResults(answers), [answers]);

  return {
    question, currentQ, total, progress, selected, direction, showResults,
    answeredCount, answers, savedHistory,
    goTo, next, prev, answer, resumeLater, resetTest, finishTest,
    results, getResults, categories, questions,
  };
};
