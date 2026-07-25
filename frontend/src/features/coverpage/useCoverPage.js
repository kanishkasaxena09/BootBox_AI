import { useState, useCallback } from 'react';
import { TEMPLATES } from './templates';

const STORAGE_KEY = 'coverpageHistory';

function loadHistory() {
  try { return JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]'); } catch { return []; }
}

export default function useCoverPage() {
  const [fields, setFields] = useState({
    studentName: '', college: '', university: '', subject: '', course: '',
    semester: '', faculty: '', assignmentTitle: '', rollNumber: '',
    submissionDate: '', guideName: '',
  });
  const [template, setTemplate] = useState('modern');
  const [logoFile, setLogoFile] = useState(null);
  const [logoDataUrl, setLogoDataUrl] = useState(null);
  const [history, setHistory] = useState(loadHistory);
  const [exporting, setExporting] = useState(false);

  const updateField = useCallback((key, value) => {
    setFields(prev => ({ ...prev, [key]: value }));
  }, []);

  const resetForm = useCallback(() => {
    setFields({
      studentName: '', college: '', university: '', subject: '', course: '',
      semester: '', faculty: '', assignmentTitle: '', rollNumber: '',
      submissionDate: '', guideName: '',
    });
    setLogoFile(null);
    setLogoDataUrl(null);
  }, []);

  const handleLogoUpload = useCallback((file) => {
    if (!file) { setLogoFile(null); setLogoDataUrl(null); return; }
    setLogoFile(file);
    const reader = new FileReader();
    reader.onload = (e) => setLogoDataUrl(e.target.result);
    reader.readAsDataURL(file);
  }, []);

  const saveHistory = useCallback(() => {
    const entry = { ...fields, template, date: new Date().toISOString() };
    const updated = [entry, ...history].slice(0, 20);
    setHistory(updated);
    try { localStorage.setItem(STORAGE_KEY, JSON.stringify(updated)); } catch {}
  }, [fields, template, history]);

  const loadHistoryEntry = useCallback((entry) => {
    const { date, ...rest } = entry;
    setFields({
      studentName: rest.studentName || '', college: rest.college || '', university: rest.university || '',
      subject: rest.subject || '', course: rest.course || '', semester: rest.semester || '',
      faculty: rest.faculty || '', assignmentTitle: rest.assignmentTitle || '',
      rollNumber: rest.rollNumber || '', submissionDate: rest.submissionDate || '', guideName: rest.guideName || '',
    });
    setTemplate(rest.template || 'modern');
  }, []);

  const clearHistory = useCallback(() => {
    setHistory([]);
    try { localStorage.removeItem(STORAGE_KEY); } catch {}
  }, []);

  const downloadPdf = useCallback(async (previewRef) => {
    if (!previewRef.current) return;
    setExporting(true);
    try {
      const html2canvas = (await import('html2canvas')).default;
      const { jsPDF } = await import('jspdf');
      const el = previewRef.current;
      const prevTransform = el.style.transform;
      const prevMargin = el.style.marginBottom;
      el.style.transform = 'none';
      el.style.marginBottom = '0';
      const canvas = await html2canvas(el, { scale: 2, useCORS: true, backgroundColor: '#ffffff' });
      el.style.transform = prevTransform;
      el.style.marginBottom = prevMargin;
      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF('p', 'pt', 'a4');
      const pdfW = pdf.internal.pageSize.getWidth();
      const pdfH = pdf.internal.pageSize.getHeight();
      pdf.addImage(imgData, 'PNG', 0, 0, pdfW, pdfH);
      const name = fields.assignmentTitle ? fields.assignmentTitle.replace(/[^a-zA-Z0-9]/g, '_') : 'cover_page';
      pdf.save(`${name}.pdf`);
      saveHistory();
    } catch (err) {
      console.error('PDF export error:', err);
    } finally {
      setExporting(false);
    }
  }, [fields.assignmentTitle, saveHistory]);

  const downloadDocx = useCallback(async () => {
    setExporting(true);
    try {
      const { Document, Packer, Paragraph, TextRun, AlignmentType, HeadingLevel, BorderStyle, TableRow, TableCell, Table, WidthType } = await import('docx');
      const noBorder = { style: BorderStyle.NONE, size: 0 };

      const children = [];

      if (fields.assignmentTitle) {
        children.push(new Paragraph({ alignment: AlignmentType.CENTER, spacing: { after: 100 }, children: [
          new TextRun({ text: fields.assignmentTitle, bold: true, size: 28, font: 'Calibri' }),
        ]}));
      }
      if (fields.subject) {
        children.push(new Paragraph({ alignment: AlignmentType.CENTER, spacing: { after: 300 }, children: [
          new TextRun({ text: fields.subject, size: 22, color: '666666', font: 'Calibri' }),
        ]}));
      }

      children.push(new Paragraph({ spacing: { before: 200, after: 100 }, children: [] }));

      const rows = [
        ['Student Name', fields.studentName],
        ['Roll Number', fields.rollNumber],
        ['Course', fields.course],
        ['Semester', fields.semester],
        ['Subject', fields.subject],
        ['Faculty', fields.faculty],
        ['Guide', fields.guideName],
        ['College', fields.college],
        ['University', fields.university],
      ].filter(([, v]) => v);

      if (rows.length > 0) {
        children.push(new Table({
          rows: rows.map(([label, value]) => new TableRow({
            children: [
              new TableCell({ width: { size: 30, type: WidthType.PERCENTAGE }, borders: { top: noBorder, bottom: noBorder, left: noBorder, right: noBorder }, children: [
                new Paragraph({ children: [new TextRun({ text: label, bold: true, size: 20, color: '666666', font: 'Calibri' })] }),
              ]}),
              new TableCell({ width: { size: 70, type: WidthType.PERCENTAGE }, borders: { top: noBorder, bottom: { style: BorderStyle.SINGLE, size: 1, color: 'DDDDDD' }, left: noBorder, right: noBorder }, children: [
                new Paragraph({ children: [new TextRun({ text: value, size: 20, font: 'Calibri' })] }),
              ]}),
            ],
          })),
        }));
      }

      if (fields.submissionDate) {
        children.push(new Paragraph({ alignment: AlignmentType.RIGHT, spacing: { before: 400 }, children: [
          new TextRun({ text: `Date: ${new Date(fields.submissionDate).toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' })}`, size: 18, color: '999999', font: 'Calibri' }),
        ]}));
      }

      const doc = new Document({
        sections: [{
          properties: { page: { margin: { top: 1440, bottom: 1440, left: 1440, right: 1440 } } },
          children,
        }],
      });

      const blob = await Packer.toBlob(doc);
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      const name = fields.assignmentTitle ? fields.assignmentTitle.replace(/[^a-zA-Z0-9]/g, '_') : 'cover_page';
      a.download = `${name}.docx`;
      a.click();
      URL.revokeObjectURL(url);
      saveHistory();
    } catch (err) {
      console.error('DOCX export error:', err);
    } finally {
      setExporting(false);
    }
  }, [fields, saveHistory]);

  return {
    fields, updateField, resetForm,
    template, setTemplate, templates: TEMPLATES,
    logoFile, logoDataUrl, handleLogoUpload,
    history, saveHistory, loadHistoryEntry, clearHistory,
    exporting, downloadPdf, downloadDocx,
  };
}
