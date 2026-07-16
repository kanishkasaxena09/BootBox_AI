const Groq = require('groq-sdk');
require('dotenv').config();

const apiKey = process.env.GROQ_API_KEY;
let aiClient = null;

if (apiKey) {
  try {
    aiClient = new Groq({ apiKey });
    console.log('Groq API initialized successfully.');
  } catch (error) {
    console.error('Failed to initialize Groq API client:', error.message);
  }
} else {
  console.warn('WARNING: GROQ_API_KEY not found in environment. AI features will run in mock demonstration mode.');
}

module.exports = {
  aiClient,
  isAiEnabled: !!aiClient
};
