// This is app entry point !!!!!!!!!!!!!!
// TODO move all this to index.js in client root !!!!!!!!!!!!!!

// app - module to control application life.
// BrowserWindow - module to create native browser window.
// ipcMain - listens to renderer process and sends messages to it
// dialog - native fail dialog
import {app, BrowserWindow, ipcMain, dialog} from 'electron'

import winston from './utils/log'
import _ from 'lodash'

import authData  from '../dropbox-auth.json'
import DropboxClient from './api/dropboxApi'


const dropboxClient = new DropboxClient(authData.key, authData.secret)

// Keep a global reference of the window object, if you don't, the window will
// be closed automatically when the JavaScript object is garbage collected.
let mainWindow

function createWindow() {
  // Create the browser window.
  mainWindow = new BrowserWindow({
    width: 800,
    height: 600
  })

  // and load the index.html of the app.
  mainWindow.loadURL(`file://${__dirname}/index.html`)

  // Open the DevTools.
  mainWindow.webContents.openDevTools()

  startDropbox();

  // Emitted when the window is closed.
  mainWindow.on('closed', function() {
    // Dereference the window object, usually you would store windows in an array if
    // your app supports multi windows, this is the time when you should delete the
    // corresponding element.
    mainWindow = null
  })
}

// This method will be called when Electron has finished initialization and is
// ready to create browser windows.
app.on('ready', createWindow);

// Quit when all windows are closed.
app.on('window-all-closed', function() {
  // On OS X it is common for applications and their menu bar to stay active until
  // the user quits explicitly with Cmd + Q
  if (process.platform !== 'darwin') {
    app.quit()
  }
})

app.on('activate', function() {
  // On OS X it's common to re-create a window in the app when the dock icon is
  // clicked and there are no other windows open.
  if (mainWindow === null) {
    createWindow()
  }
})

// In this file you can include the rest of your app's specific main process
// code. You can also put them in separate files and require them here.


function startDropbox() {
  dropboxClient.authenticate()
    .then(() => log('info', 'Dropbox authenticated'))
    .catch((err) => log('error', err));
}

// Message listeners
// TODO make channel names constants (channel name is first argument of .on())
// Read: http://electron.atom.io/docs/api/ipc-main/

ipcMain.on('open-file-dialog-async', (event) => {
  dialog.showOpenDialog({
    properties: ['openFile']
  }, function(filePaths) {
    if (filePaths && filePaths.length > 0) {
      let filePath = filePaths[0];
      logDebug(`File chosen: ${filePath}`);
      // Alert renderer that file was chosen
      event.sender.send('file-chosen-async', filePath);
    } else {
      logDebug('No file chosen');
    }
  })
  logDebug('Dialog open called');
})

ipcMain.on('upload-file-async', (event, file) => {
  winston.log('info', `Uploading file: ${file.name} from ${file.path}`)

// When done, send response
// event.sender.send('asynchronous-reply', 'contents')
})

//this.props.actions.setAuthStatus(true);

ipcMain.on('get-files-from-dropbox-async', (event) => {

  dropboxClient.listFolder().then((result) => {
    let files = Array.from(result);

    if (files.length !== 0) {
      logDebug(`Found ${files.length} file(s)`);
      files.forEach(res => {
        logDebug(`- Name: ${res.name}`);
      });
    } else {
      logDebug('Found no files in app folder');
    }
    event.sender.send('set-dropbox-files-async', files);
    return files;
  }).catch((reject) => {
    logDebug(reject.error);
  });
});

ipcMain.on('log-async', (event, ...args) => {
  if (args.length === 1) {
    logDebug(args[0]);
  } else if (args.length > 1) {
    log(args[0], _.drop(args, 1));
  }
});

function logDebug(logString) {
  winston.log('debug', logString)
}
function log(level, args) {
  winston.log(level, _.join(args, ' '));
}


require('electron-reload')(__dirname);
