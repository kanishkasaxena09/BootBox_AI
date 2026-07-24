import React, { createContext, useContext, useState, useCallback, useRef } from 'react';
import { createPortal } from 'react-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle2, AlertTriangle, Info, X } from 'lucide-react';

const ToastContext = createContext(null);

const toastTypes = {
  success: { icon: CheckCircle2, color: '#22c55e', bg: 'bg-emerald-500/10 border-emerald-500/30' },
  error: { icon: AlertTriangle, color: '#ef4444', bg: 'bg-red-500/10 border-red-500/30' },
  info: { icon: Info, color: '#0ea5e9', bg: 'bg-sky-500/10 border-sky-500/30' },
};

let toastId = 0;

export function ToastProvider({ children }) {
  const [toasts, setToasts] = useState([]);
  const timers = useRef({});

  const addToast = useCallback((message, type = 'success', duration = 3000) => {
    const id = ++toastId;
    setToasts(prev => [...prev, { id, message, type }]);
    timers.current[id] = setTimeout(() => {
      setToasts(prev => prev.filter(t => t.id !== id));
      delete timers.current[id];
    }, duration);
    return id;
  }, []);

  const removeToast = useCallback((id) => {
    clearTimeout(timers.current[id]);
    delete timers.current[id];
    setToasts(prev => prev.filter(t => t.id !== id));
  }, []);

  const toast = useCallback({
    success: (msg, dur) => addToast(msg, 'success', dur),
    error: (msg, dur) => addToast(msg, 'error', dur),
    info: (msg, dur) => addToast(msg, 'info', dur),
  }, [addToast]);

  return (
    <ToastContext.Provider value={toast}>
      {children}
      {createPortal(
        <div className="fixed bottom-4 right-4 z-[9999] flex flex-col gap-2 pointer-events-none" aria-live="polite">
          <AnimatePresence>
            {toasts.map(t => {
              const cfg = toastTypes[t.type] || toastTypes.info;
              const Icon = cfg.icon;
              return (
                <motion.div key={t.id}
                  initial={{ opacity: 0, x: 40, scale: 0.95 }}
                  animate={{ opacity: 1, x: 0, scale: 1 }}
                  exit={{ opacity: 0, x: 40, scale: 0.95 }}
                  className={`pointer-events-auto flex items-center gap-2.5 px-4 py-2.5 rounded-xl border shadow-lg ${cfg.bg} backdrop-blur-sm min-w-[240px] max-w-[360px]`}>
                  <Icon className="w-4 h-4 shrink-0" style={{ color: cfg.color }} />
                  <span className="text-xs font-bold text-[var(--text-primary)] flex-1">{t.message}</span>
                  <button onClick={() => removeToast(t.id)} className="p-0.5 text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-colors">
                    <X className="w-3 h-3" />
                  </button>
                </motion.div>
              );
            })}
          </AnimatePresence>
        </div>,
        document.body
      )}
    </ToastContext.Provider>
  );
}

export const useToast = () => {
  const ctx = useContext(ToastContext);
  if (!ctx) return { success: () => {}, error: () => {}, info: () => {} };
  return ctx;
};
