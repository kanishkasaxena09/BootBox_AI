import React from 'react';
import { motion } from 'framer-motion';
import { Loader2 } from 'lucide-react';

const variants = {
  primary: 'bg-gradient-to-r from-pink-500 to-rose-500 text-white hover:shadow-lg hover:shadow-pink-500/25',
  secondary: 'bg-[var(--bg-secondary)] border border-[var(--border)] text-[var(--text-primary)] hover:border-[var(--accent)]/30',
  ghost: 'text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-secondary)]',
  danger: 'text-red-400 border border-red-500/30 hover:bg-red-500/10',
  accent: 'text-[var(--accent)] border border-[var(--accent)]/30 hover:bg-[var(--accent)]/10',
};

const sizes = {
  sm: 'px-3 py-1.5 text-xs',
  md: 'px-4 py-2 text-xs',
  lg: 'px-5 py-2.5 text-sm',
};

export default function Button({
  children, variant = 'primary', size = 'md', icon: Icon, iconRight: IconRight,
  loading, disabled, fullWidth, className = '', ...props
}) {
  return (
    <motion.button whileHover={!disabled && !loading ? { scale: 1.02 } : {}}
      whileTap={!disabled && !loading ? { scale: 0.98 } : {}}
      disabled={disabled || loading}
      className={`inline-flex items-center justify-center gap-1.5 rounded-xl font-bold transition-all
        ${variants[variant]} ${sizes[size]}
        ${fullWidth ? 'w-full' : ''}
        ${(disabled || loading) ? 'opacity-40 cursor-not-allowed' : 'cursor-pointer'}
        ${className}`} {...props}>
      {loading ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : Icon ? <Icon className="w-3.5 h-3.5" /> : null}
      {children}
      {IconRight && !loading && <IconRight className="w-3.5 h-3.5" />}
    </motion.button>
  );
}
