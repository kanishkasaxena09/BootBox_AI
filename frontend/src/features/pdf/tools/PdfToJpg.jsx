import React, { useState } from 'react';
import ToolView from './ToolView';
import { Image } from 'lucide-react';

const tool = { id: 'pdf-to-jpg', name: 'PDF to JPG', icon: Image, desc: 'Convert each page of a PDF document into a high resolution JPEG image file.', accept: '.pdf', iconBg: 'bg-[#8b5cf6]' };

const downloadBlob = (blob, filename) => {
  const url = window.URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  setTimeout(() => { document.body.removeChild(a); window.URL.revokeObjectURL(url); }, 5000);
};

const PdfToJpg = ({ onBack }) => {
  const [file, setFile] = useState(null);

  const onRun = async (setMsg) => {
    if (!file) throw new Error('Please select a file.');
    setMsg('Converting PDF to JPG...');
    const fd = new FormData();
    fd.append('pdfFile', file);
    fd.append('file', file);
    const res = await fetch('/api/pdf/pdf-to-jpg', { method: 'POST', body: fd });
    if (!res.ok) { const e = await res.json().catch(() => ({})); throw new Error(e.error || 'Failed to convert PDF to JPG.'); }
    downloadBlob(await res.blob(), 'bootbox-pdf-to-jpg.jpg');
  };

  return <ToolView tool={tool} onBack={onBack} onRun={onRun} showDropzone accept={tool.accept} onFilesSelected={setFile} file={file} onClear={() => setFile(null)} disabled={!file} />;
};

export default PdfToJpg;
