const { app, BrowserWindow, ipcMain, dialog } = require('electron');
const path = require('path');

// 📂 IPC: Apertura finestra di selezione cartella
ipcMain.handle('select-folder', async () => {
  const result = await dialog.showOpenDialog({
    properties: ['openDirectory']
  });
  return result.filePaths[0] || null;
});

// 🖼️ Creazione finestra
function createWindow() {
  const win = new BrowserWindow({
    width: 1200,
    height: 800,
    webPreferences: {
      contextIsolation: true,
      nodeIntegration: false,
      preload: path.join(__dirname, 'preload.js')
    }
  });

  win.loadFile(path.join(__dirname, '..', 'frontend', 'build', 'index.html'));
  win.webContents.openDevTools(); // solo in sviluppo
}

app.whenReady().then(createWindow);

// 🔃 Gestione lifecycle su macOS
app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') app.quit();
});

app.on('activate', () => {
  if (BrowserWindow.getAllWindows().length === 0) createWindow();
});
