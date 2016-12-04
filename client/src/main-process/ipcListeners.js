import { ipcMain, dialog } from 'electron';
import _ from 'lodash';
import winston from '../utils/log';

import { dropboxClient, ethereumClient } from '../main';
import { synchronizeFolders, encryptAndUploadFileToDropbox, getFileMetadataFromEth, uploadLocalFileMetaDataToEth } from './fileSynchronization';

// Message listeners
// TODO make channel names constants (channel name is first argument of .on())
// Read: http://electron.atom.io/docs/api/ipc-main/

ipcMain.on('open-file-dialog-async', (event) => {
    dialog.showOpenDialog({
        properties: ['openFile']
    }, function(filePaths) {
        if (filePaths && filePaths.length > 0) {
            let filePath = filePaths[0];
            winston.info(`File chosen for upload: ${filePath}`);
            // Alert renderer that file was chosen
            event.sender.send('file-chosen-async', filePath);
        } else {
            winston.info('No file chosen for upload');
        }
    });
    winston.debug('Dialog open called');
});

ipcMain.on('upload-file-async', (event, file) => {
    winston.info(`Uploading file: ${file.name} from ${file.path}`);
    event.sender.send('file-upload-started-async', file);

    const willBeEncrypted = true;

    if (willBeEncrypted) {
        encryptAndUploadFileToDropbox(file.path)
            .then((fileData) => {
                winston.info(`Finished uploading ${file.name}`);
                event.sender.send('file-upload-finished-async', file);
                winston.debug('File info: ', JSON.stringify(fileData));

                // just start updating file list, don't wait for it to complete before continuing
                // it's not necessary for what comes next, it's just so that user can see his file in the list
                getFilesFromDropbox(event);

                return uploadLocalFileMetaDataToEth(fileData);
                // return true;
            })
            .then(() => {
                winston.info(`File ${file.name} successfully uploaded to Eth`);
                // ethereumClient.getUserFilesHashes().then((userFileHashes) => {
                //     winston.debug('Got file hashes from Eth', JSON.stringify(userFileHashes));
                // });
                // return synchronizeFolders();
            });
    } else {
        // upload without encyption. THIS WILL BE DONE LATER, RIGHT NOW USER CANNOT CHOOSE
    }
});

ipcMain.on('delete-file-async', (event, file) => {
    dropboxClient.deleteFile(file.path_display).then(() => {
        winston.debug(`File ${file.name} deleted from ${file.path_display}`);
        return getFilesFromDropbox(event);
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
        const   level = args[0],
                msg = _.drop(args,1);
        winston.log(level, _.join(msg, ' '));
    }
});
