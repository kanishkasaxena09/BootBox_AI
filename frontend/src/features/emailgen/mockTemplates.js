export const tabs = [
  { id: 'linkedin', name: 'LinkedIn Message', icon: '💼', desc: 'Connect with professionals' },
  { id: 'cold', name: 'Cold Email', icon: '📧', desc: 'Reach out to hiring managers' },
  { id: 'referral', name: 'Referral Request', icon: '🤝', desc: 'Ask for employee referrals' },
  { id: 'networking', name: 'Networking Message', icon: '🌐', desc: 'Build professional relationships' },
  { id: 'followup', name: 'Recruiter Follow-up', icon: '📞', desc: 'Follow up after application' },
  { id: 'thankyou', name: 'Thank You Email', icon: '🙏', desc: 'Post-interview gratitude' },
];

export const tones = ['Professional', 'Friendly', 'Formal', 'Casual', 'Enthusiastic', 'Confident'];
export const lengths = ['Short (50-100 words)', 'Medium (100-200 words)', 'Long (200-300 words)'];

export const tabFields = {
  linkedin: [
    { key: 'recipientName', label: 'Recipient Name', placeholder: 'e.g. Sarah Chen', type: 'input' },
    { key: 'recipientRole', label: 'Their Role', placeholder: 'e.g. Engineering Manager', type: 'input' },
    { key: 'recipientCompany', label: 'Their Company', placeholder: 'e.g. Google', type: 'input' },
    { key: 'connectionType', label: 'Connection Type', type: 'select', options: ['1st Connection', '2nd Connection', '3rd Connection', 'Not Connected'] },
    { key: 'purpose', label: 'Purpose', type: 'select', options: ['Job Opportunity', 'Ask for Referral', 'Informational Interview', 'Networking', 'Collaboration'] },
    { key: 'yourRole', label: 'Your Current Role', placeholder: 'e.g. Senior Frontend Developer', type: 'input' },
    { key: 'personalNote', label: 'Personal Note', placeholder: 'e.g. I admired your talk at React Conf...', type: 'textarea' },
  ],
  cold: [
    { key: 'recipientName', label: 'Hiring Manager Name', placeholder: 'e.g. James Wilson', type: 'input' },
    { key: 'recipientTitle', label: 'Their Title', placeholder: 'e.g. VP of Engineering', type: 'input' },
    { key: 'company', label: 'Company', placeholder: 'e.g. Stripe', type: 'input' },
    { key: 'position', label: 'Position You\'re Applying For', placeholder: 'e.g. Senior Software Engineer', type: 'input' },
    { key: 'yourRole', label: 'Your Current Role', placeholder: 'e.g. Software Engineer at Meta', type: 'input' },
    { key: 'topAchievement', label: 'Top Achievement', placeholder: 'e.g. Led a team of 5, shipped a product used by 1M+ users', type: 'textarea' },
    { key: 'whyCompany', label: 'Why This Company', placeholder: 'e.g. I admire your mission to...', type: 'textarea' },
    { key: 'subjectLine', label: 'Subject Line (auto-generated)', placeholder: 'Left blank to auto-generate', type: 'input' },
  ],
  referral: [
    { key: 'referrerName', label: 'Referrer Name', placeholder: 'e.g. Alex Kim', type: 'input' },
    { key: 'referrerCompany', label: 'Their Company', placeholder: 'e.g. Amazon', type: 'input' },
    { key: 'relationship', label: 'Your Relationship', type: 'select', options: ['Former Colleague', 'College Friend', 'Met at Event', 'LinkedIn Connection', 'Mutual Friend'] },
    { key: 'targetRole', label: 'Target Role', placeholder: 'e.g. Backend Engineer', type: 'input' },
    { key: 'targetTeam', label: 'Target Team (if known)', placeholder: 'e.g. AWS Infrastructure', type: 'input' },
    { key: 'yourRole', label: 'Your Current Role', placeholder: 'e.g. Software Engineer at Netflix', type: 'input' },
    { key: 'whyFit', label: 'Why You\'re a Good Fit', placeholder: 'e.g. I have 3 years of distributed systems experience...', type: 'textarea' },
  ],
  networking: [
    { key: 'recipientName', label: 'Their Name', placeholder: 'e.g. Dr. Maya Patel', type: 'input' },
    { key: 'recipientRole', label: 'Their Role', placeholder: 'e.g. Principal Engineer', type: 'input' },
    { key: 'recipientCompany', label: 'Their Company', placeholder: 'e.g. Netflix', type: 'input' },
    { key: 'context', label: 'How You Found Them', type: 'select', options: ['Tech Blog / Article', 'Conference Talk', 'Open Source Project', 'Podcast', 'LinkedIn Post', 'Mutual Connection'] },
    { key: 'contextDetail', label: 'Specific Detail', placeholder: 'e.g. Your article on CRDTs was insightful', type: 'textarea' },
    { key: 'yourRole', label: 'Your Current Role', placeholder: 'e.g. Software Engineer', type: 'input' },
    { key: 'ask', label: 'What You\'re Asking', type: 'select', options: ['15-min Coffee Chat', 'Advice on Career Path', 'Insights on Their Company', 'Mentorship', 'General Networking'] },
  ],
  followup: [
    { key: 'recruiterName', label: 'Recruiter Name', placeholder: 'e.g. Lisa Johnson', type: 'input' },
    { key: 'company', label: 'Company', placeholder: 'e.g. Microsoft', type: 'input' },
    { key: 'position', label: 'Position Applied For', placeholder: 'e.g. Full Stack Developer', type: 'input' },
    { key: 'applicationDate', label: 'When You Applied', placeholder: 'e.g. March 15, 2026', type: 'input' },
    { key: 'lastContact', label: 'Last Contact Date', placeholder: 'e.g. March 20, 2026', type: 'input' },
    { key: 'newDevelopment', label: 'New Development Since', placeholder: 'e.g. Completed a relevant certification...', type: 'textarea' },
    { key: 'reiterateInterest', label: 'Why You\'re Still Interested', placeholder: 'e.g. After learning more about the team...', type: 'textarea' },
  ],
  thankyou: [
    { key: 'interviewerName', label: 'Interviewer Name', placeholder: 'e.g. Robert Zhang', type: 'input' },
    { key: 'interviewerRole', label: 'Their Role', placeholder: 'e.g. Senior Engineering Manager', type: 'input' },
    { key: 'company', label: 'Company', placeholder: 'e.g. Apple', type: 'input' },
    { key: 'position', label: 'Position Interviewed For', placeholder: 'e.g. iOS Developer', type: 'input' },
    { key: 'interviewDate', label: 'Interview Date', placeholder: 'e.g. March 22, 2026', type: 'input' },
    { key: 'topicsDiscussed', label: 'Topics Discussed', placeholder: 'e.g. System design for iMessage, team culture, growth path', type: 'textarea' },
    { key: 'followUpAnswer', label: 'A Follow-up Answer', placeholder: 'e.g. I wanted to expand on the question about...', type: 'textarea' },
    { key: 'extras', label: 'Anything Else to Mention', placeholder: 'e.g. I recently published an article on...', type: 'textarea' },
  ],
};

const charLimits = {
  linkedin: 300,
  cold: 2000,
  referral: 1500,
  networking: 1500,
  followup: 1500,
  thankyou: 1200,
};

export const getCharLimit = (tab) => charLimits[tab] || 2000;

const wordCount = (text) => text.trim().split(/\s+/).filter(Boolean).length;

const generateLinkedIn = (fields, tone, length) => {
  const { recipientName, recipientRole, recipientCompany, connectionType, purpose, yourRole, personalNote } = fields;
  const name = recipientName || 'there';
  const role = recipientRole || 'your team';
  const company = recipientCompany || 'your company';
  const your = yourRole || 'a software engineer';

  const openers = {
    'Job Opportunity': `Hi ${name},\n\nI hope this message finds you well. I came across your profile and was impressed by your work as ${role} at ${company}.`,
    'Ask for Referral': `Hi ${name},\n\nI hope you're doing well! I noticed you're a ${role} at ${company}, and I'm very interested in joining the team.`,
    'Informational Interview': `Hi ${name},\n\nI've been following your work at ${company} and found your perspective as ${role} truly insightful.`,
    'Networking': `Hi ${name},\n\nI noticed we're both in the ${company} ecosystem, and I'd love to connect with a ${role} like yourself.`,
    'Collaboration': `Hi ${name},\n\nI've been working on something that I think could be valuable for ${company}'s ${role} team.`,
  };

  const bodies = {
    'Job Opportunity': `As ${your}, I'm exploring new opportunities where I can contribute to impactful products. ${company}'s mission resonates deeply with me, and I believe my experience aligns well with what your team is building.\n\n${personalNote ? `I also wanted to mention: ${personalNote}\n\n` : ''}I'd love to learn more about the engineering culture at ${company} and any open opportunities. Would you be open to a brief chat?`,
    'Ask for Referral': `I'm applying for a position at ${company} and would be grateful if you could consider referring me. I have strong experience as ${your}, and I'm confident I can add value to the team.\n\n${personalNote ? `A bit more context: ${personalNote}\n\n` : ''}I understand referrals take time, so I truly appreciate any consideration. I've attached my resume for your reference.`,
    'Informational Interview': `I'm currently ${your} and am exploring career paths in the industry. I would greatly appreciate 15-20 minutes of your time to hear about your journey at ${company} and any advice you might have.\n\n${personalNote ? `I was particularly inspired by: ${personalNote}\n\n` : ''}I'm flexible with timing and happy to work around your schedule.`,
    'Networking': `I'm passionate about the space ${company} operates in and would love to build a professional relationship with someone of your caliber.\n\n${personalNote ? `I especially appreciated: ${personalNote}\n\n` : ''}Even if just to stay connected and share insights, I think there's mutual value in knowing each other.`,
    'Collaboration': `I've been working on a project that I believe could complement ${company}'s efforts in this space.\n\n${personalNote ? `Here's what inspired me: ${personalNote}\n\n` : ''}I'd love to explore if there's an opportunity to collaborate or share ideas. Would you be open to discussing this further?`,
  };

  const closings = {
    Friendly: 'Looking forward to connecting!',
    Formal: 'I look forward to hearing from you at your earliest convenience.',
    Enthusiastic: 'Really excited about the possibility of connecting!',
    Casual: 'Hope to hear from you!',
    Confident: 'I believe this could be a great connection for both of us.',
    Professional: 'Thank you for your time and consideration.',
  };

  return `${openers[purpose] || openers['Job Opportunity']}\n\n${bodies[purpose] || bodies['Job Opportunity']}\n\n${closings[tone] || closings['Professional']}\n\nBest regards,\n[Your Name]`;
};

const generateColdEmail = (fields, tone, length) => {
  const { recipientName, recipientTitle, company, position, yourRole, topAchievement, whyCompany, subjectLine } = fields;
  const name = recipientName || 'Hiring Manager';
  const title = recipientTitle || '';
  const comp = company || 'your company';
  const pos = position || 'the open position';
  const your = yourRole || 'a software engineer';

  const subject = subjectLine || `Application for ${pos} — Passionate About ${comp}'s Mission`;

  return `Subject: ${subject}\n\nDear ${name}${title ? `, ${title}` : ''},\n\nI am writing to express my strong interest in the ${pos} position at ${comp}. As ${your}, I have been following ${comp}'s innovative work and am eager to contribute to your team.\n\n${topAchievement ? `A highlight of my career: ${topAchievement}.\n\n` : ''}${whyCompany ? `What draws me to ${comp}: ${whyCompany}\n\n` : ''}I am confident that my technical skills and passion for building impactful products make me a strong candidate. I would welcome the opportunity to discuss how my background aligns with your team's goals.\n\nI have attached my resume for your review. Please let me know if there is a convenient time to connect.\n\nThank you for your time and consideration.\n\nBest regards,\n[Your Name]\n[Your Email]\n[Your Phone]`;
};

const generateReferral = (fields, tone, length) => {
  const { referrerName, referrerCompany, relationship, targetRole, targetTeam, yourRole, whyFit } = fields;
  const name = referrerName || 'there';
  const comp = referrerCompany || 'your company';
  const role = targetRole || 'a position';
  const team = targetTeam || '';
  const your = yourRole || 'a software engineer';

  const relOpener = {
    'Former Colleague': `Hi ${name},\n\nI hope you've been doing well since we worked together! It's been a while, but I've been following ${comp}'s growth with great interest.`,
    'College Friend': `Hi ${name},\n\nHope life's treating you well! It's been great seeing your career journey at ${comp}.`,
    'Met at Event': `Hi ${name},\n\nIt was great meeting you at the recent event. I really enjoyed our conversation about the industry.`,
    'LinkedIn Connection': `Hi ${name},\n\nI've been following your posts on LinkedIn and have really valued your insights about working at ${comp}.`,
    'Mutual Friend': `Hi ${name},\n\n[Mutual Friend] suggested I reach out to you. I've heard great things about your experience at ${comp}.`,
  };

  return `${relOpener[relationship] || relOpener['LinkedIn Connection']}\n\nI'm currently ${your} and I'm very interested in the ${role} position${team ? ` on the ${team} team` : ''} at ${comp}. I believe my background makes me a strong fit.\n\n${whyFit ? `Here's why I think I'd be a good match:\n${whyFit}\n\n` : ''}Would you be open to referring me for this role? I completely understand if you're not comfortable, and I appreciate you even considering it.\n\nI've attached my resume for your reference. Thank you so much for your time — I know how valuable it is.\n\nBest regards,\n[Your Name]`;
};

const generateNetworking = (fields, tone, length) => {
  const { recipientName, recipientRole, recipientCompany, context, contextDetail, yourRole, ask } = fields;
  const name = recipientName || 'there';
  const role = recipientRole || 'your role';
  const comp = recipientCompany || 'your company';
  const your = yourRole || 'a software engineer';

  const contextOpeners = {
    'Tech Blog / Article': `Hi ${name},\n\nI recently read your article and was genuinely impressed by your deep expertise as ${role} at ${comp}.`,
    'Conference Talk': `Hi ${name},\n\nI had the privilege of attending your talk at the recent conference, and it left a lasting impression on me.`,
    'Open Source Project': `Hi ${name},\n\nI've been using and contributing to your open source project, and I'm continually impressed by the architecture and design decisions.`,
    'Podcast': `Hi ${name},\n\nI recently listened to your podcast episode and was inspired by your journey as ${role} at ${comp}.`,
    'LinkedIn Post': `Hi ${name},\n\nYour recent LinkedIn post really resonated with me, especially your thoughts on the industry.`,
    'Mutual Connection': `Hi ${name},\n\nA mutual connection recommended I reach out to you. I've been following your impressive work at ${comp}.`,
  };

  const asks = {
    '15-min Coffee Chat': `I would love the opportunity to buy you a virtual coffee and hear more about your experience. Even 15 minutes of your time would be incredibly valuable to me.`,
    'Advice on Career Path': `I'm at a pivotal point in my career and would greatly appreciate your advice on navigating the industry. Your perspective as ${role} would be especially helpful.`,
    'Insights on Their Company': `I'm very curious about the culture and technical challenges at ${comp}. As someone on the inside, your insights would be invaluable.`,
    'Mentorship': `I've been looking for a mentor in the industry, and your journey and expertise align perfectly with the guidance I'm seeking. Would you be open to occasional mentorship conversations?`,
    'General Networking': `I believe there's great value in connecting with experienced professionals like yourself. I'd love to stay in touch and share insights over time.`,
  };

  return `${contextOpeners[context] || contextOpeners['LinkedIn Post']}\n\n${contextDetail ? `${contextDetail}\n\n` : ''}I'm currently ${your}, and ${asks[ask] || asks['General Networking']}\n\nI'm flexible with scheduling and happy to work around your availability.\n\nThank you for considering my request. Looking forward to connecting!\n\nBest regards,\n[Your Name]`;
};

const generateFollowUp = (fields, tone, length) => {
  const { recruiterName, company, position, applicationDate, lastContact, newDevelopment, reiterateInterest } = fields;
  const name = recruiterName || 'there';
  const comp = company || 'your company';
  const pos = position || 'the position';

  return `Subject: Following Up — ${pos} Application at ${comp}\n\nDear ${name},\n\nI hope this message finds you well. I wanted to follow up on my application for the ${pos} position at ${comp}${applicationDate ? `, which I submitted on ${applicationDate}` : ''}.\n\n${reiterateInterest ? `Since my last update${lastContact ? ` on ${lastContact}` : ''}, I've remained very enthusiastic about this opportunity. ${reiterateInterest}\n\n` : `I remain very enthusiastic about the opportunity to join ${comp}'s team.\n\n`}${newDevelopment ? `Additionally, I wanted to share a recent update: ${newDevelopment}\n\n` : ''}Please let me know if there is any additional information I can provide or if there are updates on the hiring timeline. I would welcome the chance to discuss my qualifications further.\n\nThank you for your time and consideration.\n\nBest regards,\n[Your Name]`;
};

const generateThankYou = (fields, tone, length) => {
  const { interviewerName, interviewerRole, company, position, interviewDate, topicsDiscussed, followUpAnswer, extras } = fields;
  const name = interviewerName || 'there';
  const role = interviewerRole || '';
  const comp = company || 'your company';
  const pos = position || 'the position';

  return `Subject: Thank You — ${pos} Interview at ${comp}\n\nDear ${name}${role ? `, ${role}` : ''},\n\nThank you so much for taking the time to${interviewDate ? ` meet with me on ${interviewDate}` : ''} to discuss the ${pos} position at ${comp}. I truly enjoyed our conversation and learning more about the team.\n\n${topicsDiscussed ? `Our discussion about ${topicsDiscussed} particularly resonated with me. It reinforced my excitement about the opportunity to contribute to ${comp}'s mission.\n\n` : ''}${followUpAnswer ? `I also wanted to follow up on something from our conversation: ${followUpAnswer}\n\n` : ''}${extras ? `${extras}\n\n` : ''}I am confident that my skills and enthusiasm make me a strong fit for this role and for ${comp}'s culture. Please do not hesitate to reach out if you need any additional information.\n\nThank you again for this wonderful opportunity.\n\nWarm regards,\n[Your Name]`;
};

const generators = {
  linkedin: generateLinkedIn,
  cold: generateColdEmail,
  referral: generateReferral,
  networking: generateNetworking,
  followup: generateFollowUp,
  thankyou: generateThankYou,
};

export const generateOutput = async (tab, fields, tone, length) => {
  try {
    const res = await fetch('/api/email/generate', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ type: tab, fields, tone, length }),
    });
    if (res.ok) {
      const data = await res.json();
      if (!data.fallback && data.content) return data.content;
    }
  } catch (e) {
    console.warn('AI email generation failed, using mock:', e.message);
  }

  const gen = generators[tab];
  if (!gen) return 'Select a tab and fill in the details to generate content.';
  return gen(fields, tone, length);
};
