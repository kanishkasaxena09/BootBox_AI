import React, { useRef, useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  FileText, Sparkles, Download, FileDown, Eraser, History, Trash2,
  Upload, X, RotateCcw, ChevronDown, ChevronUp, Eye
} from 'lucide-react';
import useCoverPage from './useCoverPage';

const A4_W = 595;
const A4_H = 842;

const CoverPageGenerator = () => {
  const {
    fields, updateField, resetForm,
    template, setTemplate, templates,
    logoDataUrl, handleLogoUpload,
    history, loadHistoryEntry, clearHistory,
    exporting, downloadPdf, downloadDocx,
  } = useCoverPage();

  const previewRef = useRef(null);
  const wrapperRef = useRef(null);
  const [scale, setScale] = useState(0.5);
  const [showHistory, setShowHistory] = useState(false);

  const recalcScale = useCallback(() => {
    if (!wrapperRef.current) return;
    const available = wrapperRef.current.clientHeight - 48;
    const s = Math.min(1, available / A4_H);
    setScale(Math.max(0.3, s));
  }, []);

  useEffect(() => {
    recalcScale();
    const obs = new ResizeObserver(recalcScale);
    if (wrapperRef.current) obs.observe(wrapperRef.current);
    return () => obs.disconnect();
  }, [recalcScale]);

  const currentTemplate = templates.find(t => t.id === template);
  const previewHtml = currentTemplate ? currentTemplate.render(fields, logoDataUrl) : '';

  return (
    <div className="space-y-6">
      {/* History Panel */}
      <AnimatePresence>
        {showHistory && history.length > 0 && (
          <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }}
            className="overflow-hidden">
            <div className="glass-panel border border-[var(--border-color)] rounded-2xl p-5">
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-xs font-bold uppercase tracking-wider text-[var(--text-secondary)]">Recent Cover Pages</h3>
                <div className="flex gap-2">
                  <button onClick={clearHistory} className="text-[10px] font-bold text-red-500 hover:text-red-400 flex items-center gap-1">
                    <Trash2 className="w-3 h-3" /> Clear
                  </button>
                  <button onClick={() => setShowHistory(false)}>
                    <ChevronUp className="w-4 h-4 text-[var(--text-secondary)]" />
                  </button>
                </div>
              </div>
              <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-hide">
                {history.map((entry, i) => (
                  <button key={i} onClick={() => { loadHistoryEntry(entry); setShowHistory(false); }}
                    className="flex-shrink-0 px-3 py-2 rounded-xl bg-[var(--bg-secondary)] border border-[var(--border)] text-left hover:border-indigo-500/30 transition-all">
                    <p className="text-[10px] font-bold text-[var(--text-primary)] truncate max-w-[140px]">{entry.assignmentTitle || 'Untitled'}</p>
                    <p className="text-[9px] text-[var(--text-secondary)]">{entry.studentName || 'No name'} · {templates.find(t => t.id === entry.template)?.label || entry.template}</p>
                  </button>
                ))}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="space-y-1">
          <h2 className="text-2xl font-black bg-gradient-to-r from-indigo-500 to-purple-500 bg-clip-text text-transparent">
            Cover Page Generator
          </h2>
          <p className="text-sm text-[var(--text-secondary)]">Generate professional academic cover pages.</p>
        </div>
        {history.length > 0 && (
          <button onClick={() => setShowHistory(!showHistory)}
            className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-[var(--bg-secondary)] border border-[var(--border)] text-xs font-bold text-[var(--text-secondary)] hover:text-indigo-500 transition-all">
            <History className="w-3.5 h-3.5" /> History ({history.length})
            {showHistory ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />}
          </button>
        )}
      </div>

      {/* Main Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
        {/* Left Panel - Form */}
        <div className="lg:col-span-2 space-y-5">
          {/* Template Selector */}
          <div className="glass-panel border border-[var(--border-color)] rounded-2xl p-5 space-y-4">
            <div className="flex items-center gap-2">
              <div className="p-2 bg-indigo-500/10 rounded-xl"><Eye className="w-4 h-4 text-indigo-500" /></div>
              <h3 className="text-sm font-bold text-[var(--text-primary)]">Template</h3>
            </div>
            <div className="grid grid-cols-2 gap-2">
              {templates.map(t => (
                <button key={t.id} onClick={() => setTemplate(t.id)}
                  className={`px-3 py-2.5 rounded-xl text-[11px] font-bold border transition-all ${
                    template === t.id
                      ? 'bg-indigo-500/10 border-indigo-500/30 text-indigo-500'
                      : 'bg-[var(--bg-secondary)] border-[var(--border)] text-[var(--text-secondary)] hover:border-indigo-500/20'
                  }`}>{t.label}</button>
              ))}
            </div>
          </div>

          {/* Form Fields */}
          <div className="glass-panel border border-[var(--border-color)] rounded-2xl p-5 space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="p-2 bg-indigo-500/10 rounded-xl"><FileText className="w-4 h-4 text-indigo-500" /></div>
                <h3 className="text-sm font-bold text-[var(--text-primary)]">Details</h3>
              </div>
              <button onClick={resetForm} className="text-[10px] font-bold text-[var(--text-secondary)] hover:text-red-500 flex items-center gap-1 transition-all">
                <Eraser className="w-3 h-3" /> Reset
              </button>
            </div>

            <div className="space-y-3">
              {[
                { key: 'assignmentTitle', label: 'Assignment Title', placeholder: 'e.g. Data Structures Lab Report' },
                { key: 'studentName', label: 'Student Name', placeholder: 'Your full name' },
                { key: 'rollNumber', label: 'Roll Number', placeholder: 'e.g. 22CS001' },
                { key: 'course', label: 'Course', placeholder: 'e.g. B.Tech Computer Science' },
                { key: 'semester', label: 'Semester', placeholder: 'e.g. 5' },
                { key: 'subject', label: 'Subject', placeholder: 'e.g. Data Structures & Algorithms' },
                { key: 'college', label: 'College', placeholder: 'College name' },
                { key: 'university', label: 'University', placeholder: 'University name' },
                { key: 'faculty', label: 'Faculty', placeholder: 'Faculty name' },
                { key: 'guideName', label: 'Guide Name', placeholder: 'Project guide (optional)' },
                { key: 'submissionDate', label: 'Submission Date', type: 'date' },
              ].map(f => (
                <div key={f.key} className="space-y-1">
                  <label className="text-[10px] font-bold uppercase tracking-wider text-[var(--text-secondary)]">{f.label}</label>
                  <input type={f.type || 'text'} value={fields[f.key]} onChange={e => updateField(f.key, e.target.value)}
                    placeholder={f.placeholder || ''}
                    className="w-full px-3 py-2.5 rounded-xl text-xs font-medium outline-none bg-[var(--bg-secondary)] border border-[var(--border-color)] text-[var(--text-primary)] hover:border-[var(--accent)] focus:border-[var(--accent)] focus:ring-2 focus:ring-[var(--accent)]/20 transition-all" />
                </div>
              ))}
            </div>

            {/* Logo Upload */}
            <div className="space-y-1">
              <label className="text-[10px] font-bold uppercase tracking-wider text-[var(--text-secondary)]">Logo (optional)</label>
              {logoDataUrl ? (
                <div className="flex items-center gap-3 p-2 rounded-xl bg-[var(--bg-secondary)] border border-[var(--border-color)]">
                  <img src={logoDataUrl} alt="Logo" className="w-10 h-10 object-contain rounded" />
                  <span className="text-[10px] text-[var(--text-secondary)] flex-1 truncate">Logo uploaded</span>
                  <button onClick={() => handleLogoUpload(null)} className="p-1 rounded hover:bg-red-500/10 text-[var(--text-secondary)] hover:text-red-500 transition-all">
                    <X className="w-3 h-3" />
                  </button>
                </div>
              ) : (
                <label className="flex items-center gap-2 p-3 rounded-xl bg-[var(--bg-secondary)] border border-dashed border-[var(--border-color)] cursor-pointer hover:border-indigo-500/30 transition-all">
                  <Upload className="w-4 h-4 text-[var(--text-secondary)]" />
                  <span className="text-[11px] font-bold text-[var(--text-secondary)]">Upload logo (PNG/JPG)</span>
                  <input type="file" accept="image/*" className="hidden" onChange={e => handleLogoUpload(e.target.files?.[0] || null)} />
                </label>
              )}
            </div>
          </div>
        </div>

        {/* Right Panel - Preview + Export */}
        <div className="lg:col-span-3 space-y-4">
          {/* Toolbar */}
          <div className="flex items-center gap-2 flex-wrap">
            <button onClick={() => downloadPdf(previewRef)} disabled={exporting}
              className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 text-white font-bold text-xs shadow-lg shadow-indigo-500/20 transition-all disabled:opacity-50">
              {exporting ? <RotateCcw className="w-3.5 h-3.5 animate-spin" /> : <Download className="w-3.5 h-3.5" />} PDF
            </button>
            <button onClick={downloadDocx} disabled={exporting}
              className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-[var(--bg-secondary)] border border-[var(--border-color)] text-[var(--text-secondary)] hover:text-indigo-500 font-bold text-xs transition-all disabled:opacity-50">
              {exporting ? <RotateCcw className="w-3.5 h-3.5 animate-spin" /> : <FileDown className="w-3.5 h-3.5" />} DOCX
            </button>
          </div>

          {/* Preview */}
          <div ref={wrapperRef} className="glass-panel border border-[var(--border-color)] rounded-2xl p-6 flex flex-col" style={{ height: 'calc(100vh - 160px)' }}>
            <div className="flex items-center gap-2 mb-4 flex-shrink-0">
              <Eye className="w-4 h-4 text-indigo-500" />
              <h3 className="text-sm font-bold text-[var(--text-primary)]">Live Preview</h3>
              <span className="text-[10px] text-[var(--text-secondary)] ml-auto">A4 · {templates.find(t => t.id === template)?.label}</span>
            </div>
            <div className="flex-1 flex items-start justify-center overflow-hidden">
              <div ref={previewRef} dangerouslySetInnerHTML={{ __html: previewHtml }}
                className="shadow-2xl rounded-lg flex-shrink-0 origin-top"
                style={{ width: A4_W, height: A4_H, transform: `scale(${scale})`, marginBottom: -(A4_H * (1 - scale)) }} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CoverPageGenerator;
