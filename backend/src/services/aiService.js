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

module.exports = {
  enhanceResumeData,
  analyzeResumeATS,
  summarizeText
};
