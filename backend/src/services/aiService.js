const { aiClient, isAiEnabled } = require('../config/ai');

const GROQ_MODEL = 'llama-3.3-70b-versatile';

async function queryGroq(prompt, isJson = false) {
  if (!isAiEnabled) {
    throw new Error('Groq API is not enabled.');
  }

  try {
    const params = {
      model: GROQ_MODEL,
      messages: [{ role: 'user', content: prompt }],
    };

    if (isJson) {
      params.response_format = { type: 'json_object' };
    }

    const result = await aiClient.chat.completions.create(params);
    return result.choices[0].message.content;
  } catch (error) {
    console.error('Error during Groq API query:', error.message);
    throw error;
  }
}

/**
 * 1. AI Resume Enhancer
 * Takes input resume details and returns enhanced version
 */
async function enhanceResumeData(data) {
  if (!isAiEnabled) {
    return {
      summary: `Motivated and detail-oriented professional with experience in technical and academic environments. Skilled in building full-stack web applications using modern architectures. Proven ability to deliver quality projects, optimize performances, and collaborate effectively.`,
      experience: (data.experience || []).map(exp => ({
        ...exp,
        responsibilities: `Developed core features for ${exp.companyName || 'the team'} as a ${exp.jobTitle || 'Developer'}, improving application responsiveness and styling. Spearheaded API migrations and integrated client systems, resulting in enhanced data synchronization. Collaborated with cross-functional teams to outline feature requirements and refine deployment pipelines.`
      })),
      projects: (data.projects || []).map(proj => ({
        ...proj,
        description: `Successfully built and deployed ${proj.name}, leveraging ${proj.technologiesUsed || 'modern frameworks'} to implement secure, modular components. Engineered core features including file handling mechanisms and high-performance algorithms, improving efficiency by 25%.`
      })),
      suggestedSkills: ['REST APIs', 'TypeScript', 'Responsive Design', 'Git & CI/CD', 'Problem Solving'],
      suggestedKeywords: ['ATS optimization', 'Scalability', 'Full-stack integration', 'Responsive layout', 'Modular design']
    };
  }

  const mockEnhanced = (d) => ({
    summary: `Motivated and detail-oriented professional with experience in technical and academic environments. Skilled in building full-stack web applications using modern architectures. Proven ability to deliver quality projects, optimize performances, and collaborate effectively.`,
    experience: (d.experience || []).map(exp => ({
      ...exp,
      responsibilities: `Developed core features for ${exp.companyName || 'the team'} as a ${exp.jobTitle || 'Developer'}, improving application responsiveness and styling. Spearheaded API migrations and integrated client systems, resulting in enhanced data synchronization. Collaborated with cross-functional teams to outline feature requirements and refine deployment pipelines.`
    })),
    projects: (d.projects || []).map(proj => ({
      ...proj,
      description: `Successfully built and deployed ${proj.name || 'project'}, leveraging ${proj.technologiesUsed || 'modern frameworks'} to implement secure, modular components. Engineered core features including file handling mechanisms and high-performance algorithms, improving efficiency by 25%.`
    })),
    suggestedSkills: ['REST APIs', 'TypeScript', 'Responsive Design', 'Git & CI/CD', 'Problem Solving'],
    suggestedKeywords: ['ATS optimization', 'Scalability', 'Full-stack integration', 'Responsive layout', 'Modular design']
  });

  try {
    const prompt = `
      You are an expert ATS optimization consultant and professional resume writer.
      Given the following raw user details:
      ${JSON.stringify(data, null, 2)}

      Please enhance this resume content by doing the following:
      1. Generate a strong, professional Summary for their career profile.
      2. Rewrite each item in the Experience responsibilities list using strong action verbs and professional formatting.
      3. Rewrite each Project description to emphasize tech stack integration, problem solving, and metrics/impact where applicable.
      4. Suggest 5 additional Technical/Soft Skills that are missing but highly relevant.
      5. Suggest 5 high-impact ATS Keywords to include in this resume.

      Return ONLY a JSON object with the following schema:
      {
        "summary": "Generated summary text",
        "experience": [
          { "companyName": "Company", "jobTitle": "Title", "duration": "Duration", "responsibilities": "Rewritten responsibilities paragraph or bullet points" }
        ],
        "projects": [
          { "name": "Project Name", "description": "Rewritten description", "technologiesUsed": "Tech stack" }
        ],
        "suggestedSkills": ["Skill 1", "Skill 2", ...],
        "suggestedKeywords": ["Keyword 1", "Keyword 2", ...]
      }
    `;

    const responseText = await queryGroq(prompt, true);
    return JSON.parse(responseText);
  } catch (error) {
    console.error('Failed to enhance resume using AI. Falling back to mockup.', error.message);
    return mockEnhanced(data);
  }
}

/**
 * 2. ATS Resume Checker
 * Analyzes resume text against optional job description
 */
async function analyzeResumeATS(resumeText, jobDescription = '') {
  if (!isAiEnabled) {
    const score = Math.floor(Math.random() * 20) + 65;
    return {
      atsScore: score,
      keywordMatchScore: Math.floor(score * 0.95),
      formattingQuality: score > 75 ? 'Good' : 'Needs Optimization',
      skillsMatch: Math.floor(score * 1.05) > 100 ? 100 : Math.floor(score * 1.05),
      missingKeywords: ['CI/CD pipelines', 'Docker containerization', 'Agile methodologies', 'Webpack / Vite bundlers'],
      missingSkills: ['Unit Testing (Jest/Mocha)', 'Performance Auditing', 'State Management (Redux/Zustand)'],
      grammarReview: 'No critical spelling errors found. Consider active voice instead of passive voice in some experience statements.',
      sectionCompleteness: {
        personalDetails: true,
        education: true,
        experience: resumeText.toLowerCase().includes('experience') || resumeText.toLowerCase().includes('work'),
        projects: resumeText.toLowerCase().includes('project'),
        skills: resumeText.toLowerCase().includes('skills')
      },
      recommendations: [
        'Add the missing keywords listed above directly to your experience or skills section.',
        'Use standard, clean headers (e.g. "Work Experience" instead of "Where I Have Worked").',
        'Avoid multi-column tables which can sometimes break legacy ATS parsers.',
        'Quantify achievements (e.g., "Increased performance by 30%") to stand out.'
      ]
    };
  }

  try {
    const prompt = `
      You are an advanced ATS (Applicant Tracking System) parser and evaluator.
      Analyze the following resume text:
      --- RESUME TEXT ---
      ${resumeText}
      -------------------

      Target Job Description (Optional, if blank, evaluate general technical/industry fitness):
      --- JOB DESCRIPTION ---
      ${jobDescription}
      -----------------------

      Perform an in-depth audit of the resume. Check formatting quality, keyword matches, skills, grammar issues, and missing elements.
      Return ONLY a JSON object with this schema:
      {
        "atsScore": 75,
        "keywordMatchScore": 68,
        "formattingQuality": "Excellent | Good | Fair | Poor",
        "skillsMatch": 80,
        "missingKeywords": ["keyword1", "keyword2"],
        "missingSkills": ["skill1", "skill2"],
        "grammarReview": "Feedback on grammar, spelling, or structural improvements.",
        "sectionCompleteness": {
          "personalDetails": true,
          "education": true,
          "experience": true,
          "projects": true,
          "skills": true
        },
        "recommendations": [
          "Recommendation 1",
          "Recommendation 2"
        ]
      }
    `;

    const responseText = await queryGroq(prompt, true);
    return JSON.parse(responseText);
  } catch (error) {
    console.error('Failed to parse ATS using AI. Falling back to mock.', error.message);
    return {
      atsScore: 70,
      keywordMatchScore: 65,
      formattingQuality: 'Good',
      skillsMatch: 72,
      missingKeywords: ['Cloud services', 'Unit Testing', 'TypeScript'],
      missingSkills: ['System Design', 'CI/CD'],
      grammarReview: 'Looks structurally clean. Check spacing consistency.',
      sectionCompleteness: { personalDetails: true, education: true, experience: true, projects: true, skills: true },
      recommendations: ['Integrate standard cloud computing keywords', 'Ensure dates are right-aligned']
    };
  }
}

/**
 * 3. AI PDF Summarizer
 * Summarizes PDF text based on selected mode
 */
async function summarizeText(text, mode = 'detailed') {
  const modePrompts = {
    short: 'Write a brief, concise summary of maximum 150 words.',
    detailed: 'Write a highly detailed, comprehensive summary outlining all key arguments, methodologies, and findings.',
    'key-points': 'Extract all key bullet points, main conclusions, and critical facts.',
    'study-notes': 'Format as clean, study-ready notes with headings, sub-headings, and definitions.',
    'interview-notes': 'Generate a list of potential interview questions and answers based directly on this text, along with core takeaways.',
    'exam-prep': 'Summarize core themes, terms, and conceptual summaries designed for quick exam revision.'
  };

  const selectedPrompt = modePrompts[mode] || modePrompts['detailed'];

  if (!isAiEnabled) {
    return `### Summary (${mode.replace('-', ' ').toUpperCase()})
*Note: Running in demonstration mode as no Groq API Key is configured.*

1. **Overview**: The document provides analysis and specifications on the subject matter, detailing background requirements, modular execution models, and structural constraints.
2. **Key Concepts**:
   - **System Design**: Focuses on microservices, caching models, and local databases (like SQLite) for self-contained, high-performance environments.
   - **User Flow**: Emphasizes direct usability without login/signups to increase engagement and lower barriers to entry.
   - **Performance**: Highlighting file compression (PDF/Image) using optimized streams and lightweight memory footprints.
3. **Takeaway**: Designing a modern system requires a blend of beautiful UI, clean styling rules, robust input sanitization, and structured feedback mechanisms to capture user reviews.
4. **Study Reference**: Review Core API documentation and ensure environment configurations (\`.env\`) match the deployment server.`;
  }

  try {
    const prompt = `
      You are an academic researcher and expert technical writer.
      Summarize the following text based on this instruction: "${selectedPrompt}"

      --- TEXT TO SUMMARIZE ---
      ${text.substring(0, 40000)}
      -------------------------

      Return ONLY the summary formatted in clean, professional Markdown. Use headings, bullet points, or bold text appropriately.
    `;

    return await queryGroq(prompt, false);
  } catch (error) {
    console.error('Failed to summarize text using AI. Falling back to mock.', error.message);
    return `### Summary (${mode.toUpperCase()})
Could not connect to Groq API. Here is a generic summary of the text:
The document covers standard technical requirements, architectural patterns, and user flow definitions. It details core modules, file upload configurations, database storage configurations, and security protocols. Review individual section headers for specific operations.`;
  }
}

/**
 * 4. AI Interview Question Generator
 */
async function generateInterviewQuestions(setup) {
  if (!isAiEnabled) return null;
  try {
    const { role, experience, interviewType, difficulty, targetCompany, count } = setup;
    const prompt = `
      You are an expert technical interviewer and hiring manager.
      Generate ${count || 5} interview questions for a candidate.

      Role: ${role || 'Software Engineer'}
      Experience Level: ${experience || 'Mid-level'}
      Interview Type: ${interviewType || 'mixed'}
      Difficulty: ${difficulty || 'medium'}
      Target Company: ${targetCompany || 'Any'}

      Return ONLY a JSON array of question objects. Each object must have:
      - "category": one of "Coding", "System Design", "Technical", "HR", "Behavioral", "Mock Interview"
      - "title": the question text (detailed, specific)
      - "howToAnswer": a structured approach to answering this question
      - "keyPoints": array of 4-6 key points the answer should cover
      - "commonMistakes": array of 3-4 common mistakes to avoid
      - "sampleAnswer": a detailed 150-250 word sample answer
      - "followUpQuestions": array of 3 follow-up questions
      - "estimatedTime": estimated answer time in seconds (60-300)
      - "difficulty": "Easy", "Medium", or "Hard"

      Make questions realistic, specific to the role, and progressively harder.
      For coding questions, add a "coding" object with: "problem", "description", "examples" (array of {input,output,explanation}), "constraints", "approach", "timeComplexity", "spaceComplexity", "hints" (array).
      For system design questions, add a "systemDesign" object with: "problem", "requirements", "components" (array of strings), "considerations", "diagramDescription".

      Return ONLY valid JSON. No markdown. No explanation.
    `;
    const responseText = await queryGroq(prompt, true);
    const questions = JSON.parse(responseText);
    return Array.isArray(questions) ? questions : [];
  } catch (error) {
    console.error('Failed to generate interview questions via AI:', error.message);
    return null;
  }
}

/**
 * 5. AI Interview Answer Evaluator
 */
async function evaluateInterviewAnswer(question, answer) {
  if (!isAiEnabled) return null;
  try {
    const prompt = `
      You are a senior technical interviewer evaluating a candidate's answer.
      Question: ${typeof question === 'string' ? question : question.title}
      Candidate's Answer: ${answer}

      Evaluate the answer on these 5 dimensions (0-100 each):
      1. confidence - How confident and assured does the answer sound
      2. communication - Clarity and structure of the response
      3. technicalAccuracy - Correctness of technical content (0 if non-technical)
      4. grammar - Grammar, spelling, and language quality
      5. clarity - How clear and well-organized the answer is

      Also provide:
      - overall: weighted average of all 5 scores
      - suggestions: array of 2-4 specific, actionable improvement suggestions

      Return ONLY a JSON object with this exact schema:
      {
        "confidence": 75,
        "communication": 80,
        "technicalAccuracy": 70,
        "grammar": 85,
        "clarity": 78,
        "overall": 78,
        "suggestions": ["suggestion1", "suggestion2"]
      }
    `;
    const responseText = await queryGroq(prompt, true);
    return JSON.parse(responseText);
  } catch (error) {
    console.error('Failed to evaluate interview answer via AI:', error.message);
    return null;
  }
}

/**
 * 6. AI Cover Letter Generator
 */
async function generateCoverLetterAI(fields, tone, length) {
  if (!isAiEnabled) return null;
  try {
    const { company, role, hiringManager, experience, skills, achievements } = fields;
    const prompt = `
      Write a professional cover letter for a job application.
      Company: ${company || 'the company'}
      Position: ${role || 'the position'}
      Hiring Manager: ${hiringManager || 'Hiring Manager'}
      Experience: ${experience || 'relevant experience'}
      Skills: ${skills || 'technical skills'}
      Achievements: ${achievements || 'none specified'}
      Tone: ${tone || 'Professional'}
      Length: ${length || 'Standard (250-350 words)'}

      Format it as a proper cover letter with greeting, body paragraphs, and closing.
      Make it compelling, specific to the role, and well-structured.
      Return ONLY the cover letter text. No JSON. No markdown formatting.
    `;
    const result = await queryGroq(prompt, false);
    return result;
  } catch (error) {
    console.error('Failed to generate cover letter via AI:', error.message);
    return null;
  }
}

/**
 * 7. AI Cover Letter Improver
 */
async function improveCoverLetter(text) {
  if (!isAiEnabled) return null;
  try {
    const prompt = `
      Analyze this cover letter and provide 4-5 specific, actionable improvement suggestions.
      Cover Letter:
      ---
      ${text}
      ---

      Return ONLY a JSON array of suggestion strings. Each suggestion should be specific to the content provided.
      Example: ["Add a specific metric to quantify your achievement in paragraph 2", ...]
    `;
    const responseText = await queryGroq(prompt, true);
    const suggestions = JSON.parse(responseText);
    return Array.isArray(suggestions) ? suggestions : [];
  } catch (error) {
    console.error('Failed to improve cover letter via AI:', error.message);
    return null;
  }
}

/**
 * 8. AI Corporate Translator
 */
async function translateTextAI(text, direction, toneId) {
  if (!isAiEnabled) return null;
  try {
    const dirLabel = direction === 'simpleToCorporate' ? 'plain English to corporate speak' : 'corporate jargon to plain English';
    const prompt = `
      Translate the following text from ${dirLabel}.
      Tone: ${toneId || 'formal'}

      Text to translate:
      ---
      ${text}
      ---

      Rules:
      - Preserve the original meaning exactly
      - Use natural, fluent phrasing (not word-for-word replacement)
      - Match the requested tone level
      - Keep the same number of paragraphs

      Return ONLY the translated text. No explanation. No quotes around it.
    `;
    const result = await queryGroq(prompt, false);
    return result;
  } catch (error) {
    console.error('Failed to translate text via AI:', error.message);
    return null;
  }
}

/**
 * 9. AI Email Generator
 */
async function generateEmailAI(type, fields, tone, length) {
  if (!isAiEnabled) return null;
  try {
    const fieldStr = Object.entries(fields).filter(([,v]) => v).map(([k,v]) => `${k}: ${v}`).join('\n');
    const typeLabels = {
      linkedin: 'LinkedIn connection request message',
      cold: 'cold outreach email to a hiring manager',
      referral: 'referral request email',
      networking: 'networking outreach message',
      followup: 'follow-up email to a recruiter',
      thankyou: 'post-interview thank-you email',
    };
    const prompt = `
      Write a ${typeLabels[type] || 'professional email'}.
      Details:
      ${fieldStr || 'No specific details provided'}

      Tone: ${tone || 'Professional'}
      Length: ${length || 'Standard'}

      Make it natural, personalized, and compelling.
      Return ONLY the message/email text. No JSON. No markdown. No subject line.
    `;
    const result = await queryGroq(prompt, false);
    return result;
  } catch (error) {
    console.error('Failed to generate email via AI:', error.message);
    return null;
  }
}

/**
 * 10. AI LinkedIn Content Generator
 */
async function generateLinkedInContent(type, data) {
  if (!isAiEnabled) return null;
  try {
    const fieldStr = Object.entries(data).filter(([,v]) => v).map(([k,v]) => `${k}: ${v}`).join('\n');
    const typeLabels = {
      headline: 'LinkedIn headline',
      about: 'LinkedIn About/Summary section',
      post: 'LinkedIn post',
      hashtags: 'LinkedIn hashtags',
    };
    const prompt = `
      Generate a ${typeLabels[type] || 'LinkedIn content'}.
      Details:
      ${fieldStr || 'No specific details provided'}

      Rules:
      - Professional but engaging
      - Optimized for LinkedIn search/algorithm
      - ${type === 'post' ? 'Write in first person, use line breaks for readability, include a call to action' : ''}
      - ${type === 'headline' ? 'Keep under 220 characters, include role + key skills + value proposition' : ''}
      - ${type === 'about' ? 'Write 3-4 paragraphs, start with a hook, include keywords naturally' : ''}
      - ${type === 'hashtags' ? 'Return 8-12 relevant hashtags, one per line, include #' : ''}

      Return ONLY the content. No JSON. No markdown.
    `;
    const result = await queryGroq(prompt, false);
    return result;
  } catch (error) {
    console.error('Failed to generate LinkedIn content via AI:', error.message);
    return null;
  }
}

/**
 * 11. AI Excuse Generator
 */
async function generateExcuseAI(category, tone, context) {
  if (!isAiEnabled) return null;
  try {
    const prompt = `
      Generate 3 creative, believable work excuses.
      Category: ${category || 'general'}
      Tone: ${tone || 'professional'}
      Context: ${context || 'none provided'}

      Return ONLY a JSON array of 3 excuse strings. Each excuse should be 1-3 sentences.
      Example: ["Excuse 1 text", "Excuse 2 text", "Excuse 3 text"]
    `;
    const responseText = await queryGroq(prompt, true);
    const excuses = JSON.parse(responseText);
    return Array.isArray(excuses) ? excuses : [];
  } catch (error) {
    console.error('Failed to generate excuse via AI:', error.message);
    return null;
  }
}

/**
 * 12. AI Resignation & Handover Generator
 */
async function generateResignationAI(type, inputs) {
  if (!isAiEnabled) return null;
  try {
    const fieldStr = Object.entries(inputs).filter(([,v]) => v).map(([k,v]) => `${k}: ${v}`).join('\n');
    const typeLabels = {
      letter: 'formal resignation letter',
      noticeMail: 'resignation notification email',
      managerMail: 'personal email to your manager about resignation',
      knowledgeTransfer: 'knowledge transfer document',
      taskHandover: 'task handover document',
      assetChecklist: 'asset return checklist',
      exitChecklist: 'exit process checklist',
    };
    const prompt = `
      Write a ${typeLabels[type] || 'resignation document'}.
      Details:
      ${fieldStr || 'No specific details provided'}

      Make it professional, well-structured, and appropriate for the document type.
      Return ONLY the document text. No JSON. No markdown. No extra explanation.
    `;
    const result = await queryGroq(prompt, false);
    return result;
  } catch (error) {
    console.error('Failed to generate resignation document via AI:', error.message);
    return null;
  }
}

module.exports = {
  enhanceResumeData,
  analyzeResumeATS,
  summarizeText,
  generateInterviewQuestions,
  evaluateInterviewAnswer,
  generateCoverLetterAI,
  improveCoverLetter,
  translateTextAI,
  generateEmailAI,
  generateLinkedInContent,
  generateExcuseAI,
  generateResignationAI,
};
