import { ipcMain, dialog } from 'electron';
import _ from 'lodash';
import winston from '../utils/log';

import { dropboxClient, ethereumClient } from '../main';
import { encryptAndUploadFileToDropbox, getFileMetadataFromEth, uploadLocalFileMetaDataToEth, getFileFromDropboxToFileDir, synchronizeAllFiles, getUnencryptedFilePathInAppFolder } from './fileSynchronization';



// Message listeners
// TODO make channel names constants (channel name is first argument of .on())
// Read: http://electron.atom.io/docs/api/ipc-main/

ipcMain.on('open-file-dialog-async', (event) => {
    dialog.showOpenDialog({
        properties: ['openFile']
    }, function (filePaths) {
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
                winston.info(`Finished uploading ${fileData.fileName}`);
                event.sender.send('file-upload-finished-async', file);
                winston.debug('File info: ', JSON.stringify(fileData));

                return uploadLocalFileMetaDataToEth(fileData);
            })
            .then(() => {
                winston.info(`File ${file.name} successfully uploaded to Eth`);
                return getFilesFromDropboxAndCheckStatus(event);
                // return synchronizeFolders();
            });

    } else {
        // upload without encyption. THIS WILL BE DONE LATER, RIGHT NOW USER CANNOT CHOOSE
    }
});

ipcMain.on('delete-file-async', (event, file) => {
    dropboxClient.deleteFile(file.path_display)
        .then(() => {
            winston.debug(`File ${file.name} deleted from ${file.path_display}`);
            return getFilesFromDropboxAndCheckStatus(event);
        }).catch((error) => {
            winston.error(`Error deleting file from Dropbox: ${error}`);
        });
});

ipcMain.on('download-file-async', (event, file) => {
    winston.debug(`Downloading file: ${JSON.stringify(file)}`);
    // isUnencryptedFileInAppFolder(file.name).then((result) => {
    //     winston.debug(`File ${file.name} is (${result}) in app dir in unencrypted form`);
    // });
    return getFileFromDropboxToFileDir(file.ethInfo).then((fullName) => {
        winston.info(`File downloaded to ${fullName}`);
        event.sender.send('set-file-local-status', file, 'local');
    });
});

ipcMain.on('download-all-files-async', (event, file) => {
    return synchronizeAllFiles().then(() => {
        winston.info('All files downloaded');
    })
});

ipcMain.on('get-files-from-dropbox-async', (event) => {
    getFilesFromDropboxAndCheckStatus(event);
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

function getFileDataFromChain(event) {
    return ethereumClient.getUserFilesHashes()
        .then((userFileHashes) => {

            _.forEach(userFileHashes, (fileHash) => {
                winston.debug(`Searhing for metadata from eth for hash ${fileHash}`);
                ethereumClient.findFileMetaDataFromEthChain(fileHash).then((metaData) => {
                    // Add file hash to be used later
                    metaData.hash = fileHash;
                    winston.debug(`Found metadata from eth: ${JSON.stringify(metaData)}`);
                    event.sender.send('file-status-changed', metaData, 'protected');
                });
            });

            winston.debug('Got file hashes from Eth', JSON.stringify(userFileHashes));
        });
}

function getFilesStatusOnDisc(event, files) {
    _.forEach(files, (file) => {
        getUnencryptedFilePathInAppFolder(file.name).then((filePath) => {
            event.sender.send('set-file-local-unencrypted-path', file, filePath);
        })
    });
}

function getFilesFromDropboxAndCheckStatus(event) {
    return getFilesFromDropbox(event)
        .then((files) => {
            winston.debug(`Got ${files.length} files form dropbox`);

            return getFilesStatusOnDisc(event, files);
        }).then((files) => {
            // Also find file status from chain
            return getFileDataFromChain(event);
        });
}

// Logging

ipcMain.on('log-async', (event, ...args) => {
    if (args.length === 1) {
        winston.debug(args[0]);
    } else if (args.length > 1) {
        const level = args[0],
            msg = _.drop(args, 1);
        winston.log(level, _.join(msg, ' '));
    }
});
