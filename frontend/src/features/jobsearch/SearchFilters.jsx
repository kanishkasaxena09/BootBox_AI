import React from 'react';
import { SlidersHorizontal, X } from 'lucide-react';

const SearchFilters = ({
  keyword, setKeyword,
  location, setLocation,
  remote, setRemote,
  experience, setExperience,
  salary, setSalary,
  company, setCompany,
  allLocations, allCompanies, experienceLevels, salaryRanges,
  suggestions, onSuggestionClick,
  hasActiveFilters, onClear,
}) => (
  <div className="glass-panel border border-[var(--border-color)] p-5 rounded-2xl space-y-4 shadow-sm">
    <div className="flex items-center justify-between">
      <div className="flex items-center space-x-2">
        <SlidersHorizontal className="h-4 w-4 text-pink-500" />
        <h3 className="text-sm font-bold text-[var(--text-primary)]">Search & Filters</h3>
      </div>
      {hasActiveFilters && (
        <button onClick={onClear} className="text-[10px] font-bold text-pink-500 hover:text-pink-600 flex items-center space-x-1">
          <X className="h-3 w-3" />
          <span>Clear All</span>
        </button>
      )}
    </div>

    <div className="relative">
      <input
        type="text"
        value={keyword}
        onChange={(e) => setKeyword(e.target.value)}
        placeholder="Search by title, company, or skill..."
        className="w-full px-4 py-2.5 rounded-xl border border-[var(--border-color)] bg-[var(--input-bg)] text-sm focus:outline-none focus:ring-2 focus:ring-pink-500 text-[var(--text-primary)]"
      />
      {suggestions.length > 0 && (
        <div className="absolute top-full left-0 right-0 mt-1 glass-panel border border-[var(--border-color)] rounded-xl overflow-hidden z-10 shadow-lg">
          {suggestions.map((s, i) => (
            <button key={i} onClick={() => onSuggestionClick(s)}
              className="w-full text-left px-4 py-2.5 text-sm text-[var(--text-primary)] hover:bg-pink-500/5 transition-colors">
              {s}
            </button>
          ))}
        </div>
      )}
    </div>

    <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
      <select value={location} onChange={(e) => setLocation(e.target.value)}
        className="px-3 py-2 rounded-xl border border-[var(--border-color)] bg-[var(--input-bg)] text-xs focus:outline-none text-[var(--text-primary)]">
        <option value="">All Locations</option>
        {allLocations.map(loc => <option key={loc} value={loc}>{loc}</option>)}
      </select>

      <select value={experience} onChange={(e) => setExperience(e.target.value)}
        className="px-3 py-2 rounded-xl border border-[var(--border-color)] bg-[var(--input-bg)] text-xs focus:outline-none text-[var(--text-primary)]">
        <option value="">Any Experience</option>
        {experienceLevels.map(exp => <option key={exp} value={exp}>{exp}</option>)}
      </select>

      <select value={salary} onChange={(e) => setSalary(e.target.value)}
        className="px-3 py-2 rounded-xl border border-[var(--border-color)] bg-[var(--input-bg)] text-xs focus:outline-none text-[var(--text-primary)]">
        <option value="">Any Salary</option>
        {salaryRanges.map(s => <option key={s} value={s}>{s}</option>)}
      </select>

      <select value={company} onChange={(e) => setCompany(e.target.value)}
        className="px-3 py-2 rounded-xl border border-[var(--border-color)] bg-[var(--input-bg)] text-xs focus:outline-none text-[var(--text-primary)]">
        <option value="">All Companies</option>
        {allCompanies.map(c => <option key={c} value={c}>{c}</option>)}
      </select>
    </div>

    <label className="flex items-center space-x-2 cursor-pointer group">
      <div className={`relative w-9 h-5 rounded-full transition-colors ${remote ? 'bg-pink-500' : 'bg-[var(--bg-secondary)]'}`}>
        <div className={`absolute top-0.5 left-0.5 w-4 h-4 rounded-full bg-white shadow transition-transform ${remote ? 'translate-x-4' : ''}`} />
      </div>
      <span className="text-xs font-semibold text-[var(--text-secondary)] group-hover:text-[var(--text-primary)] transition-colors">Remote Only</span>
    </label>
  </div>
);

export default SearchFilters;
