const cron = require('node-cron');
const fs = require('fs');
const path = require('path');
const runKnimeWithPath = require('../controllers/runKnimeWithPath');

const WORKFLOWS_PATH = path.join(__dirname, '../data/workflows.json');

let cronJobs = {}; // Map dei cronJob attivi

// ✅ Funzione per aggiornare i cron job da zero
function updateCronJobs() {
  let workflows = [];

  try {
    const raw = fs.readFileSync(WORKFLOWS_PATH);
    workflows = JSON.parse(raw);
  } catch (err) {
    console.error('[K-Flux] ❌ Errore lettura workflows.json:', err.message);
    return;
  }

  // 🔄 Ferma cron job esistenti
  for (const jobId in cronJobs) {
    cronJobs[jobId].stop();
    delete cronJobs[jobId];
    console.log(`[K-Flux] 🛑 Cron fermato per ID ${jobId}`);
  }

  // ✅ Registra nuovi cron job
  workflows.forEach(flow => {
    if (flow.active && flow.schedule) {
      try {
        const job = cron.schedule(flow.schedule, () => {
          console.log(`[K-Flux] ⏰ Scheduler attivato: ${flow.name}`);
          runKnimeWithPath({
            id: flow.id,
            name: flow.name,
            workflowPath: flow.path,
            trigger: 'scheduled'
          });
        });

        cronJobs[flow.id] = job;
        console.log(`[K-Flux] 🧠 Cron registrato per '${flow.name}': ${flow.schedule}`);
      } catch (err) {
        console.error(`[K-Flux] ❌ Errore registrando cron per '${flow.name}':`, err.message);
      }
    }
  });
}

// ⚡ Avvia all'avvio
updateCronJobs();

// 🔁 Esporta la funzione per richiamarla dopo PUT
module.exports = {
  updateCronJobs
};
