const express = require('express')
const router = express.Router()
const fs = require('fs')
const path = require('path')

const runKnimeWithPath = require('../controllers/runKnimeWithPath')
const notify = require('../services/notify')
const WORKFLOWS_PATH = path.join(__dirname, '../data/workflows.json')

// ✅ POST /api/etl/:id — Avvia flusso per ID da workflows.json
router.post('/:id', async (req, res) => {
  const workflowId = req.params.id

  let workflows = []
  try {
    const raw = fs.readFileSync(WORKFLOWS_PATH)
    workflows = JSON.parse(raw)
  } catch (err) {
    console.error('[K-Flux] ❌ Errore lettura workflows.json:', err.message)
    return res.status(500).json({ error: 'Errore lettura lista workflow' })
  }

  const flow = workflows.find(f => f.id === workflowId)

  if (!flow || !flow.path) {
    console.error(`❌ Flusso '${workflowId}' non trovato`)
    return res.status(404).json({ error: 'Workflow non trovato' })
  }

  const fullPath = path.resolve(flow.path)
  if (!fs.existsSync(fullPath)) {
    console.error('❌ Cartella non trovata:', fullPath)

    await notify.sendNotification({
      subject: `K-Flux - Errore percorso ETL [${flow.name}]`,
      message: `Cartella flusso non trovata:\n\n${fullPath}`,
      status: 'error'
    })

    return res.status(400).json({ error: 'Cartella del flusso inesistente' })
  }

  try {
    console.log(`🟢 Avvio flusso KNIME: ${flow.name}`)

    const result = await runKnimeWithPath({
      id: flow.id,
      name: flow.name,
      workflowPath: fullPath,
      trigger: 'manual'
    })

    res.status(200).json({ message: 'Flusso eseguito correttamente', details: result })
  } catch (err) {
    console.error('💥 Errore durante esecuzione ETL:', err.message)

    await notify.sendNotification({
      subject: `K-Flux - Errore ETL [${flow.name}]`,
      message: `Errore durante esecuzione:\n\n${err.message}`,
      status: 'error'
    })

    res.status(500).json({ error: 'Errore durante il flusso ETL', details: err.message })
  }
})
module.exports = router