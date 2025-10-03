const express = require('express');
const app = express();
const port = process.env.PORT || 3000;

app.use(express.json());

// Log all incoming requests for debugging
app.use((req, res, next) => {
  console.log(`${new Date().toISOString()} - ${req.method} ${req.path} from ${req.ip}`);
  next();
});

// Health route for probes and API (requirements: GET /health → { status: "ok" })
app.get('/health', (req, res) => {
  console.log('Health check requested');
  res.json({ status: 'ok' });
});

// Time route (requirements: GET /time → server time and GCP region)
app.get('/time', (req, res) => {
  const region = process.env.GCP_REGION || 'us-central1'; // From env or default
  console.log('Time endpoint requested');
  res.json({ 
    time: new Date().toISOString(), 
    region: region 
  });
});

// Version route (requirements: GET /version → git commit SHA from env)
app.get('/version', (req, res) => {
  const sha = process.env.GIT_COMMIT_SHA || 'unknown';
  console.log('Version endpoint requested');
  res.json({ version: sha });
});

// Fallback for unmatched routes (logs 404s)
app.use((req, res) => {
  console.log(`404 - No route for ${req.path}`);
  res.status(404).json({ error: 'Not found' });
});

// Global error handler (bonus – catches unhandled errors)
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Internal server error' });
});

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
