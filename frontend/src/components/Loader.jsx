import React from 'react';
import { motion } from 'framer-motion';

const Loader = ({ message = "Processing your request...", progress = null }) => {
  return (
    <div className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-black/60 backdrop-blur-sm">
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        className="glass-panel p-8 rounded-2xl flex flex-col items-center justify-center max-w-sm w-full mx-4 text-center border border-white/10"
      >
        {/* Loading Spinner */}
        <div className="relative w-20 h-20 mb-6">
          <div className="absolute inset-0 rounded-full border-4 border-indigo-500/10 dark:border-indigo-400/10"></div>
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ repeat: Infinity, duration: 1.5, ease: "linear" }}
            className="absolute inset-0 rounded-full border-4 border-t-indigo-500 border-r-indigo-500/30 border-b-transparent border-l-transparent dark:border-t-indigo-400 dark:border-r-indigo-400/30"
          ></motion.div>
          
          <div className="absolute inset-4 rounded-full border border-purple-500/20 dark:border-purple-400/20"></div>
          <motion.div
            animate={{ rotate: -360 }}
            transition={{ repeat: Infinity, duration: 2.5, ease: "linear" }}
            className="absolute inset-4 rounded-full border border-t-purple-500 border-r-transparent border-b-transparent border-l-purple-500/30 dark:border-t-purple-400 dark:border-l-purple-400/30"
          ></motion.div>
        </div>

        {/* Status Message */}
        <h3 className="text-lg font-semibold text-neutral-800 dark:text-neutral-200 mb-2">
          Please Wait
        </h3>
        <p className="text-sm text-neutral-500 dark:text-neutral-400 leading-relaxed mb-4">
          {message}
        </p>

        {/* Progress Bar (Optional) */}
        {progress !== null && (
          <div className="w-full">
            <div className="flex justify-between text-xs text-neutral-400 mb-1">
              <span>Progress</span>
              <span>{Math.round(progress)}%</span>
            </div>
            <div className="w-full bg-neutral-200 dark:bg-neutral-800 rounded-full h-2 overflow-hidden">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${progress}%` }}
                transition={{ duration: 0.3 }}
                className="bg-gradient-to-r from-indigo-500 to-purple-500 dark:from-indigo-400 dark:to-purple-400 h-full rounded-full"
              ></motion.div>
            </div>
          </div>
        )}
      </motion.div>
    </div>
  );
};

export default Loader;
