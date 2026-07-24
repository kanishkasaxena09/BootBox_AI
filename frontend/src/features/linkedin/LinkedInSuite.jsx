import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Link2, Sparkles, FileText, Layers, Award, Image, BarChart3,
  MessageSquare, Hash, ClipboardCheck, Search, Copy, Check,
  ChevronDown, ChevronRight, Star, TrendingUp, Lightbulb,
  History, Trash2, RotateCcw, ExternalLink, CheckCircle2, Circle,
  Loader2,
} from 'lucide-react';
import useLinkedIn from './useLinkedIn';

const fadeUp = { initial: { opacity: 0, y: 12 }, animate: { opacity: 1, y: 0 }, transition: { duration: 0.25 } };

const SelectField = ({ label, value, onChange, options, placeholder }) => (
  <div className="space-y-1.5">
    <label className="text-xs font-bold uppercase tracking-wider text-[var(--text-secondary)]">{label}</label>
    <select value={value} onChange={e => onChange(e.target.value)}
      className="w-full px-3 py-2.5 rounded-xl text-sm font-medium appearance-none cursor-pointer outline-none
                 bg-[var(--bg-secondary)] border border-[var(--border)] text-[var(--text-primary)]
                 hover:border-[var(--accent)] focus:border-[var(--accent)] focus:ring-2 focus:ring-[var(--accent)]/20">
      <option value="">{placeholder}</option>
      {options.map(o => <option key={typeof o === 'string' ? o : o.id || o} value={typeof o === 'string' ? o : o.id || o}>{typeof o === 'string' ? o : o.label || o}</option>)}
    </select>
  </div>
);

const InputField = ({ label, value, onChange, placeholder, multiline }) => (
  <div className="space-y-1.5">
    <label className="text-xs font-bold uppercase tracking-wider text-[var(--text-secondary)]">{label}</label>
    {multiline ? (
      <textarea value={value} onChange={e => onChange(e.target.value)} placeholder={placeholder} rows={4}
        className="w-full px-3 py-2.5 rounded-xl text-sm font-medium resize-none outline-none
                   bg-[var(--bg-secondary)] border border-[var(--border)] text-[var(--text-primary)]
                   hover:border-[var(--accent)] focus:border-[var(--accent)] focus:ring-2 focus:ring-[var(--accent)]/20" />
    ) : (
      <input value={value} onChange={e => onChange(e.target.value)} placeholder={placeholder}
        className="w-full px-3 py-2.5 rounded-xl text-sm font-medium outline-none
                   bg-[var(--bg-secondary)] border border-[var(--border)] text-[var(--text-primary)]
                   hover:border-[var(--accent)] focus:border-[var(--accent)] focus:ring-2 focus:ring-[var(--accent)]/20" />
    )}
  </div>
);

const OutputBox = ({ text, label, onCopy, copied }) => (
  <div className="relative">
    {label && <p className="text-xs font-bold uppercase tracking-wider text-[var(--text-secondary)] mb-2">{label}</p>}
    <div className="p-4 rounded-xl bg-[var(--bg-secondary)] border border-[var(--border)] text-sm text-[var(--text-primary)] whitespace-pre-wrap leading-relaxed min-h-[120px]">
      {text || 'Generate content to see it here...'}
    </div>
    {text && (
      <button onClick={onCopy}
        className="absolute top-8 right-3 p-1.5 rounded-lg bg-[var(--bg-primary)] border border-[var(--border)] text-[var(--text-secondary)] hover:text-[var(--accent)] transition-all">
        {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
      </button>
    )}
  </div>
);

const ChipTag = ({ label, active, onClick, color = 'pink' }) => (
  <button onClick={onClick}
    className={`px-3 py-1.5 rounded-full text-xs font-semibold transition-all border
      ${active
        ? 'bg-[var(--accent)]/20 border-[var(--accent)] text-[var(--accent)]'
        : 'bg-[var(--bg-secondary)] border-[var(--border)] text-[var(--text-secondary)] hover:border-[var(--accent)]/50'
      }`}>
    {label}
  </button>
);

const Section = ({ children }) => (
  <motion.div {...fadeUp} className="glass-panel rounded-2xl p-5 border border-[var(--border)] space-y-4">
    {children}
  </motion.div>
);

const TabButton = ({ id, label, icon: Icon, activeTab, onSelect }) => (
  <button onClick={() => onSelect(id)}
    className={`flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-bold transition-all whitespace-nowrap
      ${activeTab === id
        ? 'bg-[var(--accent)]/15 text-[var(--accent)] border border-[var(--accent)]/30'
        : 'text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-secondary)] border border-transparent'
      }`}>
    <Icon className="w-3.5 h-3.5" />
    {label}
  </button>
);

const ProgressRing = ({ score, size = 100 }) => {
  const r = (size - 12) / 2;
  const circ = 2 * Math.PI * r;
  const offset = circ - (score / 100) * circ;
  const color = score >= 80 ? '#10b981' : score >= 60 ? '#f59e0b' : score >= 40 ? '#f97316' : '#ef4444';
  return (
    <div className="relative" style={{ width: size, height: size }}>
      <svg className="w-full h-full -rotate-90" viewBox={`0 0 ${size} ${size}`}>
        <circle cx={size/2} cy={size/2} r={r} fill="none" stroke="var(--bg-secondary)" strokeWidth="8" />
        <motion.circle cx={size/2} cy={size/2} r={r} fill="none" stroke={color} strokeWidth="8" strokeLinecap="round"
          strokeDasharray={circ} initial={{ strokeDashoffset: circ }} animate={{ strokeDashoffset: offset }}
          transition={{ duration: 1.2, ease: 'easeOut' }} />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span className="text-2xl font-black text-[var(--text-primary)]">{score}</span>
        <span className="text-[10px] font-bold text-[var(--text-secondary)]">/100</span>
      </div>
    </div>
  );
};

export default function LinkedInSuite() {
  const hook = useLinkedIn();
  const [copied, setCopied] = useState(false);
  const [copiedItem, setCopiedItem] = useState(null);

  const copy = (text, id) => {
    hook.copyToClipboard(text);
    setCopied(true);
    setCopiedItem(id || 'main');
    setTimeout(() => { setCopied(false); setCopiedItem(null); }, 1500);
  };

  const renderHeadline = () => (
    <Section>
      <h3 className="text-sm font-black uppercase tracking-wider text-[var(--text-secondary)] flex items-center gap-2">
        <Sparkles className="w-4 h-4 text-[var(--accent)]" /> Headline Generator
      </h3>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-3">
          <SelectField label="Role" value={hook.role} onChange={hook.setRole} options={hook.roles} placeholder="Select role" />
          <InputField label="Company" value={hook.company} onChange={hook.setCompany} placeholder="e.g. Google" />
          <InputField label="Key Tech" value={hook.tech} onChange={hook.setTech} placeholder="e.g. React, Node.js, AWS" />
          <button onClick={hook.handleGenerateHeadline} disabled={!hook.role || hook.generating}
            className={`w-full py-2.5 rounded-xl text-sm font-black uppercase tracking-wider transition-all flex items-center justify-center gap-2
              ${hook.role && !hook.generating ? 'bg-gradient-to-r from-blue-500 to-cyan-500 text-white shadow-lg hover:shadow-blue-500/30' : 'bg-[var(--bg-secondary)] text-[var(--text-secondary)] cursor-not-allowed border border-[var(--border)]'}`}>
            {hook.generating ? <><Loader2 className="w-4 h-4 animate-spin" /> Generating...</> : 'Generate Headline'}
          </button>
        </div>
        <div>
          <OutputBox text={hook.headline} label="Generated Headline" onCopy={() => copy(hook.headline, 'headline')} copied={copiedItem === 'headline'} />
        </div>
      </div>
    </Section>
  );

  const renderAbout = () => (
    <Section>
      <h3 className="text-sm font-black uppercase tracking-wider text-[var(--text-secondary)] flex items-center gap-2">
        <FileText className="w-4 h-4 text-[var(--accent)]" /> About Generator
      </h3>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-3">
          <SelectField label="Role" value={hook.role} onChange={hook.setRole} options={hook.roles} placeholder="Select role" />
          <InputField label="Years of Experience" value={hook.experience} onChange={hook.setExperience} placeholder="e.g. 3+" />
          <InputField label="Company" value={hook.company} onChange={hook.setCompany} placeholder="e.g. Meta" />
          <InputField label="Key Technologies" value={hook.tech} onChange={hook.setTech} placeholder="e.g. Python, TensorFlow" />
          <button onClick={hook.handleGenerateAbout} disabled={!hook.role || hook.generating}
            className={`w-full py-2.5 rounded-xl text-sm font-black uppercase tracking-wider transition-all flex items-center justify-center gap-2
              ${hook.role && !hook.generating ? 'bg-gradient-to-r from-blue-500 to-cyan-500 text-white shadow-lg hover:shadow-blue-500/30' : 'bg-[var(--bg-secondary)] text-[var(--text-secondary)] cursor-not-allowed border border-[var(--border)]'}`}>
            {hook.generating ? <><Loader2 className="w-4 h-4 animate-spin" /> Generating...</> : 'Generate About'}
          </button>
        </div>
        <div>
          <OutputBox text={hook.about} label="Generated About Section" onCopy={() => copy(hook.about, 'about')} copied={copiedItem === 'about'} />
        </div>
      </div>
    </Section>
  );

  const renderExperience = () => (
    <Section>
      <h3 className="text-sm font-black uppercase tracking-wider text-[var(--text-secondary)] flex items-center gap-2">
        <Layers className="w-4 h-4 text-[var(--accent)]" /> Experience Optimizer
      </h3>
      <div className="space-y-4">
        <div className="flex flex-wrap gap-2">
          <SelectField label="Category" value={hook.skillCategory} onChange={hook.setSkillCategory}
            options={[{ id: 'technical', label: 'Action Verbs' }, { id: 'tools', label: 'Impact Phrases' }, { id: 'cloud', label: 'Metrics' }]}
            placeholder="Select category" />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {hook.experienceSuggestions.map(group => (
            <div key={group.label} className="p-3 rounded-xl bg-[var(--bg-secondary)] border border-[var(--border)]">
              <p className="text-xs font-bold text-[var(--text-secondary)] mb-2">{group.label}</p>
              <div className="flex flex-wrap gap-1.5">
                {group.items.map(item => (
                  <button key={item} onClick={() => copy(item, 'exp-' + item)}
                    className="px-2.5 py-1 rounded-lg text-xs font-medium bg-[var(--bg-primary)] border border-[var(--border)] text-[var(--text-primary)] hover:border-[var(--accent)]/50 transition-all cursor-pointer flex items-center gap-1">
                    {copiedItem === 'exp-' + item ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3 text-[var(--text-secondary)]" />}
                    {item}
                  </button>
                ))}
              </div>
            </div>
          ))}
        </div>
        <div className="p-4 rounded-xl bg-gradient-to-r from-blue-500/10 to-cyan-500/10 border border-blue-500/20">
          <p className="text-xs font-bold text-blue-400 flex items-center gap-2 mb-2">
            <Lightbulb className="w-3.5 h-3.5" /> Pro Tips
          </p>
          <ul className="space-y-1 text-xs text-[var(--text-secondary)]">
            <li>• Start each bullet with a strong action verb</li>
            <li>• Quantify results with numbers, percentages, or dollar amounts</li>
            <li>• Focus on impact, not just responsibilities</li>
            <li>• Keep bullet points under 2 lines each</li>
          </ul>
        </div>
      </div>
    </Section>
  );

  const renderSkills = () => {
    const db = hook.skillsDatabase;
    const categories = Object.keys(db);
    return (
      <Section>
        <h3 className="text-sm font-black uppercase tracking-wider text-[var(--text-secondary)] flex items-center gap-2">
          <Award className="w-4 h-4 text-[var(--accent)]" /> Skills Suggestions
        </h3>
        <div className="flex gap-2 mb-2">
          {categories.map(cat => (
            <ChipTag key={cat} label={cat.charAt(0).toUpperCase() + cat.slice(1)}
              active={hook.skillCategory === cat} onClick={() => hook.setSkillCategory(cat)} />
          ))}
        </div>
        <div className="flex flex-wrap gap-2">
          {(db[hook.skillCategory] || []).map(skill => {
            const active = hook.selectedSkills.includes(skill);
            return (
              <button key={skill} onClick={() => {
                hook.setSelectedSkills(prev => active ? prev.filter(s => s !== skill) : [...prev, skill]);
              }}
                className={`px-3 py-1.5 rounded-full text-xs font-semibold transition-all border flex items-center gap-1.5
                  ${active ? 'bg-[var(--accent)]/20 border-[var(--accent)] text-[var(--accent)]' : 'bg-[var(--bg-secondary)] border-[var(--border)] text-[var(--text-secondary)] hover:border-[var(--accent)]/50'}`}>
                {active && <Check className="w-3 h-3" />}
                {skill}
              </button>
            );
          })}
        </div>
        {hook.selectedSkills.length > 0 && (
          <div className="p-3 rounded-xl bg-[var(--bg-secondary)] border border-[var(--border)]">
            <div className="flex items-center justify-between mb-2">
              <p className="text-xs font-bold text-[var(--text-secondary)]">Selected ({hook.selectedSkills.length})</p>
              <button onClick={() => copy(hook.selectedSkills.join(', '), 'skills')} className="text-xs font-bold text-[var(--accent)] hover:underline">
                {copiedItem === 'skills' ? 'Copied!' : 'Copy All'}
              </button>
            </div>
            <p className="text-sm text-[var(--text-primary)]">{hook.selectedSkills.join(', ')}</p>
          </div>
        )}
      </Section>
    );
  };

  const renderBanner = () => (
    <Section>
      <h3 className="text-sm font-black uppercase tracking-wider text-[var(--text-secondary)] flex items-center gap-2">
        <Image className="w-4 h-4 text-[var(--accent)]" /> Banner Suggestions
      </h3>
      <p className="text-xs text-[var(--text-secondary)]">Recommended banner size: 1584 x 396 pixels</p>
      <div className="space-y-5">
        {hook.bannerSuggestions.map(cat => (
          <div key={cat.category}>
            <p className="text-xs font-bold text-[var(--text-secondary)] mb-2">{cat.category}</p>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
              {cat.banners.map((banner, i) => (
                <button key={i} onClick={() => { hook.setSelectedBanner(banner); copy(banner.desc, 'banner-' + i); }}
                  className={`rounded-xl overflow-hidden border-2 transition-all text-left group
                    ${hook.selectedBanner === banner ? 'border-[var(--accent)] shadow-lg shadow-[var(--accent)]/20' : 'border-[var(--border)] hover:border-[var(--accent)]/50'}`}>
                  <div className="h-12 w-full flex">
                    {banner.colors.map((c, ci) => (
                      <div key={ci} className="flex-1" style={{ background: c }} />
                    ))}
                  </div>
                  <div className="p-3 bg-[var(--bg-secondary)]">
                    <p className="text-xs font-bold text-[var(--text-primary)]">{banner.title}</p>
                    <p className="text-[10px] text-[var(--text-secondary)] mt-0.5">{banner.desc}</p>
                  </div>
                </button>
              ))}
            </div>
          </div>
        ))}
      </div>
    </Section>
  );

  const renderProfileScore = () => (
    <Section>
      <h3 className="text-sm font-black uppercase tracking-wider text-[var(--text-secondary)] flex items-center gap-2">
        <BarChart3 className="w-4 h-4 text-[var(--accent)]" /> Profile Score
      </h3>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-start">
        <div className="flex flex-col items-center gap-3 md:col-span-1">
          <ProgressRing score={hook.profileScore.score} size={120} />
          <span className={`text-4xl font-black ${hook.profileScore.score >= 80 ? 'text-emerald-400' : hook.profileScore.score >= 60 ? 'text-amber-400' : 'text-red-400'}`}>
            {hook.profileScore.grade}
          </span>
        </div>
        <div className="md:col-span-2 space-y-2">
          {hook.profileScoreCriteria.map(c => {
            const checked = !!hook.profileAnswers[c.id];
            return (
              <button key={c.id} onClick={() => hook.toggleProfileAnswer(c.id)}
                className="w-full flex items-center gap-3 p-3 rounded-xl bg-[var(--bg-secondary)] border border-[var(--border)] hover:border-[var(--accent)]/30 transition-all text-left group">
                {checked ? <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" /> : <Circle className="w-5 h-5 text-[var(--text-secondary)] shrink-0" />}
                <div className="flex-1 min-w-0">
                  <p className={`text-sm font-bold ${checked ? 'text-emerald-400' : 'text-[var(--text-primary)]'}`}>{c.label}</p>
                  <p className="text-[10px] text-[var(--text-secondary)]">{c.desc}</p>
                </div>
                <span className="text-xs font-bold text-[var(--text-secondary)] shrink-0">+{c.weight}</span>
              </button>
            );
          })}
        </div>
      </div>
    </Section>
  );

  const renderPost = () => (
    <Section>
      <h3 className="text-sm font-black uppercase tracking-wider text-[var(--text-secondary)] flex items-center gap-2">
        <MessageSquare className="w-4 h-4 text-[var(--accent)]" /> Post Generator
      </h3>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-3">
          <SelectField label="Post Type" value={hook.postType} onChange={hook.setPostType}
            options={hook.postTemplates.map(t => t.type)} placeholder="Select post type" />
          <SelectField label="Role" value={hook.role} onChange={hook.setRole} options={hook.roles} placeholder="Select your role" />
          <button onClick={hook.handleGeneratePost} disabled={!hook.postType}
            className={`w-full py-2.5 rounded-xl text-sm font-black uppercase tracking-wider transition-all
              ${hook.postType ? 'bg-gradient-to-r from-blue-500 to-cyan-500 text-white shadow-lg hover:shadow-blue-500/30' : 'bg-[var(--bg-secondary)] text-[var(--text-secondary)] cursor-not-allowed border border-[var(--border)]'}`}>
            Generate Post
          </button>
          <div className="p-3 rounded-xl bg-[var(--bg-secondary)] border border-[var(--border)]">
            <p className="text-xs font-bold text-[var(--text-secondary)] mb-2">Post Types</p>
            <div className="space-y-1.5">
              {hook.postTemplates.map(t => (
                <button key={t.type} onClick={() => hook.setPostType(t.type)}
                  className={`w-full text-left px-3 py-2 rounded-lg text-xs font-medium transition-all
                    ${hook.postType === t.type ? 'bg-[var(--accent)]/10 text-[var(--accent)] border border-[var(--accent)]/30' : 'text-[var(--text-secondary)] hover:text-[var(--text-primary)] border border-transparent'}`}>
                  {t.type}
                </button>
              ))}
            </div>
          </div>
        </div>
        <div>
          <OutputBox text={hook.postContent} label="Generated Post" onCopy={() => copy(hook.postContent, 'post')} copied={copiedItem === 'post'} />
        </div>
      </div>
    </Section>
  );

  const renderHashtags = () => (
    <Section>
      <h3 className="text-sm font-black uppercase tracking-wider text-[var(--text-secondary)] flex items-center gap-2">
        <Hash className="w-4 h-4 text-[var(--accent)]" /> Hashtag Generator
      </h3>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-3">
          <SelectField label="Role" value={hook.role} onChange={hook.setRole} options={hook.roles} placeholder="Select role" />
          <InputField label="Number of Hashtags" value={String(hook.hashtagCount)} onChange={v => hook.setHashtagCount(Number(v) || 10)} placeholder="10" />
          <InputField label="Custom Hashtags (comma-separated)" value={hook.customHashtags} onChange={hook.setCustomHashtags} placeholder="e.g. coding, startups" />
          <button onClick={hook.handleGenerateHashtags} disabled={!hook.role}
            className={`w-full py-2.5 rounded-xl text-sm font-black uppercase tracking-wider transition-all
              ${hook.role ? 'bg-gradient-to-r from-blue-500 to-cyan-500 text-white shadow-lg hover:shadow-blue-500/30' : 'bg-[var(--bg-secondary)] text-[var(--text-secondary)] cursor-not-allowed border border-[var(--border)]'}`}>
            Generate Hashtags
          </button>
        </div>
        <div>
          {hook.generatedHashtags.length > 0 ? (
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <p className="text-xs font-bold text-[var(--text-secondary)]">Generated ({hook.generatedHashtags.length})</p>
                <button onClick={() => copy(hook.generatedHashtags.map(h => '#' + h.replace('#', '')).join(' '), 'hashtags')}
                  className="text-xs font-bold text-[var(--accent)] hover:underline">
                  {copiedItem === 'hashtags' ? 'Copied!' : 'Copy All'}
                </button>
              </div>
              <div className="flex flex-wrap gap-2">
                {hook.generatedHashtags.map(h => {
                  const tag = h.startsWith('#') ? h : '#' + h;
                  return (
                    <button key={tag} onClick={() => copy(tag, 'hash-' + tag)}
                      className="px-3 py-1.5 rounded-full text-xs font-semibold bg-[var(--bg-secondary)] border border-[var(--border)] text-[var(--text-secondary)] hover:border-[var(--accent)]/50 transition-all flex items-center gap-1">
                      {copiedItem === 'hash-' + tag ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                      {tag}
                    </button>
                  );
                })}
              </div>
            </div>
          ) : (
            <div className="p-8 rounded-xl bg-[var(--bg-secondary)] border border-[var(--border)] text-center">
              <Hash className="w-8 h-8 text-[var(--text-secondary)] mx-auto mb-2 opacity-50" />
              <p className="text-sm font-bold text-[var(--text-secondary)]">Select a role and generate hashtags</p>
            </div>
          )}
        </div>
      </div>
    </Section>
  );

  const renderChecklist = () => {
    const total = hook.checklistItems.reduce((sum, cat) => sum + cat.items.length, 0);
    const done = Object.values(hook.checklistState).filter(Boolean).length;
    const pct = total > 0 ? Math.round((done / total) * 100) : 0;
    return (
      <Section>
        <h3 className="text-sm font-black uppercase tracking-wider text-[var(--text-secondary)] flex items-center gap-2">
          <ClipboardCheck className="w-4 h-4 text-[var(--accent)]" /> Profile Checklist
        </h3>
        <div className="flex items-center gap-4">
          <div className="flex-1 h-2 rounded-full bg-[var(--bg-secondary)] overflow-hidden">
            <motion.div className="h-full rounded-full bg-gradient-to-r from-emerald-500 to-teal-500"
              initial={{ width: 0 }} animate={{ width: `${pct}%` }} transition={{ duration: 0.5 }} />
          </div>
          <span className="text-sm font-black text-[var(--text-primary)]">{done}/{total} ({pct}%)</span>
        </div>
        <div className="space-y-5">
          {hook.checklistItems.map(cat => (
            <div key={cat.category}>
              <p className="text-xs font-bold text-[var(--text-secondary)] mb-2">{cat.category}</p>
              <div className="space-y-1.5">
                {cat.items.map(item => {
                  const checked = !!hook.checklistState[item.id];
                  return (
                    <button key={item.id} onClick={() => hook.toggleChecklistItem(item.id)}
                      className={`w-full flex items-center gap-3 p-3 rounded-xl border transition-all text-left group
                        ${checked ? 'bg-emerald-500/5 border-emerald-500/30' : 'bg-[var(--bg-secondary)] border-[var(--border)] hover:border-[var(--accent)]/30'}`}>
                      {checked ? <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" /> : <Circle className="w-5 h-5 text-[var(--text-secondary)] shrink-0" />}
                      <div className="flex-1 min-w-0">
                        <p className={`text-sm font-bold ${checked ? 'text-emerald-400 line-through' : 'text-[var(--text-primary)]'}`}>{item.text}</p>
                        <p className="text-[10px] text-[var(--text-secondary)]">{item.tip}</p>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
      </Section>
    );
  };

  const renderKeywords = () => (
    <Section>
      <h3 className="text-sm font-black uppercase tracking-wider text-[var(--text-secondary)] flex items-center gap-2">
        <Search className="w-4 h-4 text-[var(--accent)]" /> Keyword Optimization
      </h3>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-3">
          <SelectField label="Role" value={hook.role} onChange={hook.setRole} options={hook.roles} placeholder="Select role" />
          <InputField label="Current Keywords (comma-separated)" value={hook.keywordInput} onChange={hook.setKeywordInput}
            placeholder="e.g. javascript, python, agile" multiline />
          <button onClick={hook.handleGenerateKeywords} disabled={!hook.role}
            className={`w-full py-2.5 rounded-xl text-sm font-black uppercase tracking-wider transition-all
              ${hook.role ? 'bg-gradient-to-r from-blue-500 to-cyan-500 text-white shadow-lg hover:shadow-blue-500/30' : 'bg-[var(--bg-secondary)] text-[var(--text-secondary)] cursor-not-allowed border border-[var(--border)]'}`}>
            Optimize Keywords
          </button>
        </div>
        <div className="space-y-3">
          {hook.optimizedKeywords.matched?.length > 0 && (
            <div className="p-3 rounded-xl bg-emerald-500/5 border border-emerald-500/20">
              <p className="text-xs font-bold text-emerald-400 mb-2 flex items-center gap-1.5">
                <CheckCircle2 className="w-3.5 h-3.5" /> Matched ({hook.optimizedKeywords.matched.length})
              </p>
              <div className="flex flex-wrap gap-1.5">
                {hook.optimizedKeywords.matched.map(kw => (
                  <span key={kw} className="px-2.5 py-1 rounded-lg text-xs font-medium bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">{kw}</span>
                ))}
              </div>
            </div>
          )}
          {hook.optimizedKeywords.suggested?.length > 0 && (
            <div className="p-3 rounded-xl bg-amber-500/5 border border-amber-500/20">
              <p className="text-xs font-bold text-amber-400 mb-2 flex items-center gap-1.5">
                <Lightbulb className="w-3.5 h-3.5" /> Suggested to Add ({hook.optimizedKeywords.suggested.length})
              </p>
              <div className="flex flex-wrap gap-1.5">
                {hook.optimizedKeywords.suggested.map(kw => (
                  <button key={kw} onClick={() => {
                    hook.setKeywordInput(prev => prev ? prev + ', ' + kw : kw);
                  }}
                    className="px-2.5 py-1 rounded-lg text-xs font-medium bg-amber-500/10 text-amber-400 border border-amber-500/20 hover:bg-amber-500/20 transition-all flex items-center gap-1">
                    <span>+</span>{kw}
                  </button>
                ))}
              </div>
            </div>
          )}
          {hook.optimizedKeywords.missing?.length > 0 && (
            <div className="p-3 rounded-xl bg-[var(--bg-secondary)] border border-[var(--border)]">
              <p className="text-xs font-bold text-[var(--text-secondary)] mb-2 flex items-center gap-1.5">
                <Search className="w-3.5 h-3.5" /> All Available Keywords
              </p>
              <div className="flex flex-wrap gap-1.5 max-h-[150px] overflow-y-auto">
                {hook.optimizedKeywords.missing.slice(0, 15).map(kw => (
                  <span key={kw} className="px-2.5 py-1 rounded-lg text-xs font-medium bg-[var(--bg-primary)] text-[var(--text-secondary)] border border-[var(--border)]">{kw}</span>
                ))}
              </div>
            </div>
          )}
          {!hook.optimizedKeywords.matched && (
            <div className="p-8 rounded-xl bg-[var(--bg-secondary)] border border-[var(--border)] text-center">
              <Search className="w-8 h-8 text-[var(--text-secondary)] mx-auto mb-2 opacity-50" />
              <p className="text-sm font-bold text-[var(--text-secondary)]">Enter your current keywords and optimize</p>
            </div>
          )}
        </div>
      </div>
    </Section>
  );

  const renderTab = () => {
    switch (hook.activeTab) {
      case 'headline': return renderHeadline();
      case 'about': return renderAbout();
      case 'experience': return renderExperience();
      case 'skills': return renderSkills();
      case 'banner': return renderBanner();
      case 'score': return renderProfileScore();
      case 'post': return renderPost();
      case 'hashtag': return renderHashtags();
      case 'checklist': return renderChecklist();
      case 'keywords': return renderKeywords();
      default: return renderHeadline();
    }
  };

  return (
    <div className="space-y-6">
      <div className="text-center space-y-2">
        <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-gradient-to-br from-blue-500/20 to-cyan-500/20 border border-blue-500/30">
          <Link2 className="w-7 h-7 text-blue-400" />
        </div>
        <h1 className="text-3xl font-black bg-gradient-to-r from-blue-400 via-blue-500 to-cyan-400 bg-clip-text text-transparent">
          LinkedIn Suite
        </h1>
        <p className="text-sm text-[var(--text-secondary)] max-w-lg mx-auto">
          Optimize your LinkedIn profile with headline generator, about section, skills, post generator, and more.
        </p>
      </div>

      {/* Tab Navigation */}
      <div className="overflow-x-auto pb-2 -mx-4 px-4 md:mx-0 md:px-0">
        <div className="flex gap-1.5 min-w-max">
          {hook.tabs.map(tab => {
            const icons = { headline: Sparkles, about: FileText, experience: Layers, skills: Award, banner: Image, score: BarChart3, post: MessageSquare, hashtag: Hash, checklist: ClipboardCheck, keywords: Search };
            return <TabButton key={tab.id} id={tab.id} label={tab.label} icon={icons[tab.id]} activeTab={hook.activeTab} onSelect={hook.setActiveTab} />;
          })}
        </div>
      </div>

      <AnimatePresence mode="wait">
        <motion.div key={hook.activeTab} {...fadeUp}>
          {renderTab()}
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
