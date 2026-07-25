export const TONES = {
  professional: {
    id: 'professional',
    label: 'Professional',
    icon: 'Briefcase',
    color: '#6366f1',
    desc: 'Formal, polished, workplace-ready',
    transforms: [
      [/\butilize\b/gi, 'use'],
      [/\bcommence\b/gi, 'start'],
      [/\bfacilitate\b/gi, 'help'],
      [/\bimplement\b/gi, 'carry out'],
      [/\bdemonstrate\b/gi, 'show'],
      [/\bapproximately\b/gi, 'about'],
      [/\bsubsequently\b/gi, 'then'],
      [/\bin order to\b/gi, 'to'],
      [/\bwith regard to\b/gi, 'about'],
      [/\bat this point in time\b/gi, 'now'],
      [/\bin the event that\b/gi, 'if'],
      [/\bprior to\b/gi, 'before'],
      [/\bsubsequent to\b/gi, 'after'],
      [/\bin the near future\b/gi, 'soon'],
      [/\btake into consideration\b/gi, 'consider'],
    ],
  },
  student: {
    id: 'student',
    label: 'Student',
    icon: 'GraduationCap',
    color: '#10b981',
    desc: 'Simple, clear, easy to understand',
    transforms: [
      [/\butilize\b/gi, 'use'],
      [/\bcommence\b/gi, 'begin'],
      [/\bfacilitate\b/gi, 'make easier'],
      [/\bimplement\b/gi, 'set up'],
      [/\bdemonstrate\b/gi, 'show'],
      [/\bapproximately\b/gi, 'about'],
      [/\bsubsequently\b/gi, 'after that'],
      [/\bin order to\b/gi, 'to'],
      [/\bmoreover\b/gi, 'also'],
      [/\bfurthermore\b/gi, 'also'],
      [/\bnevertheless\b/gi, 'but'],
      [/\bconsequently\b/gi, 'so'],
      [/\bsignificantly\b/gi, 'a lot'],
      [/\bfundamental\b/gi, 'basic'],
      [/\bessential\b/gi, 'important'],
    ],
  },
  casual: {
    id: 'casual',
    label: 'Casual',
    icon: 'MessageCircle',
    color: '#f59e0b',
    desc: 'Relaxed, conversational, friendly',
    transforms: [
      [/\butilize\b/gi, 'use'],
      [/\bcommence\b/gi, 'kick off'],
      [/\bfacilitate\b/gi, 'help out with'],
      [/\bimplement\b/gi, 'put in place'],
      [/\bdemonstrate\b/gi, 'show'],
      [/\bapproximately\b/gi, 'around'],
      [/\bsubsequently\b/gi, 'then'],
      [/\bin order to\b/gi, 'to'],
      [/\bmoreover\b/gi, 'plus'],
      [/\bfurthermore\b/gi, 'and also'],
      [/\bnevertheless\b/gi, 'but still'],
      [/\bconsequently\b/gi, 'so'],
      [/\bit is important to note that\b/gi, 'keep in mind that'],
      [/\bin conclusion\b/gi, 'to wrap it up'],
      [/\bregarding\b/gi, 'about'],
    ],
  },
  academic: {
    id: 'academic',
    label: 'Academic',
    icon: 'BookOpen',
    color: '#8b5cf6',
    desc: 'Scholarly, precise, well-structured',
    transforms: [
      [/\butilize\b/gi, 'employ'],
      [/\bcommence\b/gi, 'initiate'],
      [/\bfacilitate\b/gi, 'enable'],
      [/\bimplement\b/gi, 'execute'],
      [/\bdemonstrate\b/gi, 'illustrate'],
      [/\bapproximately\b/gi, 'roughly'],
      [/\bsubsequently\b/gi, 'thereafter'],
      [/\bin order to\b/gi, 'to'],
      [/\bmoreover\b/gi, 'furthermore'],
      [/\bfurthermore\b/gi, 'additionally'],
      [/\bnevertheless\b/gi, 'notwithstanding'],
      [/\bconsequently\b/gi, 'thus'],
      [/\bsignificantly\b/gi, 'considerably'],
      [/\bfundamental\b/gi, 'foundational'],
      [/\bimportant\b/gi, 'significant'],
    ],
  },
  business: {
    id: 'business',
    label: 'Business',
    icon: 'Building2',
    color: '#06b6d4',
    desc: 'Corporate, action-oriented, results-focused',
    transforms: [
      [/\butilize\b/gi, 'leverage'],
      [/\bcommence\b/gi, 'launch'],
      [/\bfacilitate\b/gi, 'drive'],
      [/\bimplement\b/gi, 'roll out'],
      [/\bdemonstrate\b/gi, 'prove'],
      [/\bapproximately\b/gi, 'roughly'],
      [/\bsubsequently\b/gi, 'next'],
      [/\bin order to\b/gi, 'to'],
      [/\bmoreover\b/gi, 'on top of that'],
      [/\bnevertheless\b/gi, 'however'],
      [/\bconsequently\b/gi, 'as a result'],
      [/\bsignificantly\b/gi, 'materially'],
      [/\bstrategic\b/gi, 'targeted'],
      [/\boptimize\b/gi, 'improve'],
      [/\bsynergy\b/gi, 'collaboration'],
    ],
  },
  creative: {
    id: 'creative',
    label: 'Creative',
    icon: 'Sparkles',
    color: '#ec4899',
    desc: 'Expressive, vivid, engaging',
    transforms: [
      [/\butilize\b/gi, 'put to work'],
      [/\bcommence\b/gi, 'embark on'],
      [/\bfacilitate\b/gi, 'pave the way for'],
      [/\bimplement\b/gi, 'bring to life'],
      [/\bdemonstrate\b/gi, 'reveal'],
      [/\bapproximately\b/gi, 'roughly'],
      [/\bsubsequently\b/gi, 'afterward'],
      [/\bin order to\b/gi, 'so as to'],
      [/\bmoreover\b/gi, 'what is more'],
      [/\bnevertheless\b/gi, 'even so'],
      [/\bconsequently\b/gi, 'and so'],
      [/\bsignificantly\b/gi, 'markedly'],
      [/\bpowerful\b/gi, 'compelling'],
      [/\benhance\b/gi, 'elevate'],
      [/\bcreate\b/gi, 'craft'],
    ],
  },
};

// Filler words AI tends to use
const AI_FILLERS = [
  /\bdelve\b/gi, /\bembark\b/gi, /\btapestry\b/gi, /\blandscape\b/gi,
  /\bpivotal\b/gi, /\brobust\b/gi, /\bleveraging\b/gi, /\bfostering\b/gi,
  /\bnavigating\b/gi, /\bcommencing\b/gi, /\bmeticulous\b/gi, /\bplethora\b/gi,
  /\bmyriad\b/gi, /\bsynergy\b/gi, /\bharnessing\b/gi, /\bunprecedented\b/gi,
  /\bcomprehensive\b/gi, /\bholistic\b/gi, /\bstreamline\b/gi, /\boptimize\b/gi,
  /\binnovative\b/gi, /\bcutting.edge\b/gi, /\bseamless\b/gi, /\btransformative\b/gi,
  /\benhancing\b/gi, /\bempowering\b/gi, /\bdriving\b/gi, /\bpaving the way\b/gi,
  /\bin conclusion\b/gi, /\bit is worth noting\b/gi, /\bin today.s world\b/gi,
  /\bin the realm of\b/gi, /\bwhen it comes to\b/gi, /\bit goes without saying\b/gi,
];

// Common AI sentence starters
const AI_STARTERS = [
  /^it is (important|crucial|essential|worth noting) (that )?/gim,
  /^(in|within) the (realm|context|field|domain) of/gim,
  /^(when|while) it comes to/gim,
  /^(in today's|in the modern) world/gim,
  /^(it goes without saying|needless to say) that/gim,
];

export const humanizeText = (text, toneId) => {
  if (!text?.trim()) return { humanized: '', grammarFixes: 0, readabilityScore: 0, aiDetection: 0, changes: [] };

  const tone = TONES[toneId] || TONES.professional;
  let result = text;
  const changes = [];

  // Apply tone-specific transforms
  tone.transforms.forEach(([pattern, replacement]) => {
    const before = result;
    result = result.replace(pattern, replacement);
    if (before !== result) {
      const match = before.match(pattern);
      if (match) changes.push({ from: match[0], to: replacement, type: 'tone' });
    }
  });

  // Remove AI filler words (replace with simpler alternatives or remove)
  const fillerReplacements = {
    delve: 'explore', embark: 'begin', tapestry: '', landscape: 'area',
    pivotal: 'key', robust: 'strong', leveraging: 'using', fostering: 'building',
    navigating: 'managing', meticulous: 'careful', plethora: 'many', myriad: 'many',
    harnessing: 'using', unprecedented: 'new', comprehensive: 'full', holistic: 'complete',
    streamline: 'simplify', optimize: 'improve', innovative: 'new', 'cutting-edge': 'modern',
    seamless: 'smooth', transformative: 'big', enhancing: 'improving', empowering: 'helping',
    'paving the way': 'enabling',
  };

  AI_FILLERS.forEach(pattern => {
    const before = result;
    result = result.replace(pattern, (match) => {
      const lower = match.toLowerCase();
      return fillerReplacements[lower] || '';
    });
    if (before !== result) {
      const match = before.match(pattern);
      if (match) changes.push({ from: match[0], to: fillerReplacements[match[0].toLowerCase()] || '(removed)', type: 'filler' });
    }
  });

  // Simplify AI sentence starters
  AI_STARTERS.forEach(pattern => {
    const before = result;
    result = result.replace(pattern, '');
    if (before !== result) changes.push({ from: '(AI starter phrase)', to: '(simplified)', type: 'starter' });
  });

  // Remove double spaces
  result = result.replace(/  +/g, ' ');

  // Add occasional contractions for casual/student tones
  if (toneId === 'casual' || toneId === 'student') {
    result = result.replace(/\bdo not\b/gi, "don't");
    result = result.replace(/\bcannot\b/gi, "can't");
    result = result.replace(/\bit is\b/gi, "it's");
    result = result.replace(/\bthat is\b/gi, "that's");
    result = result.replace(/\bwe are\b/gi, "we're");
    result = result.replace(/\bthey are\b/gi, "they're");
    result = result.replace(/\bwill not\b/gi, "won't");
    result = result.replace(/\bshould not\b/gi, "shouldn't");
  }

  // Calculate metrics
  const wordCount = result.split(/\s+/).filter(Boolean).length;
  const sentenceCount = result.split(/[.!?]+/).filter(s => s.trim()).length;
  const avgWordsPerSentence = sentenceCount > 0 ? wordCount / sentenceCount : 0;
  const syllableCount = result.split(/\s+/).filter(Boolean).reduce((sum, w) => sum + Math.max(1, w.replace(/[^aeiou]/gi, '').length), 0);

  // Flesch Reading Ease
  const readability = Math.max(0, Math.min(100, Math.round(206.835 - 1.015 * avgWordsPerSentence - 84.6 * (syllableCount / Math.max(1, wordCount)))));

  // AI Detection Estimate (lower = more human)
  let aiScore = 50;
  if (changes.length > 5) aiScore -= 15;
  if (changes.length > 10) aiScore -= 10;
  if (text.length > 500) aiScore += 5;
  if (toneId === 'casual' || toneId === 'student') aiScore -= 10;
  if (toneId === 'creative') aiScore -= 15;
  aiScore = Math.max(5, Math.min(95, aiScore));

  // Grammar fixes count (approximate)
  const grammarFixes = changes.filter(c => c.type === 'tone' || c.type === 'filler').length;

  return {
    humanized: result.trim(),
    grammarFixes,
    readabilityScore: readability,
    aiDetection: aiScore,
    changes,
    wordCount,
    sentenceCount,
  };
};

export const getReadabilityLabel = (score) => {
  if (score >= 80) return { label: 'Easy', color: '#10b981' };
  if (score >= 60) return { label: 'Standard', color: '#6366f1' };
  if (score >= 40) return { label: 'Difficult', color: '#f59e0b' };
  return { label: 'Very Difficult', color: '#ef4444' };
};

export const getDetectionLabel = (score) => {
  if (score <= 20) return { label: 'Very Human', color: '#10b981' };
  if (score <= 40) return { label: 'Likely Human', color: '#6366f1' };
  if (score <= 60) return { label: 'Mixed', color: '#f59e0b' };
  return { label: 'Likely AI', color: '#ef4444' };
};

export const SAMPLE_TEXT = `In today's rapidly evolving technological landscape, it is crucial to leverage innovative solutions in order to streamline business operations. Moreover, organizations must navigate the complex realm of digital transformation with a holistic approach. It goes without saying that implementing robust systems is pivotal to fostering synergy across departments. Furthermore, comprehensive strategies are essential for demonstrating measurable results. Consequently, businesses should utilize cutting-edge tools to optimize their workflows and enhance overall productivity.`;
