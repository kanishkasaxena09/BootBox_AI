import React, { useState } from 'react';
import ToolView from './ToolView';
import { Scissors } from 'lucide-react';

const tool = { id: 'split', name: 'Split PDF', icon: Scissors, desc: 'Separate one page or a whole set for easy conversion into independent PDF files.', accept: '.pdf', iconBg: 'bg-[#ef4444]' };

const downloadBlob = (blob, filename) => {
  const url = window.URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  setTimeout(() => { document.body.removeChild(a); window.URL.revokeObjectURL(url); }, 5000);
};

const SplitPdf = ({ onBack }) => {
  const [file, setFile] = useState(null);
  const [pageIndex, setPageIndex] = useState(1);

  const onRun = async (setMsg) => {
    if (!file) throw new Error('Please select a file.');
    setMsg('Splitting PDF...');
    const fd = new FormData();
    fd.append('pdfFile', file);
    fd.append('file', file);
    fd.append('pageIndex', pageIndex);
    const res = await fetch('/api/pdf/split', { method: 'POST', body: fd });
    if (!res.ok) { const e = await res.json().catch(() => ({})); throw new Error(e.error || 'Failed to split PDF.'); }
    downloadBlob(await res.blob(), 'bootbox-split.pdf');
  };

  return (
    <ToolView tool={tool} onBack={onBack} onRun={onRun} showDropzone accept={tool.accept} onFilesSelected={setFile} file={file} onClear={() => setFile(null)} disabled={!file}>
      <div>
        <label className="text-xs font-bold text-[var(--text-secondary)] block mb-1">Page Index to Extract</label>
        <input type="number" min="1" value={pageIndex} onChange={(e) => setPageIndex(e.target.value)} className="w-24 px-3 py-2 rounded-lg border border-[var(--border-color)] bg-[var(--input-bg)] text-sm focus:outline-none text-[var(--text-primary)]" />
      </div>
    </ToolView>
  );
};

export default SplitPdf;
