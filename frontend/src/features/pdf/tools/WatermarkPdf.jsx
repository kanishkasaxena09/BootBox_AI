import React, { useState } from 'react';
import ToolView from './ToolView';
import { Columns } from 'lucide-react';

const tool = { id: 'watermark', name: 'Add Watermark', icon: Columns, desc: 'Stamp text or image watermarks onto your PDF pages with custom transparency and rotation.', accept: '.pdf', iconBg: 'bg-[#06b6d4]' };

const downloadBlob = (blob, filename) => {
  const url = window.URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  setTimeout(() => { document.body.removeChild(a); window.URL.revokeObjectURL(url); }, 5000);
};

const WatermarkPdf = ({ onBack }) => {
  const [file, setFile] = useState(null);
  const [watermarkText, setWatermarkText] = useState('CONFIDENTIAL');

  const onRun = async (setMsg) => {
    if (!file) throw new Error('Please select a file.');
    setMsg('Adding watermark...');
    const fd = new FormData();
    fd.append('pdfFile', file);
    fd.append('file', file);
    fd.append('watermarkText', watermarkText);
    const res = await fetch('/api/pdf/watermark', { method: 'POST', body: fd });
    if (!res.ok) { const e = await res.json().catch(() => ({})); throw new Error(e.error || 'Failed to add watermark.'); }
    downloadBlob(await res.blob(), 'bootbox-watermark.pdf');
  };

  return (
    <ToolView tool={tool} onBack={onBack} onRun={onRun} showDropzone accept={tool.accept} onFilesSelected={setFile} file={file} onClear={() => setFile(null)} disabled={!file}>
      <div>
        <label className="text-xs font-bold text-[var(--text-secondary)] block mb-1">Watermark Overlay Text</label>
        <input type="text" value={watermarkText} onChange={(e) => setWatermarkText(e.target.value)} className="w-full px-3 py-2 rounded-lg border border-[var(--border-color)] bg-[var(--input-bg)] text-sm focus:outline-none text-[var(--text-primary)]" />
      </div>
    </ToolView>
  );
};

export default WatermarkPdf;
