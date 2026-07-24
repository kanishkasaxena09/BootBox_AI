import React from 'react';
import { motion } from 'framer-motion';

export function Skeleton({ className = '' }) {
  return (
    <div className={`animate-pulse rounded-xl bg-[var(--bg-secondary)] ${className}`} />
  );
}

export function SkeletonCard() {
  return (
    <div className="glass-panel rounded-2xl p-4 border border-[var(--border)] space-y-3">
      <div className="flex items-center gap-3">
        <Skeleton className="w-10 h-10 rounded-xl" />
        <div className="space-y-2 flex-1">
          <Skeleton className="h-3 w-1/3" />
          <Skeleton className="h-2 w-1/2" />
        </div>
      </div>
      <Skeleton className="h-16 w-full" />
      <div className="flex gap-2">
        <Skeleton className="h-8 w-20 rounded-xl" />
        <Skeleton className="h-8 w-20 rounded-xl" />
      </div>
    </div>
  );
}

export function SkeletonGrid({ count = 6 }) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {Array.from({ length: count }).map((_, i) => (
        <motion.div key={i} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: i * 0.05 }}>
          <SkeletonCard />
        </motion.div>
      ))}
    </div>
  );
}

export function ToolSkeleton() {
  return (
    <div className="space-y-4">
      <div className="flex flex-col items-center space-y-2">
        <Skeleton className="w-14 h-14 rounded-2xl" />
        <Skeleton className="h-8 w-48" />
        <Skeleton className="h-4 w-64" />
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
        <div className="lg:col-span-4 space-y-3">
          <Skeleton className="h-64 w-full rounded-2xl" />
        </div>
        <div className="lg:col-span-8 space-y-3">
          <Skeleton className="h-96 w-full rounded-2xl" />
        </div>
      </div>
    </div>
  );
}
