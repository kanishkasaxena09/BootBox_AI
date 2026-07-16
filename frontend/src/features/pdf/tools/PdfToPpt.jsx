import React, { useState } from 'react';
import ToolView from './ToolView';
import { Presentation } from 'lucide-react';

const tool = { id: 'pdf-to-ppt', name: 'PDF to PowerPoint', icon: Presentation, desc: 'High-fidelity conversion of PDF pages into editable PowerPoint slides.', accept: '.pdf', iconBg: 'bg-[#f59e0b]' };

const downloadBlob = (blob, filename) => {
  const url = window.URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  setTimeout(() => { document.body.removeChild(a); window.URL.revokeObjectURL(url); }, 5000);
};

const PdfToPpt = ({ onBack }) => {
  const [file, setFile] = useState(null);

  const onRun = async (setMsg) => {
    if (!file) throw new Error('Please select a file.');
    setMsg('Converting PDF to PowerPoint...');
    const fd = new FormData();
    fd.append('pdfFile', file);
    fd.append('file', file);
    fd.append('fromType', 'pdf');
    fd.append('toType', 'pptx');
    const res = await fetch('/api/pdf/office-convert', { method: 'POST', body: fd });
    if (!res.ok) { const e = await res.json().catch(() => ({})); throw new Error(e.error || 'Failed to convert PDF to PowerPoint.'); }
    downloadBlob(await res.blob(), 'bootbox-pdf-to-ppt.pptx');
  };

  return <ToolView tool={tool} onBack={onBack} onRun={onRun} showDropzone accept={tool.accept} onFilesSelected={setFile} file={file} onClear={() => setFile(null)} disabled={!file} />;
};

export default PdfToPpt;
