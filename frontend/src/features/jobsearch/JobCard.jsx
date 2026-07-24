import React from 'react';
import { motion } from 'framer-motion';
import { MapPin, Clock, Users, Bookmark, ExternalLink, Briefcase } from 'lucide-react';

const JobCard = ({ job, index, isSaved, onToggleSave, onView }) => (
  <motion.div
    initial={{ opacity: 0, y: 15 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.3, delay: Math.min(index * 0.04, 0.3) }}
    whileHover={{ y: -3 }}
    onClick={() => onView(job)}
    className="card-hover-border glass-panel border border-[var(--border-color)] p-5 rounded-2xl cursor-pointer transition-all flex flex-col space-y-4 shadow-sm"
  >
    <div className="flex items-start justify-between">
      <div className="flex items-center space-x-3">
        <div
          className="w-11 h-11 rounded-xl flex items-center justify-center text-white font-bold text-sm shrink-0 shadow-md"
          style={{ backgroundColor: job.companyColor }}
        >
          {job.companyLetter}
        </div>
        <div className="min-w-0">
          <h3 className="font-bold text-sm text-[var(--text-primary)] leading-snug truncate">{job.title}</h3>
          <p className="text-xs text-[var(--text-secondary)] mt-0.5">{job.company}</p>
        </div>
      </div>
      <button
        onClick={(e) => { e.stopPropagation(); onToggleSave(job); }}
        className={`p-1.5 rounded-lg transition-all shrink-0 ${
          isSaved
            ? 'text-pink-500 bg-pink-500/10'
            : 'text-[var(--text-secondary)] hover:text-pink-500 hover:bg-pink-500/5'
        }`}
        aria-label={isSaved ? 'Unsave job' : 'Save job'}
      >
        <Bookmark className="h-4 w-4" fill={isSaved ? 'currentColor' : 'none'} />
      </button>
    </div>

    <div className="flex flex-wrap gap-1.5">
      {job.tags.map(tag => (
        <span key={tag} className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-pink-500/10 text-pink-500">
          {tag}
        </span>
      ))}
      {job.isRemote && (
        <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-green-500/10 text-green-500">
          Remote
        </span>
      )}
    </div>

    <div className="grid grid-cols-2 gap-2 text-[11px] text-[var(--text-secondary)]">
      <div className="flex items-center space-x-1.5">
        <MapPin className="h-3 w-3 shrink-0" />
        <span className="truncate">{job.location}</span>
      </div>
      <div className="flex items-center space-x-1.5">
        <Briefcase className="h-3 w-3 shrink-0" />
        <span>{job.experience}</span>
      </div>
      <div className="flex items-center space-x-1.5">
        <span className="text-green-500 font-bold">₹</span>
        <span className="font-semibold text-[var(--text-primary)]">{job.salary}</span>
      </div>
      <div className="flex items-center space-x-1.5">
        <Clock className="h-3 w-3 shrink-0" />
        <span>{job.posted}d ago</span>
      </div>
    </div>

    <div className="flex items-center justify-between pt-2 border-t border-[var(--border-color)]">
      <div className="flex items-center space-x-1.5 text-[10px] text-[var(--text-secondary)]">
        <Users className="h-3 w-3" />
        <span>{job.applicants} applicants</span>
      </div>
      <span className="flex items-center space-x-1 text-[10px] font-bold text-pink-500 group-hover:text-pink-600">
        <span>View Details</span>
        <ExternalLink className="h-3 w-3" />
      </span>
    </div>
  </motion.div>
);

export default JobCard;
