/**
 * Pure JavaScript In-Memory & File-Backed Storage Engine.
 * Replaces native SQLite to eliminate C++ compilation and GLIBC dependency errors on Render/cloud hosting.
 */
const fs = require('fs');
const path = require('path');

const storageFile = path.join(__dirname, '..', '..', 'storage.json');

// Initial default settings
const defaultSettings = {
  cgpa_formula: '9.5',
  ats_parameters: JSON.stringify({ keywordWeight: 0.4, formattingWeight: 0.2, skillsWeight: 0.4 }),
  resume_templates: JSON.stringify(['classic', 'modern', 'minimal']),
  website_content: JSON.stringify({
    title: 'AI Career & Document Utility Platform',
    tagline: 'Modern tools to supercharge your career and files'
  }),
  sol_database: JSON.stringify({
    years: [
      {
        id: 1,
        label: '1st Year',
        desc: 'Foundation courses & basics',
        semesters: [
          { id: 'sem1', label: 'Semester 1', desc: 'Mathematics, Physics, Chemistry, Programming basics', subjects: [] },
          { id: 'sem2', label: 'Semester 2', desc: 'Engineering mechanics, English, Basic Electronics', subjects: [] }
        ]
      },
      {
        id: 2,
        label: '2nd Year',
        desc: 'Core engineering subjects',
        semesters: [
          { id: 'sem3', label: 'Semester 3', desc: 'Data Structures, Discrete Maths, Digital Logic', subjects: [] },
          { id: 'sem4', label: 'Semester 4', desc: 'Algorithms, Operating Systems, DBMS, Computer Networks', subjects: [] }
        ]
      },
      {
        id: 3,
        label: '3rd Year',
        desc: 'Specialization & electives',
        semesters: [
          { id: 'sem5', label: 'Semester 5', desc: 'Software Engineering, Compiler Design, Machine Learning', subjects: [] },
          { id: 'sem6', label: 'Semester 6', desc: 'Web Technologies, Cloud Computing, Cybersecurity', subjects: [] }
        ]
      },
      {
        id: 4,
        label: '4th Year',
        desc: 'Advanced topics & project',
        semesters: [
          { id: 'sem7', label: 'Semester 7', desc: 'Electives, Industry internship, Major Project', subjects: [] },
          { id: 'sem8', label: 'Semester 8', desc: 'Capstone project, Placement preparation', subjects: [] }
        ]
      }
    ]
  })
};

// In-Memory Database Structure
let store = {
  feedback: [],
  tool_usage_log: [],
  visitor_analytics: [],
  admin_settings: { ...defaultSettings }
};

// Load saved data if exists
try {
  if (fs.existsSync(storageFile)) {
    const raw = fs.readFileSync(storageFile, 'utf8');
    const parsed = JSON.parse(raw);
    store = {
      feedback: parsed.feedback || [],
      tool_usage_log: parsed.tool_usage_log || [],
      visitor_analytics: parsed.visitor_analytics || [],
      admin_settings: { ...defaultSettings, ...(parsed.admin_settings || {}) }
    };
    console.log('Loaded persisted data from storage.json');
  }
} catch (e) {
  console.warn('Could not read storage.json, starting with clean in-memory store:', e.message);
}

// Auto-save helper (safe against errors)
function persistStore() {
  try {
    fs.writeFileSync(storageFile, JSON.stringify(store, null, 2), 'utf8');
  } catch (e) {
    // Silently continue if filesystem is read-only in cloud container
  }
}

let feedbackNextId = store.feedback.reduce((max, f) => Math.max(max, f.id || 0), 0) + 1;
let usageNextId = store.tool_usage_log.reduce((max, u) => Math.max(max, u.id || 0), 0) + 1;
let visitorNextId = store.visitor_analytics.reduce((max, v) => Math.max(max, v.id || 0), 0) + 1;

/**
 * Compatible dbQuery interface replacing sqlite3
 */
const dbQuery = {
  async run(sql, params = []) {
    const cleanSql = sql.trim().toLowerCase();

    // 1. Insert into visitor_analytics
    if (cleanSql.includes('insert into visitor_analytics')) {
      const record = {
        id: visitorNextId++,
        session_id: params[0],
        ip_hash: params[1],
        user_agent: params[2],
        visited_at: new Date().toISOString()
      };
      store.visitor_analytics.push(record);
      persistStore();
      return { id: record.id, changes: 1 };
    }

    // 2. Insert into tool_usage_log
    if (cleanSql.includes('insert into tool_usage_log')) {
      const record = {
        id: usageNextId++,
        tool_category: params[0],
        tool_name: params[1],
        processing_time_ms: params[2],
        input_size_bytes: params[3],
        used_at: new Date().toISOString()
      };
      store.tool_usage_log.push(record);
      persistStore();
      return { id: record.id, changes: 1 };
    }

    // 3. Insert into feedback
    if (cleanSql.includes('insert into feedback')) {
      const record = {
        id: feedbackNextId++,
        name: params[0],
        email: params[1],
        rating: params[2],
        comment: params[3],
        submitted_at: new Date().toISOString()
      };
      store.feedback.push(record);
      persistStore();
      return { id: record.id, changes: 1 };
    }

    // 4. Delete from feedback
    if (cleanSql.includes('delete from feedback')) {
      const targetId = Number(params[0]);
      const initialLen = store.feedback.length;
      store.feedback = store.feedback.filter(f => f.id !== targetId);
      persistStore();
      return { changes: initialLen - store.feedback.length };
    }

    // 5. Update admin_settings
    if (cleanSql.includes('admin_settings')) {
      const key = params[0];
      const value = params[1];
      store.admin_settings[key] = value;
      persistStore();
      return { id: 1, changes: 1 };
    }

    return { id: 0, changes: 0 };
  },

  async get(sql, params = []) {
    const cleanSql = sql.trim().toLowerCase();

    // Visitor count distinct
    if (cleanSql.includes('count(distinct session_id)')) {
      const uniqueSessions = new Set(store.visitor_analytics.map(v => v.session_id));
      return { total: uniqueSessions.size };
    }

    // Total tool usage
    if (cleanSql.includes('count(*)') && cleanSql.includes('tool_usage_log') && !cleanSql.includes('where tool_name')) {
      return { total: store.tool_usage_log.length };
    }

    // Tool specific count (e.g. resume-builder, ats-checker)
    if (cleanSql.includes('from tool_usage_log where tool_name')) {
      const toolNameMatch = sql.match(/tool_name\s*=\s*'([^']+)'/i);
      const toolName = toolNameMatch ? toolNameMatch[1] : params[0];
      const count = store.tool_usage_log.filter(u => u.tool_name === toolName).length;
      return { count };
    }

    // Feedback total
    if (cleanSql.includes('count(*)') && cleanSql.includes('feedback')) {
      return { total: store.feedback.length };
    }

    // Feedback average rating
    if (cleanSql.includes('avg(rating)')) {
      if (store.feedback.length === 0) return { avg: 0 };
      const sum = store.feedback.reduce((acc, f) => acc + (Number(f.rating) || 0), 0);
      return { avg: sum / store.feedback.length };
    }

    // Admin settings value
    if (cleanSql.includes('from admin_settings where key')) {
      const keyMatch = sql.match(/key\s*=\s*'([^']+)'/i);
      const key = keyMatch ? keyMatch[1] : params[0];
      return { value: store.admin_settings[key] || null };
    }

    return null;
  },

  async all(sql, params = []) {
    const cleanSql = sql.trim().toLowerCase();

    // Category breakdown
    if (cleanSql.includes('group by tool_category')) {
      const counts = {};
      store.tool_usage_log.forEach(u => {
        counts[u.tool_category] = (counts[u.tool_category] || 0) + 1;
      });
      return Object.entries(counts).map(([tool_category, count]) => ({ tool_category, count }));
    }

    // Tool breakdown
    if (cleanSql.includes('group by tool_name')) {
      const counts = {};
      store.tool_usage_log.forEach(u => {
        counts[u.tool_name] = (counts[u.tool_name] || 0) + 1;
      });
      return Object.entries(counts).map(([tool_name, count]) => ({ tool_name, count }));
    }

    // Feedback rating distribution
    if (cleanSql.includes('group by rating')) {
      const counts = {};
      store.feedback.forEach(f => {
        counts[f.rating] = (counts[f.rating] || 0) + 1;
      });
      return [5, 4, 3, 2, 1].map(r => ({ rating: r, count: counts[r] || 0 }));
    }

    // Recent feedback list
    if (cleanSql.includes('from feedback')) {
      const sorted = [...store.feedback].sort((a, b) => new Date(b.submitted_at) - new Date(a.submitted_at));
      return sorted.slice(0, 15);
    }

    return [];
  }
};

// Dummy DB object for server.js compatibility
const db = {
  serialize(fn) {
    if (typeof fn === 'function') fn();
  },
  run(sql, params, cb) {
    if (typeof params === 'function') {
      params(null);
    } else if (typeof cb === 'function') {
      cb(null);
    }
  }
};

console.log('Using Pure JS Storage Engine (Zero Native Dependencies, Render-Ready).');

module.exports = { db, dbQuery };
