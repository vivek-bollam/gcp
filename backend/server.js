const express = require('express');
const cors = require('cors');
const app = express();
const port = process.env.PORT || 3000;

app.use(express.json());
app.use(cors({ origin: '*' })); // Update to your frontend domain in prod

// Log all incoming requests
app.use((req, res, next) => {
  console.log(`${new Date().toISOString()} - ${req.method} ${req.path} from ${req.ip}`);
  next();
});

// Health route for probes (internal)
app.get('/health', (req, res) => {
  console.log('Health check requested');
  res.json({ status: 'ok' });
});

// API routes (external)
app.get('/api/health', (req, res) => {
  console.log('API health check requested');
  res.json({ status: 'ok' });
});

app.get('/api/time', (req, res) => {
  const region = process.env.GCP_REGION || 'us-central1';
  console.log('Time endpoint requested');
  res.json({ time: new Date().toISOString(), region: region });
});

app.get('/api/version', (req, res) => {
  const sha = process.env.GIT_COMMIT_SHA || 'unknown';
  console.log('Version endpoint requested');
  res.json({ version: sha });
});

// Fallback for unmatched routes
app.use((req, res) => {
  console.log(`404 - No route for ${req.path}`);
  res.status(404).json({ error: 'Not found' });
});

// Error handler
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Internal server error' });
});

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
