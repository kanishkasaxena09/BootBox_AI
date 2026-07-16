import React, { useState } from 'react';
import ToolView from './ToolView';
import { FileSpreadsheet } from 'lucide-react';

const tool = { id: 'excel-to-pdf', name: 'Excel to PDF', icon: FileSpreadsheet, desc: 'Make XLS and XLSX spreadsheets easy to read by converting them to clean PDF sheets.', accept: '.xlsx', iconBg: 'bg-[#16a34a]' };

const downloadBlob = (blob, filename) => {
  const url = window.URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  setTimeout(() => { document.body.removeChild(a); window.URL.revokeObjectURL(url); }, 5000);
};

const ExcelToPdf = ({ onBack }) => {
  const [file, setFile] = useState(null);

  const onRun = async (setMsg) => {
    if (!file) throw new Error('Please select a file.');
    setMsg('Converting Excel to PDF...');
    const fd = new FormData();
    fd.append('pdfFile', file);
    fd.append('file', file);
    fd.append('fromType', 'xlsx');
    fd.append('toType', 'pdf');
    const res = await fetch('/api/pdf/office-convert', { method: 'POST', body: fd });
    if (!res.ok) { const e = await res.json().catch(() => ({})); throw new Error(e.error || 'Failed to convert Excel to PDF.'); }
    downloadBlob(await res.blob(), 'bootbox-excel-to-pdf.pdf');
  };

  return <ToolView tool={tool} onBack={onBack} onRun={onRun} showDropzone accept={tool.accept} onFilesSelected={setFile} file={file} onClear={() => setFile(null)} disabled={!file} />;
};

export default ExcelToPdf;
