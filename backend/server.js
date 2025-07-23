// 🌍 Carica variabili di ambiente
require('dotenv').config();

// 🕒 Avvio dello scheduler KNIME
require('./scheduler/knimeScheduler');

// 📦 Import base
const express = require('express');
const cors = require('cors');
const etlRoutes = require('./routes/etl');

const app = express();

// 🧰 Middleware globali
app.use(cors());
app.use(express.json());

// 🚦 Rotte principali
app.use('/run-etl', etlRoutes); // endpoint: POST http://localhost:5000/run-etl

// 🔌 Porta configurabile
const PORT = process.env.PORT || 5000;

// 🚀 Avvio del server
app.listen(PORT, () => {
  console.log(`✅ K-Flux backend attivo su http://localhost:${PORT}`);
});
