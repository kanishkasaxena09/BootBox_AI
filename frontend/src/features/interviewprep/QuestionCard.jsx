import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Bookmark, BookmarkCheck, CheckCircle2, ChevronLeft, ChevronRight,
  Lightbulb, Target, AlertTriangle, Sparkles, MessageCircle, Clock,
  RotateCcw, Share2, Copy, ChevronDown,
} from 'lucide-react';

const diffColors = {
  Easy: 'bg-emerald-500/15 text-emerald-500 border-emerald-500/20',
  Medium: 'bg-amber-500/15 text-amber-500 border-amber-500/20',
  Hard: 'bg-rose-500/15 text-rose-500 border-rose-500/20',
};

const catColors = {
  'Coding': 'bg-blue-500/15 text-blue-500',
  'System Design': 'bg-violet-500/15 text-violet-500',
  'Technical': 'bg-cyan-500/15 text-cyan-500',
  'HR': 'bg-pink-500/15 text-pink-500',
  'Behavioral': 'bg-amber-500/15 text-amber-500',
  'Mock Interview': 'bg-emerald-500/15 text-emerald-500',
  'Leadership': 'bg-indigo-500/15 text-indigo-500',
};

function ExpandableSection({ icon: Icon, title, color, isOpen, onToggle, children }) {
  return (
    <div>
      <button onClick={onToggle}
        className="w-full flex items-center justify-between p-3 rounded-xl bg-[var(--bg-secondary)] border border-[var(--border)] transition-all hover:border-[var(--accent)]/30">
        <div className="flex items-center gap-2">
          <Icon className={`w-4 h-4 ${color}`} />
          <span className="text-xs font-bold text-[var(--text-primary)]">{title}</span>
        </div>
        <motion.div animate={{ rotate: isOpen ? 180 : 0 }} transition={{ duration: 0.2 }}>
          <ChevronDown className="w-4 h-4 text-[var(--text-secondary)]" />
        </motion.div>
      </button>
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }} transition={{ duration: 0.2 }}
            className="overflow-hidden"
          >
            <div className="p-3 mt-1 rounded-xl bg-[var(--bg-secondary)] border border-[var(--border)] text-xs text-[var(--text-primary)] leading-relaxed space-y-2">
              {children}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default function QuestionCard({
  question, currentIdx, total,
  isBookmarked, onToggleBookmark,
  onPrev, onNext,
  showHowToAnswer, setShowHowToAnswer,
  showKeyPoints, setShowKeyPoints,
  showMistakes, setShowMistakes,
  showSample, setShowSample,
  showFollowUps, setShowFollowUps,
  onMarkCompleted, onRegenerate, onCopy,
  children,
}) {
  if (!question) return null;

  return (
    <div className="space-y-4">
      {/* Question Header */}
      <div className="glass-panel rounded-2xl p-5 border border-[var(--border)] space-y-4">
        <div className="flex items-start justify-between gap-3">
          <div className="space-y-2 flex-1 min-w-0">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="text-[10px] font-bold px-2.5 py-1 rounded-full bg-pink-500/15 text-pink-500 border border-pink-500/20">
                Q{currentIdx + 1}
              </span>
              <span className={`text-[10px] font-bold px-2.5 py-1 rounded-full border ${catColors[question.category] || 'bg-[var(--bg-secondary)] text-[var(--text-secondary)]'}`}>
                {question.category}
              </span>
              {question.difficulty && (
                <span className={`text-[10px] font-bold px-2.5 py-1 rounded-full border ${diffColors[question.difficulty] || ''}`}>
                  {question.difficulty}
                </span>
              )}
              {question.estimatedTime && (
                <span className="flex items-center gap-1 text-[10px] font-bold px-2.5 py-1 rounded-full bg-[var(--bg-secondary)] text-[var(--text-secondary)] border border-[var(--border)]">
                  <Clock className="w-3 h-3" /> {question.estimatedTime}
                </span>
              )}
            </div>
            <h3 className="text-base font-bold text-[var(--text-primary)] leading-relaxed">
              {question.title}
            </h3>
          </div>
          <div className="flex items-center gap-1 shrink-0">
            <button onClick={onToggleBookmark}
              className="p-2 rounded-xl hover:bg-[var(--bg-secondary)] transition-all"
              title={isBookmarked ? 'Remove bookmark' : 'Bookmark'}>
              {isBookmarked
                ? <BookmarkCheck className="w-5 h-5 text-pink-500" />
                : <Bookmark className="w-5 h-5 text-[var(--text-secondary)]" />}
            </button>
            <button onClick={onRegenerate}
              className="p-2 rounded-xl hover:bg-[var(--bg-secondary)] transition-all"
              title="Regenerate question">
              <RotateCcw className="w-5 h-5 text-[var(--text-secondary)]" />
            </button>
            <button onClick={onCopy}
              className="p-2 rounded-xl hover:bg-[var(--bg-secondary)] transition-all"
              title="Copy question">
              <Copy className="w-5 h-5 text-[var(--text-secondary)]" />
            </button>
          </div>
        </div>

        {/* Navigation */}
        <div className="flex items-center justify-between pt-1">
          <button onClick={onPrev} disabled={currentIdx === 0}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[var(--bg-secondary)] text-[var(--text-secondary)] text-[11px] font-bold transition-all hover:text-[var(--text-primary)] disabled:opacity-30 disabled:cursor-not-allowed border border-[var(--border)]">
            <ChevronLeft className="w-3 h-3" /> Prev
          </button>
          <span className="text-[11px] font-bold text-[var(--text-secondary)]">
            {currentIdx + 1} / {total}
          </span>
          <button onClick={onNext} disabled={currentIdx >= total - 1}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[var(--bg-secondary)] text-[var(--text-secondary)] text-[11px] font-bold transition-all hover:text-[var(--text-primary)] disabled:opacity-30 disabled:cursor-not-allowed border border-[var(--border)]">
            Next <ChevronRight className="w-3 h-3" />
          </button>
        </div>
      </div>

      {/* Expandable Sections */}
      <div className="space-y-2">
        <ExpandableSection icon={Target} title="How to Answer" color="text-blue-500" isOpen={showHowToAnswer} onToggle={() => setShowHowToAnswer(!showHowToAnswer)}>
          <p className="leading-relaxed">{question.howToAnswer}</p>
        </ExpandableSection>

        <ExpandableSection icon={Lightbulb} title="Key Points" color="text-amber-500" isOpen={showKeyPoints} onToggle={() => setShowKeyPoints(!showKeyPoints)}>
          <ul className="space-y-1.5">
            {question.keyPoints?.map((point, i) => (
              <li key={i} className="flex items-start gap-2">
                <span className="text-amber-500 mt-0.5">•</span>
                <span>{point}</span>
              </li>
            ))}
          </ul>
        </ExpandableSection>

        <ExpandableSection icon={AlertTriangle} title="Common Mistakes" color="text-rose-500" isOpen={showMistakes} onToggle={() => setShowMistakes(!showMistakes)}>
          <ul className="space-y-1.5">
            {question.commonMistakes?.map((mistake, i) => (
              <li key={i} className="flex items-start gap-2">
                <span className="text-rose-500 mt-0.5">✗</span>
                <span>{mistake}</span>
              </li>
            ))}
          </ul>
        </ExpandableSection>

        <ExpandableSection icon={Sparkles} title="Example Answer" color="text-emerald-500" isOpen={showSample} onToggle={() => setShowSample(!showSample)}>
          <p className="leading-relaxed text-[var(--text-primary)]">{question.sampleAnswer}</p>
        </ExpandableSection>

        <ExpandableSection icon={MessageCircle} title="Follow-up Questions" color="text-violet-500" isOpen={showFollowUps} onToggle={() => setShowFollowUps(!showFollowUps)}>
          <ul className="space-y-1.5">
            {question.followUpQuestions?.map((fq, i) => (
              <li key={i} className="flex items-start gap-2">
                <span className="text-violet-500 mt-0.5">{i + 1}.</span>
                <span>{fq}</span>
              </li>
            ))}
          </ul>
        </ExpandableSection>
      </div>

      {/* AI Evaluation Slot */}
      {children}

      {/* Mark Completed */}
      <motion.button
        whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}
        onClick={onMarkCompleted}
        disabled={question.isCompleted}
        className={`w-full flex items-center justify-center gap-2 px-4 py-3 rounded-xl text-xs font-bold transition-all
          ${question.isCompleted
            ? 'bg-emerald-500/15 text-emerald-500 border border-emerald-500/20 cursor-default'
            : 'bg-gradient-to-r from-pink-500 to-rose-500 text-white shadow-lg shadow-pink-500/25 hover:shadow-pink-500/40 cursor-pointer'}`}
      >
        {question.isCompleted ? (
          <><CheckCircle2 className="w-4 h-4" /> Completed</>
        ) : (
          <><CheckCircle2 className="w-4 h-4" /> Mark as Completed</>
        )}
      </motion.button>
    </div>
  );
}
