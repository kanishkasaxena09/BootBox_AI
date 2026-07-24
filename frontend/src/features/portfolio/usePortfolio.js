import { useState, useCallback } from 'react';
import { themes, templates, defaultData, generatePortfolioHTML } from './mockData';

const STORAGE_KEY = 'bootbox_portfolio';

export default function usePortfolio() {
  const [data, setData] = useState(() => {
    try { return JSON.parse(localStorage.getItem(STORAGE_KEY)) || { ...defaultData }; }
    catch { return { ...defaultData }; }
  });
  const [theme, setTheme] = useState('midnight');
  const [template, setTemplate] = useState('modern');
  const [activeSection, setActiveSection] = useState('personal');
  const [previewMode, setPreviewMode] = useState(false);

  const save = useCallback((newData) => {
    setData(newData);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(newData));
  }, []);

  const updatePersonal = useCallback((field, value) => {
    save({ ...data, personal: { ...data.personal, [field]: value } });
  }, [data, save]);

  const addProject = useCallback(() => {
    const id = 'p' + Date.now();
    save({ ...data, projects: [...data.projects, { id, title: 'New Project', description: '', tech: [], link: '', image: '' }] });
  }, [data, save]);

  const updateProject = useCallback((id, field, value) => {
    save({ ...data, projects: data.projects.map(p => p.id === id ? { ...p, [field]: value } : p) });
  }, [data, save]);

  const removeProject = useCallback((id) => {
    save({ ...data, projects: data.projects.filter(p => p.id !== id) });
  }, [data, save]);

  const addSkillCategory = useCallback(() => {
    save({ ...data, skills: [...data.skills, { category: 'New Category', items: [] }] });
  }, [data, save]);

  const updateSkillCategory = useCallback((index, category) => {
    const newSkills = [...data.skills];
    newSkills[index] = { ...newSkills[index], category };
    save({ ...data, skills: newSkills });
  }, [data, save]);

  const updateSkillItems = useCallback((index, items) => {
    const newSkills = [...data.skills];
    newSkills[index] = { ...newSkills[index], items: items.split(',').map(i => i.trim()).filter(Boolean) };
    save({ ...data, skills: newSkills });
  }, [data, save]);

  const removeSkillCategory = useCallback((index) => {
    save({ ...data, skills: data.skills.filter((_, i) => i !== index) });
  }, [data, save]);

  const addEducation = useCallback(() => {
    const id = 'e' + Date.now();
    save({ ...data, education: [...data.education, { id, school: 'University Name', degree: 'Degree', year: '2020 - 2024', description: '' }] });
  }, [data, save]);

  const updateEducation = useCallback((id, field, value) => {
    save({ ...data, education: data.education.map(e => e.id === id ? { ...e, [field]: value } : e) });
  }, [data, save]);

  const removeEducation = useCallback((id) => {
    save({ ...data, education: data.education.filter(e => e.id !== id) });
  }, [data, save]);

  const addExperience = useCallback(() => {
    const id = 'x' + Date.now();
    save({ ...data, experience: [...data.experience, { id, company: 'Company Name', role: 'Role', duration: '2024 - Present', description: '' }] });
  }, [data, save]);

  const updateExperience = useCallback((id, field, value) => {
    save({ ...data, experience: data.experience.map(x => x.id === id ? { ...x, [field]: value } : x) });
  }, [data, save]);

  const removeExperience = useCallback((id) => {
    save({ ...data, experience: data.experience.filter(x => x.id !== id) });
  }, [data, save]);

  const addCertificate = useCallback(() => {
    const id = 'c' + Date.now();
    save({ ...data, certificates: [...data.certificates, { id, name: 'Certificate Name', issuer: 'Issuer', date: '2024', link: '' }] });
  }, [data, save]);

  const updateCertificate = useCallback((id, field, value) => {
    save({ ...data, certificates: data.certificates.map(c => c.id === id ? { ...c, [field]: value } : c) });
  }, [data, save]);

  const removeCertificate = useCallback((id) => {
    save({ ...data, certificates: data.certificates.filter(c => c.id !== id) });
  }, [data, save]);

  const updateSocial = useCallback((platform, url) => {
    const existing = data.socials.find(s => s.platform === platform);
    if (existing) {
      save({ ...data, socials: data.socials.map(s => s.platform === platform ? { ...s, url } : s) });
    } else {
      save({ ...data, socials: [...data.socials, { platform, url }] });
    }
  }, [data, save]);

  const getHTML = useCallback(() => {
    return generatePortfolioHTML(data, theme, template);
  }, [data, theme, template]);

  const downloadHTML = useCallback(() => {
    const html = getHTML();
    const blob = new Blob([html], { type: 'text/html' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${data.personal.name.replace(/\s+/g, '_') || 'portfolio'}.html`;
    a.click();
    URL.revokeObjectURL(url);
  }, [getHTML, data.personal.name]);

  const downloadZIP = useCallback(async () => {
    const html = getHTML();
    const { default: JSZip } = await import('jszip');
    const zip = new JSZip();
    zip.file('index.html', html);
    zip.file('README.md', `# ${data.personal.name} Portfolio\n\nBuilt with BootBox Portfolio Builder.\nOpen index.html in your browser to view.\n`);
    const blob = await zip.generateAsync({ type: 'blob' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${data.personal.name.replace(/\s+/g, '_') || 'portfolio'}_portfolio.zip`;
    a.click();
    URL.revokeObjectURL(url);
  }, [getHTML, data.personal.name]);

  const resetData = useCallback(() => {
    setData({ ...defaultData });
    localStorage.removeItem(STORAGE_KEY);
  }, []);

  const sections = [
    { id: 'personal', label: 'Personal Info', icon: 'User' },
    { id: 'projects', label: 'Projects', icon: 'FolderOpen' },
    { id: 'skills', label: 'Skills', icon: 'Award' },
    { id: 'education', label: 'Education', icon: 'GraduationCap' },
    { id: 'experience', label: 'Experience', icon: 'Briefcase' },
    { id: 'certificates', label: 'Certificates', icon: 'BadgeCheck' },
    { id: 'socials', label: 'Social Links', icon: 'Globe' },
  ];

  return {
    data, theme, setTheme, template, setTemplate,
    activeSection, setActiveSection, previewMode, setPreviewMode,
    themes, templates, sections,
    updatePersonal,
    addProject, updateProject, removeProject,
    addSkillCategory, updateSkillCategory, updateSkillItems, removeSkillCategory,
    addEducation, updateEducation, removeEducation,
    addExperience, updateExperience, removeExperience,
    addCertificate, updateCertificate, removeCertificate,
    updateSocial,
    getHTML, downloadHTML, downloadZIP, resetData,
  };
}
