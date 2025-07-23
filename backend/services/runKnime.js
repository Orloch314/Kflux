// services/runKnime.js
const { exec } = require('child_process');
const fs = require('fs');

function runKnime() {
  return new Promise((resolve, reject) => {
    const knimePath = process.env.KNIME_PATH;
    const workflowPath = process.env.WORKFLOW_PATH;

    if (!knimePath || !workflowPath) {
      return reject(new Error('KNIME_PATH o WORKFLOW_PATH non sono definiti nel file .env'));
    }

    // Verifica che la cartella del workflow esista
    if (!fs.existsSync(workflowPath)) {
      return reject(new Error(`Directory workflow non trovata: ${workflowPath}`));
    }

    // Comando per avviare KNIME in modalità batch
    const command = `"${knimePath}" -nosplash -reset -application org.knime.product.KNIME_BATCH_APPLICATION -workflowDir="${workflowPath}"`;

    console.log('Avvio comando KNIME:', command);

    exec(command, (error, stdout, stderr) => {
      if (error) {
        console.error('Errore durante l’esecuzione KNIME:', error.message);
        return reject(new Error(`Errore KNIME: ${error.message}`));
      }

      if (stderr) {
        console.warn('KNIME stderr:', stderr); // utile per debug, non blocca
      }

      resolve({
        output: stdout,
        message: 'Flusso KNIME completato con successo'
      });
    });
  });
}

module.exports = runKnime;
