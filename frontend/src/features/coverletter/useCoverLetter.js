import { useState, useCallback } from 'react';
import { tones, lengths, generateCoverLetter, generateImprovements } from './mockData';

const HISTORY_KEY = 'solmates_coverletter_history';

const load = (key, fallback) => {
  try { const r = localStorage.getItem(key); return r ? JSON.parse(r) : fallback; }
  catch { return fallback; }
};

const save = (key, val) => {
  try { localStorage.setItem(key, JSON.stringify(val)); } catch {}
};

export const useCoverLetter = () => {
  const [company, setCompany] = useState('');
  const [role, setRole] = useState('');
  const [hiringManager, setHiringManager] = useState('');
  const [experience, setExperience] = useState('');
  const [skills, setSkills] = useState('');
  const [achievements, setAchievements] = useState('');
  const [tone, setTone] = useState('Professional');
  const [length, setLength] = useState('Standard (250-350 words)');
  const [output, setOutput] = useState('');
  const [generating, setGenerating] = useState(false);
  const [history, setHistory] = useState(() => load(HISTORY_KEY, []));
  const [showHistory, setShowHistory] = useState(false);
  const [improvements, setImprovements] = useState([]);

  const generate = useCallback(async () => {
    setGenerating(true);
    setImprovements([]);
    const fields = { company, role, hiringManager, experience, skills, achievements };
    const text = await generateCoverLetter(fields, tone, length);
    setOutput(text);
    setGenerating(false);
    const entry = {
      id: Date.now(),
      fields: { company, role, hiringManager, experience, skills, achievements },
      tone, length,
      output: text,
      date: new Date().toISOString(),
    };
    const next = [entry, ...history].slice(0, 50);
    setHistory(next);
    save(HISTORY_KEY, next);
  }, [company, role, hiringManager, experience, skills, achievements, tone, length, history]);

  const regenerate = useCallback(() => {
    generate();
  }, [generate]);

  const improve = useCallback(async () => {
    const imps = await generateImprovements(output);
    setImprovements(imps);
  }, [output]);

  const updateOutput = useCallback((text) => {
    setOutput(text);
  }, []);

  const copyToClipboard = useCallback(async () => {
    try { await navigator.clipboard.writeText(output); return true; }
    catch { return false; }
  }, [output]);

  const downloadPDF = useCallback(() => {
    import('jspdf').then(({ default: jsPDF }) => {
      const doc = new jsPDF('p', 'mm', 'a4');
      const pageW = 210;
      const margin = 25;
      const maxWidth = pageW - margin * 2;

      doc.setFont('helvetica', 'normal');
      doc.setFontSize(11);
      doc.setTextColor(30, 30, 30);

      const lines = doc.splitTextToSize(output, maxWidth);
      let y = margin;
      const lineHeight = 6;

      lines.forEach(line => {
        if (y > 275) {
          doc.addPage();
          y = margin;
        }
        doc.text(line, margin, y);
        y += lineHeight;
      });

      doc.save(`Cover_Letter_${role || 'Application'}.pdf`);
    });
  }, [output, role]);

  const downloadDOCX = useCallback(async () => {
    try {
      const { Document, Packer, Paragraph, TextRun, HeadingLevel } = await import('docx');
      const paragraphs = output.split('\n').map(line => {
        return new Paragraph({
          children: [new TextRun({ text: line, size: 22, font: 'Calibri' })],
          spacing: { after: 120 },
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
      a.download = `Cover_Letter_${role || 'Application'}.docx`;
      a.click();
      URL.revokeObjectURL(url);
    } catch {}
  }, [output, role]);

  const loadFromHistory = useCallback((entry) => {
    setCompany(entry.fields?.company || '');
    setRole(entry.fields?.role || '');
    setHiringManager(entry.fields?.hiringManager || '');
    setExperience(entry.fields?.experience || '');
    setSkills(entry.fields?.skills || '');
    setAchievements(entry.fields?.achievements || '');
    setTone(entry.tone || 'Professional');
    setLength(entry.length || 'Standard (250-350 words)');
    setOutput(entry.output);
    setImprovements([]);
    setShowHistory(false);
  }, []);

  const deleteEntry = useCallback((id) => {
    setHistory(prev => {
      const next = prev.filter(h => h.id !== id);
      save(HISTORY_KEY, next);
      return next;
    });
  }, []);

  const clearAll = useCallback(() => {
    setHistory([]);
    save(HISTORY_KEY, []);
  }, []);

  const resetForm = useCallback(() => {
    setCompany('');
    setRole('');
    setHiringManager('');
    setExperience('');
    setSkills('');
    setAchievements('');
    setTone('Professional');
    setLength('Standard (250-350 words)');
    setOutput('');
    setImprovements([]);
  }, []);

  return {
    tones, lengths,
    company, setCompany,
    role, setRole,
    hiringManager, setHiringManager,
    experience, setExperience,
    skills, setSkills,
    achievements, setAchievements,
    tone, setTone, length, setLength,
    output, generating, improvements, setImprovements,
    generate, regenerate, improve, updateOutput,
    copyToClipboard, downloadPDF, downloadDOCX,
    history, showHistory, setShowHistory,
    loadFromHistory, deleteEntry, clearAll, resetForm,
  };
};
