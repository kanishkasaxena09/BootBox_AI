import React, { useState } from 'react';
import ToolView from './ToolView';
import { FileDown } from 'lucide-react';

const tool = { id: 'compress', name: 'Compress PDF', icon: FileDown, desc: 'Reduce file size while optimizing for maximal PDF quality.', accept: '.pdf', iconBg: 'bg-[#10b981]' };

const downloadBlob = (blob, filename) => {
  const url = window.URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  setTimeout(() => { document.body.removeChild(a); window.URL.revokeObjectURL(url); }, 5000);
};

const CompressPdf = ({ onBack }) => {
  const [file, setFile] = useState(null);
  const [compressLevel, setCompressLevel] = useState('medium');

  const onRun = async (setMsg) => {
    if (!file) throw new Error('Please select a file.');
    setMsg('Compressing PDF...');
    const fd = new FormData();
    fd.append('pdfFile', file);
    fd.append('file', file);
    fd.append('level', compressLevel);
    const res = await fetch('/api/pdf/compress', { method: 'POST', body: fd });
    if (!res.ok) { const e = await res.json().catch(() => ({})); throw new Error(e.error || 'Failed to compress PDF.'); }
    downloadBlob(await res.blob(), 'bootbox-compress.pdf');
  };

  return (
    <ToolView tool={tool} onBack={onBack} onRun={onRun} showDropzone accept={tool.accept} onFilesSelected={setFile} file={file} onClear={() => setFile(null)} disabled={!file}>
      <div>
        <label className="text-xs font-bold text-[var(--text-secondary)] block mb-2">Select Compression Power</label>
        <div className="grid grid-cols-3 gap-3">
          {['low', 'medium', 'high'].map((lvl) => (
            <button key={lvl} onClick={() => setCompressLevel(lvl)} className={`py-2 rounded-lg text-xs font-semibold capitalize border transition-all ${compressLevel === lvl ? 'border-pink-500 bg-pink-500/10 text-pink-600' : 'border-[var(--border-color)] text-[var(--text-secondary)] hover:text-pink-600'}`}>
              {lvl}
            </button>
          ))}
        </div>
      </div>
    </ToolView>
  );
};

export default CompressPdf;
