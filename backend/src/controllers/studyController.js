const { queryGroq } = require('../services/aiService');

function logUsage(category, name, size, startTime) {
  try {
    const { dbQuery } = require('../config/db');
    const elapsed = Date.now() - startTime;
    dbQuery.run(
      `INSERT INTO tool_usage_log (tool_category, tool_name, processing_time_ms, input_size_bytes) VALUES (?, ?, ?, ?)`,
      [category, name, elapsed, size || 0]
    );
  } catch (err) {
    console.error('Error logging study usage:', err.message);
  }
}

async function generateStudyContent(req, res) {
  const startTime = Date.now();
  try {
    const { topic, subject, difficulty, goal, learningStyle } = req.body;

    if (!topic || !topic.trim()) {
      return res.status(400).json({ error: 'Please enter a topic to study.' });
    }

    const prompt = `
      You are an elite AI Study Companion — an expert educator, tutor, and academic coach.
      Generate a comprehensive, structured study guide for the following topic.

      TOPIC: ${topic}
      SUBJECT: ${subject || 'General'}
      DIFFICULTY LEVEL: ${difficulty || 'Intermediate'}
      STUDY GOAL: ${goal || 'Understand the concept thoroughly'}
      LEARNING STYLE: ${learningStyle || 'Balanced (visual + text)'}

      Generate the following sections in clean Markdown format. Be thorough, accurate, and student-friendly.

      1. **EXPLANATION** — A clear, detailed explanation of the topic (4-6 paragraphs). Use simple language appropriate for ${difficulty || 'Intermediate'} level. Include analogies where helpful.

      2. **KEY CONCEPTS** — List 5-8 key concepts with brief explanations for each. Format as a bullet list.

      3. **IMPORTANT FORMULAS** — List all relevant formulas (if applicable). If no formulas exist for this topic, provide key rules or principles instead. Format each formula clearly.

      4. **REAL-WORLD EXAMPLES** — Provide 3-4 real-world examples or applications of this topic. Make them relatable to students.

      5. **MEMORY TRICKS** — Provide 3-5 mnemonics, analogies, or memory aids to help remember the key concepts. Be creative.

      6. **QUIZ QUESTIONS** — Generate 5 quiz questions with answers. Mix of multiple choice (4 options each) and short answer. Format clearly with Q: and A: labels.

      7. **PRACTICE EXERCISES** — Provide 3-4 practice exercises or problems with detailed solutions. Gradually increase in difficulty.

      8. **REVISION NOTES** — Create concise, exam-ready revision notes. Use bullet points and bold text for key terms. Keep it compact but complete.

      9. **SUMMARY** — A 3-4 sentence summary capturing the absolute essentials of this topic.

      Return the entire response as a single JSON object with these exact keys:
      {
        "explanation": "string with full explanation",
        "keyConcepts": ["concept1", "concept2", ...],
        "formulas": "string with formulas section",
        "examples": ["example1", "example2", ...],
        "memoryTricks": ["trick1", "trick2", ...],
        "quiz": [{"question": "...", "answer": "...", "type": "mcq|short"}, ...],
        "exercises": [{"problem": "...", "solution": "..."}, ...],
        "revisionNotes": "string with revision notes",
        "summary": "string with summary"
      }

      Return ONLY valid JSON. No markdown wrapping. No extra text.
    `;

    const responseText = await queryGroq(prompt, true);
    const data = JSON.parse(responseText);

    logUsage('study', 'study-companion', (topic || '').length, startTime);

    return res.json(data);
  } catch (err) {
    console.error('Study companion generate error:', err.message);

    const fallback = {
      explanation: `## ${req.body.topic || 'Topic'}\n\nThis is a study guide for the requested topic. The AI service encountered an issue generating the full content. Please try again or rephrase your topic.\n\n**Tip:** Be specific with your topic name for better results. For example, instead of "math", try "Pythagorean theorem" or "quadratic equations".`,
      keyConcepts: ['Core concept 1', 'Core concept 2', 'Core concept 3'],
      formulas: 'Formulas will be generated when the AI service is available.',
      examples: ['Example 1: Real-world application', 'Example 2: Practical use case'],
      memoryTricks: ['Memory trick 1: Use associations', 'Memory trick 2: Create vivid images'],
      quiz: [
        { question: 'Sample question 1?', answer: 'Sample answer 1', type: 'short' },
        { question: 'Sample question 2?', answer: 'Sample answer 2', type: 'short' },
      ],
      exercises: [
        { problem: 'Practice problem 1', solution: 'Solution steps will appear here.' },
      ],
      revisionNotes: 'Revision notes will be generated when the AI service is available.',
      summary: `Study guide for "${req.body.topic || 'the requested topic'}". Please try generating again.`,
      _fallback: true,
    };

    return res.json(fallback);
  }
}

async function studyChat(req, res) {
  try {
    const { messages, topic } = req.body;

    if (!messages || !Array.isArray(messages)) {
      return res.status(400).json({ error: 'Invalid chat messages.' });
    }

    const systemMessage = {
      role: 'system',
      content: `You are a friendly, knowledgeable AI Study Tutor helping a student learn about "${topic || 'a topic'}". 
      - Be encouraging and patient
      - Explain concepts clearly using simple language
      - Use examples and analogies when helpful
      - If the student is confused, try a different approach
      - Keep responses concise but thorough (2-4 paragraphs max)
      - Use markdown formatting for clarity`
    };

    const chatMessages = [systemMessage, ...messages.map(m => ({
      role: m.role,
      content: m.content,
    }))];

    const { aiClient, isAiEnabled } = require('../config/ai');

    if (!isAiEnabled) {
      return res.json({
        role: 'assistant',
        content: `Great question! As an AI tutor, I'd help you understand this concept. However, the AI service is currently unavailable. Please try again later.\n\n**Your question was:** ${messages[messages.length - 1]?.content || 'N/A'}`
      });
    }

    const result = await aiClient.chat.completions.create({
      model: 'llama-3.3-70b-versatile',
      messages: chatMessages,
      max_tokens: 1024,
    });

    return res.json({
      role: 'assistant',
      content: result.choices[0].message.content,
    });
  } catch (err) {
    console.error('Study chat error:', err.message);
    return res.status(500).json({ error: 'Chat failed. Please try again.' });
  }
}

async function regenerateSection(req, res) {
  try {
    const { topic, section, subject, difficulty } = req.body;

    const sectionPrompts = {
      explanation: 'Generate a fresh, detailed explanation of this topic.',
      keyConcepts: 'List the key concepts with brief explanations as a JSON array of strings.',
      formulas: 'List all important formulas and rules for this topic.',
      examples: 'Provide 3-4 real-world examples as a JSON array of strings.',
      memoryTricks: 'Create 3-5 creative memory tricks and mnemonics as a JSON array of strings.',
      revisionNotes: 'Create concise, exam-ready revision notes.',
      summary: 'Write a 3-4 sentence summary of this topic.',
    };

    const prompt = `
      You are an expert educator. Topic: "${topic}" | Subject: "${subject || 'General'}" | Difficulty: ${difficulty || 'Intermediate'}
      ${sectionPrompts[section] || 'Generate content for this section.'}
      ${['keyConcepts', 'examples', 'memoryTricks'].includes(section) 
        ? 'Return ONLY a JSON array of strings. No markdown. No explanation.' 
        : 'Return ONLY the content text. No JSON wrapping. No markdown.'}
    `;

    const isJson = ['keyConcepts', 'examples', 'memoryTricks'].includes(section);
    const responseText = await queryGroq(prompt, isJson);

    let data;
    if (isJson) {
      data = JSON.parse(responseText);
    } else {
      data = responseText;
    }

    return res.json({ section, content: data });
  } catch (err) {
    console.error('Regenerate section error:', err.message);
    return res.status(500).json({ error: 'Failed to regenerate.' });
  }
}

module.exports = {
  generateStudyContent,
  studyChat,
  regenerateSection,
};
