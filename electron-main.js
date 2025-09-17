
const { app, BrowserWindow, ipcMain, screen } = require('electron');
const path = require('path');
const isDev = require('electron-is-dev');
const { updateElectronApp } = require('update-electron-app');

updateElectronApp();

function createWindow() {
  const { width, height } = screen.getPrimaryDisplay().workAreaSize;

  const mainWindow = new BrowserWindow({
    width: width,
    height: height,
    webPreferences: {
      preload: path.join(__dirname, 'electron-preload.js'),
      contextIsolation: true,
      nodeIntegration: false,
    },
    icon: path.join(__dirname, 'public/icons/icon.png'),
    show: false, // Don't show the window until it's ready
  });

  const appUrl = isDev
    ? 'http://localhost:9002' // URL for Next.js dev server
    : `file://${path.join(__dirname, 'out/index.html')}`;

  mainWindow.loadURL(appUrl);

  // Show the window when the content is ready
  mainWindow.once('ready-to-show', () => {
    mainWindow.maximize();
    mainWindow.show();
  });

  // Open DevTools in dev mode
  if (isDev) {
    mainWindow.webContents.openDevTools();
  }
}

app.whenReady().then(() => {
  createWindow();

  app.on('activate', function () {
    if (BrowserWindow.getAllWindows().length === 0) createWindow();
  });
});

app.on('window-all-closed', function () {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

// IPC example
ipcMain.on('to-main', (event, arg) => {
  console.log(arg); 
});
