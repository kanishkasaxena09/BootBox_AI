import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Pencil, Sparkles, Brain, Lightbulb, BarChart3, Target, MessageCircle } from 'lucide-react';

function ScoreRing({ score, label, color }) {
  const circumference = 2 * Math.PI * 18;
  const offset = circumference - (circumference * score) / 100;

  return (
    <div className="flex flex-col items-center gap-1.5">
      <div className="relative w-12 h-12">
        <svg className="w-full h-full -rotate-90" viewBox="0 0 40 40">
          <circle cx="20" cy="20" r="18" fill="none" stroke="var(--bg-secondary)" strokeWidth="3" />
          <motion.circle cx="20" cy="20" r="18" fill="none" stroke={color} strokeWidth="3"
            strokeDasharray={circumference} strokeDashoffset={offset}
            strokeLinecap="round" initial={{ strokeDashoffset: circumference }}
            animate={{ strokeDashoffset: offset }} transition={{ duration: 1, delay: 0.2 }} />
        </svg>
        <div className="absolute inset-0 flex items-center justify-center">
          <span className="text-[10px] font-black" style={{ color }}>{score}</span>
        </div>
      </div>
      <span className="text-[9px] font-bold text-[var(--text-secondary)] text-center leading-tight">{label}</span>
    </div>
  );
}

export default function AiEvaluation({
  userAnswer, setUserAnswer, showEvaluation, evaluationScores,
  onGenerateEvaluation,
}) {
  const wordCount = userAnswer.trim().split(/\s+/).filter(Boolean).length;

  return (
    <div className="glass-panel rounded-2xl p-5 border border-[var(--border)] space-y-4">
      <h4 className="text-sm font-bold text-[var(--text-primary)] flex items-center gap-2">
        <Brain className="w-4 h-4 text-pink-500" /> AI Interview Practice
      </h4>

      {/* Answer Text Area */}
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <label className="text-[10px] font-bold uppercase tracking-wider text-[var(--text-secondary)] flex items-center gap-1.5">
            <Pencil className="w-3 h-3" /> Your Answer
          </label>
          <span className={`text-[10px] font-bold ${wordCount > 200 ? 'text-amber-500' : wordCount > 0 ? 'text-emerald-500' : 'text-[var(--text-secondary)]'}`}>
            {wordCount} words
          </span>
        </div>
        <textarea
          value={userAnswer}
          onChange={e => setUserAnswer(e.target.value)}
          placeholder="Type your answer here... Structure it clearly, include specific examples, and be concise."
          rows={6}
          className="w-full px-3 py-3 rounded-xl text-xs font-medium resize-none outline-none
            bg-[var(--bg-secondary)] border border-[var(--border)] text-[var(--text-primary)]
            hover:border-[var(--accent)] focus:border-[var(--accent)] focus:ring-2 focus:ring-[var(--accent)]/20 transition-all
            placeholder:text-[var(--text-secondary)] placeholder:opacity-60"
        />
        <div className="flex items-center gap-3 text-[10px] text-[var(--text-secondary)]">
          <span className="flex items-center gap-1">
            <Target className="w-3 h-3" /> Aim for 50-200 words
          </span>
          <span>·</span>
          <span className="flex items-center gap-1">
            <MessageCircle className="w-3 h-3" /> Use examples
          </span>
        </div>
      </div>

      {/* Generate Evaluation Button */}
      {!showEvaluation && (
        <motion.button
          whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}
          onClick={onGenerateEvaluation}
          disabled={!userAnswer.trim()}
          className={`w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold transition-all
            ${userAnswer.trim()
              ? 'bg-gradient-to-r from-pink-500 to-rose-500 text-white shadow-lg shadow-pink-500/25 cursor-pointer'
              : 'bg-[var(--bg-secondary)] text-[var(--text-secondary)] border border-[var(--border)] cursor-not-allowed opacity-50'}`}
        >
          <Sparkles className="w-3.5 h-3.5" /> Get AI Feedback
        </motion.button>
      )}

      {/* Evaluation Results */}
      <AnimatePresence>
        {showEvaluation && evaluationScores && (
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }} className="space-y-4">
            {/* Score Rings */}
            <div className="p-4 rounded-xl bg-[var(--bg-secondary)] border border-[var(--border)]">
              <div className="flex items-center justify-between mb-3">
                <p className="text-[10px] font-bold text-[var(--text-secondary)] uppercase tracking-wider">Score Breakdown</p>
                <div className="flex items-center gap-1.5 px-2 py-1 rounded-lg bg-pink-500/10 border border-pink-500/20">
                  <BarChart3 className="w-3 h-3 text-pink-500" />
                  <span className="text-[10px] font-black text-pink-500">Overall: {evaluationScores.overall}/100</span>
                </div>
              </div>
              <div className="flex items-center justify-around">
                <ScoreRing score={evaluationScores.confidence} label="Confidence" color="#22c55e" />
                <ScoreRing score={evaluationScores.communication} label="Communication" color="#3b82f6" />
                <ScoreRing score={evaluationScores.technicalAccuracy} label="Technical" color="#8b5cf6" />
                <ScoreRing score={evaluationScores.grammar} label="Grammar" color="#f59e0b" />
                <ScoreRing score={evaluationScores.clarity} label="Clarity" color="#ec4899" />
              </div>
            </div>

            {/* Answer Stats */}
            <div className="flex items-center gap-3 p-3 rounded-xl bg-blue-500/5 border border-blue-500/15">
              <Pencil className="w-4 h-4 text-blue-500 shrink-0" />
              <div>
                <p className="text-xs font-bold text-[var(--text-primary)]">Answer Analysis: {evaluationScores.wordCount} words</p>
                <p className="text-[10px] text-[var(--text-secondary)]">
                  {evaluationScores.wordCount < 30
                    ? 'Your answer is quite short — try adding more detail and examples.'
                    : evaluationScores.wordCount > 200
                    ? 'Good detail, but consider trimming for a more focused response.'
                    : 'Good length for an interview answer.'}
                </p>
              </div>
            </div>

            {/* Suggestions */}
            <div className="p-3 rounded-xl bg-[var(--bg-secondary)] border border-[var(--border)] space-y-2">
              <p className="text-[10px] font-bold text-[var(--text-secondary)] uppercase tracking-wider flex items-center gap-1.5">
                <Lightbulb className="w-3 h-3 text-amber-500" /> Suggestions for Improvement
              </p>
              <ul className="space-y-1.5">
                {evaluationScores.suggestions?.map((s, i) => (
                  <li key={i} className="flex items-start gap-2 text-xs text-[var(--text-primary)]">
                    <span className="text-pink-500 mt-0.5 shrink-0">•</span>
                    <span className="leading-relaxed">{s}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Retake */}
            <button onClick={() => { setUserAnswer(''); }}
              className="w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-[var(--bg-secondary)] border border-[var(--border)] text-[var(--text-primary)] text-xs font-bold transition-all hover:border-[var(--accent)]/30">
              <Pencil className="w-3.5 h-3.5" /> Write New Answer
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
