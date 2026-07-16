import React, { useState } from 'react';
import ToolView from './ToolView';
import { Merge } from 'lucide-react';

const tool = { id: 'merge', name: 'Merge PDF', icon: Merge, desc: 'Combine PDFs in the order you want with the easiest PDF merger available.', accept: '.pdf', multiple: true, iconBg: 'bg-[#3b82f6]' };

const downloadBlob = (blob, filename) => {
  const url = window.URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  setTimeout(() => { document.body.removeChild(a); window.URL.revokeObjectURL(url); }, 5000);
};

const MergePdf = ({ onBack }) => {
  const [files, setFiles] = useState(null);

  const onRun = async (setMsg) => {
    if (!files || files.length === 0) throw new Error('Please select files.');
    setMsg('Merging PDFs...');
    const fd = new FormData();
    files.forEach(f => fd.append('pdfFiles', f));
    const res = await fetch('/api/pdf/merge', { method: 'POST', body: fd });
    if (!res.ok) { const e = await res.json().catch(() => ({})); throw new Error(e.error || 'Failed to merge PDFs.'); }
    downloadBlob(await res.blob(), 'bootbox-merge.pdf');
  };

  return <ToolView tool={tool} onBack={onBack} onRun={onRun} showDropzone multiple={tool.accept} accept={tool.accept} onFilesSelected={setFiles} files={files} onClear={() => setFiles(null)} disabled={!files || files.length === 0} />;
};

export default MergePdf;
