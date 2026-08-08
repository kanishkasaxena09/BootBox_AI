const path = require('path');
const fs = require('fs');
const { dbQuery } = require('../config/db');

async function getSolDatabase(req, res) {
  try {
    const row = await dbQuery.get("SELECT value FROM admin_settings WHERE key = 'sol_database'");
    const data = row ? JSON.parse(row.value) : { years: [] };
    return res.json(data);
  } catch (err) {
    console.error('Get sol_database error:', err.message);
    return res.status(500).json({ error: err.message });
  }
}

async function uploadDocument(req, res) {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'No file uploaded.' });
    }
    const file = req.file;
    const url = `/uploads/${file.filename}`;
    return res.json({
      success: true,
      url,
      filename: file.originalname,
      size: file.size
    });
  } catch (err) {
    console.error('Upload document error:', err.message);
    return res.status(500).json({ error: err.message });
  }
}

module.exports = { getSolDatabase, uploadDocument };
