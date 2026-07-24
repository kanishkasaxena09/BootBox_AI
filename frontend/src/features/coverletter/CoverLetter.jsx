import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Clock, Trash2, X, History, Heart, FileText, Download, Copy, Check, Wand2, Eraser, Sparkles, Lightbulb, ArrowRight, FileDown, PenLine } from 'lucide-react';
import { useCoverLetter } from './useCoverLetter';

const CoverLetter = () => {
  const cl = useCoverLetter();
  const [copied, setCopied] = React.useState(false);
  const [activeView, setActiveView] = React.useState('edit');

  const handleCopy = async () => {
    const ok = await cl.copyToClipboard();
    if (ok) { setCopied(true); setTimeout(() => setCopied(false), 2000); }
  };

  const wordCount = cl.output ? cl.output.trim().split(/\s+/).filter(Boolean).length : 0;

  return (
    <div className="space-y-6 text-left">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="space-y-2">
          <h2 className="text-2xl font-black bg-gradient-to-r from-pink-500 to-rose-500 bg-clip-text text-transparent">
            Cover Letter Generator
          </h2>
          <p className="text-sm text-[var(--text-secondary)]">
            Craft a compelling cover letter tailored to your target role.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <button onClick={() => cl.setShowHistory(!cl.showHistory)}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[var(--bg-tertiary)] text-[var(--text-secondary)] text-xs font-bold transition-all hover:text-[var(--text-primary)] border border-[var(--border-color)] hover:border-pink-500/20">
            <Clock className="h-3.5 w-3.5" />
            <span>History ({cl.history.length})</span>
          </button>
        </div>
      </div>

      {/* History panel */}
      <AnimatePresence>
        {cl.showHistory && (
          <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="glass-panel border border-[var(--border-color)] rounded-2xl p-5 space-y-4 overflow-hidden">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <History className="h-4 w-4 text-pink-500" />
                <span className="text-sm font-bold text-[var(--text-primary)]">Recent Cover Letters</span>
              </div>
              <div className="flex items-center gap-3">
                <button onClick={cl.clearAll}
                  className="text-[11px] font-bold text-[var(--text-secondary)] hover:text-rose-500 transition-all">
                  Clear All
                </button>
                <button onClick={() => cl.setShowHistory(false)}
                  className="p-1.5 rounded-lg text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-tertiary)] transition-all">
                  <X className="h-4 w-4" />
                </button>
              </div>
            </div>
            <div className="space-y-2 max-h-64 overflow-y-auto">
              {cl.history.length === 0 ? (
                <div className="py-8 text-center">
                  <FileText className="h-8 w-8 text-[var(--text-secondary)] opacity-30 mx-auto mb-2" />
                  <p className="text-xs text-[var(--text-secondary)]">No cover letters yet</p>
                </div>
              ) : cl.history.slice(0, 10).map((h, i) => (
                <motion.div key={h.id}
                  initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.03 }}
                  onClick={() => cl.loadFromHistory(h)}
                  className="flex items-center gap-3 p-3.5 rounded-xl bg-[var(--bg-tertiary)] cursor-pointer border border-transparent hover:border-pink-500/20 transition-all group">
                  <div className="w-9 h-9 rounded-xl bg-pink-500/10 flex items-center justify-center shrink-0">
                    <PenLine className="h-4 w-4 text-pink-500" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-bold text-[var(--text-primary)] truncate">
                      {h.fields?.role || 'Untitled'} @ {h.fields?.company || 'Unknown'}
                    </p>
                    <p className="text-[10px] text-[var(--text-secondary)]">
                      {h.tone} · {new Date(h.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                    </p>
                  </div>
                  <button onClick={(e) => { e.stopPropagation(); cl.deleteEntry(h.id); }}
                    className="p-1.5 rounded-lg text-[var(--text-secondary)] opacity-0 group-hover:opacity-100 hover:text-rose-500 hover:bg-rose-500/10 transition-all">
                    <Trash2 className="h-3 w-3" />
                  </button>
                </motion.div>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Main Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-5">
        {/* Input Panel */}
        <div className="lg:col-span-2 space-y-5">
          <div className="glass-panel border border-[var(--border-color)] rounded-2xl p-6">
            <div className="flex items-center gap-2.5 mb-5 pb-4 border-b border-[var(--border-color)]">
              <div className="w-8 h-8 rounded-xl bg-pink-500/10 flex items-center justify-center">
                <PenLine className="h-4 w-4 text-pink-500" />
              </div>
              <div>
                <h3 className="text-sm font-bold text-[var(--text-primary)]">Cover Letter Details</h3>
                <p className="text-[10px] text-[var(--text-secondary)]">Fill in your information</p>
              </div>
            </div>

            <div className="space-y-4">
              {/* Company */}
              <div className="space-y-2">
                <label className="flex items-center text-xs font-bold text-[var(--text-secondary)] tracking-wide uppercase">Company</label>
                <input value={cl.company} onChange={e => cl.setCompany(e.target.value)}
                  placeholder="e.g. Google, Stripe, OpenAI"
                  className="w-full bg-[var(--bg-tertiary)] border border-[var(--border-color)] rounded-xl px-4 py-3 text-sm text-[var(--text-primary)] placeholder:text-pink-400/40 focus:outline-none focus:border-pink-500/50 focus:ring-2 focus:ring-pink-500/10 transition-all" />
              </div>

              {/* Role */}
              <div className="space-y-2">
                <label className="flex items-center text-xs font-bold text-[var(--text-secondary)] tracking-wide uppercase">Target Role</label>
                <input value={cl.role} onChange={e => cl.setRole(e.target.value)}
                  placeholder="e.g. Senior Software Engineer"
                  className="w-full bg-[var(--bg-tertiary)] border border-[var(--border-color)] rounded-xl px-4 py-3 text-sm text-[var(--text-primary)] placeholder:text-pink-400/40 focus:outline-none focus:border-pink-500/50 focus:ring-2 focus:ring-pink-500/10 transition-all" />
              </div>

              {/* Hiring Manager */}
              <div className="space-y-2">
                <label className="flex items-center text-xs font-bold text-[var(--text-secondary)] tracking-wide uppercase">Hiring Manager</label>
                <input value={cl.hiringManager} onChange={e => cl.setHiringManager(e.target.value)}
                  placeholder="e.g. Sarah Chen (optional)"
                  className="w-full bg-[var(--bg-tertiary)] border border-[var(--border-color)] rounded-xl px-4 py-3 text-sm text-[var(--text-primary)] placeholder:text-pink-400/40 focus:outline-none focus:border-pink-500/50 focus:ring-2 focus:ring-pink-500/10 transition-all" />
              </div>

              {/* Experience */}
              <div className="space-y-2">
                <label className="flex items-center text-xs font-bold text-[var(--text-secondary)] tracking-wide uppercase">Experience</label>
                <textarea value={cl.experience} onChange={e => cl.setExperience(e.target.value)}
                  placeholder="e.g. 5 years at Meta building distributed systems..."
                  rows={3}
                  className="w-full bg-[var(--bg-tertiary)] border border-[var(--border-color)] rounded-xl px-4 py-3 text-sm text-[var(--text-primary)] placeholder:text-pink-400/40 resize-none focus:outline-none focus:border-pink-500/50 focus:ring-2 focus:ring-pink-500/10 transition-all leading-relaxed" />
              </div>

              {/* Skills */}
              <div className="space-y-2">
                <label className="flex items-center text-xs font-bold text-[var(--text-secondary)] tracking-wide uppercase">Key Skills</label>
                <input value={cl.skills} onChange={e => cl.setSkills(e.target.value)}
                  placeholder="e.g. React, Node.js, AWS, System Design"
                  className="w-full bg-[var(--bg-tertiary)] border border-[var(--border-color)] rounded-xl px-4 py-3 text-sm text-[var(--text-primary)] placeholder:text-pink-400/40 focus:outline-none focus:border-pink-500/50 focus:ring-2 focus:ring-pink-500/10 transition-all" />
              </div>

              {/* Achievements */}
              <div className="space-y-2">
                <label className="flex items-center text-xs font-bold text-[var(--text-secondary)] tracking-wide uppercase">Top Achievements</label>
                <textarea value={cl.achievements} onChange={e => cl.setAchievements(e.target.value)}
                  placeholder="e.g. Led team of 8, shipped product used by 2M+ users..."
                  rows={3}
                  className="w-full bg-[var(--bg-tertiary)] border border-[var(--border-color)] rounded-xl px-4 py-3 text-sm text-[var(--text-primary)] placeholder:text-pink-400/40 resize-none focus:outline-none focus:border-pink-500/50 focus:ring-2 focus:ring-pink-500/10 transition-all leading-relaxed" />
              </div>

              {/* Divider */}
              <div className="border-t border-[var(--border-color)]" />

              {/* Tone */}
              <div className="space-y-2.5">
                <label className="flex items-center text-xs font-bold text-[var(--text-secondary)] tracking-wide uppercase">Tone</label>
                <div className="flex flex-wrap gap-2">
                  {cl.tones.map(t => (
                    <button key={t} onClick={() => cl.setTone(t)}
                      className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all border ${
                        cl.tone === t
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
                <label className="flex items-center text-xs font-bold text-[var(--text-secondary)] tracking-wide uppercase">Length</label>
                <div className="flex flex-wrap gap-2">
                  {cl.lengths.map(l => (
                    <button key={l} onClick={() => cl.setLength(l)}
                      className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all border ${
                        cl.length === l
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
                  onClick={cl.generate} disabled={cl.generating}
                  className="flex-1 flex items-center justify-center gap-2.5 px-5 py-3.5 rounded-xl bg-gradient-to-r from-pink-600 to-rose-600 hover:from-pink-700 hover:to-rose-700 text-white text-sm font-bold transition-all shadow-lg shadow-pink-600/20 disabled:opacity-40 disabled:cursor-not-allowed">
                  {cl.generating ? (
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
                <motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.97 }}
                  onClick={cl.resetForm}
                  className="flex items-center justify-center gap-1.5 px-4 py-3.5 rounded-xl bg-[var(--bg-tertiary)] text-[var(--text-secondary)] text-sm font-bold transition-all hover:text-rose-500 border border-[var(--border-color)] hover:border-rose-500/20">
                  <Eraser className="h-4 w-4" />
                </motion.button>
              </div>
            </div>
          </div>
        </div>

        {/* Output Panel */}
        <div className="lg:col-span-3 space-y-4">
          {/* Toolbar */}
          <AnimatePresence>
            {cl.output && (
              <motion.div initial={{ opacity: 0, y: -5 }} animate={{ opacity: 1, y: 0 }}
                className="glass-panel border border-[var(--border-color)] rounded-2xl p-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <motion.button whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}
                      onClick={handleCopy}
                      className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-[var(--bg-tertiary)] text-[var(--text-secondary)] text-xs font-bold transition-all hover:text-[var(--text-primary)] border border-[var(--border-color)] hover:border-pink-500/20">
                      {copied ? <Check className="h-3.5 w-3.5 text-emerald-500" /> : <Copy className="h-3.5 w-3.5" />}
                      <span>{copied ? 'Copied!' : 'Copy'}</span>
                    </motion.button>
                    <motion.button whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}
                      onClick={cl.downloadPDF}
                      className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-[var(--bg-tertiary)] text-[var(--text-secondary)] text-xs font-bold transition-all hover:text-[var(--text-primary)] border border-[var(--border-color)] hover:border-pink-500/20">
                      <FileDown className="h-3.5 w-3.5" />
                      <span>PDF</span>
                    </motion.button>
                    <motion.button whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}
                      onClick={cl.downloadDOCX}
                      className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-[var(--bg-tertiary)] text-[var(--text-secondary)] text-xs font-bold transition-all hover:text-[var(--text-primary)] border border-[var(--border-color)] hover:border-pink-500/20">
                      <Download className="h-3.5 w-3.5" />
                      <span>DOCX</span>
                    </motion.button>
                    <motion.button whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}
                      onClick={cl.improve}
                      className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-amber-500/10 text-amber-500 text-xs font-bold transition-all hover:bg-amber-500/20 border border-amber-500/20">
                      <Lightbulb className="h-3.5 w-3.5" />
                      <span>AI Tips</span>
                    </motion.button>
                  </div>
                  <div className="flex items-center gap-3 text-[11px] font-bold">
                    <span className="text-[var(--text-secondary)]">{wordCount} words</span>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* AI Improvements */}
          <AnimatePresence>
            {cl.improvements.length > 0 && (
              <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                className="glass-panel border border-amber-500/20 rounded-2xl p-5 space-y-3 overflow-hidden">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Lightbulb className="h-4 w-4 text-amber-500" />
                    <span className="text-sm font-bold text-[var(--text-primary)]">AI Improvement Suggestions</span>
                  </div>
                  <button onClick={() => cl.setImprovements([])}
                    className="p-1.5 rounded-lg text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-tertiary)] transition-all">
                    <X className="h-4 w-4" />
                  </button>
                </div>
                <div className="space-y-2">
                  {cl.improvements.map((imp, i) => (
                    <motion.div key={i} initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: i * 0.05 }}
                      className="flex items-start gap-2.5 p-3 rounded-xl bg-amber-500/5 border border-amber-500/10">
                      <span className="w-5 h-5 rounded-lg bg-amber-500/15 flex items-center justify-center text-amber-500 text-[10px] font-bold shrink-0 mt-0.5">
                        {i + 1}
                      </span>
                      <p className="text-xs text-[var(--text-primary)] leading-relaxed">{imp}</p>
                    </motion.div>
                  ))}
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Editor / Preview */}
          <div className="glass-panel border border-[var(--border-color)] rounded-2xl overflow-hidden">
            {/* View toggle */}
            {cl.output && (
              <div className="flex items-center gap-1 p-1.5 border-b border-[var(--border-color)] bg-[var(--bg-tertiary)]">
                <button onClick={() => setActiveView('edit')}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-[11px] font-bold transition-all ${
                    activeView === 'edit'
                      ? 'bg-[var(--bg-primary)] text-[var(--text-primary)] shadow-sm'
                      : 'text-[var(--text-secondary)] hover:text-[var(--text-primary)]'
                  }`}>
                  <PenLine className="h-3 w-3" />Edit
                </button>
                <button onClick={() => setActiveView('preview')}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-[11px] font-bold transition-all ${
                    activeView === 'preview'
                      ? 'bg-[var(--bg-primary)] text-[var(--text-primary)] shadow-sm'
                      : 'text-[var(--text-secondary)] hover:text-[var(--text-primary)]'
                  }`}>
                  <FileText className="h-3 w-3" />Preview
                </button>
              </div>
            )}

            {/* Content */}
            <AnimatePresence mode="wait">
              {cl.generating ? (
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
                    <p className="text-sm font-bold text-[var(--text-primary)]">Crafting your cover letter</p>
                    <p className="text-xs text-[var(--text-secondary)]">Tailoring content to your target role...</p>
                  </div>
                </motion.div>
              ) : cl.output ? (
                activeView === 'edit' ? (
                  <motion.div key="edit" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="p-6">
                    <textarea value={cl.output} onChange={e => cl.updateOutput(e.target.value)}
                      className="w-full bg-transparent text-sm text-[var(--text-primary)] leading-[1.8] resize-none focus:outline-none min-h-[350px] font-medium"
                      style={{ fontFamily: 'inherit' }} />
                  </motion.div>
                ) : (
                  <motion.div key="preview" initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                    className="p-8 bg-white min-h-[350px]">
                    <div className="max-w-lg mx-auto text-gray-800 text-sm leading-[1.8] font-serif whitespace-pre-wrap">
                      {cl.output}
                    </div>
                  </motion.div>
                )
              ) : (
                <motion.div key="empty" initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                  className="p-12 flex flex-col items-center justify-center space-y-4 min-h-[350px] text-center">
                  <div className="w-16 h-16 rounded-2xl bg-[var(--bg-tertiary)] flex items-center justify-center">
                    <FileText className="h-7 w-7 text-[var(--text-secondary)] opacity-50" />
                  </div>
                  <div className="space-y-1">
                    <p className="text-sm font-bold text-[var(--text-primary)]">Your cover letter will appear here</p>
                    <p className="text-xs text-[var(--text-secondary)] max-w-[240px]">
                      Fill in the details and click Generate to create a tailored cover letter
                    </p>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CoverLetter;
