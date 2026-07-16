import React, { useState } from 'react';
import ToolView from './ToolView';
import { FolderArchive } from 'lucide-react';

const tool = { id: 'zip-to-pdf', name: 'Zip Converter', icon: FolderArchive, desc: 'Bundle any number of files of any format into a single, compressed ZIP archive instantly.', accept: '.zip', iconBg: 'bg-[#6366f1]' };

const downloadBlob = (blob, filename) => {
  const url = window.URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  setTimeout(() => { document.body.removeChild(a); window.URL.revokeObjectURL(url); }, 5000);
};

const ZipConverter = ({ onBack }) => {
  const [file, setFile] = useState(null);

  const onRun = async (setMsg) => {
    if (!file) throw new Error('Please select a file.');
    setMsg('Converting ZIP...');
    const fd = new FormData();
    fd.append('pdfFile', file);
    fd.append('file', file);
    const res = await fetch('/api/pdf/zip-to-pdf', { method: 'POST', body: fd });
    if (!res.ok) { const e = await res.json().catch(() => ({})); throw new Error(e.error || 'Failed to convert ZIP.'); }
    downloadBlob(await res.blob(), 'bootbox-zip-to-pdf.pdf');
  };

  return <ToolView tool={tool} onBack={onBack} onRun={onRun} showDropzone accept={tool.accept} onFilesSelected={setFile} file={file} onClear={() => setFile(null)} disabled={!file} />;
};

export default ZipConverter;
