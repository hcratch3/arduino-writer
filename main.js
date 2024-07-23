const { app, BrowserWindow, ipcMain, dialog } = require('electron');
const path = require('path');
const fs = require('fs');
const { exec } = require('child_process');

function createWindow() {
  const mainWindow = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
      contextIsolation: true,
      enableRemoteModule: false,
      nodeIntegration: false,
    }
  });

  mainWindow.loadFile('index.html');
}

// New function to create the settings window
function createSettingsWindow() {
  const settingsWindow = new BrowserWindow({
    width: 400,
    height: 300,
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
      contextIsolation: true,
      enableRemoteModule: false,
      nodeIntegration: false,
    }
  });

  settingsWindow.loadFile('setting.html');
}

ipcMain.handle('open-file-dialog', async () => {
  const result = await dialog.showOpenDialog({
    properties: ['openFile'],
    filters: [{ name: 'Arduino Files', extensions: ['ino'] }]
  });
  return result.filePaths[0] || null;
});

ipcMain.on('open-settings', () => {
  createSettingsWindow();
});

app.whenReady().then(() => {
  createWindow();

  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) {
      createWindow();
    }
  });
});

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

ipcMain.on('execute-command', (event, command) => {
  exec(command, (error, stdout, stderr) => {
    if (error) {
      event.reply('command-result', `Error: ${error.message}`);
      return;
    }
    if (stderr) {
      event.reply('command-result', `stderr: ${stderr}`);
      return;
    }
    event.reply('command-result', `stdout: ${stdout}`);
  });
});
