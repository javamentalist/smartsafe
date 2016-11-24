import { ipcMain, dialog } from 'electron';
import _ from 'lodash';
import winston from '../utils/log';

import { dropboxClient } from '../main';
import { synchronizeFolders, encryptAndUploadFileToDropbox, getFileMetadataFromEth } from './fileSynchronization';

// Message listeners
// TODO make channel names constants (channel name is first argument of .on())
// Read: http://electron.atom.io/docs/api/ipc-main/

ipcMain.on('open-file-dialog-async', (event) => {
    dialog.showOpenDialog({
        properties: ['openFile']
    }, function(filePaths) {
        if (filePaths && filePaths.length > 0) {
            let filePath = filePaths[0];
            winston.debug(`File chosen: ${filePath}`);
            // Alert renderer that file was chosen
            event.sender.send('file-chosen-async', filePath);
        } else {
            winston.debug('No file chosen');
        }
    });
    winston.debug('Dialog open called');
});

ipcMain.on('upload-file-async', (event, file) => {
    winston.log('info', `Uploading file: ${file.name} from ${file.path}`);
    event.sender.send('file-upload-started-async', file);

    const willBeEncrypted = true;

    if (willBeEncrypted) {
        encryptAndUploadFileToDropbox(file.path).then(() => {
            winston.debug('Upload done');
            event.sender.send('file-upload-finished-async', file);
            return getFilesFromDropbox(event);
        }).then(() => {
            return synchronizeFolders();
        });

    } else {
        // upload without encyption. THIS WILL BE DONE LATER, RIGHT NOW USER CANNOT CHOOSE
    }
});

ipcMain.on('delete-file-async', (event, file) => {
    dropboxClient.delete(file.path_display).then(() => {
        winston.debug(`File ${file.name} deleted from ${file.path_display}`);
    }).catch((error) => {
        winston.error(`Error deleting file from Dropbox: ${error}`);
    });
});

ipcMain.on('download-file-async', (event, file) => {
//get file metadata
//downloadFileFromDropbox(fileMetaDataFromEth)
    getFileMetadataFromEth();
});

ipcMain.on('get-files-from-dropbox-async', (event) => {
    getFilesFromDropbox(event).then((files) => {
        winston.debug(`Got db files: ${files.length}`);
    });
});

function getFilesFromDropbox(event) {
    event.sender.send('set-dropbox-loading-status-async', true);
    return dropboxClient.listFolder()
        .then((result) => {
            let files = Array.from(result);
            winston.debug(`Found ${files.length} file(s) from dropbox app folder`);
            return files;
        })
        .then((files) => {
            event.sender.send('set-dropbox-loading-status-async', false);
            event.sender.send('set-dropbox-files-async', files);
            return files;
        })
        .catch((reject) => {
            winston.debug(`Getting list of files from Dropbox failed. Reason: ${reject.error}`);
        });
}

// Logging

ipcMain.on('log-async', (event, ...args) => {
    if (args.length === 1) {
        winston.debug(args[0]);
    } else if (args.length > 1) {
        log(args[0], _.drop(args, 1));
    }
});

function log(level, ...args) {
    winston.log(level, _.join(args, ' '));
}
