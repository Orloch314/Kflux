const { app, BrowserWindow, ipcMain } = require('electron');
const path = require('path');
const fs = require('fs');
const os = require('os');

const isDev = process.env.NODE_ENV === 'development';
const HISTORY_PATH = path.join(__dirname, '../backend/data/history.json');
const LOGS_PATH = path.join(__dirname, '../backend/data/logs.json');  // Aggiungi questo percorso per i log

// Funzione per filtrare i dati di cronologia in base ai giorni
const filterHistoryByDays = (history, days) => {
  const now = new Date();
  return history.filter(item => {
    const itemDate = new Date(item.timestamp); // Assumendo che ogni elemento della cronologia abbia un campo timestamp
    const diffTime = now - itemDate;
    const diffDays = diffTime / (1000 * 3600 * 24); // Converte il tempo in giorni
    return diffDays <= days;
  });
};

// IPC handler per ottenere i dati della cronologia
ipcMain.handle('get-history-data', async (event, historyDays) => {
  try {
    const raw = fs.readFileSync(HISTORY_PATH);
    const data = JSON.parse(raw);

    // Filtrare i dati in base ai giorni
    const filteredData = historyDays ? filterHistoryByDays(data, historyDays) : data;

    return Array.isArray(filteredData) ? filteredData : [filteredData];
  } catch (err) {
    console.error('[K-Flux] ❌ Errore lettura history.json:', err.message);
    return [];
  }
});

// IPC handler per ottenere i dati dei log
ipcMain.handle('get-logs-data', async () => {
  try {
    // Debug: verificare il percorso del file dei logs
    //console.log("[K-Flux] Chiamata a get-logs-data...");
    //console.log("[K-Flux] Percorso dei log:", LOGS_PATH);

    // Verifica se il file esiste prima di tentare di leggerlo
    if (!fs.existsSync(LOGS_PATH)) {
      console.error(`[K-Flux] ❌ Il file logs.json non esiste nel percorso: ${LOGS_PATH}`);
      return [];
    }

    const raw = fs.readFileSync(LOGS_PATH);
    const logs = JSON.parse(raw);

    // Debug: vedere i dati che stiamo restituendo
    // console.log("[K-Flux] Dati logs ricevuti:", logs);

    return logs;  // Assicurati che questa variabile contenga i log corretti
  } catch (err) {
    console.error("[K-Flux] ❌ Errore nel recupero dei logs:", err.message);
    return [];  // Se ci sono errori, ritorna un array vuoto
  }
});

// IPC handler per ottenere il nome utente
ipcMain.handle('get-user-name', () => {
  return os.userInfo().username;
});

// IPC handler per selezionare la cartella
ipcMain.handle('select-folder', async () => {
  const { dialog } = require('electron');
  const result = await dialog.showOpenDialog({
    properties: ['openDirectory']
  });
  return result.canceled ? null : result.filePaths[0];
});

// IPC handler per ottenere i workflow nella cartella selezionata
ipcMain.handle('get-workflows-in-folder', async (event, folderPath) => {
  const entries = fs.readdirSync(folderPath, { withFileTypes: true });

  return entries
    .filter(d => d.isDirectory())
    .filter(d => fs.existsSync(path.join(folderPath, d.name, 'workflow.knime')))
    .map((d, i) => ({
      id: `wf_${i}`,
      name: d.name,
      path: path.join(folderPath, d.name),
      schedule: 'Manuale',
      lastDuration: '--',
      status: 'idle',
      active: false
    }));
});

function createWindow() {
  const win = new BrowserWindow({
    width: 1200,
    height: 800,
    title: 'K-Flux',
    webPreferences: {
      contextIsolation: true,
      nodeIntegration: false,
      preload: path.join(__dirname, 'preload.js'),
    },
  });

  const prodPath = path.join(__dirname, '..', 'frontend', 'build', 'index.html');
  
  if (isDev) {
    win.loadURL('http://localhost:3000').catch(() => win.loadFile(prodPath));
  } else {
    win.loadFile(prodPath);
  }
}

app.whenReady().then(createWindow).catch(console.error);

app.on('window-all-closed', () => { 
  if (process.platform !== 'darwin') app.quit(); 
});

app.on('activate', () => { 
  if (BrowserWindow.getAllWindows().length === 0) createWindow(); 
});
