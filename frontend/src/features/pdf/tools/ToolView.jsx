import React, { useState } from 'react';
import { Sparkles, Copy, Download } from 'lucide-react';
import { motion } from 'framer-motion';
import Dropzone from '../../../components/Dropzone';
import Loader from '../../../components/Loader';

const downloadBlob = (blob, filename) => {
  const url = window.URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  setTimeout(() => {
    document.body.removeChild(a);
    window.URL.revokeObjectURL(url);
  }, 5000);
};

const ToolView = ({ tool, onBack, onRun, children, showDropzone = true, multiple = false, accept, disabled = false, onFilesSelected, file, files, onClear }) => {
  const [loading, setLoading] = useState(false);
  const [loadingMessage, setLoadingMessage] = useState('');
  const [textOutput, setTextOutput] = useState('');
  const [copied, setCopied] = useState(false);

  const run = async () => {
    setLoading(true);
    try {
      await onRun(setLoadingMessage, setTextOutput);
    } catch (e) {
      alert(e.message || 'An error occurred during file processing.');
    } finally {
      setLoading(false);
    }
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(textOutput);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const exportSummaryAsPdf = async () => {
    setLoading(true);
    setLoadingMessage('Compiling summary text to PDF document...');
    try {
      const htmlText = `<div style="font-family:sans-serif;padding:30px;line-height:1.6;">
        <h1 style="color:#4f46e5;">PDF Summary Report</h1>
        <hr style="border:1px solid #e5e7eb;" />
        <div style="font-size:14px;color:#374151;white-space:pre-wrap;margin-top:20px;">
          ${textOutput.replace(/\n/g, '<br />')}
        </div>
      </div>`;
      const fd = new FormData();
      const blob = new Blob([htmlText], { type: 'text/html' });
      fd.append('file', blob, 'summary.html');
      fd.append('fromType', 'html');
      fd.append('toType', 'pdf');
      const response = await fetch('/api/pdf/office-convert', { method: 'POST', body: fd });
      if (!response.ok) throw new Error('Failed to export PDF.');
      const pdfBlob = await response.blob();
      downloadBlob(pdfBlob, 'summary-report.pdf');
    } catch (e) {
      alert(e.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6 text-left">
      {loading && <Loader message={loadingMessage} />}

      <motion.div initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 15 }} className="max-w-2xl mx-auto glass-panel p-6 rounded-2xl space-y-6 border border-[var(--border-color)]">
        <div className="space-y-1">
          <div className="flex items-center space-x-2">
            <div className="p-2 bg-pink-500/10 rounded-lg text-pink-600">
              <tool.icon className="h-5 w-5" />
            </div>
            <h3 className="text-lg font-bold text-[var(--text-primary)]">{tool.name}</h3>
          </div>
          <p className="text-xs text-[var(--text-secondary)] leading-relaxed">{tool.desc}</p>
        </div>

        <div className="space-y-4">
          {showDropzone && (
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-[var(--text-secondary)]">Upload Input Document</label>
              <Dropzone onFilesSelected={onFilesSelected} accept={accept} multiple={multiple} value={multiple ? files : file} onClear={onClear} label={`Drag & drop ${multiple ? 'files' : 'your file'} here`} />
            </div>
          )}
          {children}
        </div>

        <button type="button" onClick={run} disabled={disabled} className="w-full py-3 bg-pink-600 hover:bg-pink-700 text-white rounded-xl font-bold text-sm shadow-md transition-all disabled:opacity-50 shadow-pink-600/10">
          Execute {tool.name}
        </button>

        {textOutput && (
          <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} className="p-5 rounded-xl bg-[var(--bg-secondary)] border border-[var(--border-color)] space-y-4">
            <div className="flex justify-between items-center border-b border-[var(--border-color)] pb-2">
              <h4 className="text-xs font-bold text-pink-500 flex items-center">
                <Sparkles className="h-4 w-4 mr-1.5 animate-pulse" /> AI Summary Report
              </h4>
              <div className="flex space-x-2">
                <button type="button" onClick={copyToClipboard} className="p-1.5 rounded bg-[var(--card-bg)] hover:bg-pink-100 dark:hover:bg-pink-950/30 border border-[var(--border-color)] text-[var(--text-secondary)] hover:text-pink-600 flex items-center text-[10px] font-semibold space-x-1">
                  <Copy className="h-3.5 w-3.5" />
                  <span>{copied ? 'Copied' : 'Copy'}</span>
                </button>
                <button type="button" onClick={exportSummaryAsPdf} className="p-1.5 rounded bg-[var(--card-bg)] hover:bg-pink-100 dark:hover:bg-pink-950/30 border border-[var(--border-color)] text-[var(--text-secondary)] hover:text-pink-600 flex items-center text-[10px] font-semibold space-x-1">
                  <Download className="h-3.5 w-3.5" />
                  <span>PDF</span>
                </button>
              </div>
            </div>
            <div className="text-xs leading-relaxed text-[var(--text-primary)] whitespace-pre-wrap font-sans text-left">
              {textOutput}
            </div>
          </motion.div>
        )}
      </motion.div>
    </div>
  );
};

export default ToolView;
