import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Globe, User, FolderOpen, Award, GraduationCap, Briefcase, BadgeCheck,
  Plus, Trash2, Download, FileArchive, Eye, EyeOff, Palette, Layout,
  ChevronDown, ExternalLink, RotateCcw, Copy, Check, Link2,
  Settings, Sparkles, Monitor, Smartphone,
} from 'lucide-react';
import usePortfolio from './usePortfolio';

const fadeUp = { initial: { opacity: 0, y: 12 }, animate: { opacity: 1, y: 0 }, transition: { duration: 0.2 } };

const ThemeDropdown = ({ value, onChange, themes }) => {
  const [open, setOpen] = useState(false);
  const ref = useRef(null);
  const selected = themes.find(t => t.id === value) || themes[0];

  useEffect(() => {
    const handler = (e) => { if (ref.current && !ref.current.contains(e.target)) setOpen(false); };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  return (
    <div ref={ref} className="relative">
      <button onClick={() => setOpen(!open)}
        className="flex items-center gap-2.5 px-3 py-2 rounded-xl border transition-all duration-200 min-w-[180px]
          bg-[var(--bg-secondary)] hover:bg-[var(--bg-secondary)]/80
          border-[var(--border)] hover:border-[var(--accent)]/50 active:scale-[0.98]">
        <div className="w-6 h-6 rounded-lg border border-white/10 shadow-inner flex-shrink-0"
          style={{ background: `linear-gradient(135deg, ${selected.colors.primary}, ${selected.colors.secondary})` }} />
        <div className="flex flex-col items-start flex-1 min-w-0">
          <span className="text-[9px] font-bold uppercase tracking-widest text-[var(--accent)]">Theme</span>
          <span className="text-xs font-bold text-[var(--text-primary)] truncate w-full text-left">{selected.name}</span>
        </div>
        <ChevronDown className={`w-3.5 h-3.5 text-[var(--text-secondary)] transition-transform duration-200 flex-shrink-0 ${open ? 'rotate-180 text-[var(--accent)]' : ''}`} />
      </button>

      <AnimatePresence>
        {open && (
          <motion.div initial={{ opacity: 0, y: -8, scale: 0.96 }} animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -8, scale: 0.96 }} transition={{ duration: 0.15 }}
            className="absolute top-full left-0 mt-2 w-64 max-h-80 overflow-y-auto z-[100] rounded-2xl p-2 space-y-0.5
              bg-[var(--bg-primary)] border border-[var(--border)] shadow-2xl shadow-black/40">
            {themes.map(t => (
              <button key={t.id} onClick={() => { onChange(t.id); setOpen(false); }}
                className={`w-full flex items-center gap-3 px-3 py-2 rounded-xl text-left transition-all duration-150
                  ${t.id === value
                    ? 'bg-[var(--accent)]/15 border border-[var(--accent)]/30'
                    : 'hover:bg-[var(--bg-secondary)] border border-transparent hover:border-[var(--border)]'
                  }`}>
                <div className="w-8 h-8 rounded-lg border border-white/10 shadow-inner flex-shrink-0"
                  style={{ background: `linear-gradient(135deg, ${t.colors.primary}, ${t.colors.secondary})` }} />
                <div className="flex-1 min-w-0">
                  <div className="text-xs font-bold text-[var(--text-primary)] truncate">{t.name}</div>
                  <div className="text-[10px] text-[var(--text-secondary)] truncate">{t.id}</div>
                </div>
                {t.id === value && <Check className="w-3.5 h-3.5 text-[var(--accent)] shrink-0" />}
              </button>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

const LayoutDropdown = ({ value, onChange, templates }) => {
  const [open, setOpen] = useState(false);
  const ref = useRef(null);
  const selected = templates.find(t => t.id === value) || templates[0];
  const layoutIcons = {
    modern: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-5 h-5">
        <rect x="3" y="3" width="18" height="18" rx="3" />
        <line x1="12" y1="3" x2="12" y2="10" />
        <line x1="3" y1="14" x2="21" y2="14" />
      </svg>
    ),
    minimal: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-5 h-5">
        <rect x="3" y="3" width="18" height="18" rx="3" />
        <line x1="3" y1="9" x2="21" y2="9" />
        <line x1="3" y1="15" x2="21" y2="15" />
      </svg>
    ),
    creative: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-5 h-5">
        <rect x="3" y="3" width="18" height="18" rx="3" />
        <line x1="10" y1="3" x2="10" y2="21" />
      </svg>
    ),
  };

  useEffect(() => {
    const handler = (e) => { if (ref.current && !ref.current.contains(e.target)) setOpen(false); };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  return (
    <div ref={ref} className="relative">
      <button onClick={() => setOpen(!open)}
        className="flex items-center gap-2.5 px-3 py-2 rounded-xl border transition-all duration-200 min-w-[170px]
          bg-[var(--bg-secondary)] hover:bg-[var(--bg-secondary)]/80
          border-[var(--border)] hover:border-[var(--accent)]/50 active:scale-[0.98]">
        <div className="w-6 h-6 rounded-lg bg-[var(--accent)]/15 text-[var(--accent)] flex items-center justify-center flex-shrink-0">
          {layoutIcons[selected.id] || layoutIcons.modern}
        </div>
        <div className="flex flex-col items-start flex-1 min-w-0">
          <span className="text-[9px] font-bold uppercase tracking-widest text-[var(--accent)]">Layout</span>
          <span className="text-xs font-bold text-[var(--text-primary)] truncate w-full text-left">{selected.name}</span>
        </div>
        <ChevronDown className={`w-3.5 h-3.5 text-[var(--text-secondary)] transition-transform duration-200 flex-shrink-0 ${open ? 'rotate-180 text-[var(--accent)]' : ''}`} />
      </button>

      <AnimatePresence>
        {open && (
          <motion.div initial={{ opacity: 0, y: -8, scale: 0.96 }} animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -8, scale: 0.96 }} transition={{ duration: 0.15 }}
            className="absolute top-full left-0 mt-2 w-64 z-[100] rounded-2xl p-2 space-y-0.5
              bg-[var(--bg-primary)] border border-[var(--border)] shadow-2xl shadow-black/40">
            {templates.map(t => (
              <button key={t.id} onClick={() => { onChange(t.id); setOpen(false); }}
                className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-left transition-all duration-150
                  ${t.id === value
                    ? 'bg-[var(--accent)]/15 border border-[var(--accent)]/30'
                    : 'hover:bg-[var(--bg-secondary)] border border-transparent hover:border-[var(--border)]'
                  }`}>
                <div className={`w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0
                  ${t.id === value ? 'bg-[var(--accent)]/20 text-[var(--accent)]' : 'bg-[var(--bg-secondary)] text-[var(--text-secondary)]'}`}>
                  {layoutIcons[t.id] || layoutIcons.modern}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="text-xs font-bold text-[var(--text-primary)]">{t.name}</div>
                  <div className="text-[10px] text-[var(--text-secondary)] leading-tight">{t.desc}</div>
                </div>
                {t.id === value && <Check className="w-3.5 h-3.5 text-[var(--accent)] shrink-0" />}
              </button>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

const Input = ({ label, value, onChange, placeholder, multiline, type = 'text' }) => (
  <div className="space-y-1">
    <label className="text-[10px] font-bold uppercase tracking-wider text-[var(--text-secondary)]">{label}</label>
    {multiline ? (
      <textarea value={value} onChange={e => onChange(e.target.value)} placeholder={placeholder} rows={3}
        className="w-full px-3 py-2 rounded-xl text-xs font-medium resize-none outline-none
          bg-[var(--bg-secondary)] border border-[var(--border)] text-[var(--text-primary)]
          hover:border-[var(--accent)] focus:border-[var(--accent)] focus:ring-2 focus:ring-[var(--accent)]/20" />
    ) : (
      <input type={type} value={value} onChange={e => onChange(e.target.value)} placeholder={placeholder}
        className="w-full px-3 py-2 rounded-xl text-xs font-medium outline-none
          bg-[var(--bg-secondary)] border border-[var(--border)] text-[var(--text-primary)]
          hover:border-[var(--accent)] focus:border-[var(--accent)] focus:ring-2 focus:ring-[var(--accent)]/20" />
    )}
  </div>
);

const Card = ({ children, onRemove }) => (
  <div className="p-3 rounded-xl bg-[var(--bg-secondary)] border border-[var(--border)] space-y-2 relative group">
    {onRemove && (
      <button onClick={onRemove} className="absolute top-2 right-2 p-1 rounded-lg text-red-400 hover:text-red-300 hover:bg-red-500/10 opacity-0 group-hover:opacity-100 transition-all">
        <Trash2 className="w-3 h-3" />
      </button>
    )}
    {children}
  </div>
);

const AddButton = ({ onClick, label }) => (
  <button onClick={onClick}
    className="w-full py-2 rounded-xl text-xs font-bold text-[var(--accent)] border-2 border-dashed border-[var(--accent)]/30 hover:border-[var(--accent)]/60 hover:bg-[var(--accent)]/5 transition-all flex items-center justify-center gap-1.5">
    <Plus className="w-3 h-3" /> {label}
  </button>
);

export default function PortfolioBuilder() {
  const h = usePortfolio();
  const [copied, setCopied] = useState(false);
  const [previewSize, setPreviewSize] = useState('desktop');

  const copy = (text) => {
    navigator.clipboard?.writeText(text).catch(() => {});
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };

  const iconMap = { User, FolderOpen, Award, GraduationCap, Briefcase, BadgeCheck, Globe };

  const renderPersonal = () => (
    <div className="space-y-3">
      <Input label="Full Name" value={h.data.personal.name} onChange={v => h.updatePersonal('name', v)} placeholder="John Doe" />
      <Input label="Professional Title" value={h.data.personal.title} onChange={v => h.updatePersonal('title', v)} placeholder="Full Stack Developer" />
      <Input label="Bio / Summary" value={h.data.personal.bio} onChange={v => h.updatePersonal('bio', v)} placeholder="Tell the world about yourself..." multiline />
      <div className="grid grid-cols-2 gap-2">
        <Input label="Email" value={h.data.personal.email} onChange={v => h.updatePersonal('email', v)} placeholder="you@email.com" />
        <Input label="Phone" value={h.data.personal.phone} onChange={v => h.updatePersonal('phone', v)} placeholder="+91 98765 43210" />
      </div>
      <Input label="Location" value={h.data.personal.location} onChange={v => h.updatePersonal('location', v)} placeholder="Bangalore, India" />
      <div className="space-y-1">
        <label className="text-[10px] font-bold uppercase tracking-wider text-[var(--text-secondary)]">Profile Photo</label>
        <div className="flex items-center gap-3">
          {h.data.personal.avatar && (
            <div className="relative group shrink-0">
              <img src={h.data.personal.avatar} alt="Avatar" className="w-14 h-14 rounded-full object-cover border-2 border-[var(--accent)]" />
              <button onClick={() => h.updatePersonal('avatar', '')}
                className="absolute -top-1 -right-1 w-5 h-5 rounded-full bg-red-500 text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity text-xs font-bold">
                ×
              </button>
            </div>
          )}
          <div className="flex-1 flex gap-2">
            <label className="flex-1 flex items-center justify-center gap-1.5 px-3 py-2.5 rounded-xl text-xs font-bold
              bg-[var(--bg-secondary)] border border-dashed border-[var(--accent)]/40 text-[var(--accent)]
              hover:border-[var(--accent)] hover:bg-[var(--accent)]/5 transition-all cursor-pointer">
              <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
              Upload Photo
              <input type="file" accept="image/*" className="hidden" onChange={e => {
                const file = e.target.files?.[0];
                if (!file) return;
                const reader = new FileReader();
                reader.onload = (ev) => h.updatePersonal('avatar', ev.target.result);
                reader.readAsDataURL(file);
              }} />
            </label>
          </div>
        </div>
        <Input label="Or paste image URL" value={h.data.personal.avatar.startsWith('data:') ? '' : h.data.personal.avatar}
          onChange={v => h.updatePersonal('avatar', v)} placeholder="https://example.com/photo.jpg" />
      </div>
    </div>
  );

  const renderProjects = () => (
    <div className="space-y-3">
      {h.data.projects.map(p => (
        <Card key={p.id} onRemove={() => h.removeProject(p.id)}>
          <Input label="Project Title" value={p.title} onChange={v => h.updateProject(p.id, 'title', v)} placeholder="Project Name" />
          <Input label="Description" value={p.description} onChange={v => h.updateProject(p.id, 'description', v)} placeholder="What does it do?" multiline />
          <Input label="Technologies (comma-separated)" value={p.tech.join(', ')} onChange={v => h.updateProject(p.id, 'tech', v.split(',').map(i => i.trim()).filter(Boolean))} placeholder="React, Node.js, MongoDB" />
          <Input label="Link (optional)" value={p.link} onChange={v => h.updateProject(p.id, 'link', v)} placeholder="https://..." />
        </Card>
      ))}
      <AddButton onClick={h.addProject} label="Add Project" />
    </div>
  );

  const renderSkills = () => (
    <div className="space-y-3">
      {h.data.skills.map((s, i) => (
        <Card key={i} onRemove={() => h.removeSkillCategory(i)}>
          <Input label="Category Name" value={s.category} onChange={v => h.updateSkillCategory(i, v)} placeholder="Frontend" />
          <Input label="Skills (comma-separated)" value={s.items.join(', ')} onChange={v => h.updateSkillItems(i, v)} placeholder="React, TypeScript, Tailwind" />
        </Card>
      ))}
      <AddButton onClick={h.addSkillCategory} label="Add Skill Category" />
    </div>
  );

  const renderEducation = () => (
    <div className="space-y-3">
      {h.data.education.map(e => (
        <Card key={e.id} onRemove={() => h.removeEducation(e.id)}>
          <Input label="School / University" value={e.school} onChange={v => h.updateEducation(e.id, 'school', v)} placeholder="IIT Bombay" />
          <Input label="Degree" value={e.degree} onChange={v => h.updateEducation(e.id, 'degree', v)} placeholder="B.Tech in CS" />
          <Input label="Year" value={e.year} onChange={v => h.updateEducation(e.id, 'year', v)} placeholder="2020 - 2024" />
          <Input label="Description" value={e.description} onChange={v => h.updateEducation(e.id, 'description', v)} placeholder="CGPA, achievements..." multiline />
        </Card>
      ))}
      <AddButton onClick={h.addEducation} label="Add Education" />
    </div>
  );

  const renderExperience = () => (
    <div className="space-y-3">
      {h.data.experience.map(x => (
        <Card key={x.id} onRemove={() => h.removeExperience(x.id)}>
          <Input label="Company" value={x.company} onChange={v => h.updateExperience(x.id, 'company', v)} placeholder="Google" />
          <Input label="Role" value={x.role} onChange={v => h.updateExperience(x.id, 'role', v)} placeholder="Software Engineer" />
          <Input label="Duration" value={x.duration} onChange={v => h.updateExperience(x.id, 'duration', v)} placeholder="2024 - Present" />
          <Input label="Description" value={x.description} onChange={v => h.updateExperience(x.id, 'description', v)} placeholder="What did you do?" multiline />
        </Card>
      ))}
      <AddButton onClick={h.addExperience} label="Add Experience" />
    </div>
  );

  const renderCertificates = () => (
    <div className="space-y-3">
      {h.data.certificates.map(c => (
        <Card key={c.id} onRemove={() => h.removeCertificate(c.id)}>
          <Input label="Certificate Name" value={c.name} onChange={v => h.updateCertificate(c.id, 'name', v)} placeholder="AWS Solutions Architect" />
          <div className="grid grid-cols-2 gap-2">
            <Input label="Issuer" value={c.issuer} onChange={v => h.updateCertificate(c.id, 'issuer', v)} placeholder="AWS" />
            <Input label="Date" value={c.date} onChange={v => h.updateCertificate(c.id, 'date', v)} placeholder="2024" />
          </div>
          <Input label="Link (optional)" value={c.link} onChange={v => h.updateCertificate(c.id, 'link', v)} placeholder="https://..." />
        </Card>
      ))}
      <AddButton onClick={h.addCertificate} label="Add Certificate" />
    </div>
  );

  const renderSocials = () => {
    const platforms = ['GitHub', 'LinkedIn', 'Twitter', 'Instagram', 'YouTube', 'Dribbble', 'Behance', 'Personal Website'];
    return (
      <div className="space-y-2">
        {platforms.map(p => {
          const existing = h.data.socials.find(s => s.platform === p);
          return (
            <div key={p} className="flex items-center gap-2">
              <span className="text-xs font-bold text-[var(--text-secondary)] w-24 shrink-0">{p}</span>
              <div className="relative flex-1">
                <Link2 className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3 h-3 text-[var(--text-secondary)]" />
                <input value={existing?.url || ''} onChange={e => h.updateSocial(p, e.target.value)}
                  placeholder={`https://${p.toLowerCase()}.com/...`}
                  className="w-full pl-7 pr-3 py-2 rounded-xl text-xs font-medium outline-none
                    bg-[var(--bg-secondary)] border border-[var(--border)] text-[var(--text-primary)]
                    hover:border-[var(--accent)] focus:border-[var(--accent)] focus:ring-2 focus:ring-[var(--accent)]/20" />
              </div>
            </div>
          );
        })}
      </div>
    );
  };

  const renderSection = () => {
    switch (h.activeSection) {
      case 'personal': return renderPersonal();
      case 'projects': return renderProjects();
      case 'skills': return renderSkills();
      case 'education': return renderEducation();
      case 'experience': return renderExperience();
      case 'certificates': return renderCertificates();
      case 'socials': return renderSocials();
      default: return renderPersonal();
    }
  };

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="text-center space-y-2">
        <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-gradient-to-br from-violet-500/20 to-purple-500/20 border border-violet-500/30">
          <Globe className="w-7 h-7 text-violet-400" />
        </div>
        <h1 className="text-3xl font-black bg-gradient-to-r from-violet-400 via-purple-400 to-fuchsia-400 bg-clip-text text-transparent">
          Portfolio Builder
        </h1>
        <p className="text-sm text-[var(--text-secondary)] max-w-md mx-auto">
          Build a professional portfolio website with live preview, multiple themes, and one-click export.
        </p>
      </div>

      {/* Toolbar */}
      <div className="relative z-50 glass-panel rounded-2xl p-3 border border-[var(--border)] flex flex-wrap items-center gap-3">
        <ThemeDropdown value={h.theme} onChange={h.setTheme} themes={h.themes} />
        <LayoutDropdown value={h.template} onChange={h.setTemplate} templates={h.templates} />
        <div className="h-5 w-px bg-[var(--border)]" />
        <div className="flex items-center gap-1 bg-[var(--bg-secondary)] rounded-lg p-0.5 border border-[var(--border)]">
          <button onClick={() => setPreviewSize('desktop')}
            className={`p-1.5 rounded-md transition-all ${previewSize === 'desktop' ? 'bg-[var(--accent)]/20 text-[var(--accent)]' : 'text-[var(--text-secondary)]'}`}>
            <Monitor className="w-3.5 h-3.5" />
          </button>
          <button onClick={() => setPreviewSize('mobile')}
            className={`p-1.5 rounded-md transition-all ${previewSize === 'mobile' ? 'bg-[var(--accent)]/20 text-[var(--accent)]' : 'text-[var(--text-secondary)]'}`}>
            <Smartphone className="w-3.5 h-3.5" />
          </button>
        </div>
        <div className="h-5 w-px bg-[var(--border)]" />
        <button onClick={h.downloadHTML}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold text-[var(--accent)] border border-[var(--accent)]/30 hover:bg-[var(--accent)]/5 transition-all">
          <Download className="w-3.5 h-3.5" /> HTML
        </button>
        <button onClick={h.downloadZIP}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold text-emerald-400 border border-emerald-500/30 hover:bg-emerald-500/5 transition-all">
          <FileArchive className="w-3.5 h-3.5" /> ZIP
        </button>
        <button onClick={() => copy(h.getHTML())}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold text-[var(--text-secondary)] border border-[var(--border)] hover:bg-[var(--bg-secondary)] transition-all">
          {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
          {copied ? 'Copied!' : 'Copy HTML'}
        </button>
        <div className="flex-1" />
        <button onClick={h.resetData}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold text-red-400 border border-red-500/30 hover:bg-red-500/5 transition-all">
          <RotateCcw className="w-3.5 h-3.5" /> Reset
        </button>
      </div>

      {/* Main Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4" style={{ height: 'calc(100vh - 280px)', minHeight: '500px' }}>

        {/* Left: Section Nav */}
        <div className="lg:col-span-2 space-y-1 overflow-y-auto">
          {h.sections.map(s => {
            const Icon = iconMap[s.icon] || Globe;
            return (
              <button key={s.id} onClick={() => h.setActiveSection(s.id)}
                className={`w-full flex items-center gap-2 px-3 py-2.5 rounded-xl text-xs font-bold transition-all text-left
                  ${h.activeSection === s.id
                    ? 'bg-[var(--accent)]/15 text-[var(--accent)] border border-[var(--accent)]/30'
                    : 'text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-secondary)] border border-transparent'
                  }`}>
                <Icon className="w-4 h-4 shrink-0" />
                {s.label}
              </button>
            );
          })}
        </div>

        {/* Center: Editor */}
        <div className="lg:col-span-4 overflow-y-auto">
          <div className="glass-panel rounded-2xl p-4 border border-[var(--border)] space-y-3">
            <h3 className="text-xs font-black uppercase tracking-wider text-[var(--text-secondary)]">
              {h.sections.find(s => s.id === h.activeSection)?.label}
            </h3>
            <AnimatePresence mode="wait">
              <motion.div key={h.activeSection} {...fadeUp}>
                {renderSection()}
              </motion.div>
            </AnimatePresence>
          </div>
        </div>

        {/* Right: Live Preview */}
        <div className="lg:col-span-6 overflow-hidden rounded-2xl border border-[var(--border)] bg-[var(--bg-secondary)]">
          <div className="px-3 py-2 bg-[var(--bg-primary)] border-b border-[var(--border)] flex items-center gap-2">
            <div className="flex gap-1.5">
              <div className="w-2.5 h-2.5 rounded-full bg-red-500/60" />
              <div className="w-2.5 h-2.5 rounded-full bg-amber-500/60" />
              <div className="w-2.5 h-2.5 rounded-full bg-emerald-500/60" />
            </div>
            <span className="text-[10px] font-bold text-[var(--text-secondary)] ml-2">
              {h.data.personal.name.replace(/\s+/g, '_').toLowerCase() || 'portfolio'}.html
            </span>
          </div>
          <div className={`h-[calc(100%-36px)] overflow-auto transition-all duration-300 mx-auto ${
            previewSize === 'mobile' ? 'max-w-[375px]' : 'w-full'
          }`}>
            <iframe
              srcDoc={h.getHTML()}
              title="Portfolio Preview"
              className="w-full h-full border-0"
              sandbox="allow-same-origin"
            />
          </div>
        </div>
      </div>
    </div>
  );
}
