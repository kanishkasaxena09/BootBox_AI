import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, BarChart3, FileText, Pencil } from 'lucide-react';
import QuestionCard from './QuestionCard';
import CodingQuestion from './CodingQuestion';
import SystemDesignQuestion from './SystemDesignQuestion';
import AiEvaluation from './AiEvaluation';
import Timer from './Timer';
import ProgressDashboard from './ProgressDashboard';
import ExportPanel from './ExportPanel';

const fadeUp = { initial: { opacity: 0, y: 15 }, animate: { opacity: 1, y: 0 }, transition: { duration: 0.25 } };

export default function InterviewSession(h) {
  const [sidebarTab, setSidebarTab] = useState('practice');

  const q = h.question;
  if (!q) return null;

  return (
    <div className="space-y-4">
      {/* Session Header */}
      <motion.div {...fadeUp}
        className="flex items-center justify-between glass-panel rounded-2xl p-4 border border-[var(--border)]">
        <div className="flex items-center gap-3">
          <div className="inline-flex items-center justify-center w-10 h-10 rounded-xl bg-gradient-to-br from-pink-500/20 to-rose-500/20 border border-pink-500/30">
            <Pencil className="w-5 h-5 text-pink-400" />
          </div>
          <div>
            <h2 className="text-sm font-black bg-gradient-to-r from-pink-400 to-rose-400 bg-clip-text text-transparent">
              Interview Session
            </h2>
            <p className="text-[10px] text-[var(--text-secondary)]">
              {h.setup.role && `${h.setup.role} · `}{h.setup.interviewType} · {h.questions.length} questions
            </p>
          </div>
        </div>
        <button onClick={h.endSession}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[var(--bg-secondary)] text-[var(--text-secondary)] text-[11px] font-bold transition-all hover:text-[var(--text-primary)] border border-[var(--border)]">
          <X className="w-3 h-3" /> End Session
        </button>
      </motion.div>

      {/* Sidebar Tabs */}
      <div className="flex gap-1 bg-[var(--bg-secondary)] rounded-xl p-1 border border-[var(--border)] w-fit mx-auto">
        {[
          { id: 'practice', label: 'Questions', icon: Pencil },
          { id: 'progress', label: 'Progress', icon: BarChart3 },
          { id: 'export', label: 'Export', icon: FileText },
        ].map(t => (
          <button key={t.id} onClick={() => setSidebarTab(t.id)}
            className={`flex items-center gap-1.5 px-4 py-1.5 rounded-xl text-xs font-bold transition-all
              ${sidebarTab === t.id
                ? 'bg-[var(--accent)]/15 text-[var(--accent)]'
                : 'text-[var(--text-secondary)] hover:text-[var(--text-primary)]'}`}>
            <t.icon className="w-3 h-3" /> {t.label}
          </button>
        ))}
      </div>

      <AnimatePresence mode="wait">
        {sidebarTab === 'practice' && (
          <motion.div key="practice" {...fadeUp} className="grid grid-cols-1 lg:grid-cols-3 gap-4">
            {/* Main Question Area */}
            <div className="lg:col-span-2">
              <QuestionCard
                question={q} currentIdx={h.currentIdx} total={h.questions.length}
                isBookmarked={h.isBookmarked} onToggleBookmark={h.toggleBookmark}
                onPrev={h.prev} onNext={h.next}
                showHowToAnswer={h.showHowToAnswer} setShowHowToAnswer={h.setShowHowToAnswer}
                showKeyPoints={h.showKeyPoints} setShowKeyPoints={h.setShowKeyPoints}
                showMistakes={h.showMistakes} setShowMistakes={h.setShowMistakes}
                showSample={h.showSample} setShowSample={h.setShowSample}
                showFollowUps={h.showFollowUps} setShowFollowUps={h.setShowFollowUps}
                onMarkCompleted={h.markCompleted}
                onRegenerate={h.regenerateQuestion}
                onCopy={() => { navigator.clipboard?.writeText(q.title).catch(() => {}); }}
              >
                {/* Coding-specific content */}
                {q.coding && <CodingQuestion coding={q.coding} />}

                {/* System Design-specific content */}
                {q.systemDesign && <SystemDesignQuestion systemDesign={q.systemDesign} />}
              </QuestionCard>
            </div>

            {/* Sidebar */}
            <div className="space-y-4">
              {/* Timer */}
              <div className="glass-panel rounded-2xl p-4 border border-[var(--border)]">
                <Timer
                  elapsed={h.elapsed} running={h.timerRunning}
                  onStart={h.startTimer} onStop={h.stopTimer} onReset={h.resetTimer}
                  formatTime={h.formatTime}
                />
              </div>

              {/* AI Evaluation */}
              <AiEvaluation
                userAnswer={h.userAnswer} setUserAnswer={h.setUserAnswer}
                showEvaluation={h.showEvaluation} evaluationScores={h.evaluationScores}
                onGenerateEvaluation={h.generateEvaluation}
              />
            </div>
          </motion.div>
        )}

        {sidebarTab === 'progress' && (
          <motion.div key="progress" {...fadeUp}>
            <ProgressDashboard
              history={h.history} bookmarks={h.bookmarks} streak={h.streak}
              overallProgress={h.overallProgress} allQuestions={h.questions}
            />
          </motion.div>
        )}

        {sidebarTab === 'export' && (
          <motion.div key="export" {...fadeUp}>
            <ExportPanel questions={h.questions} setup={h.setup} history={h.history} />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
