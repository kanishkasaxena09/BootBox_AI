const { generateExcuseAI } = require('../services/aiService');

async function generate(req, res) {
  try {
    const { category, tone, context } = req.body;
    const excuses = await generateExcuseAI(category, tone, context);
    if (!excuses) {
      return res.status(503).json({ error: 'AI service unavailable', fallback: true });
    }
    return res.json({ excuses });
  } catch (err) {
    console.error('Excuse generate error:', err.message);
    return res.status(500).json({ error: err.message });
  }
}

module.exports = { generate };
