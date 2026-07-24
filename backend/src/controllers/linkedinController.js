const { generateLinkedInContent } = require('../services/aiService');

async function generate(req, res) {
  try {
    const { type, data } = req.body;
    const result = await generateLinkedInContent(type, data || {});
    if (!result) {
      return res.status(503).json({ error: 'AI service unavailable', fallback: true });
    }
    return res.json({ content: result });
  } catch (err) {
    console.error('LinkedIn generate error:', err.message);
    return res.status(500).json({ error: err.message });
  }
}

module.exports = { generate };
