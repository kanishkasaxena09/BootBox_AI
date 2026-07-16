const crypto = require('crypto');
const { dbQuery } = require('../config/db');
const { expectedToken } = require('../middleware/auth');
require('dotenv').config();

async function adminLogin(req, res) {
  try {
    const { password } = req.body;
    if (!password) {
      return res.status(400).json({ error: 'Password is required.' });
    }

    if (password !== process.env.ADMIN_PASSWORD) {
      return res.status(401).json({ error: 'Incorrect admin password.' });
    }

    // Return the SHA256 hashed token for authentication headers
    return res.json({ token: expectedToken, message: 'Authenticated successfully.' });
  } catch (err) {
    console.error('Admin login error:', err.message);
    return res.status(500).json({ error: err.message });
  }
}

/**
 * Register Visitor
 */
async function logVisitor(req, res) {
  try {
    const { sessionId } = req.body;
    if (!sessionId) {
      return res.status(400).json({ error: 'Session ID is required.' });
    }

    const ip = req.ip || req.connection.remoteAddress || 'unknown';
    const ipHash = crypto.createHash('sha1').update(ip).digest('hex');
    const userAgent = req.headers['user-agent'] || 'unknown';

    // Insert visitor record
    await dbQuery.run(
      `INSERT INTO visitor_analytics (session_id, ip_hash, user_agent) VALUES (?, ?, ?)`,
      [sessionId, ipHash, userAgent]
    );

    return res.json({ success: true });
  } catch (err) {
    console.error('Log visitor error:', err.message);
    return res.status(500).json({ error: err.message });
  }
}

/**
 * Get Analytics for Admin Panel
 */
async function getAnalytics(req, res) {
  try {
    // 1. Total Visitors (Distinct Sessions)
    const visitorCount = await dbQuery.get("SELECT COUNT(DISTINCT session_id) as total FROM visitor_analytics");
    
    // 2. Total Tool Usage
    const totalUsage = await dbQuery.get("SELECT COUNT(*) as total FROM tool_usage_log");
    
    // 3. Category breakdown
    const categoryBreakdown = await dbQuery.all(
      "SELECT tool_category, COUNT(*) as count FROM tool_usage_log GROUP BY tool_category"
    );

    // 4. Tool breakdown
    const toolBreakdown = await dbQuery.all(
      "SELECT tool_name, COUNT(*) as count FROM tool_usage_log GROUP BY tool_name"
    );

    // 5. Feedback stats
    const feedbackCount = await dbQuery.get("SELECT COUNT(*) as total FROM feedback");
    const feedbackAvg = await dbQuery.get("SELECT AVG(rating) as avg FROM feedback");
    const feedbackDistribution = await dbQuery.all(
      "SELECT rating, COUNT(*) as count FROM feedback GROUP BY rating ORDER BY rating DESC"
    );
    const recentFeedback = await dbQuery.all(
      "SELECT * FROM feedback ORDER BY submitted_at DESC LIMIT 15"
    );

    // 6. Resume Analytics
    const resumeStats = await dbQuery.get(
      "SELECT COUNT(*) as count FROM tool_usage_log WHERE tool_name = 'resume-builder'"
    );
    const atsStats = await dbQuery.get(
      "SELECT COUNT(*) as count FROM tool_usage_log WHERE tool_name = 'ats-checker'"
    );

    // 7. Dynamic Settings
    const cgpaSetting = await dbQuery.get("SELECT value FROM admin_settings WHERE key = 'cgpa_formula'");
    const atsSetting = await dbQuery.get("SELECT value FROM admin_settings WHERE key = 'ats_parameters'");
    const websiteSetting = await dbQuery.get("SELECT value FROM admin_settings WHERE key = 'website_content'");

    return res.json({
      visitors: visitorCount ? visitorCount.total : 0,
      totalUsage: totalUsage ? totalUsage.total : 0,
      categories: categoryBreakdown,
      tools: toolBreakdown,
      feedback: {
        total: feedbackCount ? feedbackCount.total : 0,
        average: feedbackAvg && feedbackAvg.avg ? parseFloat(feedbackAvg.avg.toFixed(2)) : 0,
        distribution: feedbackDistribution,
        items: recentFeedback
      },
      resume: {
        builderCount: resumeStats ? resumeStats.count : 0,
        atsCount: atsStats ? atsStats.count : 0,
        averageScore: 78 // Mocked average ATS score processed
      },
      settings: {
        cgpaFormulaMultiplier: cgpaSetting ? cgpaSetting.value : '9.5',
        atsParameters: atsSetting ? JSON.parse(atsSetting.value) : {},
        websiteContent: websiteSetting ? JSON.parse(websiteSetting.value) : {}
      }
    });
  } catch (err) {
    console.error('Get admin analytics error:', err.message);
    return res.status(500).json({ error: err.message });
  }
}

/**
 * Update Admin Config/Settings
 */
async function updateSetting(req, res) {
  try {
    const { key, value } = req.body;
    if (!key || value === undefined) {
      return res.status(400).json({ error: 'Key and value parameters are required.' });
    }

    const valueStr = typeof value === 'object' ? JSON.stringify(value) : String(value);

    await dbQuery.run(
      `INSERT INTO admin_settings (key, value, updated_at) VALUES (?, ?, CURRENT_TIMESTAMP)
       ON CONFLICT(key) DO UPDATE SET value=excluded.value, updated_at=CURRENT_TIMESTAMP`,
      [key, valueStr]
    );

    return res.json({ success: true, message: `Setting '${key}' updated successfully.` });
  } catch (err) {
    console.error('Update setting error:', err.message);
    return res.status(500).json({ error: err.message });
  }
}

/**
 * Delete feedback entry
 */
async function deleteFeedback(req, res) {
  try {
    const { id } = req.params;
    if (!id) {
      return res.status(400).json({ error: 'Feedback ID is required.' });
    }

    await dbQuery.run("DELETE FROM feedback WHERE id = ?", [id]);
    return res.json({ success: true, message: 'Feedback entry deleted successfully.' });
  } catch (err) {
    console.error('Delete feedback error:', err.message);
    return res.status(500).json({ error: err.message });
  }
}

module.exports = {
  adminLogin,
  logVisitor,
  getAnalytics,
  updateSetting,
  deleteFeedback
};
