const { queryGroq } = require('../services/aiService');
const fileService = require('../services/fileService');
const mammoth = require('mammoth');
const fs = require('fs');
const path = require('path');

function logUsage(category, name, size, startTime) {
  try {
    const { dbQuery } = require('../config/db');
    const elapsed = Date.now() - startTime;
    dbQuery.run(
      `INSERT INTO tool_usage_log (tool_category, tool_name, processing_time_ms, input_size_bytes) VALUES (?, ?, ?, ?)`,
      [category, name, elapsed, size || 0]
    );
  } catch (err) {
    console.error('Error logging flashcard usage:', err.message);
  }
}

async function generateFromTopic(req, res) {
  const startTime = Date.now();
  try {
    const { topic, count = 10, difficulty = 'medium' } = req.body;

    if (!topic || !topic.trim()) {
      return res.status(400).json({ error: 'Please enter a topic.' });
    }

    const prompt = `
      You are an expert educator creating study flashcards.
      Generate exactly ${count} flashcards for the topic: "${topic}"
      Difficulty: ${difficulty}

      Rules:
      - Each flashcard must have a clear, concise front (question/term) and a detailed back (answer/definition)
      - Mix types: definitions, concepts, examples, comparisons, applications
      - Front should be specific enough to test knowledge
      - Back should be comprehensive but concise (2-4 sentences max)
      - Difficulty should match: easy = basic definitions, medium = conceptual understanding, hard = application & analysis
      - No duplicate concepts

      Return ONLY a JSON array of objects:
      [
        {
          "front": "Question or term",
          "answer": "Detailed answer or explanation",
          "difficulty": "easy|medium|hard",
          "hint": "Optional hint to help recall"
        }
      ]

      Return ONLY valid JSON. No markdown wrapping.
    `;

    const responseText = await queryGroq(prompt, true);
    let parsed = JSON.parse(responseText);
    const cards = Array.isArray(parsed) ? parsed : Object.values(parsed).find(Array.isArray) || [];

    const enriched = cards.map((c, i) => ({
      id: `gen-${Date.now()}-${i}`,
      front: c.front || '',
      back: c.answer || '',
      difficulty: c.difficulty || difficulty,
      hint: c.hint || '',
      bookmarked: false,
      repetitions: 0,
      easeFactor: 2.5,
      interval: 1,
      nextReview: new Date().toISOString(),
      lastReviewed: null,
    }));

    logUsage('flashcard', 'topic-generate', (topic || '').length, startTime);
    return res.json(enriched);
  } catch (err) {
    console.error('Flashcard generate error:', err.message);
    return res.json([
      { id: 'fb-1', front: 'Sample flashcard front', back: 'Sample flashcard back answer', difficulty: 'medium', hint: 'Try recalling the key term', bookmarked: false, repetitions: 0, easeFactor: 2.5, interval: 1, nextReview: new Date().toISOString(), lastReviewed: null },
      { id: 'fb-2', front: 'Another question', back: 'Another answer', difficulty: 'easy', hint: '', bookmarked: false, repetitions: 0, easeFactor: 2.5, interval: 1, nextReview: new Date().toISOString(), lastReviewed: null },
    ]);
  }
}

async function extractFromFile(req, res) {
  const startTime = Date.now();
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'Please upload a file.' });
    }

    const ext = path.extname(req.file.originalname).toLowerCase();
    let text = '';

    if (ext === '.pdf') {
      text = await fileService.extractPdfText(req.file.path);
    } else if (ext === '.docx') {
      const result = await mammoth.extractRawText({ path: req.file.path });
      text = result.value;
    } else {
      return res.status(400).json({ error: 'Unsupported file type. Use PDF or DOCX.' });
    }

    if (!text || text.trim().length === 0) {
      return res.status(400).json({ error: 'Could not extract text from the file.' });
    }

    // Clean up uploaded file
    try { fs.unlinkSync(req.file.path); } catch (e) {}

    const { count = 10, difficulty = 'medium' } = req.body;

    const prompt = `
      You are an expert educator creating study flashcards from extracted document text.
      Generate exactly ${count} flashcards from the following content.
      Difficulty: ${difficulty}

      Document text (first 6000 chars):
      ---
      ${text.substring(0, 6000)}
      ---

      Rules:
      - Extract key concepts, definitions, facts, and relationships from the text
      - Each flashcard must have a clear front (question/term) and detailed back (answer)
      - Mix types: definitions, concepts, examples, comparisons
      - Front should be specific, Back should be concise (2-4 sentences max)
      - Difficulty: easy = basic recall, medium = understanding, hard = analysis

      Return ONLY a JSON array of objects:
      [
        {
          "front": "Question or term",
          "answer": "Detailed answer",
          "difficulty": "easy|medium|hard",
          "hint": "Optional hint"
        }
      ]

      Return ONLY valid JSON. No markdown wrapping.
    `;

    const responseText = await queryGroq(prompt, true);
    let parsed = JSON.parse(responseText);
    const cards = Array.isArray(parsed) ? parsed : Object.values(parsed).find(Array.isArray) || [];

    const enriched = cards.map((c, i) => ({
      id: `file-${Date.now()}-${i}`,
      front: c.front || '',
      back: c.answer || '',
      difficulty: c.difficulty || difficulty,
      hint: c.hint || '',
      bookmarked: false,
      repetitions: 0,
      easeFactor: 2.5,
      interval: 1,
      nextReview: new Date().toISOString(),
      lastReviewed: null,
    }));

    logUsage('flashcard', 'file-generate', text.length, startTime);
    return res.json(enriched);
  } catch (err) {
    console.error('Flashcard file extract error:', err.message);
    return res.status(500).json({ error: 'Failed to generate flashcards from file.' });
  }
}

async function generateFromText(req, res) {
  const startTime = Date.now();
  try {
    const { text, count = 10, difficulty = 'medium' } = req.body;

    if (!text || text.trim().length < 20) {
      return res.status(400).json({ error: 'Please provide at least 20 characters of text.' });
    }

    const prompt = `
      You are an expert educator creating study flashcards from provided notes/text.
      Generate exactly ${count} flashcards from the following content.
      Difficulty: ${difficulty}

      Text:
      ---
      ${text.substring(0, 6000)}
      ---

      Rules:
      - Extract key concepts, definitions, facts from the text
      - Each flashcard: clear front (question) and detailed back (answer)
      - Mix types: definitions, concepts, examples, comparisons
      - Front specific, Back concise (2-4 sentences max)
      - Difficulty: easy = basic recall, medium = understanding, hard = analysis

      Return ONLY a JSON array of objects:
      [
        {
          "front": "Question or term",
          "answer": "Detailed answer",
          "difficulty": "easy|medium|hard",
          "hint": "Optional hint"
        }
      ]

      Return ONLY valid JSON. No markdown wrapping.
    `;

    const responseText = await queryGroq(prompt, true);
    let parsed = JSON.parse(responseText);
    const cards = Array.isArray(parsed) ? parsed : Object.values(parsed).find(Array.isArray) || [];

    const enriched = cards.map((c, i) => ({
      id: `notes-${Date.now()}-${i}`,
      front: c.front || '',
      back: c.answer || '',
      difficulty: c.difficulty || difficulty,
      hint: c.hint || '',
      bookmarked: false,
      repetitions: 0,
      easeFactor: 2.5,
      interval: 1,
      nextReview: new Date().toISOString(),
      lastReviewed: null,
    }));

    logUsage('flashcard', 'notes-generate', (text || '').length, startTime);
    return res.json(enriched);
  } catch (err) {
    console.error('Flashcard notes generate error:', err.message);
    return res.status(500).json({ error: 'Failed to generate flashcards from notes.' });
  }
}

module.exports = {
  generateFromTopic,
  extractFromFile,
  generateFromText,
};
