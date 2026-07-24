const fs = require('fs');
const path = require('path');
const { PDFDocument, rgb, degrees, StandardFonts } = require('pdf-lib');
const sharp = require('sharp');
const mammoth = require('mammoth');
const docx = require('docx');
const AdmZip = require('adm-zip');
const PptxGenJS = require('pptxgenjs');
const ExcelJS = require('exceljs');
const pdfjsLib = require('pdfjs-dist');
let createCanvas;
try {
  createCanvas = require('@napi-rs/canvas').createCanvas;
} catch (e) {
  console.warn('WARN: @napi-rs/canvas unavailable, canvas-based features will be limited:', e.message);
  createCanvas = null;
}

// Clean up helper
const cleanupFile = (filePath) => {
  try {
    if (filePath && fs.existsSync(filePath)) {
      fs.unlinkSync(filePath);
    }
  } catch (err) {
    console.error('Error deleting temp file:', filePath, err.message);
  }
};

async function extractPdfText(filePath) {
  const data = new Uint8Array(fs.readFileSync(filePath));
  const standardFontDataUrl = path.join(__dirname, '../../node_modules/pdfjs-dist/standard_fonts').replace(/\\/g, '/') + '/';
  const doc = await pdfjsLib.getDocument({ data, standardFontDataUrl }).promise;
  const textParts = [];
  for (let i = 1; i <= doc.numPages; i++) {
    const page = await doc.getPage(i);
    const content = await page.getTextContent();
    const pageText = content.items.map(item => item.str).join(' ');
    if (pageText.trim()) textParts.push(pageText.trim());
  }
  return textParts.join('\n\n');
}

/**
 * 1. Merge PDFs
 */
async function mergePDFs(filePaths) {
  const mergedPdf = await PDFDocument.create();
  for (const filePath of filePaths) {
    const pdfBytes = fs.readFileSync(filePath);
    const pdf = await PDFDocument.load(pdfBytes);
    const copiedPages = await mergedPdf.copyPages(pdf, pdf.getPageIndices());
    copiedPages.forEach((page) => mergedPdf.addPage(page));
  }
  return await mergedPdf.save();
}

/**
 * 2. Split PDF
 */
async function splitPDF(filePath, pageIndex) {
  const pdfBytes = fs.readFileSync(filePath);
  const pdf = await PDFDocument.load(pdfBytes);
  const totalPages = pdf.getPageCount();
  
  const idx = parseInt(pageIndex) - 1;
  if (idx < 0 || idx >= totalPages) {
    throw new Error(`Invalid page index. Document has ${totalPages} pages.`);
  }

  const newPdf = await PDFDocument.create();
  const [copiedPage] = await newPdf.copyPages(pdf, [idx]);
  newPdf.addPage(copiedPage);
  return await newPdf.save();
}

/**
 * 3. Compress PDF
 */
async function compressPDF(filePath, level = 'medium') {
  const pdfBytes = fs.readFileSync(filePath);
  const pdf = await PDFDocument.load(pdfBytes);
  
  // pdf-lib object stream compression
  // 'low' -> no compression, 'medium' -> object streams, 'high' -> remove metadata & object streams
  const useStreams = level !== 'low';
  const compressedBytes = await pdf.save({
    useObjectStreams: useStreams,
    addDefaultPage: false
  });
  return compressedBytes;
}

/**
 * 4. Add Watermark to PDF
 */
async function watermarkPDF(filePath, text) {
  const pdfBytes = fs.readFileSync(filePath);
  const pdf = await PDFDocument.load(pdfBytes);
  const pages = pdf.getPages();
  const font = await pdf.embedFont(StandardFonts.HelveticaBold);
  const watermarkText = text || 'WATERMARK';
  const fontSize = 72;

  for (const page of pages) {
    const { width, height } = page.getSize();
    const textWidth = font.widthOfTextAtSize(watermarkText, fontSize);

    page.drawText(watermarkText, {
      x: (width - textWidth) / 2,
      y: height / 2,
      size: fontSize,
      font: font,
      color: rgb(0.7, 0.7, 0.7),
      opacity: 0.3,
      rotate: degrees(45),
    });
  }
  return await pdf.save();
}

/**
 * 5. Rotate PDF
 */
async function rotatePDF(filePath, rotationAngle = 90) {
  const pdfBytes = fs.readFileSync(filePath);
  const pdf = await PDFDocument.load(pdfBytes);
  const pages = pdf.getPages();

  for (const page of pages) {
    const currentRotation = page.getRotation().angle;
    page.setRotation(degrees((currentRotation + parseInt(rotationAngle)) % 360));
  }
  return await pdf.save();
}

/**
 * 6. JPG to PDF
 */
async function jpgToPdf(filePaths) {
  const pdf = await PDFDocument.create();
  for (const filePath of filePaths) {
    const imgBytes = fs.readFileSync(filePath);
    let image;
    
    // Check if PNG or JPG
    if (filePath.toLowerCase().endsWith('.png')) {
      image = await pdf.embedPng(imgBytes);
    } else {
      image = await pdf.embedJpg(imgBytes);
    }

    const { width, height } = image.scale(1);
    const page = pdf.addPage([width, height]);
    page.drawImage(image, {
      x: 0,
      y: 0,
      width: width,
      height: height,
    });
  }
  return await pdf.save();
}

/**
 * 7. PDF to JPG (Outputs first page as JPEG buffer using Sharp for text preview)
 */
async function pdfToJpg(filePath) {
  const data = new Uint8Array(fs.readFileSync(filePath));
  const standardFontDataUrl = path.join(__dirname, '../../node_modules/pdfjs-dist/standard_fonts').replace(/\\/g, '/') + '/';
  const doc = await pdfjsLib.getDocument({ data, standardFontDataUrl }).promise;
  const totalPages = doc.numPages;

  const pageImages = [];
  const scale = 2;

  for (let i = 1; i <= totalPages; i++) {
    const page = await doc.getPage(i);
    const viewport = page.getViewport({ scale });

    const canvas = createCanvas ? createCanvas(viewport.width, viewport.height) : null;
    if (!canvas) throw new Error('Canvas rendering unavailable — @napi-rs/canvas not installed');
    const ctx = canvas.getContext('2d');

    ctx.fillStyle = '#FFFFFF';
    ctx.fillRect(0, 0, viewport.width, viewport.height);

    await page.render({
      canvasContext: ctx,
      viewport
    }).promise;

    const pngBuf = canvas.toBuffer('image/png');
    pageImages.push(pngBuf);

    if (i >= 50) break;
  }

  if (pageImages.length === 1) {
    return await sharp(pageImages[0]).jpeg({ quality: 90 }).toBuffer();
  }

  const gridCols = Math.ceil(Math.sqrt(pageImages.length));
  const gridRows = Math.ceil(pageImages.length / gridCols);
  const thumbW = Math.floor(800 / gridCols);
  const thumbH = Math.floor(1100 / gridRows);

  const composites = [];
  for (let i = 0; i < pageImages.length; i++) {
    const resized = await sharp(pageImages[i]).resize(thumbW, thumbH, { fit: 'inside' }).toBuffer();
    const col = i % gridCols;
    const row = Math.floor(i / gridCols);
    composites.push({ input: resized, left: col * thumbW, top: row * thumbH });
  }

  const gridW = gridCols * thumbW;
  const gridH = gridRows * thumbH;

  return await sharp({
    create: { width: gridW, height: gridH, channels: 3, background: { r: 252, g: 252, b: 252 } }
  }).composite(composites).jpeg({ quality: 90 }).toBuffer();
}

/**
 * 8. Word (DOCX) to PDF
 */
async function docxToPdf(filePath) {
  const result = await mammoth.extractRawText({ path: filePath });
  const text = result.value || 'Empty Word Document';

  const pdfDoc = await PDFDocument.create();
  const font = await pdfDoc.embedFont(StandardFonts.Helvetica);
  let page = pdfDoc.addPage([600, 800]);
  
  const lines = text.split('\n');
  let y = 750;

  for (const line of lines) {
    if (y < 50) {
      page = pdfDoc.addPage([600, 800]);
      y = 750;
    }
    const cleanLine = line.trim();
    if (cleanLine.length > 0) {
      page.drawText(cleanLine.substring(0, 80), {
        x: 50,
        y: y,
        size: 11,
        font: font,
        color: rgb(0.1, 0.1, 0.1),
      });
      y -= 18;
    }
  }

  return await pdfDoc.save();
}

/**
 * 9. PDF to Word (DOCX)
 */
async function pdfToDocx(filePath) {
  const text = await extractPdfText(filePath) || 'Empty PDF Document';

  const paragraphs = text.split('\n').map((line) => {
    return new docx.Paragraph({
      children: [new docx.TextRun({ text: line, font: 'Arial', size: 22 })],
      spacing: { after: 120 }
    });
  });

  const doc = new docx.Document({
    sections: [{
      properties: {},
      children: paragraphs,
    }],
  });

  return await docx.Packer.toBuffer(doc);
}

/**
 * 10. Compress Image
 */
async function compressImage(filePath, level = 'medium') {
  const qualityMap = { low: 85, medium: 60, high: 30 }; // High level compression = low quality
  const targetQuality = qualityMap[level] || 60;
  
  // Support converting / compressing using sharp
  const ext = path.extname(filePath).toLowerCase();
  let pipeline = sharp(filePath);

  if (ext === '.png') {
    pipeline = pipeline.png({ quality: targetQuality, compressionLevel: 8 });
  } else if (ext === '.webp') {
    pipeline = pipeline.webp({ quality: targetQuality });
  } else {
    pipeline = pipeline.jpeg({ quality: targetQuality, mozjpeg: true });
  }

  return await pipeline.toBuffer();
}

/**
 * 11. ZIP to PDF Converter
 */
async function zipToPdf(filePath) {
  const zip = new AdmZip(filePath);
  const zipEntries = zip.getEntries();
  const tempDir = path.dirname(filePath);
  const extractedPdfPaths = [];

  try {
    for (const entry of zipEntries) {
      if (entry.entryName.toLowerCase().endsWith('.pdf') && !entry.isDirectory) {
        const destPath = path.join(tempDir, `extracted_${Date.now()}_${path.basename(entry.entryName)}`);
        fs.writeFileSync(destPath, entry.getData());
        extractedPdfPaths.push(destPath);
      }
    }

    if (extractedPdfPaths.length === 0) {
      throw new Error('No PDF files found inside the uploaded ZIP archive.');
    }

    // Merge the extracted PDFs
    const mergedBytes = await mergePDFs(extractedPdfPaths);
    return mergedBytes;
  } finally {
    // Cleanup temporary extracted files
    extractedPdfPaths.forEach(cleanupFile);
  }
}

/**
 * 12. Office / Other Simulators (Excel to PDF, HTML to PDF, PDF to PPTX, etc.)
 */
async function simulateConversion(filePath, type, target) {
  let contentText = '';
  try {
    if (filePath.toLowerCase().endsWith('.pdf')) {
      contentText = await extractPdfText(filePath);
    } else if (filePath.toLowerCase().endsWith('.xlsx') || filePath.toLowerCase().endsWith('.xls')) {
      const workbook = new ExcelJS.Workbook();
      await workbook.xlsx.readFile(filePath);
      const rows = [];
      workbook.eachSheet((sheet) => {
        sheet.eachRow({ includeEmpty: false }, (row) => {
          const cells = [];
          row.eachCell({ includeEmpty: true }, (cell) => {
            cells.push(String(cell.value ?? ''));
          });
          rows.push(cells.join(' | '));
        });
      });
      contentText = rows.join('\n');
    } else if (filePath.toLowerCase().endsWith('.pptx')) {
      const zip = new AdmZip(filePath);
      const zipEntries = zip.getEntries();
      const slideTexts = [];
      for (const entry of zipEntries) {
        if (entry.entryName.match(/ppt\/slides\/slide\d+\.xml$/)) {
          const xml = entry.getData().toString('utf8');
          const texts = [];
          const re = /<a:t>([^<]+)<\/a:t>/g;
          let m;
          while ((m = re.exec(xml)) !== null) texts.push(m[1]);
          if (texts.length > 0) slideTexts.push(texts.join(' '));
        }
      }
      contentText = slideTexts.join('\n\n');
    } else {
      contentText = fs.readFileSync(filePath, 'utf8');
    }
  } catch (e) {
    contentText = 'Content could not be parsed fully.';
  }

  if (target === 'pdf') {
    const pdfDoc = await PDFDocument.create();
    const font = await pdfDoc.embedFont(StandardFonts.Helvetica);
    const page = pdfDoc.addPage([612, 792]);
    const lines = contentText.split('\n');
    let y = 750;
    for (const line of lines) {
      if (y < 60) {
        const newPage = pdfDoc.addPage([612, 792]);
        y = 750;
      }
      const safeLine = line.replace(/[^\x00-\x7F]/g, '').substring(0, 100);
      if (safeLine.trim()) {
        page.drawText(safeLine, { x: 50, y, size: 11, font, color: rgb(0.1, 0.1, 0.1) });
        y -= 16;
      }
    }
    return Buffer.from(await pdfDoc.save());
  } else if (target === 'docx') {
    const paragraphs = contentText.split('\n').filter(l => l.trim()).map(
      line => new docx.Paragraph({ children: [new docx.TextRun(line.trim())] })
    );
    const doc = new docx.Document({ sections: [{ children: paragraphs }] });
    return await docx.Packer.toBuffer(doc);
  } else if (target === 'pptx') {
    const pptx = new PptxGenJS();
    pptx.layout = 'LAYOUT_WIDE';
    pptx.author = 'BootBox';
    pptx.title = `Converted from ${type.toUpperCase()}`;

    const chunks = contentText.split(/\n\s*\n/).filter(c => c.trim());
    if (chunks.length === 0) {
      chunks.push(contentText.substring(0, 500) || 'No content extracted.');
    }

    for (let i = 0; i < Math.min(chunks.length, 50); i++) {
      const chunk = chunks[i].trim();
      const lines = chunk.split('\n').filter(l => l.trim());
      const title = lines[0] || `Slide ${i + 1}`;
      const body = lines.slice(1).join('\n') || '';

      const slide = pptx.addSlide();
      slide.background = { color: 'FFFFFF' };

      slide.addText(title.substring(0, 100), {
        x: 0.5, y: 0.3, w: 12.3, h: 0.8,
        fontSize: 22, fontFace: 'Arial', bold: true, color: '1F2937',
      });

      slide.addShape(pptx.ShapeType.rect, {
        x: 0.5, y: 1.1, w: 12.3, h: 0.02, fill: { color: '6366F1' },
      });

      if (body) {
        const wrappedLines = [];
        const bodyLines = body.split('\n');
        for (const bl of bodyLines) {
          const text = bl.trim();
          if (text.length > 0) {
            wrappedLines.push({ text, options: { fontSize: 13, fontFace: 'Arial', color: '374151', breakLine: true } });
          }
        }

        if (wrappedLines.length > 0) {
          slide.addText(wrappedLines, {
            x: 0.7, y: 1.4, w: 11.9, h: 5.5,
            valign: 'top', lineSpacingMultiple: 1.3,
          });
        }
      }

      slide.addText(`${i + 1} / ${Math.min(chunks.length, 50)}`, {
        x: 11.5, y: 7.0, w: 1.5, h: 0.4,
        fontSize: 9, color: '9CA3AF', align: 'right',
      });
    }

    return await pptx.write({ outputType: 'nodebuffer' });
  } else if (target === 'xlsx') {
    const workbook = new ExcelJS.Workbook();
    workbook.creator = 'BootBox';
    workbook.created = new Date();

    const sheet = workbook.addWorksheet('Converted Content');

    sheet.columns = [
      { header: 'Line #', key: 'num', width: 10 },
      { header: 'Content', key: 'content', width: 90 },
    ];

    const headerRow = sheet.getRow(1);
    headerRow.font = { bold: true, color: { argb: 'FFFFFFFF' } };
    headerRow.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FF6366F1' } };
    headerRow.alignment = { vertical: 'middle', horizontal: 'center' };

    const lines = contentText.split('\n').filter(l => l.trim());
    for (let i = 0; i < Math.min(lines.length, 10000); i++) {
      sheet.addRow({ num: i + 1, content: lines[i].trim() });
    }

    const borderStyle = { style: 'thin', color: { argb: 'FFE5E7EB' } };
    sheet.eachRow({ includeEmpty: false }, (row) => {
      row.eachCell((cell) => {
        cell.border = {
          top: borderStyle, bottom: borderStyle,
          left: borderStyle, right: borderStyle,
        };
      });
    });

    sheet.autoFilter = { from: 'A1', to: 'B1' };

    return await workbook.xlsx.writeBuffer();
  }

  throw new Error(`Unsupported conversion target: ${target}`);
}

module.exports = {
  extractPdfText,
  mergePDFs,
  splitPDF,
  compressPDF,
  watermarkPDF,
  rotatePDF,
  jpgToPdf,
  pdfToJpg,
  docxToPdf,
  pdfToDocx,
  compressImage,
  zipToPdf,
  simulateConversion
};
