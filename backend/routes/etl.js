const express = require('express');
const router = express.Router();
const fs = require('fs');
const path = require('path');
require('dotenv').config();

const runKnimeWithPath = require('../services/runKnimeWithPath');
const notify = require('../services/notify');

router.post('/', async (req, res) => {
  const { workflowPath } = req.body;

  if (!workflowPath) {
    console.error('❌ workflowPath mancante');
    return res.status(400).json({ error: 'Parametro workflowPath richiesto' });
  }

  // ✅ Interpreta workflowPath come percorso assoluto (qualsiasi path locale valido)
  const fullPath = path.resolve(workflowPath);

  // 🔐 Validazione: la cartella deve esistere
  if (!fs.existsSync(fullPath)) {
    console.error('❌ Cartella non trovata:', fullPath);

    await notify.sendNotification({
      subject: 'K-Flux - Errore percorso ETL',
      message: `Cartella flusso non trovata:\n\n${fullPath}`,
      status: 'error'
    });

    return res.status(400).json({ error: 'Cartella del flusso inesistente' });
  }

  try {
    console.log(`🟢 Avvio flusso KNIME su: ${fullPath}`);

    const result = await runKnimeWithPath(fullPath);

    await notify.sendNotification({
      subject: 'K-Flux - Flusso completato',
      message: `Il flusso è stato eseguito con successo:\n\n${result.output}`,
      status: 'success'
    });

    res.status(200).json({
      message: 'Flusso eseguito correttamente',
      details: result
    });
  } catch (err) {
    console.error('💥 Errore durante il flusso ETL:', err);

    await notify.sendNotification({
      subject: 'K-Flux - Errore ETL',
      message: `Errore durante l'esecuzione:\n\n${err.message}`,
      status: 'error'
    });

    res.status(500).json({
      error: 'Errore durante il flusso ETL',
      details: err.message
    });
  }
});

module.exports = router;
