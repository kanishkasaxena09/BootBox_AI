const { dbQuery } = require('../config/db');
const { sendFeedbackEmail, transporterReady } = require('../config/email');

async function submitFeedback(req, res) {
  try {
    const { name, email, rating, comment } = req.body;

    if (!rating || rating < 1 || rating > 5) {
      return res.status(400).json({ error: 'Rating is mandatory and must be between 1 and 5.' });
    }

    if (!comment || comment.trim().length < 10) {
      return res.status(400).json({ error: 'Feedback message is mandatory and must be at least 10 characters long.' });
    }

    const cleanedName = name && name.trim() ? name.trim() : 'Anonymous';
    const cleanedEmail = email && email.trim() ? email.trim() : null;

    const insertResult = await dbQuery.run(
      `INSERT INTO feedback (name, email, rating, comment) VALUES (?, ?, ?, ?)`,
      [cleanedName, cleanedEmail, parseInt(rating), comment.trim()]
    );

    // Log feedback category usage
    await dbQuery.run(
      `INSERT INTO tool_usage_log (tool_category, tool_name, processing_time_ms, input_size_bytes) VALUES (?, ?, ?, ?)`,
      ['feedback', 'submit', 1, comment.length]
    );

    // Send email notification if SMTP configured
    if (transporterReady) {
      try {
        await sendFeedbackEmail({ name: cleanedName, email: cleanedEmail, rating: parseInt(rating), comment: comment.trim() });
      } catch (e) {
        console.error('Failed to send feedback email:', e.message);
      }
    }
    return res.status(201).json({
      success: true,
      message: 'Feedback submitted successfully! Thank you for your review.',
      feedbackId: insertResult.id
    });
  } catch (err) {
    console.error('Feedback controller error:', err.message);
    return res.status(500).json({ error: err.message });
  }
}

module.exports = {
  submitFeedback
};
