const { generateEmailAI } = require('../services/aiService');

async function generate(req, res) {
  try {
    const { type, fields, tone, length } = req.body;
    const result = await generateEmailAI(type, fields || {}, tone, length);
    if (!result) {
      return res.status(503).json({ error: 'AI service unavailable', fallback: true });
    }
    return res.json({ content: result });
  } catch (err) {
    console.error('Email generate error:', err.message);
    return res.status(500).json({ error: err.message });
  }
}

module.exports = { generate };
