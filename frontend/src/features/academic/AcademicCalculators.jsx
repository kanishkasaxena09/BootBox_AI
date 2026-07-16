import React, { useState, useEffect } from 'react';
import { Calculator, Award, Plus, Trash, Info } from 'lucide-react';
import { motion } from 'framer-motion';

const AcademicCalculators = () => {
  const [activeSubTab, setActiveSubTab] = useState('cgpa'); // 'cgpa' or 'sgpa'
  const [multiplier, setMultiplier] = useState(9.5);

  // --- CGPA to Percentage state ---
  const [cgpa, setCgpa] = useState('');
  const [percentage, setPercentage] = useState('');

  // --- SGPA to CGPA Estimator state ---
  const [semesters, setSemesters] = useState([
    { id: 1, sgpa: '' },
    { id: 2, sgpa: '' }
  ]);
  const [estCgpa, setEstCgpa] = useState(0);
  const [estPercentage, setEstPercentage] = useState(0);

  // Fetch the active admin conversion formula multiplier on load
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

  // Real-time CGPA conversion
  useEffect(() => {
    const parsed = parseFloat(cgpa);
    if (!isNaN(parsed) && parsed >= 0 && parsed <= 10) {
      setPercentage((parsed * multiplier).toFixed(2));
    } else {
      setPercentage('');
    }
  }, [cgpa, multiplier]);

  // Real-time SGPA estimation
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
      // Re-index IDs
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

  return (
    <div className="max-w-2xl mx-auto space-y-6 text-left">
      
      {/* Sub Tabs */}
      <div className="flex border-b border-neutral-200 dark:border-white/5 pb-1">
        <button
          onClick={() => setActiveSubTab('cgpa')}
          className={`px-4 py-2 font-bold text-sm border-b-2 transition-all ${
            activeSubTab === 'cgpa'
              ? 'border-indigo-500 text-indigo-500'
              : 'border-transparent text-neutral-400 hover:text-neutral-200'
          }`}
        >
          CGPA to Percentage Converter
        </button>
        <button
          onClick={() => setActiveSubTab('sgpa')}
          className={`px-4 py-2 font-bold text-sm border-b-2 transition-all ${
            activeSubTab === 'sgpa'
              ? 'border-indigo-500 text-indigo-500'
              : 'border-transparent text-neutral-400 hover:text-neutral-200'
          }`}
        >
          SGPA to CGPA Estimator
        </button>
      </div>

      {/* Info message */}
      <div className="flex items-center space-x-2 p-3 rounded-xl bg-indigo-500/5 border border-indigo-500/10 text-neutral-500 text-xs">
        <Info className="h-4 w-4 text-indigo-500 flex-shrink-0" />
        <span>
          Dynamic calculation loaded. Current formula multiplier is: **CGPA × {multiplier}**. Configured dynamic multiplier from admin dashboard.
        </span>
      </div>

      {/* --- SUBTAB 1: CGPA TO PERCENTAGE --- */}
      {activeSubTab === 'cgpa' && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="glass-panel p-6 rounded-2xl space-y-4"
        >
          <div className="flex items-center space-x-2">
            <Calculator className="h-5 w-5 text-indigo-500" />
            <h3 className="text-md font-bold text-neutral-800 dark:text-neutral-200">CGPA to Percentage</h3>
          </div>

          <div className="space-y-4">
            <div>
              <label className="text-xs font-bold text-neutral-400 block mb-1">Enter CGPA (Scale of 10)</label>
              <input
                type="number"
                min="0"
                max="10"
                step="0.01"
                placeholder="e.g. 8.5"
                value={cgpa}
                onChange={(e) => setCgpa(e.target.value)}
                className="w-full px-4 py-2.5 rounded-xl border border-neutral-300 dark:border-neutral-700 bg-transparent text-sm focus:outline-none focus:ring-1 focus:ring-indigo-500"
              />
            </div>

            {percentage && (
              <motion.div
                initial={{ scale: 0.95, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                className="p-5 rounded-xl bg-indigo-500/5 border border-indigo-500/15 text-center space-y-1"
              >
                <p className="text-xs text-neutral-400">Equivalent Percentage</p>
                <p className="text-3xl font-black text-indigo-500">{percentage}%</p>
                <p className="text-[10px] text-neutral-500 italic mt-1">
                  Formula: {cgpa} × {multiplier} = {percentage}%
                </p>
              </motion.div>
            )}
          </div>
        </motion.div>
      )}

      {/* --- SUBTAB 2: SGPA TO CGPA ESTIMATOR --- */}
      {activeSubTab === 'sgpa' && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="glass-panel p-6 rounded-2xl space-y-6"
        >
          <div className="flex justify-between items-center">
            <div className="flex items-center space-x-2">
              <Award className="h-5 w-5 text-indigo-500" />
              <h3 className="text-md font-bold text-neutral-800 dark:text-neutral-200">SGPA to CGPA Estimator</h3>
            </div>
            <button
              onClick={addSemester}
              className="text-xs text-indigo-500 hover:text-indigo-400 font-bold flex items-center space-x-1 border border-indigo-500/10 px-3 py-1.5 rounded-lg bg-indigo-500/5"
            >
              <Plus className="h-3.5 w-3.5" /> <span>Add Semester</span>
            </button>
          </div>

          <div className="grid grid-cols-2 gap-4 max-h-[300px] overflow-y-auto pr-2">
            {semesters.map((sem, idx) => (
              <div key={sem.id} className="flex items-center space-x-2 p-3 rounded-xl bg-neutral-50/50 dark:bg-white/5 border border-neutral-200 dark:border-white/5">
                <span className="text-xs font-bold text-neutral-400 w-16">Sem {sem.id}</span>
                <input
                  type="number"
                  min="0"
                  max="10"
                  step="0.01"
                  placeholder="SGPA"
                  value={sem.sgpa}
                  onChange={(e) => handleSgpaChange(idx, e.target.value)}
                  className="w-full px-3 py-1.5 rounded border border-neutral-300 dark:border-neutral-700 bg-transparent text-xs focus:outline-none"
                />
                {semesters.length > 1 && (
                  <button onClick={() => removeSemester(idx)} className="text-red-400 hover:text-red-300">
                    <Trash className="h-4 w-4" />
                  </button>
                )}
              </div>
            ))}
          </div>

          {estCgpa > 0 && (
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="grid grid-cols-2 gap-4 bg-indigo-500/5 border border-indigo-500/15 p-5 rounded-xl text-center"
            >
              <div className="space-y-0.5">
                <p className="text-xs text-neutral-400">Estimated CGPA</p>
                <p className="text-2xl font-black text-indigo-500">{estCgpa}</p>
              </div>
              <div className="space-y-0.5 border-l border-neutral-200 dark:border-white/5">
                <p className="text-xs text-neutral-400">Percentage Equivalent</p>
                <p className="text-2xl font-black text-purple-500">{estPercentage}%</p>
              </div>
            </motion.div>
          )}

        </motion.div>
      )}

    </div>
  );
};

export default AcademicCalculators;
