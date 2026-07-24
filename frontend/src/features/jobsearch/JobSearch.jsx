import React, { useEffect, useRef, useCallback } from 'react';
import { motion } from 'framer-motion';
import { Search, Briefcase, Bookmark, Clock, Loader2 } from 'lucide-react';
import { useJobSearch } from './useJobSearch';
import SearchFilters from './SearchFilters';
import JobCard from './JobCard';
import JobDetail from './JobDetail';
import SkeletonCard from './SkeletonCard';

const JobSearch = () => {
  const {
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
  } = useJobSearch();

  const observerRef = useRef(null);
  const loadMoreRef = useRef(null);
  const suggestions = getSuggestions(keyword);

  const handleObserver = useCallback((entries) => {
    const target = entries[0];
    if (target.isIntersecting && hasMore && !loadingMore && !loading) {
      loadMore();
    }
  }, [hasMore, loadingMore, loading, loadMore]);

  useEffect(() => {
    const option = { root: null, rootMargin: '200px', threshold: 0 };
    observerRef.current = new IntersectionObserver(handleObserver, option);
    if (loadMoreRef.current) observerRef.current.observe(loadMoreRef.current);
    return () => { if (observerRef.current) observerRef.current.disconnect(); };
  }, [handleObserver]);

  return (
    <div className="space-y-6 text-left">
      {/* Header */}
      <div className="text-center md:text-left space-y-2">
        <h2 className="text-2xl font-black bg-gradient-to-r from-pink-500 to-rose-500 bg-clip-text text-transparent">
          Job Search
        </h2>
        <p className="text-sm text-[var(--text-secondary)]">
          Discover opportunities that match your skills and ambitions.
        </p>
      </div>

      {/* Filters */}
      <SearchFilters
        keyword={keyword} setKeyword={setKeyword}
        location={location} setLocation={setLocation}
        remote={remote} setRemote={setRemote}
        experience={experience} setExperience={setExperience}
        salary={salary} setSalary={setSalary}
        company={company} setCompany={setCompany}
        allLocations={allLocations} allCompanies={allCompanies}
        experienceLevels={experienceLevels} salaryRanges={salaryRanges}
        suggestions={suggestions}
        onSuggestionClick={(s) => { setKeyword(s); }}
        hasActiveFilters={hasActiveFilters}
        onClear={clearFilters}
      />

      {/* Results count */}
      {!loading && (
        <div className="flex items-center justify-between">
          <p className="text-xs text-[var(--text-secondary)]">
            <span className="font-bold text-[var(--text-primary)]">{totalJobs}</span> jobs found
          </p>
          <div className="flex items-center space-x-3 text-xs text-[var(--text-secondary)]">
            {savedJobs.length > 0 && (
              <span className="flex items-center space-x-1">
                <Bookmark className="h-3 w-3" />
                <span>{savedJobs.length} saved</span>
              </span>
            )}
          </div>
        </div>
      )}

      {/* Recently Viewed */}
      {!loading && recentJobs.length > 0 && !hasActiveFilters && (
        <div className="space-y-3">
          <h3 className="text-xs font-bold text-[var(--text-secondary)] uppercase tracking-wider flex items-center space-x-1.5">
            <Clock className="h-3.5 w-3.5" />
            <span>Recently Viewed</span>
          </h3>
          <div className="flex space-x-3 overflow-x-auto pb-2 scrollbar-hide">
            {recentJobs.map(job => (
              <motion.div key={job.id} whileHover={{ y: -2 }}
                onClick={() => viewJobDetail(job)}
                className="flex-shrink-0 glass-panel border border-[var(--border-color)] p-3 rounded-xl cursor-pointer transition-all w-56 shadow-sm hover:shadow-md"
              >
                <div className="flex items-center space-x-2 mb-1.5">
                  <div className="w-7 h-7 rounded-lg flex items-center justify-center text-white text-[10px] font-bold shrink-0"
                    style={{ backgroundColor: job.companyColor }}>
                    {job.companyLetter}
                  </div>
                  <p className="text-[11px] font-bold text-[var(--text-primary)] truncate">{job.title}</p>
                </div>
                <p className="text-[10px] text-[var(--text-secondary)]">{job.company} · {job.salary}</p>
              </motion.div>
            ))}
          </div>
        </div>
      )}

      {/* Saved Jobs */}
      {!loading && savedJobs.length > 0 && !hasActiveFilters && (
        <div className="space-y-3">
          <h3 className="text-xs font-bold text-[var(--text-secondary)] uppercase tracking-wider flex items-center space-x-1.5">
            <Bookmark className="h-3.5 w-3.5" />
            <span>Saved Jobs</span>
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {savedJobs.slice(0, 4).map((job, i) => (
              <JobCard key={job.id} job={job} index={i} isSaved={true} onToggleSave={toggleSave} onView={viewJobDetail} />
            ))}
          </div>
        </div>
      )}

      {/* Loading skeletons */}
      {loading && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {[...Array(6)].map((_, i) => <SkeletonCard key={i} index={i} />)}
        </div>
      )}

      {/* Job grid */}
      {!loading && jobs.length > 0 && (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {jobs.map((job, i) => (
              <JobCard key={job.id} job={job} index={i} isSaved={isSaved(job.id)} onToggleSave={toggleSave} onView={viewJobDetail} />
            ))}
          </div>

          {/* Load more trigger */}
          <div ref={loadMoreRef} className="flex justify-center py-4">
            {loadingMore && (
              <div className="flex items-center space-x-2 text-sm text-[var(--text-secondary)]">
                <Loader2 className="h-4 w-4 animate-spin" />
                <span>Loading more jobs...</span>
              </div>
            )}
            {!hasMore && jobs.length > 0 && (
              <p className="text-xs text-[var(--text-secondary)]">You've seen all {totalJobs} jobs</p>
            )}
          </div>
        </>
      )}

      {/* Empty state */}
      {!loading && jobs.length === 0 && (
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
          className="glass-panel border border-[var(--border-color)] rounded-2xl p-12 flex flex-col items-center justify-center text-center space-y-4">
          <div className="p-4 bg-pink-500/10 rounded-2xl">
            <Search className="h-8 w-8 text-pink-500" />
          </div>
          <h3 className="text-lg font-bold text-[var(--text-primary)]">No jobs found</h3>
          <p className="text-sm text-[var(--text-secondary)] max-w-sm">
            Try adjusting your search or filters to find what you're looking for.
          </p>
          <button onClick={clearFilters}
            className="px-4 py-2 rounded-xl bg-pink-600 hover:bg-pink-700 text-white text-xs font-bold transition-all shadow-md shadow-pink-600/10">
            Clear Filters
          </button>
        </motion.div>
      )}

      {/* Job detail modal */}
      <JobDetail job={viewJob} isSaved={viewJob ? isSaved(viewJob.id) : false} onToggleSave={toggleSave} onClose={closeJobDetail} />
    </div>
  );
};

export default JobSearch;
