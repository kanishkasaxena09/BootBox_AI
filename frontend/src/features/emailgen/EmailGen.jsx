import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Clock, Trash2, X, History, Heart, Mail, ArrowRight } from 'lucide-react';
import { useEmailGen } from './useEmailGen';
import InputPanel from './InputPanel';
import Editor from './Editor';

const EmailGen = () => {
  const eg = useEmailGen();
  const [historyTab, setHistoryTab] = React.useState('history');
  const activeTabObj = eg.tabs.find(t => t.id === eg.activeTab);

  return (
    <div className="space-y-6 text-left">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="space-y-2">
          <h2 className="text-2xl font-black bg-gradient-to-r from-pink-500 to-rose-500 bg-clip-text text-transparent">
            Email & LinkedIn Generator
          </h2>
          <p className="text-sm text-[var(--text-secondary)]">
            AI-powered professional messages for every occasion.
          </p>
        </div>
        <button onClick={() => eg.setShowHistory(!eg.showHistory)}
          className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[var(--bg-tertiary)] text-[var(--text-secondary)] text-xs font-bold transition-all hover:text-[var(--text-primary)] border border-[var(--border-color)] hover:border-pink-500/20">
          <Clock className="h-3.5 w-3.5" />
          <span>History ({eg.history.length})</span>
        </button>
      </div>

      {/* History panel */}
      <AnimatePresence>
        {eg.showHistory && (
          <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="glass-panel border border-[var(--border-color)] rounded-2xl p-5 space-y-4 overflow-hidden">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-1 p-1 bg-[var(--bg-tertiary)] rounded-xl">
                <button onClick={() => setHistoryTab('history')}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-[11px] font-bold transition-all ${
                    historyTab === 'history'
                      ? 'bg-[var(--bg-primary)] text-[var(--text-primary)] shadow-sm'
                      : 'text-[var(--text-secondary)] hover:text-[var(--text-primary)]'
                  }`}>
                  <History className="h-3 w-3" />Recent
                </button>
                <button onClick={() => setHistoryTab('favorites')}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-[11px] font-bold transition-all ${
                    historyTab === 'favorites'
                      ? 'bg-[var(--bg-primary)] text-[var(--text-primary)] shadow-sm'
                      : 'text-[var(--text-secondary)] hover:text-[var(--text-primary)]'
                  }`}>
                  <Heart className="h-3 w-3" />Saved ({eg.favorites.length})
                </button>
              </div>
              <div className="flex items-center gap-3">
                <button onClick={eg.clearAll}
                  className="text-[11px] font-bold text-[var(--text-secondary)] hover:text-rose-500 transition-all">
                  Clear All
                </button>
                <button onClick={() => eg.setShowHistory(false)}
                  className="p-1.5 rounded-lg text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-tertiary)] transition-all">
                  <X className="h-4 w-4" />
                </button>
              </div>
            </div>
            <div className="space-y-2 max-h-64 overflow-y-auto">
              {historyTab === 'history' ? (
                eg.history.length === 0 ? (
                  <div className="py-8 text-center">
                    <History className="h-8 w-8 text-[var(--text-secondary)] opacity-30 mx-auto mb-2" />
                    <p className="text-xs text-[var(--text-secondary)]">No history yet</p>
                  </div>
                ) : eg.history.slice(0, 15).map((h, i) => (
                  <motion.div key={h.id}
                    initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.03 }}
                    onClick={() => eg.loadFromHistory(h)}
                    className="flex items-center gap-3 p-3.5 rounded-xl bg-[var(--bg-tertiary)] cursor-pointer border border-transparent hover:border-pink-500/20 transition-all group">
                    <div className="w-9 h-9 rounded-xl bg-pink-500/10 flex items-center justify-center shrink-0">
                      <span className="text-sm">{eg.tabs.find(t => t.id === h.tab)?.icon || '📝'}</span>
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-xs font-bold text-[var(--text-primary)] truncate">
                        {h.fields?.recipientName || h.fields?.referrerName || h.fields?.interviewerName || 'Untitled'}
                      </p>
                      <p className="text-[10px] text-[var(--text-secondary)]">
                        {eg.tabs.find(t => t.id === h.tab)?.name} · {new Date(h.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                      </p>
                    </div>
                    <button onClick={(e) => { e.stopPropagation(); eg.deleteEntry(h.id); }}
                      className="p-1.5 rounded-lg text-[var(--text-secondary)] opacity-0 group-hover:opacity-100 hover:text-rose-500 hover:bg-rose-500/10 transition-all">
                      <Trash2 className="h-3 w-3" />
                    </button>
                  </motion.div>
                ))
              ) : (
                eg.favorites.length === 0 ? (
                  <div className="py-8 text-center">
                    <Heart className="h-8 w-8 text-[var(--text-secondary)] opacity-30 mx-auto mb-2" />
                    <p className="text-xs text-[var(--text-secondary)]">No saved items yet</p>
                  </div>
                ) : eg.favorites.map((f, i) => (
                  <motion.div key={f.id}
                    initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.03 }}
                    onClick={() => eg.loadFromFavorite(f)}
                    className="flex items-center gap-3 p-3.5 rounded-xl bg-[var(--bg-tertiary)] cursor-pointer border border-transparent hover:border-pink-500/20 transition-all group">
                    <div className="w-9 h-9 rounded-xl bg-pink-500/10 flex items-center justify-center shrink-0">
                      <Heart className="h-4 w-4 text-pink-500" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-xs font-bold text-[var(--text-primary)] truncate">
                        {f.fields?.recipientName || f.fields?.referrerName || f.fields?.interviewerName || 'Untitled'}
                      </p>
                      <p className="text-[10px] text-[var(--text-secondary)]">
                        {eg.tabs.find(t => t.id === f.tab)?.name} · {new Date(f.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                      </p>
                    </div>
                    <button onClick={(e) => { e.stopPropagation(); eg.deleteEntry(f.id); }}
                      className="p-1.5 rounded-lg text-[var(--text-secondary)] opacity-0 group-hover:opacity-100 hover:text-rose-500 hover:bg-rose-500/10 transition-all">
                      <Trash2 className="h-3 w-3" />
                    </button>
                  </motion.div>
                ))
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Tabs */}
      <div className="glass-panel border border-[var(--border-color)] rounded-2xl p-1.5">
        <div className="flex gap-1 overflow-x-auto scrollbar-hide">
          {eg.tabs.map((tab, i) => (
            <motion.button key={tab.id}
              whileHover={{ scale: 1.01 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => eg.switchTab(tab.id)}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold transition-all whitespace-nowrap flex-shrink-0 ${
                eg.activeTab === tab.id
                  ? 'bg-gradient-to-r from-pink-600 to-rose-600 text-white shadow-lg shadow-pink-600/20'
                  : 'text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-tertiary)]'
              }`}>
              <span className="text-sm">{tab.icon}</span>
              <span>{tab.name}</span>
            </motion.button>
          ))}
        </div>
      </div>

      {/* Active tab description */}
      <motion.div key={eg.activeTab} initial={{ opacity: 0, y: 5 }} animate={{ opacity: 1, y: 0 }}
        className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-pink-500/5 border border-pink-500/10">
        <Mail className="h-3.5 w-3.5 text-pink-500 shrink-0" />
        <span className="text-xs text-[var(--text-secondary)]">{activeTabObj?.desc}</span>
        <ArrowRight className="h-3 w-3 text-pink-500/50" />
      </motion.div>

      {/* Main layout */}
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-5">
        {/* Input panel */}
        <motion.div key={eg.activeTab + '-input'} initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }}
          className="lg:col-span-2 glass-panel border border-[var(--border-color)] rounded-2xl p-6">
          <div className="flex items-center gap-2.5 mb-5 pb-4 border-b border-[var(--border-color)]">
            <div className="w-8 h-8 rounded-xl bg-pink-500/10 flex items-center justify-center">
              <span className="text-base">{activeTabObj?.icon}</span>
            </div>
            <div>
              <h3 className="text-sm font-bold text-[var(--text-primary)]">{activeTabObj?.name}</h3>
              <p className="text-[10px] text-[var(--text-secondary)]">Fill in the details below</p>
            </div>
          </div>
          <InputPanel
            activeTab={eg.activeTab}
            currentFields={eg.currentFields}
            fields={eg.fields}
            setField={eg.setField}
            tone={eg.tone} setTone={eg.setTone}
            length={eg.length} setLength={eg.setLength}
            tones={eg.tones} lengths={eg.lengths}
            onGenerate={eg.generate} onRegenerate={eg.regenerate}
            generating={eg.generating} hasOutput={!!eg.output}
            onClear={eg.clearFields}
          />
        </motion.div>

        {/* Editor */}
        <motion.div key={eg.activeTab + '-editor'} initial={{ opacity: 0, x: 10 }} animate={{ opacity: 1, x: 0 }}
          className="lg:col-span-3">
          <Editor
            output={eg.output}
            generating={eg.generating}
            charLimit={eg.charLimit}
            onCopy={eg.copyToClipboard}
            onToggleFavorite={eg.toggleFavorite}
            isFavorited={eg.isFavorited}
            tabName={activeTabObj?.name || 'content'}
          />
        </motion.div>
      </div>
    </div>
  );
};

export default EmailGen;
