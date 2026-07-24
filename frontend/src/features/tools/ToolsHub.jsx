import React, { useState, useEffect, useCallback, Suspense } from 'react';
import { Briefcase, GraduationCap, FileText } from 'lucide-react';
import { motion } from 'framer-motion';
import { ToolSkeleton } from '../../components/shared';

const PdfSuite = React.lazy(() => import('../pdf/PdfSuite'));
const JobProfessionalRoles = React.lazy(() => import('./JobProfessionalRoles'));
const AcademicProductivity = React.lazy(() => import('./AcademicProductivity'));

const toolCategories = [
  { id: 'job', name: 'Job & Professional Roles', icon: Briefcase, desc: 'Resumes, ATS audit, interview prep & career guidance' },
  { id: 'academic', name: 'Academic & Productivity', icon: GraduationCap, desc: 'CGPA calculators, compressors, study planners & more' },
  { id: 'pdf', name: 'PDF Tools Suite', icon: FileText, desc: '16 PDF manipulation & conversion tools' },
];

const categoryComponentMap = {
  job: JobProfessionalRoles,
  academic: AcademicProductivity,
  pdf: PdfSuite,
};

const ToolsHub = () => {
  const [path, setPath] = useState(() => {
    return window.history.state?.toolsPath || [];
  });

  useEffect(() => {
    const onPop = () => {
      setPath(window.history.state?.toolsPath || []);
    };
    window.addEventListener('popstate', onPop);
    return () => window.removeEventListener('popstate', onPop);
  }, []);

  const navigateDeeper = useCallback((id) => {
    const next = [...path, id];
    window.history.pushState({ view: 'tools', toolsPath: next }, '', '#tools');
    setPath(next);
  }, [path]);

  const currentId = path[0] || null;
  const ToolComponent = currentId ? categoryComponentMap[currentId] : null;

  return (
    <div className="space-y-6 text-left">
      {path.length === 0 && (
        <>
          <div className="text-center md:text-left space-y-2">
            <h2 className="text-2xl font-black bg-gradient-to-r from-pink-500 to-rose-500 bg-clip-text text-transparent">
              Tools
            </h2>
            <p className="text-sm text-[var(--text-secondary)]">
              Professional, academic, and document tools — all in one place.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {toolCategories.map((tool) => {
              const Icon = tool.icon;
              return (
                <motion.div key={tool.id} whileHover={{ y: -4 }}
                  onClick={() => navigateDeeper(tool.id)}
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
        </>
      )}

      {ToolComponent && (
        <Suspense fallback={<ToolSkeleton />}>
          <ToolComponent path={path} onNavigate={navigateDeeper} />
        </Suspense>
      )}
    </div>
  );
};

export default ToolsHub;
