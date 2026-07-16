import React, { useState } from 'react';
import ToolView from './ToolView';
import { FileText } from 'lucide-react';

const tool = { id: 'html-to-pdf', name: 'HTML to PDF', icon: FileText, desc: 'Convert raw HTML code blocks directly to clear portable document format (PDF) pages.', accept: '.html', iconBg: 'bg-[#d946ef]' };

const downloadBlob = (blob, filename) => {
  const url = window.URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  setTimeout(() => { document.body.removeChild(a); window.URL.revokeObjectURL(url); }, 5000);
};

const HtmlToPdf = ({ onBack }) => {
  const [htmlContent, setHtmlContent] = useState('<h1>BootBox PDF Document</h1><p>Generated styled PDF from HTML markup.</p>');

  const onRun = async (setMsg) => {
    if (!htmlContent.trim()) throw new Error('Please enter HTML content.');
    setMsg('Converting HTML to PDF...');
    const fd = new FormData();
    const blob = new Blob([htmlContent], { type: 'text/html' });
    fd.append('file', blob, 'document.html');
    fd.append('fromType', 'html');
    fd.append('toType', 'pdf');
    const res = await fetch('/api/pdf/office-convert', { method: 'POST', body: fd });
    if (!res.ok) { const e = await res.json().catch(() => ({})); throw new Error(e.error || 'Failed to convert HTML to PDF.'); }
    downloadBlob(await res.blob(), 'bootbox-html-to-pdf.pdf');
  };

  return (
    <ToolView tool={tool} onBack={onBack} onRun={onRun} showDropzone={false} disabled={!htmlContent.trim()}>
      <div className="space-y-2">
        <label className="text-xs font-bold text-[var(--text-secondary)]">HTML Code String</label>
        <textarea value={htmlContent} onChange={(e) => setHtmlContent(e.target.value)} rows="6" className="w-full p-3 rounded-xl border border-[var(--border-color)] bg-[var(--input-bg)] text-xs font-mono focus:outline-none focus:ring-1 focus:ring-indigo-500 text-[var(--text-primary)]" />
      </div>
    </ToolView>
  );
};

export default HtmlToPdf;
