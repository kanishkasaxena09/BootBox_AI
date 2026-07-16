import React, { useState, useRef } from 'react';
import { Sun, Moon, ShieldAlert, Key } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useTheme } from '../context/ThemeContext';

const Layout = ({ children, onOpenAdmin, currentTab, onTabChange }) => {
  const { isDark, toggleTheme } = useTheme();
  const [showPrompt, setShowPrompt] = useState(false);
  const [adminPassword, setAdminPassword] = useState('');
  const [promptError, setPromptError] = useState('');
  
  const longPressTimer = useRef(null);
  const isPressing = useRef(false);

  // Long Press Handlers
  const startPress = () => {
    isPressing.current = true;
    longPressTimer.current = setTimeout(() => {
      if (isPressing.current) {
        setShowPrompt(true);
        setPromptError('');
        setAdminPassword('');
        isPressing.current = false; // Reset to avoid double actions
      }
    }, 1500); // 1.5 seconds long press
  };

  const endPress = () => {
    if (isPressing.current) {
      isPressing.current = false;
      if (longPressTimer.current) {
        clearTimeout(longPressTimer.current);
      }
      onTabChange('dashboard');
    }
  };

  const cancelPress = () => {
    isPressing.current = false;
    if (longPressTimer.current) {
      clearTimeout(longPressTimer.current);
    }
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

      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.error || 'Authentication failed.');
      }

      // Save token to localStorage
      localStorage.setItem('adminToken', data.token);
      setShowPrompt(false);
      onOpenAdmin(); // Open dashboard tab
    } catch (err) {
      setPromptError(err.message || 'Incorrect password.');
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-transparent text-[var(--text-primary)]">
      
      {/* Navbar */}
      <header className="sticky top-0 z-40 w-full glass-panel border-b border-[var(--border-color)] px-6 py-4 flex justify-between items-center">
        <div
          className="flex items-center space-x-3 cursor-pointer select-none"
          onMouseDown={startPress}
          onMouseUp={endPress}
          onTouchStart={startPress}
          onTouchEnd={endPress}
          onMouseLeave={cancelPress}
        >
          <div className="h-9 w-9 bg-gradient-to-tr from-pink-500 to-rose-500 rounded-lg flex items-center justify-center font-bold text-white text-lg shadow-lg shadow-pink-500/20">
            B
          </div>
          <span className="font-extrabold text-xl tracking-tight bg-gradient-to-r from-pink-600 to-rose-500 bg-clip-text text-transparent">
            BootBox AI
          </span>
        </div>
        <button
          onClick={toggleTheme}
          className="p-2.5 rounded-xl border border-[var(--border-color)] bg-[var(--card-bg)] hover:bg-[var(--bg-secondary)] transition-all duration-300 text-[var(--text-secondary)] hover:text-pink-500 shadow-sm"
          aria-label="Toggle theme"
        >
          <AnimatePresence mode="wait" initial={false}>
            {isDark ? (
              <motion.div key="sun" initial={{ rotate: -90, opacity: 0 }} animate={{ rotate: 0, opacity: 1 }} exit={{ rotate: 90, opacity: 0 }} transition={{ duration: 0.2 }}>
                <Sun className="h-5 w-5" />
              </motion.div>
            ) : (
              <motion.div key="moon" initial={{ rotate: 90, opacity: 0 }} animate={{ rotate: 0, opacity: 1 }} exit={{ rotate: -90, opacity: 0 }} transition={{ duration: 0.2 }}>
                <Moon className="h-5 w-5" />
              </motion.div>
            )}
          </AnimatePresence>
        </button>
      </header>

      {/* Main Page Area */}
      <main className="flex-grow max-w-7xl w-full mx-auto p-4 md:p-8">
        {children}
      </main>

      {/* Footer */}
      <footer className="border-t border-[var(--border-color)] py-6 px-6 text-center text-xs text-[var(--text-secondary)]">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center space-y-2 md:space-y-0">
          <p>© {new Date().getFullYear()} BootBox Platform. All rights reserved.</p>
          <div className="flex space-x-4">
            <button onClick={() => onTabChange('feedback')} className="hover:underline hover:text-pink-600">
              Submit Feedback
            </button>
            <span>•</span>
            <span className="cursor-default select-none">No Account Required</span>
          </div>
        </div>
      </footer>

      {/* Admin Login Dialog Overlay */}
      <AnimatePresence>
        {showPrompt && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-md">
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="glass-panel p-6 rounded-2xl max-w-sm w-full mx-4 border border-[var(--border-color)]"
            >
              <div className="flex flex-col items-center mb-4 text-center">
                <div className="p-3 bg-rose-500/10 rounded-full text-rose-500 mb-2">
                  <ShieldAlert className="h-6 w-6" />
                </div>
                <h3 className="text-lg font-bold text-[var(--text-primary)]">
                  Hidden System Authentication
                </h3>
                <p className="text-xs text-[var(--text-secondary)] mt-1">
                  Enter credentials to gain access to platform settings.
                </p>
              </div>

              <form onSubmit={handleAdminSubmit} className="space-y-4">
                <div className="relative">
                  <Key className="absolute left-3 top-3 h-5 w-5 text-pink-400" />
                  <input
                    type="password"
                    placeholder="Enter security key..."
                    value={adminPassword}
                    onChange={(e) => setAdminPassword(e.target.value)}
                    className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-[var(--border-color)] bg-[var(--input-bg)] focus:outline-none focus:ring-2 focus:ring-pink-500 text-sm text-[var(--text-primary)]"
                    autoFocus
                  />
                </div>

                {promptError && (
                  <p className="text-xs text-rose-600 font-semibold">{promptError}</p>
                )}

                <div className="flex space-x-3">
                  <button
                    type="button"
                    onClick={() => setShowPrompt(false)}
                    className="flex-1 py-2 rounded-xl text-[var(--text-primary)] bg-[var(--muted-bg)] hover:bg-[var(--bg-secondary)] text-sm transition-all"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="flex-1 py-2 rounded-xl text-white bg-pink-600 hover:bg-pink-700 text-sm transition-all shadow-md shadow-pink-600/10"
                  >
                    Unlock
                  </button>
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
