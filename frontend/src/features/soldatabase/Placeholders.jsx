import React from 'react';
import { motion } from 'framer-motion';
import { Construction } from 'lucide-react';

const placeholders = [
  {
    title: 'SOL Database',
    desc: 'All semester organized resources, notes, PPT, assignments, case studies.',
    icon: '📚',
  },
  {
    title: 'Skills & Development',
    desc: 'Skill assessment, learning paths, certifications, and personal development resources.',
    icon: '📈',
  },
  {
    title: 'SOLMATES Journey',
    desc: 'Semester to placement — complete growth timeline of our community.',
    icon: '🛤️',
  },
];

const SolDatabase = () => (
  <div className="max-w-2xl mx-auto py-16 text-center space-y-6">
    <div className="inline-flex items-center justify-center h-16 w-16 bg-pink-500/10 rounded-2xl">
      <Construction className="h-8 w-8 text-pink-500" />
    </div>
    <h2 className="text-2xl font-black bg-gradient-to-r from-pink-500 to-rose-500 bg-clip-text text-transparent">
      Coming Soon
    </h2>
    <p className="text-sm text-[var(--text-secondary)] max-w-md mx-auto">
      This module is under development. Stay tuned for organized semester resources, notes, PPTs, assignments, and case studies.
    </p>
  </div>
);

const SkillsDevelopment = () => (
  <div className="max-w-2xl mx-auto py-16 text-center space-y-6">
    <div className="inline-flex items-center justify-center h-16 w-16 bg-pink-500/10 rounded-2xl">
      <Construction className="h-8 w-8 text-pink-500" />
    </div>
    <h2 className="text-2xl font-black bg-gradient-to-r from-pink-500 to-rose-500 bg-clip-text text-transparent">
      Coming Soon
    </h2>
    <p className="text-sm text-[var(--text-secondary)] max-w-md mx-auto">
      Skill assessments, personalized learning paths, certifications, and personal development resources are on the way.
    </p>
  </div>
);

const SolmatesJourney = () => (
  <div className="max-w-2xl mx-auto py-16 text-center space-y-6">
    <div className="inline-flex items-center justify-center h-16 w-16 bg-pink-500/10 rounded-2xl">
      <Construction className="h-8 w-8 text-pink-500" />
    </div>
    <h2 className="text-2xl font-black bg-gradient-to-r from-pink-500 to-rose-500 bg-clip-text text-transparent">
      Coming Soon
    </h2>
    <p className="text-sm text-[var(--text-secondary)] max-w-md mx-auto">
      The complete SOLMATES community growth timeline — from semester one to placement day.
    </p>
  </div>
);

export { SolDatabase, SkillsDevelopment, SolmatesJourney };
