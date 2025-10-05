const express = require('express');
const cors = require('cors');
const app = express();
const port = process.env.PORT || 3000;

app.use(express.json());
app.use(cors({ origin: '*' })); // Update to your frontend domain in prod

// Log all incoming requests

   const region = process.env.GCP_REGION || 'unknown';
   const version = process.env.GIT_COMMIT_SHA || 'unknown';

   app.get('/health', (req, res) => {
     console.log('Health check requested');
     res.json({ status: 'ok' });
   });

   app.get('/api/health', (req, res) => {
     console.log('Health check requested');
     res.json({ status: 'ok' });
   });

   app.get('/api/time', (req, res) => {
     res.json({ time: new Date().toISOString(), region });
   });

   app.get('/api/version', (req, res) => {
     res.json({ version });
   });

   app.use((req, res) => {
     console.log(`${new Date().toISOString()} - ${req.method} ${req.path} from ${req.ip}`);
     res.status(404).json({ error: 'Not found' });
   });

   app.listen(port, () => {
     console.log(`Server running on port ${port}`);
   });