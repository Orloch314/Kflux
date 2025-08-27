// 🌍 Carica variabili di ambiente
require('dotenv').config();

// 📦 Import base
const express = require('express');
const cors = require('cors');
const fs = require('fs');
const path = require('path');
const etlRoutes = require('./routes/etl');
const workflowsRoute = require('./routes/workflows');
const historyRouter = require('./routes/history');
//const notify = require('./services/notify');

const app = express();

// 🧰 Middleware globali
app.use(cors());
app.use(express.json());

///app.use('./services/notify', notify);

// Rotta per ottenere la cronologia
app.use('/api/history', historyRouter);

// 🚦 Rotte principali
app.use('/api/workflows', workflowsRoute);
app.use('/api/etl', etlRoutes); // ✅ rotte uniformate

// Aggiungi la rotta per ottenere i log
const LOGS_PATH = path.join(__dirname, 'data', 'logs.json');

// Rotta per ottenere i log
app.get('/api/logs', (req, res) => {
  fs.readFile(LOGS_PATH, 'utf8', (err, data) => {
    if (err) {
      console.error("Errore nel leggere il file logs.json:", err);
      return res.status(500).json({ error: "Errore nel recupero dei log." });
    }

    console.log("[DEBUG] Contenuto del file logs.json prima del parsing:", data); // Log dei dati prima del parsing

    try {
      const logs = JSON.parse(data);
      console.log('[DEBUG] Logs letti dal file logs.json:', logs); // Log dopo il parsing

      if (logs.length === 0) {
        console.warn('[WARNING] Il file logs.json è vuoto.');
      }

      res.json(logs);  // Invia i log come risposta
    } catch (parseError) {
      console.error("Errore nel parsing dei log:", parseError);
      res.status(500).json({ error: "Errore nel parsing dei log." });
    }
  });
});

// 🕒 Avvio dello scheduler KNIME (dopo configurazione)
require('./scheduler/knimeScheduler');

// 🔌 Porta configurabile
const PORT = process.env.PORT || 5000;

// 🚀 Avvio del server
app.listen(PORT, () => {
  console.log(`✅ K-Flux backend attivo su http://localhost:${PORT}`);
});
