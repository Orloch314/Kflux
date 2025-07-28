// 🌍 Carica variabili di ambiente
require('dotenv').config();

// 📦 Import base
const express = require('express');
const cors = require('cors');
const etlRoutes = require('./routes/etl');
const workflowsRoute = require('./routes/workflows');

const app = express();

// 🧰 Middleware globali
app.use(cors());
app.use(express.json());

// 🚦 Rotte principali
app.use('/api/workflows', workflowsRoute);
app.use('/api/etl', etlRoutes); // ✅ rotte uniformate

// 🕒 Avvio dello scheduler KNIME (dopo configurazione)
require('./scheduler/knimeScheduler');

// 🔌 Porta configurabile
const PORT = process.env.PORT || 5000;

// 🚀 Avvio del server
app.listen(PORT, () => {
  console.log(`✅ K-Flux backend attivo su http://localhost:${PORT}`);
});
