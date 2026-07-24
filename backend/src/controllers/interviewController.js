const { generateInterviewQuestions, evaluateInterviewAnswer } = require('../services/aiService');

async function generateQuestions(req, res) {
  try {
    const setup = req.body;
    if (!setup.role) {
      return res.status(400).json({ error: 'Role is required.' });
    }
    const questions = await generateInterviewQuestions(setup);
    if (!questions) {
      return res.status(503).json({ error: 'AI service unavailable', fallback: true });
    }
    return res.json({ questions });
  } catch (err) {
    console.error('Interview generate questions error:', err.message);
    return res.status(500).json({ error: err.message });
  }
}

async function evaluateAnswer(req, res) {
  try {
    const { question, answer } = req.body;
    if (!question || !answer) {
      return res.status(400).json({ error: 'Question and answer are required.' });
    }
    const scores = await evaluateInterviewAnswer(question, answer);
    if (!scores) {
      return res.status(503).json({ error: 'AI service unavailable', fallback: true });
    }
    return res.json(scores);
  } catch (err) {
    console.error('Interview evaluate error:', err.message);
    return res.status(500).json({ error: err.message });
  }
}

module.exports = { generateQuestions, evaluateAnswer };
