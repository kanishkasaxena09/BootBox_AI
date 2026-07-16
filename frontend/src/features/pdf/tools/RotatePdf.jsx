import React, { useState } from 'react';
import ToolView from './ToolView';
import { RotateCw } from 'lucide-react';

const tool = { id: 'rotate', name: 'Rotate PDF', icon: RotateCw, desc: 'Rotate single or multiple PDF pages to portrait or landscape orientations easily.', accept: '.pdf', iconBg: 'bg-[#14b8a6]' };

const downloadBlob = (blob, filename) => {
  const url = window.URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  setTimeout(() => { document.body.removeChild(a); window.URL.revokeObjectURL(url); }, 5000);
};

const RotatePdf = ({ onBack }) => {
  const [file, setFile] = useState(null);
  const [rotateAngle, setRotateAngle] = useState(90);

  const onRun = async (setMsg) => {
    if (!file) throw new Error('Please select a file.');
    setMsg('Rotating PDF...');
    const fd = new FormData();
    fd.append('pdfFile', file);
    fd.append('file', file);
    fd.append('angle', rotateAngle);
    const res = await fetch('/api/pdf/rotate', { method: 'POST', body: fd });
    if (!res.ok) { const e = await res.json().catch(() => ({})); throw new Error(e.error || 'Failed to rotate PDF.'); }
    downloadBlob(await res.blob(), 'bootbox-rotate.pdf');
  };

  return (
    <ToolView tool={tool} onBack={onBack} onRun={onRun} showDropzone accept={tool.accept} onFilesSelected={setFile} file={file} onClear={() => setFile(null)} disabled={!file}>
      <div>
        <label className="text-xs font-bold text-[var(--text-secondary)] block mb-2">Rotation Angle (Clockwise)</label>
        <div className="grid grid-cols-3 gap-3">
          {[90, 180, 270].map((angle) => (
            <button key={angle} onClick={() => setRotateAngle(angle)} className={`py-2 rounded-lg text-xs font-semibold border transition-all ${rotateAngle === angle ? 'border-pink-500 bg-pink-500/10 text-pink-600' : 'border-[var(--border-color)] text-[var(--text-secondary)] hover:text-pink-600'}`}>
              {angle}°
            </button>
          ))}
        </div>
      </div>
    </ToolView>
  );
};

export default RotatePdf;
