import React, { useState } from 'react';
import ToolView from './ToolView';
import { Sparkles } from 'lucide-react';

const tool = { id: 'summarizer', name: 'AI PDF Summarizer', icon: Sparkles, desc: 'Generate AI summary notes, key points, exam revision topics, or Q&A worksheets.', accept: '.pdf', iconBg: 'bg-[#7c3aed]' };

const AiSummarizer = ({ onBack }) => {
  const [file, setFile] = useState(null);
  const [summaryMode, setSummaryMode] = useState('detailed');

  const onRun = async (setMsg, setTextOutput) => {
    if (!file) throw new Error('Please select a file.');
    setMsg('Generating AI summary...');
    const fd = new FormData();
    fd.append('pdfFile', file);
    fd.append('file', file);
    fd.append('summaryMode', summaryMode);
    const res = await fetch('/api/pdf/summarizer', { method: 'POST', body: fd });
    if (!res.ok) { const e = await res.json().catch(() => ({})); throw new Error(e.error || 'Failed to generate summary.'); }
    const data = await res.json();
    setTextOutput(data.summary);
  };

  return (
    <ToolView tool={tool} onBack={onBack} onRun={onRun} showDropzone accept={tool.accept} onFilesSelected={setFile} file={file} onClear={() => setFile(null)} disabled={!file}>
      <div>
        <label className="text-xs font-bold text-[var(--text-secondary)] block mb-1">Select Summary Layout</label>
        <select value={summaryMode} onChange={(e) => setSummaryMode(e.target.value)} className="w-full p-2.5 rounded-lg border border-[var(--border-color)] bg-[var(--input-bg)] text-sm focus:outline-none text-[var(--text-primary)]">
          <option value="short">Brief Summary (Max 150 words)</option>
          <option value="detailed">In-Depth Detailed Analysis</option>
          <option value="key-points">Key Bulleted Points</option>
          <option value="study-notes">Academic Study Guide Notes</option>
          <option value="interview-notes">Key Takeaways &amp; Interview QA</option>
          <option value="exam-prep">Exam Syllabus Revision Outline</option>
        </select>
      </div>
    </ToolView>
  );
};

export default AiSummarizer;
