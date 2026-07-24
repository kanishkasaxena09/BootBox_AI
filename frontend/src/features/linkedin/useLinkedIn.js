import { useState, useCallback } from 'react';
import {
  headlineTemplates, aboutTemplates, experienceSuggestions,
  skillsDatabase, bannerSuggestions, profileScoreCriteria,
  postTemplates, hashtagSets, keywordsDatabase, checklistItems,
  generateHeadline, generateAbout, calculateProfileScore, generateHashtags,
} from './mockData';

const STORAGE_KEY = 'bootbox_linkedin_history';

const ROLES = [
  'Software Engineer', 'Product Manager', 'Data Scientist',
  'UX Designer', 'DevOps Engineer', 'Marketing Manager',
];

const TABS = [
  { id: 'headline', label: 'Headline' },
  { id: 'about', label: 'About' },
  { id: 'experience', label: 'Experience' },
  { id: 'skills', label: 'Skills' },
  { id: 'banner', label: 'Banner' },
  { id: 'score', label: 'Profile Score' },
  { id: 'post', label: 'Post' },
  { id: 'hashtag', label: 'Hashtags' },
  { id: 'checklist', label: 'Checklist' },
  { id: 'keywords', label: 'Keywords' },
];

export default function useLinkedIn() {
  const [activeTab, setActiveTab] = useState('headline');

  const [role, setRole] = useState('');
  const [company, setCompany] = useState('');
  const [tech, setTech] = useState('');
  const [experience, setExperience] = useState('');
  const [headline, setHeadline] = useState('');
  const [about, setAbout] = useState('');
  const [selectedSkills, setSelectedSkills] = useState([]);
  const [skillCategory, setSkillCategory] = useState('technical');
  const [postType, setPostType] = useState('');
  const [postContent, setPostContent] = useState('');
  const [generatedHashtags, setGeneratedHashtags] = useState([]);
  const [hashtagCount, setHashtagCount] = useState(10);
  const [customHashtags, setCustomHashtags] = useState('');
  const [profileAnswers, setProfileAnswers] = useState({});
  const [checklistState, setChecklistState] = useState({});
  const [selectedBanner, setSelectedBanner] = useState(null);
  const [keywordInput, setKeywordInput] = useState('');
  const [optimizedKeywords, setOptimizedKeywords] = useState([]);
  const [generating, setGenerating] = useState(false);
  const [history, setHistory] = useState(() => {
    try { return JSON.parse(localStorage.getItem(STORAGE_KEY)) || []; }
    catch { return []; }
  });

  const saveToHistory = useCallback((type, data) => {
    const entry = { id: Date.now(), type, data, timestamp: new Date().toISOString() };
    setHistory(prev => {
      const next = [entry, ...prev].slice(0, 30);
      localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
      return next;
    });
  }, []);

  const clearHistory = useCallback(() => {
    setHistory([]);
    localStorage.removeItem(STORAGE_KEY);
  }, []);

  const removeHistoryEntry = useCallback((id) => {
    setHistory(prev => {
      const next = prev.filter(e => e.id !== id);
      localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
      return next;
    });
  }, []);

  const handleGenerateHeadline = useCallback(async () => {
    setGenerating(true);
    try {
      const result = await generateHeadline(role, company, tech, headlineTemplates);
      setHeadline(result);
      saveToHistory('headline', { role, company, tech, result });
      return result;
    } finally {
      setGenerating(false);
    }
  }, [role, company, tech, saveToHistory]);

  const handleGenerateAbout = useCallback(async () => {
    setGenerating(true);
    try {
      const data = { experience, tech, company, metric: 'engagement by 40%', project: 'a distributed system', users: '500K', improvement: '60%', size: '10TB', opensource: '5+' };
      const result = await generateAbout(role, data, aboutTemplates);
      setAbout(result);
      saveToHistory('about', { role, data, result });
      return result;
    } finally {
      setGenerating(false);
    }
  }, [role, experience, tech, company, saveToHistory]);

  const handleGeneratePost = useCallback(() => {
    const template = postTemplates.find(t => t.type === postType);
    if (!template) return '';
    const result = template.template.replace(/{topic}/g, role || 'technology')
      .replace(/{insight_1}/g, 'The key is understanding your users deeply')
      .replace(/{insight_2}/g, 'Data should drive decisions, not gut feeling')
      .replace(/{insight_3}/g, 'Iteration beats perfection every time')
      .replace(/{conclusion}/g, 'Consistency and curiosity are the ultimate career accelerators')
      .replace(/{milestone}/g, 'started my journey as a ' + (role || 'professional'))
      .replace(/{context}/g, 'my career')
      .replace(/{journey}/g, 'I\'d be leading teams within 5 years')
      .replace(/{lesson_1}/g, 'Invest in relationships early')
      .replace(/{lesson_2}/g, 'Never stop learning')
      .replace(/{lesson_3}/g, 'Find mentors who challenge you')
      .replace(/{lesson_4}/g, 'Your network is your net worth')
      .replace(/{lesson_5}/g, 'Documentation saves teams')
      .replace(/{gratitude}/g, 'my amazing team and mentors')
      .replace(/{experience}/g, '5+ years')
      .replace(/{field}/g, role || 'this industry')
      .replace(/{number}/g, '5')
      .replace(/{trend}/g, 'AI and automation')
      .replace(/{action}/g, 'build products')
      .replace(/{point_1}/g, 'It augments human capability, not replaces it')
      .replace(/{point_2}/g, 'Early adopters gain 2-3x competitive advantage')
      .replace(/{point_3}/g, 'The real skill is knowing when NOT to use AI')
      .replace(/{prediction}/g, 'Every developer will use AI copilots within 2 years')
      .replace(/{goal}/g, 'level up your career')
      .replace(/{step_1}/g, 'Identify your unique value proposition')
      .replace(/{step_2}/g, 'Build in public and share your journey')
      .replace(/{step_3}/g, 'Network strategically, not desperately')
      .replace(/{step_4}/g, 'Invest in skills that compound over time')
      .replace(/{tip}/g, 'Start with the end in mind')
      .replace(/{question}/g, 'What\'s the one skill that changed your career trajectory?')
      .replace(/{my_answer}/g, 'Learning to communicate technical concepts to non-technical stakeholders')
      .replace(/{hashtags}/g, generateHashtags(role, 5).join(' '));
    setPostContent(result);
    saveToHistory('post', { type: postType, role, result });
    return result;
  }, [postType, role, saveToHistory]);

  const handleGenerateHashtags = useCallback(() => {
    const result = generateHashtags(role, hashtagCount, customHashtags);
    setGeneratedHashtags(result);
    saveToHistory('hashtag', { role, count: hashtagCount, result });
    return result;
  }, [role, hashtagCount, customHashtags, saveToHistory]);

  const handleGenerateKeywords = useCallback(() => {
    const db = keywordsDatabase[role] || keywordsDatabase['Software Engineer'];
    const inputWords = keywordInput.toLowerCase().split(/[,\s]+/).filter(Boolean);
    const matched = db.filter(kw => {
      const kwl = kw.toLowerCase();
      return inputWords.some(w => kwl.includes(w) || w.includes(kwl));
    });
    const suggested = db.filter(kw => !matched.includes(kw)).slice(0, 8);
    const result = { matched, suggested, missing: db.filter(kw => !inputWords.some(w => kw.toLowerCase().includes(w))) };
    setOptimizedKeywords(result);
    saveToHistory('keywords', { role, input: keywordInput, result });
    return result;
  }, [role, keywordInput, saveToHistory]);

  const toggleProfileAnswer = useCallback((id) => {
    setProfileAnswers(prev => ({ ...prev, [id]: !prev[id] }));
  }, []);

  const toggleChecklistItem = useCallback((id) => {
    setChecklistState(prev => ({ ...prev, [id]: !prev[id] }));
  }, []);

  const profileScore = calculateProfileScore(profileAnswers);

  const getSkillDatabase = useCallback(() => {
    return skillsDatabase[role] || skillsDatabase['Software Engineer'];
  }, [role]);

  const getBanners = useCallback(() => {
    return bannerSuggestions;
  }, []);

  const copyToClipboard = useCallback((text) => {
    navigator.clipboard?.writeText(text).catch(() => {});
  }, []);

  return {
    activeTab, setActiveTab,
    role, setRole, company, setCompany, tech, setTech, experience, setExperience,
    roles: ROLES, tabs: TABS,
    headline, setHeadline, handleGenerateHeadline,
    about, setAbout, handleGenerateAbout,
    experienceSuggestions,
    skillsDatabase: getSkillDatabase(), selectedSkills, setSelectedSkills, skillCategory, setSkillCategory,
    bannerSuggestions: getBanners(), selectedBanner, setSelectedBanner,
    profileScoreCriteria, profileAnswers, toggleProfileAnswer, profileScore,
    postTemplates, postType, setPostType, postContent, setPostContent, handleGeneratePost,
    hashtagSets, hashtagCount, setHashtagCount, customHashtags, setCustomHashtags,
    generatedHashtags, handleGenerateHashtags,
    keywordsDatabase, keywordInput, setKeywordInput, optimizedKeywords, handleGenerateKeywords,
    checklistItems, checklistState, toggleChecklistItem,
    generating,
    history, clearHistory, removeHistoryEntry,
    copyToClipboard,
  };
}
