import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Mic, Target, Brain, ChevronDown, Upload, Sparkles, X, FileText, Loader2,
} from 'lucide-react';
import { roleOptions, experienceLevels, interviewTypes, difficulties, companyOptions, questionCounts, loadingMessages } from './mockData';
import Dropzone from '../../components/Dropzone';

const fadeUp = { initial: { opacity: 0, y: 20 }, animate: { opacity: 1, y: 0 }, transition: { duration: 0.3 } };
const scaleIn = { initial: { opacity: 0, scale: 0.9 }, animate: { opacity: 1, scale: 1 }, transition: { duration: 0.3, type: 'spring', stiffness: 300, damping: 25 } };

function AutocompleteInput({ label, icon: Icon, value, onChange, options, placeholder }) {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState(value || '');
  const ref = useRef(null);

  useEffect(() => {
    setQuery(value || '');
  }, [value]);

  useEffect(() => {
    const handleClick = (e) => {
      if (ref.current && !ref.current.contains(e.target)) setOpen(false);
    };
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, []);

  const filtered = options.filter(o =>
    o.toLowerCase().includes(query.toLowerCase())
  );

  return (
    <div className="space-y-1.5 relative" ref={ref}>
      <label className="text-xs font-bold uppercase tracking-wider text-[var(--text-secondary)] flex items-center gap-1.5">
        {Icon && <Icon className="w-3.5 h-3.5" />} {label}
      </label>
      <input
        type="text" value={query}
        onChange={e => { setQuery(e.target.value); onChange(e.target.value); setOpen(true); }}
        onFocus={() => setOpen(true)}
        placeholder={placeholder}
        className="w-full px-3 py-2.5 rounded-xl text-sm font-medium outline-none
          bg-[var(--bg-secondary)] border border-[var(--border)] text-[var(--text-primary)]
          hover:border-[var(--accent)] focus:border-[var(--accent)] focus:ring-2 focus:ring-[var(--accent)]/20 transition-all"
      />
      <AnimatePresence>
        {open && filtered.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: -5 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -5 }}
            className="absolute z-50 top-full mt-1 w-full glass-panel border border-[var(--border)] rounded-xl shadow-xl max-h-48 overflow-y-auto"
          >
            {filtered.map(opt => (
              <button key={opt}
                onClick={() => { onChange(opt); setQuery(opt); setOpen(false); }}
                className="w-full px-3 py-2 text-left text-sm text-[var(--text-primary)] hover:bg-[var(--accent)]/10 transition-colors first:rounded-t-xl last:rounded-b-xl"
              >
                {opt}
              </button>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

function DropdownSelect({ label, icon: Icon, value, onChange, options }) {
  const [open, setOpen] = useState(false);
  const ref = useRef(null);
  const selected = options.find(o => (o.id || o) === value);

  useEffect(() => {
    const handleClick = (e) => {
      if (ref.current && !ref.current.contains(e.target)) setOpen(false);
    };
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, []);

  return (
    <div className="space-y-1.5 relative" ref={ref}>
      <label className="text-xs font-bold uppercase tracking-wider text-[var(--text-secondary)] flex items-center gap-1.5">
        {Icon && <Icon className="w-3.5 h-3.5" />} {label}
      </label>
      <button
        onClick={() => setOpen(!open)}
        className="w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-sm font-medium
          bg-[var(--bg-secondary)] border border-[var(--border)] text-[var(--text-primary)]
          hover:border-[var(--accent)] focus:border-[var(--accent)] transition-all"
      >
        <span>{selected?.label || selected || 'Select...'}</span>
        <motion.span animate={{ rotate: open ? 180 : 0 }} transition={{ duration: 0.2 }}>
          <ChevronDown className="w-4 h-4 text-[var(--text-secondary)]" />
        </motion.span>
      </button>
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: -5 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -5 }}
            className="absolute z-50 top-full mt-1 w-full glass-panel border border-[var(--border)] rounded-xl shadow-xl max-h-48 overflow-y-auto"
          >
            {options.map(opt => {
              const optId = opt.id || opt;
              const optLabel = opt.label || opt;
              const isSelected = optId === value;
              return (
                <button key={optId}
                  onClick={() => { onChange(optId); setOpen(false); }}
                  className={`w-full px-3 py-2 text-left text-sm transition-colors first:rounded-t-xl last:rounded-b-xl
                    ${isSelected
                      ? 'bg-[var(--accent)]/15 text-[var(--accent)] font-bold'
                      : 'text-[var(--text-primary)] hover:bg-[var(--accent)]/10'}`}
                >
                  {opt.icon && <span className="mr-2">{opt.icon}</span>}
                  {optLabel}
                </button>
              );
            })}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default function InterviewSetup({ setup, onUpdate, onStart, isGenerating, generateStep }) {
  const [resumeFile, setResumeFile] = useState(null);

  const handleFileUpload = (file) => {
    setResumeFile(file);
    onUpdate('resumeFile', file);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="text-center space-y-2">
        <motion.div {...scaleIn}
          className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-gradient-to-br from-pink-500/20 to-rose-500/20 border border-pink-500/30">
          <Mic className="w-7 h-7 text-pink-400" />
        </motion.div>
        <motion.h1 {...fadeUp}
          className="text-3xl font-black bg-gradient-to-r from-pink-400 via-rose-400 to-fuchsia-400 bg-clip-text text-transparent">
          Interview Preparation
        </motion.h1>
        <motion.p {...fadeUp} className="text-sm text-[var(--text-secondary)] max-w-md mx-auto">
          Generate personalized AI-powered mock interview questions and answering guidance for your target role.
        </motion.p>
      </div>

      {/* Loading Screen */}
      <AnimatePresence>
        {isGenerating && (
          <motion.div
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-black/60 backdrop-blur-sm"
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }}
              className="glass-panel p-8 rounded-2xl flex flex-col items-center justify-center max-w-sm w-full mx-4 text-center border border-white/10"
            >
              <div className="relative w-20 h-20 mb-6">
                <div className="absolute inset-0 rounded-full border-4 border-pink-500/10"></div>
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ repeat: Infinity, duration: 1.5, ease: "linear" }}
                  className="absolute inset-0 rounded-full border-4 border-t-pink-500 border-r-pink-500/30 border-b-transparent border-l-transparent"
                />
                <div className="absolute inset-4 rounded-full border border-rose-500/20"></div>
                <motion.div
                  animate={{ rotate: -360 }}
                  transition={{ repeat: Infinity, duration: 2.5, ease: "linear" }}
                  className="absolute inset-4 rounded-full border border-t-rose-500 border-r-transparent border-b-transparent border-l-rose-500/30"
                />
                <div className="absolute inset-0 flex items-center justify-center">
                  <Sparkles className="w-6 h-6 text-pink-400" />
                </div>
              </div>
              <h3 className="text-lg font-bold text-[var(--text-primary)] mb-2">Generating Your Kit</h3>
              <p className="text-sm text-[var(--text-secondary)] leading-relaxed mb-4">
                {loadingMessages[generateStep] || loadingMessages[loadingMessages.length - 1]}
              </p>
              <div className="w-full">
                <div className="flex justify-between text-xs text-[var(--text-secondary)] mb-1">
                  <span>Progress</span>
                  <span>{Math.round(((generateStep + 1) / 6) * 100)}%</span>
                </div>
                <div className="w-full bg-[var(--bg-secondary)] rounded-full h-2 overflow-hidden">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${((generateStep + 1) / 6) * 100}%` }}
                    transition={{ duration: 0.3 }}
                    className="bg-gradient-to-r from-pink-500 to-rose-500 h-full rounded-full"
                  />
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Form */}
      <motion.div {...fadeUp} className="glass-panel rounded-2xl p-6 border border-[var(--border)] space-y-5">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          <AutocompleteInput
            label="Target Role / Job Title" icon={Target}
            value={setup.role} onChange={v => onUpdate('role', v)}
            options={roleOptions} placeholder="e.g. Software Engineer"
          />
          <DropdownSelect
            label="Experience Level" icon={Brain}
            value={setup.experience} onChange={v => onUpdate('experience', v)}
            options={experienceLevels}
          />
          <DropdownSelect
            label="Interview Type" icon={Mic}
            value={setup.interviewType} onChange={v => onUpdate('interviewType', v)}
            options={interviewTypes}
          />
          <DropdownSelect
            label="Difficulty" icon={Target}
            value={setup.difficulty} onChange={v => onUpdate('difficulty', v)}
            options={difficulties}
          />
          <AutocompleteInput
            label="Target Company (Optional)" icon={Target}
            value={setup.targetCompany} onChange={v => onUpdate('targetCompany', v)}
            options={companyOptions} placeholder="e.g. Google"
          />
          <DropdownSelect
            label="Number of Questions" icon={Target}
            value={setup.count} onChange={v => onUpdate('count', Number(v))}
            options={questionCounts.map(c => ({ id: c, label: `${c} Questions` }))}
          />
        </div>

        {/* Resume Upload */}
        <div className="space-y-2">
          <label className="text-xs font-bold uppercase tracking-wider text-[var(--text-secondary)] flex items-center gap-1.5">
            <FileText className="w-3.5 h-3.5" /> Optional Resume Upload
          </label>
          <p className="text-[10px] text-[var(--text-secondary)]">
            Upload your resume to extract skills, projects, experience, education & technologies for personalized questions.
          </p>
          <Dropzone
            onFilesSelected={handleFileUpload}
            accept=".pdf,.docx"
            maxSizeMB={8}
            label="Drop PDF or DOCX resume here"
            value={resumeFile}
            onClear={() => { setResumeFile(null); onUpdate('resumeFile', null); }}
          />
        </div>

        {/* Generate Button */}
        <motion.button
          whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}
          onClick={onStart}
          disabled={!setup.role || isGenerating}
          className={`w-full flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl font-bold text-sm transition-all shadow-lg
            ${setup.role
              ? 'bg-gradient-to-r from-pink-500 to-rose-500 text-white shadow-pink-500/25 hover:shadow-pink-500/40 cursor-pointer'
              : 'bg-[var(--bg-secondary)] text-[var(--text-secondary)] border border-[var(--border)] cursor-not-allowed opacity-50'}`}
        >
          {isGenerating ? (
            <><Loader2 className="w-4 h-4 animate-spin" /> Generating...</>
          ) : (
            <><Sparkles className="w-4 h-4" /> Generate Interview Kit</>
          )}
        </motion.button>
      </motion.div>
    </div>
  );
}
