import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  FileText, Mail, Send, BookOpen, ListChecks, Package, ClipboardCheck,
  Download, RotateCcw, Copy, Check, Plus, Trash2, ChevronDown, CheckCircle2,
  Circle, Briefcase, User, Building2, Calendar, Hash, MessageSquare,
} from 'lucide-react';
import useResignation from './useResignation';
import { docTabs } from './mockData';

const fadeUp = { initial: { opacity: 0, y: 10 }, animate: { opacity: 1, y: 0 }, transition: { duration: 0.2 } };

const tabIcons = { FileText, Mail, Send, BookOpen, ListChecks, Package, ClipboardCheck };

const Input = ({ icon: Icon, label, value, onChange, placeholder, type = 'text', multiline }) => (
  <div className="space-y-1">
    <label className="text-[10px] font-bold uppercase tracking-wider text-[var(--text-secondary)] flex items-center gap-1.5">
      {Icon && <Icon className="w-3 h-3" />} {label}
    </label>
    {multiline ? (
      <textarea value={value} onChange={e => onChange(e.target.value)} placeholder={placeholder} rows={3}
        className="w-full px-3 py-2 rounded-xl text-xs font-medium resize-none outline-none
          bg-[var(--bg-secondary)] border border-[var(--border)] text-[var(--text-primary)]
          hover:border-[var(--accent)] focus:border-[var(--accent)] focus:ring-2 focus:ring-[var(--accent)]/20 transition-all" />
    ) : (
      <input type={type} value={value} onChange={e => onChange(e.target.value)} placeholder={placeholder}
        className="w-full px-3 py-2 rounded-xl text-xs font-medium outline-none
          bg-[var(--bg-secondary)] border border-[var(--border)] text-[var(--text-primary)]
          hover:border-[var(--accent)] focus:border-[var(--accent)] focus:ring-2 focus:ring-[var(--accent)]/20 transition-all" />
    )}
  </div>
);

export default function ResignationGenerator() {
  const h = useResignation();
  const [copied, setCopied] = useState(false);
  const [output, setOutput] = useState('');

  useEffect(() => {
    let cancelled = false;
    h.getOutput().then(text => { if (!cancelled) setOutput(text || ''); });
    return () => { cancelled = true; };
  }, [h.getOutput]);

  const copy = (text) => {
    navigator.clipboard?.writeText(text).catch(() => {});
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };

  const downloadDOCX = async () => {
    try {
      const { Document, Packer, Paragraph, TextRun } = await import('docx');
      const lines = output.split('\n');
      const paragraphs = lines.map(line => {
        const isHeading = /^(═|SUBJECT|KNOWLEDGE|TASK|ASSET|EXIT|SUMMARY|TOTAL|PROGRESS|EMPLOYEE|PREPARED)/i.test(line);
        const isEmpty = line.trim() === '';
        return new Paragraph({
          children: [new TextRun({ text: line, bold: isHeading && !isEmpty, size: isHeading ? 24 : 22, font: 'Calibri' })],
          spacing: { after: isEmpty ? 0 : 120 },
        });
      });
      const doc = new Document({
        sections: [{
          properties: { page: { margin: { top: 1440, right: 1440, bottom: 1440, left: 1440 } } },
          children: paragraphs,
        }],
      });
      const blob = await Packer.toBlob(doc);
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `${h.activeDoc}_${h.inputs.fullName || 'document'}.docx`;
      a.click();
      URL.revokeObjectURL(url);
    } catch {}
  };

  const downloadPDF = async () => {
    try {
      const { default: jsPDF } = await import('jspdf');
      const doc = new jsPDF('p', 'mm', 'a4');
      const w = doc.internal.pageSize.getWidth();
      let y = 20;

      doc.setFillColor(15, 15, 25);
      doc.rect(0, 0, w, doc.internal.pageSize.getHeight(), 'F');

      doc.setFont('helvetica', 'bold');
      doc.setFontSize(16);
      doc.setTextColor(99, 102, 241);
      doc.text(h.activeDoc.replace(/([A-Z])/g, ' $1').replace(/^./, s => s.toUpperCase()), w / 2, y, { align: 'center' });
      y += 8;

      doc.setFontSize(9);
      doc.setTextColor(150, 150, 170);
      doc.text(h.inputs.fullName || '', w / 2, y, { align: 'center' });
      y += 10;

      doc.setFont('helvetica', 'normal');
      doc.setFontSize(9);
      doc.setTextColor(200, 200, 210);

      const lines = doc.splitTextToSize(output, w - 40);
      lines.forEach(line => {
        if (y > 275) { doc.addPage(); y = 20; doc.setFillColor(15, 15, 25); doc.rect(0, 0, w, doc.internal.pageSize.getHeight(), 'F'); }
        const isBold = /^(═|SUBJECT|KNOWLEDGE|TASK|ASSET|EXIT|SUMMARY|Total|Pending|In Progress|Completed|Employee|Prepared|Date:|Last Working)/i.test(line) && line.trim().length > 0;
        doc.setFont('helvetica', isBold ? 'bold' : 'normal');
        doc.text(line, 20, y);
        y += 4.5;
      });

      doc.save(`${h.activeDoc}_${h.inputs.fullName || 'document'}.pdf`);
    } catch {}
  };

  const renderInputPanel = () => {
    if (h.activeDoc === 'handover') return renderTaskEditor();
    if (h.activeDoc === 'assets') return renderAssetEditor();
    if (h.activeDoc === 'exit') return renderExitEditor();
    return renderGeneralInputs();
  };

  const renderGeneralInputs = () => (
    <div className="space-y-3">
      <Input icon={User} label="Full Name" value={h.inputs.fullName} onChange={v => h.updateInput('fullName', v)} placeholder="John Doe" />
      <Input icon={Hash} label="Employee ID" value={h.inputs.employeeId} onChange={v => h.updateInput('employeeId', v)} placeholder="EMP001" />
      <Input icon={Briefcase} label="Designation" value={h.inputs.designation} onChange={v => h.updateInput('designation', v)} placeholder="Software Engineer" />
      <Input icon={Building2} label="Department" value={h.inputs.department} onChange={v => h.updateInput('department', v)} placeholder="Engineering" />
      <Input icon={User} label="Company" value={h.inputs.company} onChange={v => h.updateInput('company', v)} placeholder="TechCorp India" />
      <Input icon={User} label="Manager Name" value={h.inputs.managerName} onChange={v => h.updateInput('managerName', v)} placeholder="Jane Smith" />
      <Input icon={Mail} label="Manager Email" value={h.inputs.managerEmail} onChange={v => h.updateInput('managerEmail', v)} placeholder="manager@company.com" type="email" />
      <Input icon={Mail} label="HR Email" value={h.inputs.hrEmail} onChange={v => h.updateInput('hrEmail', v)} placeholder="hr@company.com" type="email" />
      <Input icon={Calendar} label="Last Working Day" value={h.inputs.lastWorkingDay} onChange={v => h.updateInput('lastWorkingDay', v)} type="date" />
      <Input icon={Calendar} label="Joining Date" value={h.inputs.joiningDate} onChange={v => h.updateInput('joiningDate', v)} type="date" />
      <Input icon={MessageSquare} label="Reason (optional)" value={h.inputs.reason} onChange={v => h.updateInput('reason', v)} placeholder="Personal growth opportunity..." multiline />
      {(h.activeDoc === 'manager' || h.activeDoc === 'knowledge') && (
        <Input icon={MessageSquare} label="Handover Notes" value={h.inputs.handoverNotes} onChange={v => h.updateInput('handoverNotes', v)} placeholder="Key details about ongoing projects, transitions..." multiline />
      )}
    </div>
  );

  const renderTaskEditor = () => (
    <div className="space-y-3">
      <div className="space-y-1">
        <label className="text-[10px] font-bold uppercase tracking-wider text-[var(--text-secondary)] flex items-center gap-1.5">
          <User className="w-3 h-3" /> Your Details
        </label>
        <div className="grid grid-cols-2 gap-2">
          <Input label="Name" value={h.inputs.fullName} onChange={v => h.updateInput('fullName', v)} placeholder="John Doe" />
          <Input label="Last Day" value={h.inputs.lastWorkingDay} onChange={v => h.updateInput('lastWorkingDay', v)} type="date" />
        </div>
      </div>
      <div className="h-px bg-[var(--border)]" />
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <span className="text-[10px] font-bold uppercase tracking-wider text-[var(--text-secondary)]">Tasks</span>
          <button onClick={h.addTask} className="text-[10px] font-bold text-[var(--accent)] hover:underline flex items-center gap-1">
            <Plus className="w-3 h-3" /> Add Task
          </button>
        </div>
        {h.tasks.map((task, i) => (
          <div key={task.id} className="p-3 rounded-xl bg-[var(--bg-secondary)] border border-[var(--border)] space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-bold text-[var(--text-secondary)]">#{i + 1}</span>
              <button onClick={() => h.removeTask(task.id)} className="p-1 rounded-lg text-red-400 hover:bg-red-500/10 transition-all">
                <Trash2 className="w-3 h-3" />
              </button>
            </div>
            <Input label="Task" value={task.task} onChange={v => h.updateTask(task.id, 'task', v)} placeholder="Describe the task..." />
            <div className="grid grid-cols-2 gap-2">
              <div className="space-y-1">
                <label className="text-[10px] font-bold uppercase tracking-wider text-[var(--text-secondary)]">Status</label>
                <select value={task.status} onChange={e => h.updateTask(task.id, 'status', e.target.value)}
                  className="w-full px-3 py-2 rounded-xl text-xs font-medium appearance-none cursor-pointer outline-none
                    bg-[var(--bg-secondary)] border border-[var(--border)] text-[var(--text-primary)]">
                  <option value="Pending">Pending</option>
                  <option value="In Progress">In Progress</option>
                  <option value="Completed">Completed</option>
                </select>
              </div>
              <Input label="Assignee" value={task.assignee} onChange={v => h.updateTask(task.id, 'assignee', v)} placeholder="Team member" />
            </div>
            <Input label="Deadline" value={task.deadline} onChange={v => h.updateTask(task.id, 'deadline', v)} type="date" />
          </div>
        ))}
      </div>
    </div>
  );

  const renderAssetEditor = () => (
    <div className="space-y-3">
      <div className="space-y-1">
        <label className="text-[10px] font-bold uppercase tracking-wider text-[var(--text-secondary)] flex items-center gap-1.5">
          <User className="w-3 h-3" /> Your Details
        </label>
        <div className="grid grid-cols-2 gap-2">
          <Input label="Name" value={h.inputs.fullName} onChange={v => h.updateInput('fullName', v)} placeholder="John Doe" />
          <Input label="Employee ID" value={h.inputs.employeeId} onChange={v => h.updateInput('employeeId', v)} placeholder="EMP001" />
        </div>
        <Input label="Department" value={h.inputs.department} onChange={v => h.updateInput('department', v)} placeholder="Engineering" />
      </div>
      <div className="h-px bg-[var(--border)]" />
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <span className="text-[10px] font-bold uppercase tracking-wider text-[var(--text-secondary)]">Assets</span>
          <button onClick={h.addAsset} className="text-[10px] font-bold text-[var(--accent)] hover:underline flex items-center gap-1">
            <Plus className="w-3 h-3" /> Add Asset
          </button>
        </div>
        {h.assets.map((asset, i) => (
          <div key={asset.id} className="flex items-center gap-2 p-3 rounded-xl bg-[var(--bg-secondary)] border border-[var(--border)]">
            <button onClick={() => h.toggleAssetReturned(asset.id)}
              className={`p-1.5 rounded-lg transition-all ${asset.returned ? 'bg-emerald-500/20 text-emerald-400' : 'bg-[var(--bg-primary)] text-[var(--text-secondary)]'}`}>
              {asset.returned ? <CheckCircle2 className="w-4 h-4" /> : <Circle className="w-4 h-4" />}
            </button>
            <div className="flex-1 min-w-0 space-y-1">
              <input value={asset.item} onChange={e => h.updateAsset(asset.id, 'item', e.target.value)}
                placeholder="Asset name" className="w-full text-xs font-bold bg-transparent outline-none text-[var(--text-primary)]" />
              <input value={asset.serial} onChange={e => h.updateAsset(asset.id, 'serial', e.target.value)}
                placeholder="Serial number" className="w-full text-[10px] bg-transparent outline-none text-[var(--text-secondary)]" />
            </div>
            <button onClick={() => h.removeAsset(asset.id)} className="p-1.5 rounded-lg text-red-400 hover:bg-red-500/10 transition-all">
              <Trash2 className="w-3 h-3" />
            </button>
          </div>
        ))}
      </div>
    </div>
  );

  const renderExitEditor = () => (
    <div className="space-y-3">
      <div className="space-y-1">
        <label className="text-[10px] font-bold uppercase tracking-wider text-[var(--text-secondary)] flex items-center gap-1.5">
          <User className="w-3 h-3" /> Your Details
        </label>
        <div className="grid grid-cols-2 gap-2">
          <Input label="Name" value={h.inputs.fullName} onChange={v => h.updateInput('fullName', v)} placeholder="John Doe" />
          <Input label="Employee ID" value={h.inputs.employeeId} onChange={v => h.updateInput('employeeId', v)} placeholder="EMP001" />
        </div>
        <Input label="Last Working Day" value={h.inputs.lastWorkingDay} onChange={v => h.updateInput('lastWorkingDay', v)} type="date" />
      </div>
      <div className="h-px bg-[var(--border)]" />
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <span className="text-[10px] font-bold uppercase tracking-wider text-[var(--text-secondary)]">
            Exit Items ({h.exitChecklist.filter(c => c.done).length}/{h.exitChecklist.length})
          </span>
        </div>
        {h.exitChecklist.map((item) => (
          <button key={item.id} onClick={() => h.toggleExitItem(item.id)}
            className={`w-full flex items-center gap-3 p-3 rounded-xl border text-left transition-all
              ${item.done
                ? 'bg-emerald-500/5 border-emerald-500/30'
                : 'bg-[var(--bg-secondary)] border-[var(--border)] hover:border-[var(--accent)]/30'
              }`}>
            {item.done ? (
              <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
            ) : (
              <Circle className="w-4 h-4 text-[var(--text-secondary)] shrink-0" />
            )}
            <span className={`text-xs font-medium ${item.done ? 'text-emerald-300 line-through' : 'text-[var(--text-primary)]'}`}>
              {item.item}
            </span>
          </button>
        ))}
      </div>
    </div>
  );

  return (
    <div className="space-y-4">
      <div className="text-center space-y-2">
        <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-gradient-to-br from-rose-500/20 to-red-500/20 border border-rose-500/30">
          <FileText className="w-7 h-7 text-rose-400" />
        </div>
        <h1 className="text-3xl font-black bg-gradient-to-r from-rose-400 via-red-400 to-pink-400 bg-clip-text text-transparent">
          Resignation & Handover
        </h1>
        <p className="text-sm text-[var(--text-secondary)] max-w-md mx-auto">
          Generate resignation letters, notice mails, knowledge transfer docs & checklists.
        </p>
      </div>

      <div className="glass-panel rounded-2xl p-1.5 border border-[var(--border)] overflow-x-auto">
        <div className="flex items-center gap-1 min-w-max">
          {docTabs.map(tab => {
            const Icon = tabIcons[tab.icon] || FileText;
            return (
              <button key={tab.id} onClick={() => h.setActiveDoc(tab.id)}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition-all whitespace-nowrap
                  ${h.activeDoc === tab.id
                    ? 'bg-rose-500/15 text-rose-400'
                    : 'text-[var(--text-secondary)] hover:text-[var(--text-primary)]'}`}>
                <Icon className="w-3 h-3" />
                {tab.label}
              </button>
            );
          })}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
        <div className="lg:col-span-4 space-y-3">
          <div className="glass-panel rounded-2xl p-4 border border-[var(--border)] space-y-3">
            <h3 className="text-xs font-black uppercase tracking-wider text-[var(--text-secondary)]">
              {docTabs.find(t => t.id === h.activeDoc)?.label} — Inputs
            </h3>
            <AnimatePresence mode="wait">
              <motion.div key={h.activeDoc} {...fadeUp}>
                {renderInputPanel()}
              </motion.div>
            </AnimatePresence>
          </div>
        </div>

        <div className="lg:col-span-8 space-y-3">
          <div className="glass-panel rounded-2xl border border-[var(--border)] overflow-hidden">
            <div className="px-4 py-2.5 bg-[var(--bg-primary)] border-b border-[var(--border)] flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="flex gap-1.5">
                  <div className="w-2.5 h-2.5 rounded-full bg-red-500/60" />
                  <div className="w-2.5 h-2.5 rounded-full bg-amber-500/60" />
                  <div className="w-2.5 h-2.5 rounded-full bg-emerald-500/60" />
                </div>
                <span className="text-[10px] font-bold text-[var(--text-secondary)]">
                  {h.activeDoc}_{h.inputs.fullName || 'document'}.txt
                </span>
              </div>
              <div className="flex items-center gap-1.5">
                <button onClick={() => copy(output)}
                  className="flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-bold text-[var(--accent)] hover:bg-[var(--accent)]/10 transition-all">
                  {copied ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                  {copied ? 'Copied!' : 'Copy'}
                </button>
                <button onClick={downloadDOCX}
                  className="flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-bold text-blue-400 hover:bg-blue-500/10 transition-all">
                  <Download className="w-3 h-3" /> DOCX
                </button>
                <button onClick={downloadPDF}
                  className="flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-bold text-rose-400 hover:bg-rose-500/10 transition-all">
                  <Download className="w-3 h-3" /> PDF
                </button>
              </div>
            </div>
            <div className="p-4 max-h-[500px] overflow-y-auto">
              <pre className="text-xs font-medium text-[var(--text-primary)] whitespace-pre-wrap leading-relaxed font-mono">{output}</pre>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
