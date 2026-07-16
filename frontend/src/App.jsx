import React, { useState, useEffect } from 'react';
import Layout from './components/Layout';
import CareerToolkit from './features/career/CareerToolkit';
import PdfSuite from './features/pdf/PdfSuite';
import AcademicCalculators from './features/academic/AcademicCalculators';
import Compressors from './features/compression/Compressors';
import FeedbackPage from './features/feedback/FeedbackPage';
import AdminDashboard from './features/admin/AdminDashboard';
import AboutUs from './features/about/AboutUs';
import { Sparkles, FileText, Calculator, FileDown, MessageSquare, Info } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

function App() {
  const [activeTab, setActiveTab] = useState('dashboard'); // dashboard, pdf, calculators, compress, feedback, admin
  const [siteSettings, setSiteSettings] = useState({
    title: 'AI Career & Document Utility Platform',
    tagline: 'Modern tools to supercharge your career development and file optimizations.'
  });

  // Generate session ID and log visitor analytics
  useEffect(() => {
    let sessionId = localStorage.getItem('sessionId');
    if (!sessionId) {
      sessionId = 'sess-' + Math.random().toString(36).substring(2, 15) + '-' + Date.now();
      localStorage.setItem('sessionId', sessionId);
    }

    // Register visitor session on backend
    const registerVisitor = async () => {
      try {
        await fetch('/api/admin/visitor', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ sessionId })
        });
      } catch(e) {
        console.warn('Failed to log visitor analytics.', e.message);
      }
    };
    registerVisitor();

    // Fetch site dynamic content if any
    const fetchSiteSettings = async () => {
      try {
        const res = await fetch('/api/academic/config'); // fetch general config
        const data = await res.json();
        // Since we retrieve configs, admin settings details are synced
      } catch(e) { }
    };
    fetchSiteSettings();
  }, []);

  const handleOpenAdmin = () => {
    setActiveTab('admin');
  };

  const handleAdminLogout = () => {
    localStorage.removeItem('adminToken');
    setActiveTab('dashboard');
  };

  // Nav Items Configuration
  const navItems = [
    { id: 'dashboard', name: 'Career Toolkit', icon: Sparkles, desc: 'AI Resumes & ATS audits' },
    { id: 'pdf', name: 'PDF Suite', icon: FileText, desc: '16 PDF manipulation tools' },
    { id: 'calculators', name: 'Calculators', icon: Calculator, desc: 'CGPA & SGPA estimators' },
    { id: 'compress', name: 'File Compressor', icon: FileDown, desc: 'PDF & image optimization' },
    { id: 'feedback', name: 'Feedback', icon: MessageSquare, desc: 'Rate and review features' },
    { id: 'about', name: 'About Us', icon: Info, desc: 'Platform info & mission' }
  ];

  return (
    <Layout onOpenAdmin={handleOpenAdmin} currentTab={activeTab} onTabChange={setActiveTab}>
      
      {/* Dynamic Landing Info Header (Subtle & Modern, hidden in print mode) */}
      {activeTab !== 'admin' && (
        <div className="text-center space-y-3 mb-10 no-print">
          <motion.h2
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-3xl md:text-5xl font-black tracking-tight"
          >
            <span className="bg-gradient-to-r from-pink-500 via-rose-500 to-pink-600 bg-clip-text text-transparent">
              {siteSettings.title}
            </span>
          </motion.h2>
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.1 }}
            className="text-sm md:text-base text-[var(--text-secondary)] max-w-2xl mx-auto leading-relaxed"
          >
            {siteSettings.tagline}
          </motion.p>
        </div>
      )}

      {/* Main Dashboard Nav Grid (Only shows on home/non-admin views, hidden in print) */}
      {activeTab !== 'admin' && (
        <div className="grid grid-cols-3 md:grid-cols-6 gap-3 mb-10 no-print">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={`p-4 rounded-2xl flex flex-col items-center justify-center text-center space-y-2 border transition-all ${
                  isActive
                    ? 'border-pink-500 bg-pink-500/10 dark:bg-pink-500/15 text-pink-600 dark:text-pink-400 font-bold shadow-lg shadow-pink-500/5'
                    : 'border-[var(--border-color)] bg-[var(--card-bg)]/50 dark:bg-[var(--card-bg)]/30 text-[var(--text-secondary)] hover:text-pink-600 dark:hover:text-pink-400'
                }`}
              >
                <Icon className={`h-6 w-6 ${isActive ? 'scale-110' : ''}`} />
                <span className="text-xs font-bold leading-tight">{item.name}</span>
              </button>
            );
          })}
        </div>
      )}

      {/* Render Active View Tab */}
      <div className="w-full">
        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -15 }}
            transition={{ duration: 0.25 }}
          >
            {activeTab === 'dashboard' && <CareerToolkit />}
            {activeTab === 'pdf' && <PdfSuite />}
            {activeTab === 'calculators' && <AcademicCalculators />}
            {activeTab === 'compress' && <Compressors />}
            {activeTab === 'feedback' && <FeedbackPage />}
            {activeTab === 'about' && <AboutUs />}
            {activeTab === 'admin' && <AdminDashboard onLogout={handleAdminLogout} />}
          </motion.div>
        </AnimatePresence>
      </div>

    </Layout>
  );
}

export default App;