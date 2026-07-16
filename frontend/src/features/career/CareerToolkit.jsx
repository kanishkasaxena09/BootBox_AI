import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { User, Briefcase, GraduationCap, Award, AwardIcon, Sparkles, CheckCircle, BarChart, FileText, Download, Plus, Trash, X, AlertCircle } from 'lucide-react';
import Dropzone from '../../components/Dropzone';
import Loader from '../../components/Loader';

const CareerToolkit = () => {
  const [activeSubTab, setActiveSubTab] = useState('builder'); // 'builder' or 'ats'
  const [loading, setLoading] = useState(false);
  const [loadingMessage, setLoadingMessage] = useState('');

  // --- RESUME BUILDER STATE ---
  const [resume, setResume] = useState({
    personal: { name: '', email: '', phone: '', address: '', linkedin: '', portfolio: '' },
    summary: '',
    education: [{ degree: '', university: '', year: '', cgpa: '' }],
    experience: [{ companyName: '', jobTitle: '', duration: '', responsibilities: '' }],
    projects: [{ name: '', description: '', technologiesUsed: '' }],
    skills: { technical: '', soft: '' },
    certifications: '',
    achievements: ''
  });

  const [aiSuggestions, setAiSuggestions] = useState(null);
  const [pendingAiChanges, setPendingAiChanges] = useState(null);

  const handlePersonalChange = (field, val) => {
    setResume(prev => ({
      ...prev,
      personal: { ...prev.personal, [field]: val }
    }));
  };

  const handleSkillChange = (field, val) => {
    setResume(prev => ({
      ...prev,
      skills: { ...prev.skills, [field]: val }
    }));
  };

  // Generic list change handler
  const handleListChange = (section, idx, field, val) => {
    setResume(prev => {
      const copy = [...prev[section]];
      copy[idx] = { ...copy[idx], [field]: val };
      return { ...prev, [section]: copy };
    });
  };

  const addListItem = (section, defaultObj) => {
    setResume(prev => ({
      ...prev,
      [section]: [...prev[section], defaultObj]
    }));
  };

  const removeListItem = (section, idx) => {
    setResume(prev => {
      const copy = [...prev[section]];
      copy.splice(idx, 1);
      return { ...prev, [section]: copy };
    });
  };

  const enhanceWithAI = async () => {
    setLoading(true);
    setLoadingMessage('Groq AI is optimizing your resume content...');
    try {
      const response = await fetch('/api/career/resume/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(resume)
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || 'Failed to enhance resume.');

      setPendingAiChanges({
        summary: data.summary,
        experience: data.experience,
        projects: data.projects,
        suggestedSkills: data.suggestedSkills,
        suggestedKeywords: data.suggestedKeywords
      });
    } catch (e) {
      alert(e.message || 'Error occurred while calling AI service.');
    } finally {
      setLoading(false);
    }
  };

  const applyAiChanges = () => {
    if (!pendingAiChanges) return;
    setResume(prev => ({
      ...prev,
      summary: pendingAiChanges.summary,
      experience: pendingAiChanges.experience,
      projects: pendingAiChanges.projects
    }));
    setAiSuggestions({
      skills: pendingAiChanges.suggestedSkills,
      keywords: pendingAiChanges.suggestedKeywords
    });
    setPendingAiChanges(null);
  };

  const discardAiChanges = () => {
    setPendingAiChanges(null);
  };

  const printResume = () => {
    window.print();
  };

  const downloadResumePdf = async () => {
    setLoading(true);
    setLoadingMessage('Generating downloadable PDF...');
    try {
      const response = await fetch('/api/career/resume/pdf', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(resume)
      });

      if (response.ok) {
        const blob = await response.blob();
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        const namePart = (resume.personal && resume.personal.name) || 'resume';
        const filename = `${namePart.replace(/\s+/g, '_')}-resume.pdf`;
        a.download = filename;
        document.body.appendChild(a);
        a.click();
        setTimeout(() => {
          document.body.removeChild(a);
          window.URL.revokeObjectURL(url);
        }, 5000);
      } else {
        const errData = await response.json().catch(() => ({}));
        throw new Error(errData.error || 'Backend PDF generation failed');
      }
    } catch (e) {
      alert('PDF download failed: ' + (e.message || e) + '. Falling back to client-side generation.');
      await generateClientPdfFallback();
    } finally {
      setLoading(false);
    }
  };

  const generateClientPdfFallback = async () => {
    try {
      setLoadingMessage('Generating PDF locally...');
      const el = document.getElementById('resume-printable-area');
      if (!el) throw new Error('Printable area not found');

      const html2canvasModule = await import('html2canvas');
      const html2canvas = html2canvasModule.default || html2canvasModule;
      const jspdfModule = await import('jspdf');
      const jsPDF = jspdfModule.jsPDF || (jspdfModule.default && jspdfModule.default.jsPDF) || jspdfModule.default || jspdfModule;

      const canvas = await html2canvas(el, { scale: 2, useCORS: true });
      const imgData = canvas.toDataURL('image/jpeg', 0.95);
      const pdf = new jsPDF('p', 'pt', 'a4');
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = (canvas.height * pdfWidth) / canvas.width;
      pdf.addImage(imgData, 'JPEG', 0, 0, pdfWidth, pdfHeight);
      const namePart = (resume.personal && resume.personal.name) || 'resume';
      const filename = `${namePart.replace(/\s+/g, '_')}-resume.pdf`;
      pdf.save(filename);
    } catch (err) {
      console.error('Client PDF fallback error:', err);
      alert('Failed to generate PDF: ' + (err.message || err));
    }
  };



  // --- ATS CHECKER STATE ---
  const [atsFile, setAtsFile] = useState(null);
  const [jobDescription, setJobDescription] = useState('');
  const [atsResult, setAtsResult] = useState(null);

  const runAtsChecker = async () => {
    if (!atsFile) return;
    setLoading(true);
    setLoadingMessage('Parsing document text and auditing ATS match metrics...');
    try {
      const fd = new FormData();
      fd.append('file', atsFile);
      fd.append('jobDescription', jobDescription);

      const response = await fetch('/api/career/ats/check', {
        method: 'POST',
        body: fd
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || 'ATS analysis failed.');

      setAtsResult(data);
    } catch (e) {
      alert(e.message || 'Error during ATS analysis.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-8 no-print">
      
      {/* Sub Tabs */}
      <div className="flex border-b border-neutral-200 dark:border-white/5 pb-1">
        <button
          onClick={() => setActiveSubTab('builder')}
          className={`px-4 py-2 font-bold text-sm border-b-2 transition-all ${
            activeSubTab === 'builder'
              ? 'border-indigo-500 text-indigo-500'
              : 'border-transparent text-neutral-400 hover:text-neutral-200'
          }`}
        >
          AI Resume Builder
        </button>
        <button
          onClick={() => setActiveSubTab('ats')}
          className={`px-4 py-2 font-bold text-sm border-b-2 transition-all ${
            activeSubTab === 'ats'
              ? 'border-indigo-500 text-indigo-500'
              : 'border-transparent text-neutral-400 hover:text-neutral-200'
          }`}
        >
          ATS Resume Audit
        </button>
      </div>

      {loading && <Loader message={loadingMessage} />}

      {/* --- MODULE 1: AI RESUME BUILDER --- */}
      {activeSubTab === 'builder' && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          
          {/* Builder Form */}
          <div className="space-y-6 max-h-[80vh] overflow-y-auto pr-2">
            
            {/* Personal Details */}
            <div className="glass-panel p-6 rounded-2xl space-y-4">
              <h3 className="text-md font-bold flex items-center text-indigo-400">
                <User className="h-5 w-5 mr-2" /> Personal Details
              </h3>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-xs text-neutral-400 block mb-1">Full Name</label>
                  <input
                    type="text"
                    value={resume.personal.name}
                    onChange={(e) => handlePersonalChange('name', e.target.value)}
                    className="w-full px-3 py-2 rounded-lg border border-neutral-300 dark:border-neutral-700 bg-transparent text-sm focus:outline-none focus:ring-1 focus:ring-indigo-500"
                  />
                </div>
                <div>
                  <label className="text-xs text-neutral-400 block mb-1">Email</label>
                  <input
                    type="email"
                    value={resume.personal.email}
                    onChange={(e) => handlePersonalChange('email', e.target.value)}
                    className="w-full px-3 py-2 rounded-lg border border-neutral-300 dark:border-neutral-700 bg-transparent text-sm focus:outline-none focus:ring-1 focus:ring-indigo-500"
                  />
                </div>
                <div>
                  <label className="text-xs text-neutral-400 block mb-1">Phone Number</label>
                  <input
                    type="text"
                    value={resume.personal.phone}
                    onChange={(e) => handlePersonalChange('phone', e.target.value)}
                    className="w-full px-3 py-2 rounded-lg border border-neutral-300 dark:border-neutral-700 bg-transparent text-sm focus:outline-none focus:ring-1 focus:ring-indigo-500"
                  />
                </div>
                <div>
                  <label className="text-xs text-neutral-400 block mb-1">Address</label>
                  <input
                    type="text"
                    value={resume.personal.address}
                    onChange={(e) => handlePersonalChange('address', e.target.value)}
                    className="w-full px-3 py-2 rounded-lg border border-neutral-300 dark:border-neutral-700 bg-transparent text-sm focus:outline-none focus:ring-1 focus:ring-indigo-500"
                  />
                </div>
                <div>
                  <label className="text-xs text-neutral-400 block mb-1">LinkedIn URL</label>
                  <input
                    type="text"
                    value={resume.personal.linkedin}
                    onChange={(e) => handlePersonalChange('linkedin', e.target.value)}
                    className="w-full px-3 py-2 rounded-lg border border-neutral-300 dark:border-neutral-700 bg-transparent text-sm focus:outline-none focus:ring-1 focus:ring-indigo-500"
                  />
                </div>
                <div>
                  <label className="text-xs text-neutral-400 block mb-1">Portfolio/GitHub URL</label>
                  <input
                    type="text"
                    value={resume.personal.portfolio}
                    onChange={(e) => handlePersonalChange('portfolio', e.target.value)}
                    className="w-full px-3 py-2 rounded-lg border border-neutral-300 dark:border-neutral-700 bg-transparent text-sm focus:outline-none focus:ring-1 focus:ring-indigo-500"
                  />
                </div>
              </div>
            </div>

            {/* Professional Summary */}
            <div className="glass-panel p-6 rounded-2xl space-y-3">
              <div className="flex justify-between items-center">
                <h3 className="text-md font-bold text-indigo-400 flex items-center">
                  <FileText className="h-5 w-5 mr-2" /> Professional Summary
                </h3>
                <span className="text-[10px] text-indigo-500 font-semibold uppercase tracking-wider bg-indigo-500/10 px-2 py-0.5 rounded">
                  AI Generated
                </span>
              </div>
              <textarea
                value={resume.summary}
                onChange={(e) => setResume(prev => ({ ...prev, summary: e.target.value }))}
                placeholder="Write a summary or click Optimize to let AI generate one..."
                rows="3"
                className="w-full px-3 py-2 rounded-lg border border-neutral-300 dark:border-neutral-700 bg-transparent text-sm focus:outline-none focus:ring-1 focus:ring-indigo-500"
              />
            </div>

            {/* Education */}
            <div className="glass-panel p-6 rounded-2xl space-y-4">
              <div className="flex justify-between items-center">
                <h3 className="text-md font-bold text-indigo-400 flex items-center">
                  <GraduationCap className="h-5 w-5 mr-2" /> Education
                </h3>
                <button
                  type="button"
                  onClick={() => addListItem('education', { degree: '', university: '', year: '', cgpa: '' })}
                  className="text-xs text-indigo-400 hover:text-indigo-300 flex items-center space-x-1"
                >
                  <Plus className="h-3.5 w-3.5" /> <span>Add</span>
                </button>
              </div>

              {resume.education.map((edu, idx) => (
                <div key={idx} className="p-4 rounded-lg bg-neutral-50/50 dark:bg-white/5 border border-neutral-200 dark:border-white/5 space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-xs font-bold text-neutral-400">Course #{idx + 1}</span>
                    {resume.education.length > 1 && (
                      <button onClick={() => removeListItem('education', idx)} className="text-red-400 hover:text-red-300">
                        <Trash className="h-4 w-4" />
                      </button>
                    )}
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <input
                      type="text"
                      placeholder="Degree / Course"
                      value={edu.degree}
                      onChange={(e) => handleListChange('education', idx, 'degree', e.target.value)}
                      className="px-3 py-1.5 rounded bg-transparent border border-neutral-300 dark:border-neutral-700 text-xs focus:outline-none"
                    />
                    <input
                      type="text"
                      placeholder="University / School"
                      value={edu.university}
                      onChange={(e) => handleListChange('education', idx, 'university', e.target.value)}
                      className="px-3 py-1.5 rounded bg-transparent border border-neutral-300 dark:border-neutral-700 text-xs focus:outline-none"
                    />
                    <input
                      type="text"
                      placeholder="Graduation Year"
                      value={edu.year}
                      onChange={(e) => handleListChange('education', idx, 'year', e.target.value)}
                      className="px-3 py-1.5 rounded bg-transparent border border-neutral-300 dark:border-neutral-700 text-xs focus:outline-none"
                    />
                    <input
                      type="text"
                      placeholder="CGPA or Percentage"
                      value={edu.cgpa}
                      onChange={(e) => handleListChange('education', idx, 'cgpa', e.target.value)}
                      className="px-3 py-1.5 rounded bg-transparent border border-neutral-300 dark:border-neutral-700 text-xs focus:outline-none"
                    />
                  </div>
                </div>
              ))}
            </div>

            {/* Experience */}
            <div className="glass-panel p-6 rounded-2xl space-y-4">
              <div className="flex justify-between items-center">
                <h3 className="text-md font-bold text-indigo-400 flex items-center">
                  <Briefcase className="h-5 w-5 mr-2" /> Work Experience
                </h3>
                <button
                  type="button"
                  onClick={() => addListItem('experience', { companyName: '', jobTitle: '', duration: '', responsibilities: '' })}
                  className="text-xs text-indigo-400 hover:text-indigo-300 flex items-center space-x-1"
                >
                  <Plus className="h-3.5 w-3.5" /> <span>Add</span>
                </button>
              </div>

              {resume.experience.map((exp, idx) => (
                <div key={idx} className="p-4 rounded-lg bg-neutral-50/50 dark:bg-white/5 border border-neutral-200 dark:border-white/5 space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-xs font-bold text-neutral-400">Position #{idx + 1}</span>
                    {resume.experience.length > 1 && (
                      <button onClick={() => removeListItem('experience', idx)} className="text-red-400 hover:text-red-300">
                        <Trash className="h-4 w-4" />
                      </button>
                    )}
                  </div>
                  <div className="grid grid-cols-3 gap-3">
                    <input
                      type="text"
                      placeholder="Company"
                      value={exp.companyName}
                      onChange={(e) => handleListChange('experience', idx, 'companyName', e.target.value)}
                      className="px-3 py-1.5 rounded bg-transparent border border-neutral-300 dark:border-neutral-700 text-xs focus:outline-none col-span-1"
                    />
                    <input
                      type="text"
                      placeholder="Job Title"
                      value={exp.jobTitle}
                      onChange={(e) => handleListChange('experience', idx, 'jobTitle', e.target.value)}
                      className="px-3 py-1.5 rounded bg-transparent border border-neutral-300 dark:border-neutral-700 text-xs focus:outline-none col-span-1"
                    />
                    <input
                      type="text"
                      placeholder="Duration (e.g. 2024 - Present)"
                      value={exp.duration}
                      onChange={(e) => handleListChange('experience', idx, 'duration', e.target.value)}
                      className="px-3 py-1.5 rounded bg-transparent border border-neutral-300 dark:border-neutral-700 text-xs focus:outline-none col-span-1"
                    />
                  </div>
                  <textarea
                    placeholder="Key Responsibilities (AI can rewrite this into strong professional bullet points)"
                    value={exp.responsibilities}
                    onChange={(e) => handleListChange('experience', idx, 'responsibilities', e.target.value)}
                    rows="2"
                    className="w-full px-3 py-1.5 rounded bg-transparent border border-neutral-300 dark:border-neutral-700 text-xs focus:outline-none"
                  />
                </div>
              ))}
            </div>

            {/* Projects */}
            <div className="glass-panel p-6 rounded-2xl space-y-4">
              <div className="flex justify-between items-center">
                <h3 className="text-md font-bold text-indigo-400 flex items-center">
                  <Award className="h-5 w-5 mr-2" /> Projects
                </h3>
                <button
                  type="button"
                  onClick={() => addListItem('projects', { name: '', description: '', technologiesUsed: '' })}
                  className="text-xs text-indigo-400 hover:text-indigo-300 flex items-center space-x-1"
                >
                  <Plus className="h-3.5 w-3.5" /> <span>Add</span>
                </button>
              </div>

              {resume.projects.map((proj, idx) => (
                <div key={idx} className="p-4 rounded-lg bg-neutral-50/50 dark:bg-white/5 border border-neutral-200 dark:border-white/5 space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-xs font-bold text-neutral-400">Project #{idx + 1}</span>
                    {resume.projects.length > 1 && (
                      <button onClick={() => removeListItem('projects', idx)} className="text-red-400 hover:text-red-300">
                        <Trash className="h-4 w-4" />
                      </button>
                    )}
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <input
                      type="text"
                      placeholder="Project Name"
                      value={proj.name}
                      onChange={(e) => handleListChange('projects', idx, 'name', e.target.value)}
                      className="px-3 py-1.5 rounded bg-transparent border border-neutral-300 dark:border-neutral-700 text-xs focus:outline-none"
                    />
                    <input
                      type="text"
                      placeholder="Technologies (e.g. React, Node.js)"
                      value={proj.technologiesUsed}
                      onChange={(e) => handleListChange('projects', idx, 'technologiesUsed', e.target.value)}
                      className="px-3 py-1.5 rounded bg-transparent border border-neutral-300 dark:border-neutral-700 text-xs focus:outline-none"
                    />
                  </div>
                  <textarea
                    placeholder="Project Description"
                    value={proj.description}
                    onChange={(e) => handleListChange('projects', idx, 'description', e.target.value)}
                    rows="2"
                    className="w-full px-3 py-1.5 rounded bg-transparent border border-neutral-300 dark:border-neutral-700 text-xs focus:outline-none"
                  />
                </div>
              ))}
            </div>

            {/* Skills & Certifications */}
            <div className="glass-panel p-6 rounded-2xl space-y-4">
              <h3 className="text-md font-bold text-indigo-400 flex items-center">
                <Sparkles className="h-5 w-5 mr-2" /> Skills & Certifications
              </h3>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-xs text-neutral-400 block mb-1">Technical Skills</label>
                  <textarea
                    value={resume.skills.technical}
                    onChange={(e) => handleSkillChange('technical', e.target.value)}
                    placeholder="Java, Python, React, SQL..."
                    rows="2"
                    className="w-full px-3 py-2 rounded-lg border border-neutral-300 dark:border-neutral-700 bg-transparent text-xs focus:outline-none"
                  />
                </div>
                <div>
                  <label className="text-xs text-neutral-400 block mb-1">Soft Skills</label>
                  <textarea
                    value={resume.skills.soft}
                    onChange={(e) => handleSkillChange('soft', e.target.value)}
                    placeholder="Leadership, Agile, Communication..."
                    rows="2"
                    className="w-full px-3 py-2 rounded-lg border border-neutral-300 dark:border-neutral-700 bg-transparent text-xs focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="text-xs text-neutral-400 block mb-1">Certifications (Optional)</label>
                <input
                  type="text"
                  value={resume.certifications}
                  onChange={(e) => setResume(prev => ({ ...prev, certifications: e.target.value }))}
                  placeholder="AWS Cloud Practitioner, Certified Scrum Master..."
                  className="w-full px-3 py-2 rounded-lg border border-neutral-300 dark:border-neutral-700 bg-transparent text-xs focus:outline-none"
                />
              </div>

              <div>
                <label className="text-xs text-neutral-400 block mb-1">Achievements (Optional)</label>
                <input
                  type="text"
                  value={resume.achievements}
                  onChange={(e) => setResume(prev => ({ ...prev, achievements: e.target.value }))}
                  placeholder="Won regional Hackathon 2025..."
                  className="w-full px-3 py-2 rounded-lg border border-neutral-300 dark:border-neutral-700 bg-transparent text-xs focus:outline-none"
                />
              </div>
            </div>

            {/* Actions */}
            <div className="flex space-x-4">
              <button
                type="button"
                onClick={enhanceWithAI}
                className="flex-1 py-3 px-4 bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 text-white rounded-xl font-bold text-sm shadow-lg shadow-indigo-500/20 flex items-center justify-center space-x-2 transition-all glow-hover"
              >
                <Sparkles className="h-4 w-4" />
                <span>Optimize Resume with AI</span>
              </button>

              <button
                type="button"
                onClick={downloadResumePdf}
                className="py-3 px-4 bg-neutral-200 dark:bg-neutral-800 hover:bg-neutral-300 dark:hover:bg-neutral-700 rounded-xl font-bold text-sm flex items-center justify-center space-x-2 transition-all"
              >
                <Download className="h-4 w-4" />
                <span>Download PDF</span>
              </button>
            </div>

          </div>

          {/* Resume Live Preview Container */}
          <div className="p-8 rounded-2xl bg-white text-neutral-800 min-h-[70vh] flex flex-col justify-between shadow-2xl relative border border-neutral-200">
            {/* Live Indicator */}
            <span className="absolute top-4 right-4 text-[10px] text-green-500 font-bold bg-green-500/10 px-2 py-0.5 rounded flex items-center space-x-1 border border-green-500/25 no-print">
              <span className="h-1.5 w-1.5 rounded-full bg-green-500 animate-ping"></span>
              <span>Live Preview</span>
            </span>

            {/* Printable Resume Formatted Container */}
            <div id="resume-printable-area" className="w-full font-serif text-left space-y-6 text-xs text-neutral-800 leading-relaxed">
              
              {/* Header */}
              <div className="text-center space-y-1">
                <h1 className="text-2xl font-bold uppercase tracking-wide text-black">{resume.personal.name || 'Your Name'}</h1>
                <p className="text-neutral-600 font-sans text-[10px]">
                  {resume.personal.email && `${resume.personal.email} | `}
                  {resume.personal.phone && `${resume.personal.phone} | `}
                  {resume.personal.address}
                </p>
                <p className="text-indigo-600 font-sans text-[9px] lowercase">
                  {resume.personal.linkedin && `${resume.personal.linkedin} `}
                  {resume.personal.portfolio && `| ${resume.personal.portfolio}`}
                </p>
              </div>

              <hr className="border-neutral-300" />

              {/* Summary */}
              {resume.summary && (
                <div className="space-y-1">
                  <h3 className="font-bold text-[11px] uppercase tracking-wider text-black font-sans">Summary</h3>
                  <p>{resume.summary}</p>
                </div>
              )}

              {/* Education */}
              {resume.education.some(e => e.degree) && (
                <div className="space-y-2">
                  <h3 className="font-bold text-[11px] uppercase tracking-wider text-black font-sans">Education</h3>
                  {resume.education.map((edu, idx) => (
                    <div key={idx} className="flex justify-between items-start">
                      <div>
                        <p className="font-bold text-neutral-900">{edu.degree || 'Degree/Course'}</p>
                        <p className="text-neutral-600 text-[10px]">{edu.university || 'University'}</p>
                      </div>
                      <div className="text-right text-[10px] text-neutral-600 font-sans">
                        <p>{edu.year || 'Graduation Year'}</p>
                        <p className="font-bold">{edu.cgpa && `CGPA/Marks: ${edu.cgpa}`}</p>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {/* Experience */}
              {resume.experience.some(exp => exp.companyName) && (
                <div className="space-y-2">
                  <h3 className="font-bold text-[11px] uppercase tracking-wider text-black font-sans">Professional Experience</h3>
                  {resume.experience.map((exp, idx) => (
                    <div key={idx} className="space-y-1">
                      <div className="flex justify-between items-start">
                        <div>
                          <p className="font-bold text-neutral-900">{exp.jobTitle || 'Role Title'}</p>
                          <p className="text-neutral-600 text-[10px]">{exp.companyName || 'Company Name'}</p>
                        </div>
                        <p className="text-right text-[10px] text-neutral-600 font-sans">{exp.duration || 'Duration'}</p>
                      </div>
                      <p className="text-neutral-700">{exp.responsibilities}</p>
                    </div>
                  ))}
                </div>
              )}

              {/* Projects */}
              {resume.projects.some(e => e.name) && (
                <div className="space-y-2">
                  <h3 className="font-bold text-[11px] uppercase tracking-wider text-black font-sans">Key Projects</h3>
                  {resume.projects.map((proj, idx) => (
                    <div key={idx} className="space-y-0.5">
                      <div className="flex justify-between items-start">
                        <p className="font-bold text-neutral-900">{proj.name || 'Project Name'}</p>
                        <p className="text-[10px] text-neutral-500 font-sans italic">{proj.technologiesUsed}</p>
                      </div>
                      <p className="text-neutral-700">{proj.description}</p>
                    </div>
                  ))}
                </div>
              )}

              {/* Skills */}
              {(resume.skills.technical || resume.skills.soft) && (
                <div className="space-y-1">
                  <h3 className="font-bold text-[11px] uppercase tracking-wider text-black font-sans">Skills</h3>
                  {resume.skills.technical && <p><strong className="font-sans text-[10px]">Technical:</strong> {resume.skills.technical}</p>}
                  {resume.skills.soft && <p><strong className="font-sans text-[10px]">Interpersonal:</strong> {resume.skills.soft}</p>}
                </div>
              )}

              {/* Certifications & Achievements */}
              {(resume.certifications || resume.achievements) && (
                <div className="grid grid-cols-2 gap-4 pt-1">
                  {resume.certifications && (
                    <div className="space-y-1">
                      <h3 className="font-bold text-[10px] uppercase tracking-wider text-black font-sans">Certifications</h3>
                      <p>{resume.certifications}</p>
                    </div>
                  )}
                  {resume.achievements && (
                    <div className="space-y-1">
                      <h3 className="font-bold text-[10px] uppercase tracking-wider text-black font-sans">Achievements</h3>
                      <p>{resume.achievements}</p>
                    </div>
                  )}
                </div>
              )}

            </div>

            {/* AI Sidepanel Tips (Only displays if AI suggestions exist) */}
            {aiSuggestions && (
              <motion.div
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                className="mt-6 p-4 rounded-xl bg-indigo-50 dark:bg-indigo-950/20 border border-indigo-200 dark:border-indigo-500/20 space-y-3 text-left no-print"
              >
                <h4 className="text-xs font-bold text-indigo-600 dark:text-indigo-400 flex items-center">
                  <Sparkles className="h-4 w-4 mr-1.5" />                   AI Recommendations
                </h4>
                <div className="space-y-2">
                  <div>
                    <span className="text-[10px] font-bold text-neutral-500 block">Try adding these skills:</span>
                    <div className="flex flex-wrap gap-1.5 mt-1">
                      {aiSuggestions.skills.map((s, i) => (
                        <span key={i} className="text-[9px] bg-indigo-500/10 text-indigo-500 dark:text-indigo-300 px-2 py-0.5 rounded-full font-medium">
                          {s}
                        </span>
                      ))}
                    </div>
                  </div>
                  <div>
                    <span className="text-[10px] font-bold text-neutral-500 block">Recommended ATS Keywords:</span>
                    <div className="flex flex-wrap gap-1.5 mt-1">
                      {aiSuggestions.keywords.map((k, i) => (
                        <span key={i} className="text-[9px] bg-purple-500/10 text-purple-500 dark:text-purple-300 px-2 py-0.5 rounded-full font-medium">
                          {k}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </motion.div>
            )}

          </div>

        </div>
      )}

      {/* --- MODULE 2: ATS AUDIT TOOL --- */}
      {activeSubTab === 'ats' && (
        <div className="max-w-3xl mx-auto space-y-6">
          <div className="glass-panel p-6 rounded-2xl space-y-4 text-left">
            <h3 className="text-lg font-bold flex items-center text-indigo-400">
              <BarChart className="h-5.5 w-5.5 mr-2" /> ATS Resume Optimization
            </h3>
            <p className="text-sm text-neutral-400">
              Upload your resume in PDF/DOCX format, paste the Target Job Description, and audit compatibility metrics.
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-2">
              <div className="space-y-2">
                <label className="text-xs font-bold text-neutral-400 block">Upload Document</label>
                <Dropzone
                  onFilesSelected={setAtsFile}
                  accept=".pdf,.docx"
                  maxSizeMB={8}
                  label="Drop PDF or Word resume here"
                  value={atsFile}
                  onClear={() => setAtsFile(null)}
                />
              </div>

              <div className="flex flex-col space-y-2">
                <label className="text-xs font-bold text-neutral-400 block">Target Job Description (Optional)</label>
                <textarea
                  value={jobDescription}
                  onChange={(e) => setJobDescription(e.target.value)}
                  placeholder="Paste the target job description here to check keyword alignment..."
                  className="w-full flex-grow p-3 rounded-xl border border-neutral-300 dark:border-neutral-700 bg-transparent text-sm focus:outline-none focus:ring-1 focus:ring-indigo-500 min-h-[150px]"
                />
              </div>
            </div>

            <button
              onClick={runAtsChecker}
              disabled={!atsFile}
              className="w-full py-3 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-xl text-sm transition-all disabled:opacity-50 shadow-md shadow-indigo-600/10"
            >
              Analyze Resume Fitness
            </button>
          </div>

          {/* ATS Analysis Output */}
          {atsResult && (
            <motion.div
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              className="glass-panel p-6 rounded-2xl text-left space-y-6 border border-indigo-500/15"
            >
              {/* Score Dashboard Header */}
              <div className="flex flex-col md:flex-row justify-between items-center bg-indigo-500/5 dark:bg-indigo-950/10 p-6 rounded-2xl border border-indigo-500/10 space-y-4 md:space-y-0">
                <div className="flex items-center space-x-4">
                  <div className="relative flex items-center justify-center h-20 w-20">
                    {/* Circle Score Graph */}
                    <svg className="h-20 w-20 transform -rotate-90">
                      <circle cx="40" cy="40" r="34" className="stroke-neutral-200 dark:stroke-neutral-800 fill-none" strokeWidth="6" />
                      <circle
                        cx="40"
                        cy="40"
                        r="34"
                        className="stroke-indigo-500 fill-none"
                        strokeWidth="6"
                        strokeDasharray={2 * Math.PI * 34}
                        strokeDashoffset={2 * Math.PI * 34 * (1 - atsResult.atsScore / 100)}
                        strokeLinecap="round"
                      />
                    </svg>
                    <span className="absolute text-xl font-black text-neutral-800 dark:text-neutral-100">{atsResult.atsScore}%</span>
                  </div>
                  <div>
                    <h4 className="text-lg font-bold text-neutral-800 dark:text-neutral-100">Overall ATS Score</h4>
                    <p className="text-xs text-neutral-500 dark:text-neutral-400">Higher scores signify cleaner formatting and high keyword matches.</p>
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-6 text-center">
                  <div>
                    <p className="text-xs text-neutral-500 dark:text-neutral-400">Keyword Match</p>
                    <p className="text-lg font-black text-indigo-500">{atsResult.keywordMatchScore}%</p>
                  </div>
                  <div>
                    <p className="text-xs text-neutral-500 dark:text-neutral-400">Formatting</p>
                    <p className="text-lg font-black text-purple-500">{atsResult.formattingQuality}</p>
                  </div>
                  <div>
                    <p className="text-xs text-neutral-500 dark:text-neutral-400">Skills Fit</p>
                    <p className="text-lg font-black text-pink-500">{atsResult.skillsMatch}%</p>
                  </div>
                </div>
              </div>

              {/* Keywords and skills analysis */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                
                {/* Missing Keywords */}
                <div className="p-4 rounded-xl bg-red-500/5 border border-red-500/10 space-y-2">
                  <h4 className="text-sm font-bold text-red-500 flex items-center">
                    <X className="h-4 w-4 mr-1.5" /> Missing Keywords
                  </h4>
                  <p className="text-xs text-neutral-400">Incorporate these keywords to improve ranking filters:</p>
                  <div className="flex flex-wrap gap-1.5 pt-1">
                    {atsResult.missingKeywords.map((kw, i) => (
                      <span key={i} className="text-[10px] bg-red-500/10 text-red-500 dark:text-red-400 px-2 py-0.5 rounded-full font-medium">
                        {kw}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Missing Skills */}
                <div className="p-4 rounded-xl bg-orange-500/5 border border-orange-500/10 space-y-2">
                  <h4 className="text-sm font-bold text-orange-500 flex items-center">
                    <AlertCircle className="h-4 w-4 mr-1.5" /> Missing Key Skills
                  </h4>
                  <p className="text-xs text-neutral-400">Add these technical or methodology skills:</p>
                  <div className="flex flex-wrap gap-1.5 pt-1">
                    {atsResult.missingSkills.map((sk, i) => (
                      <span key={i} className="text-[10px] bg-orange-500/10 text-orange-500 dark:text-orange-400 px-2 py-0.5 rounded-full font-medium">
                        {sk}
                      </span>
                    ))}
                  </div>
                </div>

              </div>

              {/* Grammar & Completeness */}
              <div className="space-y-4">
                <div className="p-4 rounded-xl bg-neutral-50/50 dark:bg-white/5 border border-neutral-200 dark:border-white/5">
                  <h4 className="text-sm font-bold text-neutral-700 dark:text-neutral-300">Section Analysis</h4>
                  <div className="grid grid-cols-2 sm:grid-cols-5 gap-3 mt-3 text-center">
                    {Object.entries(atsResult.sectionCompleteness).map(([sec, present], i) => (
                      <div key={i} className="p-2 rounded bg-neutral-100 dark:bg-neutral-800 text-[10px] font-semibold space-y-1">
                        <span className="capitalize block text-neutral-400">{sec.replace(/([A-Z])/g, ' $1')}</span>
                        {present ? (
                          <span className="text-green-500 flex items-center justify-center"><CheckCircle className="h-3.5 w-3.5 mr-1" /> Found</span>
                        ) : (
                          <span className="text-red-400 flex items-center justify-center"><X className="h-3.5 w-3.5 mr-1" /> Missing</span>
                        )}
                      </div>
                    ))}
                  </div>
                </div>

                {/* Recommendations */}
                <div className="space-y-2">
                  <h4 className="text-sm font-bold text-neutral-800 dark:text-neutral-200">Improvement Guidelines</h4>
                  <ul className="space-y-1.5 text-xs text-neutral-500 dark:text-neutral-400">
                    {atsResult.recommendations.map((rec, i) => (
                      <li key={i} className="flex items-start">
                        <span className="text-indigo-500 mr-2">•</span>
                        <span>{rec}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

            </motion.div>
          )}

        </div>
      )}

      {/* AI Changes Preview Modal */}
      <AnimatePresence>
        {pendingAiChanges && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4"
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-[var(--card-bg)] rounded-2xl shadow-2xl border border-[var(--border-color)] w-full max-w-2xl max-h-[85vh] flex flex-col"
            >
              {/* Header */}
              <div className="px-6 py-4 border-b border-[var(--border-color)] flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <Sparkles className="h-5 w-5 text-indigo-500" />
                  <h3 className="text-lg font-bold text-[var(--text-primary)]">AI Suggested Changes</h3>
                </div>
                <button onClick={discardAiChanges} className="p-1 rounded-lg hover:bg-[var(--muted-bg)] text-[var(--text-secondary)]">
                  <X className="h-5 w-5" />
                </button>
              </div>

              {/* Scrollable Content */}
              <div className="px-6 py-4 space-y-5 overflow-y-auto flex-1">
                <div className="space-y-2">
                  <h4 className="text-xs font-bold text-indigo-500 uppercase tracking-wider">Professional Summary</h4>
                  <div className="p-3 rounded-xl bg-green-50 dark:bg-green-950/30 border border-green-200 dark:border-green-800 text-xs leading-relaxed text-[var(--text-primary)]">
                    {pendingAiChanges.summary}
                  </div>
                </div>

                {pendingAiChanges.experience?.length > 0 && (
                  <div className="space-y-2">
                    <h4 className="text-xs font-bold text-indigo-500 uppercase tracking-wider">Work Experience</h4>
                    <div className="space-y-2">
                      {pendingAiChanges.experience.map((exp, i) => (
                        <div key={i} className="p-3 rounded-xl bg-green-50 dark:bg-green-950/30 border border-green-200 dark:border-green-800 text-xs space-y-1">
                          <p className="font-bold text-[var(--text-primary)]">{exp.jobTitle} — {exp.companyName} <span className="font-normal text-[var(--text-secondary)]">({exp.duration})</span></p>
                          <p className="text-[var(--text-secondary)] leading-relaxed whitespace-pre-line">{exp.responsibilities}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {pendingAiChanges.projects?.length > 0 && (
                  <div className="space-y-2">
                    <h4 className="text-xs font-bold text-indigo-500 uppercase tracking-wider">Projects</h4>
                    <div className="space-y-2">
                      {pendingAiChanges.projects.map((proj, i) => (
                        <div key={i} className="p-3 rounded-xl bg-green-50 dark:bg-green-950/30 border border-green-200 dark:border-green-800 text-xs space-y-1">
                          <p className="font-bold text-[var(--text-primary)]">{proj.name} <span className="font-normal text-[var(--text-secondary)]">({proj.technologiesUsed})</span></p>
                          <p className="text-[var(--text-secondary)] leading-relaxed">{proj.description}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {(pendingAiChanges.suggestedSkills?.length > 0 || pendingAiChanges.suggestedKeywords?.length > 0) && (
                  <div className="grid grid-cols-2 gap-4">
                    {pendingAiChanges.suggestedSkills?.length > 0 && (
                      <div className="space-y-2">
                        <h4 className="text-xs font-bold text-purple-500 uppercase tracking-wider">Suggested Skills</h4>
                        <div className="flex flex-wrap gap-1.5">
                          {pendingAiChanges.suggestedSkills.map((s, i) => (
                            <span key={i} className="text-[10px] bg-purple-100 dark:bg-purple-950/40 text-purple-700 dark:text-purple-300 px-2 py-0.5 rounded-full font-medium">{s}</span>
                          ))}
                        </div>
                      </div>
                    )}
                    {pendingAiChanges.suggestedKeywords?.length > 0 && (
                      <div className="space-y-2">
                        <h4 className="text-xs font-bold text-pink-500 uppercase tracking-wider">ATS Keywords</h4>
                        <div className="flex flex-wrap gap-1.5">
                          {pendingAiChanges.suggestedKeywords.map((k, i) => (
                            <span key={i} className="text-[10px] bg-pink-100 dark:bg-pink-950/40 text-pink-700 dark:text-pink-300 px-2 py-0.5 rounded-full font-medium">{k}</span>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </div>

              {/* Footer */}
              <div className="px-6 py-4 border-t border-[var(--border-color)] flex space-x-3">
                <button onClick={discardAiChanges}
                  className="flex-1 py-2.5 px-4 rounded-xl text-sm font-bold bg-[var(--muted-bg)] text-[var(--text-secondary)] hover:bg-[var(--bg-secondary)] transition-all border border-[var(--border-color)]">
                  Discard
                </button>
                <button onClick={applyAiChanges}
                  className="flex-1 py-2.5 px-4 rounded-xl text-sm font-bold bg-indigo-600 hover:bg-indigo-700 text-white transition-all shadow-md shadow-indigo-600/10 flex items-center justify-center space-x-2">
                  <CheckCircle className="h-4 w-4" />
                  <span>Apply Changes</span>
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

    </div>
  );
};

export default CareerToolkit;
