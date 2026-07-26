import React, { useState, useEffect } from 'react';
import { Calculator, Award, Plus, Trash, Info } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { Tabs, Button } from '../../components/shared';

const fadeUp = { initial: { opacity: 0, y: 20 }, animate: { opacity: 1, y: 0 }, transition: { duration: 0.3 } };

const AcademicCalculators = () => {
  const [activeSubTab, setActiveSubTab] = useState('cgpa');
  const [multiplier, setMultiplier] = useState(9.5);

  const [cgpa, setCgpa] = useState('');
  const [percentage, setPercentage] = useState('');

  const [semesters, setSemesters] = useState([
    { id: 1, sgpa: '' },
    { id: 2, sgpa: '' }
  ]);
  const [estCgpa, setEstCgpa] = useState(0);
  const [estPercentage, setEstPercentage] = useState(0);

  useEffect(() => {
    const fetchConfig = async () => {
      try {
        const response = await fetch('/api/academic/config');
        const data = await response.json();
        if (response.ok && data.cgpaFormulaMultiplier) {
          setMultiplier(parseFloat(data.cgpaFormulaMultiplier));
        }
      } catch (err) {
        console.warn('Failed to load dynamic CGPA configuration, using standard default 9.5:', err.message);
      }
    };
    fetchConfig();
  }, []);

  useEffect(() => {
    const parsed = parseFloat(cgpa);
    if (!isNaN(parsed) && parsed >= 0 && parsed <= 10) {
      setPercentage((parsed * multiplier).toFixed(2));
    } else {
      setPercentage('');
    }
  }, [cgpa, multiplier]);

  useEffect(() => {
    let sum = 0;
    let count = 0;
    semesters.forEach(s => {
      const parsed = parseFloat(s.sgpa);
      if (!isNaN(parsed) && parsed >= 0 && parsed <= 10) {
        sum += parsed;
        count++;
      }
    });

    if (count > 0) {
      const computedCgpa = sum / count;
      setEstCgpa(computedCgpa.toFixed(2));
      setEstPercentage((computedCgpa * multiplier).toFixed(2));
    } else {
      setEstCgpa(0);
      setEstPercentage(0);
    }
  }, [semesters, multiplier]);

  const addSemester = () => {
    setSemesters(prev => [
      ...prev,
      { id: prev.length + 1, sgpa: '' }
    ]);
  };

  const removeSemester = (idx) => {
    if (semesters.length <= 1) return;
    setSemesters(prev => {
      const copy = [...prev];
      copy.splice(idx, 1);
      return copy.map((item, index) => ({ ...item, id: index + 1 }));
    });
  };

  const handleSgpaChange = (idx, val) => {
    setSemesters(prev => {
      const copy = [...prev];
      copy[idx].sgpa = val;
      return copy;
    });
  };

  const tabs = [
    { id: 'cgpa', label: 'CGPA → %', icon: Calculator },
    { id: 'sgpa', label: 'SGPA → CGPA', icon: Award },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="text-center space-y-2">
        <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-gradient-to-br from-indigo-500/20 to-violet-500/20 border border-indigo-500/30">
          <Calculator className="w-7 h-7 text-indigo-400" />
        </div>
        <h1 className="text-2xl sm:text-3xl font-black bg-gradient-to-r from-indigo-400 via-violet-400 to-purple-400 bg-clip-text text-transparent">
          Academic Calculator
        </h1>
        <p className="text-sm text-[var(--text-secondary)] max-w-md mx-auto">
          Convert CGPA to percentage or estimate CGPA from SGPA.
        </p>
      </div>

      <Tabs tabs={tabs} active={activeSubTab} onChange={setActiveSubTab} />

      <div className="glass-panel rounded-xl p-3 border border-[var(--border)] flex items-center gap-2 text-[11px] text-[var(--text-secondary)]">
        <Info className="w-3.5 h-3.5 text-indigo-400 flex-shrink-0" />
        <span className="min-w-0 break-words">Formula multiplier: <strong className="text-[var(--text-primary)]">CGPA × {multiplier}</strong> (configurable from admin dashboard)</span>
      </div>

      <AnimatePresence mode="wait">
        {activeSubTab === 'cgpa' && (
          <motion.div key="cgpa" {...fadeUp}
            className="grid grid-cols-1 lg:grid-cols-5 gap-6">

            {/* Left: Input Panel */}
            <div className="lg:col-span-2 space-y-4">
              <div className="glass-panel rounded-2xl p-5 space-y-5 border border-[var(--border)]">
                <div className="flex items-center gap-2">
                  <div className="w-6 h-6 rounded-md flex items-center justify-center bg-indigo-500/20">
                    <Calculator className="w-3.5 h-3.5 text-indigo-400" />
                  </div>
                  <p className="text-xs font-black uppercase tracking-wider text-indigo-400">CGPA Input</p>
                </div>
                <div className="space-y-1.5">
                  <label className="text-xs font-bold uppercase tracking-wider text-[var(--text-secondary)]">Enter CGPA (Scale of 10)</label>
                  <input type="number" min="0" max="10" step="0.01" placeholder="e.g. 8.5" value={cgpa}
                    onChange={(e) => setCgpa(e.target.value)}
                    className="w-full px-4 py-2.5 rounded-xl text-sm font-medium outline-none
                      bg-[var(--bg-secondary)] border border-[var(--border)] text-[var(--text-primary)]
                      hover:border-[var(--accent)] focus:border-[var(--accent)] focus:ring-2 focus:ring-[var(--accent)]/20 transition-all" />
                </div>
              </div>
            </div>

            {/* Right: Result Panel */}
            <div className="lg:col-span-3 space-y-4">
              <AnimatePresence mode="wait">
                {!percentage ? (
                  <motion.div key="empty" {...fadeUp}
                    className="glass-panel rounded-2xl p-12 border border-[var(--border)] text-center">
                    <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-indigo-500/10 mb-4">
                      <Calculator className="w-8 h-8 text-indigo-400/50" />
                    </div>
                    <p className="text-sm font-bold text-[var(--text-secondary)]">
                      Enter your CGPA to see the equivalent percentage.
                    </p>
                  </motion.div>
                ) : (
                  <motion.div key="result" {...fadeUp} className="space-y-4">
                    <div className="glass-panel rounded-2xl p-5 border border-indigo-500/30 bg-gradient-to-br from-indigo-500/5 to-violet-500/5">
                      <h3 className="text-sm font-black uppercase tracking-wider text-indigo-400 mb-4 flex items-center gap-2">
                        <Calculator className="w-4 h-4" /> Conversion Result
                      </h3>
                      <div className="space-y-3">
                        <div className="flex justify-between items-center p-3 rounded-xl bg-[var(--bg-secondary)] border border-[var(--border)]">
                          <span className="text-xs font-bold text-[var(--text-secondary)]">CGPA</span>
                          <span className="text-lg font-black text-[var(--text-primary)]">{cgpa}</span>
                        </div>
                        <div className="flex justify-between items-center p-3 rounded-xl bg-[var(--bg-secondary)] border border-[var(--border)]">
                          <span className="text-xs font-bold text-[var(--text-secondary)]">Multiplier</span>
                          <span className="text-lg font-black text-violet-400">{multiplier}</span>
                        </div>
                        <div className="w-full h-px bg-indigo-500/30 my-1" />
                        <div className="flex justify-between items-center p-3 rounded-xl bg-indigo-500/10 border border-indigo-500/20">
                          <span className="text-sm font-black text-indigo-400">Percentage</span>
                          <span className="text-2xl font-black text-indigo-400">{percentage}%</span>
                        </div>
                        <p className="text-[10px] text-[var(--text-secondary)] italic text-center">
                          Formula: {cgpa} × {multiplier} = {percentage}%
                        </p>
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </motion.div>
        )}

        {activeSubTab === 'sgpa' && (
          <motion.div key="sgpa" {...fadeUp}
            className="grid grid-cols-1 lg:grid-cols-5 gap-6">

            {/* Left: Semester Inputs */}
            <div className="lg:col-span-2 space-y-4">
              <div className="glass-panel rounded-2xl p-5 space-y-5 border border-[var(--border)]">
                <div className="flex flex-wrap justify-between items-center gap-2">
                  <div className="flex items-center gap-2">
                    <div className="w-6 h-6 rounded-md flex items-center justify-center bg-violet-500/20">
                      <Award className="w-3.5 h-3.5 text-violet-400" />
                    </div>
                    <p className="text-xs font-black uppercase tracking-wider text-violet-400">Semester SGPA</p>
                  </div>
                  <Button variant="accent" size="sm" icon={Plus} onClick={addSemester}>Add</Button>
                </div>

                <div className="space-y-2 max-h-[300px] overflow-y-auto pr-1">
                  {semesters.map((sem, idx) => (
                    <div key={sem.id} className="flex items-center gap-2 p-3 rounded-xl bg-[var(--bg-secondary)] border border-[var(--border)]">
                      <span className="text-[10px] font-bold text-[var(--text-secondary)] w-14">Sem {sem.id}</span>
                      <input type="number" min="0" max="10" step="0.01" placeholder="SGPA" value={sem.sgpa}
                        onChange={(e) => handleSgpaChange(idx, e.target.value)}
                        className="w-full px-3 py-1.5 rounded-lg border border-[var(--border)] bg-transparent text-xs font-bold text-[var(--text-primary)] focus:outline-none focus:border-[var(--accent)] transition-all" />
                      {semesters.length > 1 && (
                        <button onClick={() => removeSemester(idx)}
                          className="p-1.5 rounded-lg hover:bg-red-500/10 text-[var(--text-secondary)] hover:text-red-500 transition-all">
                          <Trash className="w-3.5 h-3.5" />
                        </button>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Right: Results */}
            <div className="lg:col-span-3 space-y-4">
              <AnimatePresence mode="wait">
                {estCgpa > 0 ? (
                  <motion.div key="results" {...fadeUp} className="space-y-4">
                    <div className="glass-panel rounded-2xl p-5 border border-violet-500/30 bg-gradient-to-br from-violet-500/5 to-purple-500/5">
                      <h3 className="text-sm font-black uppercase tracking-wider text-violet-400 mb-4 flex items-center gap-2">
                        <Award className="w-4 h-4" /> Estimated Results
                      </h3>
                      <div className="space-y-3">
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                          <div className="flex justify-between items-center p-3 rounded-xl bg-[var(--bg-secondary)] border border-[var(--border)]">
                            <span className="text-xs font-bold text-[var(--text-secondary)]">Semesters</span>
                            <span className="text-lg font-black text-[var(--text-primary)]">{semesters.length}</span>
                          </div>
                          <div className="flex justify-between items-center p-3 rounded-xl bg-[var(--bg-secondary)] border border-[var(--border)]">
                            <span className="text-xs font-bold text-[var(--text-secondary)]">Multiplier</span>
                            <span className="text-lg font-black text-violet-400">{multiplier}</span>
                          </div>
                        </div>
                        <div className="w-full h-px bg-violet-500/30 my-1" />
                        <div className="flex justify-between items-center p-3 rounded-xl bg-violet-500/10 border border-violet-500/20">
                          <span className="text-sm font-black text-violet-400">Estimated CGPA</span>
                          <span className="text-2xl font-black text-violet-400">{estCgpa}</span>
                        </div>
                        <div className="flex justify-between items-center p-3 rounded-xl bg-indigo-500/10 border border-indigo-500/20">
                          <span className="text-sm font-black text-indigo-400">Equivalent Percentage</span>
                          <span className="text-2xl font-black text-indigo-400">{estPercentage}%</span>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                ) : (
                  <motion.div key="empty" {...fadeUp}
                    className="glass-panel rounded-2xl p-12 border border-[var(--border)] text-center">
                    <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-violet-500/10 mb-4">
                      <Award className="w-8 h-8 text-violet-400/50" />
                    </div>
                    <p className="text-sm font-bold text-[var(--text-secondary)]">
                      Add semester SGPAs to see your estimated CGPA and percentage.
                    </p>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default AcademicCalculators;
