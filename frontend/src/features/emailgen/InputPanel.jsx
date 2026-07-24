import React from 'react';
import { motion } from 'framer-motion';
import { Wand2, RotateCcw, Eraser, Sparkles } from 'lucide-react';

const InputPanel = ({
  activeTab, currentFields, fields, setField,
  tone, setTone, length, setLength,
  tones, lengths,
  onGenerate, onRegenerate, generating, hasOutput, onClear,
}) => {
  return (
    <div className="space-y-5">
      {/* Dynamic fields */}
      <div className="space-y-4">
        {currentFields.map((field, i) => (
          <motion.div key={field.key}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.03 }}
            className="space-y-2">
            <label className="flex items-center text-xs font-bold text-[var(--text-secondary)] tracking-wide uppercase">
              {field.label}
            </label>
            {field.type === 'input' && (
              <input value={fields[field.key] || ''} onChange={e => setField(field.key, e.target.value)}
                placeholder={field.placeholder}
                className="w-full bg-[var(--bg-tertiary)] border border-[var(--border-color)] rounded-xl px-4 py-3 text-sm text-[var(--text-primary)] placeholder:text-pink-400/40 focus:outline-none focus:border-pink-500/50 focus:ring-2 focus:ring-pink-500/10 transition-all" />
            )}
            {field.type === 'textarea' && (
              <textarea value={fields[field.key] || ''} onChange={e => setField(field.key, e.target.value)}
                placeholder={field.placeholder}
                rows={3}
                className="w-full bg-[var(--bg-tertiary)] border border-[var(--border-color)] rounded-xl px-4 py-3 text-sm text-[var(--text-primary)] placeholder:text-pink-400/40 resize-none focus:outline-none focus:border-pink-500/50 focus:ring-2 focus:ring-pink-500/10 transition-all leading-relaxed" />
            )}
            {field.type === 'select' && (
              <div className="relative">
                <select value={fields[field.key] || ''} onChange={e => setField(field.key, e.target.value)}
                  className="w-full bg-[var(--bg-tertiary)] border border-[var(--border-color)] rounded-xl px-4 py-3 text-sm text-[var(--text-primary)] focus:outline-none focus:border-pink-500/50 focus:ring-2 focus:ring-pink-500/10 transition-all appearance-none cursor-pointer">
                  <option value="">Select...</option>
                  {field.options.map(opt => (
                    <option key={opt} value={opt}>{opt}</option>
                  ))}
                </select>
                <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-[var(--text-secondary)]">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </div>
              </div>
            )}
          </motion.div>
        ))}
      </div>

      {/* Divider */}
      <div className="border-t border-[var(--border-color)]" />

      {/* Tone */}
      <div className="space-y-2.5">
        <label className="flex items-center text-xs font-bold text-[var(--text-secondary)] tracking-wide uppercase">
          Tone
        </label>
        <div className="flex flex-wrap gap-2">
          {tones.map(t => (
            <button key={t} onClick={() => setTone(t)}
              className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all border ${
                tone === t
                  ? 'bg-pink-500/15 text-pink-500 border-pink-500/30 shadow-sm shadow-pink-500/10'
                  : 'bg-[var(--bg-tertiary)] text-[var(--text-secondary)] border-[var(--border-color)] hover:border-pink-500/20 hover:text-[var(--text-primary)]'
              }`}>
              {t}
            </button>
          ))}
        </div>
      </div>

      {/* Length */}
      <div className="space-y-2.5">
        <label className="flex items-center text-xs font-bold text-[var(--text-secondary)] tracking-wide uppercase">
          Length
        </label>
        <div className="flex flex-wrap gap-2">
          {lengths.map(l => (
            <button key={l} onClick={() => setLength(l)}
              className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all border ${
                length === l
                  ? 'bg-pink-500/15 text-pink-500 border-pink-500/30 shadow-sm shadow-pink-500/10'
                  : 'bg-[var(--bg-tertiary)] text-[var(--text-secondary)] border-[var(--border-color)] hover:border-pink-500/20 hover:text-[var(--text-primary)]'
              }`}>
              {l}
            </button>
          ))}
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex items-center gap-3 pt-3">
        <motion.button whileHover={{ scale: 1.01 }} whileTap={{ scale: 0.98 }}
          onClick={onGenerate} disabled={generating}
          className="flex-1 flex items-center justify-center gap-2.5 px-5 py-3.5 rounded-xl bg-gradient-to-r from-pink-600 to-rose-600 hover:from-pink-700 hover:to-rose-700 text-white text-sm font-bold transition-all shadow-lg shadow-pink-600/20 disabled:opacity-40 disabled:cursor-not-allowed">
          {generating ? (
            <>
              <motion.span animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 1, ease: 'linear' }}
                className="inline-block"><Sparkles className="h-4 w-4" /></motion.span>
              <span>Generating...</span>
            </>
          ) : (
            <>
              <Wand2 className="h-4 w-4" />
              <span>Generate</span>
            </>
          )}
        </motion.button>
        {hasOutput && (
          <motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.97 }}
            onClick={onRegenerate} disabled={generating}
            className="flex items-center justify-center gap-1.5 px-4 py-3.5 rounded-xl bg-[var(--bg-tertiary)] text-[var(--text-secondary)] text-sm font-bold transition-all hover:text-[var(--text-primary)] border border-[var(--border-color)] hover:border-pink-500/20 disabled:opacity-40">
            <RotateCcw className="h-4 w-4" />
          </motion.button>
        )}
        <motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.97 }}
          onClick={onClear}
          className="flex items-center justify-center gap-1.5 px-4 py-3.5 rounded-xl bg-[var(--bg-tertiary)] text-[var(--text-secondary)] text-sm font-bold transition-all hover:text-rose-500 border border-[var(--border-color)] hover:border-rose-500/20">
          <Eraser className="h-4 w-4" />
        </motion.button>
      </div>
    </div>
  );
};

export default InputPanel;
