import React, { useState, useEffect } from 'react';
import { Users, Activity, BarChart, Settings, MessageSquare, Trash, Save, LogOut, CheckCircle, X, Database, Plus, ChevronRight, ArrowLeft, ExternalLink, Upload, FileText, Link } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const Toast = ({ message, type, onClose }) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    exit={{ opacity: 0, y: 20 }}
    className={`fixed bottom-6 right-6 z-50 flex items-center space-x-3 px-5 py-3 rounded-xl shadow-2xl border ${
      type === 'success'
        ? 'bg-green-50 dark:bg-green-950/40 border-green-200 dark:border-green-800 text-green-700 dark:text-green-300'
        : 'bg-red-50 dark:bg-red-950/40 border-red-200 dark:border-red-800 text-red-700 dark:text-red-300'
    }`}
  >
    {type === 'success' ? <CheckCircle className="h-4 w-4 flex-shrink-0" /> : <X className="h-4 w-4 flex-shrink-0" />}
    <span className="text-sm font-semibold">{message}</span>
    <button onClick={onClose} className="ml-2 opacity-60 hover:opacity-100"><X className="h-3.5 w-3.5" /></button>
  </motion.div>
);

const AdminDashboard = ({ onLogout }) => {
  const [activeTab, setActiveTab] = useState('analytics');
  const [analytics, setAnalytics] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [toast, setToast] = useState(null);

  const [cgpaMultiplier, setCgpaMultiplier] = useState('9.5');
  const [websiteTitle, setWebsiteTitle] = useState('');
  const [websiteTagline, setWebsiteTagline] = useState('');
  const [confirmDelete, setConfirmDelete] = useState(null);
  const [saving, setSaving] = useState(false);

  const [solData, setSolData] = useState({ years: [] });
  const [solLoading, setSolLoading] = useState(false);
  const [editingYearId, setEditingYearId] = useState(null);
  const [editingSemId, setEditingSemId] = useState(null);
  const [showAddYear, setShowAddYear] = useState(false);
  const [showAddSem, setShowAddSem] = useState(false);
  const [newYearLabel, setNewYearLabel] = useState('');
  const [newYearDesc, setNewYearDesc] = useState('');
  const [newSemLabel, setNewSemLabel] = useState('');
  const [newSemDesc, setNewSemDesc] = useState('');
  const [newSubjectName, setNewSubjectName] = useState('');
  const [newSubjectDesc, setNewSubjectDesc] = useState('');
  const [newSubjectLink, setNewSubjectLink] = useState('');

  const [expandedSubj, setExpandedSubj] = useState(null);
  const [showAddDoc, setShowAddDoc] = useState(false);
  const [docType, setDocType] = useState('file');
  const [newDocName, setNewDocName] = useState('');
  const [newDocUrl, setNewDocUrl] = useState('');
  const [newDocFile, setNewDocFile] = useState(null);
  const [docUploading, setDocUploading] = useState(false);

  const showToast = (message, type = 'success') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3500);
  };

  const fetchAnalytics = async () => {
    setLoading(true);
    setError('');
    const token = localStorage.getItem('adminToken');
    if (!token) {
      setError('Unauthorized access. Token not found.');
      setLoading(false);
      return;
    }

    let statusCode = 0;
    try {
      const response = await fetch('/api/admin/analytics', {
        headers: { 'x-admin-token': token }
      });
      statusCode = response.status;
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || 'Failed to fetch analytics.');

      setAnalytics(data);
      setCgpaMultiplier(data.settings.cgpaFormulaMultiplier);
      setWebsiteTitle(data.settings.websiteContent.title || '');
      setWebsiteTagline(data.settings.websiteContent.tagline || '');
    } catch (err) {
      setError(err.message || 'Error occurred.');
      if (statusCode === 401 || statusCode === 403) onLogout();
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchAnalytics(); }, []);
  useEffect(() => { if (activeTab === 'sol') fetchSolDatabase(); }, [activeTab]);

  const handleSaveSettings = async (e) => {
    e.preventDefault();
    setSaving(true);
    const token = localStorage.getItem('adminToken');
    try {
      await fetch('/api/admin/settings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'x-admin-token': token },
        body: JSON.stringify({ key: 'cgpa_formula', value: cgpaMultiplier })
      });
      await fetch('/api/admin/settings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'x-admin-token': token },
        body: JSON.stringify({ key: 'website_content', value: { title: websiteTitle, tagline: websiteTagline } })
      });
      showToast('Settings saved successfully!');
      fetchAnalytics();
    } catch (err) {
      showToast('Failed to save settings: ' + err.message, 'error');
    } finally {
      setSaving(false);
    }
  };

  const fetchSolDatabase = async () => {
    setSolLoading(true);
    const token = localStorage.getItem('adminToken');
    try {
      const response = await fetch('/api/soldatabase', { headers: { 'x-admin-token': token } });
      const data = await response.json();
      if (response.ok) setSolData(data);
    } catch (err) {
      showToast('Failed to load SOL Database: ' + err.message, 'error');
    } finally {
      setSolLoading(false);
    }
  };

  const saveSolDatabase = async (newData) => {
    const token = localStorage.getItem('adminToken');
    try {
      const response = await fetch('/api/admin/settings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'x-admin-token': token },
        body: JSON.stringify({ key: 'sol_database', value: newData })
      });
      if (!response.ok) throw new Error('Failed to save.');
      setSolData(newData);
      showToast('SOL Database saved!');
    } catch (err) {
      showToast('Failed to save: ' + err.message, 'error');
    }
  };

  const confirmDeleteFeedback = async () => {
    if (!confirmDelete) return;
    const token = localStorage.getItem('adminToken');
    try {
      const response = await fetch(`/api/admin/feedback/${confirmDelete}`, {
        method: 'DELETE',
        headers: { 'x-admin-token': token }
      });
      if (!response.ok) throw new Error('Failed to delete.');
      showToast('Feedback deleted.');
      fetchAnalytics();
    } catch (err) {
      showToast(err.message, 'error');
    } finally {
      setConfirmDelete(null);
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-20 space-y-3">
        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-pink-500"></div>
        <p className="text-sm text-[var(--text-secondary)]">Loading dashboard...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-md mx-auto text-center py-10 space-y-4">
        <p className="text-rose-600 font-bold">{error}</p>
        <button onClick={onLogout} className="px-4 py-2 bg-[var(--bg-secondary)] rounded-lg text-xs text-[var(--text-primary)]">
          Return to App
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-6 text-left">

      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center border-b border-[var(--border-color)] pb-4 space-y-4 md:space-y-0">
        <div>
          <h2 className="text-xl font-black text-pink-600 flex items-center">
            <Settings className="h-6 w-6 mr-2 animate-spin-slow" /> Admin Dashboard
          </h2>
          <p className="text-xs text-[var(--text-secondary)] mt-0.5">Manage platform configurations, analytics, and feedback.</p>
        </div>
        <div className="flex space-x-3">
          <button onClick={fetchAnalytics} className="px-3 py-1.5 bg-[var(--bg-secondary)] hover:bg-pink-200 text-xs font-semibold rounded-lg transition-all text-[var(--text-primary)] border border-[var(--border-color)]">
            Sync Data
          </button>
          <button onClick={onLogout} className="px-3 py-1.5 bg-rose-500/10 hover:bg-rose-500/20 text-rose-600 text-xs font-semibold rounded-lg flex items-center space-x-1.5 transition-all">
            <LogOut className="h-3.5 w-3.5" /><span>Lock Dashboard</span>
          </button>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex space-x-2 p-1 bg-[var(--bg-secondary)] rounded-xl w-fit">
        {[
          { id: 'analytics', label: 'Analytics', icon: BarChart },
          { id: 'feedbacks', label: 'Feedback', icon: MessageSquare },
          { id: 'settings', label: 'Settings', icon: Settings },
          { id: 'sol', label: 'SOL Database', icon: Database },
        ].map(({ id, label, icon: Icon }) => (
          <button key={id} onClick={() => setActiveTab(id)}
            className={`px-4 py-2 rounded-lg text-xs font-bold flex items-center space-x-1.5 transition-all ${
              activeTab === id ? 'bg-pink-600 text-white shadow-md' : 'text-[var(--text-secondary)] hover:text-pink-600'
            }`}>
            <Icon className="h-3.5 w-3.5" /><span>{label}</span>
          </button>
        ))}
      </div>

      {/* ANALYTICS */}
      {activeTab === 'analytics' && analytics && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
            {[
              { label: 'Total Visitors', value: analytics.visitors, icon: Users, color: 'pink' },
              { label: 'Tool Uses', value: analytics.totalUsage, icon: Activity, color: 'rose' },
              { label: 'Avg Rating', value: `${analytics.feedback.average} / 5`, icon: MessageSquare, color: 'yellow' },
              { label: 'Resumes Built', value: analytics.resume.builderCount + analytics.resume.atsCount, icon: BarChart, color: 'violet' },
            ].map(({ label, value, icon: Icon, color }) => (
              <div key={label} className={`glass-panel p-5 rounded-2xl space-y-2 border-l-4 border-${color}-500 border border-[var(--border-color)]`}>
                <span className="text-[10px] text-[var(--text-secondary)] font-bold uppercase tracking-wider block">{label}</span>
                <p className="text-2xl font-black text-[var(--text-primary)] flex items-center justify-between">
                  <span>{value}</span><Icon className={`h-5 w-5 text-${color}-500`} />
                </p>
              </div>
            ))}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="glass-panel p-5 rounded-2xl space-y-4 border border-[var(--border-color)]">
              <h3 className="text-sm font-bold text-[var(--text-secondary)]">Tool Usage</h3>
              <div className="space-y-3 max-h-[300px] overflow-y-auto pr-2">
                {analytics.tools.length === 0 ? (
                  <p className="text-xs text-[var(--text-secondary)] italic">No usage yet.</p>
                ) : analytics.tools.map((t, idx) => (
                  <div key={idx} className="flex justify-between items-center text-xs">
                    <span className="font-semibold text-[var(--text-primary)] capitalize">{t.tool_name.replace(/-/g, ' ')}</span>
                    <div className="flex items-center space-x-2">
                      <div className="w-24 bg-[var(--bg-secondary)] h-1.5 rounded-full overflow-hidden">
                        <div className="bg-pink-600 h-full rounded-full" style={{ width: `${Math.min(100, (t.count / analytics.totalUsage) * 100)}%` }}></div>
                      </div>
                      <span className="font-bold text-[var(--text-secondary)] w-6 text-right">{t.count}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="glass-panel p-5 rounded-2xl space-y-4 border border-[var(--border-color)]">
              <h3 className="text-sm font-bold text-[var(--text-secondary)]">Star Distribution</h3>
              <div className="space-y-3">
                {analytics.feedback.distribution.length === 0 ? (
                  <p className="text-xs text-[var(--text-secondary)] italic">No ratings yet.</p>
                ) : analytics.feedback.distribution.map((dist, idx) => (
                  <div key={idx} className="flex justify-between items-center text-xs">
                    <span className="font-bold text-yellow-500 flex items-center">{dist.rating} ★</span>
                    <div className="flex items-center space-x-2 w-3/4">
                      <div className="flex-grow bg-[var(--bg-secondary)] h-2 rounded-full overflow-hidden">
                        <div className="bg-yellow-400 h-full rounded-full" style={{ width: `${(dist.count / analytics.feedback.total) * 100}%` }}></div>
                      </div>
                      <span className="text-[var(--text-secondary)] w-8 text-right">{dist.count}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* FEEDBACKS */}
      {activeTab === 'feedbacks' && analytics && (
        <div className="glass-panel p-5 rounded-2xl space-y-4 border border-[var(--border-color)]">
          <h3 className="text-sm font-bold text-[var(--text-secondary)]">User Reviews ({analytics.feedback.total})</h3>
          <div className="space-y-3 max-h-[55vh] overflow-y-auto pr-2">
            {analytics.feedback.items.length === 0 ? (
              <p className="text-xs text-[var(--text-secondary)] italic">No feedback yet.</p>
            ) : analytics.feedback.items.map((fb) => (
              <div key={fb.id} className="p-4 rounded-xl bg-[var(--bg-secondary)]/50 border border-[var(--border-color)] flex justify-between items-start space-x-4">
                <div className="space-y-1.5 min-w-0">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="text-xs font-bold text-[var(--text-primary)]">{fb.name}</span>
                    {fb.email && <span className="text-[10px] text-pink-600 font-semibold">{fb.email}</span>}
                    <span className="text-yellow-500 font-bold text-xs">{'★'.repeat(fb.rating)}{'☆'.repeat(5 - fb.rating)}</span>
                    <span className="text-[9px] text-[var(--text-secondary)]">{new Date(fb.submitted_at).toLocaleDateString()}</span>
                  </div>
                  <p className="text-xs leading-relaxed text-[var(--text-primary)]">{fb.comment}</p>
                </div>
                <button onClick={() => setConfirmDelete(fb.id)} className="p-1.5 rounded-lg text-red-500 hover:bg-red-500/10 transition-all flex-shrink-0" title="Delete">
                  <Trash className="h-4 w-4" />
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* SETTINGS */}
      {activeTab === 'settings' && analytics && (
        <form onSubmit={handleSaveSettings} className="glass-panel p-6 rounded-2xl space-y-6 border border-[var(--border-color)]">
          <h3 className="text-sm font-bold text-[var(--text-secondary)]">Platform Settings</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="text-xs font-bold text-[var(--text-secondary)] block">CGPA to Percentage Multiplier</label>
              <input type="number" step="0.01" value={cgpaMultiplier} onChange={(e) => setCgpaMultiplier(e.target.value)}
                className="w-full px-3 py-2 rounded-lg border border-[var(--border-color)] bg-[var(--bg-secondary)] text-sm focus:outline-none focus:ring-1 focus:ring-pink-500 text-[var(--text-primary)]" />
              <p className="text-[10px] text-[var(--text-secondary)]">e.g. CBSE/IPU multiply CGPA by 9.5</p>
            </div>
            <div className="space-y-4">
              <div>
                <label className="text-xs font-bold text-[var(--text-secondary)] block mb-1">Website Title</label>
                <input type="text" value={websiteTitle} onChange={(e) => setWebsiteTitle(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg border border-[var(--border-color)] bg-[var(--bg-secondary)] text-sm focus:outline-none focus:ring-1 focus:ring-pink-500 text-[var(--text-primary)]" />
              </div>
              <div>
                <label className="text-xs font-bold text-[var(--text-secondary)] block mb-1">Website Tagline</label>
                <input type="text" value={websiteTagline} onChange={(e) => setWebsiteTagline(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg border border-[var(--border-color)] bg-[var(--bg-secondary)] text-sm focus:outline-none focus:ring-1 focus:ring-pink-500 text-[var(--text-primary)]" />
              </div>
            </div>
          </div>
          <button type="submit" disabled={saving}
            className="w-full py-3 bg-pink-600 hover:bg-pink-700 text-white font-bold rounded-xl text-sm flex items-center justify-center space-x-2 transition-all shadow-md shadow-pink-600/10 disabled:opacity-50">
            <Save className="h-4 w-4" />
            <span>{saving ? 'Saving...' : 'Save Settings'}</span>
          </button>
        </form>
      )}

      {/* SOL DATABASE */}
      {activeTab === 'sol' && (
        <div className="glass-panel p-5 rounded-2xl border border-[var(--border-color)]">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center space-x-2 text-sm font-bold">
              {editingYearId ? (
                <>
                  <button onClick={() => { setEditingYearId(null); setEditingSemId(null); }} className="text-pink-600 hover:underline">Years</button>
                  <ChevronRight className="h-3.5 w-3.5 text-[var(--text-secondary)]" />
                  {editingSemId ? (
                    <>
                      <button onClick={() => setEditingSemId(null)} className="text-pink-600 hover:underline">
                        {solData.years.find(y => y.id === editingYearId)?.label}
                      </button>
                      <ChevronRight className="h-3.5 w-3.5 text-[var(--text-secondary)]" />
                      <span className="text-[var(--text-primary)]">{solData.years.find(y => y.id === editingYearId)?.semesters.find(s => s.id === editingSemId)?.label}</span>
                    </>
                  ) : (
                    <span className="text-[var(--text-primary)]">{solData.years.find(y => y.id === editingYearId)?.label}</span>
                  )}
                </>
              ) : (
                <Database className="h-4 w-4 text-pink-600" />
              )}
              <span className="text-[var(--text-primary)]">{!editingYearId ? 'SOL Database' : ''}</span>
            </div>
            <button onClick={fetchSolDatabase} className="px-3 py-1.5 bg-[var(--bg-secondary)] hover:bg-pink-200 text-xs font-semibold rounded-lg transition-all text-[var(--text-primary)] border border-[var(--border-color)]">Refresh</button>
          </div>

          {solLoading ? (
            <div className="flex items-center justify-center py-10">
              <div className="animate-spin rounded-full h-6 w-6 border-t-2 border-b-2 border-pink-500"></div>
            </div>
          ) : (
            <>
              {/* YEAR LEVEL */}
              {!editingYearId && (
                <div className="space-y-3">
                  {solData.years.length === 0 && <p className="text-xs text-[var(--text-secondary)] italic text-center py-4">No years defined. Add one below.</p>}
                  {solData.years.map((year) => (
                    <div key={year.id} className="flex items-center justify-between p-3 rounded-xl bg-[var(--bg-secondary)]/50 border border-[var(--border-color)]">
                      <div>
                        <p className="text-sm font-bold text-[var(--text-primary)]">{year.label}</p>
                        <p className="text-[10px] text-[var(--text-secondary)]">{year.desc}</p>
                      </div>
                      <div className="flex space-x-2">
                        <button onClick={() => { setEditingYearId(year.id); setEditingSemId(null); }} className="px-3 py-1.5 bg-pink-600 text-white text-xs font-bold rounded-lg hover:bg-pink-700 transition-all">Manage</button>
                        <button onClick={() => {
                          const newData = { ...solData, years: solData.years.filter(y => y.id !== year.id) };
                          saveSolDatabase(newData);
                        }} className="p-1.5 text-red-500 hover:bg-red-500/10 rounded-lg transition-all"><Trash className="h-4 w-4" /></button>
                      </div>
                    </div>
                  ))}
                  <button onClick={() => { setShowAddYear(!showAddYear); setNewYearLabel(''); setNewYearDesc(''); }} className="w-full py-2 border-2 border-dashed border-[var(--border-color)] rounded-xl text-xs font-bold text-pink-600 hover:bg-[var(--bg-secondary)]/50 transition-all flex items-center justify-center space-x-1.5">
                    <Plus className="h-3.5 w-3.5" /><span>Add Year</span>
                  </button>
                  {showAddYear && (
                    <div className="p-4 rounded-xl bg-[var(--bg-secondary)] border border-[var(--border-color)] space-y-3">
                      <input type="text" placeholder="Year label (e.g. 1st Year)" value={newYearLabel} onChange={(e) => setNewYearLabel(e.target.value)} className="w-full px-3 py-2 rounded-lg border border-[var(--border-color)] bg-[var(--card-bg)] text-xs focus:outline-none focus:ring-1 focus:ring-pink-500 text-[var(--text-primary)]" />
                      <input type="text" placeholder="Description (e.g. Foundation courses)" value={newYearDesc} onChange={(e) => setNewYearDesc(e.target.value)} className="w-full px-3 py-2 rounded-lg border border-[var(--border-color)] bg-[var(--card-bg)] text-xs focus:outline-none focus:ring-1 focus:ring-pink-500 text-[var(--text-primary)]" />
                      <button onClick={() => {
                        if (!newYearLabel.trim()) return;
                        const newData = { ...solData, years: [...solData.years, { id: Date.now(), label: newYearLabel.trim(), desc: newYearDesc.trim(), semesters: [] }] };
                        saveSolDatabase(newData);
                        setShowAddYear(false);
                      }} className="w-full py-2 bg-pink-600 text-white text-xs font-bold rounded-lg hover:bg-pink-700 transition-all">Create Year</button>
                    </div>
                  )}
                </div>
              )}

              {/* SEMESTER LEVEL */}
              {editingYearId && !editingSemId && (
                <div className="space-y-3">
                  {solData.years.find(y => y.id === editingYearId)?.semesters.length === 0 && <p className="text-xs text-[var(--text-secondary)] italic text-center py-4">No semesters defined. Add one below.</p>}
                  {solData.years.find(y => y.id === editingYearId)?.semesters.map((sem) => (
                    <div key={sem.id} className="flex items-center justify-between p-3 rounded-xl bg-[var(--bg-secondary)]/50 border border-[var(--border-color)]">
                      <div>
                        <p className="text-sm font-bold text-[var(--text-primary)]">{sem.label}</p>
                        <p className="text-[10px] text-[var(--text-secondary)]">{sem.desc}</p>
                      </div>
                      <div className="flex space-x-2">
                        <button onClick={() => setEditingSemId(sem.id)} className="px-3 py-1.5 bg-pink-600 text-white text-xs font-bold rounded-lg hover:bg-pink-700 transition-all">Manage</button>
                        <button onClick={() => {
                          const newData = { ...solData, years: solData.years.map(y => y.id === editingYearId ? { ...y, semesters: y.semesters.filter(s => s.id !== sem.id) } : y) };
                          saveSolDatabase(newData);
                        }} className="p-1.5 text-red-500 hover:bg-red-500/10 rounded-lg transition-all"><Trash className="h-4 w-4" /></button>
                      </div>
                    </div>
                  ))}
                  <button onClick={() => { setShowAddSem(!showAddSem); setNewSemLabel(''); setNewSemDesc(''); }} className="w-full py-2 border-2 border-dashed border-[var(--border-color)] rounded-xl text-xs font-bold text-pink-600 hover:bg-[var(--bg-secondary)]/50 transition-all flex items-center justify-center space-x-1.5">
                    <Plus className="h-3.5 w-3.5" /><span>Add Semester</span>
                  </button>
                  {showAddSem && (
                    <div className="p-4 rounded-xl bg-[var(--bg-secondary)] border border-[var(--border-color)] space-y-3">
                      <input type="text" placeholder="Semester label (e.g. Semester 1)" value={newSemLabel} onChange={(e) => setNewSemLabel(e.target.value)} className="w-full px-3 py-2 rounded-lg border border-[var(--border-color)] bg-[var(--card-bg)] text-xs focus:outline-none focus:ring-1 focus:ring-pink-500 text-[var(--text-primary)]" />
                      <input type="text" placeholder="Description (e.g. Mathematics, Physics)" value={newSemDesc} onChange={(e) => setNewSemDesc(e.target.value)} className="w-full px-3 py-2 rounded-lg border border-[var(--border-color)] bg-[var(--card-bg)] text-xs focus:outline-none focus:ring-1 focus:ring-pink-500 text-[var(--text-primary)]" />
                      <button onClick={() => {
                        if (!newSemLabel.trim()) return;
                        const newData = { ...solData, years: solData.years.map(y => y.id === editingYearId ? { ...y, semesters: [...y.semesters, { id: 'sem-' + Date.now(), label: newSemLabel.trim(), desc: newSemDesc.trim(), subjects: [] }] } : y) };
                        saveSolDatabase(newData);
                        setShowAddSem(false);
                      }} className="w-full py-2 bg-pink-600 text-white text-xs font-bold rounded-lg hover:bg-pink-700 transition-all">Create Semester</button>
                    </div>
                  )}
                </div>
              )}

              {/* SUBJECT LEVEL */}
              {editingYearId && editingSemId && (
                <div className="space-y-3">
                  {(() => {
                    const sem = solData.years.find(y => y.id === editingYearId)?.semesters.find(s => s.id === editingSemId);
                    if (!sem) return <p className="text-xs text-[var(--text-secondary)] italic">Semester not found.</p>;
                    return (
                      <>
                        {sem.subjects.length === 0 && <p className="text-xs text-[var(--text-secondary)] italic text-center py-4">No subjects added yet.</p>}
                        {sem.subjects.map((subj, idx) => (
                          <div key={idx} className="rounded-xl bg-[var(--bg-secondary)]/50 border border-[var(--border-color)] overflow-hidden">
                            <div className="flex items-center justify-between p-3">
                              <div className="min-w-0 flex-1 mr-3">
                                <p className="text-sm font-bold text-[var(--text-primary)]">{subj.name}</p>
                                <p className="text-[10px] text-[var(--text-secondary)]">{subj.desc}</p>
                              </div>
                              <div className="flex items-center space-x-2">
                                <button onClick={() => setExpandedSubj(expandedSubj === idx ? null : idx)}
                                  className="px-2.5 py-1 bg-[var(--card-bg)] text-xs font-semibold rounded-lg hover:bg-pink-200 transition-all text-[var(--text-primary)] border border-[var(--border-color)]">
                                  Docs ({(subj.documents || []).length})
                                </button>
                                <button onClick={() => {
                                  const newData = { ...solData, years: solData.years.map(y => y.id === editingYearId ? { ...y, semesters: y.semesters.map(s => s.id === editingSemId ? { ...s, subjects: s.subjects.filter((_, i) => i !== idx) } : s) } : y) };
                                  saveSolDatabase(newData);
                                }} className="p-1.5 text-red-500 hover:bg-red-500/10 rounded-lg transition-all flex-shrink-0"><Trash className="h-4 w-4" /></button>
                              </div>
                            </div>
                            {/* DOCUMENTS INSIDE SUBJECT */}
                            {expandedSubj === idx && (
                              <div className="border-t border-[var(--border-color)] px-3 py-3 space-y-2 bg-[var(--card-bg)]/50">
                                {(subj.documents || []).length === 0 && (
                                  <p className="text-[10px] text-[var(--text-secondary)] italic">No documents yet.</p>
                                )}
                                {(subj.documents || []).map((doc, di) => (
                                  <div key={di} className="flex items-center justify-between py-1.5 px-2 rounded-lg bg-[var(--bg-secondary)]/50">
                                    <div className="flex items-center space-x-2 min-w-0 flex-1 mr-2">
                                      {doc.type === 'file' ? <FileText className="h-3.5 w-3.5 text-pink-500 flex-shrink-0" /> : <Link className="h-3.5 w-3.5 text-pink-500 flex-shrink-0" />}
                                      <div className="min-w-0">
                                        <p className="text-xs font-semibold text-[var(--text-primary)] truncate">{doc.name || doc.filename || 'Document'}</p>
                                        <a href={doc.url} target="_blank" rel="noopener noreferrer" className="text-[9px] text-pink-600 hover:underline truncate block">{doc.url}</a>
                                      </div>
                                    </div>
                                    <button onClick={() => {
                                      const newDocs = (subj.documents || []).filter((_, i) => i !== di);
                                      const newData = { ...solData, years: solData.years.map(y => y.id === editingYearId ? { ...y, semesters: y.semesters.map(s => s.id === editingSemId ? { ...s, subjects: s.subjects.map((sb, i) => i === idx ? { ...sb, documents: newDocs } : sb) } : s) } : y) };
                                      saveSolDatabase(newData);
                                    }} className="p-1 text-red-500 hover:bg-red-500/10 rounded transition-all flex-shrink-0"><Trash className="h-3 w-3" /></button>
                                  </div>
                                ))}
                                {/* Add Document Form */}
                                {showAddDoc !== idx && (
                                  <button onClick={() => { setShowAddDoc(idx); setDocType('file'); setNewDocName(''); setNewDocUrl(''); setNewDocFile(null); }}
                                    className="w-full py-1.5 border border-dashed border-[var(--border-color)] rounded-lg text-[10px] font-bold text-pink-600 hover:bg-[var(--bg-secondary)]/50 transition-all flex items-center justify-center space-x-1">
                                    <Plus className="h-3 w-3" /><span>Add Document</span>
                                  </button>
                                )}
                                {showAddDoc === idx && (
                                  <div className="p-3 rounded-lg bg-[var(--bg-secondary)] border border-[var(--border-color)] space-y-2.5">
                                    <p className="text-[10px] font-bold text-[var(--text-secondary)]">New Document</p>
                                    <input type="text" placeholder="Document name" value={newDocName} onChange={(e) => setNewDocName(e.target.value)}
                                      className="w-full px-2.5 py-1.5 rounded-lg border border-[var(--border-color)] bg-[var(--card-bg)] text-[11px] focus:outline-none focus:ring-1 focus:ring-pink-500 text-[var(--text-primary)]" />
                                    <div className="flex space-x-2">
                                      <button onClick={() => setDocType('file')}
                                        className={`flex-1 py-1.5 rounded-lg text-[10px] font-bold flex items-center justify-center space-x-1 transition-all ${docType === 'file' ? 'bg-pink-600 text-white' : 'bg-[var(--card-bg)] text-[var(--text-secondary)] border border-[var(--border-color)]'}`}>
                                        <Upload className="h-3 w-3" /><span>Upload File</span>
                                      </button>
                                      <button onClick={() => setDocType('link')}
                                        className={`flex-1 py-1.5 rounded-lg text-[10px] font-bold flex items-center justify-center space-x-1 transition-all ${docType === 'link' ? 'bg-pink-600 text-white' : 'bg-[var(--card-bg)] text-[var(--text-secondary)] border border-[var(--border-color)]'}`}>
                                        <Link className="h-3 w-3" /><span>External Link</span>
                                      </button>
                                    </div>
                                    {docType === 'file' ? (
                                      <div>
                                        <input type="file" onChange={(e) => setNewDocFile(e.target.files[0])}
                                          className="w-full text-[10px] file:mr-2 file:py-1 file:px-2.5 file:rounded-lg file:border-0 file:text-[10px] file:font-bold file:bg-pink-600 file:text-white hover:file:bg-pink-700 file:cursor-pointer text-[var(--text-secondary)]" />
                                      </div>
                                    ) : (
                                      <input type="text" placeholder="https://drive.google.com/..." value={newDocUrl} onChange={(e) => setNewDocUrl(e.target.value)}
                                        className="w-full px-2.5 py-1.5 rounded-lg border border-[var(--border-color)] bg-[var(--card-bg)] text-[11px] focus:outline-none focus:ring-1 focus:ring-pink-500 text-[var(--text-primary)]" />
                                    )}
                                    <div className="flex space-x-2">
                                      <button onClick={() => setShowAddDoc(null)}
                                        className="flex-1 py-1.5 rounded-lg text-[10px] font-bold bg-[var(--card-bg)] text-[var(--text-secondary)] border border-[var(--border-color)] hover:bg-[var(--bg-secondary)] transition-all">Cancel</button>
                                      <button onClick={async () => {
                                        try {
                                          if (!newDocName.trim()) { showToast('Please enter a document name.', 'error'); return; }
                                          let url = newDocUrl.trim();
                                          let filename = '';
                                          if (docType === 'file') {
                                            if (!newDocFile) { showToast('Please select a file to upload.', 'error'); return; }
                                            setDocUploading(true);
                                            const formData = new FormData();
                                            formData.append('file', newDocFile);
                                            const res = await fetch('/api/admin/soldatabase/upload', {
                                              method: 'POST',
                                              headers: { 'x-admin-token': localStorage.getItem('adminToken') },
                                              body: formData
                                            });
                                            const data = await res.json();
                                            if (!res.ok) throw new Error(data.error || 'Upload failed');
                                            url = data.url;
                                            filename = data.filename;
                                            setDocUploading(false);
                                          }
                                          const doc = { name: newDocName.trim(), type: docType, url, filename };
                                          const existingDocs = subj.documents || [];
                                          const newData = { ...solData, years: solData.years.map(y => y.id === editingYearId ? { ...y, semesters: y.semesters.map(s => s.id === editingSemId ? { ...s, subjects: s.subjects.map((sb, i) => i === idx ? { ...sb, documents: [...existingDocs, doc] } : sb) } : s) } : y) };
                                          saveSolDatabase(newData);
                                          setShowAddDoc(null); setNewDocName(''); setNewDocUrl(''); setNewDocFile(null);
                                        } catch (err) {
                                          showToast('Error: ' + err.message, 'error');
                                          setDocUploading(false);
                                        }
                                      }} disabled={docUploading}
                                        className="flex-1 py-1.5 rounded-lg text-[10px] font-bold bg-pink-600 text-white hover:bg-pink-700 transition-all disabled:opacity-50">
                                        {docUploading ? 'Uploading...' : 'Add Document'}
                                      </button>
                                    </div>
                                  </div>
                                )}
                              </div>
                            )}
                          </div>
                        ))}
                        <div className="p-4 rounded-xl bg-[var(--bg-secondary)] border border-[var(--border-color)] space-y-3">
                          <p className="text-xs font-bold text-[var(--text-secondary)]">Add Subject</p>
                          <input type="text" placeholder="Subject name" value={newSubjectName} onChange={(e) => setNewSubjectName(e.target.value)} className="w-full px-3 py-2 rounded-lg border border-[var(--border-color)] bg-[var(--card-bg)] text-xs focus:outline-none focus:ring-1 focus:ring-pink-500 text-[var(--text-primary)]" />
                          <input type="text" placeholder="Description (optional)" value={newSubjectDesc} onChange={(e) => setNewSubjectDesc(e.target.value)} className="w-full px-3 py-2 rounded-lg border border-[var(--border-color)] bg-[var(--card-bg)] text-xs focus:outline-none focus:ring-1 focus:ring-pink-500 text-[var(--text-primary)]" />
                          <button onClick={() => {
                            if (!newSubjectName.trim()) return;
                            const newData = { ...solData, years: solData.years.map(y => y.id === editingYearId ? { ...y, semesters: y.semesters.map(s => s.id === editingSemId ? { ...s, subjects: [...s.subjects, { name: newSubjectName.trim(), desc: newSubjectDesc.trim(), documents: [] }] } : s) } : y) };
                            saveSolDatabase(newData);
                            setNewSubjectName(''); setNewSubjectDesc('');
                          }} className="w-full py-2 bg-pink-600 text-white text-xs font-bold rounded-lg hover:bg-pink-700 transition-all">Add Subject</button>
                        </div>
                      </>
                    );
                  })()}
                </div>
              )}
            </>
          )}
        </div>
      )}

      {/* DELETE MODAL */}
      <AnimatePresence>
        {confirmDelete && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm" onClick={() => setConfirmDelete(null)}>
            <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.9, opacity: 0 }}
              className="bg-[var(--card-bg)] rounded-2xl p-6 max-w-sm w-full mx-4 shadow-2xl border border-[var(--border-color)] space-y-4"
              onClick={(e) => e.stopPropagation()}>
              <div className="text-center space-y-2">
                <div className="mx-auto h-12 w-12 bg-red-500/10 rounded-full flex items-center justify-center">
                  <Trash className="h-6 w-6 text-red-500" />
                </div>
                <h3 className="text-lg font-bold text-[var(--text-primary)]">Delete Feedback?</h3>
                <p className="text-sm text-[var(--text-secondary)]">This action cannot be undone.</p>
              </div>
              <div className="flex space-x-3">
                <button onClick={() => setConfirmDelete(null)}
                  className="flex-1 py-2.5 px-4 rounded-xl text-sm font-bold bg-[var(--muted-bg)] text-[var(--text-secondary)] hover:bg-[var(--bg-secondary)] transition-all border border-[var(--border-color)]">
                  Cancel
                </button>
                <button onClick={confirmDeleteFeedback}
                  className="flex-1 py-2.5 px-4 rounded-xl text-sm font-bold bg-red-600 hover:bg-red-700 text-white transition-all shadow-md shadow-red-600/10">
                  Delete
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* TOAST */}
      <AnimatePresence>
        {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}
      </AnimatePresence>
    </div>
  );
};

export default AdminDashboard;
