import express from 'express';
import cors from 'cors';

const app = express();
const port = process.env.PORT || 10000;

app.use(cors());
app.use(express.json());

app.get('/healthz', (_req, res) => {
  res.json({ ok: true, app: 'Pixelly API' });
});

app.get('/api/meta', (_req, res) => {
  res.json({
    brand: 'Pixelly',
    stage: 'v1 reset',
    nextBuild: 'roles-signup-trials'
  });
});

app.get('/api/owner/dashboard', (_req, res) => {
  res.json({
    notifications: [
      { id: 1, client: 'Harper Estates', category: 'Residential', requested: '2026-03-18 09:00', status: 'pending' },
      { id: 2, client: 'Ella Morgan', category: 'Wedding / Proposal', requested: '2026-03-20 12:00', status: 'pending' }
    ],
    summary: {
      trialDaysRemaining: 10,
      teamMembers: 4,
      subscriptionBase: 49,
      extraMemberPrice: 10
    }
  });
});

app.listen(port, () => {
  console.log(`Pixelly API running on http://localhost:${port}`);
});
