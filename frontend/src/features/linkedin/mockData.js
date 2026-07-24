export const headlineTemplates = [
  { role: 'Software Engineer', templates: [
    'Software Engineer | Building Scalable Systems at {company} | {tech}',
    'Full Stack Developer | React & Node.js Enthusiast | Open Source Contributor',
    'Senior Software Engineer | Cloud Architecture | AWS Certified | {company}',
    'Software Engineer | Turning Complex Problems into Simple Solutions | {tech}',
    'Backend Engineer | Distributed Systems | Performance Optimization | {company}',
    'Software Engineer | Passionate about Clean Code & DevOps | {tech}',
  ]},
  { role: 'Product Manager', templates: [
    'Product Manager at {company} | Data-Driven Decisions | User-Centric Products',
    'Senior PM | Building Products Users Love | Agile & Scrum | {company}',
    'Product Manager | Strategy → Execution | Growth & Retention | {company}',
    'Digital Product Manager | MVP to Scale | Cross-Functional Leadership',
    'Product Owner | Transforming Ideas into Revenue | {company}',
  ]},
  { role: 'Data Scientist', templates: [
    'Data Scientist | Machine Learning | NLP & Computer Vision | {company}',
    'Senior Data Scientist | Turning Data into Decisions | Python & TensorFlow',
    'Data Scientist | AI/ML Researcher | Published Author | {company}',
    'ML Engineer | Deep Learning | Recommendation Systems | {tech}',
    'Data Scientist | Statistical Modeling | Business Intelligence | {company}',
  ]},
  { role: 'UX Designer', templates: [
    'UX/UI Designer | Crafting Human-Centered Experiences | Figma Expert',
    'Senior UX Designer | Design Systems | Accessibility Champion | {company}',
    'Product Designer | Research → Wireframes → Prototypes | {company}',
    'UX Designer | Bridging Business Goals with User Needs | {tech}',
    'Lead Designer | Design Thinking | User Research | {company}',
  ]},
  { role: 'DevOps Engineer', templates: [
    'DevOps Engineer | CI/CD | Kubernetes | Cloud Infrastructure | {company}',
    'Senior DevOps | AWS & Azure | Infrastructure as Code | {company}',
    'Site Reliability Engineer | 99.99% Uptime | Observability | {company}',
    'DevOps Lead | Automation First | Docker & Terraform | {tech}',
    'Platform Engineer | Building Developer Platforms | {company}',
  ]},
  { role: 'Marketing Manager', templates: [
    'Marketing Manager | Growth Strategy | Content & SEO | {company}',
    'Digital Marketing Lead | ROI-Driven Campaigns | {company}',
    'Performance Marketing | Data-Driven Growth | {tech}',
    'Brand Manager | Storytelling That Converts | {company}',
  ]},
];

export const aboutTemplates = {
  'Software Engineer': `Passionate software engineer with {experience} years of experience building production-grade applications. I specialize in {tech} and thrive on solving complex technical challenges.

At {company}, I've led the development of systems serving millions of users, improved application performance by {metric}, and mentored junior developers.

Key Highlights:
• Built and deployed {project} serving {users} daily active users
• Reduced API response time by {improvement} through optimization
• Contributed to {opensource} open source projects

I'm always excited to connect with fellow engineers and discuss emerging technologies. Let's build something amazing together!`,
  'Product Manager': `Results-driven Product Manager with {experience} years of experience shipping products that users love. I bridge the gap between business strategy and technical execution.

At {company}, I owned the product roadmap, drove feature prioritization, and delivered {metric} growth through data-informed decisions.

My approach combines user research, market analysis, and agile methodologies to build products that solve real problems. I've successfully launched {project} that now serves {users} users.

Let's connect if you're passionate about product excellence!`,
  'Data Scientist': `Data Scientist with {experience} years turning raw data into actionable insights. My toolkit includes Python, TensorFlow, SQL, and a deep understanding of statistical modeling.

At {company}, I developed ML models that improved {metric} by {improvement}, processed datasets of {size} records, and presented findings to C-level executives.

Specializations:
• Machine Learning & Deep Learning
• Natural Language Processing
• A/B Testing & Experimentation
• Data Visualization & Storytelling

I love collaborating on challenging problems where data meets real-world impact.`,
};

export const experienceSuggestions = [
  { label: 'Action Verbs', items: ['Spearheaded', 'Architected', 'Optimized', 'Automated', 'Scaled', 'Mentored', 'Pioneered', 'Delivered', 'Streamlined', 'Revolutionized'] },
  { label: 'Impact Phrases', items: ['resulting in {percent}% improvement', 'saving {hours} hours weekly', 'serving {users}+ users', 'reducing costs by {percent}%', 'increasing revenue by {percent}%', 'achieving {metric} target'] },
  { label: 'Metrics', items: ['40% faster load times', '99.9% uptime achieved', '$2M annual cost savings', '3x developer productivity', '500K+ daily active users', '15% conversion rate increase'] },
];

export const skillsDatabase = {
  'Software Engineer': {
    technical: ['JavaScript', 'TypeScript', 'Python', 'Java', 'Go', 'Rust', 'C++', 'SQL', 'NoSQL', 'REST APIs', 'GraphQL', 'gRPC', 'Microservices', 'System Design', 'Data Structures', 'Algorithms'],
    tools: ['Git', 'Docker', 'Kubernetes', 'Jenkins', 'GitHub Actions', 'Terraform', 'Ansible', 'Nginx', 'Redis', 'Kafka', 'RabbitMQ', 'Elasticsearch'],
    cloud: ['AWS', 'Azure', 'GCP', 'Lambda', 'EC2', 'S3', 'CloudFormation', 'DynamoDB', 'RDS'],
    soft: ['Problem Solving', 'Team Leadership', 'Code Review', 'Technical Writing', 'Mentoring', 'Agile', 'Scrum', 'Communication'],
  },
  'Product Manager': {
    technical: ['SQL', 'Python', 'A/B Testing', 'Analytics', 'Wireframing', 'Prototyping', 'User Research', 'Market Analysis'],
    tools: ['Jira', 'Confluence', 'Figma', 'Miro', 'Notion', 'Amplitude', 'Mixpanel', 'Hotjar', 'Google Analytics', 'Tableau'],
    methodology: ['Agile', 'Scrum', 'Kanban', 'Lean', 'Design Thinking', 'OKRs', 'RICE', 'MoSCoW'],
    soft: ['Strategic Thinking', 'Communication', 'Stakeholder Management', 'Data-Driven Decisions', 'Leadership', 'Negotiation', 'Empathy'],
  },
  'Data Scientist': {
    technical: ['Python', 'R', 'SQL', 'TensorFlow', 'PyTorch', 'Scikit-learn', 'Pandas', 'NumPy', 'Spark', 'Hadoop', 'NLP', 'Computer Vision', 'Deep Learning', 'Statistical Modeling'],
    tools: ['Jupyter', 'Tableau', 'Power BI', 'MLflow', 'Airflow', 'dbt', 'Snowflake', 'BigQuery', 'Databricks'],
    methods: ['Regression', 'Classification', 'Clustering', 'Time Series', 'A/B Testing', 'Feature Engineering', 'Model Deployment'],
    soft: ['Storytelling', 'Business Acumen', 'Communication', 'Critical Thinking', 'Presentation', 'Research'],
  },
};

export const bannerSuggestions = [
  { category: 'Tech', banners: [
    { title: 'Minimal Code', desc: 'Dark background with subtle code snippets, clean monospace font', colors: ['#1a1a2e', '#16213e', '#0f3460'] },
    { title: 'Gradient Wave', desc: 'Smooth gradient from blue to purple with abstract wave patterns', colors: ['#667eea', '#764ba2', '#f093fb'] },
    { title: 'Circuit Board', desc: 'Tech circuit pattern on dark background with neon accents', colors: ['#0d1117', '#238636', '#58a6ff'] },
    { title: 'Data Flow', desc: 'Abstract data visualization with connected nodes', colors: ['#1e1e2e', '#45475a', '#89b4fa'] },
  ]},
  { category: 'Business', banners: [
    { title: 'Corporate Blue', desc: 'Professional blue gradient with geometric shapes', colors: ['#1e3a5f', '#4a90d9', '#a8c6df'] },
    { title: 'Gold Premium', desc: 'Elegant dark background with gold accents', colors: ['#1a1a2e', '#c9a227', '#e8d48b'] },
    { title: 'Minimal White', desc: 'Clean white background with subtle gray elements', colors: ['#ffffff', '#f0f0f0', '#d4af37'] },
  ]},
  { category: 'Creative', banners: [
    { title: 'Neon Pop', desc: 'Vibrant neon colors on dark background', colors: ['#0f0f23', '#ff006e', '#3a86ff'] },
    { title: 'Sunset Gradient', desc: 'Warm sunset colors blending into each other', colors: ['#ff6b6b', '#ffa07a', '#ffd700'] },
    { title: 'Abstract Art', desc: 'Bold abstract shapes with contrasting colors', colors: ['#2d3436', '#e17055', '#00b894'] },
  ]},
];

export const profileScoreCriteria = [
  { id: 'photo', label: 'Professional Photo', weight: 15, desc: 'High-quality headshot with clean background' },
  { id: 'headline', label: 'Compelling Headline', weight: 15, desc: 'Keywords-rich, specific headline' },
  { id: 'about', label: 'About Section', weight: 15, desc: 'Complete, keyword-optimized summary' },
  { id: 'experience', label: 'Experience Details', weight: 15, desc: 'Quantified achievements, action verbs' },
  { id: 'skills', label: 'Skills & Endorsements', weight: 10, desc: 'Relevant skills with endorsements' },
  { id: 'recommendations', label: 'Recommendations', weight: 10, desc: 'At least 3 quality recommendations' },
  { id: 'banner', label: 'Custom Banner', weight: 5, desc: 'Professional banner image' },
  { id: 'education', label: 'Education', weight: 5, desc: 'Complete education details' },
  { id: 'certifications', label: 'Certifications', weight: 5, desc: 'Industry-relevant certifications' },
  { id: 'activity', label: 'Recent Activity', weight: 5, desc: 'Regular posting and engagement' },
];

export const postTemplates = [
  { type: 'Thought Leadership', template: 'I\'ve been thinking about {topic} lately, and here\'s what I\'ve learned:\n\n{insight_1}\n{insight_2}\n{insight_3}\n\nThe biggest takeaway? {conclusion}\n\nWhat\'s your experience with {topic}? Drop your thoughts below 👇\n\n#{hashtags}' },
  { type: 'Career Milestone', template: 'Excited to share that I\'ve {milestone}! 🎉\n\nWhen I first started {context}, I never imagined {journey}. Here\'s what helped me get here:\n\n1️⃣ {lesson_1}\n2️⃣ {lesson_2}\n3️⃣ {lesson_3}\n\nGrateful to {gratitude}.\n\n{hashtags}' },
  { type: 'Lessons Learned', template: 'After {experience} in {field}, here are {number} lessons I wish I knew earlier:\n\n🔹 {lesson_1}\n🔹 {lesson_2}\n🔹 {lesson_3}\n🔹 {lesson_4}\n🔹 {lesson_5}\n\nWhich one resonates most with you?\n\n{hashtags}' },
  { type: 'Industry Trend', template: '{trend} is reshaping how we {action}.\n\nHere\'s what most people miss:\n\n→ {point_1}\n→ {point_2}\n→ {point_3}\n\nMy prediction: {prediction}\n\nAgree or disagree? Let\'s discuss 👇\n\n{hashtags}' },
  { type: 'How-To Guide', template: 'Want to {goal}? Here\'s my step-by-step guide:\n\nStep 1: {step_1}\nStep 2: {step_2}\nStep 3: {step_3}\nStep 4: {step_4}\n\nPro tip: {tip}\n\nSave this post for later! 🔖\n\n{hashtags}' },
  { type: 'Question Engagement', template: 'Quick question for my network:\n\n{question}\n\nI\'ll go first: {my_answer}\n\nWhat about you? 👇\n\n{hashtags}' },
];

export const hashtagSets = {
  'Software Engineer': ['#softwareengineering', '#webdevelopment', '#javascript', '#python', '#tech', '#coding', '#fullstack', '#backend', '#frontend', '#devops', '#cloudcomputing', '#opensource', '#programming', '#developer', '#techcommunity'],
  'Product Manager': ['#productmanagement', '#product', '#pm', '#agile', '#scrum', '#ux', '#startup', '#innovation', '#strategy', '#growth', '#saas', '#productdesign', '#userexperience', '#business', '#leadership'],
  'Data Scientist': ['#datascience', '#machinelearning', '#artificialintelligence', '#python', '#analytics', '#deeplearning', '#nlp', '#bigdata', '#dataviz', '#statistics', '#research', '#tech', '#ai', '#datamining', '#r'],
  'UX Designer': ['#uxdesign', '#uidesign', '#userexperience', '#designthinking', '#figma', '#prototyping', '#accessibility', '#design', '#uxresearch', '#interactiondesign', '#creative', '#graphicdesign', '#productdesign', '#userinterface', '#hcd'],
  'DevOps Engineer': ['#devops', '#cloud', '#aws', '#kubernetes', '#docker', '#cicd', '#terraform', '#linux', '#automation', '#sre', '#infrastructure', '#azure', '#gcp', '#monitoring', '#security'],
  'Marketing Manager': ['#marketing', '#digitalmarketing', '#growth', '#seo', '#contentmarketing', '#socialmedia', '#branding', '#advertising', '#marketingstrategy', '#analytics', '#conversion', '#roi', '#ppc', '#emailmarketing', '#inbound'],
};

export const keywordsDatabase = {
  'Software Engineer': ['software development', 'full stack', 'RESTful APIs', 'microservices', 'CI/CD', 'code review', 'agile', 'sprint', 'technical debt', 'performance optimization', 'scalability', 'unit testing', 'integration testing', 'version control', 'system architecture', 'database design', 'API integration', 'cloud deployment', 'containerization', 'DevOps'],
  'Product Manager': ['product roadmap', 'user stories', 'acceptance criteria', 'A/B testing', 'product-market fit', 'OKRs', 'KPIs', 'stakeholder management', 'backlog prioritization', 'go-to-market', 'customer discovery', 'competitive analysis', 'feature prioritization', 'user persona', 'journey mapping', 'product strategy', 'metrics-driven', 'cross-functional', 'lean startup', 'MVP'],
  'Data Scientist': ['machine learning', 'deep learning', 'statistical analysis', 'data pipeline', 'feature engineering', 'model deployment', 'exploratory data analysis', 'predictive modeling', 'NLP', 'computer vision', 'recommendation systems', 'time series forecasting', 'A/B testing', 'data visualization', 'ETL', 'big data', 'neural networks', 'regression analysis', 'classification', 'clustering'],
  'UX Designer': ['user research', 'wireframing', 'prototyping', 'usability testing', 'design system', 'user journey', 'information architecture', 'interaction design', 'visual design', 'design thinking', 'accessibility', 'responsive design', 'user persona', 'A/B testing', 'heuristic evaluation', 'user flows', 'persona development', 'card sorting', 'affinity mapping', 'design handoff'],
  'DevOps Engineer': ['CI/CD', 'infrastructure as code', 'container orchestration', 'cloud infrastructure', 'monitoring and alerting', 'incident management', 'automation', 'security scanning', 'log aggregation', 'performance tuning', 'disaster recovery', 'capacity planning', 'configuration management', 'service mesh', 'zero downtime deployment', 'canary releases', 'blue-green deployment', 'observability', 'SLO/SLI', 'runbook automation'],
};

export const checklistItems = [
  { category: 'Profile Basics', items: [
    { id: 'photo', text: 'Professional headshot photo', tip: 'Dress professionally, use a clean background, smile naturally' },
    { id: 'banner', text: 'Custom banner image', tip: 'Reflect your brand/industry, use 1584x396px resolution' },
    { id: 'headline', text: 'Keyword-rich headline (220 chars)', tip: 'Include role + key skills + value proposition' },
    { id: 'location', text: 'Location set correctly', tip: 'Set to your target market/city' },
    { id: 'industry', text: 'Industry selected', tip: 'Choose the most relevant industry' },
  ]},
  { category: 'About Section', items: [
    { id: 'about_length', text: 'About section (2600 chars)', tip: 'Write in first person, start with a hook' },
    { id: 'about_keywords', text: 'Include relevant keywords naturally', tip: 'Mirror language from job descriptions' },
    { id: 'about_cta', text: 'Clear call-to-action at the end', tip: 'Invite connections, specify what you\'re looking for' },
    { id: 'about_formatting', text: 'Well-formatted with line breaks', tip: 'Use short paragraphs and bullet points' },
  ]},
  { category: 'Experience', items: [
    { id: 'exp_current', text: 'Current role with 5+ bullet points', tip: 'Lead with action verbs, quantify achievements' },
    { id: 'exp_past', text: 'All past roles listed', tip: 'Include at least your last 3 positions' },
    { id: 'exp_metrics', text: 'Quantified results (%, $, #)', tip: 'Show measurable impact for each role' },
    { id: 'exp_media', text: 'Media attached to experiences', tip: 'Add presentations, videos, or documents' },
  ]},
  { category: 'Skills & Endorsements', items: [
    { id: 'skills_top3', text: 'Top 3 skills pinned', tip: 'Pin your most important, marketable skills' },
    { id: 'skills_50', text: 'At least 15 skills listed', tip: 'Maximum is 50, aim for 15-25 relevant ones' },
    { id: 'skills_endorsed', text: 'Skills with endorsements', tip: 'Ask colleagues to endorse your top skills' },
  ]},
  { category: 'Social Proof', items: [
    { id: 'rec_3', text: 'At least 3 recommendations', tip: 'Request from managers, peers, and direct reports' },
    { id: 'rec_given', text: 'Written recommendations for others', tip: 'Give first to receive more' },
    { id: 'featured', text: 'Featured section populated', tip: 'Showcase your best work, posts, or articles' },
  ]},
  { category: 'Activity', items: [
    { id: 'posts_weekly', text: 'Post at least 1x per week', tip: 'Share insights, articles, or industry news' },
    { id: 'comments', text: 'Comment on 5+ posts weekly', tip: 'Add thoughtful, substantive comments' },
    { id: 'connections', text: 'Grow network strategically', tip: 'Connect with industry peers and personalize invites' },
    { id: 'groups', text: 'Active in relevant groups', tip: 'Join and participate in industry-specific groups' },
  ]},
];

export const generateHeadline = async (role, company, tech, templates) => {
  try {
    const res = await fetch('/api/linkedin/generate', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ type: 'headline', data: { role, company, tech } }),
    });
    if (res.ok) {
      const data = await res.json();
      if (!data.fallback && data.content) return data.content;
    }
  } catch (e) {
    console.warn('AI headline generation failed, using mock:', e.message);
  }
  const roleTemplates = templates.find(t => t.role === role)?.templates || templates[0].templates;
  const template = roleTemplates[Math.floor(Math.random() * roleTemplates.length)];
  return template.replace('{company}', company || 'Tech Company').replace('{tech}', tech || 'Modern Tech Stack');
};

export const generateAbout = async (role, data, templates) => {
  try {
    const res = await fetch('/api/linkedin/generate', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ type: 'about', data: { role, ...data } }),
    });
    if (res.ok) {
      const respData = await res.json();
      if (!respData.fallback && respData.content) return respData.content;
    }
  } catch (e) {
    console.warn('AI about generation failed, using mock:', e.message);
  }
  const template = templates[role] || templates['Software Engineer'];
  return template
    .replace('{experience}', data.experience || '3+')
    .replace('{tech}', data.tech || 'JavaScript, Python, and Cloud Technologies')
    .replace('{company}', data.company || 'my current company')
    .replace('{metric}', data.metric || 'user engagement by 40%')
    .replace('{project}', data.project || 'a microservices platform')
    .replace('{users}', data.users || '500K')
    .replace('{improvement}', data.improvement || '60%')
    .replace('{size}', data.size || '10TB')
    .replace('{opensource}', data.opensource || '5+');
};

export const calculateProfileScore = (answers) => {
  let score = 0;
  profileScoreCriteria.forEach(c => {
    if (answers[c.id]) score += c.weight;
  });
  let grade = 'F';
  if (score >= 90) grade = 'A+';
  else if (score >= 80) grade = 'A';
  else if (score >= 70) grade = 'B+';
  else if (score >= 60) grade = 'B';
  else if (score >= 50) grade = 'C+';
  else if (score >= 40) grade = 'C';
  else if (score >= 25) grade = 'D';
  return { score, grade };
};

export const generateHashtags = (role, count = 10, customHashtags = '') => {
  const base = hashtagSets[role] || hashtagSets['Software Engineer'];
  const custom = customHashtags.split(',').map(h => h.trim().toLowerCase().replace(/\s+/g, '')).filter(Boolean);
  const combined = [...custom, ...base];
  const shuffled = combined.sort(() => 0.5 - Math.random());
  return shuffled.slice(0, count);
};
