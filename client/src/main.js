// This is app entry point !!!!!!!!!!!!!!
// TODO move all this to index.js in client root !!!!!!!!!!!!!!

// app - module to control application life.
// BrowserWindow - module to create native browser window.
// ipcMain - listens to renderer process and sends messages to it
// dialog - native fail dialog
import { app, BrowserWindow } from 'electron';

import winston from './utils/log';
import _ from 'lodash';

import { type as osType } from 'os';
import { join as pathJoin } from 'path';

import authData from '../dropbox-auth.json';
import DropboxClient from './api/dropboxApi.js';
import EthereumClient from './api/ethereum/ethereumApi.js';

import { startEthereum } from './main-process/fileSynchronization';

export const dropboxClient = new DropboxClient(authData.key, authData.secret);
export const ethereumClient = new EthereumClient(getDefaultIpcPath());
// Keep a global reference of the window object, if you don't, the window will
// be closed automatically when the JavaScript object is garbage collected.
let mainWindow;

function getDefaultIpcPath() {
    let ipcPath;
    const dataDirPath = getDefaultDatadir();
    switch (osType()) {
        case 'Windows_NT':
            ipcPath = '\\\\.\\pipe\\geth.ipc';
            break;
        default:
            ipcPath = pathJoin(dataDirPath, 'geth.ipc');
            break;
    }
    return ipcPath;
}

function getDefaultDatadir() {
    let dataDir;
    switch (osType()) {
        case 'Linux':
            dataDir = __dirname + '/../chain/testnet';
            break;
        case 'Darwin':
            break;
        case 'Windows_NT':
            break;
        default:
            throw new Error('osType not supported');
    }
    return dataDir;
}

function createWindow() {
    // Create the browser window.
    mainWindow = new BrowserWindow({
        width: 1200,
        height: 750
    });

    // and instantiateCompiledContractAtAddress the index.html of the app.
    mainWindow.loadURL(`file://${__dirname}/index.html`);

    // Open the DevTools.
    mainWindow.webContents.openDevTools();

    dropboxClient.authenticate()
        .then(() => winston.log('info', 'Dropbox authenticated'))
        .catch((err) => winston.log('error', err));

    startEthereum().then(() => {
        winston.info('Ethereum started (contracts deployed)');
        sendRendererEvent('status-messages', 'Ethereum started');
    });


    // Emitted when the window is closed.
    mainWindow.on('closed', function() {
        // Dereference the window object, usually you would store windows in an array if
        // your app supports multi windows, this is the time when you should delete the
        // corresponding element.
        mainWindow = null;
    });
}

export function sendRendererEvent(channel, ...args) {
    mainWindow.webContents.send(channel, _.join(args, ' '));
}


// This method will be called when Electron has finished initialization and is
// ready to create browser windows.
app.on('ready', createWindow);

// Quit when all windows are closed.
app.on('window-all-closed', function() {
    // On OS X it is common for applications and their menu bar to stay active until
    // the user quits explicitly with Cmd + Q
    if (process.platform !== 'darwin') {
        app.quit();
    }
});

app.on('activate', function() {
    // On OS X it's common to re-create a window in the app when the dock icon is
    // clicked and there are no other windows open.
    if (mainWindow === null) {
        createWindow();
    }
});

// In this file you can include the rest of your app's specific main process
// code. You can also put them in separate files and require them here.
require('./main-process/ipcListeners');
require('./main-process/fileSynchronization');


require('electron-reload')(__dirname);

