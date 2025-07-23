const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('electron', {
  // Invoke: comunica con il backend e riceve una risposta
  invoke: (channel, data) => ipcRenderer.invoke(channel, data),

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
