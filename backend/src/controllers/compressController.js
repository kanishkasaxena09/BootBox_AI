const fs = require('fs');
const path = require('path');
const fileService = require('../services/fileService');
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

async function compressUploadedImage(req, res) {
  const startTime = Date.now();
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'Please upload an image file (JPG, JPEG, PNG, or WEBP).' });
    }

    const { level } = req.body; // 'low', 'medium', 'high'
    const compressedBuffer = await fileService.compressImage(req.file.path, level || 'medium');
    
    await logUsage('compression', 'image-compress', req.file.size, startTime);

    const ext = path.extname(req.file.originalname).toLowerCase();
    if (ext === '.png') {
      res.contentType('image/png');
    } else if (ext === '.webp') {
      res.contentType('image/webp');
    } else {
      res.contentType('image/jpeg');
    }

    res.setHeader('Content-Disposition', `attachment; filename="compressed-${req.file.originalname}"`);
    return res.send(compressedBuffer);
  } catch (err) {
    console.error('Image compress controller error:', err.message);
    return res.status(500).json({ error: err.message });
  } finally {
    if (req.file && req.file.path && fs.existsSync(req.file.path)) {
      try {
        fs.unlinkSync(req.file.path);
      } catch (e) {
        console.error('Failed cleanup of image file:', req.file.path, e.message);
      }
    }
  }
}

module.exports = {
  compressUploadedImage
};
