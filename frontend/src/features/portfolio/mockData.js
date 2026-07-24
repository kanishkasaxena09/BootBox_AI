export const themes = [
  // Dark themes
  { id: 'midnight', name: 'Midnight Indigo', colors: { primary: '#6366f1', secondary: '#8b5cf6', bg: '#0f172a', surface: '#1e293b', text: '#f8fafc', muted: '#94a3b8', accent: '#818cf8' } },
  { id: 'rose', name: 'Rose Gold', colors: { primary: '#f43f5e', secondary: '#fb7185', bg: '#0f0a12', surface: '#1a1020', text: '#f9e8ef', muted: '#d4a0b3', accent: '#f472b6' } },
  { id: 'ocean', name: 'Deep Ocean', colors: { primary: '#0ea5e9', secondary: '#38bdf8', bg: '#0c1222', surface: '#162032', text: '#e2e8f0', muted: '#7dd3fc', accent: '#22d3ee' } },
  { id: 'forest', name: 'Forest Night', colors: { primary: '#22c55e', secondary: '#4ade80', bg: '#0a1a0f', surface: '#142818', text: '#ecfdf5', muted: '#86efac', accent: '#34d399' } },
  { id: 'sunset', name: 'Sunset Glow', colors: { primary: '#f97316', secondary: '#fb923c', bg: '#1a0f0a', surface: '#2a1a10', text: '#fef3c7', muted: '#fdba74', accent: '#fb923c' } },
  { id: 'cyberpunk', name: 'Cyberpunk', colors: { primary: '#e040fb', secondary: '#ea80fc', bg: '#0d0221', surface: '#150530', text: '#ede7f6', muted: '#b39ddb', accent: '#e040fb' } },
  { id: 'neon', name: 'Neon Mint', colors: { primary: '#00e676', secondary: '#69f0ae', bg: '#0a0e14', surface: '#141b22', text: '#e0f2f1', muted: '#80cbc4', accent: '#00e676' } },
  { id: 'ember', name: 'Ember Dark', colors: { primary: '#ef4444', secondary: '#f87171', bg: '#110a0a', surface: '#1f1212', text: '#fef2f2', muted: '#fca5a5', accent: '#f87171' } },
  { id: 'aurora', name: 'Aurora', colors: { primary: '#a78bfa', secondary: '#c4b5fd', bg: '#0f0a1a', surface: '#1a1228', text: '#ede9fe', muted: '#a78bfa', accent: '#c4b5fd' } },
  { id: 'slate', name: 'Slate Pro', colors: { primary: '#64748b', secondary: '#94a3b8', bg: '#0f1117', surface: '#1a1d27', text: '#f1f5f9', muted: '#94a3b8', accent: '#94a3b8' } },
  { id: 'amethyst', name: 'Amethyst', colors: { primary: '#9333ea', secondary: '#a855f7', bg: '#0f0715', surface: '#1a0d22', text: '#f3e8ff', muted: '#c084fc', accent: '#a855f7' } },
  { id: 'teal', name: 'Teal Depth', colors: { primary: '#14b8a6', secondary: '#2dd4bf', bg: '#0a1212', surface: '#122020', text: '#f0fdfa', muted: '#5eead4', accent: '#2dd4bf' } },
  { id: 'crimson', name: 'Crimson Night', colors: { primary: '#dc2626', secondary: '#ef4444', bg: '#120808', surface: '#1f0e0e', text: '#fef2f2', muted: '#fca5a5', accent: '#ef4444' } },
  { id: 'midnight-blue', name: 'Midnight Blue', colors: { primary: '#1d4ed8', secondary: '#3b82f6', bg: '#0a0f1a', surface: '#111827', text: '#eff6ff', muted: '#93c5fd', accent: '#3b82f6' } },
  { id: 'carbon', name: 'Carbon', colors: { primary: '#78716c', secondary: '#a8a29e', bg: '#1c1917', surface: '#292524', text: '#fafaf9', muted: '#a8a29e', accent: '#d6d3d1' } },
  // Light themes
  { id: 'light', name: 'Light Clean', colors: { primary: '#2563eb', secondary: '#3b82f6', bg: '#ffffff', surface: '#f8fafc', text: '#0f172a', muted: '#64748b', accent: '#3b82f6' } },
  { id: 'light-rose', name: 'Light Rose', colors: { primary: '#e11d48', secondary: '#f43f5e', bg: '#fff1f2', surface: '#ffe4e6', text: '#1c1917', muted: '#9f1239', accent: '#e11d48' } },
  { id: 'light-emerald', name: 'Light Emerald', colors: { primary: '#059669', secondary: '#10b981', bg: '#ecfdf5', surface: '#d1fae5', text: '#064e3b', muted: '#065f46', accent: '#059669' } },
  { id: 'light-violet', name: 'Light Violet', colors: { primary: '#7c3aed', secondary: '#8b5cf6', bg: '#f5f3ff', surface: '#ede9fe', text: '#1e1b4b', muted: '#5b21b6', accent: '#7c3aed' } },
  { id: 'warm', name: 'Warm Paper', colors: { primary: '#b45309', secondary: '#d97706', bg: '#fffbeb', surface: '#fef3c7', text: '#451a03', muted: '#92400e', accent: '#b45309' } },
];

export const templates = [
  { id: 'modern', name: 'Modern', desc: 'Clean sections with gradient accents and smooth scroll' },
  { id: 'minimal', name: 'Minimal', desc: 'Typography-focused with generous whitespace' },
  { id: 'creative', name: 'Creative', desc: 'Bold colors with animated elements and cards' },
];

export const defaultData = {
  personal: {
    name: 'John Doe',
    title: 'Full Stack Developer',
    bio: 'Passionate developer building modern web applications with React, Node.js, and cloud technologies. I love creating elegant solutions to complex problems.',
    email: 'john@example.com',
    phone: '+91 98765 43210',
    location: 'Bangalore, India',
    avatar: '',
  },
  projects: [
    { id: 'p1', title: 'E-Commerce Platform', description: 'Full-stack e-commerce with payment integration, admin dashboard, and real-time inventory management.', tech: ['React', 'Node.js', 'MongoDB', 'Stripe'], link: '', image: '' },
    { id: 'p2', title: 'AI Chat Application', description: 'Real-time chat app with AI-powered responses, file sharing, and end-to-end encryption.', tech: ['Next.js', 'OpenAI', 'Socket.io', 'PostgreSQL'], link: '', image: '' },
  ],
  skills: [
    { category: 'Frontend', items: ['React', 'Next.js', 'TypeScript', 'Tailwind CSS', 'Framer Motion'] },
    { category: 'Backend', items: ['Node.js', 'Express', 'Python', 'Django', 'GraphQL'] },
    { category: 'Database', items: ['PostgreSQL', 'MongoDB', 'Redis', 'Firebase'] },
    { category: 'DevOps', items: ['AWS', 'Docker', 'GitHub Actions', 'Vercel'] },
  ],
  education: [
    { id: 'e1', school: 'Indian Institute of Technology', degree: 'B.Tech in Computer Science', year: '2020 - 2024', description: 'CGPA: 8.5/10. Specialized in Software Engineering and Data Structures.' },
  ],
  experience: [
    { id: 'x1', company: 'TechCorp India', role: 'Software Engineer', duration: '2024 - Present', description: 'Building scalable microservices and leading frontend architecture for the main product.' },
    { id: 'x2', company: 'StartupXYZ', role: 'Frontend Developer Intern', duration: '2023 - 2024', description: 'Developed responsive web interfaces and improved page load performance by 40%.' },
  ],
  certificates: [
    { id: 'c1', name: 'AWS Solutions Architect', issuer: 'Amazon Web Services', date: '2024', link: '' },
    { id: 'c2', name: 'Meta Frontend Developer', issuer: 'Meta (Coursera)', date: '2023', link: '' },
  ],
  socials: [
    { platform: 'GitHub', url: 'https://github.com/johndoe' },
    { platform: 'LinkedIn', url: 'https://linkedin.com/in/johndoe' },
    { platform: 'Twitter', url: 'https://twitter.com/johndoe' },
  ],
};

export const generatePortfolioHTML = (data, theme, template) => {
  const t = themes.find(th => th.id === theme) || themes[0];
  const c = t.colors;
  const initials = data.personal.name.split(' ').map(n => n[0]).join('');
  const avatarHTML = data.personal.avatar
    ? `<img src="${data.personal.avatar}" alt="${data.personal.name}" class="avatar" />`
    : `<div class="avatar">${initials}</div>`;
  const socialLinks = data.socials.filter(s => s.url).map(s =>
    `<a href="${s.url}" target="_blank" class="social-link">${s.platform}</a>`
  ).join('');

  if (template === 'minimal') return generateMinimal(data, c, avatarHTML, socialLinks);
  if (template === 'creative') return generateCreative(data, c, avatarHTML, socialLinks);
  return generateModern(data, c, avatarHTML, socialLinks);
};

function generateModern(data, c, avatarHTML, socialLinks) {
  const projectCards = data.projects.map(p => `
      <div class="project-card">
        <div class="project-num">${data.projects.indexOf(p) + 1}</div>
        <h3>${p.title}</h3>
        <p>${p.description}</p>
        <div class="tags">${p.tech.map(t => `<span class="tag">${t}</span>`).join('')}</div>
        ${p.link ? `<a href="${p.link}" target="_blank">View Project →</a>` : ''}
      </div>`).join('');

  const skillHTML = data.skills.map(s => `
      <div class="skill-group">
        <h4>${s.category}</h4>
        <div class="tags">${s.items.map(i => `<span class="tag">${i}</span>`).join('')}</div>
      </div>`).join('');

  const expHTML = data.experience.map(x => `
      <div class="exp-item">
        <div class="exp-dot"></div>
        <div>
          <div class="exp-header"><h3>${x.company}</h3><span class="exp-date">${x.duration}</span></div>
          <p class="exp-role">${x.role}</p>
          <p class="exp-desc">${x.description}</p>
        </div>
      </div>`).join('');

  const eduHTML = data.education.map(e => `
      <div class="exp-item">
        <div class="exp-dot"></div>
        <div>
          <div class="exp-header"><h3>${e.school}</h3><span class="exp-date">${e.year}</span></div>
          <p class="exp-role">${e.degree}</p>
          ${e.description ? `<p class="exp-desc">${e.description}</p>` : ''}
        </div>
      </div>`).join('');

  const certHTML = data.certificates.map(c => `
      <div class="cert-card">
        <div class="cert-icon">🎓</div>
        <h3>${c.name}</h3>
        <p>${c.issuer} • ${c.date}</p>
        ${c.link ? `<a href="${c.link}" target="_blank">View →</a>` : ''}
      </div>`).join('');

  return `<!DOCTYPE html><html lang="en"><head><meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1.0"><title>${data.personal.name}</title><link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800;900&display=swap" rel="stylesheet"><style>
*{margin:0;padding:0;box-sizing:border-box}body{font-family:'Inter',sans-serif;background:${c.bg};color:${c.text};line-height:1.6}
.container{max-width:960px;margin:0 auto;padding:0 24px}
/* Hero - centered with gradient blob */
.hero{text-align:center;padding:100px 0 60px;position:relative;overflow:hidden}
.hero::before{content:'';position:absolute;top:-100px;left:50%;transform:translateX(-50%);width:500px;height:500px;background:radial-gradient(circle,${c.primary}15 0%,transparent 70%);border-radius:50%;pointer-events:none}
.avatar{width:130px;height:130px;border-radius:50%;border:4px solid ${c.primary};margin:0 auto 24px;object-fit:cover;background:${c.surface};display:flex;align-items:center;justify-content:center;font-size:3rem;color:${c.primary};font-weight:900;position:relative;z-index:1;box-shadow:0 0 0 8px ${c.primary}10}
h1{font-size:3.2rem;font-weight:900;line-height:1.05;margin-bottom:8px}
h1 .gradient{background:linear-gradient(135deg,${c.primary},${c.secondary});-webkit-background-clip:text;-webkit-text-fill-color:transparent}
.hero .role{font-size:1.15rem;color:${c.accent};font-weight:600;margin-bottom:12px}
.hero .bio{max-width:580px;margin:0 auto 20px;color:${c.muted};font-size:0.95rem}
.meta{display:flex;gap:16px;justify-content:center;flex-wrap:wrap;font-size:0.82rem;color:${c.muted};margin-bottom:20px}
.meta span{display:flex;align-items:center;gap:4px}
.social-links{display:flex;gap:10px;justify-content:center}
.social-link{padding:7px 18px;border:1px solid ${c.primary}40;border-radius:999px;font-size:0.8rem;font-weight:600;color:${c.accent};transition:all .25s}
.social-link:hover{background:${c.primary}20;border-color:${c.primary}}
/* Sections */
section{padding:50px 0}
.section-title{font-size:0.75rem;font-weight:800;text-transform:uppercase;letter-spacing:3px;color:${c.accent};margin-bottom:32px;display:flex;align-items:center;gap:12px}
.section-title::after{content:'';flex:1;height:1px;background:linear-gradient(90deg,${c.primary}40,transparent)}
/* Projects - numbered cards in 2-col grid */
.projects-grid{display:grid;grid-template-columns:1fr 1fr;gap:16px}
.project-card{background:${c.surface};border:1px solid ${c.primary}18;border-radius:16px;padding:24px;position:relative;transition:transform .3s,box-shadow .3s}
.project-card:hover{transform:translateY(-3px);box-shadow:0 12px 40px ${c.primary}12}
.project-num{font-size:2.5rem;font-weight:900;color:${c.primary}18;position:absolute;top:12px;right:18px;line-height:1}
.project-card h3{font-size:1.05rem;margin-bottom:8px}
.project-card p{font-size:0.85rem;color:${c.muted};margin-bottom:10px}
.project-card a{font-size:0.82rem;font-weight:600}
/* Tags */
.tags{display:flex;flex-wrap:wrap;gap:5px;margin:10px 0}
.tag{padding:4px 11px;background:${c.primary}12;color:${c.accent};border-radius:999px;font-size:0.7rem;font-weight:600}
/* Skills */
.skills-grid{display:grid;grid-template-columns:repeat(auto-fit,minmax(200px,1fr));gap:20px}
.skill-group h4{font-size:0.9rem;margin-bottom:10px;color:${c.accent}}
/* Timeline */
.timeline{position:relative;padding-left:24px}
.timeline::before{content:'';position:absolute;left:5px;top:4px;bottom:4px;width:2px;background:linear-gradient(180deg,${c.primary}50,${c.primary}10)}
.exp-item{position:relative;margin-bottom:28px}
.exp-dot{position:absolute;left:-22px;top:6px;width:10px;height:10px;background:${c.primary};border-radius:50%;border:3px solid ${c.bg}}
.exp-header{display:flex;justify-content:space-between;align-items:baseline;gap:8px}
.exp-header h3{font-size:1rem}
.exp-date{font-size:0.75rem;color:${c.muted};white-space:nowrap}
.exp-role{color:${c.accent};font-weight:600;font-size:0.85rem;margin:2px 0 6px}
.exp-desc{font-size:0.85rem;color:${c.muted}}
/* Certs */
.certs-grid{display:grid;grid-template-columns:repeat(auto-fit,minmax(220px,1fr));gap:14px}
.cert-card{background:${c.surface};border:1px solid ${c.primary}18;border-radius:14px;padding:20px;text-align:center;transition:transform .25s}
.cert-card:hover{transform:translateY(-2px)}
.cert-icon{font-size:1.8rem;margin-bottom:8px}
.cert-card h3{font-size:0.95rem;margin-bottom:4px}
.cert-card p{font-size:0.8rem}
.cert-card a{font-size:0.78rem;font-weight:600;display:inline-block;margin-top:6px}
footer{text-align:center;padding:36px 0;border-top:1px solid ${c.primary}12;font-size:0.78rem;color:${c.muted}}
@keyframes fadeUp{from{opacity:0;transform:translateY(16px)}to{opacity:1;transform:translateY(0)}}
.hero,section{animation:fadeUp .5s ease-out both}
section:nth-child(2){animation-delay:.1s}section:nth-child(3){animation-delay:.15s}section:nth-child(4){animation-delay:.2s}section:nth-child(5){animation-delay:.25s}section:nth-child(6){animation-delay:.3s}
@media(max-width:640px){h1{font-size:2.2rem}.avatar{width:96px;height:96px;font-size:2.2rem}.projects-grid{grid-template-columns:1fr}.hero{padding:60px 0 40px}section{padding:36px 0}}
</style></head><body>
<section class="hero"><div class="container">
  ${avatarHTML}
  <h1><span class="gradient">${data.personal.name}</span></h1>
  <p class="role">${data.personal.title}</p>
  <p class="bio">${data.personal.bio}</p>
  <div class="meta">
    ${data.personal.location ? `<span>📍 ${data.personal.location}</span>` : ''}
    ${data.personal.email ? `<span>✉ ${data.personal.email}</span>` : ''}
    ${data.personal.phone ? `<span>📱 ${data.personal.phone}</span>` : ''}
  </div>
  <div class="social-links">${socialLinks}</div>
</div></section>
${data.projects.length ? `<section><div class="container"><div class="section-title">Projects</div><div class="projects-grid">${projectCards}</div></div></section>` : ''}
${data.skills.length ? `<section><div class="container"><div class="section-title">Skills</div><div class="skills-grid">${skillHTML}</div></div></section>` : ''}
${data.experience.length ? `<section><div class="container"><div class="section-title">Experience</div><div class="timeline">${expHTML}</div></div></section>` : ''}
${data.education.length ? `<section><div class="container"><div class="section-title">Education</div><div class="timeline">${eduHTML}</div></div></section>` : ''}
${data.certificates.length ? `<section><div class="container"><div class="section-title">Certifications</div><div class="certs-grid">${certHTML}</div></div></section>` : ''}
<footer><div class="container">© ${new Date().getFullYear()} ${data.personal.name} — Built with BootBox</div></footer>
</body></html>`;
}

function generateMinimal(data, c, avatarHTML, socialLinks) {
  const projectHTML = data.projects.map(p => `
      <div class="proj">
        <div class="proj-head"><h3>${p.title}</h3>${p.link ? `<a href="${p.link}" target="_blank">Link →</a>` : ''}</div>
        <p>${p.description}</p>
        <div class="tags">${p.tech.map(t => `<span>${t}</span>`).join(' ')}</div>
      </div>`).join('');

  const skillHTML = data.skills.map(s => `
      <div class="sk"><dt>${s.category}</dt><dd>${s.items.join(' · ')}</dd></div>`).join('');

  const expHTML = data.experience.map(x => `
      <tr><td class="td-date">${x.duration}</td><td><strong>${x.role}</strong> — ${x.company}<br><span>${x.description}</span></td></tr>`).join('');

  const eduHTML = data.education.map(e => `
      <tr><td class="td-date">${e.year}</td><td><strong>${e.degree}</strong> — ${e.school}${e.description ? `<br><span>${e.description}</span>` : ''}</td></tr>`).join('');

  const certHTML = data.certificates.map(c => `
      <tr><td class="td-date">${c.date}</td><td><strong>${c.name}</strong> — ${c.issuer}${c.link ? ` <a href="${c.link}" target="_blank">↗</a>` : ''}</td></tr>`).join('');

  return `<!DOCTYPE html><html lang="en"><head><meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1.0"><title>${data.personal.name}</title><link href="https://fonts.googleapis.com/css2?family=IBM+Plex+Sans:wght@300;400;500;600;700&family=IBM+Plex+Mono:wght@400;500&display=swap" rel="stylesheet"><style>
*{margin:0;padding:0;box-sizing:border-box}
body{font-family:'IBM Plex Sans',sans-serif;background:${c.bg};color:${c.text};line-height:1.7;font-weight:400}
.wrap{max-width:720px;margin:0 auto;padding:80px 24px 60px}
/* Hero - left-aligned, understated */
.hero{margin-bottom:64px;display:flex;gap:32px;align-items:flex-start}
.avatar{width:88px;height:88px;border-radius:12px;object-fit:cover;background:${c.surface};display:flex;align-items:center;justify-content:center;font-size:1.8rem;color:${c.primary};font-weight:700;border:1px solid ${c.primary}25;flex-shrink:0}
.hero-text h1{font-size:2rem;font-weight:700;letter-spacing:-0.5px;margin-bottom:4px}
.hero-text .role{font-size:1rem;color:${c.accent};font-weight:500;margin-bottom:10px}
.hero-text .bio{font-size:0.9rem;color:${c.muted};max-width:500px;margin-bottom:12px}
.hero-text .meta{font-size:0.8rem;color:${c.muted};margin-bottom:12px}
.hero-text .meta span{margin-right:16px}
.social-links{display:flex;gap:8px;flex-wrap:wrap}
.social-link{font-size:0.8rem;font-weight:500;color:${c.accent};text-decoration:none;border-bottom:1px solid ${c.accent}40;padding-bottom:1px;transition:border-color .2s}
.social-link:hover{border-color:${c.accent}}
/* Sections */
.sep{border:none;border-top:1px solid ${c.primary}15;margin:48px 0}
section-title{font-size:0.7rem;font-weight:600;text-transform:uppercase;letter-spacing:4px;color:${c.muted};margin-bottom:24px}
/* Projects */
.proj{margin-bottom:28px}
.proj-head{display:flex;justify-content:space-between;align-items:baseline;gap:8px}
.proj h3{font-size:1.05rem;font-weight:600}
.proj p{font-size:0.88rem;color:${c.muted};margin:6px 0 8px}
.tags{display:flex;flex-wrap:wrap;gap:4px}
.tags span{font-family:'IBM Plex Mono',monospace;font-size:0.72rem;color:${c.muted};background:${c.primary}08;padding:2px 8px;border-radius:4px}
/* Skills */
dl{display:grid;grid-template-columns:140px 1fr;gap:8px 16px;font-size:0.88rem}
dt{font-weight:600;color:${c.accent}}
dd{color:${c.muted}}
/* Table (exp, edu, cert) */
table{width:100%;border-collapse:collapse;font-size:0.88rem}
td{padding:14px 0;vertical-align:top;border-top:1px solid ${c.primary}10}
.td-date{width:130px;color:${c.muted};font-family:'IBM Plex Mono',monospace;font-size:0.8rem;white-space:nowrap}
td strong{font-weight:600}
td span{color:${c.muted};font-size:0.85rem}
td a{color:${c.accent};text-decoration:none;font-weight:500}
footer{margin-top:64px;padding-top:24px;border-top:1px solid ${c.primary}10;font-size:0.78rem;color:${c.muted}}
@media(max-width:600px){.hero{flex-direction:column;align-items:center;text-align:center}.avatar{width:72px;height:72px;font-size:1.4rem}dl{grid-template-columns:1fr}.td-date{width:auto;display:block;margin-bottom:2px}}
</style></head><body><div class="wrap">
<div class="hero">
  ${avatarHTML}
  <div class="hero-text">
    <h1>${data.personal.name}</h1>
    <p class="role">${data.personal.title}</p>
    <p class="bio">${data.personal.bio}</p>
    <div class="meta">
      ${data.personal.location ? `<span>${data.personal.location}</span>` : ''}
      ${data.personal.email ? `<span>${data.personal.email}</span>` : ''}
      ${data.personal.phone ? `<span>${data.personal.phone}</span>` : ''}
    </div>
    <div class="social-links">${socialLinks}</div>
  </div>
</div>
${data.projects.length ? `<hr class="sep"><section-title>Projects</section-title>${projectHTML}` : ''}
${data.skills.length ? `<hr class="sep"><section-title>Skills</section-title>${skillHTML}` : ''}
${data.experience.length ? `<hr class="sep"><section-title>Experience</section-title><table>${expHTML}</table>` : ''}
${data.education.length ? `<hr class="sep"><section-title>Education</section-title><table>${eduHTML}</table>` : ''}
${data.certificates.length ? `<hr class="sep"><section-title>Certifications</section-title><table>${certHTML}</table>` : ''}
<footer>© ${new Date().getFullYear()} ${data.personal.name}</footer>
</div></body></html>`;
}

function generateCreative(data, c, avatarHTML, socialLinks) {
  const projectHTML = data.projects.map((p, i) => `
      <div class="proj-card proj-${i % 3}">
        <div class="proj-glow"></div>
        <div class="proj-num">${String(i + 1).padStart(2, '0')}</div>
        <h3>${p.title}</h3>
        <p>${p.description}</p>
        <div class="tags">${p.tech.map(t => `<span>${t}</span>`).join('')}</div>
        ${p.link ? `<a href="${p.link}" target="_blank">Explore →</a>` : ''}
      </div>`).join('');

  const skillHTML = data.skills.map((s, i) => `
      <div class="skill-pill">
        <span class="skill-cat">${s.category}</span>
        <span class="skill-items">${s.items.join(' • ')}</span>
      </div>`).join('');

  const expHTML = data.experience.map(x => `
      <div class="exp-card">
        <div class="exp-bar" style="background:linear-gradient(135deg,${c.primary},${c.secondary})"></div>
        <div class="exp-body">
          <span class="exp-date">${x.duration}</span>
          <h3>${x.role}</h3>
          <p class="exp-company">${x.company}</p>
          <p class="exp-desc">${x.description}</p>
        </div>
      </div>`).join('');

  const eduHTML = data.education.map(e => `
      <div class="edu-card">
        <div class="edu-accent"></div>
        <h3>${e.school}</h3>
        <p class="edu-deg">${e.degree}</p>
        <p class="edu-year">${e.year}</p>
        ${e.description ? `<p class="edu-desc">${e.description}</p>` : ''}
      </div>`).join('');

  const certHTML = data.certificates.map(c => `
      <div class="cert-pill">
        <span class="cert-badge">✓</span>
        <div><strong>${c.name}</strong><br><span>${c.issuer} · ${c.date}</span></div>
        ${c.link ? `<a href="${c.link}" target="_blank">↗</a>` : ''}
      </div>`).join('');

  return `<!DOCTYPE html><html lang="en"><head><meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1.0"><title>${data.personal.name}</title><link href="https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@300;400;500;600;700&display=swap" rel="stylesheet"><style>
*{margin:0;padding:0;box-sizing:border-box}
body{font-family:'Space Grotesk',sans-serif;background:${c.bg};color:${c.text};line-height:1.6;overflow-x:hidden}
/* Split layout */
.layout{display:grid;grid-template-columns:340px 1fr;min-height:100vh}
/* Sidebar */
.sidebar{background:${c.surface};border-right:1px solid ${c.primary}15;padding:48px 32px;position:sticky;top:0;height:100vh;overflow-y:auto;display:flex;flex-direction:column}
.sidebar .avatar{width:100px;height:100px;border-radius:20px;object-fit:cover;background:${c.bg};display:flex;align-items:center;justify-content:center;font-size:2.2rem;color:${c.primary};font-weight:700;margin-bottom:20px;border:2px solid ${c.primary}30}
.sidebar h1{font-size:1.6rem;font-weight:700;line-height:1.15;margin-bottom:4px}
.sidebar .role{color:${c.accent};font-weight:600;font-size:0.95rem;margin-bottom:16px}
.sidebar .bio{font-size:0.85rem;color:${c.muted};margin-bottom:20px;line-height:1.6}
.sidebar .info{font-size:0.8rem;color:${c.muted};margin-bottom:20px}
.sidebar .info div{margin-bottom:4px}
.social-links{display:flex;flex-wrap:wrap;gap:6px;margin-top:auto}
.social-link{padding:6px 14px;border:1px solid ${c.primary}30;border-radius:10px;font-size:0.75rem;font-weight:600;color:${c.accent};transition:all .2s}
.social-link:hover{background:${c.primary}15;border-color:${c.primary}}
/* Main content */
.main{padding:48px 40px}
.main .section-label{font-size:0.65rem;font-weight:700;text-transform:uppercase;letter-spacing:4px;color:${c.accent};margin-bottom:24px;display:flex;align-items:center;gap:10px}
.main .section-label::before{content:'';width:20px;height:2px;background:${c.primary}}
section{margin-bottom:48px}
/* Projects - asymmetric */
.proj-card{background:${c.surface};border:1px solid ${c.primary}15;border-radius:20px;padding:28px;margin-bottom:16px;position:relative;overflow:hidden;transition:transform .3s}
.proj-card:hover{transform:translateX(6px)}
.proj-glow{position:absolute;top:-30px;right:-30px;width:100px;height:100px;background:radial-gradient(circle,${c.primary}12,transparent);border-radius:50%}
.proj-num{font-size:3.5rem;font-weight:900;color:${c.primary}10;position:absolute;top:8px;right:20px;line-height:1}
.proj-card h3{font-size:1.1rem;font-weight:700;margin-bottom:8px;position:relative}
.proj-card p{font-size:0.85rem;color:${c.muted};margin-bottom:10px;position:relative}
.proj-card a{font-size:0.82rem;font-weight:600;position:relative}
.proj-0{border-left:3px solid ${c.primary}}
.proj-1{border-left:3px solid ${c.secondary}}
.proj-2{border-left:3px solid ${c.accent}}
/* Tags */
.tags{display:flex;flex-wrap:wrap;gap:5px;margin:10px 0}
.tags span{padding:4px 10px;background:${c.primary}10;color:${c.accent};border-radius:8px;font-size:0.7rem;font-weight:600}
/* Skills - horizontal pills */
.skill-pill{display:flex;align-items:center;gap:12px;padding:12px 16px;background:${c.surface};border:1px solid ${c.primary}12;border-radius:12px;margin-bottom:8px}
.skill-cat{font-size:0.78rem;font-weight:700;color:${c.accent};white-space:nowrap;min-width:90px}
.skill-items{font-size:0.82rem;color:${c.muted}}
/* Experience - cards with accent bar */
.exp-card{display:flex;gap:16px;margin-bottom:20px;background:${c.surface};border-radius:16px;padding:20px;border:1px solid ${c.primary}12}
.exp-bar{width:4px;border-radius:4px;flex-shrink:0}
.exp-body{flex:1}
.exp-date{font-size:0.72rem;font-weight:600;color:${c.muted};text-transform:uppercase;letter-spacing:1px}
.exp-body h3{font-size:1rem;margin:4px 0 2px}
.exp-company{color:${c.accent};font-weight:600;font-size:0.88rem;margin-bottom:6px}
.exp-desc{font-size:0.85rem;color:${c.muted}}
/* Education */
.edu-card{background:${c.surface};border:1px solid ${c.primary}12;border-radius:16px;padding:20px;margin-bottom:12px;position:relative;overflow:hidden}
.edu-accent{position:absolute;top:0;left:0;width:100%;height:3px;background:linear-gradient(90deg,${c.primary},${c.secondary})}
.edu-card h3{font-size:1rem;margin-bottom:4px}
.edu-deg{color:${c.accent};font-weight:600;font-size:0.88rem}
.edu-year{font-size:0.78rem;color:${c.muted};margin:4px 0}
.edu-desc{font-size:0.85rem;color:${c.muted}}
/* Certs */
.cert-pill{display:flex;align-items:center;gap:12px;padding:14px 16px;background:${c.surface};border:1px solid ${c.primary}12;border-radius:12px;margin-bottom:8px}
.cert-badge{width:32px;height:32px;border-radius:10px;background:linear-gradient(135deg,${c.primary},${c.secondary});display:flex;align-items:center;justify-content:center;color:#fff;font-size:0.9rem;font-weight:700;flex-shrink:0}
.cert-pill strong{font-size:0.88rem}
.cert-pill span{font-size:0.8rem;color:${c.muted}}
.cert-pill a{margin-left:auto;color:${c.accent};font-weight:600;font-size:0.85rem;text-decoration:none}
footer{padding:24px 40px;border-top:1px solid ${c.primary}10;font-size:0.78rem;color:${c.muted};text-align:center}
@keyframes slideIn{from{opacity:0;transform:translateX(-12px)}to{opacity:1;transform:translateX(0)}}
.proj-card,.exp-card,.edu-card,.cert-pill,.skill-pill{animation:slideIn .4s ease-out both}
.proj-card:nth-child(2),.exp-card:nth-child(2){animation-delay:.08s}
.proj-card:nth-child(3),.exp-card:nth-child(3){animation-delay:.16s}
@media(max-width:800px){.layout{grid-template-columns:1fr}.sidebar{position:relative;height:auto;border-right:none;border-bottom:1px solid ${c.primary}15}.main{padding:32px 20px}.avatar{width:80px;height:80px;font-size:1.8rem}}
</style></head><body>
<div class="layout">
  <aside class="sidebar">
    ${avatarHTML}
    <h1>${data.personal.name}</h1>
    <p class="role">${data.personal.title}</p>
    <p class="bio">${data.personal.bio}</p>
    <div class="info">
      ${data.personal.location ? `<div>📍 ${data.personal.location}</div>` : ''}
      ${data.personal.email ? `<div>✉ ${data.personal.email}</div>` : ''}
      ${data.personal.phone ? `<div>📱 ${data.personal.phone}</div>` : ''}
    </div>
    <div class="social-links">${socialLinks}</div>
  </aside>
  <main class="main">
    ${data.projects.length ? `<section><div class="section-label">Projects</div>${projectHTML}</section>` : ''}
    ${data.skills.length ? `<section><div class="section-label">Skills</div>${skillHTML}</section>` : ''}
    ${data.experience.length ? `<section><div class="section-label">Experience</div>${expHTML}</section>` : ''}
    ${data.education.length ? `<section><div class="section-label">Education</div>${eduHTML}</section>` : ''}
    ${data.certificates.length ? `<section><div class="section-label">Certifications</div>${certHTML}</section>` : ''}
    <footer>© ${new Date().getFullYear()} ${data.personal.name} — Built with BootBox</footer>
  </main>
</div>
</body></html>`;
}
