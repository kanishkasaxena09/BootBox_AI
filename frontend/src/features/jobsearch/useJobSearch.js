import { useState, useEffect, useCallback, useRef } from 'react';
import { allJobs, allLocations, allCompanies, experienceLevels, salaryRanges } from './mockJobs';

const ITEMS_PER_PAGE = 12;
const SKELETON_DELAY = 600;

function loadFromStorage(key, fallback) {
  try {
    const stored = localStorage.getItem(key);
    return stored ? JSON.parse(stored) : fallback;
  } catch {
    return fallback;
  }
}

function saveToStorage(key, value) {
  try { localStorage.setItem(key, JSON.stringify(value)); } catch {}
}

function filterJobs(jobs, { keyword, location, remote, experience, salary, company }) {
  return jobs.filter(job => {
    if (keyword) {
      const q = keyword.toLowerCase();
      const match = job.title.toLowerCase().includes(q)
        || job.company.toLowerCase().includes(q)
        || job.tags.some(t => t.toLowerCase().includes(q));
      if (!match) return false;
    }
    if (location && job.location !== location) return false;
    if (remote && !job.isRemote) return false;
    if (experience && job.experience !== experience) return false;
    if (salary && job.salary !== salary) return false;
    if (company && job.company !== company) return false;
    return true;
  });
}

export function useJobSearch() {
  const [keyword, setKeyword] = useState('');
  const [location, setLocation] = useState('');
  const [remote, setRemote] = useState(false);
  const [experience, setExperience] = useState('');
  const [salary, setSalary] = useState('');
  const [company, setCompany] = useState('');
  const [page, setPage] = useState(1);
  const [jobs, setJobs] = useState([]);
  const [totalJobs, setTotalJobs] = useState(0);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [savedJobs, setSavedJobs] = useState(() => loadFromStorage('savedJobs', []));
  const [recentJobs, setRecentJobs] = useState(() => loadFromStorage('recentJobs', []));
  const [viewJob, setViewJob] = useState(null);
  const timeoutRef = useRef(null);

  const filters = { keyword, location, remote, experience, salary, company };

  const fetchJobs = useCallback((pageToFetch, append = false) => {
    if (append) setLoadingMore(true);
    else setLoading(true);

    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    timeoutRef.current = setTimeout(() => {
      const filtered = filterJobs(allJobs, filters);
      const start = (pageToFetch - 1) * ITEMS_PER_PAGE;
      const pageJobs = filtered.slice(start, start + ITEMS_PER_PAGE);

      if (append) setJobs(prev => [...prev, ...pageJobs]);
      else setJobs(pageJobs);

      setTotalJobs(filtered.length);
      setLoading(false);
      setLoadingMore(false);
    }, append ? 400 : SKELETON_DELAY);
  }, [keyword, location, remote, experience, salary, company]);

  useEffect(() => {
    setPage(1);
    fetchJobs(1, false);
  }, [fetchJobs]);

  useEffect(() => {
    if (page > 1) fetchJobs(page, true);
  }, [page, fetchJobs]);

  const hasMore = jobs.length < totalJobs;

  const loadMore = useCallback(() => {
    if (hasMore && !loadingMore) setPage(p => p + 1);
  }, [hasMore, loadingMore]);

  const toggleSave = useCallback((job) => {
    setSavedJobs(prev => {
      const exists = prev.some(j => j.id === job.id);
      const next = exists ? prev.filter(j => j.id !== job.id) : [job, ...prev];
      saveToStorage('savedJobs', next);
      return next;
    });
  }, []);

  const isSaved = useCallback((jobId) => savedJobs.some(j => j.id === jobId), [savedJobs]);

  const viewJobDetail = useCallback((job) => {
    setViewJob(job);
    setRecentJobs(prev => {
      const filtered = prev.filter(j => j.id !== job.id);
      const next = [job, ...filtered].slice(0, 5);
      saveToStorage('recentJobs', next);
      return next;
    });
  }, []);

  const closeJobDetail = useCallback(() => setViewJob(null), []);

  const clearFilters = useCallback(() => {
    setKeyword('');
    setLocation('');
    setRemote(false);
    setExperience('');
    setSalary('');
    setCompany('');
  }, []);

  const hasActiveFilters = keyword || location || remote || experience || salary || company;

  const getSuggestions = useCallback((query) => {
    if (!query || query.length < 2) return [];
    const q = query.toLowerCase();
    const titles = [...new Set(allJobs.map(j => j.title))];
    return titles.filter(t => t.toLowerCase().includes(q)).slice(0, 5);
  }, []);

  return {
    keyword, setKeyword,
    location, setLocation,
    remote, setRemote,
    experience, setExperience,
    salary, setSalary,
    company, setCompany,
    jobs, totalJobs, page,
    loading, loadingMore, hasMore,
    savedJobs, recentJobs,
    viewJob, closeJobDetail, viewJobDetail,
    toggleSave, isSaved,
    loadMore, clearFilters, hasActiveFilters,
    getSuggestions,
    allLocations, allCompanies, experienceLevels, salaryRanges,
  };
}
