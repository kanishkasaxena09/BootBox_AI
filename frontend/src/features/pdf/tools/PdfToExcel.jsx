import React, { useState } from 'react';
import ToolView from './ToolView';
import { FileSpreadsheet } from 'lucide-react';

const tool = { id: 'pdf-to-excel', name: 'PDF to Excel', icon: FileSpreadsheet, desc: 'Extract and transfer tables from PDF documents directly to spreadsheet columns.', accept: '.pdf', iconBg: 'bg-[#059669]' };

const downloadBlob = (blob, filename) => {
  const url = window.URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  setTimeout(() => { document.body.removeChild(a); window.URL.revokeObjectURL(url); }, 5000);
};

const PdfToExcel = ({ onBack }) => {
  const [file, setFile] = useState(null);

  const onRun = async (setMsg) => {
    if (!file) throw new Error('Please select a file.');
    setMsg('Converting PDF to Excel...');
    const fd = new FormData();
    fd.append('pdfFile', file);
    fd.append('file', file);
    fd.append('fromType', 'pdf');
    fd.append('toType', 'xlsx');
    const res = await fetch('/api/pdf/office-convert', { method: 'POST', body: fd });
    if (!res.ok) { const e = await res.json().catch(() => ({})); throw new Error(e.error || 'Failed to convert PDF to Excel.'); }
    downloadBlob(await res.blob(), 'bootbox-pdf-to-excel.xlsx');
  };

  return <ToolView tool={tool} onBack={onBack} onRun={onRun} showDropzone accept={tool.accept} onFilesSelected={setFile} file={file} onClear={() => setFile(null)} disabled={!file} />;
};

export default PdfToExcel;
