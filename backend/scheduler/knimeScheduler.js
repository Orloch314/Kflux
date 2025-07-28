const cron = require('node-cron')
const fs = require('fs')
const path = require('path')
const runKnimeWithPath = require('../controllers/runKnimeWithPath')

const WORKFLOWS_PATH = path.join(__dirname, '../data/workflows.json')

// ✅ Carica i flussi registrati
let workflows = []
try {
  const raw = fs.readFileSync(WORKFLOWS_PATH)
  workflows = JSON.parse(raw)
} catch (err) {
  console.error('[K-Flux] ❌ Errore lettura workflows.json:', err.message)
}

workflows.forEach(flow => {
  if (flow.active && flow.schedule) {
    try {
      cron.schedule(flow.schedule, () => {
        console.log(`[K-Flux] ⏰ Scheduler attivato: ${flow.name}`)
        runKnimeWithPath({
          id: flow.id,
          name: flow.name,
          workflowPath: flow.path,
          trigger: 'scheduled'
        })
      })
      console.log(`[K-Flux] 🧠 Cron registrato per '${flow.name}': ${flow.schedule}`)
    } catch (err) {
      console.error(`[K-Flux] ❌ Errore registrando cron per '${flow.name}':`, err.message)
    }
  }
})
