const { exec } = require('child_process')
const fs = require('fs')
const path = require('path')
const notify = require('../services/notify')

const LOGS_PATH = path.join(__dirname, '../data/logs.json')
const HISTORY_PATH = path.join(__dirname, '../data/history.json')

function runKnimeWithPath({ id, name, workflowPath, trigger = 'manual' }) {
  return new Promise((resolve, reject) => {
    const knimePath = process.env.KNIME_PATH

  if (workflowPath.endsWith('.knwf')) {
  return reject(new Error(`Il percorso ${workflowPath} è un file .knwf, serve la cartella del workflow`));
}


    if (!knimePath) {
      logEvent({ type: 'error', workflow: name, message: 'Variabile KNIME_PATH mancante' })
      return reject(new Error('Variabile KNIME_PATH mancante nel file .env'))
    }

    if (!fs.existsSync(workflowPath)) {
      logEvent({ type: 'error', workflow: name, message: `Cartella workflow non trovata:\n${workflowPath}` })
      return reject(new Error(`Cartella workflow non trovata:\n${workflowPath}`))
    }

    const startedAt = new Date()
    const command = `"${knimePath}" -nosplash -reset -application org.knime.product.KNIME_BATCH_APPLICATION -workflowDir="${workflowPath}"`

    console.log(`[K-Flux] 🚀 Avvio flusso '${name}' con comando:\n${command}`)

    exec(command, async (error, stdout, stderr) => {
      const finishedAt = new Date()
      const duration = Math.round((finishedAt - startedAt) / 1000) // in sec

      if (error) {
        logEvent({
          type: 'error',
          workflow: name,
          message: `Errore KNIME: ${error.message}`,
          timestamp: finishedAt.toISOString()
        })

        await notify.sendNotification({
          subject: `K-Flux - Errore ETL [${name}]`,
          message: `❌ Errore durante esecuzione:\n${error.message}`,
          status: 'error'
        })

        return reject(new Error(`Errore KNIME: ${error.message}`))
      }

      if (stderr) {
        logEvent({
          type: 'warning',
          workflow: name,
          message: `⚠️ stderr KNIME:\n${stderr}`,
          timestamp: finishedAt.toISOString()
        })
      }

      recordHistory({
        id,
        workflow: name,
        timestamp: finishedAt.toISOString(),
        startedAt: startedAt.toISOString(),
        finishedAt: finishedAt.toISOString(),
        duration,
        trigger,
        status: 'success',
        exitCode: 0,
        notes: 'Flusso completato senza errori'
      })

      logEvent({
        type: 'info',
        workflow: name,
        message: `✅ Completato con successo (${duration}s)`,
        timestamp: finishedAt.toISOString()
      })

      await notify.sendNotification({
        subject: `K-Flux - Flusso completato [${name}]`,
        message: `Il flusso è stato eseguito con successo in ${duration} secondi.\n\nOutput:\n${stdout}`,
        status: 'success'
      })

      resolve({
        message: 'Flusso eseguito correttamente',
        output: stdout,
        duration,
        startedAt,
        finishedAt
      })
    })
  })
}

function logEvent({ type, workflow, message, timestamp = new Date().toISOString() }) {
  const log = { timestamp, type, workflow, message }
  let logs = []

  if (fs.existsSync(LOGS_PATH)) {
    try {
      logs = JSON.parse(fs.readFileSync(LOGS_PATH))
    } catch {
      logs = []
    }
  }

  logs.push(log)
  fs.writeFileSync(LOGS_PATH, JSON.stringify(logs.slice(-100), null, 2)) // mantiene solo ultimi 100
}

function recordHistory(entry) {
  let history = []

  if (fs.existsSync(HISTORY_PATH)) {
    try {
      history = JSON.parse(fs.readFileSync(HISTORY_PATH))
    } catch {
      history = []
    }
  }

  history.push(entry)
  fs.writeFileSync(HISTORY_PATH, JSON.stringify(history.slice(-500), null, 2)) // mantiene ultimi 500
}

module.exports = runKnimeWithPath
