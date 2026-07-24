import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { BarChart, CheckCircle, X, AlertCircle } from 'lucide-react';
import Dropzone from '../../components/Dropzone';
import Loader from '../../components/Loader';

const AtsAudit = () => {
  const [loading, setLoading] = useState(false);
  const [loadingMessage, setLoadingMessage] = useState('');
  const [atsFile, setAtsFile] = useState(null);
  const [jobDescription, setJobDescription] = useState('');
  const [atsResult, setAtsResult] = useState(null);

  const runAtsChecker = async () => {
    if (!atsFile) return;
    setLoading(true);
    setLoadingMessage('Parsing document text and auditing ATS match metrics...');
    try {
      const fd = new FormData();
      fd.append('file', atsFile);
      fd.append('jobDescription', jobDescription);
      const response = await fetch('/api/career/ats/check', { method: 'POST', body: fd });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || 'ATS analysis failed.');
      setAtsResult(data);
    } catch (e) {
      alert(e.message || 'Error during ATS analysis.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto space-y-6 no-print">
      {loading && <Loader message={loadingMessage} />}

      <div className="glass-panel p-6 rounded-2xl space-y-4 text-left">
        <h3 className="text-lg font-bold flex items-center text-indigo-400">
          <BarChart className="h-5.5 w-5.5 mr-2" /> ATS Resume Optimization
        </h3>
        <p className="text-sm text-neutral-400">
          Upload your resume in PDF/DOCX format, paste the Target Job Description, and audit compatibility metrics.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-2">
          <div className="space-y-2">
            <label className="text-xs font-bold text-neutral-400 block">Upload Document</label>
            <Dropzone
              onFilesSelected={setAtsFile}
              accept=".pdf,.docx"
              maxSizeMB={8}
              label="Drop PDF or Word resume here"
              value={atsFile}
              onClear={() => setAtsFile(null)}
            />
          </div>
          <div className="flex flex-col space-y-2">
            <label className="text-xs font-bold text-neutral-400 block">Target Job Description (Optional)</label>
            <textarea
              value={jobDescription}
              onChange={(e) => setJobDescription(e.target.value)}
              placeholder="Paste the target job description here to check keyword alignment..."
              className="w-full flex-grow p-3 rounded-xl border border-neutral-300 dark:border-neutral-700 bg-transparent text-sm focus:outline-none focus:ring-1 focus:ring-indigo-500 min-h-[150px]"
            />
          </div>
        </div>

        <button
          onClick={runAtsChecker}
          disabled={!atsFile}
          className="w-full py-3 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-xl text-sm transition-all disabled:opacity-50 shadow-md shadow-indigo-600/10"
        >
          Analyze Resume Fitness
        </button>
      </div>

      {atsResult && (
        <motion.div initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }}
          className="glass-panel p-6 rounded-2xl text-left space-y-6 border border-indigo-500/15">

          <div className="flex flex-col md:flex-row justify-between items-center bg-indigo-500/5 dark:bg-indigo-950/10 p-6 rounded-2xl border border-indigo-500/10 space-y-4 md:space-y-0">
            <div className="flex items-center space-x-4">
              <div className="relative flex items-center justify-center h-20 w-20">
                <svg className="h-20 w-20 transform -rotate-90">
                  <circle cx="40" cy="40" r="34" className="stroke-neutral-200 dark:stroke-neutral-800 fill-none" strokeWidth="6" />
                  <circle cx="40" cy="40" r="34" className="stroke-indigo-500 fill-none" strokeWidth="6"
                    strokeDasharray={2 * Math.PI * 34}
                    strokeDashoffset={2 * Math.PI * 34 * (1 - atsResult.atsScore / 100)}
                    strokeLinecap="round" />
                </svg>
                <span className="absolute text-xl font-black text-neutral-800 dark:text-neutral-100">{atsResult.atsScore}%</span>
              </div>
              <div>
                <h4 className="text-lg font-bold text-neutral-800 dark:text-neutral-100">Overall ATS Score</h4>
                <p className="text-xs text-neutral-500 dark:text-neutral-400">Higher scores signify cleaner formatting and high keyword matches.</p>
              </div>
            </div>
            <div className="grid grid-cols-3 gap-6 text-center">
              <div>
                <p className="text-xs text-neutral-500 dark:text-neutral-400">Keyword Match</p>
                <p className="text-lg font-black text-indigo-500">{atsResult.keywordMatchScore}%</p>
              </div>
              <div>
                <p className="text-xs text-neutral-500 dark:text-neutral-400">Formatting</p>
                <p className="text-lg font-black text-purple-500">{atsResult.formattingQuality}</p>
              </div>
              <div>
                <p className="text-xs text-neutral-500 dark:text-neutral-400">Skills Fit</p>
                <p className="text-lg font-black text-pink-500">{atsResult.skillsMatch}%</p>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="p-4 rounded-xl bg-red-500/5 border border-red-500/10 space-y-2">
              <h4 className="text-sm font-bold text-red-500 flex items-center">
                <X className="h-4 w-4 mr-1.5" /> Missing Keywords
              </h4>
              <p className="text-xs text-neutral-400">Incorporate these keywords to improve ranking filters:</p>
              <div className="flex flex-wrap gap-1.5 pt-1">
                {atsResult.missingKeywords.map((kw, i) => (
                  <span key={i} className="text-[10px] bg-red-500/10 text-red-500 dark:text-red-400 px-2 py-0.5 rounded-full font-medium">{kw}</span>
                ))}
              </div>
            </div>
            <div className="p-4 rounded-xl bg-orange-500/5 border border-orange-500/10 space-y-2">
              <h4 className="text-sm font-bold text-orange-500 flex items-center">
                <AlertCircle className="h-4 w-4 mr-1.5" /> Missing Key Skills
              </h4>
              <p className="text-xs text-neutral-400">Add these technical or methodology skills:</p>
              <div className="flex flex-wrap gap-1.5 pt-1">
                {atsResult.missingSkills.map((sk, i) => (
                  <span key={i} className="text-[10px] bg-orange-500/10 text-orange-500 dark:text-orange-400 px-2 py-0.5 rounded-full font-medium">{sk}</span>
                ))}
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <div className="p-4 rounded-xl bg-neutral-50/50 dark:bg-white/5 border border-neutral-200 dark:border-white/5">
              <h4 className="text-sm font-bold text-neutral-700 dark:text-neutral-300">Section Analysis</h4>
              <div className="grid grid-cols-2 sm:grid-cols-5 gap-3 mt-3 text-center">
                {Object.entries(atsResult.sectionCompleteness).map(([sec, present], i) => (
                  <div key={i} className="p-2 rounded bg-neutral-100 dark:bg-neutral-800 text-[10px] font-semibold space-y-1">
                    <span className="capitalize block text-neutral-400">{sec.replace(/([A-Z])/g, ' $1')}</span>
                    {present ? (
                      <span className="text-green-500 flex items-center justify-center"><CheckCircle className="h-3.5 w-3.5 mr-1" /> Found</span>
                    ) : (
                      <span className="text-red-400 flex items-center justify-center"><X className="h-3.5 w-3.5 mr-1" /> Missing</span>
                    )}
                  </div>
                ))}
              </div>
            </div>
            <div className="space-y-2">
              <h4 className="text-sm font-bold text-neutral-800 dark:text-neutral-200">Improvement Guidelines</h4>
              <ul className="space-y-1.5 text-xs text-neutral-500 dark:text-neutral-400">
                {atsResult.recommendations.map((rec, i) => (
                  <li key={i} className="flex items-start">
                    <span className="text-indigo-500 mr-2">•</span>
                    <span>{rec}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </motion.div>
      )}
    </div>
  );
};

export default AtsAudit;
