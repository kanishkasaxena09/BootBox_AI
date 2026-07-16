import React, { useState } from 'react';
import ToolView from './ToolView';
import { Image } from 'lucide-react';

const tool = { id: 'jpg-to-pdf', name: 'JPG to PDF', icon: Image, desc: 'Convert image files to portable document format (PDF) with clean border alignment.', accept: '.jpg,.jpeg,.png,.webp', multiple: true, iconBg: 'bg-[#ec4899]' };

const downloadBlob = (blob, filename) => {
  const url = window.URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  setTimeout(() => { document.body.removeChild(a); window.URL.revokeObjectURL(url); }, 5000);
};

const JpgToPdf = ({ onBack }) => {
  const [files, setFiles] = useState(null);

  const onRun = async (setMsg) => {
    if (!files || files.length === 0) throw new Error('Please select files.');
    setMsg('Converting images to PDF...');
    const fd = new FormData();
    files.forEach(f => fd.append('pdfFiles', f));
    const res = await fetch('/api/pdf/jpg-to-pdf', { method: 'POST', body: fd });
    if (!res.ok) { const e = await res.json().catch(() => ({})); throw new Error(e.error || 'Failed to convert images to PDF.'); }
    downloadBlob(await res.blob(), 'bootbox-jpg-to-pdf.pdf');
  };

  return <ToolView tool={tool} onBack={onBack} onRun={onRun} showDropzone multiple accept={tool.accept} onFilesSelected={setFiles} files={files} onClear={() => setFiles(null)} disabled={!files || files.length === 0} />;
};

export default JpgToPdf;
