const { contextBridge, ipcRenderer } = require('electron');

// Elenco dei canali autorizzati per 'invoke'
const validInvokeChannels = [
  'get-user-name',
  'select-folder',
  'get-workflows-in-folder'
];

// Espone metodi sicuri al renderer process
contextBridge.exposeInMainWorld('electron', {
  // Invoke: comunica con il backend e riceve una risposta (con whitelist)
  invoke: (channel, data) => {
    if (validInvokeChannels.includes(channel)) {
      return ipcRenderer.invoke(channel, data);
    } else {
      console.warn(`❌ Canale IPC non autorizzato: ${channel}`);
    }
  },

  // Send: invia un messaggio senza aspettare risposta (unidirezionale)
  send: (channel, data) => ipcRenderer.send(channel, data),

  // Receive: ascolta un messaggio dal backend
  on: (channel, callback) =>
    ipcRenderer.on(channel, (event, ...args) => callback(...args)),

  // Una tantum: ascolta solo la prima risposta
  once: (channel, callback) =>
    ipcRenderer.once(channel, (event, ...args) => callback(...args)),

  // Rimuove un listener registrato
  removeListener: (channel, callback) =>
    ipcRenderer.removeListener(channel, callback)
});

