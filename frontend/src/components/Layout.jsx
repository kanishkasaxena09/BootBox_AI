import React, { useState, useRef, useEffect } from 'react';
import { Sun, Moon, ShieldAlert, Key, ArrowLeft, Bell, Menu, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useTheme } from '../context/ThemeContext';

const navLinks = [
  { id: 'sol-database', label: 'Database' },
  { id: 'tools', label: 'Tools' },
  { id: 'skills', label: 'Skills & Development' },
  { id: 'journey', label: 'Journey' },
  { id: 'feedback', label: 'Feedback' },
];

const Layout = ({ children, currentView, onNavigate, onOpenAdmin }) => {
  const { isDark, toggleTheme } = useTheme();
  const [showPrompt, setShowPrompt] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [adminPassword, setAdminPassword] = useState('');
  const [promptError, setPromptError] = useState('');

  const longPressTimer = useRef(null);
  const isPressing = useRef(false);

  useEffect(() => {
    const onKey = (e) => {
      if (e.ctrlKey && e.shiftKey && e.key === 'A') {
        e.preventDefault();
        setShowPrompt(true);
        setPromptError('');
        setAdminPassword('');
      }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, []);

  const isLanding = currentView === 'landing';

  const startPress = () => {
    isPressing.current = true;
    longPressTimer.current = setTimeout(() => {
      if (isPressing.current) {
        setShowPrompt(true);
        setPromptError('');
        setAdminPassword('');
        isPressing.current = false;
      }
    }, 1500);
  };

  const endPress = () => {
    isPressing.current = false;
    if (longPressTimer.current) clearTimeout(longPressTimer.current);
  };

  const cancelPress = () => {
    isPressing.current = false;
    if (longPressTimer.current) clearTimeout(longPressTimer.current);
  };

  const handleAdminSubmit = async (e) => {
    e.preventDefault();
    setPromptError('');
    try {
      const response = await fetch('/api/admin/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ password: adminPassword })
      });
      let data;
      try {
        data = await response.json();
      } catch {
        throw new Error('Server unavailable. Make sure the backend is running on port 5000.');
      }
      if (!response.ok) throw new Error(data.error || 'Authentication failed.');
      localStorage.setItem('adminToken', data.token);
      setShowPrompt(false);
      onOpenAdmin();
    } catch (err) {
      setPromptError(err.message || 'Incorrect password.');
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-transparent text-[var(--text-primary)]">

      {/* Navbar */}
      <header className="sticky top-0 z-40 w-full glass-panel border-b border-[var(--border-color)] relative">
          <div className="max-w-7xl mx-auto px-4 md:px-6 py-3 flex items-center justify-between">
            {/* Left: BOOTBOX brand */}
            <div
              className="flex items-center space-x-2 cursor-pointer select-none shrink-0"
              onMouseDown={startPress} onMouseUp={endPress}
              onTouchStart={startPress} onTouchEnd={endPress} onMouseLeave={cancelPress}
            >
              <span className="font-extrabold text-lg tracking-tight bg-gradient-to-r from-pink-600 to-rose-500 bg-clip-text text-transparent">
                BOOTBOX
              </span>
            </div>

            {/* Center: Nav Links (desktop) */}
            <nav className="hidden md:flex items-center space-x-1">
              {navLinks.map((link) => (
                <button key={link.id} onClick={() => onNavigate(link.id)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                    currentView === link.id
                      ? 'bg-pink-500/10 text-pink-600 dark:text-pink-400'
                      : 'text-[var(--text-secondary)] hover:text-pink-600 dark:hover:text-pink-400 hover:bg-pink-500/5'
                  }`}>
                  {link.label}
                </button>
              ))}
            </nav>

            {/* Right side */}
            <div className="flex items-center space-x-2">
              {/* Landing: notification bell + theme toggle */}
              {isLanding && (
                <div className="relative shrink-0">
                  <button className="p-2 rounded-xl border border-[var(--border-color)] bg-[var(--card-bg)] hover:bg-[var(--bg-secondary)] transition-all text-[var(--text-secondary)] hover:text-pink-500 shadow-sm"
                    aria-label="Notifications">
                    <Bell className="h-4 w-4" />
                  </button>
                  <span className="absolute -top-1 -right-1 h-4 w-4 bg-pink-500 rounded-full text-[9px] font-bold text-white flex items-center justify-center shadow-md shadow-pink-500/30">
                    3
                  </span>
                </div>
              )}

              {/* Landing: theme toggle (desktop) */}
              {isLanding && (
                <button onClick={toggleTheme}
                  className="hidden md:flex p-2 rounded-xl border border-[var(--border-color)] bg-[var(--card-bg)] hover:bg-[var(--bg-secondary)] transition-all duration-300 text-[var(--text-secondary)] hover:text-pink-500 shadow-sm shrink-0"
                  aria-label="Toggle theme">
                  <AnimatePresence mode="wait" initial={false}>
                    {isDark ? (
                      <motion.div key="sun" initial={{ rotate: -90, opacity: 0 }} animate={{ rotate: 0, opacity: 1 }} exit={{ rotate: 90, opacity: 0 }} transition={{ duration: 0.2 }}>
                        <Sun className="h-4 w-4" />
                      </motion.div>
                    ) : (
                      <motion.div key="moon" initial={{ rotate: 90, opacity: 0 }} animate={{ rotate: 0, opacity: 1 }} exit={{ rotate: -90, opacity: 0 }} transition={{ duration: 0.2 }}>
                        <Moon className="h-4 w-4" />
                      </motion.div>
                    )}
                  </AnimatePresence>
                </button>
              )}

              {/* Non-landing: back button */}
              {!isLanding && (
                <button onClick={() => window.history.back()}
                  className="hidden md:flex items-center space-x-1.5 px-3 py-1.5 rounded-xl border border-[var(--border-color)] bg-[var(--card-bg)] hover:bg-[var(--bg-secondary)] transition-all text-[var(--text-secondary)] hover:text-pink-500 shadow-sm shrink-0 text-xs font-semibold"
                  aria-label="Back">
                  <ArrowLeft className="h-4 w-4" />
                  <span>Back</span>
                </button>
              )}

              {/* Non-landing: back button mobile */}
              {!isLanding && (
                <button onClick={() => window.history.back()}
                  className="md:hidden p-2 rounded-xl border border-[var(--border-color)] bg-[var(--card-bg)] hover:bg-[var(--bg-secondary)] transition-all text-[var(--text-secondary)] hover:text-pink-500 shadow-sm shrink-0"
                  aria-label="Back">
                  <ArrowLeft className="h-4 w-4" />
                </button>
              )}

              {/* Hamburger (mobile) */}
              <button onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="md:hidden p-2 rounded-xl border border-[var(--border-color)] bg-[var(--card-bg)] hover:bg-[var(--bg-secondary)] transition-all text-[var(--text-secondary)] hover:text-pink-500 shadow-sm shrink-0"
                aria-label="Menu">
                {mobileMenuOpen ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
              </button>
            </div>
          </div>

          {/* Mobile Dropdown Menu */}
          <AnimatePresence>
            {mobileMenuOpen && (
              <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }} transition={{ duration: 0.15 }}
                className="md:hidden absolute top-full left-0 right-0 glass-panel border-b border-[var(--border-color)] z-50 shadow-lg">
                <div className="px-4 py-3 space-y-1">
                  {navLinks.map((link) => (
                    <button key={link.id} onClick={() => { onNavigate(link.id); setMobileMenuOpen(false); }}
                      className={`w-full text-left px-3 py-2 rounded-lg text-sm font-semibold transition-all ${
                        currentView === link.id
                          ? 'bg-pink-500/10 text-pink-600 dark:text-pink-400'
                          : 'text-[var(--text-secondary)] hover:text-pink-600 dark:hover:text-pink-400 hover:bg-pink-500/5'
                      }`}>
                      {link.label}
                    </button>
                  ))}
                  <div className="border-t border-[var(--border-color)] pt-2 mt-2 space-y-1">
                    {isLanding && (
                      <button onClick={toggleTheme}
                        className="flex items-center space-x-2 px-3 py-2 rounded-lg text-sm font-semibold text-[var(--text-secondary)] hover:text-pink-600 dark:hover:text-pink-400 hover:bg-pink-500/5 transition-all w-full">
                        {isDark ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
                        <span>{isDark ? 'Light Mode' : 'Dark Mode'}</span>
                      </button>
                    )}
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </header>

      {/* Main Page Area */}
      <main className="flex-grow max-w-7xl w-full mx-auto p-4 md:p-8">
        {children}
      </main>

      {/* Footer — hidden on landing */}
      {!isLanding && (
        <footer className="border-t border-[var(--border-color)] py-4 px-6 text-center text-xs text-[var(--text-secondary)]">
          <p>© {new Date().getFullYear()} BootBox Platform. All rights reserved.</p>
        </footer>
      )}

      {/* Admin Login Dialog */}
      <AnimatePresence>
        {showPrompt && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-md">
            <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.9, opacity: 0 }}
              className="glass-panel p-6 rounded-2xl max-w-sm w-full mx-4 border border-[var(--border-color)]">
              <div className="flex flex-col items-center mb-4 text-center">
                <div className="p-3 bg-rose-500/10 rounded-full text-rose-500 mb-2">
                  <ShieldAlert className="h-6 w-6" />
                </div>
                <h3 className="text-lg font-bold text-[var(--text-primary)]">Hidden System Authentication</h3>
                <p className="text-xs text-[var(--text-secondary)] mt-1">Enter credentials to gain access to platform settings.</p>
              </div>
              <form onSubmit={handleAdminSubmit} className="space-y-4">
                <div className="relative">
                  <Key className="absolute left-3 top-3 h-5 w-5 text-pink-400" />
                  <input type="password" placeholder="Enter security key..." value={adminPassword}
                    onChange={(e) => setAdminPassword(e.target.value)}
                    className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-[var(--border-color)] bg-[var(--input-bg)] focus:outline-none focus:ring-2 focus:ring-pink-500 text-sm text-[var(--text-primary)]" autoFocus />
                </div>
                {promptError && <p className="text-xs text-rose-600 font-semibold">{promptError}</p>}
                <div className="flex space-x-3">
                  <button type="button" onClick={() => setShowPrompt(false)}
                    className="flex-1 py-2 rounded-xl text-[var(--text-primary)] bg-[var(--muted-bg)] hover:bg-[var(--bg-secondary)] text-sm transition-all">Cancel</button>
                  <button type="submit"
                    className="flex-1 py-2 rounded-xl text-white bg-pink-600 hover:bg-pink-700 text-sm transition-all shadow-md shadow-pink-600/10">Unlock</button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Layout;
