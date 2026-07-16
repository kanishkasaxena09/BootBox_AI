const fs = require('fs');
const path = require('path');
const fileService = require('../services/fileService');
const aiService = require('../services/aiService');
const { dbQuery } = require('../config/db');

// Helper to log usage
async function logUsage(category, name, size = 0, startTime) {
  try {
    const elapsed = Date.now() - startTime;
    await dbQuery.run(
      `INSERT INTO tool_usage_log (tool_category, tool_name, processing_time_ms, input_size_bytes) VALUES (?, ?, ?, ?)`,
      [category, name, elapsed, size]
    );
  } catch (err) {
    console.error('Error logging tool usage:', err.message);
  }
}

// Helper to clean files
const cleanFiles = (files) => {
  if (!files) return;
  const arr = Array.isArray(files) ? files : [files];
  arr.forEach((file) => {
    if (file && file.path && fs.existsSync(file.path)) {
      try {
        fs.unlinkSync(file.path);
      } catch (e) {
        console.error('Failed to delete', file.path, e.message);
      }
    }
  });
};

/**
 * Merge PDFs
 */
async function mergePDFs(req, res) {
  const startTime = Date.now();
  try {
    if (!req.files || req.files.length < 2) {
      return res.status(400).json({ error: 'Please upload at least 2 PDF files to merge.' });
    }

    const paths = req.files.map(f => f.path);
    const totalSize = req.files.reduce((acc, f) => acc + f.size, 0);

    const mergedBytes = await fileService.mergePDFs(paths);
    await logUsage('pdf', 'merge-pdf', totalSize, startTime);

    res.contentType('application/pdf');
    res.setHeader('Content-Disposition', 'attachment; filename="merged.pdf"');
    return res.send(Buffer.from(mergedBytes));
  } catch (err) {
    console.error('Merge error:', err.message);
    return res.status(500).json({ error: err.message });
  } finally {
    cleanFiles(req.files);
  }
}

/**
 * Split PDF
 */
async function splitPDF(req, res) {
  const startTime = Date.now();
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'Please upload a PDF file to split.' });
    }

    const { pageIndex } = req.body;
    if (!pageIndex) {
      return res.status(400).json({ error: 'Please specify the page index.' });
    }

    const splitBytes = await fileService.splitPDF(req.file.path, pageIndex);
    await logUsage('pdf', 'split-pdf', req.file.size, startTime);

    res.contentType('application/pdf');
    res.setHeader('Content-Disposition', `attachment; filename="split-page-${pageIndex}.pdf"`);
    return res.send(Buffer.from(splitBytes));
  } catch (err) {
    console.error('Split error:', err.message);
    return res.status(500).json({ error: err.message });
  } finally {
    cleanFiles(req.file);
  }
}

/**
 * ZIP to PDF
 */
async function zipToPdf(req, res) {
  const startTime = Date.now();
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'Please upload a ZIP file containing PDFs.' });
    }

    const mergedBytes = await fileService.zipToPdf(req.file.path);
    await logUsage('pdf', 'zip-to-pdf', req.file.size, startTime);

    res.contentType('application/pdf');
    res.setHeader('Content-Disposition', 'attachment; filename="zip-merged.pdf"');
    return res.send(Buffer.from(mergedBytes));
  } catch (err) {
    console.error('ZIP to PDF error:', err.message);
    return res.status(500).json({ error: err.message });
  } finally {
    cleanFiles(req.file);
  }
}

/**
 * Compress PDF
 */
async function compressPDF(req, res) {
  const startTime = Date.now();
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'Please upload a PDF file to compress.' });
    }

    const { level } = req.body; // 'low', 'medium', 'high'
    const compressedBytes = await fileService.compressPDF(req.file.path, level);
    await logUsage('pdf', 'compress-pdf', req.file.size, startTime);

    res.contentType('application/pdf');
    res.setHeader('Content-Disposition', 'attachment; filename="compressed.pdf"');
    return res.send(Buffer.from(compressedBytes));
  } catch (err) {
    console.error('Compress PDF error:', err.message);
    return res.status(500).json({ error: err.message });
  } finally {
    cleanFiles(req.file);
  }
}

/**
 * Watermark PDF
 */
async function watermarkPDF(req, res) {
  const startTime = Date.now();
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'Please upload a PDF file to watermark.' });
    }

    const { watermarkText } = req.body;
    const watermarkedBytes = await fileService.watermarkPDF(req.file.path, watermarkText);
    await logUsage('pdf', 'watermark-pdf', req.file.size, startTime);

    res.contentType('application/pdf');
    res.setHeader('Content-Disposition', 'attachment; filename="watermarked.pdf"');
    return res.send(Buffer.from(watermarkedBytes));
  } catch (err) {
    console.error('Watermark error:', err.message);
    return res.status(500).json({ error: err.message });
  } finally {
    cleanFiles(req.file);
  }
}

/**
 * Rotate PDF
 */
async function rotatePDF(req, res) {
  const startTime = Date.now();
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'Please upload a PDF file to rotate.' });
    }

    const { angle } = req.body; // e.g. 90, 180, 270
    const rotatedBytes = await fileService.rotatePDF(req.file.path, angle);
    await logUsage('pdf', 'rotate-pdf', req.file.size, startTime);

    res.contentType('application/pdf');
    res.setHeader('Content-Disposition', 'attachment; filename="rotated.pdf"');
    return res.send(Buffer.from(rotatedBytes));
  } catch (err) {
    console.error('Rotate error:', err.message);
    return res.status(500).json({ error: err.message });
  } finally {
    cleanFiles(req.file);
  }
}

/**
 * JPG to PDF
 */
async function jpgToPdf(req, res) {
  const startTime = Date.now();
  try {
    if (!req.files || req.files.length === 0) {
      return res.status(400).json({ error: 'Please upload one or more image files.' });
    }

    const paths = req.files.map(f => f.path);
    const totalSize = req.files.reduce((acc, f) => acc + f.size, 0);

    const pdfBytes = await fileService.jpgToPdf(paths);
    await logUsage('pdf', 'jpg-to-pdf', totalSize, startTime);

    res.contentType('application/pdf');
    res.setHeader('Content-Disposition', 'attachment; filename="images-converted.pdf"');
    return res.send(Buffer.from(pdfBytes));
  } catch (err) {
    console.error('JPG to PDF error:', err.message);
    return res.status(500).json({ error: err.message });
  } finally {
    cleanFiles(req.files);
  }
}

/**
 * PDF to JPG
 */
async function pdfToJpg(req, res) {
  const startTime = Date.now();
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'Please upload a PDF file.' });
    }

    const imgBuffer = await fileService.pdfToJpg(req.file.path);
    await logUsage('pdf', 'pdf-to-jpg', req.file.size, startTime);

    res.contentType('image/jpeg');
    res.setHeader('Content-Disposition', 'attachment; filename="pdf-page.jpg"');
    return res.send(imgBuffer);
  } catch (err) {
    console.error('PDF to JPG error:', err.message);
    return res.status(500).json({ error: err.message });
  } finally {
    cleanFiles(req.file);
  }
}

/**
 * Word (docx) to PDF
 */
async function docxToPdf(req, res) {
  const startTime = Date.now();
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'Please upload a DOCX file.' });
    }

    const pdfBytes = await fileService.docxToPdf(req.file.path);
    await logUsage('pdf', 'word-to-pdf', req.file.size, startTime);

    res.contentType('application/pdf');
    res.setHeader('Content-Disposition', 'attachment; filename="word-converted.pdf"');
    return res.send(Buffer.from(pdfBytes));
  } catch (err) {
    console.error('DOCX to PDF error:', err.message);
    return res.status(500).json({ error: err.message });
  } finally {
    cleanFiles(req.file);
  }
}

/**
 * PDF to Word (docx)
 */
async function pdfToDocx(req, res) {
  const startTime = Date.now();
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'Please upload a PDF file.' });
    }

    const docxBytes = await fileService.pdfToDocx(req.file.path);
    await logUsage('pdf', 'pdf-to-word', req.file.size, startTime);

    res.contentType('application/vnd.openxmlformats-officedocument.wordprocessingml.document');
    res.setHeader('Content-Disposition', 'attachment; filename="pdf-converted.docx"');
    return res.send(docxBytes);
  } catch (err) {
    console.error('PDF to DOCX error:', err.message);
    return res.status(500).json({ error: err.message });
  } finally {
    cleanFiles(req.file);
  }
}

/**
 * AI PDF Summarizer
 */
async function summarizePDF(req, res) {
  const startTime = Date.now();
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'Please upload a PDF file to summarize.' });
    }

    const { summaryMode } = req.body;
    const text = await fileService.extractPdfText(req.file.path);

    if (!text || text.trim().length === 0) {
      return res.status(400).json({ error: 'Could not extract text from the PDF file.' });
    }

    const summary = await aiService.summarizeText(text, summaryMode || 'detailed');
    await logUsage('pdf', 'pdf-summarizer', req.file.size, startTime);

    return res.json({ summary });
  } catch (err) {
    console.error('PDF summarize error:', err.message);
    return res.status(500).json({ error: err.message });
  } finally {
    cleanFiles(req.file);
  }
}

/**
 * Office Conversions Simulator (Excel/PPT)
 */
async function officeConverter(req, res) {
  const startTime = Date.now();
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'No file uploaded.' });
    }

    const { fromType, toType } = req.body; // e.g. fromType='ppt', toType='pdf'
    if (!fromType || !toType) {
      return res.status(400).json({ error: 'Missing fromType or toType parameters.' });
    }

    const outputBuffer = await fileService.simulateConversion(req.file.path, fromType, toType);
    await logUsage('pdf', `${fromType}-to-${toType}`, req.file.size, startTime);

    if (toType === 'pdf') {
      res.contentType('application/pdf');
      res.setHeader('Content-Disposition', `attachment; filename="converted-${fromType}.pdf"`);
    } else if (toType === 'docx') {
      res.contentType('application/vnd.openxmlformats-officedocument.wordprocessingml.document');
      res.setHeader('Content-Disposition', `attachment; filename="converted-${fromType}.docx"`);
    } else if (toType === 'xlsx') {
      res.contentType('application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
      res.setHeader('Content-Disposition', `attachment; filename="converted-${fromType}.xlsx"`);
    } else if (toType === 'pptx') {
      res.contentType('application/vnd.openxmlformats-officedocument.presentationml.presentation');
      res.setHeader('Content-Disposition', `attachment; filename="converted-${fromType}.pptx"`);
    } else {
      res.contentType('application/octet-stream');
      res.setHeader('Content-Disposition', `attachment; filename="converted-${fromType}.${toType}"`);
    }

    return res.send(outputBuffer);
  } catch (err) {
    console.error('Office converter error:', err.message);
    return res.status(500).json({ error: err.message });
  } finally {
    cleanFiles(req.file);
  }
}

module.exports = {
  mergePDFs,
  splitPDF,
  zipToPdf,
  compressPDF,
  watermarkPDF,
  rotatePDF,
  jpgToPdf,
  pdfToJpg,
  docxToPdf,
  pdfToDocx,
  summarizePDF,
  officeConverter
};
