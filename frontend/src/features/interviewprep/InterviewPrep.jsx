import React from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import useInterview from './useInterview';
import InterviewSetup from './InterviewSetup';
import InterviewSession from './InterviewSession';
import SessionAnalysis from './SessionAnalysis';

export default function InterviewPrep() {
  const h = useInterview();

  return (
    <div className="relative">
      {h.screen === 'session' ? (
        <InterviewSession {...h} />
      ) : (
        <InterviewSetup
          setup={h.setup}
          onUpdate={h.updateSetup}
          onStart={h.startGeneration}
          isGenerating={h.isGenerating}
          generateStep={h.generateStep}
        />
      )}

      {/* Analysis Modal Overlay */}
      <AnimatePresence>
        {h.showAnalysis && h.sessionData && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-start justify-center pt-20 pb-10 px-4 bg-black/60 backdrop-blur-sm overflow-y-auto"
            onClick={(e) => { if (e.target === e.currentTarget) h.dismissAnalysis(); }}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              transition={{ duration: 0.3, type: 'spring', stiffness: 300, damping: 30 }}
              className="w-full max-w-2xl glass-panel rounded-2xl border border-[var(--border)] shadow-2xl p-6"
            >
              <SessionAnalysis data={h.sessionData} onDismiss={h.dismissAnalysis} />
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
