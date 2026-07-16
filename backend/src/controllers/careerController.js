const fs = require('fs');
const path = require('path');
const mammoth = require('mammoth');
const { enhanceResumeData, analyzeResumeATS } = require('../services/aiService');
const fileService = require('../services/fileService');
const { dbQuery } = require('../config/db');
const { PDFDocument, StandardFonts, rgb } = require('pdf-lib');

// Helper to log tool usage
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

/**
 * AI Resume Builder Enhancer
 */
async function generateEnhancedResume(req, res) {
  const startTime = Date.now();
  try {
    const resumeData = req.body;
    if (!resumeData) {
      return res.status(400).json({ error: 'Missing resume data.' });
    }

    const enhanced = await enhanceResumeData(resumeData);
    await logUsage('career', 'resume-builder', JSON.stringify(resumeData).length, startTime);
    return res.json(enhanced);
  } catch (err) {
    console.error('Resume builder controller error:', err.message);
    return res.status(500).json({ error: err.message });
  }
}

/**
 * Generate Resume PDF from JSON payload and return as attachment
 */
async function generateResumePdf(req, res) {
  try {
    const resumeData = req.body;
    if (!resumeData) return res.status(400).json({ error: 'Missing resume data.' });

    const pdfDoc = await PDFDocument.create();
    const helvetica = await pdfDoc.embedFont(StandardFonts.Helvetica);
    const helveticaBold = await pdfDoc.embedFont(StandardFonts.HelveticaBold);
    const pageSize = [612, 792];
    const pageW = pageSize[0];
    const marginX = 50;
    const marginY = 50;
    const textW = pageW - marginX * 2;
    let page = pdfDoc.addPage(pageSize);
    let y = pageSize[1] - marginY;

    const sanitizeText = (str) => {
      if (!str) return '';
      return String(str)
        .replace(/[\u201c\u201d]/g, '"')
        .replace(/[\u2018\u2019]/g, "'")
        .replace(/[\u2014\u2013]/g, '-')
        .replace(/[^\x00-\x7F\u00A0-\u00FF\u2022]/g, '');
    };

    const wrapText = (text, font, fontSize, maxWidth) => {
      const words = sanitizeText(text).split(/\s+/);
      const lines = [];
      let currentLine = '';
      for (const word of words) {
        const testLine = currentLine ? currentLine + ' ' + word : word;
        const width = font.widthOfTextAtSize(testLine, fontSize);
        if (width > maxWidth && currentLine) {
          lines.push(currentLine);
          currentLine = word;
        } else {
          currentLine = testLine;
        }
      }
      if (currentLine) lines.push(currentLine);
      return lines.length ? lines : [''];
    };

    const checkPage = (needed) => {
      if (y - needed < marginY + 20) {
        page = pdfDoc.addPage(pageSize);
        y = pageSize[1] - marginY;
        return true;
      }
      return false;
    };

    const drawLine = (color, thickness = 0.5) => {
      page.drawLine({
        start: { x: marginX, y: y + 4 },
        end: { x: pageW - marginX, y: y + 4 },
        thickness,
        color,
      });
      y -= 8;
    };

    const drawSectionHeader = (title) => {
      checkPage(30);
      y -= 6;
      drawLine(rgb(0.4, 0.45, 0.65), 1);
      page.drawText(sanitizeText(title.toUpperCase()), {
        x: marginX, y, size: 11, font: helveticaBold,
        color: rgb(0.2, 0.3, 0.55),
      });
      y -= 18;
    };

    const drawBodyWrapped = (text, fontSize = 9.5, opts = {}) => {
      const lines = wrapText(text, helvetica, fontSize, textW);
      for (const line of lines) {
        checkPage(fontSize + 6);
        page.drawText(line, { x: marginX, y, size: fontSize, font: helvetica, color: rgb(0.15, 0.15, 0.15), ...opts });
        y -= fontSize + 4;
      }
    };

    const drawBullet = (text, fontSize = 9.5) => {
      const bulletText = '\u2022  ' + text;
      const lines = wrapText(bulletText, helvetica, fontSize, textW);
      for (let i = 0; i < lines.length; i++) {
        checkPage(fontSize + 6);
        page.drawText(lines[i], { x: marginX + 8, y, size: fontSize, font: helvetica, color: rgb(0.15, 0.15, 0.15) });
        y -= fontSize + 4;
      }
    };

    const drawBoldNormal = (bold, normal, fontSize = 9.5) => {
      const full = bold + '  ' + normal;
      const lines = wrapText(full, helvetica, fontSize, textW);
      if (lines.length === 0) return;
      checkPage(fontSize + 6);
      page.drawText(sanitizeText(lines[0]), { x: marginX, y, size: fontSize, font: helveticaBold, color: rgb(0.1, 0.1, 0.1) });
      y -= fontSize + 4;
      for (let i = 1; i < lines.length; i++) {
        checkPage(fontSize + 6);
        page.drawText(lines[i], { x: marginX, y, size: fontSize, font: helvetica, color: rgb(0.15, 0.15, 0.15) });
        y -= fontSize + 4;
      }
    };

    // ===== HEADER =====
    const name = (resumeData.personal && resumeData.personal.name) || 'Your Name';
    page.drawText(sanitizeText(name.toUpperCase()), {
      x: marginX, y, size: 22, font: helveticaBold, color: rgb(0.12, 0.15, 0.3),
    });
    y -= 8;
    drawLine(rgb(0.12, 0.15, 0.3), 2);
    y += 4;

    const contactParts = [];
    if (resumeData.personal?.email) contactParts.push(resumeData.personal.email);
    if (resumeData.personal?.phone) contactParts.push(resumeData.personal.phone);
    if (resumeData.personal?.address) contactParts.push(resumeData.personal.address);
    if (resumeData.personal?.linkedin) contactParts.push(resumeData.personal.linkedin);
    if (resumeData.personal?.portfolio) contactParts.push(resumeData.personal.portfolio);
    const contactLine = contactParts.join('  |  ');
    if (contactLine) {
      const cLines = wrapText(contactLine, helvetica, 9, textW);
      for (const cl of cLines) {
        page.drawText(cl, { x: marginX, y, size: 9, font: helvetica, color: rgb(0.35, 0.35, 0.35) });
        y -= 13;
      }
    }
    y -= 6;

    // ===== SUMMARY =====
    if (resumeData.summary) {
      drawSectionHeader('Professional Summary');
      drawBodyWrapped(resumeData.summary, 9.5);
      y -= 4;
    }

    // ===== EDUCATION =====
    if (resumeData.education && resumeData.education.some(e => e.degree || e.university)) {
      drawSectionHeader('Education');
      for (const edu of resumeData.education) {
        if (!edu.degree && !edu.university) continue;
        const leftText = edu.degree || 'Degree';
        const rightText = edu.year || '';
        checkPage(24);
        const leftW = helveticaBold.widthOfTextAtSize(leftText, 10);
        page.drawText(sanitizeText(leftText), { x: marginX, y, size: 10, font: helveticaBold, color: rgb(0.1, 0.1, 0.1) });
        if (rightText) {
          const rW = helvetica.widthOfTextAtSize(rightText, 9);
          page.drawText(sanitizeText(rightText), { x: pageW - marginX - rW, y, size: 9, font: helvetica, color: rgb(0.4, 0.4, 0.4) });
        }
        y -= 14;
        const subParts = [];
        if (edu.university) subParts.push(edu.university);
        if (edu.cgpa) subParts.push('CGPA: ' + edu.cgpa);
        if (subParts.length) {
          page.drawText(sanitizeText(subParts.join('  |  ')), { x: marginX, y, size: 9, font: helvetica, color: rgb(0.4, 0.4, 0.4) });
          y -= 14;
        }
      }
      y -= 2;
    }

    // ===== EXPERIENCE =====
    if (resumeData.experience && resumeData.experience.some(e => e.companyName || e.jobTitle)) {
      drawSectionHeader('Professional Experience');
      for (const exp of resumeData.experience) {
        if (!exp.companyName && !exp.jobTitle) continue;
        checkPage(20);
        const titleText = exp.jobTitle || 'Role';
        page.drawText(sanitizeText(titleText), { x: marginX, y, size: 10, font: helveticaBold, color: rgb(0.1, 0.1, 0.1) });
        const compText = exp.companyName || '';
        if (compText) {
          const tW = helveticaBold.widthOfTextAtSize(titleText, 10);
          const sep = '  |  ';
          const sepW = helvetica.widthOfTextAtSize(sep, 9);
          page.drawText(sanitizeText(sep + compText), { x: marginX + tW + 4, y, size: 9, font: helvetica, color: rgb(0.35, 0.35, 0.35) });
        }
        y -= 14;
        if (exp.duration) {
          page.drawText(sanitizeText(exp.duration), { x: marginX, y, size: 9, font: helvetica, color: rgb(0.45, 0.45, 0.45) });
          y -= 14;
        }
        if (exp.responsibilities) {
          const bullets = exp.responsibilities.split(/\n/).filter(b => b.trim());
          if (bullets.length > 0) {
            for (const b of bullets) drawBullet(b.trim(), 9.5);
          } else {
            drawBullet(exp.responsibilities.trim(), 9.5);
          }
        }
        y -= 4;
      }
    }

    // ===== PROJECTS =====
    if (resumeData.projects && resumeData.projects.some(p => p.name)) {
      drawSectionHeader('Projects');
      for (const proj of resumeData.projects) {
        if (!proj.name) continue;
        checkPage(20);
        const nameText = proj.name;
        page.drawText(sanitizeText(nameText), { x: marginX, y, size: 10, font: helveticaBold, color: rgb(0.1, 0.1, 0.1) });
        if (proj.technologiesUsed) {
          const nW = helveticaBold.widthOfTextAtSize(nameText, 10);
          page.drawText(sanitizeText('  |  ' + proj.technologiesUsed), { x: marginX + nW + 4, y, size: 9, font: helvetica, color: rgb(0.4, 0.4, 0.4) });
        }
        y -= 14;
        if (proj.description) drawBodyWrapped(proj.description, 9.5);
        y -= 4;
      }
    }

    // ===== SKILLS =====
    if (resumeData.skills && (resumeData.skills.technical || resumeData.skills.soft)) {
      drawSectionHeader('Skills');
      if (resumeData.skills.technical) {
        checkPage(16);
        page.drawText(sanitizeText('Technical:  '), { x: marginX, y, size: 9.5, font: helveticaBold, color: rgb(0.1, 0.1, 0.1) });
        const bW = helveticaBold.widthOfTextAtSize('Technical:  ', 9.5);
        const tLines = wrapText(resumeData.skills.technical, helvetica, 9.5, textW - bW);
        if (tLines.length) {
          page.drawText(sanitizeText(tLines[0]), { x: marginX + bW, y, size: 9.5, font: helvetica, color: rgb(0.15, 0.15, 0.15) });
          y -= 15;
          for (let i = 1; i < tLines.length; i++) {
            checkPage(15);
            page.drawText(tLines[i], { x: marginX + 12, y, size: 9.5, font: helvetica, color: rgb(0.15, 0.15, 0.15) });
            y -= 15;
          }
        } else {
          y -= 15;
        }
      }
      if (resumeData.skills.soft) {
        checkPage(16);
        page.drawText(sanitizeText('Interpersonal:  '), { x: marginX, y, size: 9.5, font: helveticaBold, color: rgb(0.1, 0.1, 0.1) });
        const bW = helveticaBold.widthOfTextAtSize('Interpersonal:  ', 9.5);
        const sLines = wrapText(resumeData.skills.soft, helvetica, 9.5, textW - bW);
        if (sLines.length) {
          page.drawText(sanitizeText(sLines[0]), { x: marginX + bW, y, size: 9.5, font: helvetica, color: rgb(0.15, 0.15, 0.15) });
          y -= 15;
          for (let i = 1; i < sLines.length; i++) {
            checkPage(15);
            page.drawText(sLines[i], { x: marginX + 12, y, size: 9.5, font: helvetica, color: rgb(0.15, 0.15, 0.15) });
            y -= 15;
          }
        } else {
          y -= 15;
        }
      }
      y -= 2;
    }

    // ===== CERTIFICATIONS =====
    if (resumeData.certifications) {
      drawSectionHeader('Certifications');
      drawBodyWrapped(resumeData.certifications, 9.5);
      y -= 2;
    }

    // ===== ACHIEVEMENTS =====
    if (resumeData.achievements) {
      drawSectionHeader('Achievements');
      drawBodyWrapped(resumeData.achievements, 9.5);
    }

    const pdfBytes = await pdfDoc.save();
    res.contentType('application/pdf');
    const safeName = (resumeData.personal?.name || 'resume').replace(/[^a-z0-9_-]/gi, '_');
    res.setHeader('Content-Disposition', `attachment; filename="${safeName}-resume.pdf"`);
    return res.send(Buffer.from(pdfBytes));
  } catch (err) {
    console.error('Generate resume PDF error:', err.message);
    return res.status(500).json({ error: err.message });
  }
}

/**
 * ATS Resume Checker
 */
async function checkATS(req, res) {
  const startTime = Date.now();
  let tempFilePath = null;
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'Please upload a PDF or Word resume file.' });
    }

    tempFilePath = req.file.path;
    const { jobDescription } = req.body;
    const ext = path.extname(req.file.originalname).toLowerCase();
    let resumeText = '';

    if (ext === '.pdf') {
      resumeText = await fileService.extractPdfText(tempFilePath);
    } else if (ext === '.docx') {
      const result = await mammoth.extractRawText({ path: tempFilePath });
      resumeText = result.value;
    } else {
      return res.status(400).json({ error: 'Unsupported file format. Please upload a .pdf or .docx resume.' });
    }

    if (!resumeText || resumeText.trim().length === 0) {
      return res.status(400).json({ error: 'Could not extract text from the uploaded resume file.' });
    }

    const analysis = await analyzeResumeATS(resumeText, jobDescription || '');
    await logUsage('career', 'ats-checker', req.file.size, startTime);
    return res.json(analysis);
  } catch (err) {
    console.error('ATS check controller error:', err.message);
    return res.status(500).json({ error: err.message });
  } finally {
    // Clean up uploaded file
    if (tempFilePath && fs.existsSync(tempFilePath)) {
      try {
        fs.unlinkSync(tempFilePath);
      } catch (err) {
        console.error('Failed to unlink file:', tempFilePath, err.message);
      }
    }
  }
}

module.exports = {
  generateEnhancedResume,
  checkATS,
  generateResumePdf
};
