import React from 'react';
import { motion } from 'framer-motion';
import { Trophy, TrendingUp, TrendingDown, AlertTriangle, Map, Download, RotateCcw, History, Star } from 'lucide-react';

const colors = {
  'Personality': '#ec4899',
  'Interests': '#f59e0b',
  'Technical Skills': '#8b5cf6',
  'Soft Skills': '#06b6d4',
  'Leadership': '#10b981',
  'Communication': '#3b82f6',
  'Work Preference': '#f43f5e',
};

const TestResults = ({ results, onRestart }) => {
  if (!results) return null;
  const { overallScore, topCareers, strengths, weaknesses, skillsToImprove, roadmap, normalizedScores } = results;

  const downloadPDF = () => {
    import('jspdf').then(({ default: jsPDF }) => {
      const doc = new jsPDF('p', 'mm', 'a4');
      const pageW = 210;
      const margin = 20;
      let y = 20;

      // Header
      doc.setFillColor(236, 72, 153);
      doc.rect(0, 0, pageW, 40, 'F');
      doc.setTextColor(255, 255, 255);
      doc.setFontSize(22);
      doc.setFont('helvetica', 'bold');
      doc.text('Career Assessment Report', margin, 25);
      doc.setFontSize(10);
      doc.text(`Generated: ${new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}`, margin, 33);

      y = 50;

      // Overall Score
      doc.setTextColor(30, 30, 30);
      doc.setFontSize(16);
      doc.setFont('helvetica', 'bold');
      doc.text('Overall Score', margin, y);
      y += 8;
      doc.setFillColor(241, 245, 249);
      doc.roundedRect(margin, y, pageW - margin * 2, 12, 3, 3, 'F');
      doc.setFillColor(236, 72, 153);
      doc.roundedRect(margin, y, (pageW - margin * 2) * (overallScore / 100), 12, 3, 3, 'F');
      doc.setTextColor(255, 255, 255);
      doc.setFontSize(11);
      doc.text(`${overallScore}%`, margin + 6, y + 8);
      y += 20;

      // Top Careers
      doc.setTextColor(30, 30, 30);
      doc.setFontSize(14);
      doc.setFont('helvetica', 'bold');
      doc.text('Top Recommended Careers', margin, y);
      y += 8;
      topCareers.forEach((c, i) => {
        doc.setFontSize(10);
        doc.setFont('helvetica', 'bold');
        doc.text(`${i + 1}. ${c.title}`, margin + 2, y);
        doc.setFont('helvetica', 'normal');
        doc.setTextColor(100, 100, 100);
        doc.text(`— Score: ${c.score}%`, margin + 2, y + 5);
        doc.setTextColor(30, 30, 30);
        y += 12;
      });
      y += 4;

      // Strengths
      if (strengths.length > 0) {
        doc.setFontSize(14);
        doc.setFont('helvetica', 'bold');
        doc.text('Strengths', margin, y);
        y += 7;
        strengths.forEach(s => {
          doc.setFontSize(10);
          doc.setFont('helvetica', 'normal');
          doc.text(`• ${s.label}: ${s.score}%`, margin + 2, y);
          y += 6;
        });
        y += 4;
      }

      // Weaknesses
      if (weaknesses.length > 0) {
        doc.setFontSize(14);
        doc.setFont('helvetica', 'bold');
        doc.text('Areas to Improve', margin, y);
        y += 7;
        weaknesses.forEach(w => {
          doc.setFontSize(10);
          doc.setFont('helvetica', 'normal');
          doc.text(`• ${w.label}: ${w.score}%`, margin + 2, y);
          y += 6;
        });
        y += 4;
      }

      // Skills to Improve
      doc.setFontSize(14);
      doc.setFont('helvetica', 'bold');
      doc.text('Skills to Develop', margin, y);
      y += 7;
      skillsToImprove.forEach(s => {
        doc.setFontSize(10);
        doc.setFont('helvetica', 'normal');
        doc.text(`• ${s.skill} (${s.priority}) — ${s.reason}`, margin + 2, y);
        y += 6;
      });
      y += 4;

      // Learning Roadmap
      if (roadmap.length > 0 && y < 250) {
        doc.setFontSize(14);
        doc.setFont('helvetica', 'bold');
        doc.text('Learning Roadmap', margin, y);
        y += 7;
        roadmap.forEach(r => {
          if (y > 270) { doc.addPage(); y = 20; }
          doc.setFontSize(10);
          doc.setFont('helvetica', 'bold');
          doc.text(`For: ${r.career}`, margin + 2, y);
          y += 6;
          r.steps.forEach(s => {
            if (y > 270) { doc.addPage(); y = 20; }
            doc.setFont('helvetica', 'normal');
            doc.text(`  ${s.phase}: ${s.action}`, margin + 4, y);
            y += 5;
          });
          y += 3;
        });
      }

      // Footer
      doc.setFontSize(8);
      doc.setTextColor(150, 150, 150);
      doc.text('SOLMATES Career Assessment — Confidential', margin, 290);

      doc.save('SOLMATES_Career_Report.pdf');
    });
  };

  return (
    <div className="space-y-6 text-left">
      {/* Score */}
      <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }}
        className="glass-panel border border-[var(--border-color)] rounded-2xl p-8 text-center space-y-4">
        <Trophy className="h-10 w-10 text-pink-500 mx-auto" />
        <h2 className="text-3xl font-black bg-gradient-to-r from-pink-500 to-rose-500 bg-clip-text text-transparent">
          {overallScore}%
        </h2>
        <p className="text-sm text-[var(--text-secondary)]">Overall Career Readiness Score</p>
        <div className="flex justify-center gap-3 pt-2">
          <button onClick={downloadPDF}
            className="flex items-center space-x-2 px-4 py-2 rounded-xl bg-pink-600 hover:bg-pink-700 text-white text-xs font-bold transition-all shadow-md">
            <Download className="h-3.5 w-3.5" />
            <span>Download PDF</span>
          </button>
          <button onClick={onRestart}
            className="flex items-center space-x-2 px-4 py-2 rounded-xl bg-[var(--bg-tertiary)] hover:bg-[var(--bg-secondary)] text-[var(--text-primary)] text-xs font-bold transition-all border border-[var(--border-color)]">
            <RotateCcw className="h-3.5 w-3.5" />
            <span>Retake Test</span>
          </button>
        </div>
      </motion.div>

      {/* Category Scores */}
      <motion.div initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.1 }}
        className="glass-panel border border-[var(--border-color)] rounded-2xl p-6 space-y-4">
        <h3 className="font-bold text-[var(--text-primary)]">Category Breakdown</h3>
        <div className="space-y-3">
          {Object.entries(normalizedScores).map(([cat, score]) => (
            <div key={cat} className="space-y-1">
              <div className="flex justify-between text-xs">
                <span className="font-bold text-[var(--text-primary)] capitalize">{cat}</span>
                <span className="font-bold text-pink-500">{score}%</span>
              </div>
              <div className="h-2 bg-[var(--bg-tertiary)] rounded-full overflow-hidden">
                <motion.div initial={{ width: 0 }} animate={{ width: `${score}%` }}
                  transition={{ delay: 0.2, duration: 0.8 }}
                  className="h-full rounded-full" style={{ backgroundColor: colors[cat] || '#ec4899' }} />
              </div>
            </div>
          ))}
        </div>
      </motion.div>

      {/* Top Careers */}
      <motion.div initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.2 }}
        className="glass-panel border border-[var(--border-color)] rounded-2xl p-6 space-y-4">
        <h3 className="font-bold text-[var(--text-primary)]">Top 5 Recommended Careers</h3>
        <div className="space-y-3">
          {topCareers.map((c, i) => (
            <div key={i} className="flex items-center space-x-3 p-3 rounded-xl bg-[var(--bg-tertiary)]">
              <div className="w-8 h-8 rounded-lg bg-pink-500/15 flex items-center justify-center text-pink-500 text-xs font-black shrink-0">
                {i + 1}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-bold text-[var(--text-primary)]">{c.title}</p>
                <p className="text-[11px] text-[var(--text-secondary)] truncate">{c.description}</p>
              </div>
              <span className="text-xs font-bold text-pink-500 shrink-0">{c.score}%</span>
            </div>
          ))}
        </div>
      </motion.div>

      {/* Strengths & Weaknesses */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <motion.div initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.3 }}
          className="glass-panel border border-[var(--border-color)] rounded-2xl p-6 space-y-3">
          <h3 className="font-bold text-[var(--text-primary)] flex items-center space-x-2">
            <TrendingUp className="h-4 w-4 text-emerald-500" />
            <span>Strengths</span>
          </h3>
          {strengths.length === 0 ? (
            <p className="text-xs text-[var(--text-secondary)]">Complete more questions to identify strengths.</p>
          ) : strengths.map((s, i) => (
            <div key={i} className="flex items-center justify-between p-2 rounded-lg bg-emerald-500/10">
              <span className="text-xs font-bold text-emerald-500">{s.label}</span>
              <span className="text-xs font-bold text-emerald-500">{s.score}%</span>
            </div>
          ))}
        </motion.div>

        <motion.div initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.35 }}
          className="glass-panel border border-[var(--border-color)] rounded-2xl p-6 space-y-3">
          <h3 className="font-bold text-[var(--text-primary)] flex items-center space-x-2">
            <TrendingDown className="h-4 w-4 text-amber-500" />
            <span>Weaknesses</span>
          </h3>
          {weaknesses.length === 0 ? (
            <p className="text-xs text-[var(--text-secondary)]">Great balance across all areas!</p>
          ) : weaknesses.map((w, i) => (
            <div key={i} className="flex items-center justify-between p-2 rounded-lg bg-amber-500/10">
              <span className="text-xs font-bold text-amber-500">{w.label}</span>
              <span className="text-xs font-bold text-amber-500">{w.score}%</span>
            </div>
          ))}
        </motion.div>
      </div>

      {/* Skills to Improve */}
      <motion.div initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.4 }}
        className="glass-panel border border-[var(--border-color)] rounded-2xl p-6 space-y-3">
        <h3 className="font-bold text-[var(--text-primary)] flex items-center space-x-2">
          <AlertTriangle className="h-4 w-4 text-rose-500" />
          <span>Skills to Improve</span>
        </h3>
        <div className="space-y-2">
          {skillsToImprove.map((s, i) => (
            <div key={i} className="flex items-center justify-between p-3 rounded-xl bg-[var(--bg-tertiary)]">
              <div>
                <p className="text-sm font-bold text-[var(--text-primary)]">{s.skill}</p>
                <p className="text-[11px] text-[var(--text-secondary)]">{s.reason}</p>
              </div>
              <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                s.priority === 'High' ? 'bg-rose-500/15 text-rose-500'
                : s.priority === 'Medium' ? 'bg-amber-500/15 text-amber-500'
                : 'bg-emerald-500/15 text-emerald-500'
              }`}>
                {s.priority}
              </span>
            </div>
          ))}
        </div>
      </motion.div>

      {/* Learning Roadmap */}
      <motion.div initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.45 }}
        className="glass-panel border border-[var(--border-color)] rounded-2xl p-6 space-y-4">
        <h3 className="font-bold text-[var(--text-primary)] flex items-center space-x-2">
          <Map className="h-4 w-4 text-blue-500" />
          <span>Learning Roadmap</span>
        </h3>
        {roadmap.map((r, i) => (
          <div key={i} className="space-y-2">
            <h4 className="text-sm font-bold text-pink-500">{r.career}</h4>
            <div className="space-y-1.5">
              {r.steps.map((s, j) => (
                <div key={j} className="flex items-start space-x-3 p-2 rounded-lg bg-[var(--bg-tertiary)]">
                  <div className="w-5 h-5 rounded-full bg-pink-500/15 flex items-center justify-center text-pink-500 text-[10px] font-bold shrink-0 mt-0.5">
                    {j + 1}
                  </div>
                  <div>
                    <span className="text-[10px] font-bold text-[var(--text-secondary)]">{s.phase}</span>
                    <p className="text-xs text-[var(--text-primary)]">{s.action}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </motion.div>
    </div>
  );
};

export default TestResults;
