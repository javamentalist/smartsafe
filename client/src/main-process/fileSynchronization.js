import Promise from 'bluebird';
import fs from 'fs';
import https from 'https';
import path from 'path';
import { readDir, createHashForFile, checkExistence, isFileEncrypted } from '../utils/fileUtils.js';
import * as cryptoUtils from '../utils/cryptoUtils.js';
import winston from '../utils/log';
const readFile = Promise.promisify(require("fs").readFile);


const CONTRACTS_FILE = '/../../contracts.json';
const HOME_DIR = process.env.HOME || process.env.USERPROFILE;
const FILE_DIR = replaceBwdWithFwdSlash(`${HOME_DIR}/SmartsafeClient`);
const KEYS_DIR = `${HOME_DIR}/.smartsafeKeys`;
const PUBLIC_KEY = `${KEYS_DIR}/rsa.pub`;
const PRIVATE_KEY = `${KEYS_DIR}/rsa`;
const SYMMETRIC_KEY = 'fkdhf209uc5v5mnr5e3e2';

const IGNORED_FILES = ['.DS_Store', 'temp'];

if (!fs.existsSync(FILE_DIR)) {
    fs.mkdirSync(FILE_DIR);
}

import { dropboxClient, ethereumClient } from '../main.js';
// NOTE exports at the very end of file

function logDebug(err) {
    winston.log('debug', err);
}

function logError(err) {
    winston.log('error', err);
}


function synchronizeUserFiles(filesHashesFromEth, localFilesFullPaths) {
    /// Upload local files

    const preparedFileDataForFiles = Promise.resolve(localFilesFullPaths).then(localFilesFullPaths => {
        return Promise.all(localFilesFullPaths.map(localFileFullPath => {
            return prepareFileDataForFiles(localFileFullPath);
        }));
    });

    // Promise.join(preparedFileDataForFiles, filesHashesFromEth, (localFilesData, filesHashesFromEth) => {
    //     return Promise.all(localFilesData.map(localFileData => {
    //         const localFileName = localFileData.fileName;
    //         const localFileHash = localFileData.fileInfo;
    //         if (!fileMetaDataUploadedToEth(localFileHash, filesHashesFromEth)) {
    //             return uploadLocalFilesToDropbox(localFileName, localFileHash)
    //         }
    //         return Promise.resolve();

    //     }));
    // }).then(filesDataToEth => {
    //     return Promise.all(filesDataToEth.map(fileDataToEth => {
    //         if (fileDataToEth == null) return Promise.resolve();
    //         return uploadLocalFileMetaDataToEth(fileDataToEth)
    //     }));
    // }).catch(err => {
    //     logError(err);
    // });

    /// Download missing local files
    Promise.join(preparedFileDataForFiles, filesHashesFromEth, (localFilesData, filesHashesFromEth) => {
        return Promise.all(filesHashesFromEth.map(filesHash => {
            return getFilesOnEthNotLocallyPresent(localFilesData, filesHash);
        }));
    }).then(filesEthMetaData => {
        return Promise.all(filesEthMetaData.map(fileEthMetaData => {
            if (fileEthMetaData == null) return Promise.resolve();
            return Promise.resolve(getFileFromDropboxToFileDir(fileEthMetaData));
        }));
    }).catch(err => {
        logError(err);
    });

    /// Download missing local files


    // Promise.join(preparedFileDataForFiles, filesHashesFromEth, (localFilesData, filesHashesFromEth31) => {
    //     return Promise.all(filesHashesFromEth31.map(filesHash => {
    //         return getFilesOnEthNotLocallyPresent(localFilesData, filesHash);
    //     }))
    // }).then(filesEthMetaData => {
    //     return Promise.all(filesEthMetaData.map(fileEthMetaData => {
    //         if (fileEthMetaData == null) return Promise.resolve();
    //         return Promise.resolve(getFileFromDropboxToFileDir(fileEthMetaData));
    //     }))
    // }).catch(err => {
    //     logError(err);
    // })

}

function getFilesOnEthNotLocallyPresent(localFilesData, fileEthHash) {
    return new Promise((resolve, reject) => {
        for (let localFileNo = 0; localFileNo < localFilesData.length; localFileNo++) {
            const localFileData = localFilesData[localFileNo];
            const localFileHash = localFileData.fileInfo;
            if (localFileHash === fileEthHash) {
                return resolve();
            }
        }
        downloadMetaDataFromEthWithHash(fileEthHash).then(fileMetaDataFromEth => {
            return resolve(fileMetaDataFromEth);
        });
    });
}

function downloadMetaDataFromEthWithHash(fileHash) {
    return new Promise((resolve, reject) => {
        (ethereumClient.findFileMetaDataFromEthChain(fileHash)).then(fileMetaDataFromEth => {
            return resolve(fileMetaDataFromEth);
        });
    });
}

function fileMetaDataUploadedToEth(hash, ethHashes) {
    return ethHashes.indexOf(hash) !== -1;
}

function prepareFileDataForFiles(filePath) {
    return new Promise((resolve, reject) => {
        const fileName = getFileNameFromFilePath(filePath);
        getHashForFile(filePath).then(fileHash => {
            return resolve({
                fileName: fileName,
                fileHash: fileHash
            })
        });
    });
}

function getHashForFile(filePath) {
    return new Promise((resolve, reject) => {
        const readStream = fs.createReadStream(filePath);
        readStream.on('error', (error) => {
            //return
            reject(error);
        });
        return resolve(createHashForFile(readStream));
    });
}


function getFullPathForFileName(fileName) {
    return `${FILE_DIR}/${fileName}`;
}

function replaceBwdWithFwdSlash(filePath) {
    return filePath.split("\\").join("/");
}
function getFileNameFromFilePath(filePath) {
    const filePathReplaced = replaceBwdWithFwdSlash(filePath);
    return filePathReplaced.substring(FILE_DIR.length + 1, filePathReplaced.length);
}

function uploadLocalFilesToDropbox(fileName, fileHash) {
    return uploadFileToDropbox(`${FILE_DIR}/${fileName}`, fileHash);
}

function uploadBrowsedFileToDropbox(filePath, fileHash) {
    return uploadFileToDropbox(filePath, fileHash);
}

function uploadFileToDropbox(filePath, fileHash) {
    return new Promise((resolve, reject) => {
        logDebug(`Uploading ${filePath}`);
        const fileName = path.basename(filePath);
        Promise.resolve(dropboxClient.upload(filePath, `/${fileName}`))
            .then(responseJson => {
                return resolve({
                    fileName: fileName,
                    fileHash: fileHash,
                    fileSharedLink: responseJson.url
                });
            }).catch(err => {
            logError(err);
            return reject(err);
        });
    });
}

// toDo: ??? delete encrypted file
function uploadEncryptedLocalFilesToDropbox(fileName) {
    return cryptoUtils.generatePassword().then(function(password) {
        saveEncryptedPasswordToDatabase(password);
        return cryptoUtils.encryptWithSymmetricKey(getFullPathForFileName(fileName), SYMMETRIC_KEY);
    }).then(function(encryptedFileName) {
        const encryptedFileLocalName = getFileNameFromFilePath(encryptedFileName);
        return new Promise([encryptedFileLocalName, getHashForFile(encryptedFileName)]);
    }).then(function([encryptedFileName, encryptedFileHash]) {
        return uploadLocalFilesToDropbox(encryptedFileName, encryptedFileHash);
    }).catch(function(err) {
        logError(err);
    });
}

function encryptAndUploadFileToDropbox(filePath) {
    return cryptoUtils.generatePassword().then(function(password) {
        saveEncryptedPasswordToDatabase(password);
        return cryptoUtils.encryptWithSymmetricKey(filePath, SYMMETRIC_KEY);
    }).then(function(encryptedFilePath) {
        return Promise.all([encryptedFilePath, getHashForFile(encryptedFilePath)]);
    }).then(function([encryptedFilePath, encryptedFileHash]) {
        return uploadBrowsedFileToDropbox(encryptedFilePath, encryptedFileHash);
    }).catch(function(err) {
        logError(err);
    });
}

function saveEncryptedPasswordToDatabase(password) {
    return encryptWithUserPublicKey(password);
// save to database
}

function encryptWithUserPublicKey(text) {
    return ensureKeyPair().then(function() {
        return Promise.resolve(fs.readFileSync(PUBLIC_KEY));
    }).then(function(key) {
        return cryptoUtils.encryptWithPublicKey(text, key);
    });
}

function decryptWithUserPrivateKey(text) {
    return ensureKeyPair().then(function() {
        return Promise.resolve(fs.readFileSync(PRIVATE_KEY));
    }).then(function(key) {
        return cryptoUtils.decryptWithPrivateKey(text, key);
    });
}

function ensureKeyPair() {
    return checkExistence(KEYS_DIR).catch(function() {
        return Promise.resolve(fs.mkdirSync(KEYS_DIR));
    }).then(function() {
        return Promise.all([checkExistence(PUBLIC_KEY), checkExistence(PRIVATE_KEY)]);
    }).catch(function(err) {
        return createKeyPair();
    });
}

function createKeyPair() {
    return cryptoUtils.generateRsaKeyPair().then(function(keys) {
        return Promise.all([fs.writeFileSync(PUBLIC_KEY, keys.public), fs.writeFileSync(PRIVATE_KEY, keys.private)]);
    }).catch(function(err) {
        logError(err);
    });
}

function uploadLocalFileMetaDataToEth(fileData) {
    return new Promise((resolve, reject) => {
        const fileName = fileData.fileName;
        const fileHash = fileData.fileHash;
        logDebug("fn" + fileName);
        encryptWithUserPublicKey(fileData.fileSharedLink).then(fileDropboxSharedLinkEncrypted => {
            logDebug("fileDropboxSharedLinkEncrypted" + fileDropboxSharedLinkEncrypted);
            return ethereumClient.addFileMetaData(fileHash, fileDropboxSharedLinkEncrypted, fileName);
        }).then(() => {
            return resolve();
        });
    });
}

function getFileFromDropboxToFileDir(fileMetaDataFromEth) {
    return Promise.resolve(fileMetaDataFromEth.link).then(encryptedDownloadUrl => {
        return decryptWithUserPrivateKey(encryptedDownloadUrl);
    }).then(function(dropboxLink) {
        return downloadFileFromDropbox(dropboxLink);
    }).then(function(fileName) {
        return decryptFileIfEncrypted(fileName);
    });
}

// TODO: if the file was in a dir, put it into a dir
function downloadFileFromDropbox(dropboxLink) {
    return new Promise((resolve, reject) => {
        const downloadUrl = dropboxClient.getDirectDownloadLink(dropboxLink);
        logError(downloadUrl);
        const fileName = dropboxClient.getFileNameFromUrl(downloadUrl);
        const fileStream = fs.createWriteStream(`${FILE_DIR}/${fileName}`);

        https.get(downloadUrl, (fileToDownload) => {
            fileToDownload.pipe(fileStream);
            return resolve(fileName);
        });
    });
}

function decryptFileIfEncrypted(fileName) {
    const fullName = `${FILE_DIR}/${fileName}`;
    if (isFileEncrypted(fileName)) {
        return cryptoUtils.decryptWithSymmetricKey(fullName, SYMMETRIC_KEY);
    } else {
        return Promise.resolve(fullName);
    }
}

function getFileMetadataFromEth() {
    ethereumClient.getUserFilesHashes().then((userFileHashes) => {
        winston.debug('Got file info from Eth');
        winston.debug(JSON.stringify(userFileHashes));
    });
}

// set the watcher for contracts.js
// ethereumClient.loadContracts().then((address) => {
//
//     console.log('contracts loaded')
// }).catch((e) => {
//     console.log(e)
// });

// commented out because it should no be run when this file is imported
// folder synchronization
// readFile(__dirname + CONTRACTS_FILE, 'utf8').then(contracts => {
// +        return JSON.parse(contracts)
// +    }).then(parsedContracts => {
// +        return ethereumClient.deployParsedContract(parsedContracts)
// +    }).then(() => {
// +        return dropboxClient.authenticate()
// +    }).then(() => {
//         return readDir(FILE_DIR)
//     }).then(files => {
//     const userfileslocations = files.filter((file) => {
//         return IGNORED_FILES.indexof(file) === -1
//     });

//     return ethereumClient.getUserFilesHashes()
//         .then(fileshashesfrometh => {
//             return synchronizeUserFiles(fileshashesfrometh, userfileslocations)
//         })
// }).catch(err => logError(err));

//new file upload
//dropboxClient.authenticate().then(() => {
//    ethereumClient.watchFileChanges(onNewFile)
//});


// function onNewFile({url, hash}) {
//     // Replace dl=0 with dl=1 to get direct downloadable link
//     const dlUrl = DropboxClient.getDirectDownloadLink(url);
//     const fileName = DropboxClient.getFileNameFromUrl(dlUrl);
//     const file = fs.createWriteStream(`${TEMP_DIR}/${fileName}`);
//     https.get(dlUrl, (res) => {
//         res.pipe(file);
//         file.on('finish', () => {
//             if (fileName) {
//                 dropboxClient.upload(`${TEMP_DIR}/${fileName}`, `/${fileName}`)
//                     .then((data) => {
//                         ethereumClient.addAPeer(hash, data.url)
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



function synchronizeFolders() {
    readFile(__dirname + CONTRACTS_FILE, 'utf8').then(contracts => {
        return JSON.parse(contracts);
    }).then(parsedContracts => {
        return ethereumClient.deployParsedContract(parsedContracts);
    }).then(() => {
        return dropboxClient.authenticate();
    }).then(() => {
        ethereumClient.watchFileChanges(onNewFile);
        return readDir(FILE_DIR);
    }).then(files => {
        const userFilesLocations = files.filter((file) => {
            return IGNORED_FILES.indexOf(file) === -1;
        });

        return ethereumClient.getUserFilesHashes()
            .then(filesHashesFromEth => {
                return synchronizeUserFiles(filesHashesFromEth, userFilesLocations);
            });
    }).catch(err => logError(err));
}

function onNewFile({url, hash}) {
    logError(url + " url&hash " + hash)
// const dlUrl = DropboxClient.getDirectDownloadLink(url);
// const fileName = DropboxClient.getFileNameFromUrl(dlUrl);
// const file = fs.createWriteStream(`${TEMP_DIR}/${fileName}`);
// https.get(dlUrl, (res) => {
//     res.pipe(file);
//     file.on('finish', () => {
//         if (fileName) {
//             dropboxClient.upload(`${TEMP_DIR}/${fileName}`, `/${fileName}`)
//                 .then((data) => {
//                     ethereumClient.addAPeer(hash, data.url)
//                         .then(() => {
//                             ethereumClient.getPeer(hash)
//                             .then((peerUrl) => {
//                                 console.log('peerUrl', peerUrl)
//                         })
//                     }).catch((e) => {
//                         console.log(e)
//                     })
//                 })
//         }
//     })
// }).on('error', (err) => console.log(err))
}

// Do it here for now. Ideally this should be in main.js? Or somewhere more logical where it is easier to spot
synchronizeFolders();


export { uploadLocalFilesToDropbox, uploadEncryptedLocalFilesToDropbox, encryptAndUploadFileToDropbox, synchronizeUserFiles, synchronizeFolders, getFileMetadataFromEth, uploadLocalFileMetaDataToEth };
