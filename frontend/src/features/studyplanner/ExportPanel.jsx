import React, { useState } from 'react';
import { FileText, FileSpreadsheet, Printer, Share2 } from 'lucide-react';
import { Button } from '../../components/shared';

const ExportPanel = ({ stats, assignments, exams, goals, subjects }) => {
  const [exporting, setExporting] = useState(null);

  const exportPDF = async () => {
    setExporting('pdf');
    try {
      const { jsPDF } = await import('jspdf');
      const doc = new jsPDF();
      doc.setFontSize(20);
      doc.text('Study Planner Report', 20, 20);
      doc.setFontSize(12);
      doc.text(`Generated: ${new Date().toLocaleDateString()}`, 20, 30);

      let y = 45;
      doc.setFontSize(14); doc.text('Summary', 20, y); y += 10;
      doc.setFontSize(10);
      doc.text(`Total Assignments: ${stats.totalAssignments}`, 20, y); y += 7;
      doc.text(`Completed: ${stats.completedAssignments}`, 20, y); y += 7;
      doc.text(`Today's Study: ${stats.todayMinutes} min`, 20, y); y += 7;
      doc.text(`Total Study: ${stats.totalMinutes} min`, 20, y); y += 7;
      doc.text(`Goals: ${stats.completedGoals}/${stats.totalGoals}`, 20, y); y += 7;
      doc.text(`Streak: ${stats.streaks?.current || 0} days`, 20, y); y += 12;

      doc.setFontSize(14); doc.text('Assignments', 20, y); y += 10;
      doc.setFontSize(9);
      assignments.slice(0, 15).forEach(a => {
        if (y > 270) { doc.addPage(); y = 20; }
        doc.text(`[${a.status}] ${a.name} - ${a.deadline || 'No deadline'}`, 20, y); y += 6;
      });
      y += 8;

      if (exams.length > 0) {
        doc.setFontSize(14); doc.text('Exams', 20, y); y += 10;
        doc.setFontSize(9);
        exams.forEach(e => {
          if (y > 270) { doc.addPage(); y = 20; }
          doc.text(`${e.name} - ${e.date} ${e.time || ''}`, 20, y); y += 6;
        });
      }

      doc.save('study_planner_report.pdf');
    } catch (err) { console.error('PDF export error:', err); }
    setExporting(null);
  };

  const exportCSV = () => {
    setExporting('csv');
    const rows = [['Type', 'Name', 'Subject', 'Status', 'Priority', 'Deadline']];
    assignments.forEach(a => rows.push(['Assignment', a.name, a.subject, a.status, a.priority, a.deadline]));
    exams.forEach(e => rows.push(['Exam', e.name, e.subject, '', e.priority, e.date]));
    goals.forEach(g => rows.push(['Goal', g.title, '', g.completed ? 'done' : 'pending', g.priority, g.deadline]));
    const csv = rows.map(r => r.map(c => `"${c || ''}"`).join(',')).join('\n');
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a'); a.href = url; a.download = 'study_planner.csv'; a.click();
    URL.revokeObjectURL(url);
    setExporting(null);
  };

  const printView = () => { setExporting('print'); window.print(); setExporting(null); };

  const shareData = async () => {
    setExporting('share');
    const text = `Study Planner Summary\nAssignments: ${stats.completedAssignments}/${stats.totalAssignments} completed\nStudy: ${stats.todayMinutes} min today\nStreak: ${stats.streaks?.current || 0} days`;
    if (navigator.share) { try { await navigator.share({ title: 'Study Planner', text }); } catch {} }
    else { navigator.clipboard?.writeText(text); }
    setExporting(null);
  };

  return (
    <div className="flex items-center gap-2 flex-wrap">
      <Button variant="secondary" size="sm" icon={FileText} loading={exporting === 'pdf'} onClick={exportPDF}>PDF</Button>
      <Button variant="secondary" size="sm" icon={FileSpreadsheet} loading={exporting === 'csv'} onClick={exportCSV}>Excel</Button>
      <Button variant="secondary" size="sm" icon={Printer} onClick={printView}>Print</Button>
      <Button variant="secondary" size="sm" icon={Share2} onClick={shareData}>Share</Button>
    </div>
  );
};

export default ExportPanel;
