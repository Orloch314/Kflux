// Importa i moduli necessari
const express = require('express');
const fs = require('fs');
const path = require('path');

// Crea il router
const router = express.Router();

// Imposta il percorso del file history.json
const HISTORY_PATH = path.join(__dirname, '../data/history.json');

// Gestisci la richiesta GET sulla rotta '/'
router.get('/', (req, res) => {
  const historyDays = req.query.days ? parseInt(req.query.days, 10) : 7;  // Default a 7 giorni
  console.log(`Filtrando la cronologia per i ultimi ${historyDays} giorni.`);

  try {
    // Verifica se il file history.json esiste
    if (!fs.existsSync(HISTORY_PATH)) {
      return res.status(404).json({ error: 'File history.json non trovato.' });
    }

    const raw = fs.readFileSync(HISTORY_PATH);
    let history;
    
    try {
      history = JSON.parse(raw);
    } catch (jsonErr) {
      console.error('[K-Flux] ❌ Errore parsing JSON:', jsonErr.message);
      return res.status(500).json({ error: 'Errore nel parsing dei dati di cronologia.' });
    }

    // Filtra la cronologia in base ai giorni passati
    const filteredHistory = history.filter(item => {
      const timestamp = new Date(item.timestamp);
      if (isNaN(timestamp)) {
        console.error('[K-Flux] ❌ Timestamp non valido:', item.timestamp);
        return false;
      }

      const now = new Date();
      const timeDiff = now - timestamp;
      const dayDiff = timeDiff / (1000 * 3600 * 24);

      return dayDiff <= historyDays;
    });

    res.status(200).json(filteredHistory);
  } catch (err) {
    console.error('[K-Flux] ❌ Errore lettura history.json:', err.message);
    res.status(500).json({ error: 'Errore nella lettura della cronologia' });
  }
});

// Esporta il router
module.exports = router;
