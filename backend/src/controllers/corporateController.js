const { translateTextAI } = require('../services/aiService');

async function translate(req, res) {
  try {
    const { text, direction, tone } = req.body;
    if (!text) {
      return res.status(400).json({ error: 'Text is required.' });
    }
    const result = await translateTextAI(text, direction, tone);
    if (!result) {
      return res.status(503).json({ error: 'AI service unavailable', fallback: true });
    }
    return res.json({ translated: result });
  } catch (err) {
    console.error('Corporate translate error:', err.message);
    return res.status(500).json({ error: err.message });
  }
}

module.exports = { translate };
