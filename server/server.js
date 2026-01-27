const express = require('express');
const cors = require('cors');
const PDFDocument = require('pdfkit');
const admin = require('firebase-admin');
const fs = require('fs');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

/* ------------------------------------------------------------------
   Database Setup (Firebase with In-Memory Fallback)
------------------------------------------------------------------- */
let db;
const memoryStore = { audits: {}, leads: [] };

try {
  if (process.env.GOOGLE_APPLICATION_CREDENTIALS || fs.existsSync('./serviceAccountKey.json')) {
    admin.initializeApp({
      credential: admin.credential.applicationDefault(),
      // Or use cert if file exists: admin.credential.cert(require('./serviceAccountKey.json'))
    });
    db = admin.firestore();
    console.log('Firebase initialized successfully.');
  } else {
    throw new Error('No credentials found');
  }
} catch (error) {
  console.warn('Firebase not configured. Using in-memory storage.');
  db = null;
}

/* ------------------------------------------------------------------
   Helpers
------------------------------------------------------------------- */
async function saveAudit(data) {
  const id = Date.now().toString();
  if (db) {
    await db.collection('audits').doc(id).set(data);
  } else {
    memoryStore.audits[id] = data;
  }
  return id;
}

async function getAudit(id) {
  if (db) {
    const doc = await db.collection('audits').doc(id).get();
    return doc.exists ? doc.data() : null;
  }
  return memoryStore.audits[id] || null;
}

/* ------------------------------------------------------------------
   POST /api/audit/generate  (CONSULTATIVE LOGIC)
------------------------------------------------------------------- */
app.post('/api/audit/generate', async (req, res) => {
  try {
    const { businessSize = 'Unknown', industry = 'your industry', techStack = '', bottleneck = '', goal = '' } = req.body;

    const norm = (v) => String(v || '').trim();
    const lower = (v) => norm(v).toLowerCase();

    const size = lower(businessSize);
    const ind = lower(industry);
    const bott = lower(bottleneck);
    const stack = norm(techStack);
    const stackPreview = stack ? stack.split(',').slice(0, 6).join(', ') : 'not specified';

    /* -------------------------
       Deterministic Score
    -------------------------- */
    let score = 7;

    // Size factor: scaling complexity increases structural risk (neutral framing)
    if (size.includes('mid') || size.includes('11') || size.includes('50') || size.includes('smb')) score -= 1;
    if (size.includes('enterprise') || size.includes('100') || size.includes('large')) score -= 2;

    // Bottleneck signals
    if (bott.includes('manual') || bott.includes('ops') || bott.includes('operation')) score -= 1;
    if (bott.includes('data') || bott.includes('kpi') || bott.includes('visibility') || bott.includes('report')) score -= 1;
    if (bott.includes('handoff') || bott.includes('approval') || bott.includes('coordination')) score -= 1;
    if (bott.includes('security') || bott.includes('compliance') || bott.includes('access')) score -= 1;

    // Tool sprawl signal
    if (stack && stack.split(',').length >= 7) score -= 1;

    // Clamp to avoid extreme claims
    score = Math.max(3, Math.min(8, score));

    const readinessLabel =
      score <= 3
        ? 'Foundational Risk Signals'
        : score <= 6
        ? 'Structural Constraints Emerging'
        : 'Execution Discipline Improving';

    /* -------------------------
       Industry Context (light)
    -------------------------- */
    const industryContext =
      ind.includes('health') ? 'compliance pressure and complex data flows'
      : ind.includes('fin') ? 'regulatory sensitivity and audit expectations'
      : ind.includes('manufact') ? 'handoffs between planning and operations'
      : ind.includes('retail') ? 'inventory volatility and fragmented demand signals'
      : ind.includes('saas') ? 'fast iteration cycles and cross-team dependencies'
      : ind.includes('robot') ? 'hardware–software coordination complexity'
      : 'cross-functional execution';

    /* -------------------------
       Executive Summary (consultative)
    -------------------------- */
    const summary = [
      `Your organization shows a ${readinessLabel.toLowerCase()} profile — not due to capability gaps, but because ${industryContext} tends to amplify structural friction as scale increases.`,
      `The current stack (${stackPreview}) reflects momentum and functional coverage, but also increases the likelihood of fragmented ownership and inconsistent data definitions across teams.`,
      `This assessment highlights where coordination, visibility, and decision cadence may break under growth — before those issues surface as missed timelines, rework, or rising operational cost.`
    ].join(' ');

    /* -------------------------
       Gap Catalogue (Consequences only)
    -------------------------- */
    const gapPool = [
      {
        key: 'silos',
        gap: 'Disparate data silos across teams',
        whyItMatters: 'Decisions slow down when teams operate on different versions of the truth.'
      },
      {
        key: 'manual',
        gap: 'Manual workflows in critical operations',
        whyItMatters: 'Throughput becomes people-dependent, increasing variability as volume grows.'
      },
      {
        key: 'ownership',
        gap: 'Unclear ownership of systems and data',
        whyItMatters: 'Accountability diffuses, making root-cause analysis difficult.'
      },
      {
        key: 'visibility',
        gap: 'Limited operational visibility',
        whyItMatters: 'Corrective action arrives only after business impact is felt.'
      },
      {
        key: 'integration',
        gap: 'Tool sprawl without governance',
        whyItMatters: 'Coordination cost increases as systems grow without alignment.'
      },
      {
        key: 'security',
        gap: 'Inconsistent access controls',
        whyItMatters: 'Risk accumulates silently and surfaces during audits or incidents.'
      }
    ];

    const selected = [];
    const pick = (k) => gapPool.find(g => g.key === k);

    // Select gaps based on inputs
    if (bott.includes('data') || bott.includes('kpi') || bott.includes('report') || bott.includes('visibility')) {
      selected.push(pick('visibility'), pick('silos'));
    }
    if (bott.includes('manual') || bott.includes('ops') || bott.includes('handoff') || bott.includes('approval')) {
      selected.push(pick('manual'), pick('ownership'));
    }
    if (stack && stack.split(',').length >= 7) {
      selected.push(pick('integration'));
    }
    if (bott.includes('security') || bott.includes('compliance') || ind.includes('health') || ind.includes('fin')) {
      selected.push(pick('security'));
    }

    // Unique + ensure 3
    const unique = [];
    for (const gObj of selected.filter(Boolean)) {
      if (!unique.find(u => u.key === gObj.key)) unique.push(gObj);
    }
    while (unique.length < 3) {
      const fallback = gapPool.find(gObj => !unique.find(u => u.key === gObj.key));
      if (!fallback) break;
      unique.push(fallback);
    }

    const gapImpacts = unique.slice(0, 3).map(gObj => ({
      gap: gObj.gap,
      whyItMatters: gObj.whyItMatters
    }));

    const gaps = gapImpacts.map(gObj => gObj.gap);

    /* -------------------------
       Focus Signal (Neutral)
    -------------------------- */
    const focusSignal =
      bott.includes('sale')
        ? 'Pipeline Clarity & Handoff Discipline'
        : bott.includes('data') || bott.includes('kpi') || bott.includes('visibility')
        ? 'Decision Visibility & Measurement Cadence'
        : bott.includes('manual') || bott.includes('ops')
        ? 'Operational Throughput & Workflow Discipline'
        : bott.includes('security') || bott.includes('compliance')
        ? 'Governance Posture & Access Discipline'
        : 'Cross-Team Execution & Operating Rhythm';

    /* -------------------------
       Discovery-Only Next Steps
    -------------------------- */
    const nextSteps = [
      'Map one high-frequency workflow end-to-end, including all handoffs.',
      'List the top 10 weekly leadership decisions and where data comes from.',
      'Define systems of record for core entities and note conflicts.'
    ];

    const report = {
      input: req.body,
      timestamp: new Date().toISOString(),

      // Existing UI fields (backward compatible)
      score,
      summary,
      gaps,
      pillar: focusSignal,
      nextSteps,

      // New consultative fields (for upgraded UI)
      readinessLabel,
      gapImpacts,
      focusSignal
    };

    const id = await saveAudit(report);
    res.json({ ...report, id });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to generate report' });
  }
});

/* ------------------------------------------------------------------
   GET /api/audit/:id
------------------------------------------------------------------- */
app.get('/api/audit/:id', async (req, res) => {
  const data = await getAudit(req.params.id);
  if (!data) return res.status(404).json({ error: 'Audit not found' });
  res.json(data);
});

/* ------------------------------------------------------------------
   GET /api/audit/:id/pdf
   (PDF Fix Applied: no more "s is not defined")
------------------------------------------------------------------- */
app.get('/api/audit/:id/pdf', async (req, res) => {
  const data = await getAudit(req.params.id);
  if (!data) return res.status(404).json({ error: 'Audit not found' });

  const doc = new PDFDocument();

  res.setHeader('Content-Type', 'application/pdf');
  res.setHeader('Content-Disposition', `attachment; filename=onqo-audit-${req.params.id}.pdf`);

  doc.pipe(res);

  // Header
  doc.fontSize(26).fillColor('#a2d033').text('ONQO.', 50, 50);
  doc.fontSize(10).fillColor('#18181b').text('Digital Readiness Index', 50, 85);

  doc.moveDown(2);

  // Score
  const readiness = data.readinessLabel || 'Directional Signal';
  doc.fontSize(20).fillColor('black').text(`Readiness Index: ${data.score}/10 — ${readiness}`);
  doc.moveDown();

  // Summary
  doc.fontSize(14).text('Executive Summary');
  doc.fontSize(10).text(data.summary || '');
  doc.moveDown();

  // Structural Signals
  doc.fontSize(14).text('Structural Signals');

  const impacts = Array.isArray(data.gapImpacts) ? data.gapImpacts : [];
  if (impacts.length > 0) {
    impacts.forEach((g) => {
      doc.fontSize(10).fillColor('black').text(`• ${g.gap}`);
      doc.fontSize(9).fillColor('#555').text(`  Why this matters: ${g.whyItMatters}`);
      doc.moveDown(0.5);
    });
  } else {
    const gaps = Array.isArray(data.gaps) ? data.gaps : [];
    gaps.forEach((gap) => doc.fontSize(10).fillColor('black').text(`• ${gap}`));
  }

  doc.moveDown();

  // Focus Signal
  doc.fontSize(14).fillColor('black').text('Focus Signal');
  doc.fontSize(10).text(data.focusSignal || data.pillar || '');
  doc.moveDown();

  // Next Steps (SAFE)
  doc.fontSize(14).text('What to Examine Next');
  const steps = Array.isArray(data.nextSteps) ? data.nextSteps : [];
  steps.forEach((step, i) => {
    doc.fontSize(10).text(`${i + 1}. ${step}`);
  });

  doc.end();
});

/* ------------------------------------------------------------------
   POST /api/contact
------------------------------------------------------------------- */
app.post('/api/contact', async (req, res) => {
  const { name, email, message } = req.body;
  if (!name || !email) return res.status(400).json({ error: 'Missing fields' });

  const lead = { name, email, message, timestamp: new Date().toISOString() };

  if (db) {
    await db.collection('leads').add(lead);
  } else {
    memoryStore.leads.push(lead);
    console.log('Lead saved to memory:', lead);
  }

  res.json({ success: true });
});

/* ------------------------------------------------------------------
   Serve client in production
------------------------------------------------------------------- */
if (process.env.NODE_ENV === 'production') {
  app.use(express.static(path.join(__dirname, '../client/dist')));
  app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, '../client/dist/index.html'));
  });
}

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
