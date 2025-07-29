const { contextBridge, ipcRenderer } = require('electron');

// Elenco dei canali autorizzati per 'invoke'
const validInvokeChannels = [
  'get-user-name',
  'select-folder',
  'get-workflows-in-folder',
  'get-history-data', // ✅ Aggiunto per abilitare il caricamento dello storico
  'get-logs-data'    // ✅ Aggiunto per abilitare il caricamento dei logs
];

console.log('Preload.js: exposing electron');

contextBridge.exposeInMainWorld('electron', {
  invoke: (channel, data) => {
    if (validInvokeChannels.includes(channel)) {
      console.log(`[PRELOAD] ✅ Canale autorizzato: ${channel}`);
      return ipcRenderer.invoke(channel, data);
    } else {
      console.warn(`❌ Canale IPC non autorizzato: ${channel}`);
    }
  },

  send: (channel, data) => ipcRenderer.send(channel, data),

  on: (channel, callback) =>
    ipcRenderer.on(channel, (event, ...args) => callback(...args)),

  once: (channel, callback) =>
    ipcRenderer.once(channel, (event, ...args) => callback(...args)),

  removeListener: (channel, callback) =>
    ipcRenderer.removeListener(channel, callback)
});
