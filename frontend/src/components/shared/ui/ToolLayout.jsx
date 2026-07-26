import React from 'react';
import { motion } from 'framer-motion';
import { ArrowLeft } from 'lucide-react';

const fadeUp = { initial: { opacity: 0, y: 10 }, animate: { opacity: 1, y: 0 }, transition: { duration: 0.25 } };

export default function ToolLayout({ icon: Icon, title, subtitle, accentColor = 'pink', onBack, children }) {
  return (
    <div className="space-y-4" role="main">
      <div className="text-center space-y-2">
        <motion.div {...fadeUp}
          className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-gradient-to-br border"
          style={{
            backgroundImage: `linear-gradient(to bottom right, ${accentColor}20, ${accentColor}10)`,
            borderColor: `${accentColor}30`,
          }}>
          <Icon className="w-7 h-7" style={{ color: accentColor }} />
        </motion.div>
        <motion.h1 {...fadeUp}
          className="text-2xl sm:text-3xl font-black bg-gradient-to-r bg-clip-text text-transparent"
          style={{ backgroundImage: `linear-gradient(to right, ${accentColor}, ${accentColor}cc)` }}>
          {title}
        </motion.h1>
        {subtitle && (
          <motion.p {...fadeUp} className="text-sm text-[var(--text-secondary)] max-w-md mx-auto">
            {subtitle}
          </motion.p>
        )}
      </div>
      {children}
    </div>
  );
}
