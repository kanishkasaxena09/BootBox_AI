import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Copy, Heart, Check, FileText, Sparkles } from 'lucide-react';

const Editor = ({
  output, generating, charLimit,
  onCopy, onToggleFavorite, isFavorited, tabName,
}) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    const ok = await onCopy();
    if (ok) {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const charCount = output.length;
  const overLimit = charLimit && charCount > charLimit;
  const wordCount = output ? output.trim().split(/\s+/).filter(Boolean).length : 0;

  return (
    <div className="space-y-3">
      {/* Toolbar */}
      <AnimatePresence mode="wait">
        {output && (
          <motion.div initial={{ opacity: 0, y: -5 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
            className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <motion.button whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}
                onClick={handleCopy}
                className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-[var(--bg-tertiary)] text-[var(--text-secondary)] text-xs font-bold transition-all hover:text-[var(--text-primary)] border border-[var(--border-color)] hover:border-pink-500/20">
                <AnimatePresence mode="wait">
                  {copied ? (
                    <motion.span key="check" initial={{ scale: 0 }} animate={{ scale: 1 }} exit={{ scale: 0 }}
                      className="flex items-center gap-1.5 text-emerald-500">
                      <Check className="h-3.5 w-3.5" />
                      <span>Copied!</span>
                    </motion.span>
                  ) : (
                    <motion.span key="copy" initial={{ scale: 0 }} animate={{ scale: 1 }} exit={{ scale: 0 }}
                      className="flex items-center gap-1.5">
                      <Copy className="h-3.5 w-3.5" />
                      <span>Copy</span>
                    </motion.span>
                  )}
                </AnimatePresence>
              </motion.button>
              <motion.button whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}
                onClick={onToggleFavorite}
                className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-[var(--bg-tertiary)] text-[var(--text-secondary)] text-xs font-bold transition-all hover:text-[var(--text-primary)] border border-[var(--border-color)] hover:border-pink-500/20">
                <Heart className={`h-3.5 w-3.5 transition-colors ${isFavorited ? 'text-pink-500 fill-pink-500' : ''}`} />
                <span>{isFavorited ? 'Saved' : 'Save'}</span>
              </motion.button>
            </div>
            <div className="flex items-center gap-3 text-[11px] font-bold">
              <span className="text-[var(--text-secondary)]">{wordCount} words</span>
              <span className={`px-2 py-0.5 rounded-lg ${overLimit ? 'bg-rose-500/15 text-rose-500' : 'bg-[var(--bg-tertiary)] text-[var(--text-secondary)]'}`}>
                {charCount.toLocaleString()} / {charLimit?.toLocaleString() || '∞'}
              </span>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Editor area */}
      <div className="glass-panel border border-[var(--border-color)] rounded-2xl overflow-hidden">
        <AnimatePresence mode="wait">
          {generating ? (
            <motion.div key="loading" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              className="p-12 flex flex-col items-center justify-center space-y-4 min-h-[320px]">
              <div className="relative">
                <motion.div animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 3, ease: 'linear' }}
                  className="w-14 h-14 rounded-2xl bg-gradient-to-br from-pink-500/20 to-rose-500/20 flex items-center justify-center">
                  <Sparkles className="h-6 w-6 text-pink-500" />
                </motion.div>
                <motion.div animate={{ scale: [1, 1.2, 1] }} transition={{ repeat: Infinity, duration: 1.5 }}
                  className="absolute -inset-2 rounded-3xl bg-pink-500/5 blur-xl" />
              </div>
              <div className="text-center space-y-1">
                <p className="text-sm font-bold text-[var(--text-primary)]">Crafting your {tabName}</p>
                <p className="text-xs text-[var(--text-secondary)]">This usually takes a few seconds...</p>
              </div>
              <div className="flex gap-1.5">
                {[0, 1, 2].map(i => (
                  <motion.div key={i}
                    animate={{ y: [-2, 2, -2] }}
                    transition={{ repeat: Infinity, duration: 0.6, delay: i * 0.15 }}
                    className="w-1.5 h-1.5 rounded-full bg-pink-500" />
                ))}
              </div>
            </motion.div>
          ) : output ? (
            <motion.div key="output" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
              className="p-6">
              <textarea readOnly value={output}
                className="w-full bg-transparent text-sm text-[var(--text-primary)] leading-[1.8] resize-none focus:outline-none min-h-[300px] font-medium"
                style={{ fontFamily: 'inherit' }} />
            </motion.div>
          ) : (
            <motion.div key="empty" initial={{ opacity: 0 }} animate={{ opacity: 1 }}
              className="p-12 flex flex-col items-center justify-center space-y-4 min-h-[320px] text-center">
              <div className="w-16 h-16 rounded-2xl bg-[var(--bg-tertiary)] flex items-center justify-center">
                <FileText className="h-7 w-7 text-[var(--text-secondary)] opacity-50" />
              </div>
              <div className="space-y-1">
                <p className="text-sm font-bold text-[var(--text-primary)]">Your {tabName} will appear here</p>
                <p className="text-xs text-[var(--text-secondary)] max-w-[240px]">
                  Fill in the details on the left and click Generate to create your message
                </p>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default Editor;
