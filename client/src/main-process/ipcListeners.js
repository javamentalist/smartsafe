import { ipcMain, dialog } from 'electron'
import _ from 'lodash'
import winston from '../utils/log'

import { dropboxClient } from '../main'
import { synchronizeFolders, uploadLocalFilesToDropbox, uploadEncryptedLocalFilesToDropbox } from './fileSynchronization'

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
  winston.log('info', `Uploading file: ${file.name} from ${file.path}`);
  event.sender.send('file-upload-started-async', file);

  const willBeEncrypted = true;

  if (willBeEncrypted) {
    // TODO add hash - WHERE TO GET THE HASH???
    uploadEncryptedLocalFilesToDropbox(file.name, '').then(() => {
      logDebug('Upload done');
      event.sender.send('file-upload-finished-async', file);
      return getFilesFromDropbox(event);
    }).then(() => {
      return synchronizeFolders()
    });

  } else {
    // upload without encyption. THIS WILL BE DONE LATER, RIGHT NOW USER CANNOT CHOOSE
  }
})

ipcMain.on('delete-file-async', (event, file) => {
  dropboxClient.delete(file.path_display).then(() => {
    logDebug(`File ${file.name} deleted from ${file.path_display}`);
  }).catch((error) => {
  })
});

ipcMain.on('download-file-async', (event, file) => {

});

ipcMain.on('get-files-from-dropbox-async', (event) => {
  getFilesFromDropbox(event);
});

function getFilesFromDropbox(event) {
  event.sender.send('set-dropbox-loading-status-async', true);
  return dropboxClient.listFolder()
    .then((result) => {
      let files = Array.from(result);

      if (files.length !== 0) {
        logDebug(`Found ${files.length} file(s)`);
        files.forEach(res => {
          logDebug(`- Name: ${res.name}`);
        });
      } else {
        logDebug('Found no files in app folder');
      }
      return files;
    })
    .then((files) => {
      event.sender.send('set-dropbox-loading-status-async', false);
      event.sender.send('set-dropbox-files-async', files);
    })
    .catch((reject) => {
      logDebug(reject.error);
    });
}

// Logging

ipcMain.on('log-async', (event, ...args) => {
  if (args.length === 1) {
    logDebug(args[0]);
  } else if (args.length > 1) {
    log(args[0], _.drop(args, 1));
  }
});

function logDebug(err) {
  winston.log('debug', err)
}
function logError(err) {
  winston.log('error', err)
}
function log(level, ...args) {
  winston.log(level, _.join(args, ' '));
}
