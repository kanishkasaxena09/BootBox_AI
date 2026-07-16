const { dbQuery } = require('../config/db');

async function getCalcConfig(req, res) {
  try {
    const setting = await dbQuery.get("SELECT value FROM admin_settings WHERE key = 'cgpa_formula'");
    const formulaMultiplier = parseFloat(setting ? setting.value : '9.5');
    
    // Log tool usage log (calculators don't upload files, but we log usage)
    await dbQuery.run(
      `INSERT INTO tool_usage_log (tool_category, tool_name, processing_time_ms, input_size_bytes) VALUES (?, ?, ?, ?)`,
      ['calculator', 'config-fetch', 1, 0]
    );

    return res.json({ cgpaFormulaMultiplier: formulaMultiplier });
  } catch (err) {
    console.error('Calculator config controller error:', err.message);
    return res.status(500).json({ error: err.message });
  }
}

module.exports = {
  getCalcConfig
};
