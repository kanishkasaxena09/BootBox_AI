import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Download, Share2, Save, FileText, Copy, Check } from 'lucide-react';
import { jsPDF } from 'jspdf';

export default function ExportPanel({ questions, setup, history }) {
  const [copied, setCopied] = useState(false);

  const downloadPdf = () => {
    const doc = new jsPDF();
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(18);
    doc.text('Interview Preparation Kit', 20, 20);
    doc.setFontSize(11);
    doc.setFont('helvetica', 'normal');
    doc.text(`Role: ${setup.role || 'N/A'}`, 20, 30);
    doc.text(`Type: ${setup.interviewType || 'N/A'} | Difficulty: ${setup.difficulty || 'N/A'}`, 20, 37);
    doc.text(`Questions: ${questions.length} | Generated: ${new Date().toLocaleDateString()}`, 20, 44);

    let y = 58;
    questions.forEach((q, i) => {
      if (y > 260) { doc.addPage(); y = 20; }

      doc.setFont('helvetica', 'bold');
      doc.setFontSize(11);
      doc.text(`${i + 1}. ${q.title}`, 20, y);
      y += 7;

      doc.setFont('helvetica', 'normal');
      doc.setFontSize(9);
      doc.text(`Category: ${q.category} | Difficulty: ${q.difficulty || 'Medium'}`, 20, y);
      y += 6;

      if (q.howToAnswer) {
        doc.setFont('helvetica', 'bold');
        doc.text('How to Answer:', 20, y);
        y += 5;
        doc.setFont('helvetica', 'normal');
        const howLines = doc.splitTextToSize(q.howToAnswer, 170);
        doc.text(howLines, 20, y);
        y += howLines.length * 4 + 3;
      }

      if (q.keyPoints?.length) {
        doc.setFont('helvetica', 'bold');
        doc.text('Key Points:', 20, y);
        y += 5;
        doc.setFont('helvetica', 'normal');
        q.keyPoints.forEach(p => {
          if (y > 270) { doc.addPage(); y = 20; }
          doc.text(`• ${p}`, 24, y);
          y += 4;
        });
        y += 3;
      }

      if (q.sampleAnswer) {
        doc.setFont('helvetica', 'bold');
        doc.text('Example Answer:', 20, y);
        y += 5;
        doc.setFont('helvetica', 'normal');
        const ansLines = doc.splitTextToSize(q.sampleAnswer, 170);
        doc.text(ansLines, 20, y);
        y += ansLines.length * 4 + 5;
      }

      y += 5;
    });

    doc.save(`interview-kit-${setup.role?.replace(/\s+/g, '-').toLowerCase() || 'export'}.pdf`);
  };

  const copySummary = () => {
    const summary = `Interview Kit: ${setup.role || 'N/A'}\nType: ${setup.interviewType} | Difficulty: ${setup.difficulty}\nQuestions: ${questions.length}\n\n` +
      questions.map((q, i) => `${i + 1}. ${q.title}\n   Category: ${q.category}\n   ${q.howToAnswer || ''}\n`).join('\n');
    navigator.clipboard?.writeText(summary).catch(() => {});
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };

  return (
    <div className="glass-panel rounded-2xl p-4 border border-[var(--border)] space-y-3">
      <h4 className="text-xs font-bold text-[var(--text-primary)] flex items-center gap-2">
        <FileText className="w-4 h-4 text-pink-500" /> Export Options
      </h4>
      <div className="grid grid-cols-2 gap-2">
        <motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}
          onClick={downloadPdf}
          className="flex items-center justify-center gap-1.5 px-3 py-2.5 rounded-xl bg-gradient-to-r from-pink-500 to-rose-500 text-white text-[11px] font-bold shadow-lg shadow-pink-500/20">
          <Download className="w-3.5 h-3.5" /> Download PDF
        </motion.button>
        <motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}
          onClick={copySummary}
          className="flex items-center justify-center gap-1.5 px-3 py-2.5 rounded-xl bg-[var(--bg-secondary)] border border-[var(--border)] text-[var(--text-primary)] text-[11px] font-bold">
          {copied ? <Check className="w-3.5 h-3.5 text-emerald-500" /> : <Copy className="w-3.5 h-3.5" />}
          {copied ? 'Copied!' : 'Copy Summary'}
        </motion.button>
      </div>
    </div>
  );
}
