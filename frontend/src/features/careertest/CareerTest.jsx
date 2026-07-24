import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { ChevronLeft, ChevronRight, Save, Clock, Brain, RotateCcw } from 'lucide-react';
import { useCareerTest } from './useCareerTest';
import ProgressBar from './ProgressBar';
import QuestionCard from './QuestionCard';
import TestResults from './TestResults';

const CareerTest = () => {
  const {
    question, currentQ, total, progress, selected, direction, showResults,
    answeredCount, savedHistory,
    next, prev, answer, resumeLater, resetTest, finishTest, getResults,
    categories,
  } = useCareerTest();

  const [results, setResults] = useState(null);
  const [showHistory, setShowHistory] = useState(false);

  const canNext = selected !== null && currentQ < total - 1;
  const isLast = currentQ === total - 1;

  const handleFinish = () => {
    const r = finishTest();
    setResults(r);
  };

  const handleRestart = () => {
    setResults(null);
    resetTest();
  };

  if (showResults && results) {
    return <TestResults results={results} onRestart={handleRestart} />;
  }

  return (
    <div className="space-y-6 text-left">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="space-y-1">
          <h2 className="text-2xl font-black bg-gradient-to-r from-pink-500 to-rose-500 bg-clip-text text-transparent">
            Career Test
          </h2>
          <p className="text-sm text-[var(--text-secondary)]">
            Discover your ideal career path with our psychometric assessment.
          </p>
        </div>
        <div className="flex items-center space-x-2">
          {savedHistory.length > 0 && (
            <button onClick={() => setShowHistory(!showHistory)}
              className="flex items-center space-x-1.5 px-3 py-1.5 rounded-xl bg-[var(--bg-tertiary)] text-[var(--text-secondary)] text-xs font-bold transition-all hover:text-[var(--text-primary)] border border-[var(--border-color)]">
              <Clock className="h-3 w-3" />
              <span>History ({savedHistory.length})</span>
            </button>
          )}
        </div>
      </div>

      {/* History panel */}
      {showHistory && savedHistory.length > 0 && (
        <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }}
          className="glass-panel border border-[var(--border-color)] rounded-2xl p-4 space-y-3 overflow-hidden">
          <h3 className="text-xs font-bold text-[var(--text-secondary)] uppercase tracking-wider">Past Attempts</h3>
          <div className="space-y-2 max-h-48 overflow-y-auto">
            {savedHistory.map((h, i) => (
              <div key={h.id} className="flex items-center justify-between p-2.5 rounded-xl bg-[var(--bg-tertiary)]">
                <div className="flex items-center space-x-2">
                  <div className="w-7 h-7 rounded-lg bg-pink-500/15 flex items-center justify-center text-pink-500 text-[10px] font-bold">
                    <Brain className="h-3.5 w-3.5" />
                  </div>
                  <div>
                    <p className="text-[11px] font-bold text-[var(--text-primary)]">
                      Score: {h.score}% — {h.topCareer}
                    </p>
                    <p className="text-[10px] text-[var(--text-secondary)]">
                      {new Date(h.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </motion.div>
      )}

      {/* Progress */}
      <ProgressBar
        progress={progress} currentQ={currentQ} total={total}
        categories={categories} questionCategory={question?.category}
      />

      {/* Question */}
      <QuestionCard question={question} selected={selected} onSelect={answer} direction={direction} />

      {/* Navigation */}
      <div className="flex items-center justify-between pt-2">
        <div className="flex items-center space-x-2">
          <button onClick={prev} disabled={currentQ === 0}
            className="flex items-center space-x-1 px-4 py-2.5 rounded-xl bg-[var(--bg-tertiary)] text-[var(--text-secondary)] text-xs font-bold transition-all hover:text-[var(--text-primary)] disabled:opacity-30 disabled:cursor-not-allowed border border-[var(--border-color)]">
            <ChevronLeft className="h-3.5 w-3.5" />
            <span>Previous</span>
          </button>
        </div>

        <div className="flex items-center space-x-2">
          <button onClick={resumeLater}
            className="flex items-center space-x-1.5 px-3 py-2.5 rounded-xl bg-[var(--bg-tertiary)] text-[var(--text-secondary)] text-xs font-bold transition-all hover:text-[var(--text-primary)] border border-[var(--border-color)]">
            <Save className="h-3.5 w-3.5" />
            <span>Resume Later</span>
          </button>

          {isLast ? (
            <button onClick={handleFinish} disabled={selected === null}
              className="flex items-center space-x-1.5 px-5 py-2.5 rounded-xl bg-gradient-to-r from-pink-600 to-rose-600 hover:from-pink-700 hover:to-rose-700 text-white text-xs font-bold transition-all shadow-md shadow-pink-600/10 disabled:opacity-30 disabled:cursor-not-allowed">
              <Brain className="h-3.5 w-3.5" />
              <span>Finish Test</span>
            </button>
          ) : (
            <button onClick={next} disabled={!canNext}
              className="flex items-center space-x-1 px-4 py-2.5 rounded-xl bg-pink-600 hover:bg-pink-700 text-white text-xs font-bold transition-all shadow-md shadow-pink-600/10 disabled:opacity-30 disabled:cursor-not-allowed">
              <span>Next</span>
              <ChevronRight className="h-3.5 w-3.5" />
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default CareerTest;
