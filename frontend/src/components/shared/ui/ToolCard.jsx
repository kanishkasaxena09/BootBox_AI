import React from 'react';

export default function ToolCard({ icon: Icon, name, desc, color = 'pink', onClick }) {
  return (
    <button onClick={onClick}
      className="card-hover-border glass-panel border border-[var(--border-color)] p-6 rounded-2xl cursor-pointer
        transition-all flex flex-col text-left space-y-3 shadow-sm hover:shadow-md active:scale-[0.98]"
      role="article" aria-label={name}>
      <div className={`p-3 bg-${color}-500/10 rounded-xl w-fit`}>
        <Icon className={`h-5 w-5 text-${color}-500`} />
      </div>
      <div>
        <h3 className="font-bold text-[var(--text-primary)]">{name}</h3>
        <p className="text-xs text-[var(--text-secondary)] mt-1">{desc}</p>
      </div>
    </button>
  );
}
