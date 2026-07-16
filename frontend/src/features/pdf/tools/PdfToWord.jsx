import React, { useState } from 'react';
import ToolView from './ToolView';
import { FileText } from 'lucide-react';

const tool = { id: 'pdf-to-word', name: 'PDF to Word', icon: FileText, desc: 'Advanced Font-Aware Paragraph Clustering engine that preserves styles and layout perfectly.', accept: '.pdf', iconBg: 'bg-[#3b82f6]' };

const downloadBlob = (blob, filename) => {
  const url = window.URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  setTimeout(() => { document.body.removeChild(a); window.URL.revokeObjectURL(url); }, 5000);
};

const PdfToWord = ({ onBack }) => {
  const [file, setFile] = useState(null);

  const onRun = async (setMsg) => {
    if (!file) throw new Error('Please select a file.');
    setMsg('Converting PDF to Word...');
    const fd = new FormData();
    fd.append('pdfFile', file);
    fd.append('file', file);
    const res = await fetch('/api/pdf/pdf-to-word', { method: 'POST', body: fd });
    if (!res.ok) { const e = await res.json().catch(() => ({})); throw new Error(e.error || 'Failed to convert PDF to Word.'); }
    downloadBlob(await res.blob(), 'bootbox-pdf-to-word.docx');
  };

  return <ToolView tool={tool} onBack={onBack} onRun={onRun} showDropzone accept={tool.accept} onFilesSelected={setFile} file={file} onClear={() => setFile(null)} disabled={!file} />;
};

export default PdfToWord;
