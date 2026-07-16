import React, { useState } from 'react';
import ToolView from './ToolView';
import { FileText } from 'lucide-react';

const tool = { id: 'word-to-pdf', name: 'Word to PDF', icon: FileText, desc: 'Make DOC and DOCX files easy to read by converting them to clean PDF sheets.', accept: '.docx', iconBg: 'bg-[#1d4ed8]' };

const downloadBlob = (blob, filename) => {
  const url = window.URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  setTimeout(() => { document.body.removeChild(a); window.URL.revokeObjectURL(url); }, 5000);
};

const WordToPdf = ({ onBack }) => {
  const [file, setFile] = useState(null);

  const onRun = async (setMsg) => {
    if (!file) throw new Error('Please select a file.');
    setMsg('Converting Word to PDF...');
    const fd = new FormData();
    fd.append('pdfFile', file);
    fd.append('file', file);
    const res = await fetch('/api/pdf/word-to-pdf', { method: 'POST', body: fd });
    if (!res.ok) { const e = await res.json().catch(() => ({})); throw new Error(e.error || 'Failed to convert Word to PDF.'); }
    downloadBlob(await res.blob(), 'bootbox-word-to-pdf.pdf');
  };

  return <ToolView tool={tool} onBack={onBack} onRun={onRun} showDropzone accept={tool.accept} onFilesSelected={setFile} file={file} onClear={() => setFile(null)} disabled={!file} />;
};

export default WordToPdf;
