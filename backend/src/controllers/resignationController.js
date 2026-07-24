const { generateResignationAI } = require('../services/aiService');

async function generate(req, res) {
  try {
    const { type, inputs } = req.body;
    const result = await generateResignationAI(type, inputs || {});
    if (!result) {
      return res.status(503).json({ error: 'AI service unavailable', fallback: true });
    }
    return res.json({ content: result });
  } catch (err) {
    console.error('Resignation generate error:', err.message);
    return res.status(500).json({ error: err.message });
  }
}

module.exports = { generate };
