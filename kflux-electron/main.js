const { app, BrowserWindow, ipcMain } = require('electron');
const path = require('path');
const fs = require('fs');
const os = require('os');
const { spawn } = require('child_process');  // 💡 aggiunto

const isDev = process.env.NODE_ENV === 'development';
const HISTORY_PATH = path.join(__dirname, '../backend/data/history.json');
const LOGS_PATH = path.join(__dirname, '../backend/data/logs.json');

// Funzione per filtrare i dati di cronologia in base ai giorni
const filterHistoryByDays = (history, days) => {
  const now = new Date();
  return history.filter(item => {
    const itemDate = new Date(item.timestamp);
    const diffTime = now - itemDate;
    const diffDays = diffTime / (1000 * 3600 * 24);
    return diffDays <= days;
  });
};


console.log('[ELECTRON DEBUG] SMTP_HOST:', process.env.SMTP_HOST);



// IPC handlers
ipcMain.handle('get-history-data', async (event, historyDays) => {
  try {
    const raw = fs.readFileSync(HISTORY_PATH);
    const data = JSON.parse(raw);
    const filteredData = historyDays ? filterHistoryByDays(data, historyDays) : data;
    return Array.isArray(filteredData) ? filteredData : [filteredData];
  } catch (err) {
    console.error('[K-Flux] ❌ Errore lettura history.json:', err.message);
    return [];
  }
});

ipcMain.handle('get-logs-data', async () => {
  try {
    if (!fs.existsSync(LOGS_PATH)) {
      console.error(`[K-Flux] ❌ Il file logs.json non esiste nel percorso: ${LOGS_PATH}`);
      return [];
    }
    const raw = fs.readFileSync(LOGS_PATH);
    const logs = JSON.parse(raw);
    return logs;
  } catch (err) {
    console.error("[K-Flux] ❌ Errore nel recupero dei logs:", err.message);
    return [];
  }
});

ipcMain.handle('get-user-name', () => {
  return os.userInfo().username;
});

ipcMain.handle('select-folder', async () => {
  const { dialog } = require('electron');
  const result = await dialog.showOpenDialog({ properties: ['openDirectory'] });
  return result.canceled ? null : result.filePaths[0];
});

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

function startBackend() {
  backendProcess = spawn('node', [path.join(__dirname, '../backend/server.js')], {
    stdio: 'inherit',
    shell: true
  });
}

let backendProcess;

app.whenReady().then(() => {
  startBackend();
  createWindow();
}).catch(console.error);

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') app.quit();
});

app.on('activate', () => {
  if (BrowserWindow.getAllWindows().length === 0) createWindow();
});

app.on('before-quit', () => {
  if (backendProcess) {
    backendProcess.kill();
  }
});
