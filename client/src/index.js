import Promise from 'bluebird'
import DropboxClient from './api/dropboxApi.js'
import authData from '../dropbox-auth.json'
import fs from 'fs'
import _ from 'lodash'
import https from 'https'
import {readDir, createHash} from './utils/fileUtils.js'
import EthereumClient from './api/ethereum/ethereumApi.js'
import crypto from 'crypto'
import contractAddresses from '../contracts.json'
import winston from './utils/log';
import {writeFile} from "fs";
import cloneDeep from 'clone-deep';

const HOME_DIR = process.env.HOME || process.env.USERPROFILE;
const FILE_DIR = `${HOME_DIR}/SmartsafeClient`;
const TEMP_DIR = `${HOME_DIR}/SmartsafeClient`;
const IGNORED_FILES = ['.DS_Store', 'temp'];

const dropboxClient = new DropboxClient(authData.key, authData.secret);
const ethereumClient = new EthereumClient(contractAddresses);

function logDebug(err) {
    winston.log('debug', err)
}

function logError(err) {
    winston.log('error', err)
}

function synchronizeUserFiles(filesHashes, userFilesLocations) {
    const userFiles = prepareUserFilesReading(userFilesLocations);
    const filesDataForUploadToDropbox = prepareDropboxUploadDataForFiles(userFiles);
    const filesDataForUploadToDropbox_deep_copy = cloneDeep(filesDataForUploadToDropbox);
    uploadFileData(filesDataForUploadToDropbox, filesHashes);
    downloadMissingSharedFiles(filesDataForUploadToDropbox_deep_copy, filesHashes);
}

function prepareUserFilesReading(userFilesLocations) {
    try {
        return userFilesLocations.map(filePath => {
            const readStream = fs.createReadStream(`${FILE_DIR}/${filePath}`);
            return new Promise((resolve, reject) => {
                resolve({filePath: filePath, fileInfo: readStream})
            })
        })
    } catch (err) {
        logError(err);
        return []
    }
}

function prepareDropboxUploadDataForFiles(userFiles) {
    try {
        return userFiles.map(userFile => {
            return new Promise((resolve, reject) => {
                userFile
                    .then(fileData => {
                        let filePath = fileData.filePath;
                        let fileInfo = fileData.fileInfo;
                        const fileHash = createHash(fileInfo);
                        resolve({filePath: filePath, fileInfo: fileHash});
                    })
                    .catch(err => {
                        logError(err);
                        reject(err)
                    });
            })
        })
    } catch (err) {
        logError(err);
        return []
    }
}

function uploadFileData(userFilesDataForUploadToDropbox, filesHashes) {
    const userFilesDataForUploadToEth
        = prepareFileUploadToDropbox(userFilesDataForUploadToDropbox, filesHashes);
    const preparedFileDataForUploadToEth = prepareFileDataUploadToEth(userFilesDataForUploadToEth, filesHashes);
    uploadFileDataToEth(preparedFileDataForUploadToEth);
}

function fileHasBeenHashed(fileHash, filesHashes) {
    return filesHashes.indexOf(fileHash) !== -1;

}

function prepareFileUploadToDropbox(userFilesDataForUploadToDropbox, filesHashes) {
    try {
        return userFilesDataForUploadToDropbox.map(userFileDataForDropbox => {
            return new Promise((resolve, reject) => {
                userFileDataForDropbox
                    .then(fileData => {
                        let filePath = fileData.filePath;
                        let fileDropboxUploadHash = fileData.fileInfo;

                        if (fileHasBeenHashed(fileDropboxUploadHash, filesHashes)) {
                            const sharedLink = dropboxClient.upload(`${FILE_DIR}/${filePath}`, `/${filePath}`);
                            resolve({
                                filePath: filePath,
                                fileInfo: sharedLink
                            })
                        }
                    }).catch(err => {
                    logError(err);
                        reject(err)
                    })
                })
        })
    } catch (err) {
        logError(err);
        return []
    }
}

function prepareFileDataUploadToEth(userFilesDataForUploadToEth, filesHashes) {
    try {
        return userFilesDataForUploadToEth.map(userFileDataForEth => {
            return new Promise((resolve, reject) => {
                userFileDataForEth
                    .then(fileData => {
                        let filePath = fileData.filePath;
                        let fileDropboxSharedLinkJSON = fileData.fileInfo;
                            if (fileHasBeenHashed(fileDropboxSharedLinkJSON, filesHashes)) {
                                resolve({
                                    filePath: filePath,
                                    fileInfo: ethereumClient
                                        .addFile(fileDropboxSharedLinkJSON, fileDropboxSharedLinkJSON.url, filePath)
                                })
                            } else {
                                resolve()
                            }
                    }).catch(err => {
                        logError(err);
                        reject(err)
                    })
            })
        })
    } catch (err) {
        logError(err);
        return []
    }
}

function uploadFileDataToEth(preparedFilesDataForUploadToEth) {
    try {
        preparedFilesDataForUploadToEth.map(preparedFileDataForEth => {
            preparedFileDataForEth
                .catch(err => {
                    logError(err);
                    Promise.reject(err)
            });
        });
    } catch (err) {
        logError(err);
        return []
    }
}

function downloadMissingSharedFiles(userFilesDataForUploadToDropbox, filesHashes) {
    try {
        userFilesDataForUploadToDropbox.map(userFileDataForDropbox => {
            userFileDataForDropbox
                .then(fileData => {
                    let fileDropboxUploadHash = fileData.fileInfo;
                    if (!_.find(filesHashes, fileDropboxUploadHash)) {
                        ethereumClient.findFileDropboxDataFromEthChain(fileDropboxUploadHash)
                            .then(file => {
                                downloadFileFromDropbox(file);
                        })
                    }
                }).catch(err => {
                    logError(err);
                    Promise.reject(err)
                });
        });
    } catch (err) {
        logError(err);
        return []
    }
}

function downloadFileFromDropbox(file) {
    const downloadUrl = DropboxClient.getDirectDownloadLink(file.link);
    const filePath = DropboxClient.getFilePathFromUrl(downloadUrl);
    const fileStream = fs.createWriteStream(`${FILE_DIR}/${filePath}`);
    https.get(downloadUrl, fileToDownload => {
        fileToDownload.pipe(fileStream)
    })
}

// folder synchronization
dropboxClient.authenticate()
    .then(() => {
        return readDir(FILE_DIR)
    })
    .then(files => {
        const userFiles = files.filter((file) => {
            return IGNORED_FILES.indexOf(file) === -1
        });

        ethereumClient.getUserFiles()
            .then(hashes => synchronizeUserFiles(hashes, userFiles))
    }).catch(e => logDebug(e));

// new file upload
// dropboxClient.authenticate().then(() => {
//     ethereumClient.watchFileChanges(onNewFile)
// });
//
// ethereumClient.loadContracts().then((address) => {
//     writeFile('contracts.json', JSON.stringify({file: address}), (err) => {
//         if (err) console.log(err)
//     });
//     console.log('contracts loaded')
// }).catch((e) => {
//     console.log(e)
// });
//
// function onNewFile({url, hash}) {
//     // Replace dl=0 with dl=1 to get direct downloadable link
//     const dlUrl = DropboxClient.getDirectDownloadLink(url);
//     const filePath = DropboxClient.getFilePathFromUrl(dlUrl);
//     const file = fs.createWriteStream(`${TEMP_DIR}/${filePath}`);
//     https.get(dlUrl, (res) => {
//         res.pipe(file);
//         file.on('finish', () => {
//             if (filePath) {
//                 dropboxClient.upload(`${TEMP_DIR}/${filePath}`, `/${filePath}`)
//                     .then((data) => {
//                         ethereumClient.addPeer(hash, data.url)
//                             .then(() => {
//                                 ethereumClient.getPeer(hash)
//                                 .then((peerUrl) => {
//                                     console.log('peerUrl', peerUrl)
//                             })
//                         }).catch((e) => {
//                             console.log(e)
//                         })
//                     })
//             }
//         })
//     }).on('error', (err) => console.log(err))
// }

// recursively list files user's Dropbox folder
// dropboxClient.authenticate()
//     .then(() => {
//         dropboxClient.listFolder()
//             .then(result => {
//                 let files = Array.from(result);
//                 if (files.length !== 0) {
//                     files.forEach(res => {
//                         logDebug(res.name)
//                     });
//                 } else {
//                     logError("No files in user's folder")
//                 }
//             });
//     }).catch(err => logError(err));
