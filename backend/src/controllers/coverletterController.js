const { generateCoverLetterAI, improveCoverLetter } = require('../services/aiService');

async function generate(req, res) {
  try {
    const { fields, tone, length } = req.body;
    const result = await generateCoverLetterAI(fields || {}, tone, length);
    if (!result) {
      return res.status(503).json({ error: 'AI service unavailable', fallback: true });
    }
    return res.json({ content: result });
  } catch (err) {
    console.error('Cover letter generate error:', err.message);
    return res.status(500).json({ error: err.message });
  }
}

async function improve(req, res) {
  try {
    const { text } = req.body;
    if (!text) {
      return res.status(400).json({ error: 'Text is required.' });
    }
    const suggestions = await improveCoverLetter(text);
    if (!suggestions) {
      return res.status(503).json({ error: 'AI service unavailable', fallback: true });
    }
    return res.json({ suggestions });
  } catch (err) {
    console.error('Cover letter improve error:', err.message);
    return res.status(500).json({ error: err.message });
  }
}

module.exports = { generate, improve };
