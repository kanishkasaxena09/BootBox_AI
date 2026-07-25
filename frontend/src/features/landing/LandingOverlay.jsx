import React, { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import { Search, Database, Wrench, TrendingUp } from 'lucide-react';

const modules = [
  { id: 'sol-database', name: 'SOL Database', icon: Database, desc: 'All semester organized resources, notes, PPT, assignments, case studies.', color: 'from-blue-500 to-indigo-500' },
  { id: 'tools', name: 'Tools', icon: Wrench, desc: 'Resume builder, career tests, interview prep, study planner and other essential tools.', color: 'from-pink-500 to-rose-500' },
  { id: 'skills', name: 'Skills & Development', icon: TrendingUp, desc: 'Skill assessment, learning paths, certifications, and personal development resources.', color: 'from-emerald-500 to-teal-500' },
];

const allSearchableItems = [
  ...modules.map(m => ({ ...m, type: 'module' })),
  { id: 'tools', name: 'Resume Builder', type: 'tool', parent: 'Tools' },
  { id: 'tools', name: 'ATS Resume Audit', type: 'tool', parent: 'Tools' },
  { id: 'tools', name: 'Merge PDF', type: 'tool', parent: 'Tools' },
  { id: 'tools', name: 'Split PDF', type: 'tool', parent: 'Tools' },
  { id: 'tools', name: 'Compress PDF', type: 'tool', parent: 'Tools' },
  { id: 'tools', name: 'PDF to Word', type: 'tool', parent: 'Tools' },
  { id: 'tools', name: 'Word to PDF', type: 'tool', parent: 'Tools' },
  { id: 'tools', name: 'PDF to JPG', type: 'tool', parent: 'Tools' },
  { id: 'tools', name: 'JPG to PDF', type: 'tool', parent: 'Tools' },
  { id: 'tools', name: 'Watermark PDF', type: 'tool', parent: 'Tools' },
  { id: 'tools', name: 'Rotate PDF', type: 'tool', parent: 'Tools' },
  { id: 'tools', name: 'AI PDF Summarizer', type: 'tool', parent: 'Tools' },
  { id: 'tools', name: 'HTML to PDF', type: 'tool', parent: 'Tools' },
  { id: 'tools', name: 'PDF to PowerPoint', type: 'tool', parent: 'Tools' },
  { id: 'tools', name: 'PDF to Excel', type: 'tool', parent: 'Tools' },
  { id: 'tools', name: 'CGPA Calculator', type: 'tool', parent: 'Tools' },
  { id: 'tools', name: 'SGPA Calculator', type: 'tool', parent: 'Tools' },
  { id: 'tools', name: 'Image Compressor', type: 'tool', parent: 'Tools' },
  { id: 'tools', name: 'Zip Converter', type: 'tool', parent: 'Tools' },
  { id: 'tools', name: 'Feedback', type: 'tool', parent: 'Tools' },
];

const blobs = [
  { color: 'from-pink-500/20 to-rose-500/10', size: 'w-96 h-96', pos: 'top-0 left-0', delay: 0 },
  { color: 'from-rose-500/15 to-pink-600/5', size: 'w-[500px] h-[500px]', pos: 'bottom-0 right-0', delay: 2 },
  { color: 'from-pink-400/10 to-fuchsia-500/10', size: 'w-72 h-72', pos: 'top-[20%] right-[15%]', delay: 4 },
  { color: 'from-rose-400/10 to-pink-500/5', size: 'w-80 h-80', pos: 'bottom-[10%] left-[10%]', delay: 1 },
];

const LandingOverlay = ({ onNavigate }) => {
  const [query, setQuery] = useState('');

  const results = useMemo(() => {
    if (!query.trim()) return [];
    const q = query.toLowerCase();
    return allSearchableItems.filter(item => item.name.toLowerCase().includes(q)).slice(0, 8);
  }, [query]);

  const handleResultClick = (item) => {
    setQuery('');
    onNavigate(item.id);
  };

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
      transition={{ duration: 0.4 }}
      className="relative w-full min-h-[calc(100vh-56px)]">

      {/* Fixed background layer — blobs + grid cover full viewport */}
      <div className="fixed inset-0 z-0 overflow-hidden pointer-events-none">
        {blobs.map((b, i) => (
          <motion.div key={i}
            className={`absolute ${b.size} ${b.pos} rounded-full bg-gradient-to-br ${b.color} blur-3xl`}
            animate={{ y: [0, 30, -20, 0], x: [0, -20, 15, 0], scale: [1, 1.1, 0.95, 1] }}
            transition={{ duration: 12 + i * 2, repeat: Infinity, ease: 'easeInOut', delay: b.delay }}
          />
        ))}
        <div className="absolute inset-0 opacity-[0.03] dark:opacity-[0.05]"
          style={{
            backgroundImage: 'linear-gradient(var(--text-secondary) 1px, transparent 1px), linear-gradient(90deg, var(--text-secondary) 1px, transparent 1px)',
            backgroundSize: '60px 60px',
          }}
        />
      </div>

      <div className="relative z-10 w-full flex flex-col items-center justify-center px-4 py-8">
        <div className="w-full max-w-4xl space-y-8">

          {/* Hero */}
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }} className="text-center space-y-4">
            <div className="relative w-32 h-32 mx-auto flex items-center justify-center">
              <motion.div initial={{ scale: 0.5, opacity: 0 }}
                animate={{ scale: [1, 1.05, 1], opacity: 0.8 }}
                transition={{ scale: { duration: 3, repeat: Infinity, ease: "easeInOut" }, opacity: { duration: 1.5, ease: "easeOut" } }}
                className="absolute inset-4 bg-pink-500/10 rounded-full blur-2xl pointer-events-none" />
              <motion.div initial={{ clipPath: "inset(100% 0% 0% 0%)", scale: 0.9, filter: "brightness(0.5) contrast(1.2)" }}
                animate={{ clipPath: "inset(0% 0% 0% 0%)", scale: 1, filter: "brightness(1) contrast(1)" }}
                transition={{ duration: 2.0, delay: 0.1, ease: "easeInOut" }}
                className="relative w-full h-full">
                <motion.div animate={{ y: [0, -8, 0] }}
                  transition={{ duration: 4, repeat: Infinity, ease: "easeInOut", delay: 2.2 }}
                  className="w-full h-full flex items-center justify-center">
                  <img src="/hero.png" alt="SOLMATES"
                    className="w-full h-full object-contain select-none pointer-events-none" />
                </motion.div>
              </motion.div>
            </div>
            <div className="space-y-2">
              <h1 className="text-5xl md:text-7xl font-black tracking-tight">
                <span className="bg-gradient-to-r from-pink-500 via-rose-500 to-pink-600 bg-clip-text text-transparent">
                  BOOTBOX
                </span>
              </h1>
              <p className="text-base md:text-lg text-[var(--text-secondary)]">
                Connect • Learn • Belong
              </p>
              <p className="text-sm text-[var(--text-secondary)] opacity-70">
                Hey! Chalo brain workout karein. ⚡
              </p>
            </div>
          </motion.div>

          {/* Search Bar */}
          <motion.div initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.15 }} className="relative max-w-2xl mx-auto w-full">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-pink-400" />
            <input type="text" value={query} onChange={(e) => setQuery(e.target.value)}
              placeholder="Search... tools, modules, etc."
              className="w-full pl-12 pr-4 py-4 rounded-2xl border border-[var(--border-color)] bg-[var(--card-bg)] text-[var(--text-primary)] text-sm placeholder:text-[var(--text-secondary)] placeholder:opacity-50 focus:outline-none focus:ring-2 focus:ring-pink-500 shadow-lg shadow-pink-500/5 transition-all" />

            {results.length > 0 && (
              <div className="absolute top-full left-0 right-0 mt-2 glass-panel rounded-xl border border-[var(--border-color)] overflow-hidden z-20 shadow-xl">
                {results.map((item, i) => (
                  <button key={i} onClick={() => handleResultClick(item)}
                    className="w-full px-4 py-3 text-left hover:bg-pink-500/10 transition-colors flex items-center justify-between border-b border-[var(--border-color)] last:border-0">
                    <div>
                      <p className="text-sm font-semibold text-[var(--text-primary)]">{item.name}</p>
                      {item.type === 'tool' && (
                        <p className="text-[10px] text-[var(--text-secondary)]">in {item.parent}</p>
                      )}
                    </div>
                    <span className="text-[10px] px-2 py-0.5 rounded-full bg-pink-100 dark:bg-pink-950/40 text-pink-600 dark:text-pink-400 font-medium">
                      {item.type === 'module' ? 'Module' : 'Tool'}
                    </span>
                  </button>
                ))}
              </div>
            )}
          </motion.div>

          {/* Module Cards */}
          <motion.div initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.25 }}
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {modules.map((mod, i) => {
              const Icon = mod.icon;
              return (
                <motion.div key={mod.id}
                  initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 + i * 0.06 }}
                  whileHover={{ y: -4 }}
                  onClick={() => onNavigate(mod.id)}
                  className="card-hover-border glass-panel border border-[var(--border-color)] p-5 rounded-2xl cursor-pointer transition-all shadow-sm group">
                  <div className={`w-10 h-10 rounded-xl flex items-center justify-center bg-gradient-to-br ${mod.color} text-white shadow-md mb-3`}>
                    <Icon className="h-5 w-5" />
                  </div>
                  <h3 className="font-bold text-sm text-[var(--text-primary)] group-hover:text-pink-600 dark:group-hover:text-pink-400 transition-colors">{mod.name}</h3>
                  <p className="text-xs text-[var(--text-secondary)] mt-1 leading-relaxed">{mod.desc}</p>
                </motion.div>
              );
            })}
          </motion.div>
        </div>
      </div>
    </motion.div>
  );
};

export default LandingOverlay;
