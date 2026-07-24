import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const variants = {
  enter: (dir) => ({ x: dir > 0 ? 80 : -80, opacity: 0 }),
  center: { x: 0, opacity: 1 },
  exit: (dir) => ({ x: dir > 0 ? -80 : 80, opacity: 0 }),
};

const QuestionCard = ({ question, selected, onSelect, direction }) => {
  if (!question) return null;

  return (
    <AnimatePresence mode="wait" custom={direction}>
      <motion.div
        key={question.id}
        custom={direction}
        variants={variants}
        initial="enter"
        animate="center"
        exit="exit"
        transition={{ type: 'spring', stiffness: 300, damping: 30 }}
        className="glass-panel border border-[var(--border-color)] rounded-2xl p-6 space-y-5"
      >
        {/* Question */}
        <h3 className="text-base font-bold text-[var(--text-primary)] leading-relaxed">
          {question.text}
        </h3>

        {/* Likert scale */}
        {question.type === 'likert' && (
          <div className="flex flex-col space-y-2">
            {question.scale.map((label, i) => {
              const val = String(i + 1);
              const isSelected = selected === val;
              return (
                <motion.button
                  key={i}
                  whileHover={{ x: 4 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => onSelect(val)}
                  className={`w-full text-left px-4 py-3 rounded-xl text-sm font-medium transition-all border ${
                    isSelected
                      ? 'bg-pink-500/15 text-pink-500 border-pink-500/40 shadow-sm'
                      : 'bg-[var(--bg-tertiary)] text-[var(--text-secondary)] border-transparent hover:border-[var(--border-color)] hover:text-[var(--text-primary)]'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span>{label}</span>
                    {isSelected && (
                      <motion.span
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        className="w-2 h-2 rounded-full bg-pink-500"
                      />
                    )}
                  </div>
                </motion.button>
              );
            })}
          </div>
        )}

        {/* Multiple choice */}
        {question.type === 'choice' && (
          <div className="flex flex-col space-y-2">
            {question.options.map((opt, i) => {
              const isSelected = selected === opt;
              return (
                <motion.button
                  key={i}
                  whileHover={{ x: 4 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => onSelect(opt)}
                  className={`w-full text-left px-4 py-3 rounded-xl text-sm font-medium transition-all border ${
                    isSelected
                      ? 'bg-pink-500/15 text-pink-500 border-pink-500/40 shadow-sm'
                      : 'bg-[var(--bg-tertiary)] text-[var(--text-secondary)] border-transparent hover:border-[var(--border-color)] hover:text-[var(--text-primary)]'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span>{opt}</span>
                    {isSelected && (
                      <motion.span
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        className="w-2 h-2 rounded-full bg-pink-500"
                      />
                    )}
                  </div>
                </motion.button>
              );
            })}
          </div>
        )}

        {/* Multi-select */}
        {question.type === 'multiselect' && (
          <div className="space-y-3">
            <p className="text-xs text-[var(--text-secondary)]">
              Select {question.minSelect === 0 ? 'any' : `${question.minSelect}-${question.maxSelect}`}
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {question.options.map((opt, i) => {
                const sel = Array.isArray(selected) ? selected : [];
                const isSelected = sel.includes(opt);
                return (
                  <motion.button
                    key={i}
                    whileHover={{ scale: 1.01 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => {
                      let next;
                      if (isSelected) {
                        next = sel.filter(s => s !== opt);
                      } else {
                        if (sel.length >= (question.maxSelect || 99)) return;
                        next = [...sel, opt];
                      }
                      onSelect(next.length > 0 ? next : null);
                    }}
                    className={`w-full text-left px-4 py-3 rounded-xl text-sm font-medium transition-all border ${
                      isSelected
                        ? 'bg-pink-500/15 text-pink-500 border-pink-500/40 shadow-sm'
                        : 'bg-[var(--bg-tertiary)] text-[var(--text-secondary)] border-transparent hover:border-[var(--border-color)] hover:text-[var(--text-primary)]'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span>{opt}</span>
                      <div className={`w-4 h-4 rounded border-2 flex items-center justify-center ${
                        isSelected ? 'border-pink-500 bg-pink-500' : 'border-[var(--border-color)]'
                      }`}>
                        {isSelected && (
                          <motion.svg initial={{ scale: 0 }} animate={{ scale: 1 }}
                            className="w-3 h-3 text-white" viewBox="0 0 12 12" fill="none">
                            <path d="M2 6l3 3 5-5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                          </motion.svg>
                        )}
                      </div>
                    </div>
                  </motion.button>
                );
              })}
            </div>
          </div>
        )}
      </motion.div>
    </AnimatePresence>
  );
};

export default QuestionCard;
