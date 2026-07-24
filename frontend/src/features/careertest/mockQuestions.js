export const categories = [
  { id: 'personality', label: 'Personality', icon: '🧠' },
  { id: 'interests', label: 'Interests', icon: '💡' },
  { id: 'technical', label: 'Technical Skills', icon: '⚙️' },
  { id: 'soft', label: 'Soft Skills', icon: '🤝' },
  { id: 'leadership', label: 'Leadership', icon: '🎯' },
  { id: 'communication', label: 'Communication', icon: '💬' },
  { id: 'preference', label: 'Work Preference', icon: '🏠' },
];

export const questions = [
  {
    id: 'p1', category: 'personality', type: 'likert',
    text: 'I enjoy working on complex problems that require deep thinking.',
    scale: ['Strongly Disagree', 'Disagree', 'Neutral', 'Agree', 'Strongly Agree'],
  },
  {
    id: 'p2', category: 'personality', type: 'choice',
    text: 'Which describes your working style best?',
    options: ['Highly organized and structured', 'Flexible and adaptable', 'Collaborative and social', 'Independent and autonomous'],
  },
  {
    id: 'i1', category: 'interests', type: 'multiselect',
    text: 'Select up to 3 areas that genuinely interest you:',
    options: ['Technology & Coding', 'Design & Creativity', 'Data & Analytics', 'Business & Strategy', 'Writing & Content', 'Science & Research'],
    minSelect: 1, maxSelect: 3,
  },
  {
    id: 't1', category: 'technical', type: 'choice',
    text: 'What is your primary area of technical strength?',
    options: ['Frontend / Backend Development', 'Data Science & Analytics', 'System Design & Architecture', 'DevOps & Infrastructure', 'No strong technical focus yet'],
  },
  {
    id: 's1', category: 'soft', type: 'likert',
    text: 'I can explain complex ideas in simple terms and handle disagreements calmly.',
    scale: ['Strongly Disagree', 'Disagree', 'Neutral', 'Agree', 'Strongly Agree'],
  },
  {
    id: 'l1', category: 'leadership', type: 'choice',
    text: 'In a group project, what role do you naturally take?',
    options: ['Leader / Coordinator', 'Planner / Organizer', 'Executor / Doer', 'Reviewer / Quality Check'],
  },
  {
    id: 'c1', category: 'communication', type: 'likert',
    text: 'I am comfortable presenting ideas to a group.',
    scale: ['Strongly Disagree', 'Disagree', 'Neutral', 'Agree', 'Strongly Agree'],
  },
  {
    id: 'c2', category: 'communication', type: 'choice',
    text: 'Which communication style do you prefer?',
    options: ['Written — emails, docs, Slack', 'Verbal — meetings, calls, discussions', 'Visual — diagrams, charts, slides', 'Mix of all depending on context'],
  },
  {
    id: 'w1', category: 'preference', type: 'choice',
    text: 'What is your ideal work environment?',
    options: ['Fully remote', 'Hybrid (2-3 days office)', 'Fully on-site', 'Flexible / freelance'],
  },
  {
    id: 'w2', category: 'preference', type: 'choice',
    text: 'What motivates you most in work?',
    options: ['High salary & benefits', 'Learning & growth opportunities', 'Impact & purpose', 'Recognition & status'],
  },
];

export const careerProfiles = [
  {
    title: 'Software Engineer',
    keywords: ['Technology & Coding', 'Frontend / Backend Development', 'Independent and autonomous'],
    description: 'Design, develop, and maintain software applications.',
  },
  {
    title: 'Data Scientist',
    keywords: ['Data & Analytics', 'Data Science & Analytics', 'Science & Research'],
    description: 'Extract insights from complex datasets using statistical methods and ML.',
  },
  {
    title: 'Product Manager',
    keywords: ['Business & Strategy', 'Leader / Coordinator', 'Flexible and adaptable'],
    description: 'Define product vision, strategy, and roadmap to deliver user value.',
  },
  {
    title: 'UX Designer',
    keywords: ['Design & Creativity', 'Collaborative and social', 'Visual — diagrams, charts, slides'],
    description: 'Create intuitive, delightful user experiences through research and design.',
  },
  {
    title: 'DevOps Engineer',
    keywords: ['DevOps & Infrastructure', 'System Design & Architecture', 'Highly organized and structured'],
    description: 'Bridge development and operations through automation and infrastructure.',
  },
  {
    title: 'Business Analyst',
    keywords: ['Business & Strategy', 'Science & Research', 'Planner / Organizer'],
    description: 'Analyze business processes and recommend data-driven improvements.',
  },
  {
    title: 'Technical Writer',
    keywords: ['Writing & Content', 'Written — emails, docs, Slack', 'Science & Research'],
    description: 'Create clear documentation for technical products and processes.',
  },
  {
    title: 'Marketing Manager',
    keywords: ['Business & Strategy', 'Verbal — meetings, calls, discussions', 'Learning & growth opportunities'],
    description: 'Plan and execute marketing strategies to drive brand awareness and growth.',
  },
  {
    title: 'Project Manager',
    keywords: ['Leader / Coordinator', 'Planner / Organizer', 'Hybrid (2-3 days office)'],
    description: 'Plan, execute, and deliver projects on time and within scope.',
  },
  {
    title: 'AI/ML Engineer',
    keywords: ['Data & Analytics', 'Independent and autonomous', 'Science & Research'],
    description: 'Build and deploy machine learning models and intelligent systems.',
  },
];
