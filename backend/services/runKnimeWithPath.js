const { exec } = require('child_process');
const fs = require('fs');
require('dotenv').config();

function runKnimeWithPath(workflowPath) {
  return new Promise((resolve, reject) => {
    const knimePath = process.env.KNIME_PATH;

    // 🔍 Validazione: KNIME_PATH e cartella esistente
    if (!knimePath) {
      return reject(new Error('Variabile KNIME_PATH mancante nel file .env'));
    }

    if (!fs.existsSync(workflowPath)) {
      return reject(new Error(`Cartella workflow non trovata:\n${workflowPath}`));
    }

    // ✅ Comando CLI per avviare KNIME
    const command = `"${knimePath}" -nosplash -reset -application org.knime.product.KNIME_BATCH_APPLICATION -workflowDir="${workflowPath}"`;

    console.log('[K-Flux] 🚀 Avvio KNIME con comando:\n', command);

    exec(command, (error, stdout, stderr) => {
      if (error) {
        console.error('[K-Flux] ❌ Errore KNIME:', error);
        return reject(new Error(`Errore durante esecuzione KNIME:\n${error.message}`));
      }

      if (stderr) {
        console.warn('[K-Flux] ⚠️ stderr KNIME:\n', stderr);
      }

      resolve({
        output: stdout,
        message: 'Flusso KNIME eseguito con successo'
      });
    });
  });
}

module.exports = runKnimeWithPath;