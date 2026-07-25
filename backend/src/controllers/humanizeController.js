const { humanizeTextAI } = require('../services/aiService');

async function humanize(req, res) {
  try {
    const { text, tone } = req.body;
    if (!text || !text.trim()) {
      return res.status(400).json({ error: 'Text is required.' });
    }
    const result = await humanizeTextAI(text, tone);
    if (!result) {
      return res.status(503).json({ error: 'AI service unavailable', fallback: true });
    }
    return res.json({ humanized: result });
  } catch (err) {
    console.error('Humanize error:', err.message);
    return res.status(500).json({ error: err.message });
  }
}

module.exports = { humanize };
