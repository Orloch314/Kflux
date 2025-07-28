const { app, BrowserWindow, ipcMain } = require('electron');
const path = require('path');
const fs = require('fs');
const os = require('os');

const isDev = process.env.NODE_ENV === 'development';

// ✅ Ottieni nome utente
ipcMain.handle('get-user-name', () => {
  return os.userInfo().username;
});

// ✅ Selettore cartella
ipcMain.handle('select-folder', async () => {
  const { dialog } = require('electron');
  const result = await dialog.showOpenDialog({
    properties: ['openDirectory']
  });
  return result.canceled ? null : result.filePaths[0];
});

// ✅ Leggi i workflow dalla cartella selezionata
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
app.on('window-all-closed', () => { if (process.platform !== 'darwin') app.quit(); });
app.on('activate', () => { if (BrowserWindow.getAllWindows().length === 0) createWindow(); });
