const sqlite3 = require('sqlite3').verbose();
const path = require('path');
const fs = require('fs');

const dbPath = path.join(__dirname, '..', '..', 'database.sqlite');
const db = new sqlite3.Database(dbPath, (err) => {
  if (err) {
    console.error('Could not connect to SQLite database:', err.message);
  } else {
    console.log('Connected to SQLite database at:', dbPath);
  }
});

// Helper functions that return promises
const dbQuery = {
  run(sql, params = []) {
    return new Promise((resolve, reject) => {
      db.run(sql, params, function (err) {
        if (err) reject(err);
        else resolve({ id: this.lastID, changes: this.changes });
      });
    });
  },
  get(sql, params = []) {
    return new Promise((resolve, reject) => {
      db.get(sql, params, (err, row) => {
        if (err) reject(err);
        else resolve(row);
      });
    });
  },
  all(sql, params = []) {
    return new Promise((resolve, reject) => {
      db.all(sql, params, (err, rows) => {
        if (err) reject(err);
        else resolve(rows);
      });
    });
  }
};

// Initialize tables
db.serialize(() => {
  // 1. Feedback Table
  db.run(`
    CREATE TABLE IF NOT EXISTS feedback (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT,
      email TEXT,
      rating INTEGER NOT NULL,
      comment TEXT NOT NULL,
      submitted_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )
  `, (err) => {
    // If the table was already created in a previous session, add the column dynamically
    db.run(`ALTER TABLE feedback ADD COLUMN email TEXT`, (alterErr) => {
      // Ignore errors (like column already exists)
    });
  });

  // 2. Tool Usage Log Table
  db.run(`
    CREATE TABLE IF NOT EXISTS tool_usage_log (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      tool_category TEXT NOT NULL,
      tool_name TEXT NOT NULL,
      processing_time_ms INTEGER,
      input_size_bytes INTEGER,
      used_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )
  `);

  // 3. Visitor Analytics Table
  db.run(`
    CREATE TABLE IF NOT EXISTS visitor_analytics (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      session_id TEXT NOT NULL,
      ip_hash TEXT NOT NULL,
      user_agent TEXT,
      visited_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )
  `);

  // 4. Admin Settings Table
  db.run(`
    CREATE TABLE IF NOT EXISTS admin_settings (
      key TEXT PRIMARY KEY,
      value TEXT NOT NULL,
      updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )
  `, () => {
    // Insert default settings if not exists
    db.run(`INSERT OR IGNORE INTO admin_settings (key, value) VALUES ('cgpa_formula', '9.5')`);
    db.run(`INSERT OR IGNORE INTO admin_settings (key, value) VALUES ('ats_parameters', '{"keywordWeight": 0.4, "formattingWeight": 0.2, "skillsWeight": 0.4}')`);
    db.run(`INSERT OR IGNORE INTO admin_settings (key, value) VALUES ('resume_templates', '["classic", "modern", "minimal"]')`);
    db.run(`INSERT OR IGNORE INTO admin_settings (key, value) VALUES ('website_content', '{"title": "AI Career & Document Utility Platform", "tagline": "Modern tools to supercharge your career and files"}')`);
    db.run(`INSERT OR IGNORE INTO admin_settings (key, value) VALUES ('sol_database', '{"years":[{"id":1,"label":"1st Year","desc":"Foundation courses & basics","semesters":[{"id":"sem1","label":"Semester 1","desc":"Mathematics, Physics, Chemistry, Programming basics","subjects":[]},{"id":"sem2","label":"Semester 2","desc":"Engineering mechanics, English, Basic Electronics","subjects":[]}]},{"id":2,"label":"2nd Year","desc":"Core engineering subjects","semesters":[{"id":"sem3","label":"Semester 3","desc":"Data Structures, Discrete Maths, Digital Logic","subjects":[]},{"id":"sem4","label":"Semester 4","desc":"Algorithms, Operating Systems, DBMS, Computer Networks","subjects":[]}]},{"id":3,"label":"3rd Year","desc":"Specialization & electives","semesters":[{"id":"sem5","label":"Semester 5","desc":"Software Engineering, Compiler Design, Machine Learning","subjects":[]},{"id":"sem6","label":"Semester 6","desc":"Web Technologies, Cloud Computing, Cybersecurity","subjects":[]}]},{"id":4,"label":"4th Year","desc":"Advanced topics & project","semesters":[{"id":"sem7","label":"Semester 7","desc":"Electives, Industry internship, Major Project","subjects":[]},{"id":"sem8","label":"Semester 8","desc":"Capstone project, Placement preparation","subjects":[]}]}]}')`);
  });
});

module.exports = { db, dbQuery };
