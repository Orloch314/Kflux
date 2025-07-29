const express = require('express');
const router = express.Router();
const fs = require('fs');
const path = require('path');

const WORKFLOWS_PATH = path.join(__dirname, '../data/workflows.json');

// 📘 GET: restituisce la lista dei workflow registrati
router.get('/', (req, res) => {
  try {
    const raw = fs.readFileSync(WORKFLOWS_PATH);
    const workflows = JSON.parse(raw);
    res.status(200).json(workflows);
  } catch (err) {
    console.error('[K-Flux] ❌ Errore lettura workflows.json:', err.message);
    res.status(500).json({ error: 'Errore nella lettura dei workflow' });
  }
});

// ✅ POST: salva un nuovo workflow
router.post('/', (req, res) => {
  try {
    const newWorkflow = req.body;

    // Validazione base
    if (!newWorkflow.id || !newWorkflow.name || !newWorkflow.path) {
      return res.status(400).json({ error: 'Dati incompleti: id, name e path sono obbligatori' });
    }

    let workflows = [];
    if (fs.existsSync(WORKFLOWS_PATH)) {
      const raw = fs.readFileSync(WORKFLOWS_PATH);
      workflows = JSON.parse(raw);
    }

    // Evita duplicati per ID
    const exists = workflows.some(wf => wf.id === newWorkflow.id);
    if (exists) {
      return res.status(409).json({ error: `Workflow con id ${newWorkflow.id} già esistente` });
    }

    workflows.push(newWorkflow);
    fs.writeFileSync(WORKFLOWS_PATH, JSON.stringify(workflows, null, 2));
    res.status(201).json({ message: '✅ Workflow salvato correttamente' });
  } catch (err) {
    console.error('[K-Flux] ❌ Errore salvataggio workflow:', err.message);
    if (!res.headersSent)
      res.status(500).json({ error: 'Errore salvataggio workflow' });
  }
});

// ✅ PUT: aggiorna uno specifico workflow (es. per schedule)
router.put('/:id', (req, res) => {
  const { id } = req.params;
  const updated = req.body;

  try {
    let workflows = [];
    if (fs.existsSync(WORKFLOWS_PATH)) {
      const raw = fs.readFileSync(WORKFLOWS_PATH);
      workflows = JSON.parse(raw);
    }

    const index = workflows.findIndex(wf => wf.id === id);
    if (index === -1) {
      return res.status(404).json({ error: 'Workflow non trovato' });
    }

    workflows[index] = { ...workflows[index], ...updated };

    fs.writeFileSync(WORKFLOWS_PATH, JSON.stringify(workflows, null, 2));
    res.status(200).json({ message: '✅ Workflow aggiornato correttamente' });

    // Aggiorna i cronjob in background
    setImmediate(() => {
      try {
        require('../scheduler/knimeScheduler').updateCronJobs();
      } catch (cronErr) {
        console.error('[K-Flux] ⚠️ Errore aggiornamento cron jobs:', cronErr.message);
      }
    });

  } catch (err) {
    console.error('[K-Flux] ❌ Errore aggiornamento workflow:', err.message);
    if (!res.headersSent)
      res.status(500).json({ error: 'Errore aggiornamento workflow' });
  }
});

module.exports = router;
