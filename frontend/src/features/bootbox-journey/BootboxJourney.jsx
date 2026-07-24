import React from 'react';
import { motion } from 'framer-motion';
import { Heart, Users, Zap, Shield, Globe, Code, GraduationCap, Sparkles, FileText, Calculator, FileDown } from 'lucide-react';

const features = [
  { icon: Sparkles, title: 'AI Career Toolkit', desc: 'Build ATS-friendly resumes with AI-powered enhancement, optimization, and professional PDF generation.' },
  { icon: FileText, title: 'PDF Suite', desc: '16+ tools to merge, split, compress, watermark, rotate, convert, and summarize PDF documents.' },
  { icon: Calculator, title: 'Academic Calculators', desc: 'Calculate CGPA and SGPA across semesters with instant, accurate results.' },
  { icon: FileDown, title: 'File Compression', desc: 'Optimize PDFs and images for faster sharing without quality loss.' },
  { icon: Shield, title: 'Privacy First', desc: 'No accounts, no sign-ups, no data stored. Your files are processed and deleted immediately.' },
  { icon: Zap, title: 'Lightning Fast', desc: 'All processing happens in real-time on our servers with optimized pipelines.' },
];

const techStack = [
  { name: 'React', role: 'Frontend UI' },
  { name: 'Tailwind CSS', role: 'Styling' },
  { name: 'Express.js', role: 'Backend API' },
  { name: 'SQLite', role: 'Database' },
  { name: 'Groq AI', role: 'AI Engine' },
  { name: 'pdf-lib', role: 'PDF Processing' },
  { name: 'Sharp', role: 'Image Processing' },
  { name: 'Framer Motion', role: 'Animations' },
];

const BootboxJourney = () => {
  return (
    <div className="space-y-8 text-left">
      <motion.div initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }}
        className="glass-panel rounded-2xl p-8 md:p-12 text-center space-y-6">
        <div className="inline-flex items-center justify-center h-16 w-16 bg-gradient-to-tr from-pink-500 to-rose-500 rounded-2xl shadow-lg shadow-pink-500/20">
          <span className="text-white font-black text-2xl">B</span>
        </div>
        <h1 className="text-3xl md:text-4xl font-black tracking-tight">
          <span className="bg-gradient-to-r from-pink-500 via-rose-500 to-pink-600 bg-clip-text text-transparent">
            About BootBox AI
          </span>
        </h1>
        <p className="text-[var(--text-secondary)] max-w-2xl mx-auto leading-relaxed text-sm md:text-base">
          An all-in-one platform combining AI-powered career tools with a comprehensive document processing suite.
          Built to eliminate friction — no sign-ups, no tracking, just instant productivity.
        </p>
      </motion.div>

      <motion.div initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
        className="glass-panel rounded-2xl p-8 space-y-6">
        <div className="flex items-center space-x-3">
          <div className="p-2 bg-pink-500/10 rounded-lg">
            <Users className="h-5 w-5 text-pink-500" />
          </div>
          <h2 className="text-xl font-bold text-[var(--text-primary)]">Meet the Creator</h2>
        </div>
        <div className="flex flex-col md:flex-row items-center md:items-start gap-6">
          <div className="shrink-0">
            <div className="w-32 h-32 rounded-2xl overflow-hidden border-2 border-pink-500/30 shadow-lg shadow-pink-500/10">
              <img src="/kanishka.png" alt="Kanishka" className="w-full h-full object-cover" />
            </div>
          </div>
          <div className="flex-1 text-center md:text-left space-y-3">
            <div>
              <h3 className="text-lg font-bold text-[var(--text-primary)]">Kanishka Saxena</h3>
              <p className="text-xs text-pink-500 font-semibold flex items-center justify-center md:justify-start space-x-1">
                <GraduationCap className="h-3.5 w-3.5" />
                <span>Full-Stack Developer & AI Engineer</span>
              </p>
            </div>
            <p className="text-sm text-[var(--text-secondary)] leading-relaxed">
              Built BootBox AI as a B.Tech project to create a meaningful, real-world application that
              combines AI capabilities with practical productivity tools. Designed and developed the entire
              platform from scratch — frontend, backend, AI integration, and deployment.
            </p>
            <div className="flex flex-wrap gap-2 justify-center md:justify-start">
              {['React', 'Node.js', 'Express', 'SQLite', 'Groq AI', 'pdf-lib'].map((tag, i) => (
                <span key={i} className="text-[10px] px-2 py-0.5 rounded-full bg-pink-100 dark:bg-pink-950/40 text-pink-700 dark:text-pink-300 font-medium">
                  {tag}
                </span>
              ))}
            </div>
          </div>
        </div>
      </motion.div>

      <motion.div initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}
        className="glass-panel rounded-2xl p-8 space-y-4">
        <div className="flex items-center space-x-3">
          <div className="p-2 bg-pink-500/10 rounded-lg">
            <Heart className="h-5 w-5 text-pink-500" />
          </div>
          <h2 className="text-xl font-bold text-[var(--text-primary)]">Our Mission</h2>
        </div>
        <p className="text-[var(--text-secondary)] leading-relaxed text-sm md:text-base">
          We believe essential productivity tools should be accessible to everyone without barriers.
          BootBox AI was created to merge the power of artificial intelligence with practical document tools —
          all in a single, beautifully designed platform that respects your privacy and time.
        </p>
      </motion.div>

      <motion.div initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}
        className="space-y-5">
        <div className="flex items-center space-x-3">
          <div className="p-2 bg-pink-500/10 rounded-lg">
            <Zap className="h-5 w-5 text-pink-500" />
          </div>
          <h2 className="text-xl font-bold text-[var(--text-primary)]">What We Offer</h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {features.map((f, i) => {
            const Icon = f.icon;
            return (
              <motion.div key={i} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 * i }} className="glass-panel rounded-xl p-5 space-y-3 glow-hover">
                <div className="p-2 bg-pink-500/10 rounded-lg w-fit">
                  <Icon className="h-5 w-5 text-pink-500" />
                </div>
                <h3 className="font-bold text-[var(--text-primary)] text-sm">{f.title}</h3>
                <p className="text-xs text-[var(--text-secondary)] leading-relaxed">{f.desc}</p>
              </motion.div>
            );
          })}
        </div>
      </motion.div>

      <motion.div initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }}
        className="glass-panel rounded-2xl p-8 space-y-5">
        <div className="flex items-center space-x-3">
          <div className="p-2 bg-pink-500/10 rounded-lg">
            <Code className="h-5 w-5 text-pink-500" />
          </div>
          <h2 className="text-xl font-bold text-[var(--text-primary)]">Tech Stack</h2>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {techStack.map((t, i) => (
            <div key={i} className="p-3 rounded-xl bg-[var(--muted-bg)] border border-[var(--border-color)] text-center space-y-1 cursor-default transition-all duration-300 hover:border-pink-500/40 hover:bg-pink-500/5 hover:shadow-lg hover:shadow-pink-500/5 hover:-translate-y-1">
              <p className="font-bold text-sm text-[var(--text-primary)]">{t.name}</p>
              <p className="text-[10px] text-[var(--text-secondary)]">{t.role}</p>
            </div>
          ))}
        </div>
      </motion.div>

      <motion.div initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 }}
        className="glass-panel rounded-2xl p-8 space-y-5">
        <div className="flex items-center space-x-3">
          <div className="p-2 bg-pink-500/10 rounded-lg">
            <Globe className="h-5 w-5 text-pink-500" />
          </div>
          <h2 className="text-xl font-bold text-[var(--text-primary)]">Core Values</h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {[
            { title: 'No Accounts Required', desc: 'Jump in and start using every tool instantly. We don\'t believe in sign-up walls.' },
            { title: 'Data Privacy', desc: 'Files are processed in memory and deleted immediately after. Nothing is stored or tracked.' },
            { title: 'Open & Free', desc: 'All core features are completely free. We\'re building tools we wished existed.' },
          ].map((v, i) => (
            <div key={i} className="p-4 rounded-xl border border-[var(--border-color)] bg-[var(--card-bg)]/50 space-y-2">
              <h3 className="font-bold text-sm text-[var(--text-primary)]">{v.title}</h3>
              <p className="text-xs text-[var(--text-secondary)] leading-relaxed">{v.desc}</p>
            </div>
          ))}
        </div>
      </motion.div>

      <div className="text-center pb-4">
        <p className="text-xs text-[var(--text-secondary)]">
          Built with <span className="text-pink-500">♥</span> by the BootBox &mdash; {new Date().getFullYear()}
        </p>
      </div>
    </div>
  );
};

export default BootboxJourney;
