import React from 'react';

export function TextInput({ label, value, onChange, placeholder, type = 'text', icon: Icon, error, className = '' }) {
  return (
    <div className={`space-y-1 ${className}`}>
      {label && (
        <label className="text-[10px] font-bold uppercase tracking-wider text-[var(--text-secondary)] flex items-center gap-1.5">
          {Icon && <Icon className="w-3 h-3" />} {label}
        </label>
      )}
      <input type={type} value={value} onChange={e => onChange(e.target.value)} placeholder={placeholder}
        className={`w-full px-3 py-2.5 rounded-xl text-xs font-medium outline-none
          bg-[var(--bg-secondary)] border text-[var(--text-primary)]
          hover:border-[var(--accent)] focus:border-[var(--accent)] focus:ring-2 focus:ring-[var(--accent)]/20 transition-all
          ${error ? 'border-red-500' : 'border-[var(--border)]'}`} />
      {error && <p className="text-[10px] font-bold text-red-400">{error}</p>}
    </div>
  );
}

export function TextArea({ label, value, onChange, placeholder, rows = 3, icon: Icon, error, className = '' }) {
  return (
    <div className={`space-y-1 ${className}`}>
      {label && (
        <label className="text-[10px] font-bold uppercase tracking-wider text-[var(--text-secondary)] flex items-center gap-1.5">
          {Icon && <Icon className="w-3 h-3" />} {label}
        </label>
      )}
      <textarea value={value} onChange={e => onChange(e.target.value)} placeholder={placeholder} rows={rows}
        className={`w-full px-3 py-2.5 rounded-xl text-xs font-medium resize-none outline-none
          bg-[var(--bg-secondary)] border text-[var(--text-primary)]
          hover:border-[var(--accent)] focus:border-[var(--accent)] focus:ring-2 focus:ring-[var(--accent)]/20 transition-all
          ${error ? 'border-red-500' : 'border-[var(--border)]'}`} />
      {error && <p className="text-[10px] font-bold text-red-400">{error}</p>}
    </div>
  );
}

export function NumberInput({ label, value, onChange, min = 0, prefix, suffix, icon: Icon, error, className = '' }) {
  return (
    <div className={`space-y-1 ${className}`}>
      {label && (
        <label className="text-[10px] font-bold uppercase tracking-wider text-[var(--text-secondary)] flex items-center gap-1.5">
          {Icon && <Icon className="w-3 h-3" />} {label}
        </label>
      )}
      <div className="relative">
        {prefix && <span className="absolute left-3 top-1/2 -translate-y-1/2 text-xs font-bold text-[var(--text-secondary)]">{prefix}</span>}
        <input type="number" min={min} value={value} onChange={e => onChange(Number(e.target.value) || 0)}
          className={`w-full py-2.5 rounded-xl text-xs font-bold outline-none bg-[var(--bg-secondary)] border text-[var(--text-primary)]
            hover:border-[var(--accent)] focus:border-[var(--accent)] focus:ring-2 focus:ring-[var(--accent)]/20 transition-all
            ${prefix ? 'pl-7' : 'pl-3'} ${suffix ? 'pr-10' : 'pr-3'}
            ${error ? 'border-red-500' : 'border-[var(--border)]'}`} />
        {suffix && <span className="absolute right-3 top-1/2 -translate-y-1/2 text-[10px] font-bold text-[var(--text-secondary)]">{suffix}</span>}
      </div>
      {error && <p className="text-[10px] font-bold text-red-400">{error}</p>}
    </div>
  );
}

export function SelectInput({ label, value, onChange, options, icon: Icon, className = '' }) {
  return (
    <div className={`space-y-1 ${className}`}>
      {label && (
        <label className="text-[10px] font-bold uppercase tracking-wider text-[var(--text-secondary)] flex items-center gap-1.5">
          {Icon && <Icon className="w-3 h-3" />} {label}
        </label>
      )}
      <select value={value} onChange={e => onChange(e.target.value)}
        className="w-full px-3 py-2.5 rounded-xl text-xs font-bold appearance-none cursor-pointer outline-none
          bg-[var(--bg-secondary)] border border-[var(--border)] text-[var(--text-primary)]
          hover:border-[var(--accent)] focus:border-[var(--accent)] focus:ring-2 focus:ring-[var(--accent)]/20 transition-all">
        {options.map(o => (
          <option key={typeof o === 'string' ? o : o.value} value={typeof o === 'string' ? o : o.value}>
            {typeof o === 'string' ? o : o.label}
          </option>
        ))}
      </select>
    </div>
  );
}

export function DateInput({ label, value, onChange, icon: Icon, className = '' }) {
  return (
    <div className={`space-y-1 ${className}`}>
      {label && (
        <label className="text-[10px] font-bold uppercase tracking-wider text-[var(--text-secondary)] flex items-center gap-1.5">
          {Icon && <Icon className="w-3 h-3" />} {label}
        </label>
      )}
      <input type="date" value={value} onChange={e => onChange(e.target.value)}
        className="w-full px-3 py-2.5 rounded-xl text-xs font-bold outline-none
          bg-[var(--bg-secondary)] border border-[var(--border)] text-[var(--text-primary)]
          hover:border-[var(--accent)] focus:border-[var(--accent)] focus:ring-2 focus:ring-[var(--accent)]/20 transition-all
          [color-scheme:dark]" />
    </div>
  );
}
