import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, MapPin, Briefcase, Clock, Users, ExternalLink, Bookmark, Building2, IndianRupee } from 'lucide-react';

const JobDetail = ({ job, isSaved, onToggleSave, onClose }) => (
  <AnimatePresence>
    {job && (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4"
        onClick={onClose}
      >
        <motion.div
          initial={{ scale: 0.92, opacity: 0, y: 20 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          exit={{ scale: 0.92, opacity: 0, y: 20 }}
          transition={{ type: 'spring', damping: 25, stiffness: 300 }}
          onClick={(e) => e.stopPropagation()}
          className="glass-panel border border-[var(--border-color)] rounded-2xl w-full max-w-lg max-h-[85vh] flex flex-col shadow-2xl overflow-hidden"
        >
          {/* Header */}
          <div className="p-6 border-b border-[var(--border-color)] space-y-4">
            <div className="flex items-start justify-between">
              <div className="flex items-center space-x-3">
                <div
                  className="w-12 h-12 rounded-xl flex items-center justify-center text-white font-bold text-base shrink-0 shadow-md"
                  style={{ backgroundColor: job.companyColor }}
                >
                  {job.companyLetter}
                </div>
                <div>
                  <h2 className="text-lg font-bold text-[var(--text-primary)]">{job.title}</h2>
                  <p className="text-sm text-[var(--text-secondary)]">{job.company}</p>
                </div>
              </div>
              <button onClick={onClose} className="p-2 rounded-xl hover:bg-[var(--bg-secondary)] text-[var(--text-secondary)] transition-colors">
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="flex flex-wrap gap-2">
              {job.tags.map(tag => (
                <span key={tag} className="text-[10px] font-semibold px-2.5 py-1 rounded-full bg-pink-500/10 text-pink-500">
                  {tag}
                </span>
              ))}
              {job.isRemote && (
                <span className="text-[10px] font-semibold px-2.5 py-1 rounded-full bg-green-500/10 text-green-500">
                  Remote
                </span>
              )}
            </div>
          </div>

          {/* Body */}
          <div className="p-6 space-y-5 overflow-y-auto flex-1">
            <div className="grid grid-cols-2 gap-4">
              {[
                { icon: Building2, label: 'Company', value: job.company },
                { icon: MapPin, label: 'Location', value: job.location },
                { icon: Briefcase, label: 'Experience', value: job.experience },
                { icon: IndianRupee, label: 'Salary', value: job.salary },
                { icon: Clock, label: 'Posted', value: `${job.posted} days ago` },
                { icon: Users, label: 'Applicants', value: `${job.applicants} people` },
              ].map(({ icon: Icon, label, value }) => (
                <div key={label} className="flex items-center space-x-2.5">
                  <div className="p-1.5 rounded-lg bg-pink-500/10">
                    <Icon className="h-3.5 w-3.5 text-pink-500" />
                  </div>
                  <div>
                    <p className="text-[10px] text-[var(--text-secondary)]">{label}</p>
                    <p className="text-xs font-semibold text-[var(--text-primary)]">{value}</p>
                  </div>
                </div>
              ))}
            </div>

            <div className="space-y-2">
              <h4 className="text-xs font-bold text-[var(--text-primary)] uppercase tracking-wider">About the Role</h4>
              <p className="text-xs text-[var(--text-secondary)] leading-relaxed">
                We are looking for a talented {job.title} to join our team at {job.company}.
                This is a {job.experience} level role based in {job.location}{job.isRemote ? ' with remote flexibility' : ''}.
                The ideal candidate will have strong experience with {job.tags.join(', ')}.
              </p>
            </div>

            <div className="space-y-2">
              <h4 className="text-xs font-bold text-[var(--text-primary)] uppercase tracking-wider">Requirements</h4>
              <ul className="space-y-1.5 text-xs text-[var(--text-secondary)]">
                {job.tags.map(tag => (
                  <li key={tag} className="flex items-start">
                    <span className="text-pink-500 mr-2">•</span>
                    <span>Strong proficiency in {tag}</span>
                  </li>
                ))}
                <li className="flex items-start">
                  <span className="text-pink-500 mr-2">•</span>
                  <span>{job.experience} of relevant professional experience</span>
                </li>
                <li className="flex items-start">
                  <span className="text-pink-500 mr-2">•</span>
                  <span>Strong communication and teamwork skills</span>
                </li>
              </ul>
            </div>
          </div>

          {/* Footer */}
          <div className="p-6 border-t border-[var(--border-color)] flex space-x-3">
            <button
              onClick={() => onToggleSave(job)}
              className={`flex-1 py-2.5 rounded-xl font-bold text-sm flex items-center justify-center space-x-2 transition-all border ${
                isSaved
                  ? 'bg-pink-500/10 border-pink-500/30 text-pink-500'
                  : 'bg-[var(--muted-bg)] border-[var(--border-color)] text-[var(--text-secondary)] hover:bg-[var(--bg-secondary)]'
              }`}
            >
              <Bookmark className="h-4 w-4" fill={isSaved ? 'currentColor' : 'none'} />
              <span>{isSaved ? 'Saved' : 'Save'}</span>
            </button>
            <button className="flex-1 py-2.5 rounded-xl bg-pink-600 hover:bg-pink-700 text-white font-bold text-sm flex items-center justify-center space-x-2 transition-all shadow-md shadow-pink-600/10">
              <ExternalLink className="h-4 w-4" />
              <span>Apply Now</span>
            </button>
          </div>
        </motion.div>
      </motion.div>
    )}
  </AnimatePresence>
);

export default JobDetail;
