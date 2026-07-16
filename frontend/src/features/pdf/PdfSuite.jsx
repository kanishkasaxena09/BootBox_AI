import React, { useState } from 'react';
import {
  FileText, Merge, Scissors, FolderArchive, FileDown, Sparkles, Image,
  RotateCw, Columns, FileSpreadsheet, Presentation
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

import MergePdf from './tools/MergePdf';
import SplitPdf from './tools/SplitPdf';
import ZipConverter from './tools/ZipConverter';
import CompressPdf from './tools/CompressPdf';
import PdfToWord from './tools/PdfToWord';
import PdfToPpt from './tools/PdfToPpt';
import PdfToExcel from './tools/PdfToExcel';
import WordToPdf from './tools/WordToPdf';
import PptToPdf from './tools/PptToPdf';
import ExcelToPdf from './tools/ExcelToPdf';
import PdfToJpg from './tools/PdfToJpg';
import JpgToPdf from './tools/JpgToPdf';
import WatermarkPdf from './tools/WatermarkPdf';
import RotatePdf from './tools/RotatePdf';
import HtmlToPdf from './tools/HtmlToPdf';
import AiSummarizer from './tools/AiSummarizer';

const toolsConfig = [
  { id: 'merge', name: 'Merge PDF', icon: Merge, desc: 'Combine PDFs in the order you want with the easiest PDF merger available.', iconBg: 'bg-[#3b82f6]' },
  { id: 'split', name: 'Split PDF', icon: Scissors, desc: 'Separate one page or a whole set for easy conversion into independent PDF files.', iconBg: 'bg-[#ef4444]' },
  { id: 'zip-to-pdf', name: 'Zip Converter', icon: FolderArchive, desc: 'Bundle any number of files of any format into a single, compressed ZIP archive instantly.', iconBg: 'bg-[#6366f1]' },
  { id: 'compress', name: 'Compress PDF', icon: FileDown, desc: 'Reduce file size while optimizing for maximal PDF quality.', iconBg: 'bg-[#10b981]' },
  { id: 'pdf-to-word', name: 'PDF to Word', icon: FileText, desc: 'Advanced Font-Aware Paragraph Clustering engine that preserves styles and layout perfectly.', iconBg: 'bg-[#3b82f6]' },
  { id: 'pdf-to-ppt', name: 'PDF to PowerPoint', icon: Presentation, desc: 'High-fidelity conversion of PDF pages into editable PowerPoint slides.', iconBg: 'bg-[#f59e0b]' },
  { id: 'pdf-to-excel', name: 'PDF to Excel', icon: FileSpreadsheet, desc: 'Extract and transfer tables from PDF documents directly to spreadsheet columns.', iconBg: 'bg-[#059669]' },
  { id: 'word-to-pdf', name: 'Word to PDF', icon: FileText, desc: 'Make DOC and DOCX files easy to read by converting them to clean PDF sheets.', iconBg: 'bg-[#1d4ed8]' },
  { id: 'ppt-to-pdf', name: 'PPT to PDF', icon: Presentation, desc: 'Convert slide presentations directly to portable document format (PDF) for clean distribution.', iconBg: 'bg-[#ea580c]' },
  { id: 'excel-to-pdf', name: 'Excel to PDF', icon: FileSpreadsheet, desc: 'Make XLS and XLSX spreadsheets easy to read by converting them to clean PDF sheets.', iconBg: 'bg-[#16a34a]' },
  { id: 'pdf-to-jpg', name: 'PDF to JPG', icon: Image, desc: 'Convert each page of a PDF document into a high resolution JPEG image file.', iconBg: 'bg-[#8b5cf6]' },
  { id: 'jpg-to-pdf', name: 'JPG to PDF', icon: Image, desc: 'Convert image files to portable document format (PDF) with clean border alignment.', iconBg: 'bg-[#ec4899]' },
  { id: 'watermark', name: 'Add Watermark', icon: Columns, desc: 'Stamp text or image watermarks onto your PDF pages with custom transparency and rotation.', iconBg: 'bg-[#06b6d4]' },
  { id: 'rotate', name: 'Rotate PDF', icon: RotateCw, desc: 'Rotate single or multiple PDF pages to portrait or landscape orientations easily.', iconBg: 'bg-[#14b8a6]' },
  { id: 'html-to-pdf', name: 'HTML to PDF', icon: FileText, desc: 'Convert raw HTML code blocks directly to clear portable document format (PDF) pages.', iconBg: 'bg-[#d946ef]' },
  { id: 'summarizer', name: 'AI PDF Summarizer', icon: Sparkles, desc: 'Generate AI summary notes, key points, exam revision topics, or Q&A worksheets.', iconBg: 'bg-[#7c3aed]' }
];

const toolComponents = {
  'merge': MergePdf,
  'split': SplitPdf,
  'zip-to-pdf': ZipConverter,
  'compress': CompressPdf,
  'pdf-to-word': PdfToWord,
  'pdf-to-ppt': PdfToPpt,
  'pdf-to-excel': PdfToExcel,
  'word-to-pdf': WordToPdf,
  'ppt-to-pdf': PptToPdf,
  'excel-to-pdf': ExcelToPdf,
  'pdf-to-jpg': PdfToJpg,
  'jpg-to-pdf': JpgToPdf,
  'watermark': WatermarkPdf,
  'rotate': RotatePdf,
  'html-to-pdf': HtmlToPdf,
  'summarizer': AiSummarizer
};

const PdfSuite = () => {
  const [activeToolId, setActiveToolId] = useState(null);

  if (activeToolId) {
    const ToolComponent = toolComponents[activeToolId];
    return <ToolComponent onBack={() => setActiveToolId(null)} />;
  }

  return (
    <div className="space-y-6 text-left">
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="space-y-6">
        <div className="text-center md:text-left space-y-2">
          <h2 className="text-2xl font-black bg-gradient-to-r from-pink-500 to-rose-500 bg-clip-text text-transparent">
            PDF Suite &amp; Document Tools
          </h2>
          <p className="text-sm text-[var(--text-secondary)]">
            A professional-grade toolbox to merge, split, compress, secure, convert, and summarize documents instantly.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {toolsConfig.map((tool) => {
            const Icon = tool.icon;
            return (
              <motion.div
                whileHover={{ y: -4, boxShadow: '0 12px 30px -5px rgba(157, 23, 77, 0.05), 0 8px 12px -6px rgba(157, 23, 77, 0.05)' }}
                key={tool.id}
                onClick={() => setActiveToolId(tool.id)}
                className="glass-panel border border-[var(--border-color)] p-6 md:p-8 rounded-[24px] cursor-pointer transition-all flex flex-col justify-between text-left space-y-4 shadow-sm"
              >
                <div className="space-y-4">
                  <div className={`w-12 h-12 rounded-2xl flex items-center justify-center text-white ${tool.iconBg} shadow-md`}>
                    <Icon className="h-6 w-6" />
                  </div>
                  <div className="space-y-2">
                    <h3 className="font-bold text-lg text-[var(--text-primary)] leading-snug">{tool.name}</h3>
                    <p className="text-sm text-[var(--text-secondary)] font-normal leading-relaxed">{tool.desc}</p>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
      </motion.div>
    </div>
  );
};

export default PdfSuite;
