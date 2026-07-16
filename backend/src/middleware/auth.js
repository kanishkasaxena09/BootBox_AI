const crypto = require('crypto');
require('dotenv').config();

if (!process.env.ADMIN_PASSWORD) {
  console.error('FATAL: ADMIN_PASSWORD is not set in .env file.');
  process.exit(1);
}
const expectedToken = crypto.createHash('sha256').update(process.env.ADMIN_PASSWORD).digest('hex');

const verifyAdminToken = (req, res, next) => {
  const authHeader = req.headers['x-admin-token'] || req.headers['authorization'];
  
  if (!authHeader) {
    return res.status(401).json({ error: 'Access denied. Authorization token missing.' });
  }

  // Handle both header types: 'x-admin-token: token' or 'Authorization: Bearer token'
  let token = authHeader;
  if (authHeader.startsWith('Bearer ')) {
    token = authHeader.substring(7);
  }

  if (token !== expectedToken) {
    return res.status(403).json({ error: 'Access denied. Invalid authorization token.' });
  }

  next();
};

module.exports = {
  verifyAdminToken,
  expectedToken
};
