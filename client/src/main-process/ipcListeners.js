import { ipcMain, dialog } from 'electron';
import Promise from 'bluebird';
import _ from 'lodash';
import winston from '../utils/log';

import { dropboxClient, ethereumClient, sendRendererEvent } from '../main';
import { startEthereum, encryptAndUploadFileToDropbox, getFileHashesFromEth, getFullPathForFileName, uploadLocalFileMetaDataToEth, getFileFromDropboxToFileDir, synchronizeAllFiles, getUnencryptedFilePathInAppFolder, getHashForFile, downloadMetaDataFromEthWithHash, prepareFileDataForFiles } from './fileSynchronization';

export const ipcEvents = {
    main: {
        OPEN_FILE_DIALOG_ASYNC: 'open-file-dialog-async',
        UPLOAD_FILE_ASYNC: 'upload-file-async',
        DELETE_FILE_ASYNC: 'delete-file-async',
        DOWNLOAD_FILE_ASYNC: 'download-file-async',
        DOWNLOAD_ALL_FILES_ASYNC: 'download-all-files-async',
        GET_FILES_FROM_DROPBOX_ASYNC: 'get-files-from-dropbox-async',
        LOG_ASYNC: 'log-async'
    },
    renderer: {
        FILE_CHOSEN_ASYNC: 'file-chosen-async',
        FILE_UPLOAD_STARTED_ASYNC: 'file-upload-started-async',
        FILE_UPLOAD_FINISHED_ASYNC: 'file-upload-finished-async',
        SET_FILE_LOCAL_STATUS: 'set-file-local-status',
        SET_DROPBOX_LOADING_STATUS_ASYNC: 'set-dropbox-loading-status-async',
        SET_DROPBOX_FILES_ASYNC: 'set-dropbox-files-async',
        SET_FILE_LOCAL_UNENCRYPTED_PATH: 'set-file-local-unencrypted-path',
        SET_FILE_PROTECTION_STATUS: 'set-file-protection-status'
    }
};

function setStatusMessage(message) {
    sendRendererEvent('status-messages', message);
}


// Message listeners
// TODO make channel names constants (channel name is first argument of .on())
// Read: http://electron.atom.io/docs/api/ipc-main/
// This almost works, but importing constants in view makes app go blank with a cryptic error

ipcMain.on('app-loaded', () => {
    winston.info('App loaded');
    initStorage();
    initChain();
});

function initStorage() {
    dropboxClient.authenticate()
        .then(() => {
            winston.log('info', 'Dropbox authenticated');
            sendRendererEvent('set-storage-status', 'ok', 'Authenticated');
        })
        .catch((err) => {
            winston.error(err);
            sendRendererEvent('set-storage-status', 'error', 'Could not authenticate Dropbox account');
        });
}

function initChain() {
    startEthereum().then(() => {
        winston.info('Ethereum started (contracts deployed)');
        sendRendererEvent('status-messages', 'Ethereum started');
        sendRendererEvent('set-ethereum-status', 'ok', 'Ethereum chain connected, contracts deployed.');
    }).catch((err) => {
        winston.error(err);
        sendRendererEvent('set-ethereum-status', 'error', 'Chain is not properly connected');
    });
}


/** Files */

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
    setStatusMessage(`Uploading ${file.name}`);
    event.sender.send('file-upload-started-async', file);

    const willBeEncrypted = true;

    if (willBeEncrypted) {
        encryptAndUploadFileToDropbox(file.path)
            .then((fileData) => {
                winston.info(`Finished uploading ${fileData.fileName}`);
                setStatusMessage(`Finished uploading. Now inserting hash to chain...`);
                event.sender.send('file-upload-finished-async', file);
                // winston.debug('File info: ', JSON.stringify(fileData));

                return uploadLocalFileMetaDataToEth(fileData);
            })
            .then(() => {
                winston.info(`File ${file.name} successfully uploaded to Eth`);
                setStatusMessage(`File metadata successfully added to chain`);
                return getFilesFromDropboxAndCheckStatus(event);
            });

    } else {
        // upload without encyption. THIS WILL BE DONE LATER, RIGHT NOW USER CANNOT CHOOSE
    }
});

ipcMain.on('delete-file-async', (event, file) => {
    dropboxClient.deleteFile(file.path_display)
        .then(() => {
            winston.debug(`File ${file.name} deleted from ${file.path_display}`);
            setStatusMessage(`File ${file.name} deleted`);
            return getFilesFromDropboxAndCheckStatus(event);
        }).catch((error) => {
        winston.error(`Error deleting file from Dropbox: ${error}`);
    });
});

ipcMain.on('download-file-async', (event, file) => {
    winston.debug(`Downloading file: ${JSON.stringify(file)}`);
    setStatusMessage(`Downloading file...`);

    return getFileFromDropboxToFileDir(file.ethInfo).then((fullName) => {
        winston.info(`File downloaded to ${fullName}`);
        setStatusMessage(`Downloading file...`);

        event.sender.send('set-file-local-status', file, 'local');
    });
});

ipcMain.on('download-all-files-async', (event, file) => {
    return synchronizeAllFiles().then(() => {
        winston.info('All files downloaded');
        setStatusMessage('All files downloaded');
    })
});

ipcMain.on('get-files-from-dropbox-async', (event) => {
    getFilesFromDropboxAndCheckStatus(event);
});


function getFilesFromDropbox(event) {
    event.sender.send('set-dropbox-loading-status-async', true);
    setStatusMessage('Getting file list from Dropbox');

    return dropboxClient.listFolder()
        .then((result) => {
            let files = Array.from(result);
            winston.debug(`Found ${files.length} file(s) from dropbox app folder`);

            event.sender.send('set-dropbox-loading-status-async', false);
            event.sender.send('set-dropbox-files-async', files);
            setStatusMessage('Getting file list from Dropbox... Done.');
            return files;
        })
        .catch((reject) => {
            winston.debug(`Getting list of files from Dropbox failed. Reason: ${reject.error}`);
            setStatusMessage('Getting file list from Dropbox... Failed.');
        });
}

function setFilesLocalUnencryptedPaths(event, files) {
    return new Promise((resolve, reject) => {
        let filePaths = [];
        _.forEach(files, (file) => {
            getUnencryptedFilePathInAppFolder(file.name).then((localFilePath) => {
                event.sender.send('set-file-local-unencrypted-path', file, localFilePath);
                filePaths.push({
                    name: file.name,
                    localPath: localFilePath
                });
            })
        });
        resolve(filePaths);
    });
}

function checkFilesIntegrity(event) {
    getFileHashesFromEth().then((hashes) => {
        setStatusMessage('Verifying files...');

        _.forEach(hashes, (hash) => {

            winston.debug(`Checking hash ${hash}`);
            downloadMetaDataFromEthWithHash(hash).then((metaData) => {
                // metadata: link, name

                metaData.filePath = getFullPathForFileName(metaData.name);
                // metadata: link, name, filePath

                prepareFileDataForFiles(metaData.filePath).then((fileData) => {
                    // filedata: filename, filehash

                    winston.debug(`Comparing hashes for ${fileData.fileName}: ${fileData.fileHash} vs ${hash}`);

                    const fileStatus = (fileData.fileHash === hash ? 'protected' : 'faulty');
                    winston.debug(`File ${fileData.fileName} status: ${fileStatus}`);
                    metaData.hash = hash;
                    event.sender.send('set-file-protection-status', metaData, fileStatus);
                })
            });
        });
    })
}

function getFilesFromDropboxAndCheckStatus(event) {
    return getFilesFromDropbox(event)
        .then((files) => {
            return setFilesLocalUnencryptedPaths(event, files);
        }).then(() => {
        checkFilesIntegrity(event);
    });
}


/** Logging */

ipcMain.on('log-async', (event, ...args) => {
    if (args.length === 1) {
        winston.debug(args[0]);
    } else if (args.length > 1) {
        const level = args[0],
            msg = _.drop(args, 1);
        winston.log(level, _.join(msg, ' '));
    }
});
