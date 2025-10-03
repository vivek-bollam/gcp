console.log('Test CI/CD deploy');
const express = require('express');
const app = express();
const port = process.env.PORT || 3000;

app.use(express.json());

// Log all incoming requests for debugging
app.use((req, res, next) => {
  console.log(`${new Date().toISOString()} - ${req.method} ${req.path} from ${req.ip}`);
  next();
});

// Health route for probes (keeps pod healthy)
app.get('/health', (req, res) => {
  console.log('Health check (probe) requested');
  res.json({ status: 'ok' });
});

// API health route for frontend/Ingress
app.get('/api/health', (req, res) => {
  console.log('API health check requested');
  res.json({ status: 'ok' });
});

// Fallback for unmatched routes (logs 404s)
app.use((req, res) => {
  console.log(`404 - No route for ${req.path}`);
  res.status(404).json({ error: 'Not found' });
});

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
