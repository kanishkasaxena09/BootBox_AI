const express = require('express');
const cors = require('cors');
const path = require('path');
require('dotenv').config();

const apiRouter = require('./src/routes');
const { db } = require('./src/config/db'); // Trigger DB initialization

const app = express();

// Request logger to aid debugging
app.use((req, res, next) => {
  try { console.log('REQ', req.method, req.originalUrl); } catch (e) {}
  next();
});
const PORT = process.env.PORT || 5000;

// Enable CORS
app.use(cors({
  origin: '*', // Allow all origins for testing/local setups
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'x-admin-token']
}));

// Support parsing JSON and URL-encoded bodies
app.use(express.json({ limit: '20mb' }));
app.use(express.urlencoded({ limit: '20mb', extended: true }));

// Serve static assets if any (e.g., templates or preview uploads)
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Temporary debug endpoint to trace incoming POST requests
app.post('/api/debug', (req, res) => {
  console.log('DEBUG REQ', req.method, req.originalUrl, 'headers:', JSON.stringify(req.headers));
  res.json({ ok: true });
});

// Direct resume PDF endpoint (bypasses router) to verify generation
const careerController = require('./src/controllers/careerController');
app.post('/resume/pdf', careerController.generateResumePdf);

// Wire the unified router under /api
app.use('/api', apiRouter);

// Welcome/Status endpoint
app.get('/', (req, res) => {
  res.json({
    name: "BootBox AI Backend API Gateway",
    status: "active",
    healthCheck: "/health",
    frontendUrl: "http://localhost:5173"
  });
});

// Basic health check endpoint
app.get('/health', (req, res) => {
  res.json({ status: 'healthy', timestamp: new Date() });
});

// Start express server
app.listen(PORT, () => {
  console.log(`=============================================`);
  console.log(`  AI Career & Document Platform Server Running`);
  console.log(`  Port: http://localhost:${PORT}`);
  console.log(`  Time: ${new Date().toISOString()}`);
  console.log(`=============================================`);
});