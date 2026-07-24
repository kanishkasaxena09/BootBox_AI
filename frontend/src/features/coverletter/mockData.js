export const tones = ['Professional', 'Friendly', 'Formal', 'Confident', 'Enthusiastic', 'Humble'];
export const lengths = ['Concise (150-200 words)', 'Standard (250-350 words)', 'Detailed (400-500 words)'];

export const toneGuides = {
  Professional: 'Use clear, direct language. Focus on qualifications and results.',
  Friendly: 'Warm but professional tone. Show personality while maintaining credibility.',
  Formal: 'Traditional business letter format. Formal language and structure.',
  Confident: 'Assertive language. Highlight achievements boldly.',
  Enthusiastic: 'Show genuine excitement about the role and company.',
  Humble: 'Grateful tone. Emphasize eagerness to learn and contribute.',
};

const openings = {
  Professional: (role, company, manager) =>
    `Dear ${manager || 'Hiring Manager'},\n\nI am writing to express my interest in the ${role} position at ${company}. With my background and skills, I am confident I can make a meaningful contribution to your team.`,
  Friendly: (role, company, manager) =>
    `Dear ${manager || 'Hiring Manager'},\n\nI was excited to come across the ${role} opportunity at ${company} — it immediately caught my attention, and I knew I had to reach out.`,
  Formal: (role, company, manager) =>
    `Dear ${manager || 'Hiring Manager'},\n\nPlease accept this letter as my application for the ${role} position at ${company}. I believe my qualifications align well with the requirements of this role.`,
  Confident: (role, company, manager) =>
    `Dear ${manager || 'Hiring Manager'},\n\nI am the ${role} your team needs at ${company}. My track record of delivering results speaks for itself, and I am ready to bring that same impact to your organization.`,
  Enthusiastic: (role, company, manager) =>
    `Dear ${manager || 'Hiring Manager'},\n\nI am thrilled to apply for the ${role} position at ${company}! The opportunity to contribute to your team's mission is exactly the kind of challenge I have been looking for.`,
  Humble: (role, company, manager) =>
    `Dear ${manager || 'Hiring Manager'},\n\nI am grateful for the opportunity to apply for the ${role} position at ${company}. I am eager to learn, grow, and contribute meaningfully to your team.`,
};

const closings = {
  Professional: 'Thank you for considering my application. I look forward to the opportunity to discuss how I can contribute to your team.',
  Friendly: "I'd love the chance to chat more about this role. Thanks so much for your time — I really appreciate it!",
  Formal: 'I appreciate your time and consideration. I am available at your earliest convenience for an interview.',
  Confident: "I am ready to hit the ground running. Let's schedule a conversation to discuss how I can drive results for your team.",
  Enthusiastic: "I can't wait to hear from you! Thank you so much for considering my application — I'm genuinely excited about this opportunity.",
  Humble: 'Thank you sincerely for your time and consideration. I would be honored to have the opportunity to contribute to your team.',
};

export const generateCoverLetter = async (fields, tone, length) => {
  try {
    const res = await fetch('/api/coverletter/generate', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ fields, tone, length }),
    });
    if (res.ok) {
      const data = await res.json();
      if (!data.fallback && data.content) return data.content;
    }
  } catch (e) {
    console.warn('AI cover letter generation failed, using mock:', e.message);
  }

  const { company, role, hiringManager, experience, skills, achievements } = fields;
  const comp = company || 'your company';
  const pos = role || 'the open position';
  const manager = hiringManager || '';
  const exp = experience || 'relevant experience';
  const sk = skills || 'my skill set';
  const ach = achievements || '';

  const opening = (openings[tone] || openings.Professional)(pos, comp, manager);

  const bodyParagraphs = [];

  if (experience) {
    bodyParagraphs.push(
      `Over the course of ${exp}, I have developed a strong foundation in building scalable, high-quality solutions. ` +
      `This experience has prepared me to tackle the challenges of the ${pos} role at ${comp} with confidence and precision.`
    );
  } else {
    bodyParagraphs.push(
      `My professional experience has equipped me with a diverse skill set that aligns well with the demands of this role. ` +
      `I am confident that my background will enable me to make an immediate impact at ${comp}.`
    );
  }

  if (skills) {
    bodyParagraphs.push(
      `My key strengths include ${sk}, which I believe are directly relevant to this position. ` +
      `I am particularly drawn to how ${comp} leverages these technologies and approaches, and I am eager to bring my expertise to your team.`
    );
  }

  if (achievements) {
    bodyParagraphs.push(
      `Among my proudest accomplishments: ${ach}. ` +
      `These experiences have taught me the value of diligence, creativity, and collaboration — qualities I am eager to bring to ${comp}.`
    );
  }

  bodyParagraphs.push(
    `What excites me most about ${comp} is the opportunity to work alongside talented professionals who share a commitment to excellence. ` +
    `I am confident that my passion for this field, combined with my technical abilities, will allow me to contribute meaningfully from day one.`
  );

  const closing = closings[tone] || closings.Professional;

  const body = bodyParagraphs.join('\n\n');

  return `${opening}\n\n${body}\n\n${closing}\n\nSincerely,\n[Your Name]\n[Your Email]\n[Your Phone]`;
};

export const generateImprovements = async (text) => {
  if (!text) return [];
  try {
    const res = await fetch('/api/coverletter/improve', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ text }),
    });
    if (res.ok) {
      const data = await res.json();
      if (!data.fallback && data.suggestions && data.suggestions.length > 0) return data.suggestions;
    }
  } catch (e) {
    console.warn('AI cover letter improvement failed, using mock:', e.message);
  }
  return [
    'Consider adding a specific metric or number to quantify your achievements (e.g., "improved performance by 40%").',
    'Tailor the opening paragraph to reference something specific about the company — a recent product launch, mission statement, or news.',
    'Add a sentence connecting your experience directly to the job requirements listed in the posting.',
    'Consider mentioning a mutual connection or referral if applicable — it adds credibility.',
    'End with a more specific call-to-action, such as "I would welcome the chance to discuss how my skills in X align with your team\'s goals."',
  ];
};
