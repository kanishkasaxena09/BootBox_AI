import React, { useState, useEffect, useCallback } from 'react';
import Layout from './components/Layout';
import LandingOverlay from './features/landing/LandingOverlay';
import ToolsHub from './features/tools/ToolsHub';
import AdminDashboard from './features/admin/AdminDashboard';
import FeedbackPage from './features/feedback/FeedbackPage';
import Dashboard from './features/dashboard/Dashboard';
import { SolDatabase, SkillsDevelopment } from './features/soldatabase/Placeholders';
import AboutUs from './features/about/AboutUs';
import { AnimatePresence, motion } from 'framer-motion';
import { ToastProvider } from './components/shared/providers/ToastProvider';

function App() {
  const [currentView, setCurrentView] = useState(() => {
    return window.history.state?.view || window.location.hash.replace('#', '') || 'landing';
  });

  useEffect(() => {
    let sessionId = localStorage.getItem('sessionId');
    if (!sessionId) {
      sessionId = 'sess-' + Math.random().toString(36).substring(2, 15) + '-' + Date.now();
      localStorage.setItem('sessionId', sessionId);
    }
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
  }, []);

  // Sync with browser back/forward
  useEffect(() => {
    const onPopState = () => {
      const stateView = window.history.state?.view || 'landing';
      setCurrentView(stateView);
    };
    window.addEventListener('popstate', onPopState);
    return () => window.removeEventListener('popstate', onPopState);
  }, []);

  const navigateTo = useCallback((view) => {
    window.history.pushState({ view }, '', `#${view}`);
    setCurrentView(view);
  }, []);

  const handleOpenAdmin = () => navigateTo('admin');
  const handleAdminLogout = () => {
    localStorage.removeItem('adminToken');
    navigateTo('landing');
  };

  const handleNavigate = (moduleId) => navigateTo(moduleId);

  const renderView = () => {
    switch (currentView) {
      case 'landing':
        return <LandingOverlay onNavigate={handleNavigate} />;
      case 'tools':
        return <ToolsHub onNavigate={handleNavigate} />;
      case 'sol-database':
        return <SolDatabase />;
      case 'skills':
        return <SkillsDevelopment />;
      case 'journey':
        return <AboutUs />;
      case 'feedback':
        return <FeedbackPage />;
      case 'dashboard':
        return <Dashboard onNavigate={handleNavigate} />;
      case 'admin':
        return <AdminDashboard onLogout={handleAdminLogout} />;
      default:
        return <LandingOverlay onNavigate={handleNavigate} />;
    }
  };

  return (
    <ToastProvider>
      <Layout currentView={currentView} onNavigate={handleNavigate} onOpenAdmin={handleOpenAdmin}>
        <AnimatePresence mode="wait">
          <motion.div
            key={currentView}
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -15 }}
            transition={{ duration: 0.25 }}
          >
            {renderView()}
          </motion.div>
        </AnimatePresence>
      </Layout>
    </ToastProvider>
  );
}

export default App;
