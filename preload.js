// preload.js
const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('electron', {
  openFileDialog: () => ipcRenderer.invoke('open-file-dialog'),
  executeCommand: (command) => ipcRenderer.send('execute-command', command),
  onCommandResult: (callback) => ipcRenderer.on('command-result', (event, result) => callback(result)),
  openSettings: () => ipcRenderer.send('open-settings')
});
