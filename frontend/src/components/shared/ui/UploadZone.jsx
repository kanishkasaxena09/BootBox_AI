import React, { useCallback } from 'react';
import { motion } from 'framer-motion';
import { Upload, FileText, X, CheckCircle2 } from 'lucide-react';

export default function UploadZone({ accept, onFile, file, label = 'Drop file here', sublabel, onClear, className = '' }) {
  const handleDrop = useCallback((e) => {
    e.preventDefault();
    const dropped = e.dataTransfer?.files?.[0];
    if (dropped) onFile?.(dropped);
  }, [onFile]);

  const handleDragOver = useCallback((e) => {
    e.preventDefault();
  }, []);

  const handleInput = useCallback((e) => {
    const selected = e.target.files?.[0];
    if (selected) onFile?.(selected);
  }, [onFile]);

  if (file) {
    return (
      <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }}
        className={`glass-panel rounded-xl border border-green-500/20 bg-green-500/5 p-4 ${className}`}>
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-lg bg-green-500/10">
            <CheckCircle2 className="w-4 h-4 text-green-500" />
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-xs font-bold text-[var(--text-primary)] truncate">{file.name}</p>
            <p className="text-[10px] text-[var(--text-secondary)]">{(file.size / 1024).toFixed(1)} KB</p>
          </div>
          {onClear && (
            <button onClick={onClear} className="p-1.5 rounded-lg hover:bg-red-500/10 text-[var(--text-secondary)] hover:text-red-500 transition-all">
              <X className="w-3.5 h-3.5" />
            </button>
          )}
        </div>
      </motion.div>
    );
  }

  return (
    <div onDrop={handleDrop} onDragOver={handleDragOver}
      className={`relative glass-panel rounded-xl border-2 border-dashed border-[var(--border)] hover:border-[var(--accent)]/40 transition-all cursor-pointer group ${className}`}>
      <input type="file" accept={accept} onChange={handleInput}
        className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10" />
      <div className="flex flex-col items-center justify-center py-6 px-4 text-center space-y-2">
        <div className="p-3 rounded-xl bg-[var(--accent)]/10 group-hover:bg-[var(--accent)]/15 transition-all">
          <Upload className="w-5 h-5 text-[var(--accent)]" />
        </div>
        <div>
          <p className="text-xs font-bold text-[var(--text-primary)]">{label}</p>
          {sublabel && <p className="text-[10px] text-[var(--text-secondary)] mt-0.5">{sublabel}</p>}
        </div>
      </div>
    </div>
  );
}
