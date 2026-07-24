import React from 'react';
import { Calculator } from 'lucide-react';
import { motion } from 'framer-motion';
import AcademicCalculators from '../academic/AcademicCalculators';

const subTools = [
  { id: 'calculator', name: 'Academic Calculator', icon: Calculator, desc: 'CGPA to percentage & SGPA to CGPA estimator', component: AcademicCalculators },
];

const AcademicProductivity = ({ path, onNavigate }) => {
  const subId = path[1] || null;

  if (subId) {
    const tool = subTools.find(t => t.id === subId);
    const ToolComponent = tool.component;
    return <ToolComponent />;
  }

  return (
    <div className="space-y-6">
      <div className="text-center md:text-left space-y-2">
        <h2 className="text-2xl font-black bg-gradient-to-r from-pink-500 to-rose-500 bg-clip-text text-transparent">
          Academic & Productivity
        </h2>
        <p className="text-sm text-[var(--text-secondary)]">
          CGPA calculators, SGPA estimators & academic tools.
        </p>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {subTools.map((tool) => {
          const Icon = tool.icon;
          return (
            <motion.div key={tool.id} whileHover={{ y: -4 }}
              onClick={() => onNavigate(tool.id)}
              className="card-hover-border glass-panel border border-[var(--border-color)] p-6 rounded-2xl cursor-pointer transition-all flex flex-col text-left space-y-3 shadow-sm">
              <div className="p-3 bg-pink-500/10 rounded-xl w-fit">
                <Icon className="h-5 w-5 text-pink-500" />
              </div>
              <div>
                <h3 className="font-bold text-[var(--text-primary)]">{tool.name}</h3>
                <p className="text-xs text-[var(--text-secondary)] mt-1">{tool.desc}</p>
              </div>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
};

export default AcademicProductivity;
